from typing import Annotated

import csv
import uuid
from io import StringIO
from fastapi import APIRouter, UploadFile, Depends
from sqlmodel import select

from app.dependencies import get_current_user, SessionDep
from app.models import User, Log

router = APIRouter()


def parse_log(text: str) -> list[dict[str, str]]:
    buffer = StringIO(text)
    reader = csv.DictReader(buffer)
    wanted = ["timestamp", "action", "url", "category", "user"]
    results = []
    for row in reader:
        filtered = {col: row[col] for col in wanted}
        filtered["log_id"] = str(uuid.uuid4())
        results.append(filtered)
    return results


def clear_logs(session: SessionDep):
    all_logs = session.exec(select(Log)).all()

    if all_logs:
        for log_entry in all_logs:
            session.delete(log_entry)
        session.commit()


def create_logs(logs, owner, session: SessionDep):
    clear_logs(session)
    for log in logs:
        log["owner_username"] = owner
        log_instance = Log(**log)
        session.add(log_instance)

    session.commit()


@router.post("/upload")
async def upload_file(
    file: UploadFile,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    raw = await file.read()
    text = raw.decode("utf-8")
    parsed = parse_log(text)
    create_logs(parsed, current_user.username, session)
    return {"filename": file.filename, "rows_parsed": len(parsed), "data": parsed}
