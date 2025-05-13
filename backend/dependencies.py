import jwt
from jwt.exceptions import InvalidTokenError
from typing import Annotated

from fastapi import Depends, HTTPException, status
from sqlmodel import Session
from fastapi.security import OAuth2PasswordBearer
from backend.models import User, TokenData
from backend.database import get_session
from backend.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SessionDep = Annotated[Session, Depends(get_session)]


def fake_decode_token(token):
    return User(username=token + "fakedecoded")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings["SECRET_KEY"], algorithms=[settings["ALGORITHM"]]
        )
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = session.get(User, token_data.username)
    if user is None:
        raise credentials_exception
    return user
