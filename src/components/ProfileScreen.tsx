import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Cloud, LogOut, Settings, Trash2, Volume2, VolumeX, X } from 'lucide-react';
import { AvatarId, BadgeItem, GradeNumber, StudentProfile } from '../types';
import { BADGES } from '../data/curriculum';
import { DAERAH_LIST, SEKOLAH_LIST } from '../data/quizDatabase';
import { KidAvatar } from './CartoonArt';
import { compressAvatarPhoto } from '../utils/photoUpload';
import { soundFX } from '../utils/sound';

interface ProfileScreenProps {
  profile: StudentProfile;
  isGoogleSignedIn: boolean;
  onGoogleLogin: () => Promise<void>;
  onGoogleLogout: () => Promise<void>;
  onBack: () => void;
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
  onSwitchProfile: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

function BadgeGlyph({ type }: { type: BadgeItem['iconType'] }) {
  if (type === 'trophy') return <span>🏆</span>;
  if (type === 'rocket') return <span>🚀</span>;
  if (type === 'bulb') return <span>💡</span>;
  return <span>❤️</span>;
}

export function ProfileScreen({
  profile,
  isGoogleSignedIn,
  onGoogleLogin,
  onGoogleLogout,
  onBack,
  onUpdateProfile,
  onSwitchProfile,
  muted,
  onToggleMute,
}: ProfileScreenProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const [editName, setEditName] = useState(profile.name);
  const [editGradeNum, setEditGradeNum] = useState<GradeNumber>(profile.gradeNumber);
  const [editDaerah, setEditDaerah] = useState(profile.daerah);
  const [editSekolah, setEditSekolah] = useState(profile.sekolah);
  const [editAvatar, setEditAvatar] = useState<AvatarId>(profile.avatarId);
  const [editPhotoUrl, setEditPhotoUrl] = useState<string | null>(profile.customPhotoUrl ?? null);

  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const quickUploadRef = useRef<HTMLInputElement | null>(null);
  const modalUploadRef = useRef<HTMLInputElement | null>(null);

  const handleQuickPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      const compressed = await compressAvatarPhoto(file);
      soundFX.playCorrect();
      onUpdateProfile({ customPhotoUrl: compressed });
    } catch (err) {
      soundFX.playWrong();
      setPhotoError(err instanceof Error ? err.message : 'Gagal mengunggah foto.');
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleModalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      const compressed = await compressAvatarPhoto(file);
      soundFX.playCorrect();
      setEditPhotoUrl(compressed);
    } catch (err) {
      soundFX.playWrong();
      setPhotoError(err instanceof Error ? err.message : 'Gagal mengunggah foto.');
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    soundFX.playCorrect();
    const gradeBand =
      editGradeNum <= 2 ? 'Kelas 1-2 SD' : editGradeNum <= 4 ? 'Kelas 3-4 SD' : 'Kelas 4-6 SD';
    onUpdateProfile({
      name: editName.trim(),
      grade: `Kelas ${editGradeNum} SD`,
      gradeNumber: editGradeNum,
      gradeBand,
      daerah: editDaerah,
      sekolah: editSekolah,
      avatarId: editAvatar,
      customPhotoUrl: editPhotoUrl,
    });
    setShowEdit(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      <div className="flex items-center justify-between">
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
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">Profil Robot Saya</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            setShowSettings(true);
          }}
          className="w-11 h-11 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center text-slate-700 hover:bg-sky-50 cursor-pointer"
          aria-label="Pengaturan"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Main Profile Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[28px] p-5 sm:p-6 card-kid border-2 border-sky-100 space-y-5"
      >
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <KidAvatar
              avatarId={profile.avatarId}
              photoUrl={profile.customPhotoUrl}
              mood="happy"
              size={96}
            />
            <button
              type="button"
              disabled={photoBusy}
              onClick={() => {
                soundFX.playTap();
                quickUploadRef.current?.click();
              }}
              aria-label="Upload Foto Profil"
              title="Upload Foto Sendiri"
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-2 border-white shadow flex items-center justify-center cursor-pointer disabled:opacity-60"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={quickUploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              onChange={handleQuickPhotoUpload}
              className="hidden"
            />
          </div>

