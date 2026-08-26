from pydantic import BaseModel
from typing import Literal, List, Optional
from datetime import datetime

class ConversationTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: Optional[datetime] = None

class ConversationContext(BaseModel):
    session_id: str
    language: str = "hi-IN"
    turns: List[ConversationTurn] = []
    created_at: datetime = datetime.now()
    last_interaction: Optional[datetime] = None
    
    def add_turn(self, role: Literal["user", "assistant"], content: str):
        self.turns.append(
            ConversationTurn(role=role, content=content, timestamp=datetime.now())
        )
        self.last_interaction = datetime.now()
    
    def get_context_for_llm(self) -> str:
        """Format conversation for LLM context."""
        formatted = []
        for turn in self.turns:
            role = "User" if turn.role == "user" else "Assistant"
            formatted.append(f"{role}: {turn.content}")
        return "\n".join(formatted)
    
    def clear(self):
        """Reset conversation."""
        self.turns = []
        self.last_interaction = None
