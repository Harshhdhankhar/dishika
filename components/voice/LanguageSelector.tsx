'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useVoiceState } from '@/lib/hooks/useVoiceState';
import { SUPPORTED_LANGUAGES } from '@/lib/constants/languages';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useVoiceState();
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="p-3">
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2 px-2">
          Language
        </p>
        <div className="space-y-1">
          {SUPPORTED_LANGUAGES.map(lang => (
            <motion.button
              key={lang.code}
              onClick={() => setLanguage(lang.code as any)}
              className={`w-full text-left px-3 py-2 rounded transition-all duration-200 ${
                language === lang.code
                  ? 'bg-dishika-accent text-white font-medium'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              {lang.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
