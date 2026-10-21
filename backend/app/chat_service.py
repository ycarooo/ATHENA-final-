from backend.core.intelligence.intent import IntentDetector
from backend.core.intelligence.entities import EntityExtractor


class ChatService:
    def __init__(self):
        self.intent_detector = IntentDetector()
        self.entity_extractor = EntityExtractor()

    def process_message(self, message: str) -> str:
        intent = self.intent_detector.detect(message)
        entities = self.entity_extractor.extract(message)

        if intent == "greeting":
            return "Olá! Eu sou a ATHENA."

        if intent == "study":
            return f"Entendi! Você quer estudar. Informações encontradas: {entities}"

        if intent == "task":
            return f"Entendi! Você quer trabalhar com uma tarefa. Informações encontradas: {entities}"

        if intent == "reminder":
            return f"Entendi! Você quer criar um lembrete. Informações encontradas: {entities}"

        return f"Ainda não sei como responder a isso. Intenção: {intent}"