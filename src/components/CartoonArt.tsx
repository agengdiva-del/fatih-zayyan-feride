import React from 'react';
import { motion } from 'motion/react';
import { AvatarId, SubjectId } from '../types';

export function AppLogo({ size = 'lg', showSun = true }: { size?: 'sm' | 'md' | 'lg'; showSun?: boolean }) {
  const sizes = {
    sm: 'text-2xl leading-[0.95]',
    md: 'text-4xl leading-[0.92]',
    lg: 'text-5xl sm:text-6xl leading-[0.9]',
  };
  const strokeClass = size === 'sm' ? 'logo-stroke-sm' : 'logo-stroke';

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {showSun && (
        <motion.div
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 -right-7 sm:-right-9 pointer-events-none"
          aria-hidden="true"
        >
          <svg width={size === 'sm' ? 32 : 44} height={size === 'sm' ? 32 : 44} viewBox="0 0 64 64">
            <g stroke="#FBBF24" strokeWidth="4" strokeLinecap="round">
              <line x1="32" y1="4" x2="32" y2="11" />
              <line x1="32" y1="53" x2="32" y2="60" />
              <line x1="4" y1="32" x2="11" y2="32" />
              <line x1="53" y1="32" x2="60" y2="32" />
              <line x1="12" y1="12" x2="17" y2="17" />
              <line x1="47" y1="47" x2="52" y2="52" />
              <line x1="52" y1="12" x2="47" y2="17" />
              <line x1="17" y1="47" x2="12" y2="52" />
            </g>
            <circle cx="32" cy="32" r="16" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="27" cy="30" r="2" fill="#92400E" />
            <circle cx="37" cy="30" r="2" fill="#92400E" />
            <path d="M27 36 Q32 40 37 36" fill="none" stroke="#92400E" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}
      <div className={`font-display font-bold tracking-tight text-center ${sizes[size]} ${strokeClass}`}>
        <div className="text-[#1D7AFC]">fatih</div>
        <div className="text-[#FF8C1A] -mt-1">zayyan</div>
        <div className="text-[#EC4899] -mt-1">feride</div>
      </div>
    </div>
  );
}

