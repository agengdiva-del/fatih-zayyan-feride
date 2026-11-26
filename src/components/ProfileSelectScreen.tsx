import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Plus, Trash2, X } from 'lucide-react';
import { AvatarId, GradeNumber, StudentProfile } from '../types';
import { DAERAH_LIST, SEKOLAH_LIST } from '../data/quizDatabase';
import { AppLogo, KidAvatar, SchoolhouseIllustration } from './CartoonArt';
import { compressAvatarPhoto } from '../utils/photoUpload';
import { soundFX } from '../utils/sound';

interface ProfileSelectScreenProps {
  profiles: StudentProfile[];
  onSelectProfile: (profileId: string) => void;
  onAddProfile: (
    name: string,
    gradeNumber: GradeNumber,
    avatarId: AvatarId,
    daerah: string,
    sekolah: string,
    customPhotoUrl?: string | null
  ) => void;
  onGoogleLogin: () => Promise<void>;
  googleLoading?: boolean;
  authError?: string | null;
}

const AVATAR_CHOICES: { id: AvatarId; label: string }[] = [
  { id: 'fatih', label: 'Robot Fatih' },
  { id: 'zayyan', label: 'Robot Zayyan' },
  { id: 'feride', label: 'Robot Feride' },
  { id: 'bintang', label: 'Robot Bintang' },
  { id: 'zahra', label: 'Robot Zahra' },
];

