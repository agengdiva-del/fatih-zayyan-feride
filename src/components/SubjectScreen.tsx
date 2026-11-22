import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, PlayCircle, Trophy } from 'lucide-react';
import { AvatarId, DifficultyLevel, GradeNumber, SubjectInfo, TopicInfo } from '../types';
import { KidAvatar } from './CartoonArt';
import { soundFX } from '../utils/sound';

interface SubjectScreenProps {
  subject: SubjectInfo;
  avatarId: AvatarId;
  selectedGrade: GradeNumber;
  onSelectGrade: (grade: GradeNumber) => void;
  selectedLevel: DifficultyLevel;
  onSelectLevel: (level: DifficultyLevel) => void;
  onBack: () => void;
  onStartLearn: (topic: TopicInfo) => void;
  onStartQuiz: (topic: TopicInfo) => void;
  onStartGradeQuiz: (grade: GradeNumber) => void;
  onOpenVideo: () => void;
}

function renderTopicGlyph(iconKey: TopicInfo['iconKey']) {
  switch (iconKey) {
    case 'plus':
      return '+';
    case 'minus':
      return '−';
    case 'multiply':
      return '×';
    case 'divide':
      return '÷';
    case 'book':
      return '📖';
    case 'flask':
      return '🧪';
    case 'globe':
      return '🌍';
    case 'palette':
      return '🎨';
    default:
      return '⭐';
  }
}

export function SubjectScreen({
  subject,
  avatarId,
  selectedGrade,
  onSelectGrade,
  selectedLevel,
  onSelectLevel,
  onBack,
  onStartLearn,
  onStartQuiz,
  onStartGradeQuiz,
  onOpenVideo,
}: SubjectScreenProps) {
  const levels: { id: DifficultyLevel; starColor: string; label: string }[] = [
    { id: 'Dasar', starColor: '#D97706', label: 'Dasar' },
    { id: 'Menengah', starColor: '#64748B', label: 'Menengah' },
    { id: 'Mahir', starColor: '#FACC15', label: 'Mahir' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onBack();
          }}
          className="w-11 h-11 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center text-slate-800 hover:bg-sky-50 active:scale-95 transition-all cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
          {subject.name}
        </h1>
      </div>

      {/* Hero Mascot Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#E0F2FE] via-[#F0F9FF] to-[#DBEAFE] rounded-[24px] p-5 sm:p-6 card-kid border-2 border-white flex items-center gap-4 sm:gap-6"
      >
        <div className="relative shrink-0">
          <KidAvatar avatarId={avatarId} mood="cheering" size={96} />
          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-white shadow flex items-center justify-center text-lg">
            {subject.id === 'matematika' ? '🧮' : subject.id === 'ipa' ? '🔬' : '📘'}
          </div>
        </div>
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E3A8A] leading-snug">
            {subject.quote.split('!')[0]}!
          </h2>
          <p className="mt-1 text-base font-bold text-slate-700">
            &ldquo;{subject.quote.split('!')[1]?.trim() || subject.tagline}&rdquo;
          </p>
        </div>
      </motion.div>

      {/* Database Kuis Kelas 1-6 SD per Mata Pelajaran */}
      <div className="bg-white rounded-[24px] p-5 card-kid border-2 border-emerald-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
              Bank Kuis {subject.name} (Kelas 1 – 6 SD)
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Pilih kelas SD untuk mengerjakan soal kuis resmi sesuai jenjangmu
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onStartGradeQuiz(selectedGrade);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#16A34A] text-white font-display font-bold text-base btn-3d-green cursor-pointer whitespace-nowrap shrink-0"
          >
            Kuis Kelas {selectedGrade} SD
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {([1, 2, 3, 4, 5, 6] as GradeNumber[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                soundFX.playTap();
                onSelectGrade(g);
              }}
              className={`py-2 px-2 rounded-xl font-display font-bold text-sm border-2 transition-all cursor-pointer ${
                selectedGrade === g
                  ? 'bg-[#2563EB] border-[#1D4ED8] text-white shadow'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50'
              }`}
            >
              Kelas {g}
            </button>
          ))}
        </div>
      </div>

      {/* Topic List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
            Pilih Topik Latihan Interaktif
          </h3>
          <span className="text-sm font-bold text-slate-500">Level: {selectedLevel}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {subject.topics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-3.5 card-kid border border-slate-100 flex items-center justify-between gap-3"
            >
              <button
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  onStartLearn(topic);
                }}
                className="flex-1 flex items-center gap-4 text-left cursor-pointer group min-h-[56px]"
              >
                <div
                  style={{ backgroundColor: topic.colorBg, color: topic.colorText }}
                  className="w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center font-display font-bold text-3xl shrink-0 group-hover:scale-105 transition-transform"
                >
                  {renderTopicGlyph(topic.iconKey)}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-xl text-slate-900 group-hover:text-[#1D4ED8] transition-colors">
                    {topic.title}
                  </div>
                  <div className="text-sm font-semibold text-slate-500 truncate">
                    {topic.shortDesc}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  onStartQuiz(topic);
                }}
                title={`Kuis ${topic.title}`}
                className="px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors min-h-[44px]"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Kuis</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pilih Level */}
      <div className="bg-white rounded-[24px] p-5 card-kid border border-sky-100">
        <h3 className="font-display font-bold text-lg sm:text-xl text-center text-slate-900 mb-4">
          Pilih Level Latihan
        </h3>
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {levels.map((lvl) => {
            const active = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  onSelectLevel(lvl.id);
                }}
                className={`rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center gap-1.5 border-2 transition-all cursor-pointer min-h-[88px] ${
                  active
                    ? 'bg-[#EFF6FF] border-[#2563EB] shadow-md scale-[1.03]'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill={lvl.starColor} aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className={`font-display font-bold text-sm sm:text-base ${active ? 'text-[#1D4ED8]' : 'text-slate-700'}`}>
                  {lvl.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          soundFX.playTap();
          onOpenVideo();
        }}
        className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display font-bold text-lg flex items-center justify-center gap-3 btn-3d-blue cursor-pointer"
      >
        <PlayCircle className="w-6 h-6" />
        <span>Tonton Video Pembelajaran {subject.name}</span>
      </button>
    </div>
  );
}