export function KidAvatar({
  avatarId,
  photoUrl,
  mood = 'happy',
  size = 80,
  className = '',
}: {
  avatarId: AvatarId;
  photoUrl?: string | null;
  mood?: 'happy' | 'waving' | 'cheering' | 'thinking';
  size?: number;
  className?: string;
}) {
  const palette: Record<
    AvatarId,
    {
      bg: string;
      shell: string;
      shellDark: string;
      visor: string;
      eye: string;
      accent: string;
      ear: string;
      label: string;
    }
  > = {
    fatih: {
      bg: '#DBEAFE',
      shell: '#3B82F6',
      shellDark: '#1D4ED8',
      visor: '#0F172A',
      eye: '#38BDF8',
      accent: '#FACC15',
      ear: '#60A5FA',
      label: 'Robot Fatih',
    },
    zayyan: {
      bg: '#D1FAE5',
      shell: '#10B981',
      shellDark: '#047857',
      visor: '#064E3B',
      eye: '#6EE7B7',
      accent: '#FBBF24',
      ear: '#34D399',
      label: 'Robot Zayyan',
    },
    feride: {
      bg: '#FCE7F3',
      shell: '#F472B6',
      shellDark: '#DB2777',
      visor: '#3B0764',
      eye: '#F9A8D4',
      accent: '#FDE047',
      ear: '#EC4899',
      label: 'Robot Feride',
    },
    bintang: {
      bg: '#FEF3C7',
      shell: '#F59E0B',
      shellDark: '#D97706',
      visor: '#1E293B',
      eye: '#FDE047',
      accent: '#38BDF8',
      ear: '#FBBF24',
      label: 'Robot Bintang',
    },
    zahra: {
      bg: '#EDE9FE',
      shell: '#8B5CF6',
      shellDark: '#6D28D9',
      visor: '#1E1B4B',
      eye: '#C4B5FD',
      accent: '#F472B6',
      ear: '#A78BFA',
      label: 'Robot Zahra',
    },
  };

  const p = palette[avatarId] || palette.fatih;

  if (photoUrl) {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: p.bg }}
        className={`relative rounded-full overflow-hidden border-[3px] border-white shadow-md shrink-0 ${className}`}
      >
        <img
          src={photoUrl}
          alt={p.label}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-label={p.label}
    >
      {/* Circular Avatar Backdrop */}
      <circle cx="60" cy="60" r="56" fill={p.bg} stroke="#FFFFFF" strokeWidth="4" />

      {/* Top Antenna */}
      <line x1="60" y1="26" x2="60" y2="14" stroke={p.shellDark} strokeWidth="4" strokeLinecap="round" />
      {avatarId === 'feride' ? (
        /* Cute heart/orb antenna for Feride */
        <circle cx="60" cy="12" r="5.5" fill={p.ear} stroke="#FFFFFF" strokeWidth="1.8" />
      ) : avatarId === 'zayyan' ? (
        /* Sporty lightning/diamond antenna for Zayyan */
        <polygon points="60,6 66,13 60,19 54,13" fill={p.accent} stroke={p.shellDark} strokeWidth="1.5" />
      ) : (
        /* Glowing star-orb antenna for Fatih & others */
        <circle cx="60" cy="12" r="5.5" fill={p.accent} stroke={p.shellDark} strokeWidth="1.8" />
      )}

      {/* Robot Body / Shoulders */}
      <path d="M27 105 C28 84, 92 84, 93 105 Z" fill={p.shellDark} />
      <rect x="44" y="88" width="32" height="14" rx="6" fill={p.shell} stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Chest Power Core */}
      <circle cx="60" cy="95" r="4.5" fill={p.accent} />

      {/* Neck */}
      <rect x="52" y="75" width="16" height="11" rx="4" fill="#94A3B8" />

      {/* Robot Side Ear Pods / Headphones */}
      <rect x="21" y="45" width="10" height="22" rx="5" fill={p.ear} stroke={p.shellDark} strokeWidth="2" />
      <rect x="89" y="45" width="10" height="22" rx="5" fill={p.ear} stroke={p.shellDark} strokeWidth="2" />

      {/* Cute Bow / Ribbon on Feride's robot head */}
      {avatarId === 'feride' && (
        <g>
          <circle cx="38" cy="29" r="5.5" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="47" cy="26" r="5.5" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="42.5" cy="27.5" r="3" fill="#FDE047" />
        </g>
      )}

      {/* Robot Head Shell */}
      <rect
        x="29"
        y="26"
        width="62"
        height="52"
        rx="22"
        fill={p.shell}
        stroke={p.shellDark}
        strokeWidth="3"
      />

      {/* Sporty Visor Cap Stripe for Zayyan */}
      {avatarId === 'zayyan' && (
        <path d="M31 38 Q60 28 89 38 L89 33 C82 25, 38 25, 31 33 Z" fill="#2563EB" />
      )}

      {/* Metallic Forehead Highlight */}
      <path d="M40 31 H80" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.55" />

      {/* Dark LED Face Screen */}
      <rect x="36" y="38" width="48" height="32" rx="13" fill={p.visor} stroke="#FFFFFF" strokeWidth="1.8" />

      {/* Glowing LED Blush Cheeks */}
      <ellipse cx="43" cy="60" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.75" />
      <ellipse cx="77" cy="60" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.75" />

      {/* Expressive LED Eyes */}
      {mood === 'cheering' ? (
        <>
          <path d="M43 52 Q48 45 53 52" fill="none" stroke={p.eye} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M67 52 Q72 45 77 52" fill="none" stroke={p.eye} strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : mood === 'thinking' ? (
        <>
          <circle cx="48" cy="51" r="4.8" fill={p.eye} />
          <circle cx="72" cy="49" r="3.8" fill={p.eye} />
          <circle cx="49.5" cy="49.5" r="1.5" fill="#FFFFFF" />
        </>
      ) : (
        <>
          <circle cx="48" cy="51" r="5" fill={p.eye} />
          <circle cx="72" cy="51" r="5" fill={p.eye} />
          <circle cx="49.5" cy="49.5" r="1.7" fill="#FFFFFF" />
          <circle cx="73.5" cy="49.5" r="1.7" fill="#FFFFFF" />
        </>
      )}

      {/* LED Mouth */}
      {mood === 'cheering' ? (
        <path d="M51 60 Q60 68 69 60 Z" fill={p.accent} />
      ) : mood === 'thinking' ? (
        <line x1="54" y1="62" x2="66" y2="61" stroke={p.eye} strokeWidth="2.8" strokeLinecap="round" />
      ) : (
        <path d="M52 60 Q60 66 68 60" fill="none" stroke={p.eye} strokeWidth="2.8" strokeLinecap="round" />
      )}

      {/* Waving Robot Claw / Hand */}
      {mood === 'waving' && (
        <motion.g
          animate={{ rotate: [0, 18, -10, 18, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: '96px 86px' }}
        >
          <circle cx="99" cy="74" r="7.5" fill={p.shell} stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="99" cy="74" r="3" fill={p.accent} />
        </motion.g>
      )}

      {/* Cheering Stars */}
      {mood === 'cheering' && (
        <>
          <path d="M17 30 L20 36 L26 37 L21 41 L22 47 L17 44 L12 47 L13 41 L8 37 L14 36 Z" fill="#FACC15" />
          <path d="M101 26 L103 31 L108 32 L104 35 L105 40 L101 37 L97 40 L98 35 L94 32 L99 31 Z" fill="#FACC15" />
        </>
      )}
    </svg>
  );
}

