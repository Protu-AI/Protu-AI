from controllers import NLPController
from crewai.tools.base_tool import Tool

from models.QuizModels import CourseSearchInput

from typing import List, Dict, Any


def retrieve_courses_tool(nlp_controller: NLPController) -> Tool:
    """
    Factory function that creates a well-documented Course Recommender tool.

    This function takes an initialized instance of the NLPController and returns a 
    crewAI Tool that is fully configured to use the controller's search method.

    Args:
        nlp_controller: An initialized instance of the NLPController class that
                        has the `search_vector_db_collection` method.

    Returns:
        A crewAI Tool object ready to be passed to an agent.
    """

    def run_and_process_search(topic: str) -> List[Dict[str, Any]]:

        raw_documents = nlp_controller.search_vector_db_collection(
            text=topic,
            chat_id="courses",
            limit=3
        )

        processed_results = []
        for doc in raw_documents:
            try:
                course_id = int(doc.metadata)
                processed_results.append({
                    "course_id": course_id,
                    "relevance_score": doc.score
                })
            except (ValueError, TypeError):
                # Skip documents with malformed metadata
                print(
                    f"WARNING: Skipping document with invalid metadata: {doc.metadata}")
                continue

        return processed_results

    return Tool(
        name="Course Recommender",
        description=(
            "Use this tool to find relevant course recommendations for a SINGLE, specific topic. "
            "You should call this tool for each individual topic you identify as a user's weakness. "
            "It searches the platform's database and returns a list of courses that can help a user learn about that topic."
        ),
        func=run_and_process_search,
        args_schema=CourseSearchInput,
        cache=True
    )
