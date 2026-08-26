import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    # Sarvam
    sarvam_api_key: str = os.getenv("SARVAM_API_KEY", "")
    
    # LLM
    llm_provider: str = os.getenv("LLM_PROVIDER", "openai")
    llm_api_key: str = os.getenv("LLM_API_KEY", "")
    llm_model: str = os.getenv("LLM_MODEL", "gpt-4-turbo")
    
    # Pipecat
    pipecat_debug: bool = os.getenv("PIPECAT_DEBUG", "false").lower() == "true"
    pipecat_log_level: str = os.getenv("PIPECAT_LOG_LEVEL", "INFO")
    
    # Server
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    
    # Optional: Daily.co
    daily_api_key: str = os.getenv("DAILY_API_KEY", "")
    daily_room_url: str = os.getenv("DAILY_ROOM_URL", "")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