export function TrioIllustration() {
  return (
    <div className="relative flex items-end justify-center gap-2 sm:gap-4 pt-2">
      {/* Feride Robot (Kelas 1-2 SD) */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        className="relative -mr-2 z-10 flex flex-col items-center"
      >
        <KidAvatar avatarId="feride" mood="happy" size={102} className="drop-shadow-md" />
        <div className="-mt-3 px-2.5 h-7 rounded-lg bg-pink-600 border-2 border-white shadow flex items-center justify-center text-white text-[11px] font-bold">
          Feride · 1-2 SD
        </div>
      </motion.div>

      {/* Fatih Robot (Kelas 4-6 SD) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-20 flex flex-col items-center"
      >
        <KidAvatar avatarId="fatih" mood="cheering" size={124} className="drop-shadow-lg" />
        <div className="-mt-3 px-3 h-8 rounded-lg bg-sky-600 border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold">
          Fatih · 4-6 SD
        </div>
      </motion.div>

      {/* Zayyan Robot (Kelas 3-4 SD) */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.9, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="relative -ml-2 z-10 flex flex-col items-center"
      >
        <KidAvatar avatarId="zayyan" mood="waving" size={102} className="drop-shadow-md" />
        <div className="-mt-3 px-2.5 h-7 rounded-lg bg-emerald-600 border-2 border-white shadow flex items-center justify-center text-white text-[11px] font-bold">
          Zayyan · 3-4 SD
        </div>
      </motion.div>
    </div>
  );
}

export function SchoolhouseIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 150" className={`w-full h-auto ${className}`} aria-hidden="true">
      {/* Meadow hills */}
      <path d="M0 125 Q90 95 180 120 Q270 95 360 122 L360 150 L0 150 Z" fill="#86EFAC" />
      <path d="M0 135 Q120 112 240 135 Q300 124 360 135 L360 150 L0 150 Z" fill="#4ADE80" />

      {/* Trees */}
      <rect x="34" y="94" width="10" height="32" rx="3" fill="#92400E" />
      <circle cx="39" cy="84" r="20" fill="#22C55E" />
      <circle cx="28" cy="90" r="13" fill="#16A34A" />

      <rect x="312" y="92" width="10" height="34" rx="3" fill="#92400E" />
      <circle cx="317" cy="82" r="21" fill="#22C55E" />
      <circle cx="330" cy="88" r="13" fill="#16A34A" />

      {/* Flagpole & Indonesian Merah Putih flag */}
      <rect x="268" y="40" width="4" height="84" rx="2" fill="#94A3B8" />
      <g className="animate-wave-flag">
        <rect x="272" y="42" width="38" height="12" fill="#EF4444" />
        <rect x="272" y="54" width="38" height="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
      </g>

      {/* School Building */}
      <rect x="92" y="64" width="176" height="62" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <path d="M80 68 L180 28 L280 68 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" strokeLinejoin="round" />
      <rect x="150" y="48" width="60" height="22" rx="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
      <text x="180" y="64" textAnchor="middle" fill="#1D4ED8" fontWeight="900" fontSize="14" fontFamily="Fredoka, sans-serif">
        SD
      </text>

      <rect x="164" y="88" width="32" height="38" rx="4" fill="#92400E" />
      <circle cx="190" cy="108" r="2.5" fill="#FACC15" />

      <rect x="110" y="84" width="32" height="24" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
      <line x1="126" y1="84" x2="126" y2="108" stroke="#0284C7" strokeWidth="1.5" />
      <rect x="218" y="84" width="32" height="24" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
      <line x1="234" y1="84" x2="234" y2="108" stroke="#0284C7" strokeWidth="1.5" />
    </svg>
  );
}

