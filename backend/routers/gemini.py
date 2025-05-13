import json
from fastapi import APIRouter
from sqlmodel import select

from backend.dependencies import SessionDep, client
from backend.models import Log, Anomaly

router = APIRouter()


@router.get("/analyze")
def analyze_logs(session: SessionDep):
    logs = session.exec(select(Log)).all()

    base_prompt = (
        "You are a cybersecurity AI assistant. Analyze the following Zscaler web proxy log entries and identify any anomalies."
        "For each anomaly, provide a JSON object with keys: description (short summary), explanation (why it's anomalous), confidence (0–1), log_id, anomaly_id (same as log id, prefixed with 'anomaly_')."
        "If no anomalies are found, return an empty JSON array. \nEntries:\n"
    )

    entry_lines = [json.dumps(log.dict(), separators=(",", ":")) for log in logs]

    entries_block = "\n".join(entry_lines)

    prompt = f"{base_prompt}{entries_block}"

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": list[Anomaly],
        },
    )

    return response.parsed
