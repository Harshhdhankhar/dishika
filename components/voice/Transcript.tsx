'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { useVoiceState } from '@/lib/hooks/useVoiceState';

export const Transcript: React.FC = () => {
  const { transcript } = useVoiceState();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button for mobile */}
      <div className="md:hidden fixed bottom-8 right-8 z-40">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 bg-dishika-accent text-white rounded-full shadow-lg hover:shadow-lg hover:shadow-dishika-accent/50"
          aria-label="Toggle transcript"
        >
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>
      </div>

      {/* Transcript panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-8 md:bottom-auto md:right-8 md:top-8 w-80 max-h-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Conversation</h3>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
                aria-label="Close transcript"
              >
                <X size={18} className="text-slate-600" />
              </motion.button>
            </div>

            {/* Transcript content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transcript.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">
                  No conversation yet
                </p>
              ) : (
                transcript.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-sm rounded-lg px-3 py-2 ${
                      entry.role === 'user'
                        ? 'bg-dishika-accent/10 text-slate-900 border-l-2 border-dishika-accent'
                        : 'bg-slate-100 text-slate-800 border-l-2 border-slate-400'
                    }`}
                  >
                    <p className="font-medium text-xs mb-1 uppercase opacity-60">
                      {entry.role}
                    </p>
                    <p className="leading-relaxed">{entry.text}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