export function SubjectIconTile({ subjectId, size = 56 }: { subjectId: SubjectId; size?: number }) {
  if (subjectId === 'bahasa-indonesia') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#DBEAFE" />
        <path d="M14 20 C22 18, 28 20, 32 24 L32 48 C28 44, 22 42, 14 44 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        <path d="M50 20 C42 18, 36 20, 32 24 L32 48 C36 44, 42 42, 50 44 Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
        <line x1="19" y1="28" x2="27" y2="29" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="19" y1="34" x2="27" y2="35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="37" y1="29" x2="45" y2="28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="37" y1="35" x2="45" y2="34" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (subjectId === 'matematika') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#DCFCE7" />
        <rect x="14" y="14" width="16" height="16" rx="4" fill="#22C55E" />
        <rect x="34" y="14" width="16" height="16" rx="4" fill="#16A34A" />
        <rect x="14" y="34" width="16" height="16" rx="4" fill="#16A34A" />
        <rect x="34" y="34" width="16" height="16" rx="4" fill="#15803D" />
        <text x="22" y="26" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="900">+</text>
        <text x="42" y="26" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="900">−</text>
        <text x="22" y="46" textAnchor="middle" fill="#FFF" fontSize="13" fontWeight="900">×</text>
        <text x="42" y="46" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="900">÷</text>
      </svg>
    );
  }
  if (subjectId === 'ipa') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#E0F2FE" />
        <path d="M26 15 L38 15 L38 25 L48 44 C50 48 47 51 43 51 L21 51 C17 51 14 48 16 44 L26 25 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
        <path d="M21 37 L43 37 L47 45 C48 47 46 49 43 49 L21 49 C18 49 16 47 17 45 Z" fill="#38BDF8" />
        <circle cx="29" cy="43" r="2.2" fill="#FFFFFF" />
        <circle cx="36" cy="41" r="1.8" fill="#FFFFFF" />
        <rect x="24" y="13" width="16" height="4" rx="2" fill="#0284C7" />
      </svg>
    );
  }
  if (subjectId === 'ips') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#D1FAE5" />
        <circle cx="32" cy="30" r="16" fill="#38BDF8" stroke="#0369A1" strokeWidth="2" />
        <path d="M22 25 Q29 20 34 26 Q38 30 31 35 Q24 38 22 25 Z" fill="#22C55E" />
        <path d="M37 22 Q43 24 44 31 Q39 34 37 28 Z" fill="#16A34A" />
        <path d="M22 49 L42 49 M32 46 L32 49" stroke="#0369A1" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (subjectId === 'bahasa-inggris') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFE4E6" />
        <rect x="13" y="18" width="38" height="28" rx="6" fill="#1E3A8A" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M13 18 L51 46 M51 18 L13 46" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M13 18 L51 46 M51 18 L13 46" stroke="#EF4444" strokeWidth="2.5" />
        <path d="M32 18 L32 46 M13 32 L51 32" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M32 18 L32 46 M13 32 L51 32" stroke="#EF4444" strokeWidth="4" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FEF3C7" />
      <path
        d="M32 14 C20 14, 13 23, 13 33 C13 43, 21 50, 31 50 C35 50, 37 47, 37 44 C37 41, 35 40, 37 38 C39 36, 44 37, 48 34 C51 31, 51 24, 46 19 C42 15, 37 14, 32 14 Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="2"
      />
      <circle cx="23" cy="28" r="3.5" fill="#EF4444" />
      <circle cx="32" cy="22" r="3.5" fill="#3B82F6" />
      <circle cx="41" cy="27" r="3.5" fill="#22C55E" />
      <circle cx="24" cy="39" r="3.5" fill="#EC4899" />
    </svg>
  );
}

