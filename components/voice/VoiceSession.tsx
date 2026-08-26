'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVoiceState } from '@/lib/hooks/useVoiceState';
import { VoiceOrb } from './VoiceOrb';
import { VoiceControls } from './VoiceControls';
import { Transcript } from './Transcript';
import { useRouter } from 'next/navigation';

interface VoiceSessionProps {
  onTranscriptClick?: () => void;
}

export const VoiceSession: React.FC<VoiceSessionProps> = () => {
  const { state, error, reset } = useVoiceState();
  const router = useRouter();
  const [showTranscript, setShowTranscript] = useState(false);

  const handleEndSession = () => {
    reset();
    router.push('/');
  };

  // Simulate state transitions for demo
  useEffect(() => {
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Auto-advance through states for demonstration
    };
    // Uncomment to enable auto-sequence:
    // sequence();
  }, []);

  return (
    <>
      <Transcript />
      <div className="min-h-screen bg-gradient-to-br from-dishika-light via-white to-blue-50 flex flex-col items-center justify-center p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            DISHIKA
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Your Cooperative AI Assistant
          </p>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-12 w-full max-w-md"
        >
          {/* Orb */}
          <div className="relative">
            <VoiceOrb size="lg" />

            {/* State indicator text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-sm font-medium text-slate-600 capitalize">
                {state === 'idle' ? '📍 Ready' : ''}
                {state === 'connecting' ? '🔄 Connecting...' : ''}
                {state === 'listening' ? '👂 Listening...' : ''}
                {state === 'thinking' ? '🧠 Processing...' : ''}
                {state === 'speaking' ? '🗣️ Speaking...' : ''}
                {state === 'interrupted' ? '⏸️ Interrupted' : ''}
                {state === 'error' ? '❌ Error' : ''}
              </p>
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="mt-20 pt-8">
            <VoiceControls
              onEndSession={handleEndSession}
              onTranscriptClick={() => setShowTranscript(!showTranscript)}
            />
          </div>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs text-slate-500"
        >
          <p>SIH 2026 Problem Statement 26088</p>
        </motion.div>
      </div>
    </>
  );
};
