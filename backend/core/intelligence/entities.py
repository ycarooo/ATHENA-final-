class EntityExtractor:
    def extract(self, message: str) -> dict:
        entities = {}

        message = message.lower()

        if "matemática" in message:
            entities["subject"] = "matemática"

        if "amanhã" in message:
            entities["date"] = "amanhã"

        return entities