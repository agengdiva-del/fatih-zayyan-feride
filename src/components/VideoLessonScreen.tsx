import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, GraduationCap, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { VIDEO_LESSONS } from '../data/curriculum';
import { VideoLessonItem } from '../types';
import { KidAvatar } from './CartoonArt';
import { soundFX } from '../utils/sound';

interface VideoLessonScreenProps {
  onBack: () => void;
  onCompleteVideo?: (xp: number) => void;
}

function formatClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VideoLessonScreen({ onBack, onCompleteVideo }: VideoLessonScreenProps) {
  const [activeVideo, setActiveVideo] = useState<VideoLessonItem>(VIDEO_LESSONS[0]);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [voiceOn, setVoiceOn] = useState(false);

  // Determine current chapter based on elapsed time
  const activeChapter = [...activeVideo.chapters]
    .reverse()
    .find((ch) => elapsed >= ch.time) || activeVideo.chapters[0];

  // Advance timer smoothly while playing (accelerated 6x so kids see animated chapters smoothly)
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev + 6 >= activeVideo.durationSeconds) {
          setPlaying(false);
          if (onCompleteVideo) onCompleteVideo(15);
          soundFX.playWin();
          return activeVideo.durationSeconds;
        }
        return prev + 6;
      });
    }, 350);
    return () => window.clearInterval(timer);
  }, [playing, activeVideo, onCompleteVideo]);

  // Optional Indonesian SpeechSynthesis narration when voiceOn is active
  useEffect(() => {
    if (!voiceOn || !playing || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(activeChapter.narration);
    utter.lang = 'id-ID';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [activeChapter.title, voiceOn, playing]);

  const switchVideo = (vid: VideoLessonItem) => {
    soundFX.playTap();
    setPlaying(false);
    setElapsed(0);
    setActiveVideo(vid);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onBack();
            }}
            className="w-11 h-11 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center text-slate-800 hover:bg-sky-50 cursor-pointer"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
            Video Pembelajaran
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setVoiceOn((v) => !v)}
          className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 border cursor-pointer transition-colors ${
            voiceOn
              ? 'bg-sky-100 border-sky-300 text-sky-900'
              : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{voiceOn ? 'Suara Aktif' : 'Suara Mati'}</span>
        </button>
      </div>

      {/* Main Layout: Responsive 2-column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Animated Cartoon Classroom Player */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-[24px] overflow-hidden bg-slate-900 card-kid border-4 border-white shadow-xl">
            {/* Animated Classroom Stage */}
            <div className="relative aspect-video bg-gradient-to-b from-[#B45309] via-[#92400E] to-[#78350F] p-4 sm:p-6 flex items-center justify-between overflow-hidden">
              {/* Classroom Blackboard */}
              <div className="absolute right-4 sm:right-8 top-4 bottom-8 w-[58%] rounded-xl bg-[#14532D] border-[6px] border-[#D97706] shadow-inner p-3 sm:p-5 flex flex-col justify-between text-white">
                <div className="font-display font-bold text-sm sm:text-xl tracking-wide text-amber-200 uppercase">
                  {activeVideo.title}
                </div>

                {/* Dynamic Visual Stage by Lesson Theme */}
                <div className="flex-1 flex items-center justify-center my-2">
                  {activeVideo.theme === 'pecahan' && (
                    <div className="flex items-center gap-4 sm:gap-6">
                      <motion.svg
                        animate={playing ? { rotate: [0, 6, 0] } : {}}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        viewBox="0 0 100 100"
                        className="w-20 h-20 sm:w-28 sm:h-28"
                      >
                        <circle cx="50" cy="50" r="44" fill="#FDE047" stroke="#FFFFFF" strokeWidth="3" />
                        {/* Highlighted fraction slice */}
                        <path
                          d={elapsed > 350 ? 'M50 50 L50 6 A44 44 0 1 1 6 50 Z' : 'M50 50 L50 6 A44 44 0 0 1 50 94 Z'}
                          fill="#F97316"
                          stroke="#FFFFFF"
                          strokeWidth="3"
                        />
                        <line x1="50" y1="6" x2="50" y2="94" stroke="#FFFFFF" strokeWidth="2.5" />
                        {elapsed > 350 && (
                          <line x1="6" y1="50" x2="94" y2="50" stroke="#FFFFFF" strokeWidth="2.5" />
                        )}
                      </motion.svg>
                      <div className="font-display font-bold text-3xl sm:text-5xl text-white leading-none text-center">
                        <div>{elapsed > 350 ? '3' : '1'}</div>
                        <div className="w-8 sm:w-10 h-1 bg-white my-1 mx-auto rounded" />
                        <div>{elapsed > 350 ? '4' : '2'}</div>
                      </div>
                    </div>
                  )}

                  {activeVideo.theme === 'bangun-datar' && (
                    <div className="flex items-center gap-4 sm:gap-6">
                      <motion.div
                        animate={playing ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-400 border-4 border-white rounded-lg"
                      />
                      <motion.div
                        animate={playing ? { y: [0, -6, 0] } : {}}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                        className="w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[52px] border-b-amber-400"
                      />
                      <motion.div
                        animate={playing ? { rotate: 360 } : {}}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-400 border-4 border-white rounded-full"
                      />
                    </div>
                  )}

                  {activeVideo.theme === 'satuan-panjang' && (
                    <div className="w-full max-w-[220px] space-y-2">
                      <div className="h-10 rounded-lg bg-amber-300 border-2 border-amber-700 flex items-end justify-between px-2 pb-1 text-xs font-bold text-amber-950">
                        {[0, 5, 10, 15, 20].map((cm) => (
                          <div key={cm} className="flex flex-col items-center">
                            <div className="w-0.5 h-3 bg-amber-900 mb-0.5" />
                            <span>{cm}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-center font-display font-bold text-base sm:text-xl text-emerald-300">
                        1 m = 100 cm
                      </div>
                    </div>
                  )}

                  {activeVideo.theme === 'perkalian' && (
                    <div className="text-center space-y-2">
                      <div className="text-2xl sm:text-3xl">🍎🍎 + 🍎🍎 + 🍎🍎</div>
                      <div className="font-display font-bold text-2xl sm:text-3xl text-amber-300">
                        3 × 2 = 6
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs sm:text-sm font-bold text-emerald-200 truncate">
                  {activeChapter.title}
                </div>
              </div>

              {/* Teacher Character Left (Feride) */}
              <motion.div
                animate={playing ? { y: [0, -4, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10 self-end -mb-2"
              >
                <KidAvatar avatarId="feride" mood={playing ? 'cheering' : 'waving'} size={108} />
              </motion.div>

              {/* Center Play Button Overlay when paused */}
              {!playing && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    if (elapsed >= activeVideo.durationSeconds) setElapsed(0);
                    setPlaying(true);
                  }}
                  aria-label="Putar Video"
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 hover:bg-black/15 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-[#2563EB] shadow-xl flex items-center justify-center hover:scale-105 transition-transform">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                  </div>
                </button>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="bg-slate-900 px-4 py-3 flex items-center gap-3 text-white">
              <button
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  setPlaying((p) => !p);
                }}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                aria-label={playing ? 'Jeda' : 'Putar'}
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <span className="text-xs font-bold tabular-nums shrink-0">
                {formatClock(elapsed)} / {formatClock(activeVideo.durationSeconds)}
              </span>

              <input
                type="range"
                min={0}
                max={activeVideo.durationSeconds}
                value={elapsed}
                onChange={(e) => setElapsed(Number(e.target.value))}
                aria-label="Posisi video"
                className="flex-1 accent-sky-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Caption & Video Description */}
          <div className="bg-white rounded-2xl p-5 card-kid border border-sky-100 space-y-3">
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-sm sm:text-base font-bold text-sky-900">
              💬 &ldquo;{activeChapter.caption}&rdquo;
            </div>

            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900">{activeVideo.title}</h2>
              <p className="mt-1 text-base font-semibold text-slate-600">{activeVideo.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-1 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                {activeVideo.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                {activeVideo.gradeLabel}
              </span>
            </div>

            {/* Interactive Chapter Jump Buttons */}
            <div className="pt-2 flex flex-wrap gap-2">
              {activeVideo.chapters.map((ch) => (
                <button
                  key={ch.title}
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    setElapsed(ch.time);
                    setPlaying(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    activeChapter.title === ch.title
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
                  }`}
                >
                  {formatClock(ch.time)} · {ch.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Video Lainnya */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-display font-bold text-xl text-slate-900 px-1">Video Lainnya</h3>
          <div className="space-y-3">
            {VIDEO_LESSONS.map((vid) => {
              const isCurrent = vid.id === activeVideo.id;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => switchVideo(vid)}
                  className={`w-full p-3 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#EFF6FF] border-[#2563EB] shadow-md'
                      : 'bg-white border-slate-100 hover:border-sky-300 shadow-sm'
                  }`}
                >
                  <div className="w-24 h-16 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center shrink-0 relative overflow-hidden">
                    <span className="text-2xl">
                      {vid.theme === 'pecahan'
                        ? '🥧'
                        : vid.theme === 'bangun-datar'
                        ? '🔺'
                        : vid.theme === 'satuan-panjang'
                        ? '📏'
                        : '🍎'}
                    </span>
                    <div className="absolute bottom-1 right-1 bg-black/50 rounded-full p-0.5">
                      <Play className="w-3 h-3 fill-white text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-base text-slate-900 truncate">
                      {vid.title}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{vid.duration}</span>
                      <span>·</span>
                      <span>{vid.gradeLabel}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
