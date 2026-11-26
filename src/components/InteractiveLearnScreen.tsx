import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Eye, Sparkles } from 'lucide-react';
import { AvatarId, DifficultyLevel, TopicInfo } from '../types';
import { KidAvatar, TrophyIllustration } from './CartoonArt';
import { soundFX } from '../utils/sound';

interface InteractiveLearnScreenProps {
  topic: TopicInfo;
  level: DifficultyLevel;
  avatarId: AvatarId;
  photoUrl?: string | null;
  onBack: () => void;
  onEarnXP: (amount: number, topicId: string) => void;
}

export function InteractiveLearnScreen({
  topic,
  level,
  avatarId,
  photoUrl,
  onBack,
  onEarnXP,
}: InteractiveLearnScreenProps) {
  const questions = topic.questionsByLevel[level].length > 0
    ? topic.questionsByLevel[level]
    : topic.questionsByLevel.Dasar;

  const [index, setIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [earnedTotal, setEarnedTotal] = useState(0);
  const [showVisual, setShowVisual] = useState(true);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const progressPct = Math.round(((index + (status === 'correct' ? 1 : 0)) / questions.length) * 100);

  const handleSelect = (optIdx: number) => {
    if (status === 'correct') return;
    setSelectedOpt(optIdx);

    if (optIdx === current.correctIndex) {
      soundFX.playCorrect();
      setStatus('correct');
      setEarnedTotal((prev) => prev + 10);
    } else {
      soundFX.playWrong();
      setStatus('wrong');
    }
  };

  const handleNext = () => {
    soundFX.playTap();
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelectedOpt(null);
      setStatus('idle');
    } else {
      soundFX.playWin();
      onEarnXP(earnedTotal, topic.id);
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[28px] p-6 sm:p-10 card-kid border-2 border-sky-100 text-center max-w-xl mx-auto my-6 space-y-5"
      >
        <div className="flex justify-center">
          <TrophyIllustration size={120} />
        </div>
        <h2 className="font-display font-bold text-3xl text-[#1E3A8A]">
          Belajar Selesai! 🎉
        </h2>
        <p className="text-lg font-bold text-slate-700">
          Kamu hebat sudah menyelesaikan latihan <span className="text-[#16A34A]">{topic.title}</span>!
        </p>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl py-4 px-6 inline-block">
          <div className="text-sm font-bold text-amber-800">Total Bintang Didapat</div>
          <div className="font-display font-bold text-4xl text-amber-600 mt-1 tabular-nums">
            +{earnedTotal} ⭐
          </div>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display font-bold text-xl btn-3d-blue cursor-pointer"
          >
            Kembali ke Pelajaran
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5 pb-8 max-w-2xl mx-auto">
      {/* Top Bar */}
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
          <h1 className="font-display font-bold text-2xl text-slate-900">{topic.title}</h1>
        </div>

        <span className="font-display font-bold text-base text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 tabular-nums">
          +{earnedTotal} ⭐
        </span>
      </div>

      {/* Progress Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-bold text-slate-600">
          <span>
            Soal {index + 1} dari {questions.length}
          </span>
          <span className="tabular-nums">{progressPct}%</span>
        </div>
        <div className="w-full h-3.5 rounded-full bg-white border border-slate-200 overflow-hidden">
          <motion.div
            animate={{ width: `${Math.max(10, progressPct)}%` }}
            className="h-full rounded-full bg-[#22C55E]"
          />
        </div>
      </div>

      {/* Big Question Box (Matches Screen 5: "5 + 3 = ?") */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-[26px] p-6 sm:p-8 card-kid border-2 border-sky-100 text-center space-y-4"
      >
        <div className="font-display font-bold text-3xl sm:text-5xl text-[#0F172A] tracking-wide leading-tight">
          {current.prompt}
        </div>

        {/* Visual Manipulative Aid for SD Kids */}
        {current.visualAid && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowVisual((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{showVisual ? 'Sembunyikan Bantuan Gambar' : 'Tampilkan Bantuan Gambar'}</span>
            </button>

            {showVisual && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#F0F9FF] border border-sky-100 text-lg">
                {current.visualAid.type === 'add' && current.visualAid.a && current.visualAid.b && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span>{Array(current.visualAid.a).fill(current.visualAid.emoji).join(' ')}</span>
                    <span className="font-display font-bold text-sky-700 mx-1">+</span>
                    <span>{Array(current.visualAid.b).fill(current.visualAid.emoji).join(' ')}</span>
                  </div>
                )}
                {current.visualAid.type === 'subtract' && current.visualAid.a && current.visualAid.b && (() => {
                  const total = current.visualAid.a;
                  const take = current.visualAid.b;
                  const icon = current.visualAid.emoji;
                  return (
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {Array.from({ length: total }).map((_, i) => (
                        <span
                          key={i}
                          className={i >= total - take ? 'opacity-25 grayscale' : ''}
                        >
                          {icon}
                        </span>
                      ))}
                    </div>
                  );
                })()}
                {current.visualAid.type === 'multiply' && current.visualAid.a && current.visualAid.b && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: current.visualAid.a }).map((_, grp) => (
                      <div key={grp} className="px-2 py-1 rounded-xl bg-white border border-sky-200 text-base">
                        {Array(current.visualAid!.b).fill(current.visualAid!.emoji).join('')}
                      </div>
                    ))}
                  </div>
                )}
                {current.visualAid.type === 'divide' && current.visualAid.a && current.visualAid.b && (
                  <div className="text-sm font-bold text-sky-800">
                    Bagikan {current.visualAid.a} {current.visualAid.emoji} ke {current.visualAid.b} kotak sama rata!
                  </div>
                )}
                {current.visualAid.type === 'emoji' && (
                  <div className="text-base font-bold text-sky-800">
                    <span className="text-2xl mr-2">{current.visualAid.emoji}</span>
                    {current.visualAid.label}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 4 Big Answer Rows */}
      <div className="space-y-3">
        {current.options.map((opt, idx) => {
          const isSelected = selectedOpt === idx;
          const isCorrectChoice = status === 'correct' && isSelected;
          const isWrongChoice = status === 'wrong' && isSelected;

          return (
            <motion.button
              key={idx}
              type="button"
              animate={isWrongChoice ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.3 }}
              onClick={() => handleSelect(idx)}
              className={`w-full min-h-[60px] px-5 py-3.5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all cursor-pointer ${
                isCorrectChoice
                  ? 'bg-[#DCFCE7] border-[#22C55E] shadow-md'
                  : isWrongChoice
                  ? 'bg-[#FEE2E2] border-[#EF4444]'
                  : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 shadow-sm'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isCorrectChoice
                    ? 'bg-[#22C55E] border-[#22C55E] text-white'
                    : isWrongChoice
                    ? 'bg-[#EF4444] border-[#EF4444] text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isCorrectChoice && <Check className="w-5 h-5 stroke-[3]" />}
                {isWrongChoice && <span className="font-bold text-sm">✕</span>}
              </div>
              <span className="font-display font-bold text-2xl text-slate-900">{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Mascot Feedback & Lanjut Soal CTA (Matches Screen 5 bottom area) */}
      <AnimatePresence mode="wait">
        {status === 'correct' && (
          <motion.div
            key="correct-banner"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gradient-to-r from-[#EFF6FF] to-[#ECFDF5] rounded-[24px] p-4 sm:p-5 border-2 border-[#86EFAC] card-kid space-y-4"
          >
            <div className="flex items-center gap-4">
              <KidAvatar avatarId={avatarId} photoUrl={photoUrl} mood="cheering" size={82} className="shrink-0" />
              <div>
                <div className="font-display font-bold text-2xl text-[#15803D] flex items-center gap-1.5">
                  <span>Hebat!</span>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-base font-bold text-slate-800">Jawaban kamu benar!</p>
                <p className="text-sm font-bold text-slate-600 mt-0.5">{current.explanation}</p>
                <div className="mt-1 font-display font-bold text-xl text-amber-500">+10 ⭐</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display font-bold text-xl btn-3d-blue cursor-pointer"
            >
              {index + 1 < questions.length ? 'Lanjut Soal' : 'Selesai Belajar'}
            </button>
          </motion.div>
        )}

        {status === 'wrong' && (
          <motion.div
            key="wrong-banner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 flex items-center gap-3"
          >
            <KidAvatar avatarId={avatarId} photoUrl={photoUrl} mood="thinking" size={64} className="shrink-0" />
            <div>
              <div className="font-display font-bold text-lg text-amber-900">
                Hampir benar! Ayo coba lagi ya!
              </div>
              <p className="text-sm font-bold text-amber-800">
                Kamu bisa memakai Bantuan Gambar di atas untuk menghitung pelan-pelan.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
