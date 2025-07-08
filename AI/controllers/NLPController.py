from typing import List
import json
from stores.llm.LLMEnums import DocumentTypeEnums
from .BaseController import BaseController
from .DBController import DBController
from .ProcessController import ProcessController
from stores.llm import LLMFactoryProvider
from stores.vectordb import VectorDBFactoryProvider

from models.QuizModels import FeedbackInput
import os
import prompts

from groq import Groq

from time import sleep

from logging import getLogger

from types import SimpleNamespace


class NLPController(BaseController):

    def __init__(self, vectordb_client: VectorDBFactoryProvider,
                 generation_model: LLMFactoryProvider,
                 embedding_model: LLMFactoryProvider):
        super().__init__()

        self.vectordb_client = vectordb_client
        self.generation_model = generation_model
        self.embedding_model = embedding_model

        self.logger = getLogger('uvicorn')

    def get_file_and_store_into_vectordb(self, chat_id: str):
        db_controller = DBController(
            db_name=self.app_settings.DB_NAME,
            db_user=self.app_settings.DB_USER,
            db_password=self.app_settings.DB_PASSWORD,
            db_host=self.app_settings.DB_HOST,
            db_port=self.app_settings.DB_PORT
        )

        file_path = db_controller.get_file_path(chat_id=chat_id)

        print(f"File path: {file_path}")

        process_controller = ProcessController()

        file_content = process_controller.get_file_content(file_path=file_path)

        chunks = process_controller.get_file_chunks(file_content=file_content)

        result = self.index_into_vector_db(chat_id=chat_id, chunks=chunks)

        return result

    def create_collection_name(self, chat_id: str):
        return f'collection_{chat_id}'.strip()

    def reset_vector_db_collection(self, chat_id: str):
        collection_name = self.create_collection_name(chat_id=chat_id)
        return self.vectordb_client.delete_collection(collection_name=collection_name)

    def get_vector_db_info(self, chat_id: str):
        collection_name = self.create_collection_name(chat_id=chat_id)
        collection_info = self.vectordb_client.get_collection_info(
            collection_name=collection_name)

        return json.loads(
            json.dumps(collection_info, default=lambda x: x.__dict__)
        )

    def index_into_vector_db(self, chat_id: str, chunks: List,
                             chunk_ids: List[int] = None,
                             do_reset: bool = False):

        collection_name = self.create_collection_name(chat_id=chat_id)

        texts = [c.page_content for c in chunks]
        metadata = [c.metadata['source'] for c in chunks]

        vectors = []
        for cnt, text in enumerate(texts, 1):
            if cnt % 1500 == 0:
                sleep(60)
            vectors.append(
                self.embedding_model.get_embedding(
                    text=text, document_type=DocumentTypeEnums.DOCUMENT.value)
            )

        chunk_ids = chunk_ids if chunk_ids else list(range(len(chunks)))

        _ = self.vectordb_client.create_collection(
            collection_name=collection_name,
            embedding_dim=self.embedding_model.embedding_size,
            do_reset=do_reset
        )

        _ = self.vectordb_client.insert_batch(
            collection_name=collection_name,
            vectors=vectors,
            texts=texts,
            metadata=metadata,
            vector_ids=chunk_ids
        )

        return True

    def search_vector_db_collection(self, chat_id: str, text: str, limit: int = 10):

        collection_name = self.create_collection_name(chat_id=chat_id)

        vector = self.embedding_model.get_embedding(
            text=text, document_type=DocumentTypeEnums.QUERY.value)

        if not vector or len(vector) == 0:
            return False

        results = self.vectordb_client.search_by_vector(
            vector=vector,
            collection_name=collection_name,
            top_k=limit
        )

        if not results:
            return False

        return results

    def get_memory_summary_and_query(self, chat_id: str):

        db_controller = DBController(
            db_name=self.app_settings.DB_NAME,
            db_user=self.app_settings.DB_USER,
            db_password=self.app_settings.DB_PASSWORD,
            db_host=self.app_settings.DB_HOST,
            db_port=self.app_settings.DB_PORT
        )

        all_messages = db_controller.get_all_messages_by_chat_id(
            chat_id=chat_id)

        print(f"All messages: {all_messages}")

        combined_messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant tasked with summarizing conversations. Provide a concise summary of the following message history."
            },
            {
                'role': 'user',
                'content': 'Here is the conversation history I would like to summarize:\n' +
                '\n'.join([f'{sender}: {content}' for sender,
                          content in all_messages[:-1]])
            }
        ]

        last_prompt = all_messages[-1][1]

        if len(all_messages) == 1:
            return '', last_prompt

        llm_client = Groq(
            api_key=self.app_settings.GROQ_API_KEY,
        )

        message_summary = llm_client.chat.completions.create(
            model="gemma2-9b-it",
            temperature=0,
            messages=combined_messages
        )
        if message_summary and len(message_summary.choices) > 0 and message_summary.choices[0].message and message_summary.choices[0].message.content:
            return message_summary.choices[0].message.content, last_prompt

    def answer_rag_question(self, chat_id: str, limit: int = 10):

        full_prompt, chat_history, answer, documents_prompt = None, None, None, ''

        memory_summary, query = self.get_memory_summary_and_query(
            chat_id=chat_id)

        collection_name = self.create_collection_name(chat_id=chat_id)

        _ = self.vectordb_client.create_collection(
            collection_name=collection_name,
            embedding_dim=self.embedding_model.embedding_size
        )

        retrieved_documents = self.search_vector_db_collection(
            chat_id=chat_id,
            text=query,
            limit=limit
        )

        # if not retrieved_documents or len(retrieved_documents) == 0:
        #     return full_prompt, chat_history, answer

        system_prompt = prompts.system_prompt

        if retrieved_documents:
            documents_prompt = '\n'.join(
                [
                    prompts.document_prompt.substitute(
                        doc_num=idx,
                        doc_content=self.generation_model.process_text(
                            doc.text),
                        doc_metadata=doc.metadata
                    )
                    for idx, doc in enumerate(retrieved_documents, 1)
                ]
            )

        memory_prompt = prompts.memory_prompt.substitute(
            conversation_history=memory_summary
        )

        footer_prompt = prompts.footer_prompt.substitute(
            query=query
        )

        chat_history = [
            self.generation_model.construct_prompt(
                prompt=system_prompt,
                role=self.generation_model.enums.SYSTEM.value
            )
        ]

        full_prompt = '\n'.join(
            [
                documents_prompt,
                memory_prompt,
                footer_prompt
            ]
        )

        answer = self.generation_model.generate_text(
            prompt=full_prompt,
            chat_history=chat_history,
        )

        return full_prompt, chat_history, answer

    def index_courses_into_vectordb(self, chat_id: str = 'courses'):

        db_controller = DBController(
            db_name=self.app_settings.COURSES_DB_NAME,
            db_user=self.app_settings.COURSES_DB_USER,
            db_password=self.app_settings.COURSES_DB_PASSWORD,
            db_host=self.app_settings.COURSES_DB_HOST,
            db_port=self.app_settings.COURSES_DB_PORT
        )

        all_courses = db_controller.get_all_courses()

        print(f"All courses: {all_courses}")

        if not all_courses or len(all_courses) == 0:
            self.logger.error(
                "Error in getting all courses from the database.")

        chunks = []

        for course_id, course_name, course_description in all_courses:

            page_content = f"Course Name: {course_name}. Description: {course_description}"

            metadata = {
                'source': str(course_id)
            }

            chunk_object = SimpleNamespace(
                page_content=page_content, metadata=metadata
            )

            chunks.append(
                chunk_object
            )

        done = self.index_into_vector_db(
            chat_id=chat_id,
            chunks=chunks,
            do_reset=True
        )

        if not done:
            self.logger.error("Error in indexing courses into vector DB.")
            return False

        self.logger.info("Courses indexed successfully into vector DB.")
        return True

    def get_quiz_feedback(self, inputs: FeedbackInput):

        if not inputs or not inputs.quiz or len(inputs.quiz) == 0:
            return None

        feedback_system_prompt = prompts.feedback_system_prompt

        full_prompt = '\n'.join(
            [
                feedback_system_prompt,
                "",
                json.dumps(inputs.model_dump(), indent=4),
                "",
                "Please provide feedback on the quiz directly without any additional information or context.",
                "Feedback:",

            ]
        )

        feedback = self.generation_model.generate_text(
            prompt=full_prompt,
        )

        if not feedback or len(feedback) == 0:
            getLogger.error("Error in generating quiz feedback")
            return None

        return feedback
