from typing import List

from sqlmodel import Field, Relationship, SQLModel
from pydantic import BaseModel


class User(SQLModel, table=True):
    username: str = Field(index=True, primary_key=True)
    hashed_password: str = Field(index=True)
    uploaded_logs: List["Log"] = Relationship(back_populates="owner")


class Log(SQLModel, table=True):
    log_id: str = Field(primary_key=True)
    timestamp: str
    action: str
    url: str
    category: str
    user: str

    owner_username: str = Field(foreign_key="user.username")
    owner: User = Relationship(back_populates="uploaded_logs")

    anomalies: List["Anomaly"] = Relationship(back_populates="log")


class Anomaly(SQLModel, table=True):
    anomaly_id: str = Field(primary_key=True)

    description: str
    explanation: str
    confidence: float

    log_id: str = Field(foreign_key="log.log_id")
    log: Log = Relationship(back_populates="anomalies")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
