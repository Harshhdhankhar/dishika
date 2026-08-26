'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { VoiceContextType, VoiceState, Language, TranscriptEntry } from '@/lib/types/voice';
import { DEFAULT_LANGUAGE } from '@/lib/constants/languages';

const initialState: Omit<VoiceContextType, 'setState' | 'setLanguage' | 'setMicMuted' | 'setSpeakerMuted' | 'addTranscript' | 'clearTranscript' | 'setAudioLevel' | 'setError' | 'reset'> = {
  state: 'idle',
  language: DEFAULT_LANGUAGE,
  micMuted: false,
  speakerMuted: false,
  transcript: [],
  audioLevel: 0,
  error: undefined,
};

export const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider = ({ children }: { children: ReactNode }) => {
  const [state, setStateLocal] = useState<VoiceState>(initialState.state);
  const [language, setLanguageLocal] = useState<Language>(initialState.language);
  const [micMuted, setMicMutedLocal] = useState(initialState.micMuted);
  const [speakerMuted, setSpeakerMutedLocal] = useState(initialState.speakerMuted);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(initialState.transcript);
  const [audioLevel, setAudioLevelLocal] = useState(initialState.audioLevel);
  const [error, setErrorLocal] = useState(initialState.error);

  const setState = useCallback((newState: VoiceState) => setStateLocal(newState), []);
  const setLanguage = useCallback((newLanguage: Language) => setLanguageLocal(newLanguage), []);
  const setMicMuted = useCallback((muted: boolean) => setMicMutedLocal(muted), []);
  const setSpeakerMuted = useCallback((muted: boolean) => setSpeakerMutedLocal(muted), []);
  const setAudioLevel = useCallback((level: number) => setAudioLevelLocal(Math.max(0, Math.min(1, level))), []);
  const setError = useCallback((err?: string) => setErrorLocal(err), []);

  const addTranscript = useCallback((entry: TranscriptEntry) => {
    setTranscript(prev => [...prev, entry]);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  const reset = useCallback(() => {
    setStateLocal(initialState.state);
    setLanguageLocal(initialState.language);
    setMicMutedLocal(initialState.micMuted);
    setSpeakerMutedLocal(initialState.speakerMuted);
    setTranscript(initialState.transcript);
    setAudioLevelLocal(initialState.audioLevel);
    setErrorLocal(initialState.error);
  }, []);

  const value: VoiceContextType = {
    state,
    language,
    micMuted,
    speakerMuted,
    transcript,
    audioLevel,
    error,
    setState,
    setLanguage,
    setMicMuted,
    setSpeakerMuted,
    addTranscript,
    clearTranscript,
    setAudioLevel,
    setError,
    reset,
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};
