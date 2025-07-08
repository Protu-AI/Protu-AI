from enum import Enum


class ResponseSignal(Enum):
    FILE_TYPE_NOT_ALLOWED = "File type not allowed"
    FILE_SIZE_EXCEEDS_LIMIT = "File size exceeds the limit"
    FILE_UPLOAD_SUCCESS = "File uploaded successfully"
    FILE_UPLOAD_FAILED = "File upload failed"
    PROJECT_ID_NOT_FOUND = "Project ID not found"
    PROJECT_DATA_PATH_NOT_FOUND = "Project data path not found"
    DATA_PROCESSING_INITIATED = "Data processing initiated"
    DATA_PROCESSING_FAILED = "Data processing failed"
    RESPONSE_GENERATION_SUCCESS = "Response generation successful"
    RESPONSE_GENERATION_FAILED = "Response generation failed"
    LLM_GENERATION_SUCCESS = "LLM generation successful"
    LLM_GENERATION_FAILED = "LLM generation failed"
    AGENT_RESPONSE_SUCCESS = "Agent response successful"
    AGENT_RESPONSE_FAILED = "Agent response failed"
    AGENT_CREW_CREATION_FAILED = "Agent crew creation failed"
