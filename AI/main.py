from fastapi import FastAPI
from routes import base, data, quiz

from controllers import DBController, NLPController, AgentsController

from contextlib import asynccontextmanager

from helpers import get_settings

from stores.llm import LLMFactoryProvider
from stores.vectordb import VectorDBFactoryProvider

import agentops


async def startup_spam():

    settings = get_settings()

    agentops.init(
        api_key=settings.AGENTOPS_API_KEY,
    )
    app.db_controller = DBController()

    llm_factory_provider = LLMFactoryProvider(config=settings)
    vectordb_factory_provider = VectorDBFactoryProvider(config=settings)

    # Generation model
    app.generation_model = llm_factory_provider.create_provider(
        provider=settings.GENERATION_BACKEND)
    app.generation_model.set_generation_model(
        model_id=settings.GENERATION_MODEL_ID)

    # Embedding model
    app.embedding_model = llm_factory_provider.create_provider(
        provider=settings.EMBEDDING_BACKEND)
    app.embedding_model.set_embedding_model(
        embedding_model_id=settings.EMBEDDING_MODEL_ID,
        embedding_size=settings.EMBEDDING_SIZE)

    # VectorDB
    app.vectordb_client = vectordb_factory_provider.create_provider(
        provider=settings.VECTOR_DB_BACKEND
    )
    app.vectordb_client.connect()

    # Agents Controller
    app.agents_controller = AgentsController()


async def shutdown_spam():

    app.db_controller.db_disconnect()
    app.vectordb_client.disconnect()
    # agentops.end_session()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await startup_spam()
    yield
    await shutdown_spam()

app = FastAPI(lifespan=lifespan)

app.include_router(base.base_router)
app.include_router(data.data_router)
app.include_router(quiz.quiz_router)
