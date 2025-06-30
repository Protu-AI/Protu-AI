from pydantic import BaseModel, Field
from typing import List, Tuple


class ChatTitleGenerationInput(BaseModel):
    chat_messages: List[str] = Field(
        ..., description="List of chat messages exchanged in the conversation")


class ChatTitleOutput(BaseModel):
    chat_title: str = Field(..., description="A concise title reflecting the topic of the chat conversation (e.g., 'Python Programming Discussion', 'JavaScript Frameworks Overview')")
