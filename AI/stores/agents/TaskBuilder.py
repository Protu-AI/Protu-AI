from crewai import Task, Agent

from models.QuizModels import TagAgentResponse
from stores.llm import LLMFactoryProvider

from typing import List


class TaskBuilder():

    def create_task(self,
                    task_description: str,
                    expected_output: str,
                    output_json: TagAgentResponse,
                    task_agent: Agent,
                    context: List["Task"] = None,
                    name: str = None
                    ) -> Task:
        return Task(
            name=name,
            description=task_description,
            expected_output=expected_output,
            output_json=output_json,
            agent=task_agent,
            context=context,
        )
