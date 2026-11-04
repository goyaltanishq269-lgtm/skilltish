'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';

export default function SplashLoader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('skilltish_splash_viewed');
      if (!shown) {
        setIsVisible(true);
        const timer = setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem('skilltish_splash_viewed', 'true');
        }, 1100);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-zinc-950/90 backdrop-blur-xl z-[100] fixed inset-0 flex flex-col items-center justify-center text-white pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-center px-4 space-y-4 max-w-md mx-auto"
          >
            {/* Brand Logo Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/25">
              <Award className="w-7 h-7" />
            </div>

            {/* Monospace Engineering Title & Creator */}
            <div className="space-y-1.5 font-mono">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider gradient-text uppercase">
                SKILLTISH / PROOF-OF-WORK PLATFORM
              </h1>

              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-zinc-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                </span>
                <span>
                  Designed &amp; Engineered by{' '}
                  <strong className="text-emerald-400 font-semibold">Tanishq Goyal</strong>
                </span>
              </div>
            </div>

            {/* 1.1s Smooth Horizontal Progress Line */}
            <div className="w-56 h-1 bg-white/10 rounded-full mx-auto overflow-hidden mt-3">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-emerald-400 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
