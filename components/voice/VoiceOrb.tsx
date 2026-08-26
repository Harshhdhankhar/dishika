'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useVoiceState } from '@/lib/hooks/useVoiceState';

interface VoiceOrbProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 120,
  md: 200,
  lg: 280,
};

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ size = 'md' }) => {
  const { state, audioLevel } = useVoiceState();
  const diameter = sizeMap[size];
  const radius = diameter / 2;

  // Animation variants for different states
  const variants = {
    idle: {
      y: [-10, 10, -10],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
    connecting: {
      scale: [1, 1.1, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
    listening: {
      scale: 1 + audioLevel * 0.15,
      transition: { duration: 0.1 },
    },
    thinking: {
      rotate: 360,
      scale: [1, 1.05, 1],
      transition: {
        rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
        scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    speaking: {
      scale: 1 + audioLevel * 0.2,
      transition: { duration: 0.1 },
    },
    interrupted: {
      scale: [1, 0.95, 1],
      backgroundColor: ['#06b6d4', '#ef4444', '#06b6d4'],
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    error: {
      scale: 1,
      backgroundColor: '#ef4444',
    },
  };

  const getBackgroundColor = () => {
    if (state === 'error') return '#ef4444';
    if (state === 'interrupted') return '#f87171';
    return 'url(#orbGradient)';
  };

  return (
    <div className="flex items-center justify-center">
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        className="drop-shadow-2xl"
      >
        <defs>
          <radialGradient id="orbGradient">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0f766e" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow rings */}
        {state !== 'error' && (
          <>
            <motion.circle
              cx={radius}
              cy={radius}
              r={radius * 0.7}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              opacity="0.3"
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={state === 'connecting' ? { scale: [0.8, 1.2], opacity: [0.3, 0] } : {}}
              transition={state === 'connecting' ? { duration: 1.5, repeat: Infinity } : {}}
            />
            <motion.circle
              cx={radius}
              cy={radius}
              r={radius * 0.85}
              fill="none"
              stroke="#0369a1"
              strokeWidth="1"
              opacity="0.2"
              animate={state === 'listening' || state === 'speaking' ? { opacity: [0.2, 0.5, 0.2] } : {}}
              transition={state === 'listening' || state === 'speaking' ? { duration: 0.5, repeat: Infinity } : {}}
            />
          </>
        )}

        {/* Main orb */}
        <motion.circle
          cx={radius}
          cy={radius}
          r={radius}
          fill={getBackgroundColor()}
          filter="url(#glow)"
          animate={state}
          variants={variants}
          className="cursor-pointer"
          style={{
            filter: `drop-shadow(0 0 ${state === 'error' ? '20px' : '30px'} rgba(${state === 'error' ? '239, 68, 68' : '6, 182, 212'}, ${state === 'error' ? 0.6 : 0.4})`,
          }}
        />

        {/* Error icon overlay */}
        {state === 'error' && (
          <text
            x={radius}
            y={radius}
            textAnchor="middle"
            dy="0.3em"
            fontSize={diameter * 0.4}
            fill="white"
            fontWeight="bold"
          >
            !
          </text>
        )}

        {/* State indicator text */}
        {state === 'listening' && (
          <motion.text
            x={radius}
            y={radius + diameter * 0.15}
            textAnchor="middle"
            fontSize={diameter * 0.1}
            fill="#0f766e"
            fontWeight="600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ○
          </motion.text>
        )}
      </svg>
    </div>
  );
};
