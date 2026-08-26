"""Main entry point for DISHIKA voice server."""

import logging
import asyncio
from typing import Optional
import json

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from config.settings import settings
from pipeline import DISHIKAPipeline

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.pipecat_log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="DISHIKA Voice Server", version="0.1.0")

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # TODO: Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global pipeline instances (keyed by session_id)
pipelines: dict[str, DISHIKAPipeline] = {}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return JSONResponse({"status": "ok", "service": "DISHIKA Voice Server"})

@app.post("/session/start")
async def start_session(
    language: str = "hi-IN",
):
    """Start a new voice session.
    
    Args:
        language: Language code (hi-IN, en-IN, hinglish)
        
    Returns:
        Session ID and initial state
    """
    try:
        pipeline = DISHIKAPipeline()
        pipeline.conversation.language = language
        await pipeline.initialize()
        
        pipelines[pipeline.session_id] = pipeline
        
        logger.info(f"Started session {pipeline.session_id} with language {language}")
        
        return JSONResponse({
            "session_id": pipeline.session_id,
            "language": language,
            "status": "ready",
        })
    
    except Exception as e:
        logger.error(f"Failed to start session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/session/{session_id}/stop")
async def stop_session(session_id: str):
    """Stop a voice session."""
    if session_id not in pipelines:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        pipeline = pipelines[session_id]
        await pipeline.stop()
        del pipelines[session_id]
        
        logger.info(f"Stopped session {session_id}")
        
        return JSONResponse({"status": "stopped"})
    
    except Exception as e:
        logger.error(f"Failed to stop session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/session/{session_id}/state")
async def get_session_state(session_id: str):
    """Get current session state."""
    if session_id not in pipelines:
        raise HTTPException(status_code=404, detail="Session not found")
    
    pipeline = pipelines[session_id]
    return JSONResponse(pipeline.get_state())

@app.get("/session/{session_id}/transcript")
async def get_transcript(session_id: str):
    """Get conversation transcript for session."""
    if session_id not in pipelines:
        raise HTTPException(status_code=404, detail="Session not found")
    
    pipeline = pipelines[session_id]
    turns = [
        {"role": turn.role, "content": turn.content, "timestamp": turn.timestamp.isoformat() if turn.timestamp else None}
        for turn in pipeline.conversation.turns
    ]
    
    return JSONResponse({"session_id": session_id, "turns": turns})

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for realtime session communication.
    
    Receives:
        - "interrupt": User interrupted (barge-in)
        - "mute_mic": Mute microphone
        - "mute_speaker": Mute speaker
        - "language_change": Change language mid-session
    
    Sends:
        - "state": Current pipeline state
        - "transcript": Updated transcript
        - "error": Error messages
    """
    if session_id not in pipelines:
        await websocket.close(code=4004, reason="Session not found")
        return
    
    pipeline = pipelines[session_id]
    await websocket.accept()
    
    logger.info(f"WebSocket connected for session {session_id}")
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            message_type = message.get("type")
            
            if message_type == "interrupt":
                logger.info(f"Interrupt received for session {session_id}")
                await pipeline.handle_interrupt()
                await websocket.send_json({"type": "state", "state": "listening"})
            
            elif message_type == "mute_mic":
                # TODO: Implement mic mute
                logger.info(f"Mute mic for session {session_id}")
            
            elif message_type == "mute_speaker":
                # TODO: Implement speaker mute
                logger.info(f"Mute speaker for session {session_id}")
            
            elif message_type == "language_change":
                new_language = message.get("language", "hi-IN")
                pipeline.conversation.language = new_language
                logger.info(f"Language changed to {new_language} for session {session_id}")
            
            else:
                logger.warning(f"Unknown message type: {message_type}")
    
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session {session_id}")
    
    except Exception as e:
        logger.error(f"WebSocket error for session {session_id}: {e}", exc_info=True)
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass

@app.post("/debug/reset")
async def debug_reset():
    """Debug endpoint to reset all sessions."""
    logger.warning("DEBUG: Resetting all sessions")
    for session_id in list(pipelines.keys()):
        try:
            await pipelines[session_id].stop()
        except:
            pass
        del pipelines[session_id]
    return JSONResponse({"status": "reset", "sessions_cleared": len(pipelines)})

def main():
    """Run the DISHIKA voice server."""
    logger.info(f"Starting DISHIKA voice server on {settings.host}:{settings.port}")
    logger.info(f"LLM Provider: {settings.llm_provider}")
    logger.info(f"LLM Model: {settings.llm_model}")
    
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        log_level=settings.pipecat_log_level.lower(),
    )

if __name__ == "__main__":
    main()