export function TrophyIllustration({ size = 110 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="18" cy="26" r="4" fill="#EC4899" />
      <circle cx="102" cy="28" r="4" fill="#3B82F6" />
      <circle cx="24" cy="68" r="3.5" fill="#10B981" />
      <circle cx="96" cy="64" r="3.5" fill="#F97316" />
      <path d="M30 16 L33 22 L39 23 L34 27 L35 33 L30 30 L25 33 L26 27 L21 23 L27 22 Z" fill="#FACC15" />
      <path d="M90 12 L92 17 L97 18 L93 21 L94 26 L90 23 L86 26 L87 21 L83 18 L88 17 Z" fill="#FACC15" />
      <path d="M32 32 C16 32, 16 60, 36 60" fill="none" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
      <path d="M88 32 C104 32, 104 60, 84 60" fill="none" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
      <path d="M32 24 L88 24 L82 62 C80 76, 40 76, 38 62 Z" fill="#FACC15" stroke="#D97706" strokeWidth="3" />
      <path d="M40 30 L50 30 L47 58 L39 58 Z" fill="#FEF08A" opacity="0.7" />
      <rect x="54" y="72" width="12" height="18" fill="#F59E0B" />
      <rect x="38" y="88" width="44" height="12" rx="4" fill="#D97706" />
      <rect x="44" y="92" width="32" height="4" rx="2" fill="#FDE047" />
    </svg>
  );
}

