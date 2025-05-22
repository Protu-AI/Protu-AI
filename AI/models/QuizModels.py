from pydantic import BaseModel, Field
from typing import List


class TagAgentResponse(BaseModel):

    tags: List[str] = Field(
        default=[], description="List of tags for the quiz based on the prompt that is provided and the difficulty level and question type")
    message: str = Field(
        default="", description="Message to be displayed to the user")
    is_relevant: bool = Field(
        default=True, description="Flag to indicate that the prompt is relevant to be used for a programming quiz like quiz on python, java, c++ or in tracks like frontend, data science, etc.")


class TagAgentInput(BaseModel):
    prompt: str = Field(...)
    difficulty: str = Field(...)
    question_type: str = Field(...)
    time: int = Field(...)
    number_of_tags: int = Field(
        default=6, description="Number of tags to be generated for the quiz")


class TagsFilterOutput(BaseModel):
    final_tags: List[str] = Field(
        min_length=6, description="List of at least 6 programming and software engineering-related tags curated from the prompt, tags, additional tags, and preferences, aligned with the quiz's difficulty and question type"
    )


class QuizGenerationInput(BaseModel):
    prompt: str = Field(...,
                        description="The prompt describing the quiz content")
    difficulty: str = Field(
        ..., description="Difficulty level of the quiz (e.g., Beginner, Intermediate, Advanced)")
    question_type: str = Field(
        ..., description="Type of questions (e.g., Multiple Choice, True/False, Combination between both)")
    time: int = Field(..., description="Time to solve the quiz in minutes")
    final_tags: List[str] = Field(
        min_length=6, description="Curated list of programming and software engineering-related tags from the Tag Filtering Agent"
    )


class QuizQuestion(BaseModel):
    question: str = Field(...,
                          description="The question to be asked in the quiz")
    options: List[str] = Field(
        ..., min_length=2, max_length=4, description="List of options for the question")
    correct_answer_text: str = Field(
        ..., description="The correct answer text to the question")


class QuizAgentResponse(BaseModel):
    quiz_title: str = Field(
        ..., description="A descriptive title for the quiz based on the prompt, difficulty, tags, and the questions generated")
    questions: List[QuizQuestion] = Field(
        ..., min_length=25, description="List of questions for the quiz based on the prompt and the tags")


class QuizModelAnswer(BaseModel):
    question: str = Field(...)
    options: List[str] = Field(
        ..., min_length=2, max_length=4, description="List of options for the question")
    correct_answer: str = Field(..., description="The answer to the question")
    user_answer: str = Field(
        ..., description="The answer to the question provided by the user")


class FeedbackInput(BaseModel):
    quiz: List[QuizModelAnswer] = Field(
        ..., description="List of questions for the quiz based on the prompt and the tags")


class FeedbackAgentResponse(BaseModel):
    feedback: str = Field(
        default="", description="Feedback for the quiz based on the user answers and the correct answers")
