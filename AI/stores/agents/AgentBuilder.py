from crewai import Agent, LLM

from crewai.crews.crew_output import CrewOutput
from crewai.tools import BaseTool
from typing import List, Optional

from abc import ABC, abstractmethod


class AgentBuilder():

    def create_agent(self,
                     agent_role: str,
                     agent_goal: str,
                     agent_backstory: str,
                     agent_llm: LLM,
                     agent_tools: Optional[List[BaseTool]] = None,
                     verbose=False) -> Agent:
        return Agent(
            role=agent_role,
            goal=agent_goal,
            backstory=agent_backstory,
            llm=agent_llm,
            tools=agent_tools,
            verbose=verbose
        )
