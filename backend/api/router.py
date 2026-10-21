from fastapi import APIRouter
from backend.api.routes.chat import router as chat_router

router = APIRouter()

router.include_router(chat_router)