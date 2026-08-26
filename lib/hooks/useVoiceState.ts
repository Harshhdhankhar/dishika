'use client';

import { useContext } from 'react';
import { VoiceContext } from '@/lib/context/VoiceContext';
import { VoiceContextType } from '@/lib/types/voice';

export const useVoiceState = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoiceState must be used within VoiceProvider');
  }
  return context;
};