export function GameCardScene({
  gameId,
}: {
  gameId:
    | 'tangkap-huruf'
    | 'tebak-angka'
    | 'susun-kata'
    | 'puzzle-hewan'
    | 'hitung-roket'
    | 'tebak-warna'
    | 'cocok-budaya'
    | 'pancing-sains';
}) {
  if (gameId === 'tangkap-huruf') {
    return (
      <div className="relative flex items-center justify-between w-full h-28 px-2 overflow-hidden">
        <KidAvatar avatarId="fatih" mood="cheering" size={82} />
        <div className="flex flex-col gap-1.5 items-end">
          <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-white shadow font-display font-bold text-xl text-white flex items-center justify-center rotate-6">
            A
          </div>
          <div className="flex gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500 border-2 border-white shadow font-display font-bold text-xl text-white flex items-center justify-center -rotate-6">
              B
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500 border-2 border-white shadow font-display font-bold text-xl text-white flex items-center justify-center rotate-3">
              C
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (gameId === 'tebak-angka') {
    return (
      <div className="relative flex items-center justify-between w-full h-28 px-2 overflow-hidden">
        <KidAvatar avatarId="feride" mood="happy" size={82} />
        <div className="flex flex-col gap-1.5 items-end">
          <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white shadow font-display font-bold text-xl text-white flex items-center justify-center">
            1
          </div>
          <div className="flex gap-1.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white shadow font-display font-bold text-xl text-white flex items-center justify-center">
              2
            </div>
            <div className="w-10 h-10 rounded-full bg-violet-500 border-2 border-white shadow font-display font-bold text-xl text-white flex items-center justify-center">
              3
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (gameId === 'susun-kata') {
    return (
      <div className="relative flex items-center justify-between w-full h-28 px-2 overflow-hidden">
        <KidAvatar avatarId="zayyan" mood="waving" size={82} />
        <div className="flex flex-col items-end gap-1.5">
          <div className="w-10 h-10 rounded-xl bg-orange-400 border-2 border-white shadow font-display font-bold text-xl text-white flex items-center justify-center">
            B
          </div>
          <div className="flex gap-1">
            {['U', 'K', 'U'].map((l, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg bg-amber-300 border-2 border-white shadow font-display font-bold text-base text-amber-950 flex items-center justify-center"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (gameId === 'hitung-roket') {
    return (
      <div className="relative flex items-center justify-between w-full h-28 px-3 overflow-hidden">
        <div className="text-5xl drop-shadow">🚀</div>
        <div className="flex flex-col items-end gap-1">
          <div className="px-3 py-1 rounded-xl bg-white/90 text-indigo-900 font-display font-bold text-lg shadow">
            6 × 4 = ?
          </div>
          <div className="flex gap-1 text-xl">⭐⭐⭐</div>
        </div>
      </div>
    );
  }
  if (gameId === 'tebak-warna') {
    return (
      <div className="relative flex items-center justify-between w-full h-28 px-3 overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white shadow" />
          <span className="font-display font-bold text-white text-xl">+</span>
          <div className="w-10 h-10 rounded-full bg-yellow-300 border-2 border-white shadow" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-500 border-4 border-white shadow flex items-center justify-center font-display font-bold text-white text-xl">
          ?
        </div>
      </div>
    );
  }
  if (gameId === 'cocok-budaya') {
    return (
      <div className="relative flex items-center justify-between w-full h-28 px-3 overflow-hidden">
        <div className="text-5xl">🇮🇩</div>
        <div className="flex flex-col items-end gap-1">
          <div className="px-3 py-1 rounded-xl bg-white/95 text-rose-800 font-display font-bold text-sm shadow">
            Angklung · Batik
          </div>
          <div className="text-2xl">🥁🎭</div>
        </div>
      </div>
    );
  }
  if (gameId === 'pancing-sains') {
    return (
      <div className="relative flex items-center justify-between w-full h-28 px-3 overflow-hidden">
        <div className="text-5xl">🪐</div>
        <div className="flex flex-col items-end gap-1">
          <div className="px-3 py-1 rounded-xl bg-white/95 text-cyan-900 font-display font-bold text-sm shadow">
            Sains & Alam
          </div>
          <div className="text-2xl">🌱🐟☀️</div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex items-center justify-center w-full h-28 overflow-hidden">
      <svg viewBox="0 0 180 100" className="w-40 h-24" aria-hidden="true">
        <circle cx="54" cy="56" r="24" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2" />
        <ellipse cx="32" cy="54" rx="12" ry="18" fill="#60A5FA" stroke="#3B82F6" strokeWidth="2" />
        <path d="M68 58 Q82 58 80 74 Q78 80 72 78" fill="none" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" />
        <circle cx="52" cy="48" r="3" fill="#1E293B" />
        <circle cx="62" cy="48" r="3" fill="#1E293B" />
        <path d="M52 57 Q57 62 62 57" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <rect x="114" y="34" width="14" height="50" rx="6" fill="#FACC15" stroke="#D97706" strokeWidth="2" />
        <circle cx="122" cy="30" r="14" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
        <circle cx="116" cy="28" r="2.5" fill="#1E293B" />
        <circle cx="127" cy="28" r="2.5" fill="#1E293B" />
        <circle cx="121" cy="52" r="3" fill="#D97706" />
        <circle cx="120" cy="68" r="3.5" fill="#D97706" />
        <line x1="117" y1="12" x2="117" y2="18" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        <line x1="127" y1="12" x2="127" y2="18" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
