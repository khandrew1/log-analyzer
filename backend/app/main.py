from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, upload, gemini
from app.database import create_db_and_tables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.include_router(users.router)
app.include_router(upload.router)
app.include_router(gemini.router)
