# DISHIKA - Realtime Indian Voice Assistant

A production-quality, voice-first assistant for SIH 2026 Problem Statement 26088. Built with **Pipecat**, **Sarvam AI**, and **Next.js**.

## Features

✨ **Voice-First Interface**  
- Beautiful, minimalist design with animated voice orb
- Natural continuous conversation without push-to-talk
- Supports Hindi, English, and Hinglish

⚡ **Realtime Technology**  
- Low-latency speech-to-text (Sarvam STT)
- Streaming text-to-speech (Sarvam TTS)
- Pipecat realtime voice pipeline

🎯 **Advanced Features**  
- **Barge-in/Interruption:** Stop the AI mid-sentence to ask follow-up questions
- **Conversation Context:** Maintains multi-turn dialogue history
- **State Management:** Visual orb reflects listening, speaking, thinking, and error states
- **Language Switching:** Change languages mid-session
- **Transcript Panel:** View full conversation history

🔒 **Security & Privacy**  
- API keys stored server-side only
- Environment-based configuration
- No sensitive data in frontend code

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Next.js)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Landing Page                                           │ │
│  │ ┌──────────────────────────────────────────────────┐   │ │
│  │ │ Voice Session                                    │   │ │
│  │ │  • VoiceOrb (state-driven animations)            │   │ │
│  │ │  • VoiceControls (mute, end, language, options) │   │ │
│  │ │  • Transcript (conversation history)            │   │ │
│  │ │  • LanguageSelector                              │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ WebRTC/Realtime
┌─────────────────────────────────────────────────────────────┐
│                 Pipecat Server (Python)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Realtime Pipeline                                      │ │
│  │  • Microphone Input → VAD                              │ │
│  │  • STT (Sarvam) → LLM → Speech Normalizer             │ │
│  │  • TTS (Sarvam) → Speaker Output                       │ │
│  │  • Barge-in Detection → Interrupt Handler             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↓             ↓             ↓             ↓
    Sarvam STT    Sarvam TTS     LLM API      Session DB
```

---

## Project Structure

```
dishika/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── voice/
│   │   └── page.tsx              # Voice session page
│   ├── layout.tsx                # Root layout with VoiceProvider
│   └── globals.css               # Global styles
├── components/
│   └── voice/
│       ├── VoiceOrb.tsx          # Animated orb component
│       ├── VoiceControls.tsx     # Control buttons
│       ├── VoiceSession.tsx      # Main voice page container
│       ├── Transcript.tsx        # Conversation history panel
│       └── LanguageSelector.tsx  # Language dropdown
├── lib/
│   ├── types/
│   │   └── voice.ts              # TypeScript types & interfaces
│   ├── constants/
│   │   └── languages.ts          # Language configuration
│   ├── hooks/
│   │   └── useVoiceState.ts      # Voice state hook
│   └── context/
│       └── VoiceContext.tsx      # State management (React Context)
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## Prerequisites

