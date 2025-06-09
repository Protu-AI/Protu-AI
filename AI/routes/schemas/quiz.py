from pydantic import BaseModel, Field
from typing import Optional, List


class QuizAgentInput(BaseModel):

    prompt: str = Field(...)
    difficulty: str = Field(...)
    question_type: str = Field(...)
    time: int = Field(..., description="Time to solve the quiz in minutes")
    number_of_questions: int = Field(..., description="Number of questions to generate for the quiz")
    tags: List[str] = Field(
        default=[], description="List of tags for the quiz based on the prompt")
    additional_tags: List[str] = Field(
        default=[], description="List of additional tags for the quiz from the user")
    additional_preferences: str = Field(
        description="Additional preferences for the quiz generation")
