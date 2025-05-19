from crewai import Task, Agent

from models.QuizModels import TagAgentResponse
from stores.llm import LLMFactoryProvider


class TaskBuilder():

    def create_task(self,
                    task_description: str,
                    expected_output: str,
                    output_json: TagAgentResponse,
                    task_agent: Agent) -> Task:
        return Task(
            description=task_description,
            expected_output=expected_output,
            output_json=output_json,
            agent=task_agent,
        )