- **Node.js 18+** with npm or yarn
- **Python 3.11+** (for Pipecat server, Phase 2+)
- **Sarvam API Key** (https://dashboard.sarvam.ai)
- **LLM API Key** (OpenAI, Anthropic, or other configured provider)
- **Pipecat** (community or official integration)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Harshhdhankhar/dishika.git
cd dishika
```

### 2. Install frontend dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your API keys:

```env
# Pipecat Server (Phase 2+)
NEXT_PUBLIC_PIPECAT_URL=http://localhost:8000

# Sarvam API
SARVAM_API_KEY=your_sarvam_api_key

# LLM Configuration
LLM_API_KEY=your_llm_api_key
LLM_MODEL=gpt-4-turbo  # or other model
LLM_PROVIDER=openai     # or anthropic, etc.

# PS 26088 RAG (Phase 8+)
RAG_API_URL=http://your-rag-backend:5000
```

---

## Development

### Start the frontend development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm run start
```

---

## Phase 1: Frontend UI (Complete ✓)

This phase includes:
- ✅ Landing page with voice orb
- ✅ Voice session page
- ✅ Animated voice orb with 7 states
- ✅ Voice controls (mute, language, transcript)
- ✅ Transcript panel
- ✅ Language selector
- ✅ State management (React Context)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Beautiful DISHIKA visual identity

**What to test:**
- Landing page loads
- "Start Voice" button navigates to voice session
- Orb displays and animates
- Voice controls are responsive
- Language selector works
- Transcript panel opens/closes
- State changes trigger animations

---

## Phase 2: Pipecat Server (Next)

**In progress:**
- Set up Python Pipecat server
- Configure WebRTC transport
- Integrate Sarvam STT
- Integrate LLM
- Integrate Sarvam TTS
- Test browser ↔ server connection

---

## Phase 3-12: Full Pipeline Implementation

See the main requirements document for detailed phase breakdown.

---

## Voice States & Animations

The `VoiceOrb` component responds to the following states:

| State | Animation | Visual |
|-------|-----------|--------|
| **idle** | Slow vertical float (±10px over 4s) | Cyan-teal gradient, subtle glow |
| **connecting** | Pulse scale (1 → 1.1 → 1 over 1.5s) | Expanding pulse rings |
| **listening** | Reacts to audio level (scale 0-15%) | Cyan/blue pulse on rings |
| **thinking** | Slow rotation + scale pulse | Rotating orb, expanding/contracting |
| **speaking** | Reacts to audio level (scale 0-20%) | Dynamic scale based on output |
| **interrupted** | Flash red, snap to listening | Red flash → return to cyan |
| **error** | Static, red tint | Red orb with error indicator (!) |

All animations use **Framer Motion** for smooth, GPU-accelerated performance.

---

## Configuration

### Language Support

Edit `lib/constants/languages.ts` to add more languages:

```typescript
export const SUPPORTED_LANGUAGES = [
  {
    code: 'hi',
    name: 'हिंदी (Hindi)',
    sttLanguage: 'hi-IN',
    ttsLanguage: 'hi-IN',
  },
  // Add more here
];
```

### Voice State

The voice state is managed globally via React Context. Access it anywhere:

```typescript
import { useVoiceState } from '@/lib/hooks/useVoiceState';

function MyComponent() {
  const { state, language, micMuted, setMicMuted } = useVoiceState();
  // Use state and methods
}
```

---

## API Integration (Phase 2+)

When the Pipecat server is ready, the frontend will:

1. Establish WebRTC connection
2. Stream microphone audio to `/audio` endpoint
3. Receive transcripts, state updates, and TTS audio
4. Display real-time changes to the UI

No changes needed to Phase 1 frontend components—they're designed to work with the backend.

---

## Troubleshooting

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

### Tailwind styles not loading

Restart the dev server and clear `.next` folder:

```bash
rm -rf .next
npm run dev
```

### TypeScript errors

Ensure your `tsconfig.json` has strict mode enabled. Verify all imports use correct paths.

---

## Performance Optimization

- ✅ Framer Motion animations use GPU acceleration
- ✅ React Context avoids unnecessary re-renders with `useCallback`
- ✅ Components are code-split by Next.js
- ✅ CSS is optimized by Tailwind
- ✅ No external analytics or tracking (privacy-first)

---

## Accessibility

- ✅ All buttons have `aria-label` attributes
- ✅ Visual states are clearly indicated (not just animation)
- ✅ Keyboard navigation supported
- ✅ High contrast colors (WCAG AA compliant)
- ✅ Readable typography (16px base, proper line heights)

---

## Future: PS 26088 RAG Integration

The architecture is designed to support a knowledge retrieval layer:

```typescript
// Future implementation
import { answerUser } from '@/lib/services/answerUser';

const response = await answerUser(
  userMessage,
  conversationHistory,
  language
);
// This will internally:
// 1. Retrieve PS 26088 knowledge
// 2. Generate contextual responses
// 3. Return speech-normalized output
```

No changes needed to voice components.

---

## Support & Contribution

For issues, questions, or contributions:

1. Open an issue on GitHub
2. Submit a pull request
3. Join our community Discord (coming soon)

---

## License

MIT License - See LICENSE file

---

## Acknowledgments

- **Pipecat**: Realtime voice pipeline framework
- **Sarvam AI**: Indian language STT/TTS
- **SIH 2026**: Problem Statement 26088
- **Next.js & Tailwind**: Frontend framework & styling
- **Framer Motion**: Animation library

---

**Built with ❤️ for Indian Cooperatives**
