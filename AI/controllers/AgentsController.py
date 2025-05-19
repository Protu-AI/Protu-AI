from models import *

from crewai import Process, LLM

import agentops

from .BaseController import BaseController

from stores.llm import LLMFactoryProvider
from stores.agents import AgentBuilder, CrewAIBuilder, TaskBuilder

from models import *

from Prompt import *


import os


class AgentsController(BaseController):

    def __init__(self):
        super().__init__()

        self.llm = LLM(
            model=self.app_settings.QUIZ_GENERATION_MODEL_ID,
            temperature=self.app_settings.QUIZ_GENERATION_MODEL_TEMPERATURE,
        )

        self.tags_suggestion_crew = self.create_tag_suggestion_crew()

        self.quiz_generation_crew = self.create_quiz_generation_crew()

    def create_tag_suggestion_crew(self):

        agent_role = tag_suggestion_agent_role
        agent_goal = tag_suggestion_agent_goal
        agent_backstory = tag_suggestion_agent_backstory

        tags_suggestion_agent = AgentBuilder().create_agent(
            agent_role=agent_role,
            agent_goal=agent_goal,
            agent_backstory=agent_backstory,
            agent_llm=self.llm
        )

        task_description = tag_suggestion_task_description
        expected_output = tag_suggestion_task_expected_output

        tags_suggestion_task = TaskBuilder().create_task(
            task_description=task_description,
            expected_output=expected_output,
            output_json=TagAgentResponse,
            task_agent=tags_suggestion_agent
        )

        self.tags_suggestion_crew = CrewAIBuilder(
            crew_tasks=[tags_suggestion_task],
            crew_agents=[tags_suggestion_agent]
        ).create_crew()

        return self.tags_suggestion_crew

    def create_quiz_tags(self, input: TagAgentInput):

        if not hasattr(self, 'tags_suggestion_crew'):
            self.tags_suggestion_crew = self.create_tag_suggestion_crew()

        crew_output = self.tags_suggestion_crew.kickoff(
            inputs=input.model_dump()
        )

        if crew_output is None:

            raise ValueError("No output received from the crew.")

        return crew_output

    def create_quiz_generation_crew(self):
        quiz_agent_role = quiz_generation_agent_role
        quiz_agent_goal = quiz_generation_agent_goal
        quiz_agent_backstory = quiz_generation_agent_backstory

        quiz_generation_agent = AgentBuilder().create_agent(
            agent_role=quiz_agent_role,
            agent_goal=quiz_agent_goal,
            agent_backstory=quiz_agent_backstory,
            agent_llm=self.llm
        )

        task_description = quiz_generation_task_description
        expected_output = quiz_generation_task_expected_output

        quiz_generation_task = TaskBuilder().create_task(
            task_description=task_description,
            expected_output=expected_output,
            output_json=QuizAgentResponse,
            task_agent=quiz_generation_agent
        )

        self.quiz_generation_crew = CrewAIBuilder(
            crew_tasks=[quiz_generation_task],
            crew_agents=[quiz_generation_agent]
        ).create_crew()

        return self.quiz_generation_crew

    def create_quiz(self, input: QuizAgentInput):
        if not hasattr(self, 'quiz_generation_crew'):
            self.quiz_generation_crew = self.create_quiz_generation_crew()

        crew_output = self.quiz_generation_crew.kickoff(
            inputs=input.model_dump()
        )

        if crew_output is None:

            raise ValueError("No output received from the crew.")

        return crew_output
