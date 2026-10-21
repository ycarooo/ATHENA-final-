from fastapi import FastAPI
from backend.api.router import router

app = FastAPI(title="ATHENA")

app.include_router(router)