export type VoiceState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'interrupted' | 'error';

export type Language = 'hi' | 'en' | 'hinglish';

export interface TranscriptEntry {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface VoiceContextType {
  state: VoiceState;
  language: Language;
  micMuted: boolean;
  speakerMuted: boolean;
  transcript: TranscriptEntry[];
  audioLevel: number; // 0-1
  error?: string;
  
  setState: (state: VoiceState) => void;
  setLanguage: (language: Language) => void;
  setMicMuted: (muted: boolean) => void;
  setSpeakerMuted: (muted: boolean) => void;
  addTranscript: (entry: TranscriptEntry) => void;
  clearTranscript: () => void;
  setAudioLevel: (level: number) => void;
  setError: (error?: string) => void;
  reset: () => void;
}
