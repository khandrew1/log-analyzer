from sqlmodel import Field, SQLModel
from pydantic import BaseModel


class User(SQLModel, table=True):
    username: str = Field(index=True, primary_key=True)
    hashed_password: str = Field(index=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
