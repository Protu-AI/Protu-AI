from fastapi import FastAPI, APIRouter, UploadFile, File, status, Request
from fastapi.responses import JSONResponse
import aiofiles
import os

from stores.llm import LLMFactoryProvider
from stores.vectordb import VectorDBFactoryProvider

from controllers import DataController, BaseController, NLPController, DBController

from controllers.Enums import ResponseSignal

import logging
from .schemas.data import ProcessRequest
data_router = APIRouter(
    prefix="/protu/ai/data"
)

logger = logging.getLogger("uvicorn.error")


@data_router.post("/process")
async def process_end(request: Request, process_request: ProcessRequest):
    chat_id, is_attached = process_request.chat_id, process_request.is_attached

    nlp_controller = NLPController(
        vectordb_client=request.app.vectordb_client,
        generation_model=request.app.generation_model,
        embedding_model=request.app.embedding_model,
    )

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
