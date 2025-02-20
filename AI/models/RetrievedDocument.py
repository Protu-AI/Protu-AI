from pydantic import BaseModel

class RetrievedDocument(BaseModel):
    '''
    RetrievedDocument Class for the FastAPI Application
    In this class, we define the schema for the RetrievedDocument object
    '''
    text: str
    score: float
    metadata: str
