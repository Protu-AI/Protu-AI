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
    number_of_questions: int = Field(
        ..., description="Number of questions to generate for the quiz")
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
        ..., description="A concise title reflecting the topic and difficulty of the quiz (e.g., 'Intermediate Python Quiz')")
    topic: str = Field(
        ..., description="A topic (at most two words) derived from final_tags, describing the quiz questions' content (e.g., 'JavaScript Basics', 'Python Algorithms')")
    questions: List[QuizQuestion] = Field(
        ..., min_length=1, description="List of questions for the quiz based on the prompt and the tags")


class QuizModelAnswer(QuizQuestion):
    question_id: int = Field(...,
                             description="The unique identifier for the question.")
    user_answer: str = Field(
        ..., description="The answer to the question provided by the user")


class FeedbackInput(BaseModel):
    quiz: List[QuizModelAnswer] = Field(
        ..., description="List of questions for the quiz based on the prompt and the tags")

    k: int = Field(
        description="The maximum number of course recommendations to return in the final output.",
        default=5
    )


class CourseSearchInput(BaseModel):
    topic: str = Field(
        ...,
        description="A single, specific, and granular topic to search for courses on. For example: 'python_dictionaries', 'css_flexbox', or 'javascript_promises'."
    )


class RecommendedCourse(BaseModel):
    """
    Represents a single course recommendation.
    """

    course_id: int = Field(
        ...,
        description="The unique identifier for the recommended course."
    )
    relevance_score: float = Field(
        ...,
        description="The relevance score of the course to the topic, as determined by the search tool."
    )


class AnalyzedQuestion(BaseModel):
    # This field is required to link explanations to questions
    question_id: int = Field(
        ...,
        description="The unique identifier for the quiz question."
    )
    question: str = Field(
        ...,
        description="The full text of the quiz question."
    )
    user_answer: str = Field(
        ...,
        description="The answer the user provided."
    )
    correct_answer: str = Field(
        ...,
        description="The correct answer for the question."
    )
    topic: str = Field(
        ...,
        description="The specific, granular topic this question tests."
    )
    recommended_courses: List[RecommendedCourse] = Field(
        ...,
        description="A list of course recommendations relevant to this question's topic."
    )


class WeaknessAnalyzerOutput(BaseModel):
    """
    The top-level model for the agent's final JSON output. This is the data
    that will be passed to the next agent in the crew.
    """
    analyzed_questions: List[AnalyzedQuestion] = Field(
        ...,
        description="A list of all the questions the user answered incorrectly, enriched with analysis and recommendations."
    )


class DetailedExplanation(BaseModel):
    """
    Represents a detailed explanation for a single incorrect answer.
    """
    question_id: int = Field(
        ...,
        description="Identifier of the question being explained."
    )
    explanation: str = Field(
        ...,
        description="The detailed explanation for the correct answer."
    )


class FeedbackSynthesizerOutput(BaseModel):
    """
    The top-level model for the final feedback report generated by the agent.
    This is the data your application will use to render the feedback UI.
    """
    feedback_message: str = Field(
        ...,
        description="A complete, user-facing motivational message including the list of weak point topics."
    )
    detailed_explanations: List[DetailedExplanation] = Field(
        ...,
        description="A list of detailed explanations for each question the user answered incorrectly."
    )
    recommended_course_ids: List[int] = Field(
        ...,
        description="The final, curated list of course IDs to recommend to the user."
    )
