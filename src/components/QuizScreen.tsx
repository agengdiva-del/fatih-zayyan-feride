import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { AvatarId, DifficultyLevel, GradeNumber, LearningQuestion, SubjectInfo, TopicInfo } from '../types';
import { KidAvatar, TrophyIllustration } from './CartoonArt';
import { soundFX } from '../utils/sound';

interface QuizScreenProps {
  subject: SubjectInfo;
  topic: TopicInfo;
  level: DifficultyLevel;
  avatarId: AvatarId;
  photoUrl?: string | null;
  gradeNumber?: GradeNumber;
  overrideQuestions?: LearningQuestion[] | null;
  quizTitleOverride?: string;
  onBack: () => void;
  onFinishQuiz: (xpEarned: number, scorePct: number) => void;
}

export function QuizScreen({
  subject,
  topic,
  level,
  avatarId,
  photoUrl,
  gradeNumber,
  overrideQuestions = null,
  quizTitleOverride,
  onBack,
  onFinishQuiz,
}: QuizScreenProps) {
  const questions =
    overrideQuestions && overrideQuestions.length > 0
      ? overrideQuestions
      : topic.questionsByLevel[level].length > 0
      ? topic.questionsByLevel[level]
      : topic.questionsByLevel.Dasar;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [phase, setPhase] = useState<'quiz' | 'result' | 'review'>('quiz');

  const currentQ = questions[currentIdx];

  const handleSubmitAnswer = () => {
    if (selectedIdx === null) return;
    soundFX.playTap();
    const updated = [...answers, selectedIdx];
    setAnswers(updated);
    setSelectedIdx(null);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      const correctCount = updated.filter((ans, i) => ans === questions[i].correctIndex).length;
      const pct = Math.round((correctCount / questions.length) * 100);
      const earned = correctCount * 15;
      soundFX.playWin();
      onFinishQuiz(earned, pct);
      setPhase('result');
    }
  };

  const handleRetry = () => {
    soundFX.playTap();
    setCurrentIdx(0);
    setSelectedIdx(null);
    setAnswers([]);
    setPhase('quiz');
  };

  if (phase === 'result') {
    const correctCount = answers.filter((ans, i) => ans === questions[i].correctIndex).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const starsFilled = score >= 90 ? 5 : score >= 75 ? 4 : score >= 55 ? 3 : score >= 35 ? 2 : 1;
    const rankLabel = score >= 85 ? 'Top 10 Kelas' : score >= 65 ? 'Bintang Kelas' : 'Pejuang Hebat';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto bg-gradient-to-b from-[#EAF6FF] to-white rounded-[28px] p-6 sm:p-8 card-kid border-2 border-white text-center space-y-5 my-2"
      >
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-sky-50 cursor-pointer"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <motion.div
          initial={{ y: -14, rotate: -6 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="flex justify-center -mt-4"
        >
          <TrophyIllustration size={120} />
        </motion.div>

        <div>
          <h1 className="font-display font-bold text-4xl text-[#1D4ED8]">Selamat!</h1>
          <p className="mt-1 text-base font-bold text-slate-600">
            Kamu telah menyelesaikan kuis {gradeNumber ? `Kelas ${gradeNumber} SD` : ''}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-sm space-y-3">
          <div className="text-sm font-bold text-slate-500">Nilai Kamu</div>
          <div className="font-display font-bold text-4xl sm:text-5xl text-slate-900 tabular-nums">
            {score} / 100
          </div>

          <div className="flex items-center justify-center gap-1.5" aria-label={`${starsFilled} dari 5 bintang`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <svg
                key={n}
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill={n <= starsFilled ? '#FACC15' : '#CBD5E1'}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-sm font-bold text-slate-500">Peringkat</div>
            <div className="font-display font-bold text-2xl text-[#1E3A8A]">{rankLabel}</div>
          </div>
        </div>

        <div className="bg-[#EFF6FF] rounded-2xl p-4 text-sm sm:text-base font-bold italic text-[#1E3A8A]">
          &ldquo;Teruslah belajar, karena ilmu adalah kunci masa depan!&rdquo;
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleRetry}
            className="py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-800 font-display font-bold text-base flex items-center justify-center gap-2 cursor-pointer min-h-[52px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Kuis</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              setPhase('review');
            }}
            className="py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display font-bold text-base btn-3d-blue cursor-pointer min-h-[52px]"
          >
            Lihat Pembahasan
          </button>
        </div>
      </motion.div>
    );
  }

  if (phase === 'review') {
    return (
      <div className="max-w-2xl mx-auto space-y-4 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPhase('result')}
              className="w-11 h-11 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center cursor-pointer"
              aria-label="Kembali ke hasil"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-2xl text-slate-900">Pembahasan Kuis</h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-sm cursor-pointer"
          >
            Selesai
          </button>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const userAns = answers[idx];
            const isCorrect = userAns === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border-2 card-kid space-y-2 ${
                  isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-display font-bold text-lg text-slate-900">
                    {idx + 1}. {q.prompt}
                  </div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                  )}
                </div>
                <div className="text-sm font-bold space-y-1">
                  <div className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>
                    Jawabanmu: {userAns !== null && userAns !== undefined ? q.options[userAns] : '-'}
                  </div>
                  {!isCorrect && (
                    <div className="text-emerald-700">
                      Jawaban Benar: {q.options[q.correctIndex]}
                    </div>
                  )}
                  <div className="text-slate-600 bg-slate-50 rounded-xl p-2.5 mt-1">
                    💡 {q.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const progressPct = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
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
          <h1 className="font-display font-bold text-2xl text-slate-900">
            {quizTitleOverride || `Kuis ${subject.name}`}
          </h1>
          <p className="text-xs font-bold text-slate-500">
            {currentQ.topicTitle || topic.title} · {gradeNumber ? `Kelas ${gradeNumber} SD` : `Level ${level}`}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm font-bold text-slate-600">
          <span>
            Soal {currentIdx + 1} dari {questions.length}
          </span>
          <span className="tabular-nums">{progressPct}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-white border border-slate-200 overflow-hidden">
          <motion.div
            animate={{ width: `${progressPct}%` }}
            className="h-full rounded-full bg-[#22C55E]"
          />
        </div>
      </div>

      <div className="bg-white rounded-[26px] p-6 sm:p-8 card-kid border-2 border-sky-100 text-center">
        <div className="font-display font-bold text-2xl sm:text-4xl text-[#0F172A] leading-snug">
          {currentQ.prompt}
        </div>
      </div>

      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => {
          const active = selectedIdx === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                soundFX.playTap();
                setSelectedIdx(idx);
              }}
              className={`w-full min-h-[58px] px-5 py-3.5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all cursor-pointer ${
                active
                  ? 'bg-[#EFF6FF] border-[#2563EB] shadow-md'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  active ? 'border-[#2563EB] bg-[#2563EB]' : 'border-slate-300 bg-white'
                }`}
              >
                {active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <span className="font-display font-bold text-xl sm:text-2xl text-slate-900">{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 self-start sm:self-center">
          <KidAvatar avatarId={avatarId} photoUrl={photoUrl} mood="thinking" size={84} className="shrink-0" />
          <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm border border-sky-200 shadow-sm font-bold text-sm text-slate-800">
            &ldquo;Ayo, kamu pasti bisa!&rdquo;
          </div>
        </div>

        <button
          type="button"
          disabled={selectedIdx === null}
          onClick={handleSubmitAnswer}
          className={`w-full sm:flex-1 py-4 px-6 rounded-2xl font-display font-bold text-xl text-white transition-all cursor-pointer min-h-[56px] ${
            selectedIdx === null
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-[#2563EB] hover:bg-[#1D4ED8] btn-3d-blue'
          }`}
        >
          {currentIdx + 1 < questions.length ? 'Kirim Jawaban' : 'Selesai & Lihat Nilai'}
        </button>
      </div>
    </div>
  );
}
