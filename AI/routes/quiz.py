from fastapi import FastAPI, APIRouter, UploadFile, File, status, Request
from fastapi.responses import JSONResponse

from controllers import AgentsController, NLPController

from models import TagAgentInput, FeedbackInput

from controllers.Enums import ResponseSignal

from stores.agents.tools import retrieve_courses_tool

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

    agents_controller = request.app.agents_controller

    nlp_controller = request.app.nlp_controller

    courses_retriever_tool = retrieve_courses_tool(
        nlp_controller=nlp_controller
    )

    # topics = [
    #     "precision",
    #     "machine learning",
    #     "artificial intelligence",
    #     "neural networks",
    #     "activation function",
    #     "neural network architecture",
    #     "python library",
    #     "clustering",
    #     "supervised learning",
    #     "overfitting",
    #     "feature engineering",
    #     "deep learning",
    #     "perceptron",
    #     "backpropagation",
    #     "reinforcement learning"
    # ]
    # all_results = []
    # for t in topics:
    #     raw_documents = nlp_controller.search_vector_db_collection(
    #         text=t,
    #         chat_id="courses",
    #         limit=3
    #     )
    #     if raw_documents is None:
    #         print(f"WARNING: No results found for topic: {t}")
    #         continue

    #     all_results.extend(raw_documents)

    # print(all_results)
    # highest_scores = {}
    # for doc in all_results:
    #     try:
    #         course_id = int(doc.metadata)
    #         score = doc.score

    #         if course_id not in highest_scores or score > highest_scores[course_id]:
    #             highest_scores[course_id] = score

    #     except (ValueError, TypeError):
    #         # Skip documents with malformed metadata
    #         print(
    #             f"WARNING: Skipping document with invalid metadata: {doc.metadata}")
    #         continue

    # processed_results = [
    #     {"course_id": course_id, "relevance_score": score}
    #     for course_id, score in highest_scores.items()
    # ]
    # print(processed_results)

    # sorted_results = sorted(
    #     processed_results,
    #     key=lambda item: item['relevance_score'],
    #     reverse=True
    # )

    # print(sorted_results)

    crew_created = agents_controller.create_quiz_feedback_recommendation_crew(
        tools=[courses_retriever_tool]
    )

    if not crew_created:
        logger.error("Error in creating quiz feedback recommendation crew")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                'signal': ResponseSignal.AGENT_CREW_CREATION_FAILED.value,
            }
        )

    feedback_response = agents_controller.create_quiz_feedback_recommendation(
        inputs=quiz_feedback_request
    )

    feedback_message, detailed_explanations, recommended_course_ids = feedback_response[
        'feedback_message'], feedback_response['detailed_explanations'], feedback_response['recommended_course_ids']

    if feedback_response is None:
        logger.error("Error in creating quiz feedback")
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
            'feedback_message': feedback_message,
            'detailed_explanations': detailed_explanations,
            'recommended_course_ids': recommended_course_ids
        }
    )
