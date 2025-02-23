from typing import List
import json
from stores.llm.LLMEnums import DocumentTypeEnums
from .BaseController import BaseController
from .DBController import DBController
from .ProcessController import ProcessController
from stores.llm import LLMFactoryProvider
from stores.vectordb import VectorDBFactoryProvider

import os
import Prompt

from langchain_groq import ChatGroq


class NLPController(BaseController):

    def __init__(self, vectordb_client: VectorDBFactoryProvider,
                 generation_model: LLMFactoryProvider,
                 embedding_model: LLMFactoryProvider):
        super().__init__()

        self.vectordb_client = vectordb_client
        self.generation_model = generation_model
        self.embedding_model = embedding_model

        os.environ['GROQ_API_KEY'] = self.app_settings.GROQ_API_KEY

    def get_file_and_store_into_vectordb(self, chat_id: str):
        db_controller = DBController()

        file_path = db_controller.get_file_path(chat_id=chat_id)

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

        vectors = [
            self.embedding_model.get_embedding(
                text=text, document_type=DocumentTypeEnums.DOCUMENT.value)
            for text in texts
        ]
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

        db_controller = DBController()

        all_messages = db_controller.get_all_messages_by_chat_id(
            chat_id=chat_id)

        combined_messages = "Summarize the following conversation between user and ai\n"

        last_prompt = ""

        for idx, (sender, content) in enumerate(all_messages):
            if idx == len(all_messages) - 1:
                last_prompt = content
            else:
                combined_messages += f"{sender}: {content}\n"

        llm = ChatGroq(
            model_name="gemma2-9b-it",
            temperature=0
        )

        summary = llm.invoke(combined_messages)

        if len(all_messages) == 1:
            return '', last_prompt
        return summary.content, last_prompt

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

        system_prompt = Prompt.system_prompt

        if retrieved_documents:
            documents_prompt = '\n'.join(
                [
                    Prompt.document_prompt.substitute(
                        doc_num=idx,
                        doc_content=self.generation_model.process_text(doc.text),
                        doc_metadata=doc.metadata
                    )
                    for idx, doc in enumerate(retrieved_documents, 1)
                ]
            )

        memory_prompt = Prompt.memory_prompt.substitute(
            conversation_history=memory_summary
        )

        footer_prompt = Prompt.footer_prompt.substitute(
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
