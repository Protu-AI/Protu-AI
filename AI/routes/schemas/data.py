from pydantic import BaseModel
from typing import Optional


class ProcessRequest(BaseModel):
    chat_id: str
    is_attached: Optional[bool] = False


class ChatTitleGenerationRequst(BaseModel):
    chat_id: str
