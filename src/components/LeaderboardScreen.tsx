import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ArrowLeft, ArrowUp, Globe, MapPin, School, Sparkles, Trophy } from 'lucide-react';
import { GradeNumber, LeaderboardEntry, StudentProfile } from '../types';
import { DAERAH_LIST, SEKOLAH_LIST } from '../data/quizDatabase';
import { KidAvatar } from './CartoonArt';
import { soundFX } from '../utils/sound';

type LeaderboardCategory = 'umum' | 'daerah' | 'sekolah';

interface LeaderboardScreenProps {
  onlineEntries: LeaderboardEntry[];
  activeProfile: StudentProfile;
  isGoogleSignedIn: boolean;
  onGoogleLogin: () => Promise<void>;
  onBack: () => void;
}

const RANK_MEMORY_KEY = 'fzf_last_leaderboard_rank_v1';

export function LeaderboardScreen({
  onlineEntries,
  activeProfile,
  isGoogleSignedIn,
  onGoogleLogin,
  onBack,
}: LeaderboardScreenProps) {
  const [category, setCategory] = useState<LeaderboardCategory>('umum');
  const [selectedDaerah, setSelectedDaerah] = useState<string>(activeProfile.daerah);
  const [selectedSekolah, setSelectedSekolah] = useState<string>(activeProfile.sekolah);
  const [gradeFilter, setGradeFilter] = useState<'all' | GradeNumber>('all');
  const [rankUpBanner, setRankUpBanner] = useState<{ from: number; to: number } | null>(null);
  const [syncPulse, setSyncPulse] = useState(false);

  const allDaerahOptions = useMemo(() => {
    const set = new Set<string>([...DAERAH_LIST, activeProfile.daerah]);
    onlineEntries.forEach((e) => {
      if (e.daerah) set.add(e.daerah);
    });
    return Array.from(set);
  }, [onlineEntries, activeProfile.daerah]);

  const allSekolahOptions = useMemo(() => {
    const set = new Set<string>([...SEKOLAH_LIST, activeProfile.sekolah]);
    onlineEntries.forEach((e) => {
      if (e.sekolah) set.add(e.sekolah);
    });
    return Array.from(set);
  }, [onlineEntries, activeProfile.sekolah]);

  const myUid = activeProfile.uid || `local-${activeProfile.id}`;

  const filteredList = useMemo(() => {
    const map = new Map<string, LeaderboardEntry>();
    onlineEntries.forEach((e) => map.set(e.uid, e));

    const existingMine = map.get(myUid);
    if (!existingMine || activeProfile.xp >= existingMine.xp) {
      map.set(myUid, {
        id: myUid,
        uid: myUid,
        displayName: activeProfile.name,
        avatarId: activeProfile.avatarId,
        customPhotoUrl: activeProfile.customPhotoUrl ?? existingMine?.customPhotoUrl ?? null,
        grade: activeProfile.gradeBand || activeProfile.grade,
        gradeNumber: activeProfile.gradeNumber,
        daerah: activeProfile.daerah,
        sekolah: activeProfile.sekolah,
        xp: activeProfile.xp,
        badgesCount: activeProfile.badgesCount,
        isOnlineSynced: Boolean(activeProfile.uid),
      });
    }

    let list = Array.from(map.values());

    if (category === 'daerah') {
      list = list.filter((e) => e.daerah === selectedDaerah);
    } else if (category === 'sekolah') {
      list = list.filter((e) => e.sekolah === selectedSekolah);
    }

    if (gradeFilter !== 'all') {
      list = list.filter((e) => e.gradeNumber === gradeFilter);
    }

    return list.sort((a, b) => b.xp - a.xp || a.displayName.localeCompare(b.displayName));
  }, [onlineEntries, activeProfile, myUid, category, selectedDaerah, selectedSekolah, gradeFilter]);

  const scopeKey = `${myUid}:${category}:${selectedDaerah}:${selectedSekolah}:${gradeFilter}`;
  const myIndex = filteredList.findIndex((s) => s.uid === myUid);
  const myCurrentRank = myIndex >= 0 ? myIndex + 1 : null;

  const prevRankByScopeRef = useRef<Record<string, number>>({});
  const lastSignatureRef = useRef<string>('');

  // Pulse indicator when live leaderboard data refreshes
  useEffect(() => {
    const sig = filteredList.map((s) => `${s.uid}:${s.xp}`).join('|');
    if (lastSignatureRef.current && lastSignatureRef.current !== sig) {
      setSyncPulse(true);
      const t = window.setTimeout(() => setSyncPulse(false), 1200);
      lastSignatureRef.current = sig;
      return () => window.clearTimeout(t);
    }
    lastSignatureRef.current = sig;
  }, [filteredList]);

  // Detect rank-up both live and across screen navigation
  useEffect(() => {
    if (myCurrentRank === null) return;

    let storedRanks: Record<string, number> = { ...prevRankByScopeRef.current };
    try {
      const raw = sessionStorage.getItem(RANK_MEMORY_KEY);
      if (raw) {
        storedRanks = { ...JSON.parse(raw), ...storedRanks };
      }
    } catch {
      // ignore storage errors
    }

    const previousRank = storedRanks[scopeKey];
    if (typeof previousRank === 'number' && myCurrentRank < previousRank) {
      setRankUpBanner({ from: previousRank, to: myCurrentRank });
      soundFX.playWin();
    }

    prevRankByScopeRef.current[scopeKey] = myCurrentRank;
    try {
      sessionStorage.setItem(
        RANK_MEMORY_KEY,
        JSON.stringify({ ...storedRanks, [scopeKey]: myCurrentRank })
      );
    } catch {
      // ignore storage errors
    }
  }, [scopeKey, myCurrentRank]);

  // Auto-hide rank-up banner after 6 seconds
  useEffect(() => {
    if (!rankUpBanner) return;
    const t = window.setTimeout(() => setRankUpBanner(null), 6000);
    return () => window.clearTimeout(t);
  }, [rankUpBanner]);

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onBack();
            }}
            className="w-11 h-11 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center text-slate-800 hover:bg-sky-50 cursor-pointer"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              Peringkat Online SD
            </h1>
            <p className="text-sm font-bold text-slate-500">
              Kategori Umum, Daerah, dan Sekolah se-Indonesia
            </p>
          </div>
        </div>

        <AnimatePresence>
          {syncPulse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diperbarui!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rank-Up Celebration Banner */}
      <AnimatePresence>
        {rankUpBanner && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="bg-gradient-to-r from-[#FEF08A] via-[#FDE047] to-[#86EFAC] rounded-2xl p-4 border-2 border-white shadow-md flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/90 flex items-center justify-center text-2xl shadow-sm shrink-0">
                🚀
              </div>
              <div>
                <div className="font-display font-bold text-lg text-slate-900">
                  Hore! Peringkat Kamu Naik! 🎉
                </div>
                <div className="text-sm font-bold text-emerald-900">
                  Kamu melesat dari posisi #{rankUpBanner.from} ke #{rankUpBanner.to}!
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-display font-bold text-sm flex items-center gap-1 shrink-0 shadow">
              <ArrowUp className="w-4 h-4 stroke-[3]" />
              <span>+{rankUpBanner.from - rankUpBanner.to}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Online Sync Prompt if playing offline/guest */}
      {!isGoogleSignedIn && (
        <div className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] rounded-2xl p-4 border-2 border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-sm font-bold text-[#1E3A8A]">
            🌐 Masuk dengan Google agar skor robotmu tampil dan tersimpan secara langsung di peringkat online!
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onGoogleLogin();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display font-bold text-sm btn-3d-blue cursor-pointer whitespace-nowrap shrink-0"
          >
            Sinkron Online (Google)
          </button>
        </div>
      )}

      {/* 3 Category Tabs: Umum, Daerah, Sekolah */}
      <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-sky-100 card-kid">
        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            setCategory('umum');
          }}
          className={`py-2.5 px-3 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'umum'
              ? 'bg-[#2563EB] text-white shadow'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>Umum</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            setCategory('daerah');
          }}
          className={`py-2.5 px-3 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'daerah'
              ? 'bg-[#16A34A] text-white shadow'
              : 'text-slate-600 hover:bg-emerald-50'
          }`}
        >
          <MapPin className="w-4 h-4 shrink-0" />
          <span>Daerah</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            setCategory('sekolah');
          }}
          className={`py-2.5 px-3 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'sekolah'
              ? 'bg-[#F59E0B] text-white shadow'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <School className="w-4 h-4 shrink-0" />
          <span>Sekolah</span>
        </button>
      </div>

      {/* Sub-Filters: Daerah / Sekolah Selector + Grade Filter */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 card-kid flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {category === 'daerah' && (
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Daerah</label>
            <select
              value={selectedDaerah}
              onChange={(e) => setSelectedDaerah(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white font-bold text-sm text-slate-900"
            >
              {allDaerahOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {category === 'sekolah' && (
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Sekolah</label>
            <select
              value={selectedSekolah}
              onChange={(e) => setSelectedSekolah(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white font-bold text-sm text-slate-900"
            >
              {allSekolahOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {category === 'umum' && (
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E3A8A]">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Peringkat Nasional Semua Siswa Robot SD</span>
          </div>
        )}

        <div className="sm:w-44">
          <label className="block text-xs font-bold text-slate-500 mb-1">Filter Kelas</label>
          <select
            value={gradeFilter}
            onChange={(e) =>
              setGradeFilter(e.target.value === 'all' ? 'all' : (Number(e.target.value) as GradeNumber))
            }
            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white font-bold text-sm text-slate-900"
          >
            <option value="all">Semua Kelas (1-6)</option>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                Kelas {g} SD
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Animated Leaderboard List */}
      <div className="bg-gradient-to-b from-[#DBEAFE] to-white rounded-[28px] p-4 sm:p-6 card-kid border-2 border-white space-y-3">
        {filteredList.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="text-4xl">🤖</div>
            <div className="font-display font-bold text-xl text-slate-800">
              Belum ada siswa di kategori ini
            </div>
            <p className="text-sm font-bold text-slate-500">
              Coba pilih daerah, sekolah, atau filter kelas lain!
            </p>
          </div>
        ) : (
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {filteredList.map((student, idx) => {
                const isMe = student.uid === myUid;
                const climbedMe = isMe && rankUpBanner !== null;
                const rankBadge =
                  idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                return (
                  <motion.div
                    layout
                    key={student.uid}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: climbedMe ? [1, 1.03, 1] : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 320, damping: 26 },
                      opacity: { duration: 0.25 },
                      scale: { duration: 0.5 },
                    }}
                    className={`rounded-2xl p-3.5 flex items-center justify-between gap-3 border-2 ${
                      climbedMe
                        ? 'bg-gradient-to-r from-[#EFF6FF] to-[#FEF9C3] border-amber-400 shadow-md ring-2 ring-amber-300/70'
                        : isMe
                        ? 'bg-[#EFF6FF] border-[#3B82F6] shadow-sm'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <motion.div
                        key={`rank-${idx}`}
                        initial={{ scale: 0.85 }}
                        animate={{ scale: 1 }}
                        className="w-10 text-center font-display font-bold text-2xl shrink-0"
                      >
                        {rankBadge}
                      </motion.div>
                      <KidAvatar
                        avatarId={student.avatarId}
                        photoUrl={student.customPhotoUrl}
                        mood={idx === 0 || climbedMe ? 'cheering' : 'happy'}
                        size={54}
                      />
                      <div className="min-w-0">
                        <div className="font-display font-bold text-lg text-slate-900 truncate flex items-center gap-1.5">
                          <span className="truncate">{student.displayName}</span>
                          {isMe && <span className="text-sm text-[#2563EB] shrink-0">(Kamu)</span>}
                          {climbedMe && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold shrink-0">
                              <ArrowUp className="w-3 h-3 stroke-[3]" />
                              Naik!
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-500 truncate">
                          {student.grade} · {student.sekolah} · {student.daerah}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <motion.div
                        key={student.xp}
                        initial={{ scale: 1.12 }}
                        animate={{ scale: 1 }}
                        className="font-display font-bold text-xl text-amber-600 tabular-nums"
                      >
                        {student.xp.toLocaleString('id-ID')} ⭐
                      </motion.div>
                      <div className="text-[11px] font-bold text-slate-400">
                        {student.badgesCount} Lencana
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </LayoutGroup>
        )}
      </div>
    </div>
  );
}
