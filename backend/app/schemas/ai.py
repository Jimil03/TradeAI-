from pydantic import BaseModel


class CoachResponse(BaseModel):
    message: str
    tokens_used: int