          <div className="min-w-0">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 truncate">
              {profile.name}
            </h2>
            <p className="text-sm sm:text-base font-bold text-[#1D4ED8]">
              {profile.gradeBand || profile.grade} ({profile.grade})
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-500 truncate">
              {profile.sekolah} · {profile.daerah}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  setEditName(profile.name);
                  setEditGradeNum(profile.gradeNumber);
                  setEditDaerah(profile.daerah);
                  setEditSekolah(profile.sekolah);
                  setEditAvatar(profile.avatarId);
                  setEditPhotoUrl(profile.customPhotoUrl ?? null);
                  setPhotoError(null);
                  setShowEdit(true);
                }}
                className="px-4 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-sm cursor-pointer transition-colors"
              >
                Edit Profil
              </button>

              <button
                type="button"
                disabled={photoBusy}
                onClick={() => {
                  soundFX.playTap();
                  quickUploadRef.current?.click();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
              >
                <Camera className="w-4 h-4" />
                <span>{photoBusy ? 'Mengunggah...' : 'Upload Foto'}</span>
              </button>

              {profile.customPhotoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    onUpdateProfile({ customPhotoUrl: null });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-sm flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Pakai Robot</span>
                </button>
              )}

              {!isGoogleSignedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    onGoogleLogin();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Simpan Online (Google)</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5" />
                  Tersinkron Online
                </span>
              )}
            </div>

            {photoError && (
              <p className="mt-2 text-xs font-bold text-rose-600">{photoError}</p>
            )}
          </div>
        </div>

        {/* 3 Stat Boxes: XP, Lencana, Sertifikat */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#FFFBEB] border border-amber-200 p-3 text-center">
            <div className="text-2xl">⭐</div>
            <div className="font-display font-bold text-xl sm:text-2xl text-slate-900 tabular-nums mt-0.5">
              {profile.xp.toLocaleString('id-ID')}
            </div>
            <div className="text-xs font-bold text-amber-800">XP</div>
          </div>

          <div className="rounded-2xl bg-[#FFF7ED] border border-orange-200 p-3 text-center">
            <div className="text-2xl">🏅</div>
            <div className="font-display font-bold text-xl sm:text-2xl text-slate-900 tabular-nums mt-0.5">
              {profile.badgesCount}
            </div>
            <div className="text-xs font-bold text-orange-800">Lencana</div>
          </div>

          <div className="rounded-2xl bg-[#ECFDF5] border border-emerald-200 p-3 text-center">
            <div className="text-2xl">📜</div>
            <div className="font-display font-bold text-xl sm:text-2xl text-slate-900 tabular-nums mt-0.5">
              {profile.certificatesCount}
            </div>
            <div className="text-xs font-bold text-emerald-800">Sertifikat</div>
          </div>
        </div>

        {/* Lencana Saya */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-slate-900">Lencana Saya</h3>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {BADGES.map((badge) => {
              const unlocked = profile.unlockedBadges.includes(badge.id);
              return (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    setSelectedBadge(badge);
                  }}
                  className={`flex flex-col items-center text-center p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer ${
                    unlocked ? 'opacity-100' : 'opacity-45 grayscale'
                  }`}
                >
                  <div
                    style={{ backgroundColor: `${badge.color}22`, borderColor: badge.color }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center text-2xl sm:text-3xl shadow-sm"
                  >
                    <BadgeGlyph type={badge.iconType} />
                  </div>
                  <span className="mt-1.5 text-xs font-bold text-slate-800 leading-tight">
                    {badge.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#EFF6FF] rounded-2xl p-4 text-center font-bold italic text-sm sm:text-base text-[#1E3A8A]">
          &ldquo;Aku bisa, aku belajar, aku meraih mimpi!&rdquo;
        </div>
      </motion.div>

      <div className="flex items-center justify-center gap-3 pt-1">
        <KidAvatar
          avatarId={profile.avatarId}
          photoUrl={profile.customPhotoUrl}
          mood="cheering"
          size={88}
        />
        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 border-2 border-sky-200 shadow-sm font-display font-bold text-base sm:text-lg text-[#1D4ED8]">
          Masa Depan Dimulai dari Sekarang!
        </div>
      </div>

      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[26px] p-6 max-w-sm w-full text-center space-y-3 shadow-2xl">
            <div className="text-5xl">
              <BadgeGlyph type={selectedBadge.iconType} />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900">{selectedBadge.title}</h3>
            <p className="text-sm font-bold text-slate-600">{selectedBadge.description}</p>
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-2xl bg-[#2563EB] text-white font-display font-bold text-lg cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl space-y-4 my-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-2xl text-slate-900">Edit Profil Robot</h3>
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Photo Upload inside Modal */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <KidAvatar avatarId={editAvatar} photoUrl={editPhotoUrl} size={66} className="shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="text-xs font-bold text-slate-600">
                    Foto Profil Sendiri atau Avatar Robot
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input
                      ref={modalUploadRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/*"
                      onChange={handleModalPhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={photoBusy}
                      onClick={() => {
                        soundFX.playTap();
                        modalUploadRef.current?.click();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{photoBusy ? 'Memproses...' : 'Pilih Foto'}</span>
                    </button>
                    {editPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playTap();
                          setEditPhotoUrl(null);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Foto</span>
                      </button>
                    )}
                  </div>
                  {photoError && <p className="text-xs font-bold text-rose-600">{photoError}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kelas (1–6 SD)</label>
                <select
                  value={editGradeNum}
                  onChange={(e) => setEditGradeNum(Number(e.target.value) as GradeNumber)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white font-bold"
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
                  <label className="block text-sm font-bold text-slate-700 mb-1">Daerah</label>
                  <select
                    value={editDaerah}
                    onChange={(e) => setEditDaerah(e.target.value)}
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
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sekolah</label>
                  <select
                    value={editSekolah}
                    onChange={(e) => setEditSekolah(e.target.value)}
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
                  Karakter Robot {editPhotoUrl ? '(ketuk robot untuk mengganti foto)' : ''}
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {(['fatih', 'zayyan', 'feride', 'bintang', 'zahra'] as AvatarId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        soundFX.playTap();
                        setEditAvatar(id);
                        setEditPhotoUrl(null);
                      }}
                      className={`p-1.5 rounded-2xl border-2 cursor-pointer shrink-0 ${
                        editAvatar === id && !editPhotoUrl ? 'border-sky-500 bg-sky-50' : 'border-transparent'
                      }`}
                    >
                      <KidAvatar avatarId={id} size={54} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#16A34A] text-white font-display font-bold text-xl btn-3d-green cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-2xl text-slate-900">Pengaturan</h3>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              className="w-full px-4 py-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                {muted ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5 text-sky-600" />}
                <span>Efek Suara Lucu</span>
              </span>
              <span className="text-sm text-sky-700">{muted ? 'Mati' : 'Aktif'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowSettings(false);
                onSwitchProfile();
              }}
              className="w-full px-4 py-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center gap-2 font-bold text-amber-800 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Ganti Profil Robot</span>
            </button>

            {isGoogleSignedIn && (
              <button
                type="button"
                onClick={async () => {
                  setShowSettings(false);
                  await onGoogleLogout();
                }}
                className="w-full px-4 py-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center gap-2 font-bold text-rose-700 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar Akun Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
