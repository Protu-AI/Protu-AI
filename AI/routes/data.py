from fastapi import FastAPI, APIRouter, UploadFile, File, status, Request
from fastapi.responses import JSONResponse
import aiofiles
import os

from stores.llm import LLMFactoryProvider
from stores.vectordb import VectorDBFactoryProvider

from controllers import DataController, BaseController, NLPController, DBController

from controllers.Enums import ResponseSignal

import logging

from routes.schemas import *

from models import *

data_router = APIRouter(
    prefix="/protu/ai/data"
)

logger = logging.getLogger("uvicorn.error")


@data_router.post("/process")
async def process_end(request: Request, process_request: ProcessRequest):
    chat_id, is_attached = process_request.chat_id, process_request.is_attached

    nlp_controller = request.app.nlp_controller

    if is_attached:
        _ = nlp_controller.get_file_and_store_into_vectordb(chat_id=chat_id)

    full_prompt, chat_history, answer = nlp_controller.answer_rag_question(
        chat_id=chat_id)

    try:
        return JSONResponse(
            content={
                "message": ResponseSignal.LLM_GENERATION_SUCCESS.value,
                # "prompt": full_prompt,
                # "chat_history": chat_history,
                "answer": answer
            }
        )
    except Exception as e:
        logger.log(logging.WARNING, f"Error in trigger_llm_response: {e}")

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ResponseSignal.LLM_GENERATION_FAILED.value
        )


@data_router.post("/chat_title")
async def chat_title_generation(request: Request, chat_messages: ChatTitleGenerationRequst):

    agents_controller = request.app.agents_controller

    app_settings = BaseController().app_settings

    db_controller = db_controller = DBController(
        db_name=app_settings.DB_NAME,
        db_user=app_settings.DB_USER,
        db_password=app_settings.DB_PASSWORD,
        db_host=app_settings.DB_HOST,
        db_port=app_settings.DB_PORT
    )

    all_messages_as_tuples = db_controller.get_all_messages_by_chat_id(
        chat_id=chat_messages.chat_id
    )

    all_messages = [
        f"{sender}: {content}"
        for sender, content in all_messages_as_tuples
    ]

    print(all_messages)

    chat_title = agents_controller.create_chat_title(
        input=ChatTitleGenerationInput(
            chat_messages=all_messages
        )
    )

    if not chat_title:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": ResponseSignal.AGENT_RESPONSE_FAILED.value}
        )

    return JSONResponse(
        content={
            "message": ResponseSignal.AGENT_RESPONSE_SUCCESS.value,
            "chat_title": chat_title
        }
    )
