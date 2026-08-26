# DISHIKA Phase 2: Pipecat Server Setup

## Overview

This phase sets up the realtime voice pipeline using **Pipecat** (Python), integrating:
- WebRTC transport for browser ↔ server audio streaming
- Sarvam AI Speech-to-Text (STT)
- Language Model (LLM) for response generation
- Sarvam AI Text-to-Speech (TTS)
- Voice Activity Detection (VAD) with Silero
- Conversation state management

## Architecture

```
Browser (Next.js)
    ↓
WebRTC Connection
    ↓
Pipecat Server
    ├─ Transport: WebRTC + Daily.co
    ├─ Input: Microphone audio → VAD → STT (Sarvam)
    ├─ Processing: LLM (OpenAI/Anthropic/etc)
    ├─ Speech Normalization: Markdown removal, acronym expansion
    └─ Output: TTS (Sarvam) → Speaker audio
```

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- API Keys:
  - **Sarvam AI**: https://dashboard.sarvam.ai
  - **LLM**: OpenAI, Anthropic, or other provider
  - **Daily.co** (optional, for production WebRTC): https://www.daily.co

## Project Structure

```
voice-server/
├── main.py                      # Entry point
├── pipeline.py                  # Pipecat pipeline definition
├── services/
│   ├── __init__.py
│   ├── sarvam_service.py        # Sarvam STT/TTS wrapper
│   ├── llm_service.py           # LLM provider abstraction
│   └── speech_normalizer.py     # Text normalization for TTS
├── config/
│   ├── __init__.py
│   └── settings.py              # Configuration & environment
├── models/
│   ├── __init__.py
│   └── conversation.py          # Conversation state & context
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
└── README.md                    # Setup instructions
```

## Installation

### 1. Create Python environment

```bash
cd voice-server
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Sarvam API
SARVAM_API_KEY=your_sarvam_key

# LLM Configuration
LLM_PROVIDER=openai          # or anthropic, etc
LLM_API_KEY=your_llm_key
LLM_MODEL=gpt-4-turbo

# Pipecat
PIPECAT_DEBUG=false
PIPECAT_LOG_LEVEL=INFO

# Server
HOST=0.0.0.0
PORT=8000

# Optional: Daily.co for production
DAILY_API_KEY=
DAILY_ROOM_URL=
```

### 4. Run the server

```bash
python main.py
```

Server will start at `http://0.0.0.0:8000`

## API Endpoints

### WebRTC Connection

**POST** `/connect`

Initiate a WebRTC peer connection.

```json
{
  "offer": "<WebRTC SDP offer>",
  "language": "hi-IN"
}
```

**Response:**

```json
{
  "answer": "<WebRTC SDP answer>",
  "session_id": "uuid"
}
```

### State Events (WebRTC Data Channel)

Once connected, the server sends real-time state updates:

```json
{
  "type": "state",
  "state": "listening|speaking|thinking|interrupted|error",
  "transcript": "User's transcribed speech",
  "audio_level": 0.75
}
```

## Implementation Details

### Pipecat Pipeline Flow

1. **Input**: Browser sends audio frames via WebRTC
2. **VAD**: Silero detects speech activity
3. **STT**: Sarvam transcribes to text
4. **LLM**: Generates response based on context
5. **Speech Normalization**: Converts markdown/URLs/etc to spoken text
6. **TTS**: Sarvam converts to speech
7. **Output**: Audio frames sent back to browser
8. **Feedback**: State updates sent via data channel

### Conversation Context

The pipeline maintains conversation history:

```python
conversation = {
    "language": "hi-IN",
    "turns": [
        {"role": "user", "content": "PACS kya hota hai?"},
        {"role": "assistant", "content": "PACS ka matlab..."},
    ],
    "session_id": "uuid",
    "created_at": "2026-08-26T..."
}
```

Every LLM call includes the full history for context retention.

### Barge-in / Interruption

When user speaks while AI is speaking:

1. VAD detects new speech
2. Pipeline cancels current TTS
3. Switches to listening state
4. Stops outputting audio
5. Processes new user input

### Speech Normalization

Before sending text to TTS, normalize:

- **Markdown**: Remove `**bold**`, `*italic*`, `# headers`
- **URLs**: Replace with spoken equivalent or remove
- **Code blocks**: Remove or read as text
- **Acronyms**: Expand (PACS → पैक्स)
- **Numbers**: Spell out ("10,000" → "दस हजार")
- **Symbols**: Convert to words ("&" → "और")

Example:

```python
raw = "**PACS** (Primary Agricultural Credit Society) helps farmers. Visit https://example.com for more."
normalized = "PACS Primary Agricultural Credit Society helps farmers."
```

## Testing

### 1. Start the server

```bash
python main.py
```

### 2. Test health check

```bash
curl http://localhost:8000/health
```

Expected:
```json
{"status": "ok"}
```

### 3. Test WebRTC connection (Phase 2+)

Connect frontend to:

```env
NEXT_PUBLIC_PIPECAT_URL=http://localhost:8000
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'pipecat'"

```bash
pip install pipecat-ai
# If using Sarvam integration:
pip install pipecat-ai[sarvam]
```

### "SARVAM_API_KEY not found"

Ensure `.env` file exists and has:
```env
SARVAM_API_KEY=your_actual_key
```

### "Sarvam connection refused"

Verify Sarvam API is accessible:
```bash
curl -H "Authorization: Bearer $SARVAM_API_KEY" https://api.sarvam.ai/health
```

### WebRTC connection fails

1. Check server is running: `curl http://localhost:8000/health`
2. Verify firewall allows port 8000
3. Check browser console for connection errors
4. For production, consider Daily.co for NAT traversal

## Next Steps

- Phase 3: Integrate frontend with Pipecat server
- Phase 4: Test STT → LLM → TTS pipeline
- Phase 5: Implement barge-in detection
- Phase 6: Add conversation context retention

## Dependencies

See `requirements.txt` for full list. Key packages:

- `pipecat-ai`: Realtime voice framework
- `pipecat-ai[sarvam]`: Sarvam integration
- `python-dotenv`: Environment variables
- `pydantic`: Configuration validation
- `aiohttp`: Async HTTP client
- `websockets`: WebSocket support

## Production Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

Run:
```bash
docker build -t dishika-voice-server .
docker run -p 8000:8000 --env-file .env dishika-voice-server
```

### Environment Variables (Production)

Set via environment, not `.env` file:

```bash
export SARVAM_API_KEY=...
export LLM_API_KEY=...
export LLM_MODEL=...
export HOST=0.0.0.0
export PORT=8000
python main.py
```

## Support

- Pipecat Docs: https://docs.pipecat.ai
- Sarvam Docs: https://docs.sarvam.ai
- Daily.co Docs: https://docs.daily.co
