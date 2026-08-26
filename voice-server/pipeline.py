"""Main Pipecat voice pipeline."""

import logging
from typing import Optional, Callable, Any
import asyncio
import uuid

from pipecat.framework.pipeline import Pipeline
from pipecat.processors.frame_processor import FrameProcessor
from pipecat.frames.frames import Frame, AudioRawFrame, TextFrame, UserStartedSpeakingFrame, UserStoppedSpeakingFrame
from pipecat.services.sarvam import SarvamSTTService, SarvamTTSService
from pipecat.services.openai import OpenAILLMService
from pipecat.services.silero_vad import SileroVADService
from pipecat.transports.services.daily import DailyTransport
from pipecat.processors.frameworks.llm import LLMResponseProcessor

from config.settings import settings
from services.speech_normalizer import SpeechNormalizer
from models.conversation import ConversationContext

logger = logging.getLogger(__name__)

class DISHIKAPipeline:
    """Realtime voice pipeline for DISHIKA."""
    
    def __init__(self, session_id: Optional[str] = None):
        self.session_id = session_id or str(uuid.uuid4())
        self.conversation = ConversationContext(session_id=self.session_id)
        self.pipeline: Optional[Pipeline] = None
        self.transport: Optional[DailyTransport] = None
        self.is_speaking = False
        self.logger = logger
    
    async def initialize(self) -> None:
        """Initialize the pipeline with all services."""
        self.logger.info(f"Initializing DISHIKA pipeline for session {self.session_id}")
        
        try:
            # Initialize transport (WebRTC via Daily.co or custom)
            self.transport = await self._setup_transport()
            
            # Initialize services
            stt = SarvamSTTService(
                api_key=settings.sarvam_api_key,
                language="hi-IN",  # TODO: Make configurable
            )
            
            tts = SarvamTTSService(
                api_key=settings.sarvam_api_key,
                language="hi-IN",
                speaker="anushka",
            )
            
            vad = SileroVADService()
            
            llm = OpenAILLMService(
                api_key=settings.llm_api_key,
                model=settings.llm_model,
            )
            
            # Build pipeline
            self.pipeline = Pipeline([
                self.transport.input(),
                vad,
                stt,
                self._create_llm_processor(llm),
                tts,
                self.transport.output(),
            ])
            
            self.logger.info("Pipeline initialized successfully")
        
        except Exception as e:
            self.logger.error(f"Failed to initialize pipeline: {e}", exc_info=True)
            raise
    
    async def _setup_transport(self) -> DailyTransport:
        """Set up WebRTC transport."""
        # TODO: Implement Daily.co transport setup
        # For now, return placeholder
        return None
    
    def _create_llm_processor(self, llm: OpenAILLMService) -> FrameProcessor:
        """Create LLM processor that maintains conversation context."""
        
        class ConversationAwareLLMProcessor(FrameProcessor):
            def __init__(self, llm: OpenAILLMService, pipeline_obj: 'DISHIKAPipeline'):
                super().__init__()
                self.llm = llm
                self.pipeline = pipeline_obj
            
            async def process_frame(self, frame: Frame) -> None:
                # If we receive a text frame (from STT), process it
                if isinstance(frame, TextFrame):
                    user_message = frame.text
                    self.pipeline.logger.info(f"User: {user_message}")
                    
                    # Add to conversation
                    self.pipeline.conversation.add_turn("user", user_message)
                    
                    # Generate response
                    try:
                        messages = self._build_llm_messages()
                        response = await self.llm.generate_response(messages)
                        self.pipeline.logger.info(f"Assistant: {response}")
                        
                        # Add to conversation
                        self.pipeline.conversation.add_turn("assistant", response)
                        
                        # Normalize speech for TTS
                        normalized = SpeechNormalizer.normalize(response, language="hi")
                        
                        # Yield the normalized text for TTS
                        yield TextFrame(normalized)
                    
                    except Exception as e:
                        self.pipeline.logger.error(f"LLM error: {e}", exc_info=True)
                        yield TextFrame("मुझे समझने में समस्या हुई। कृपया दोबारा कोशिश करें।")
                
                else:
                    # Pass through other frames
                    yield frame
            
            def _build_llm_messages(self) -> list:
                """Build conversation messages for LLM."""
                # System prompt for cooperative assistance
                system_prompt = (
                    "आप DISHIKA हैं, एक सहायक AI जो भारतीय सहकारिता और PACS के बारे में जानकारी देता है। "
                    "आप प्राकृतिक, सहायक, और संक्षिप्त उत्तर दें। "
                    "हिंदी, अंग्रेजी, और हिंग्लिश तीनों में बातचीत कर सकते हैं।"
                )
                
                messages = [{"role": "system", "content": system_prompt}]
                
                # Add conversation history
                for turn in self.pipeline.conversation.turns:
                    messages.append({"role": turn.role, "content": turn.content})
                
                return messages
        
        return ConversationAwareLLMProcessor(llm, self)
    
    async def start(self) -> None:
        """Start the pipeline."""
        if self.pipeline:
            self.logger.info("Starting pipeline")
            await self.pipeline.run()
    
    async def stop(self) -> None:
        """Stop the pipeline."""
        if self.pipeline:
            self.logger.info("Stopping pipeline")
            await self.pipeline.stop()
    
    async def handle_interrupt(self) -> None:
        """Handle user interruption (barge-in)."""
        self.logger.info("User interrupt detected - stopping TTS")
        self.is_speaking = False
        
        # TODO: Implement TTS cancellation
        # Stop current audio output and return to listening state
    
    def get_state(self) -> dict:
        """Get current pipeline state."""
        return {
            "session_id": self.session_id,
            "is_speaking": self.is_speaking,
            "language": self.conversation.language,
            "turn_count": len(self.conversation.turns),
        }
