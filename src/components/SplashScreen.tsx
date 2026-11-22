import React from 'react';
import { motion } from 'motion/react';
import { AppLogo, TrioIllustration } from './CartoonArt';
import { soundFX } from '../utils/sound';

interface SplashScreenProps {
  onStart: () => void;
}

export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#93D5FF] via-[#D6F0FF] to-[#E6F8E6] flex flex-col items-center justify-between px-6 py-8 sm:py-12">
      {/* Decorative Clouds */}
      <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-between px-6 sm:px-20 opacity-90">
        <div className="animate-drift-cloud w-28 h-12 rounded-full bg-white/80 blur-[1px] shadow-sm" />
        <div className="animate-drift-cloud w-36 h-14 rounded-full bg-white/75 blur-[1px] shadow-sm mt-6" />
      </div>

      {/* Floating Stars & Paper Plane */}
      <motion.div
        animate={{ x: [0, 14, 0], y: [0, -8, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-6 sm:left-24 top-32 text-3xl sm:text-4xl select-none"
        aria-hidden="true"
      >
        ✈️
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-8 sm:right-28 top-40 text-2xl sm:text-3xl select-none"
        aria-hidden="true"
      >
        ⭐
      </motion.div>

      {/* Top Logo & Motto */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center mt-4 sm:mt-8"
      >
        <AppLogo size="lg" showSun />
        <p className="mt-4 text-lg sm:text-2xl font-bold text-[#1E3A8A] tracking-tight">
          Belajar, Bermain, Meraih Cita-cita
        </p>
      </motion.div>

      {/* Center Cartoon Kids Trio + Grassy Mound */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="relative z-10 my-6 flex flex-col items-center w-full max-w-lg"
      >
        <div className="relative w-full flex justify-center">
          <TrioIllustration />
        </div>
        {/* Green Hill Strip */}
        <div className="w-72 sm:w-96 h-7 -mt-2 rounded-full bg-gradient-to-r from-[#4ADE80] via-[#22C55E] to-[#4ADE80] shadow-md opacity-90" />
      </motion.div>

      {/* Bottom CTA Button & Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center text-center pb-4"
      >
        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onStart();
          }}
          className="w-full py-4 px-8 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-display font-bold text-2xl tracking-wide btn-3d-green cursor-pointer min-h-[56px]"
        >
          Mulai
        </button>

        <p className="mt-5 text-sm sm:text-base font-bold text-[#1E3A8A]">
          Karena Setiap Anak
          <br />
          Punya Potensi Luar Biasa <span aria-hidden="true">❤️</span>
        </p>
      </motion.div>

      {/* Grassy Bottom Ground */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#4ADE80]/50 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
