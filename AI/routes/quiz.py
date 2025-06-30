from fastapi import FastAPI, APIRouter, UploadFile, File, status, Request
from fastapi.responses import JSONResponse

from controllers import AgentsController, NLPController

from models import TagAgentInput, FeedbackInput

from controllers.Enums import ResponseSignal

from .schemas import *

import logging

import json

quiz_router = APIRouter(
    prefix="/protu/ai/data"
)

logger = logging.getLogger("uvicorn.error")


@quiz_router.post("/quiz-tags")
async def create_quiz_tags(request: Request, tags_request: TagAgentInput):

    agents_controller = request.app.agents_controller

    agent_response = agents_controller.create_quiz_tags(tags_request)

    if agent_response is None:
        logger.error("Error in creating quiz tags")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                'signal': ResponseSignal.AGENT_RESPONSE_FAILED.value,
            }
        )

    quiz_tags, message, is_relevant = agent_response[
        'tags'], agent_response['message'], agent_response['is_relevant']

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            'signal': ResponseSignal.AGENT_RESPONSE_SUCCESS.value,
            # 'output': agent_response.raw,
            'tags': quiz_tags,
            'message': message,
            'is_relevant': is_relevant
        }
    )


@quiz_router.post("/quiz-generation")
async def create_quiz(request: Request, quiz_request: QuizAgentInput):
    agents_controller = request.app.agents_controller

    agent_quiz_response = agents_controller.create_quiz(quiz_request)

    if agent_quiz_response is None:
        logger.error("Error in creating quiz")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                'signal': ResponseSignal.AGENT_RESPONSE_FAILED.value,
            }
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            'signal': ResponseSignal.AGENT_RESPONSE_SUCCESS.value,
            'quiz': agent_quiz_response.to_dict(),
        }
    )


@quiz_router.post("/quiz-feedback")
async def create_quiz_feedback(request: Request, quiz_feedback_request: FeedbackInput):

    nlp_controller = NLPController(
        vectordb_client=request.app.vectordb_client,
        generation_model=request.app.generation_model,
        embedding_model=request.app.embedding_model,
    )

    feedback_response = nlp_controller.get_quiz_feedback(
        inputs=quiz_feedback_request
    )

    if feedback_response is None:
        logger.error("Error in creating quiz feedback")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                'signal': ResponseSignal.LLM_GENERATION_FAILED.value,
            }
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            'signal': ResponseSignal.LLM_GENERATION_SUCCESS.value,
            'feedback': feedback_response,
        }
    )
