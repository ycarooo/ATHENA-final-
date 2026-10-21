class MessageParser:
    def __init__(self, intent_detector, entity_extractor):
        self.intent_detector = intent_detector
        self.entity_extractor = entity_extractor

    def parse(self, message: str) -> dict:
        intent = self.intent_detector.detect(message)
        entities = self.entity_extractor.extract(message)

        return {
            "message": message,
            "intent": intent,
            "entities": entities
        }