export function ProfileSelectScreen({
  profiles,
  onSelectProfile,
  onAddProfile,
  onGoogleLogin,
  googleLoading = false,
  authError = null,
}: ProfileSelectScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGradeNum, setNewGradeNum] = useState<GradeNumber>(4);
  const [newAvatar, setNewAvatar] = useState<AvatarId>('bintang');
  const [newDaerah, setNewDaerah] = useState(DAERAH_LIST[0]);
  const [newSekolah, setNewSekolah] = useState(SEKOLAH_LIST[0]);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoErr, setPhotoErr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoErr(null);
    setPhotoBusy(true);
    try {
      const compressed = await compressAvatarPhoto(file);
      soundFX.playCorrect();
      setNewPhotoUrl(compressed);
    } catch (err) {
      soundFX.playWrong();
      setPhotoErr(err instanceof Error ? err.message : 'Gagal memproses foto.');
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    soundFX.playCorrect();
    onAddProfile(newName.trim(), newGradeNum, newAvatar, newDaerah, newSekolah, newPhotoUrl);
    setNewName('');
    setNewPhotoUrl(null);
    setPhotoErr(null);
    setShowAddModal(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#A8DEFF] via-[#EAF6FF] to-[#E6F9E8] flex flex-col items-center justify-between px-4 sm:px-8 pt-8 pb-0">
      {/* Top Logo */}
      <div className="flex flex-col items-center text-center z-10">
        <AppLogo size="md" showSun />
        <p className="mt-3 text-base sm:text-lg font-bold text-[#1E3A8A]">
          Masuk ke Dunia Robot Belajar yang Menyenangkan
        </p>
      </div>

      {/* Main Profile Picker Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-8 card-kid border-2 border-[#E0F2FE] my-6"
      >
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-center text-[#0F172A] mb-6">
          Pilih Profil Robot Kamu
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                soundFX.playTap();
                onSelectProfile(p.id);
              }}
              className="group flex flex-col items-center p-3 rounded-2xl hover:bg-[#F0F9FF] active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
            >
              <div className="transition-transform group-hover:-translate-y-1">
                <KidAvatar avatarId={p.avatarId} photoUrl={p.customPhotoUrl} mood="happy" size={88} />
              </div>
              <span className="mt-2 font-display font-bold text-lg text-[#0F172A]">{p.name}</span>
              <span className="text-xs font-extrabold text-[#1D4ED8]">
                {p.gradeBand || p.grade}
              </span>
              <span className="text-[11px] font-bold text-slate-500 truncate max-w-full">
                {p.daerah}
              </span>
            </button>
          ))}

          {/* Tambah Profil Button */}
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              setNewPhotoUrl(null);
              setPhotoErr(null);
              setShowAddModal(true);
            }}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-[#F0F9FF] active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-[88px] h-[88px] rounded-full bg-[#E0F2FE] border-4 border-white shadow flex items-center justify-center text-[#1D4ED8] group-hover:bg-[#BAE6FD] transition-colors">
              <Plus className="w-10 h-10 stroke-[3]" />
            </div>
            <span className="mt-2 font-display font-bold text-lg text-[#1E3A8A]">Tambah Profil</span>
            <span className="text-xs font-bold text-slate-500">Robot Siswa Baru</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-sm font-bold text-slate-400">atau peringkat online</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {authError && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 text-center">
            {authError}
          </div>
        )}

        {/* Real Google Sign-In for Online Leaderboard Sync */}
        <button
          type="button"
          disabled={googleLoading}
          onClick={() => {
            soundFX.playTap();
            onGoogleLogin();
          }}
          className="w-full min-h-[52px] px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 shadow-sm flex items-center justify-center gap-3 font-bold text-base text-slate-800 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
            <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
          </svg>
          <span>{googleLoading ? 'Menghubungkan...' : 'Masuk dengan Google (Online)'}</span>
        </button>
      </motion.div>

      {/* Bottom SD Schoolhouse */}
      <div className="w-full max-w-md -mb-1 z-0">
        <SchoolhouseIllustration />
      </div>

      {/* Modal Tambah Profil */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-[28px] p-6 shadow-2xl border-2 border-sky-100 my-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-2xl text-slate-900">
                Buat Profil Robot Baru
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              {/* Preview + Upload Foto Sendiri */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <KidAvatar avatarId={newAvatar} photoUrl={newPhotoUrl} size={66} className="shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="text-xs font-bold text-slate-600">
                    Foto Profil atau Karakter Robot
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={photoBusy}
                      onClick={() => {
                        soundFX.playTap();
                        fileInputRef.current?.click();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{photoBusy ? 'Memproses...' : 'Upload Foto Sendiri'}</span>
                    </button>
                    {newPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playTap();
                          setNewPhotoUrl(null);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Pakai Robot</span>
                      </button>
                    )}
                  </div>
                  {photoErr && <p className="text-xs font-bold text-rose-600">{photoErr}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Panggilan Kamu</label>
                <input
                  type="text"
                  required
                  maxLength={25}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Aisyah atau Bima"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none text-base font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Pilih Kelas SD (1–6)</label>
                <select
                  value={newGradeNum}
                  onChange={(e) => setNewGradeNum(Number(e.target.value) as GradeNumber)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none text-base font-bold bg-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      Kelas {num} SD
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Daerah / Provinsi</label>
                  <select
                    value={newDaerah}
                    onChange={(e) => setNewDaerah(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white font-bold text-sm"
                  >
                    {DAERAH_LIST.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Asal Sekolah</label>
                  <select
                    value={newSekolah}
                    onChange={(e) => setNewSekolah(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white font-bold text-sm"
                  >
                    {SEKOLAH_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Pilih Karakter Robot {newPhotoUrl ? '(jika foto dihapus)' : ''}
                </label>
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                  {AVATAR_CHOICES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        soundFX.playTap();
                        setNewAvatar(c.id);
                        setNewPhotoUrl(null);
                      }}
                      className={`p-1.5 rounded-2xl border-2 transition-all cursor-pointer shrink-0 ${
                        newAvatar === c.id && !newPhotoUrl
                          ? 'border-sky-500 bg-sky-50 scale-105'
                          : 'border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <KidAvatar avatarId={c.id} size={54} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-display font-bold text-xl btn-3d-green cursor-pointer"
              >
                Mulai Belajar!
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
