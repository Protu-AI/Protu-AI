from crewai import Crew, Process, Task, Agent, CrewOutput

from typing import List


class CrewAIBuilder():

    def __init__(self,
                 crew_tasks: List[Task],
                 crew_agents: List[Agent],
                 process: Process = Process.sequential,
                 verbose: bool = False,
                 ) -> Crew:

        self.crew_tasks = crew_tasks
        self.crew_agents = crew_agents
        self.process = process
        self.verbose = verbose

    def create_crew(self) -> Crew:

        return Crew(
            tasks=self.crew_tasks,
            agents=self.crew_agents,
            process=self.process,
            verbose=self.verbose,
        )
