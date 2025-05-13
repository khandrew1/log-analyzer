from fastapi import FastAPI
from .routers import users, upload, gemini
from .database import create_db_and_tables

app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.include_router(users.router)
app.include_router(upload.router)
app.include_router(gemini.router)
