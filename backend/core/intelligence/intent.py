class IntentDetector:
    def detect(self, message: str) -> str:
        message = message.lower()

        if "olá" in message or "oi" in message:
            return "greeting"

        if "estudar" in message or "estudo" in message:
            return "study"

        if "tarefa" in message or "tarefas" in message:
            return "task"

        if "lembrete" in message or "lembrar" in message:
            return "reminder"

        return "unknown"