import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { GameCardScene } from './CartoonArt';
import { soundFX } from '../utils/sound';

type ActiveGame = null | 'tangkap-huruf' | 'tebak-angka' | 'susun-kata' | 'puzzle-hewan';

interface GamesHubScreenProps {
  onBack: () => void;
  onEarnXP: (xp: number) => void;
}

const WORD_PUZZLES = [
  { word: 'BUKU', emoji: '📘', hint: 'Teman membaca di sekolah' },
  { word: 'APEL', emoji: '🍎', hint: 'Buah berwarna merah manis' },
  { word: 'BOLA', emoji: '⚽', hint: 'Dimainkan di lapangan' },
  { word: 'ROTI', emoji: '🍞', hint: 'Makanan lezat untuk sarapan' },
  { word: 'KUCING', emoji: '🐱', hint: 'Hewan lucu bersuara meong' },
  { word: 'BINTANG', emoji: '⭐', hint: 'Bersinar indah di langit malam' },
];

const ANIMAL_PAIRS = [
  { id: 'gajah', name: 'Gajah', emoji: '🐘' },
  { id: 'jerapah', name: 'Jerapah', emoji: '🦒' },
  { id: 'singa', name: 'Singa', emoji: '🦁' },
  { id: 'kucing', name: 'Kucing', emoji: '🐱' },
];

