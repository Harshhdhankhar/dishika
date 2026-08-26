'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Settings,
  MessageCircle,
} from 'lucide-react';
import { useVoiceState } from '@/lib/hooks/useVoiceState';
import { LanguageSelector } from './LanguageSelector';

interface VoiceControlsProps {
  onEndSession?: () => void;
  onTranscriptClick?: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onEndSession,
  onTranscriptClick,
}) => {
  const { micMuted, speakerMuted, setMicMuted, setSpeakerMuted } =
    useVoiceState();
  const [showLanguage, setShowLanguage] = useState(false);

  const controlButtonClass =
    'flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 active:scale-95';
  const activeClass =
    'bg-dishika-accent text-white shadow-lg shadow-dishika-accent/50';
  const inactiveClass = 'bg-slate-200 text-slate-700 hover:bg-slate-300';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main control buttons */}
      <div className="flex items-center gap-4 md:gap-8">
        {/* Microphone toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMicMuted(!micMuted)}
          className={`${controlButtonClass} ${micMuted ? inactiveClass : activeClass}`}
          aria-label={micMuted ? 'Unmute microphone' : 'Mute microphone'}
          title={micMuted ? 'Microphone muted' : 'Microphone active'}
        >
          {micMuted ? (
            <MicOff size={20} />
          ) : (
            <Mic size={20} />
          )}
        </motion.button>

        {/* Speaker toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSpeakerMuted(!speakerMuted)}
          className={`${controlButtonClass} ${speakerMuted ? inactiveClass : activeClass}`}
          aria-label={speakerMuted ? 'Unmute speaker' : 'Mute speaker'}
          title={speakerMuted ? 'Speaker muted' : 'Speaker active'}
        >
          {speakerMuted ? (
            <VolumeX size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </motion.button>

        {/* Language settings */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLanguage(!showLanguage)}
            className={`${controlButtonClass} ${inactiveClass}`}
            aria-label="Language settings"
            title="Select language"
          >
            <Settings size={20} />
          </motion.button>
          <AnimatePresence>
            {showLanguage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2"
              >
                <LanguageSelector />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Transcript button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onTranscriptClick}
          className={`${controlButtonClass} ${inactiveClass}`}
          aria-label="View transcript"
          title="View conversation transcript"
        >
          <MessageCircle size={20} />
        </motion.button>
      </div>

      {/* End session button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onEndSession}
        className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-lg hover:shadow-red-500/50"
        aria-label="End voice session"
      >
        <X size={20} />
        <span className="hidden sm:inline">End Session</span>
      </motion.button>
    </div>
  );
};
