from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    '''
    Settings Class for the FastAPI Application
    In this class, we define the settings for the FastAPI Application that are loaded from the .env file
    '''

    FILE_ALLOWED_TYPES: List[str]
    FILE_MAX_SIZE: int
    FILE_CHUNK_SIZE: int

    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    GENERATION_BACKEND: str
    EMBEDDING_BACKEND: str

    GROQ_API_KEY: str

    OPENAI_API_KEY: str
    OPENAI_URL_BASE: str = None

    GOOGLE_API_KEY: str

    GENERATION_MODEL_ID: str
    EMBEDDING_MODEL_ID: str
    EMBEDDING_SIZE: int

    DEFAULT_INPUT_MAX_CHARACTERS: int = None
    DEFAULT_MAX_NEW_TOKENS: int = None
    DEFAULT_TEMPERATURE: float = None

    VECTOR_DB_BACKEND: str
    VECTOR_DB_PATH: str
    VECTOR_DB_DISTANCE_METHOD: str

    DEFAULT_LANGUAGE: str = 'en'
    PRIMARY_LANGUAGE: str

    QUIZ_GENERATION_MODEL_ID: str
    QUIZ_GENERATION_MODEL_TEMPERATURE: float

    class Config:
        env_file = '.env'


def get_settings():
    return Settings()