export function GamesHubScreen({ onBack, onEarnXP }: GamesHubScreenProps) {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  if (activeGame === 'tangkap-huruf') {
    return <TangkapHurufGame onBack={() => setActiveGame(null)} onEarnXP={onEarnXP} />;
  }
  if (activeGame === 'tebak-angka') {
    return <TebakAngkaGame onBack={() => setActiveGame(null)} onEarnXP={onEarnXP} />;
  }
  if (activeGame === 'susun-kata') {
    return <SusunKataGame onBack={() => setActiveGame(null)} onEarnXP={onEarnXP} />;
  }
  if (activeGame === 'puzzle-hewan') {
    return <PuzzleHewanGame onBack={() => setActiveGame(null)} onEarnXP={onEarnXP} />;
  }

  const games: {
    id: Exclude<ActiveGame, null>;
    title: string;
    cardBg: string;
    btnBg: string;
  }[] = [
    {
      id: 'tangkap-huruf',
      title: 'Tangkap Huruf',
      cardBg: 'from-[#86EFAC] to-[#4ADE80]',
      btnBg: 'bg-[#15803D]',
    },
    {
      id: 'tebak-angka',
      title: 'Tebak Angka',
      cardBg: 'from-[#F9A8D4] to-[#F472B6]',
      btnBg: 'bg-[#BE185D]',
    },
    {
      id: 'susun-kata',
      title: 'Susun Kata',
      cardBg: 'from-[#7DD3FC] to-[#38BDF8]',
      btnBg: 'bg-[#0369A1]',
    },
    {
      id: 'puzzle-hewan',
      title: 'Puzzle Hewan',
      cardBg: 'from-[#FDE047] to-[#A3E635]',
      btnBg: 'bg-[#15803D]',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header (Matches Screen 9) */}
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
            Game Edukasi
          </h1>
          <p className="text-sm sm:text-base font-bold text-[#1E3A8A]">
            Belajar sambil bermain, pasti lebih seru!
          </p>
        </div>
      </div>

      {/* 2x2 Illustrated Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {games.map((g, idx) => (
          <motion.button
            key={g.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundFX.playTap();
              setActiveGame(g.id);
            }}
            className={`rounded-[26px] bg-gradient-to-b ${g.cardBg} p-3 shadow-lg border-4 border-white text-left overflow-hidden cursor-pointer flex flex-col justify-between`}
          >
            <div className="py-2">
              <GameCardScene gameId={g.id} />
            </div>
            <div
              className={`${g.btnBg} text-white rounded-2xl px-4 py-3 flex items-center justify-between font-display font-bold text-lg sm:text-xl shadow-sm`}
            >
              <span>{g.title}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
 * MINI GAME 1: TANGKAP HURUF
 * ------------------------------------------------------------- */
function TangkapHurufGame({ onBack, onEarnXP }: { onBack: () => void; onEarnXP: (xp: number) => void }) {
  const TARGETS = ['A', 'I', 'U', 'E', 'O', 'B', 'M', 'S'];
  const [target, setTarget] = useState('A');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Tap semua balon dengan huruf target!');
  const [balloons, setBalloons] = useState<{ id: number; letter: string; color: string }[]>([]);

  const spawnBalloons = (targetLetter: string) => {
    const colors = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'];
    const pool = 'ABCEFGHIJKLMNOUPRST'.split('');
    const list: { id: number; letter: string; color: string }[] = [];
    const targetPositions = new Set([1, 4]);
    for (let i = 0; i < 6; i++) {
      const letter = targetPositions.has(i)
        ? targetLetter
        : pool[Math.floor(Math.random() * pool.length)];
      list.push({
        id: Date.now() + i,
        letter,
        color: colors[i % colors.length],
      });
    }
    setBalloons(list.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    spawnBalloons('A');
  }, []);

  const handlePop = (letter: string) => {
    if (letter === target) {
      soundFX.playCorrect();
      const nextScore = score + 10;
      setScore(nextScore);
      onEarnXP(10);
      setMessage(`Hebat! Kamu menangkap huruf ${target}! +10 ⭐`);
      const nextT = TARGETS[Math.floor(Math.random() * TARGETS.length)];
      setTarget(nextT);
      spawnBalloons(nextT);
    } else {
      soundFX.playWrong();
      setMessage(`Ups, itu huruf ${letter}. Cari huruf ${target} ya!`);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <div className="font-display font-bold text-xl text-amber-600 bg-amber-50 px-4 py-1.5 rounded-xl border border-amber-200 tabular-nums">
          Skor: {score} ⭐
        </div>
      </div>

      <div className="bg-white rounded-[28px] p-6 card-kid border-2 border-emerald-200 text-center space-y-5">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Tangkap Huruf!</h2>
          <p className="text-base font-bold text-slate-600 mt-1">{message}</p>
        </div>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300">
          <span className="font-bold text-emerald-900">Cari Huruf:</span>
          <span className="font-display font-bold text-4xl text-emerald-600">{target}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          {balloons.map((b) => (
            <motion.button
              key={b.id}
              type="button"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: (b.id % 5) * 0.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => handlePop(b.letter)}
              style={{ backgroundColor: b.color }}
              className="h-24 rounded-full border-4 border-white shadow-lg font-display font-bold text-4xl text-white flex items-center justify-center cursor-pointer"
            >
              {b.letter}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
 * MINI GAME 2: TEBAK ANGKA
 * ------------------------------------------------------------- */
function TebakAngkaGame({ onBack, onEarnXP }: { onBack: () => void; onEarnXP: (xp: number) => void }) {
  const [secret, setSecret] = useState(() => Math.floor(Math.random() * 15) + 1);
  const [hint, setHint] = useState('Aku memikirkan angka antara 1 sampai 15. Tebak yuk!');
  const [won, setWon] = useState(false);
  const [tries, setTries] = useState(0);

  const handleGuess = (n: number) => {
    if (won) return;
    setTries((t) => t + 1);
    if (n === secret) {
      soundFX.playWin();
      setWon(true);
      onEarnXP(20);
      setHint(`Benar! Angkanya adalah ${secret}! +20 ⭐`);
    } else if (n < secret) {
      soundFX.playWrong();
      setHint(`Angka ${n} masih terlalu KECIL! Coba angka lebih besar.`);
    } else {
      soundFX.playWrong();
      setHint(`Angka ${n} terlalu BESAR! Coba angka lebih kecil.`);
    }
  };

  const reset = () => {
    soundFX.playTap();
    setSecret(Math.floor(Math.random() * 15) + 1);
    setHint('Aku memikirkan angka baru antara 1 sampai 15!');
    setWon(false);
    setTries(0);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <span className="font-bold text-sm text-pink-700 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-200 tabular-nums">
          Percobaan: {tries}
        </span>
      </div>

      <div className="bg-white rounded-[28px] p-6 card-kid border-2 border-pink-200 text-center space-y-5">
        <h2 className="font-display font-bold text-2xl text-slate-900">Tebak Angka Rahasia 🔢</h2>
        <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 font-bold text-base text-pink-900">
          {hint}
        </div>

        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleGuess(num)}
              className={`h-14 rounded-2xl font-display font-bold text-2xl border-2 transition-all cursor-pointer ${
                won && num === secret
                  ? 'bg-[#22C55E] border-[#16A34A] text-white scale-105'
                  : 'bg-white border-pink-200 hover:bg-pink-50 text-slate-900 active:scale-95'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {won && (
          <button
            type="button"
            onClick={reset}
            className="w-full py-3.5 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-display font-bold text-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Lagi</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
 * MINI GAME 3: SUSUN KATA
 * ------------------------------------------------------------- */
function SusunKataGame({ onBack, onEarnXP }: { onBack: () => void; onEarnXP: (xp: number) => void }) {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = WORD_PUZZLES[puzzleIdx];
  const [picked, setPicked] = useState<number[]>([]);
  const [scrambled, setScrambled] = useState<string[]>([]);

  useEffect(() => {
    const letters = puzzle.word.split('');
    setScrambled([...letters].sort(() => Math.random() - 0.5));
    setPicked([]);
  }, [puzzle]);

  const builtWord = picked.map((i) => scrambled[i]).join('');
  const isSolved = builtWord === puzzle.word;

  const handlePick = (idx: number) => {
    if (picked.includes(idx) || isSolved) return;
    soundFX.playTap();
    const next = [...picked, idx];
    setPicked(next);
    const nextWord = next.map((i) => scrambled[i]).join('');
    if (nextWord === puzzle.word) {
      soundFX.playWin();
      onEarnXP(20);
    } else if (next.length === puzzle.word.length) {
      soundFX.playWrong();
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <span className="font-bold text-sm text-sky-700">
          Kata {puzzleIdx + 1} dari {WORD_PUZZLES.length}
        </span>
      </div>

      <div className="bg-white rounded-[28px] p-6 card-kid border-2 border-sky-200 text-center space-y-5">
        <h2 className="font-display font-bold text-2xl text-slate-900">Susun Kata</h2>
        <div className="text-6xl">{puzzle.emoji}</div>
        <p className="text-base font-bold text-sky-800">Petunjuk: {puzzle.hint}</p>

        {/* Word Slots */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {puzzle.word.split('').map((_, slotIdx) => {
            const letter = picked[slotIdx] !== undefined ? scrambled[picked[slotIdx]] : '';
            return (
              <div
                key={slotIdx}
                className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center font-display font-bold text-2xl ${
                  isSolved
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : letter
                    ? 'bg-sky-100 border-sky-400 text-sky-900'
                    : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                {letter || '_'}
              </div>
            );
          })}
        </div>

        {/* Scrambled Letter Tiles */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap pt-2">
          {scrambled.map((ch, idx) => {
            const used = picked.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                disabled={used}
                onClick={() => handlePick(idx)}
                className={`w-13 h-13 rounded-2xl font-display font-bold text-2xl border-2 transition-all cursor-pointer ${
                  used
                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'bg-amber-300 hover:bg-amber-400 border-amber-500 text-amber-950 shadow-sm active:scale-95'
                }`}
              >
                {ch}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          {!isSolved && picked.length > 0 && (
            <button
              type="button"
              onClick={() => setPicked([])}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
            >
              Ulangi Huruf
            </button>
          )}
          {isSolved && (
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                setPuzzleIdx((i) => (i + 1) % WORD_PUZZLES.length);
              }}
              className="px-6 py-3 rounded-2xl bg-[#16A34A] text-white font-display font-bold text-lg flex items-center gap-2 btn-3d-green cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Kata Berikutnya (+20 ⭐)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
 * MINI GAME 4: PUZZLE HEWAN (MEMORY MATCH)
 * ------------------------------------------------------------- */
function PuzzleHewanGame({ onBack, onEarnXP }: { onBack: () => void; onEarnXP: (xp: number) => void }) {
  const createDeck = () =>
    [...ANIMAL_PAIRS, ...ANIMAL_PAIRS]
      .map((item, idx) => ({ ...item, uid: `${item.id}-${idx}` }))
      .sort(() => Math.random() - 0.5);

  const [cards, setCards] = useState(createDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  const handleFlip = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].id)) return;
    soundFX.playTap();
    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      const [a, b] = next;
      if (cards[a].id === cards[b].id) {
        soundFX.playCorrect();
        const nextMatched = [...matched, cards[a].id];
        setMatched(nextMatched);
        setFlipped([]);
        if (nextMatched.length === ANIMAL_PAIRS.length) {
          soundFX.playWin();
          onEarnXP(25);
        }
      } else {
        window.setTimeout(() => setFlipped([]), 750);
      }
    }
  };

  const allDone = matched.length === ANIMAL_PAIRS.length;

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <span className="font-bold text-sm text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 tabular-nums">
          Pasangan: {matched.length} / {ANIMAL_PAIRS.length}
        </span>
      </div>

      <div className="bg-white rounded-[28px] p-6 card-kid border-2 border-lime-200 text-center space-y-5">
        <h2 className="font-display font-bold text-2xl text-slate-900">Puzzle Pasangan Hewan 🦁</h2>
        <p className="text-sm font-bold text-slate-600">Temukan dua kartu hewan yang sama!</p>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, idx) => {
            const isOpen = flipped.includes(idx) || matched.includes(card.id);
            return (
              <motion.button
                key={card.uid}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => handleFlip(idx)}
                className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  matched.includes(card.id)
                    ? 'bg-emerald-100 border-emerald-400'
                    : isOpen
                    ? 'bg-amber-50 border-amber-400'
                    : 'bg-sky-500 border-sky-600 text-white hover:bg-sky-400'
                }`}
              >
                {isOpen ? (
                  <>
                    <span className="text-3xl">{card.emoji}</span>
                    <span className="text-xs font-bold text-slate-800 mt-1">{card.name}</span>
                  </>
                ) : (
                  <span className="font-display font-bold text-3xl">?</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {allDone && (
          <div className="space-y-3 pt-2">
            <div className="font-display font-bold text-xl text-emerald-700">
              Hebat! Semua hewan bertemu pasangannya! +25 ⭐
            </div>
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                setCards(createDeck());
                setMatched([]);
                setFlipped([]);
              }}
              className="px-6 py-3 rounded-2xl bg-[#16A34A] text-white font-display font-bold text-lg btn-3d-green cursor-pointer"
            >
              Main Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
