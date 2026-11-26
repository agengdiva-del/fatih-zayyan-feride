import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { GameCardScene } from './CartoonArt';
import { soundFX } from '../utils/sound';

type ActiveGame =
  | null
  | 'tangkap-huruf'
  | 'tebak-angka'
  | 'susun-kata'
  | 'puzzle-hewan'
  | 'hitung-roket'
  | 'tebak-warna'
  | 'cocok-budaya'
  | 'pancing-sains';

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
  { word: 'PELANGI', emoji: '🌈', hint: 'Muncul berwarna-warni setelah hujan' },
  { word: 'ROKET', emoji: '🚀', hint: 'Wahana terbang ke luar angkasa' },
  { word: 'RUMAH', emoji: '🏠', hint: 'Tempat tinggal bersama keluarga' },
  { word: 'BUNGA', emoji: '🌸', hint: 'Tumbuh harum dan indah di taman' },
];

const ANIMAL_PAIRS = [
  { id: 'gajah', name: 'Gajah', emoji: '🐘' },
  { id: 'jerapah', name: 'Jerapah', emoji: '🦒' },
  { id: 'singa', name: 'Singa', emoji: '🦁' },
  { id: 'kucing', name: 'Kucing', emoji: '🐱' },
  { id: 'kelinci', name: 'Kelinci', emoji: '🐰' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
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
  if (activeGame === 'hitung-roket') {
    return <HitungRoketGame onBack={() => setActiveGame(null)} onEarnXP={onEarnXP} />;
  }
  if (activeGame === 'tebak-warna') {
    return <TebakWarnaGame onBack={() => setActiveGame(null)} onEarnXP={onEarnXP} />;
  }
  if (activeGame === 'cocok-budaya') {
    return <CocokBudayaGame onBack={() => setActiveGame(null)} onEarnXP={onEarnXP} />;
  }
  if (activeGame === 'pancing-sains') {
    return <MisiSainsGame onBack={() => setActiveGame(null)} onEarnXP={onEarnXP} />;
  }

  const games: {
    id: Exclude<ActiveGame, null>;
    title: string;
    subtitle: string;
    cardBg: string;
    btnBg: string;
  }[] = [
    {
      id: 'tangkap-huruf',
      title: 'Tangkap Huruf',
      subtitle: 'Ketuk balon huruf target!',
      cardBg: 'from-[#86EFAC] to-[#4ADE80]',
      btnBg: 'bg-[#15803D]',
    },
    {
      id: 'tebak-angka',
      title: 'Tebak Angka',
      subtitle: 'Cari angka rahasia 1–15',
      cardBg: 'from-[#F9A8D4] to-[#F472B6]',
      btnBg: 'bg-[#BE185D]',
    },
    {
      id: 'susun-kata',
      title: 'Susun Kata',
      subtitle: 'Rangkai huruf jadi kata seru',
      cardBg: 'from-[#7DD3FC] to-[#38BDF8]',
      btnBg: 'bg-[#0369A1]',
    },
    {
      id: 'puzzle-hewan',
      title: 'Puzzle Hewan',
      subtitle: 'Temukan pasangan hewan lucu',
      cardBg: 'from-[#FDE047] to-[#A3E635]',
      btnBg: 'bg-[#15803D]',
    },
    {
      id: 'hitung-roket',
      title: 'Hitung Cepat Roket',
      subtitle: 'Luncurkan roket ke bintang!',
      cardBg: 'from-[#A5B4FC] to-[#6366F1]',
      btnBg: 'bg-[#3730A3]',
    },
    {
      id: 'tebak-warna',
      title: 'Tebak Warna & Bentuk',
      subtitle: 'Campur warna & kenali bentuk',
      cardBg: 'from-[#FDBA74] to-[#FB923C]',
      btnBg: 'bg-[#C2410C]',
    },
    {
      id: 'cocok-budaya',
      title: 'Jelajah Budaya & Inggris',
      subtitle: 'Tebak budaya Nusantara & kata',
      cardBg: 'from-[#FDA4AF] to-[#F43F5E]',
      btnBg: 'bg-[#9F1239]',
    },
    {
      id: 'pancing-sains',
      title: 'Misi Sains & Alam',
      subtitle: 'Eksplorasi planet & makhluk hidup',
      cardBg: 'from-[#67E8F9] to-[#06B6D4]',
      btnBg: 'bg-[#0E7490]',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
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
              Game Edukasi Anak
            </h1>
            <p className="text-sm sm:text-base font-bold text-[#1E3A8A]">
              8 pilihan permainan seru sambil mengumpulkan poin belajar!
            </p>
          </div>
        </div>
      </div>

      {/* 8 Illustrated Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {games.map((g, idx) => (
          <motion.button
            key={g.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
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
            <div className="space-y-2">
              <p className="px-1 text-xs font-extrabold text-slate-900/80">{g.subtitle}</p>
              <div
                className={`${g.btnBg} text-white rounded-2xl px-4 py-3 flex items-center justify-between font-display font-bold text-base sm:text-lg shadow-sm`}
              >
                <span className="truncate">{g.title}</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </div>
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
  const TARGETS = ['A', 'I', 'U', 'E', 'O', 'B', 'M', 'S', 'K', 'R'];
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
          onEarnXP(30);
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
        <p className="text-sm font-bold text-slate-600">Temukan 6 pasang kartu hewan yang sama!</p>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, idx) => {
            const isOpen = flipped.includes(idx) || matched.includes(card.id);
            return (
              <motion.button
                key={card.uid}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => handleFlip(idx)}
                className={`h-22 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-colors ${
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
              Hebat! Semua hewan bertemu pasangannya! +30 ⭐
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

/* -------------------------------------------------------------
 * MINI GAME 5: HITUNG CEPAT ROKET
 * ------------------------------------------------------------- */
function makeRocketChallenge() {
  const ops = ['+', '-', '×'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = 0;
  let b = 0;
  let answer = 0;
  if (op === '+') {
    a = Math.floor(Math.random() * 18) + 3;
    b = Math.floor(Math.random() * 15) + 2;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * 9) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 8) + 2;
    b = Math.floor(Math.random() * 8) + 2;
    answer = a * b;
  }
  const set = new Set<number>([answer]);
  while (set.size < 4) {
    const delta = Math.floor(Math.random() * 7) - 3;
    const candidate = Math.max(1, answer + (delta === 0 ? 4 : delta));
    set.add(candidate);
  }
  return {
    prompt: `${a} ${op} ${b} = ?`,
    answer,
    options: Array.from(set).sort(() => Math.random() - 0.5),
  };
}

function HitungRoketGame({ onBack, onEarnXP }: { onBack: () => void; onEarnXP: (xp: number) => void }) {
  const [altitude, setAltitude] = useState(0);
  const [streak, setStreak] = useState(0);
  const [challenge, setChallenge] = useState(makeRocketChallenge);
  const [feedback, setFeedback] = useState('Jawab 5 hitungan benar untuk meluncurkan roket ke bintang!');

  const launched = altitude >= 100;

  const handlePick = (opt: number) => {
    if (launched) return;
    if (opt === challenge.answer) {
      soundFX.playCorrect();
      const nextAlt = Math.min(100, altitude + 20);
      setAltitude(nextAlt);
      setStreak((s) => s + 1);
      if (nextAlt >= 100) {
        soundFX.playWin();
        onEarnXP(25);
        setFeedback('WUUUSH! Roket berhasil sampai di planet bintang! +25 ⭐');
      } else {
        setFeedback(`Benar! Bahan bakar bertambah! Ketinggian ${nextAlt}% 🚀`);
        setChallenge(makeRocketChallenge());
      }
    } else {
      soundFX.playWrong();
      setStreak(0);
      setFeedback(`Ups! ${challenge.prompt.replace('?', String(challenge.answer))} adalah jawaban tepat. Ayo lanjut!`);
      setChallenge(makeRocketChallenge());
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
        <div className="font-bold text-sm text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
          🔥 Streak: {streak}
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#1E1B4B] to-[#312E81] rounded-[28px] p-6 card-kid border-4 border-white text-center text-white space-y-5">
        <h2 className="font-display font-bold text-2xl">Hitung Cepat Roket 🚀</h2>

        {/* Altitude Meter */}
        <div className="bg-white/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
            <span>Bumi 🌍</span>
            <span>Ketinggian: {altitude}%</span>
            <span>Bintang ⭐</span>
          </div>
          <div className="relative h-6 bg-indigo-950/70 rounded-full overflow-hidden border border-indigo-400/40">
            <motion.div
              animate={{ width: `${altitude}%` }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 rounded-full"
            />
          </div>
          <motion.div
            animate={launched ? { y: [0, -10, 0], scale: [1, 1.18, 1] } : { y: [0, -4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="text-5xl pt-1"
          >
            {launched ? '🚀✨' : '🚀'}
          </motion.div>
        </div>

        <p className="text-sm font-bold text-amber-200">{feedback}</p>

        {!launched ? (
          <>
            <div className="bg-white text-slate-900 rounded-2xl py-4 px-6 font-display font-bold text-4xl shadow-inner">
              {challenge.prompt}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {challenge.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handlePick(opt)}
                  className="py-4 rounded-2xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-display font-bold text-2xl border-2 border-white shadow active:scale-95 transition-all cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              setAltitude(0);
              setStreak(0);
              setChallenge(makeRocketChallenge());
              setFeedback('Misi baru siap! Jawab 5 soal lagi untuk meluncur!');
            }}
            className="w-full py-4 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-display font-bold text-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Terbang Lagi</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
 * MINI GAME 6: TEBAK WARNA & BENTUK
 * ------------------------------------------------------------- */
const COLOR_SHAPE_CHALLENGES = [
  {
    title: 'Merah + Kuning = ?',
    swatchA: '#EF4444',
    swatchB: '#FACC15',
    options: [
      { label: 'Oranye', color: '#F97316' },
      { label: 'Hijau', color: '#22C55E' },
      { label: 'Ungu', color: '#8B5CF6' },
      { label: 'Biru', color: '#3B82F6' },
    ],
    answerIdx: 0,
    fact: 'Campuran warna Merah dan Kuning menjadi warna Oranye!',
  },
  {
    title: 'Biru + Kuning = ?',
    swatchA: '#3B82F6',
    swatchB: '#FACC15',
    options: [
      { label: 'Oranye', color: '#F97316' },
      { label: 'Hijau', color: '#22C55E' },
      { label: 'Merah Muda', color: '#EC4899' },
      { label: 'Cokelat', color: '#92400E' },
    ],
    answerIdx: 1,
    fact: 'Campuran warna Biru dan Kuning menjadi warna Hijau segar!',
  },
  {
    title: 'Merah + Biru = ?',
    swatchA: '#EF4444',
    swatchB: '#3B82F6',
    options: [
      { label: 'Kuning', color: '#FACC15' },
      { label: 'Hijau', color: '#22C55E' },
      { label: 'Ungu', color: '#8B5CF6' },
      { label: 'Putih', color: '#E2E8F0' },
    ],
    answerIdx: 2,
    fact: 'Merah dan Biru berpadu indah menjadi warna Ungu!',
  },
  {
    title: 'Merah + Putih = ?',
    swatchA: '#EF4444',
    swatchB: '#F8FAFC',
    options: [
      { label: 'Merah Muda', color: '#F472B6' },
      { label: 'Hitam', color: '#1E293B' },
      { label: 'Hijau', color: '#22C55E' },
      { label: 'Oranye', color: '#F97316' },
    ],
    answerIdx: 0,
    fact: 'Merah dicampur Putih menjadi warna Pink / Merah Muda!',
  },
  {
    title: 'Bangun dengan 3 sisi adalah ...',
    swatchA: '',
    swatchB: '',
    shapeHint: '🔺',
    options: [
      { label: 'Lingkaran', color: '#38BDF8' },
      { label: 'Segitiga', color: '#22C55E' },
      { label: 'Persegi', color: '#F59E0B' },
      { label: 'Bintang', color: '#EC4899' },
    ],
    answerIdx: 1,
    fact: 'Segitiga selalu memiliki 3 sisi dan 3 sudut!',
  },
];

function TebakWarnaGame({ onBack, onEarnXP }: { onBack: () => void; onEarnXP: (xp: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const item = COLOR_SHAPE_CHALLENGES[idx];
  const isCorrect = picked === item.answerIdx;

  const handleChoose = (optIdx: number) => {
    if (isCorrect) return;
    setPicked(optIdx);
    if (optIdx === item.answerIdx) {
      soundFX.playCorrect();
      setScore((s) => s + 15);
      onEarnXP(15);
    } else {
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
        <div className="font-display font-bold text-lg text-orange-700 bg-orange-50 px-3.5 py-1.5 rounded-xl border border-orange-200">
          Skor: {score} ⭐
        </div>
      </div>

      <div className="bg-white rounded-[28px] p-6 card-kid border-2 border-orange-200 text-center space-y-5">
        <h2 className="font-display font-bold text-2xl text-slate-900">Tebak Warna & Bentuk 🎨</h2>

        <div className="flex items-center justify-center gap-4 py-2">
          {item.shapeHint ? (
            <div className="text-7xl">{item.shapeHint}</div>
          ) : (
            <>
              <div
                style={{ backgroundColor: item.swatchA }}
                className="w-16 h-16 rounded-full border-4 border-slate-200 shadow-md"
              />
              <span className="font-display font-bold text-3xl text-slate-700">+</span>
              <div
                style={{ backgroundColor: item.swatchB }}
                className="w-16 h-16 rounded-full border-4 border-slate-200 shadow-md"
              />
            </>
          )}
        </div>

        <div className="font-display font-bold text-2xl text-slate-900">{item.title}</div>

        <div className="grid grid-cols-2 gap-3">
          {item.options.map((opt, optIdx) => {
            const chosen = picked === optIdx;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleChoose(optIdx)}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 font-display font-bold text-lg cursor-pointer transition-all ${
                  chosen && optIdx === item.answerIdx
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                    : chosen
                    ? 'bg-rose-100 border-rose-400 text-rose-800'
                    : 'bg-white border-slate-200 hover:border-orange-300 text-slate-800'
                }`}
              >
                <span
                  style={{ backgroundColor: opt.color }}
                  className="w-8 h-8 rounded-full border-2 border-white shadow shrink-0"
                />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {isCorrect && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <p className="font-bold text-emerald-800">{item.fact} (+15 ⭐)</p>
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                setPicked(null);
                setIdx((i) => (i + 1) % COLOR_SHAPE_CHALLENGES.length);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#16A34A] text-white font-display font-bold text-base btn-3d-green cursor-pointer"
            >
              Tantangan Berikutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
 * MINI GAME 7: JELAJAH BUDAYA & BAHASA INGGRIS
 * ------------------------------------------------------------- */
const CULTURE_ENGLISH_ITEMS = [
  {
    emoji: '🎋',
    question: 'Alat musik bambu Angklung berasal dari provinsi ...',
    options: ['Jawa Barat', 'Bali', 'Papua', 'Aceh'],
    answerIdx: 0,
    fact: 'Angklung adalah warisan budaya khas Sunda, Jawa Barat!',
  },
  {
    emoji: '🎭',
    question: 'Tari Kecak yang terkenal dengan seruan "Cak!" berasal dari ...',
    options: ['Jawa Timur', 'Bali', 'Sumatera Utara', 'Kalimantan'],
    answerIdx: 1,
    fact: 'Tari Kecak adalah tarian tradisional yang memukau dari Pulau Bali!',
  },
  {
    emoji: '🦋',
    question: 'Bahasa Inggris dari "Kupu-kupu" adalah ...',
    options: ['Butterfly', 'Dragonfly', 'Ladybug', 'Honeybee'],
    answerIdx: 0,
    fact: 'Butterfly artinya kupu-kupu yang cantik!',
  },
  {
    emoji: '🌈',
    question: 'Bahasa Inggris dari "Pelangi" adalah ...',
    options: ['Sunshine', 'Rainbow', 'Cloudy', 'Thunder'],
    answerIdx: 1,
    fact: 'Rainbow berarti pelangi berwarna-warni!',
  },
  {
    emoji: '🍛',
    question: 'Makanan khas Rendang yang terkenal di dunia berasal dari ...',
    options: ['Sumatera Barat', 'Sulawesi Utara', 'Maluku', 'Lampung'],
    answerIdx: 0,
    fact: 'Rendang berasal dari Minangkabau, Sumatera Barat!',
  },
];

function CocokBudayaGame({ onBack, onEarnXP }: { onBack: () => void; onEarnXP: (xp: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const item = CULTURE_ENGLISH_ITEMS[idx];
  const isCorrect = picked === item.answerIdx;

  const handleSelect = (optIdx: number) => {
    if (isCorrect) return;
    setPicked(optIdx);
    if (optIdx === item.answerIdx) {
      soundFX.playCorrect();
      setScore((s) => s + 15);
      onEarnXP(15);
    } else {
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
        <div className="font-display font-bold text-lg text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-200">
          Skor: {score} ⭐
        </div>
      </div>

      <div className="bg-white rounded-[28px] p-6 card-kid border-2 border-rose-200 text-center space-y-5">
        <h2 className="font-display font-bold text-2xl text-slate-900">Jelajah Budaya &amp; Inggris 🇮🇩</h2>
        <div className="text-6xl">{item.emoji}</div>
        <p className="font-display font-bold text-xl text-slate-900">{item.question}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {item.options.map((opt, optIdx) => {
            const chosen = picked === optIdx;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(optIdx)}
                className={`py-3.5 px-4 rounded-2xl border-2 font-display font-bold text-lg cursor-pointer transition-all ${
                  chosen && optIdx === item.answerIdx
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                    : chosen
                    ? 'bg-rose-100 border-rose-400 text-rose-800'
                    : 'bg-white border-slate-200 hover:border-rose-300 text-slate-800'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isCorrect && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <p className="font-bold text-emerald-800">{item.fact} (+15 ⭐)</p>
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                setPicked(null);
                setIdx((i) => (i + 1) % CULTURE_ENGLISH_ITEMS.length);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#16A34A] text-white font-display font-bold text-base btn-3d-green cursor-pointer"
            >
              Lanjut Jelajah
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
 * MINI GAME 8: MISI SAINS & ALAM
 * ------------------------------------------------------------- */
const SCIENCE_MISSIONS = [
  {
    emoji: '🌱',
    question: 'Tumbuhan memasak makanannya sendiri di daun dengan bantuan ...',
    options: ['Cahaya Matahari', 'Es Batu', 'Suara Petir', 'Batu Kerikil'],
    answerIdx: 0,
    fact: 'Benar! Proses ini disebut Fotosintesis dan menghasilkan oksigen segar!',
  },
  {
    emoji: '🪐',
    question: 'Planet bercincin indah di tata surya kita adalah ...',
    options: ['Mars', 'Saturnus', 'Merkurius', 'Bumi'],
    answerIdx: 1,
    fact: 'Saturnus memiliki cincin raksasa dari es dan debu luar angkasa!',
  },
  {
    emoji: '🐟',
    question: 'Ikan bernapas di dalam air menggunakan ...',
    options: ['Paru-paru', 'Insang', 'Sayap', 'Kulit'],
    answerIdx: 1,
    fact: 'Insang menyaring oksigen yang terlarut di dalam air!',
  },
  {
    emoji: '🍎',
    question: 'Buah apel jatuh dari pohon ke tanah karena adanya gaya ...',
    options: ['Magnet', 'Gravitasi', 'Listrik', 'Pegas'],
    answerIdx: 1,
    fact: 'Gaya gravitasi Bumi selalu menarik benda ke arah bawah!',
  },
  {
    emoji: '💧',
    question: 'Air yang dipanaskan terus-menerus akan berubah menjadi uap. Proses ini disebut ...',
    options: ['Membeku', 'Menguap', 'Mencair', 'Mengembun'],
    answerIdx: 1,
    fact: 'Menguap adalah perubahan benda cair menjadi gas!',
  },
];

function MisiSainsGame({ onBack, onEarnXP }: { onBack: () => void; onEarnXP: (xp: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const item = SCIENCE_MISSIONS[idx];
  const isCorrect = picked === item.answerIdx;

  const handleSelect = (optIdx: number) => {
    if (isCorrect) return;
    setPicked(optIdx);
    if (optIdx === item.answerIdx) {
      soundFX.playCorrect();
      setScore((s) => s + 15);
      onEarnXP(15);
    } else {
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
        <div className="font-display font-bold text-lg text-cyan-800 bg-cyan-50 px-3.5 py-1.5 rounded-xl border border-cyan-200">
          Skor: {score} ⭐
        </div>
      </div>

      <div className="bg-white rounded-[28px] p-6 card-kid border-2 border-cyan-200 text-center space-y-5">
        <h2 className="font-display font-bold text-2xl text-slate-900">Misi Sains &amp; Alam 🔬</h2>
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          {item.emoji}
        </motion.div>
        <p className="font-display font-bold text-xl text-slate-900">{item.question}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {item.options.map((opt, optIdx) => {
            const chosen = picked === optIdx;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(optIdx)}
                className={`py-3.5 px-4 rounded-2xl border-2 font-display font-bold text-lg cursor-pointer transition-all ${
                  chosen && optIdx === item.answerIdx
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                    : chosen
                    ? 'bg-rose-100 border-rose-400 text-rose-800'
                    : 'bg-white border-slate-200 hover:border-cyan-300 text-slate-800'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isCorrect && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 space-y-3">
            <p className="font-bold text-cyan-900">{item.fact} (+15 ⭐)</p>
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                setPicked(null);
                setIdx((i) => (i + 1) % SCIENCE_MISSIONS.length);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#0891B2] hover:bg-[#0E7490] text-white font-display font-bold text-base cursor-pointer"
            >
              Misi Sains Berikutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
