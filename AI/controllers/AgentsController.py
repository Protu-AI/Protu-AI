from models import *

from crewai import Process, LLM

from .BaseController import BaseController

from stores.llm import LLMFactoryProvider
from stores.agents import AgentBuilder, CrewAIBuilder, TaskBuilder

from models import *

from prompts import *

from routes.schemas import QuizAgentInput


class AgentsController(BaseController):

    def __init__(self):
        super().__init__()

        self.llm = LLM(
            model=self.app_settings.QUIZ_GENERATION_MODEL_ID,
            temperature=self.app_settings.QUIZ_GENERATION_MODEL_TEMPERATURE,
        )

        self.tags_suggestion_crew = self.create_tag_suggestion_crew()

        self.quiz_generation_crew = self.create_quiz_generation_crew()

        self.chat_title_generation_crew = self.create_chat_title_generation_crew()

    def create_tag_suggestion_crew(self):

        tags_suggestion_agent = AgentBuilder().create_agent(
            agent_role=tag_suggestion_agent_role,
            agent_goal=tag_suggestion_agent_goal,
            agent_backstory=tag_suggestion_agent_backstory,
            agent_llm=self.llm
        )

        tags_suggestion_task = TaskBuilder().create_task(
            task_description=tag_suggestion_task_description,
            expected_output=tag_suggestion_task_expected_output,
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

        # First let's implement the tag filtering agent
        tag_filter_agent = AgentBuilder().create_agent(
            agent_role=tag_filtering_agent_role,
            agent_goal=tag_filtering_agent_goal,
            agent_backstory=tag_filtering_agent_backstory,
            agent_llm=self.llm
        )

        tag_filter_task = TaskBuilder().create_task(
            name="tag_filter_task",
            task_description=tag_filtering_agent_task_description,
            expected_output=tag_filtering_agent_expected_output,
            output_json=TagsFilterOutput,
            task_agent=tag_filter_agent
        )

        # Second Let's implement the quiz generation agent

        quiz_generation_agent = AgentBuilder().create_agent(
            agent_role=quiz_generation_agent_role,
            agent_goal=quiz_generation_agent_goal,
            agent_backstory=quiz_generation_agent_backstory,
            agent_llm=self.llm
        )

        quiz_generation_task = TaskBuilder().create_task(
            task_description=quiz_generation_task_description,
            expected_output=quiz_generation_task_expected_output,
            output_json=QuizAgentResponse,
            task_agent=quiz_generation_agent,
            context=[tag_filter_task]
        )

        self.quiz_generation_crew = CrewAIBuilder(
            crew_tasks=[
                tag_filter_task,
                quiz_generation_task
            ],
            crew_agents=[
                tag_filter_agent,
                quiz_generation_agent
            ]
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

    def create_chat_title_generation_crew(self):

        chat_title_generation_agent = AgentBuilder().create_agent(
            agent_role=title_generation_agent_role,
            agent_goal=title_generation_agent_goal,
            agent_backstory=title_generation_agent_backstory,
            agent_llm=self.llm
        )

        chat_title_generation_task = TaskBuilder().create_task(
            task_description=title_generation_task_description,
            expected_output=title_generation_task_expected_output,
            output_json=ChatTitleOutput,
            task_agent=chat_title_generation_agent
        )

        self.chat_title_generation_crew = CrewAIBuilder(
            crew_tasks=[chat_title_generation_task],
            crew_agents=[chat_title_generation_agent]
        ).create_crew()

        return self.chat_title_generation_crew

    def create_chat_title(self, input: ChatTitleGenerationInput):
        if not hasattr(self, 'chat_title_generation_crew'):
            self.chat_title_generation_crew = self.create_chat_title_generation_crew()

        crew_output = self.chat_title_generation_crew.kickoff(
            inputs=input.model_dump()
        )

        if crew_output is None or crew_output['chat_title'] is None:

            raise ValueError("No output received from the crew.")

        return crew_output['chat_title']
