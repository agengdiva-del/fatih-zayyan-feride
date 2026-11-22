import React from 'react';
import { motion } from 'motion/react';
import { BookOpenCheck, Gamepad2, PlayCircle, Sparkles } from 'lucide-react';
import { GradeNumber, StudentProfile, SubjectId } from '../types';
import { SUBJECTS } from '../data/curriculum';
import { KidAvatar, SchoolhouseIllustration, SubjectIconTile } from './CartoonArt';
import { soundFX } from '../utils/sound';

interface DashboardScreenProps {
  profile: StudentProfile;
  selectedGrade: GradeNumber;
  onSelectGrade: (grade: GradeNumber) => void;
  onSelectSubject: (subjectId: SubjectId) => void;
  onStartGradeQuiz: (grade: GradeNumber) => void;
  onOpenVideo: () => void;
  onOpenGames: () => void;
}

function getLevelTitle(xp: number): string {
  if (xp >= 2000) return 'Bintang Kelas';
  if (xp >= 1200) return 'Level Hebat';
  if (xp >= 700) return 'Juara Muda';
  return 'Pemula Ceria';
}

export function DashboardScreen({
  profile,
  selectedGrade,
  onSelectGrade,
  onSelectSubject,
  onStartGradeQuiz,
  onOpenVideo,
  onOpenGames,
}: DashboardScreenProps) {
  const formattedXP = profile.xp.toLocaleString('id-ID');

  return (
    <div className="space-y-6 pb-8">
      {/* Sky-to-Meadow Greeting Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#BBF7D0] p-6 sm:p-8 card-kid border-2 border-white"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0F172A] tracking-tight">
              Halo, {profile.name}! <span className="inline-block animate-bounce">🤖</span>
            </h1>
            <p className="mt-1 text-lg sm:text-xl font-bold text-[#1E3A8A]">
              Ayo belajar bersama robot pintar hari ini!
            </p>
            <p className="mt-1 text-sm font-bold text-[#0369A1]">
              {profile.gradeBand || profile.grade} · {profile.sekolah} · {profile.daerah}
            </p>
          </div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="self-end sm:self-center shrink-0"
          >
            <KidAvatar avatarId={profile.avatarId} mood="waving" size={104} className="drop-shadow-md" />
          </motion.div>
        </div>

        <div className="pointer-events-none absolute -bottom-2 left-0 w-56 opacity-50 hidden sm:block">
          <SchoolhouseIllustration />
        </div>
      </motion.div>

      {/* Stat Cards & Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 card-kid border border-sky-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shrink-0">
            ⭐
          </div>
          <div>
            <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tabular-nums">
              {formattedXP}
            </div>
            <div className="text-sm font-bold text-slate-500">Poin Belajar</div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 card-kid border border-sky-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
            <svg width="34" height="34" viewBox="0 0 36 36" aria-hidden="true">
              <rect x="4" y="18" width="7" height="14" rx="2" fill="#38BDF8" />
              <rect x="14" y="11" width="7" height="21" rx="2" fill="#0284C7" />
              <rect x="24" y="5" width="7" height="27" rx="2" fill="#10B981" />
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
              {getLevelTitle(profile.xp)}
            </div>
            <div className="text-sm font-bold text-slate-500">Status Siswa</div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-5 card-kid border border-sky-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-bold text-base sm:text-lg text-slate-900">
              Progres Belajar Minggu Ini
            </span>
            <span className="font-display font-bold text-lg text-[#16A34A] tabular-nums">
              {profile.weeklyProgress}%
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profile.weeklyProgress}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981]"
            />
          </div>
        </div>
      </div>

      {/* Database Kuis SD Kelas 1 sampai Kelas 6 */}
      <div className="bg-white rounded-[24px] p-5 card-kid border-2 border-sky-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#1D4ED8] flex items-center justify-center shrink-0">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900">
                Database Kuis Kelas 1 – 6 SD
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                Pilih jenjang kelas untuk latihan soal lengkap semua mata pelajaran
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onStartGradeQuiz(selectedGrade);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-display font-bold text-base btn-3d-green cursor-pointer whitespace-nowrap shrink-0"
          >
            Mulai Kuis Kelas {selectedGrade}
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {([1, 2, 3, 4, 5, 6] as GradeNumber[]).map((g) => {
            const active = selectedGrade === g;
            const ownerHint =
              g <= 2 ? 'Feride' : g <= 4 ? 'Zayyan' : 'Fatih';
            return (
              <button
                key={g}
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  onSelectGrade(g);
                }}
                className={`py-2.5 px-2 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  active
                    ? 'bg-[#2563EB] border-[#1D4ED8] text-white shadow-md scale-[1.03]'
                    : 'bg-sky-50/70 border-sky-100 text-slate-800 hover:bg-sky-100'
                }`}
              >
                <div className="font-display font-bold text-base sm:text-lg">Kelas {g}</div>
                <div className={`text-[11px] font-bold ${active ? 'text-sky-100' : 'text-slate-500'}`}>
                  {ownerHint} SD
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Mata Pelajaran Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
            Pilih Mata Pelajaran
          </h2>
          <span className="text-sm font-bold text-sky-700">Kelas {selectedGrade} SD</span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {SUBJECTS.map((subj, idx) => (
            <motion.button
              key={subj.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                soundFX.playTap();
                onSelectSubject(subj.id);
              }}
              className="bg-white rounded-2xl p-3 sm:p-4 card-kid border-2 border-transparent hover:border-sky-300 flex flex-col items-center text-center cursor-pointer min-h-[120px] justify-center transition-colors"
            >
              <SubjectIconTile subjectId={subj.id} size={58} />
              <span className="mt-2.5 font-display font-bold text-sm sm:text-base text-slate-900 leading-tight">
                {subj.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Shortcuts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onOpenVideo();
          }}
          className="group bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-2xl p-5 text-left text-white card-kid flex items-center justify-between gap-4 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl">
              <PlayCircle className="w-6 h-6" />
              <span>Video Pembelajaran</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-blue-100">
              Tonton animasi Belajar Pecahan, Bangun Datar & Satuan Panjang!
            </p>
          </div>
          <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">🎬</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onOpenGames();
          }}
          className="group bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-5 text-left text-white card-kid flex items-center justify-between gap-4 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl">
              <Gamepad2 className="w-6 h-6" />
              <span>Game Edukasi</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-emerald-100">
              Main Tangkap Huruf, Tebak Angka, Susun Kata & Puzzle Hewan!
            </p>
          </div>
          <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </span>
        </button>
      </div>
    </div>
  );
}
