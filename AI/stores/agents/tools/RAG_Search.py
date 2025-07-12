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

    def run_and_process_search(topics: List[str]) -> List[Dict[str, Any]]:

        all_results = []
        for t in topics:
            raw_documents = nlp_controller.search_vector_db_collection(
                text=t,
                chat_id="courses",
                limit=3
            )
            if raw_documents is None:
                print(f"WARNING: No results found for topic: {t}")
                continue

            all_results.extend(raw_documents)

        highest_scores = {}
        for doc in all_results:
            try:
                course_id = int(doc.metadata)
                score = doc.score

                if course_id not in highest_scores or score > highest_scores[course_id]:
                    highest_scores[course_id] = score

            except (ValueError, TypeError):
                # Skip documents with malformed metadata
                print(
                    f"WARNING: Skipping document with invalid metadata: {doc.metadata}")
                continue

        processed_results = [
            {"course_id": course_id, "relevance_score": score}
            for course_id, score in highest_scores.items()
        ]

        sorted_results = sorted(
            processed_results,
            key=lambda item: item['relevance_score'],
            reverse=True
        )

        return sorted_results

    return Tool(
        name="Course Recommender",
        description=(
            "Use this tool to find relevant course recommendations for one or more topics. "
            "Pass a list of all identified topics to perform a single, efficient search "
            "and get a consolidated list of relevant courses."
        ),
        func=run_and_process_search,
        args_schema=CourseSearchInput,
        cache=True
    )
