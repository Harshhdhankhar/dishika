'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { VoiceOrb } from '@/components/voice/VoiceOrb';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartVoice = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/voice');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dishika-light via-white to-blue-50 flex flex-col items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-dishika-accent to-dishika-secondary rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-dishika-primary to-dishika-accent rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-12 max-w-2xl"
      >
        {/* Header */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-dishika-primary to-dishika-secondary bg-clip-text text-transparent mb-4"
          >
            DISHIKA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-slate-700 font-medium mb-2"
          >
            Your Cooperative AI Assistant
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-slate-600 text-base md:text-lg max-w-lg mx-auto leading-relaxed"
          >
            Experience natural, continuous voice conversations about cooperative societies, PACS, and government services.
          </motion.p>
        </div>

        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="my-8"
        >
          <VoiceOrb size="lg" />
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full my-8"
        >
          {[
            {
              icon: '🎙️',
              title: 'Natural Voice',
              description: 'Speak naturally in Hindi, English, or Hinglish',
            },
            {
              icon: '⚡',
              title: 'Real-time Response',
              description: 'Get instant answers with zero latency',
            },
            {
              icon: '🤝',
              title: 'Interruption Support',
              description: 'Ask follow-up questions anytime',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <p className="text-3xl mb-3">{feature.icon}</p>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartVoice}
          disabled={isLoading}
          className="relative px-8 py-4 bg-gradient-to-r from-dishika-accent to-dishika-secondary text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 text-lg disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Starting...
            </>
          ) : (
            <>
              🎤 Start Voice
              <ChevronRight size={20} />
            </>
          )}
        </motion.button>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-6 mt-8 text-sm text-slate-600 flex-wrap justify-center"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span>Privacy First</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🇮🇳</span>
            <span>Indian AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <span>Realtime Tech</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 text-center text-xs text-slate-500"
      >
        <p>SIH 2026 Problem Statement 26088 | Built with ❤️ for Indian Cooperatives</p>
      </motion.footer>
    </div>
  );
}
