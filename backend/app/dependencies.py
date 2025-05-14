import jwt
from typing import Annotated

from fastapi import Depends, HTTPException, Request
from sqlmodel import Session
from google import genai

from fastapi.security import OAuth2PasswordBearer
from app.models import User
from app.database import get_session
from app.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SessionDep = Annotated[Session, Depends(get_session)]

client = genai.Client(api_key=settings["GEMINI_API_KEY"])


async def get_current_user(
    request: Request,
    session: SessionDep,
):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            401, "Not authenticated", headers={"WWW-Authenticate": "Bearer"}
        )
    try:
        payload = jwt.decode(
            token, settings["SECRET_KEY"], algorithms=[settings["ALGORITHM"]]
        )
        username = payload.get("sub")
        if not username:
            raise
    except Exception:
        raise HTTPException(
            401, "Invalid token", headers={"WWW-Authenticate": "Bearer"}
        )
    user = session.get(User, username)
    if not user:
        raise HTTPException(
            401, "User not found", headers={"WWW-Authenticate": "Bearer"}
        )
    return user
