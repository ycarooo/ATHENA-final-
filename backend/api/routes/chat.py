from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.chat_service import ChatService

router = APIRouter()

service = ChatService()


class ChatMessage(BaseModel):
    message: str


@router.post("/chat")
def chat(data: ChatMessage):
    response = service.process_message(data.message)

    return {
        "response": response
    }