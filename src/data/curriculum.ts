import { BadgeItem, DifficultyLevel, LeaderboardEntry, LearningQuestion, StudentProfile, SubjectInfo, VideoLessonItem } from '../types';

// Spesifikasi Kelas:
// - Feride: Kelas 1-2 SD
// - Zayyan: Kelas 3-4 SD
// - Fatih: Kelas 4-6 SD
export const INITIAL_PROFILES: StudentProfile[] = [
  {
    id: 'fatih',
    name: 'Fatih',
    grade: 'Kelas 5 SD',
    gradeBand: 'Kelas 4-6 SD',
    gradeNumber: 5,
    daerah: 'Jawa Timur',
    sekolah: 'SDN 05 Surabaya',
    avatarId: 'fatih',
    xp: 1250,
    weeklyProgress: 75,
    badgesCount: 24,
    certificatesCount: 12,
    completedTopics: ['penjumlahan', 'pengurangan'],
    unlockedBadges: ['juara-matematika', 'rajin-belajar', 'kreatif', 'sahabat-baik'],
  },
  {
    id: 'zayyan',
    name: 'Zayyan',
    grade: 'Kelas 3 SD',
    gradeBand: 'Kelas 3-4 SD',
    gradeNumber: 3,
    daerah: 'Jawa Barat',
    sekolah: 'SDN 03 Bandung',
    avatarId: 'zayyan',
    xp: 1080,
    weeklyProgress: 65,
    badgesCount: 18,
    certificatesCount: 9,
    completedTopics: ['penjumlahan'],
    unlockedBadges: ['rajin-belajar', 'kreatif'],
  },
  {
    id: 'feride',
    name: 'Feride',
    grade: 'Kelas 2 SD',
    gradeBand: 'Kelas 1-2 SD',
    gradeNumber: 2,
    daerah: 'DKI Jakarta',
    sekolah: 'SDN 01 Menteng',
    avatarId: 'feride',
    xp: 1410,
    weeklyProgress: 85,
    badgesCount: 28,
    certificatesCount: 15,
    completedTopics: ['penjumlahan', 'pengurangan', 'perkalian'],
    unlockedBadges: ['juara-matematika', 'rajin-belajar', 'kreatif', 'sahabat-baik'],
  },
];

// Online leaderboard baseline students across regions & schools (merged with live Firestore leaderboard entries)
export const BASELINE_ONLINE_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-feride',
    uid: 'seed-feride',
    displayName: 'Feride',
    avatarId: 'feride',
    grade: 'Kelas 2 SD (1-2 SD)',
    gradeNumber: 2,
    daerah: 'DKI Jakarta',
    sekolah: 'SDN 01 Menteng',
    xp: 1410,
    badgesCount: 28,
  },
  {
    id: 'seed-fatih',
    uid: 'seed-fatih',
    displayName: 'Fatih',
    avatarId: 'fatih',
    grade: 'Kelas 5 SD (4-6 SD)',
    gradeNumber: 5,
    daerah: 'Jawa Timur',
    sekolah: 'SDN 05 Surabaya',
    xp: 1250,
    badgesCount: 24,
  },
  {
    id: 'seed-zayyan',
    uid: 'seed-zayyan',
    displayName: 'Zayyan',
    avatarId: 'zayyan',
    grade: 'Kelas 3 SD (3-4 SD)',
    gradeNumber: 3,
    daerah: 'Jawa Barat',
    sekolah: 'SDN 03 Bandung',
    xp: 1080,
    badgesCount: 18,
  },
  {
    id: 'seed-aisyah',
    uid: 'seed-aisyah',
    displayName: 'Aisyah Robo',
    avatarId: 'zahra',
    grade: 'Kelas 4 SD',
    gradeNumber: 4,
    daerah: 'DKI Jakarta',
    sekolah: 'SDN 01 Menteng',
    xp: 1320,
    badgesCount: 22,
  },
  {
    id: 'seed-bima',
    uid: 'seed-bima',
    displayName: 'Bima Bot',
    avatarId: 'bintang',
    grade: 'Kelas 6 SD',
    gradeNumber: 6,
    daerah: 'Jawa Barat',
    sekolah: 'SDN 03 Bandung',
    xp: 1190,
    badgesCount: 20,
  },
  {
    id: 'seed-nadia',
    uid: 'seed-nadia',
    displayName: 'Nadia Cyber',
    avatarId: 'feride',
    grade: 'Kelas 1 SD',
    gradeNumber: 1,
    daerah: 'Jawa Timur',
    sekolah: 'SDN 05 Surabaya',
    xp: 960,
    badgesCount: 14,
  },
  {
    id: 'seed-rafi',
    uid: 'seed-rafi',
    displayName: 'Rafi Mecha',
    avatarId: 'fatih',
    grade: 'Kelas 5 SD',
    gradeNumber: 5,
    daerah: 'DI Yogyakarta',
    sekolah: 'SD Muhammadiyah 1',
    xp: 1380,
    badgesCount: 25,
  },
  {
    id: 'seed-keisha',
    uid: 'seed-keisha',
    displayName: 'Keisha Spark',
    avatarId: 'zahra',
    grade: 'Kelas 3 SD',
    gradeNumber: 3,
    daerah: 'DKI Jakarta',
    sekolah: 'SD Islam Al-Azhar',
    xp: 1120,
    badgesCount: 19,
  },
];

export const BADGES: BadgeItem[] = [
  {
    id: 'juara-matematika',
    title: 'Juara Matematika',
    description: 'Menyelesaikan kuis berhitung dengan nilai hebat!',
    color: '#F59E0B',
    iconType: 'trophy',
  },
  {
    id: 'rajin-belajar',
    title: 'Rajin Belajar',
    description: 'Aktif belajar dan menonton video pembelajaran.',
    color: '#10B981',
    iconType: 'rocket',
  },
  {
    id: 'kreatif',
    title: 'Kreatif',
    description: 'Menyelesaikan game edukasi dan seni budaya.',
    color: '#F97316',
    iconType: 'bulb',
  },
  {
    id: 'sahabat-baik',
    title: 'Sahabat Baik',
    description: 'Selalu semangat belajar bersama teman-teman!',
    color: '#EC4899',
    iconType: 'heart',
  },
];

export const VIDEO_LESSONS: VideoLessonItem[] = [
  {
    id: 'belajar-pecahan',
    title: 'Belajar Pecahan',
    description: 'Dalam video ini, kita akan belajar tentang pecahan dengan cara yang mudah dan menyenangkan.',
    duration: '10 Menit',
    durationSeconds: 600,
    gradeLabel: 'Kelas 3-4 SD',
    subjectId: 'matematika',
    theme: 'pecahan',
    chapters: [
      {
        time: 0,
        title: 'Apa itu Pecahan?',
        caption: 'Pecahan adalah bagian dari satu benda utuh yang dibagi sama besar.',
        narration: 'Halo teman-teman! Yuk kita bagi satu kue bulat menjadi dua bagian yang sama besar!',
      },
      {
        time: 180,
        title: 'Mengenal 1/2 (Setengah)',
        caption: '1 bagian dari 2 potongan yang sama besar ditulis 1/2.',
        narration: 'Angka 1 di atas disebut pembilang, angka 2 di bawah disebut penyebut.',
      },
      {
        time: 380,
        title: 'Mengenal 1/4 dan 3/4',
        caption: 'Jika pizza dipotong 4 sama besar, 1 potong bernilai 1/4!',
        narration: 'Hebat! Kalau kita ambil 3 potong dari 4 potong, nilainya adalah 3 per 4.',
      },
    ],
  },
  {
    id: 'bangun-datar',
    title: 'Mengenal Bangun Datar',
    description: 'Kenali persegi, segitiga, dan lingkaran di benda-benda sekitar rumah dan sekolah!',
    duration: '8 Menit',
    durationSeconds: 480,
    gradeLabel: 'Kelas 1-3 SD',
    subjectId: 'matematika',
    theme: 'bangun-datar',
    chapters: [
      {
        time: 0,
        title: 'Persegi & Persegi Panjang',
        caption: 'Persegi punya 4 sisi yang sama panjang dan 4 sudut siku-siku.',
        narration: 'Lihat papan tulis di kelas, bentuknya persegi panjang! Sedangkan ubin lantai berbentuk persegi.',
      },
      {
        time: 180,
        title: 'Segitiga Ceria',
        caption: 'Segitiga memiliki 3 sisi dan 3 titik sudut.',
        narration: 'Atap rumah sekolah SD kita berbentuk segitiga yang kuat!',
      },
      {
        time: 340,
        title: 'Lingkaran Tanpa Sudut',
        caption: 'Roda sepeda dan jam dinding berbentuk lingkaran yang bisa berputar mulus.',
        narration: 'Lingkaran tidak memiliki sudut, bentuknya melengkung sempurna!',
      },
    ],
  },
  {
    id: 'satuan-panjang',
    title: 'Satuan Panjang',
    description: 'Belajar mengukur tinggi dan jarak menggunakan sentimeter (cm) dan meter (m).',
    duration: '7 Menit',
    durationSeconds: 420,
    gradeLabel: 'Kelas 4-6 SD',
    subjectId: 'matematika',
    theme: 'satuan-panjang',
    chapters: [
      {
        time: 0,
        title: 'Menggunakan Penggaris (cm)',
        caption: 'Mulai mengukur selalu dari angka 0 pada penggaris ya!',
        narration: 'Pensil Fatih panjangnya 15 sentimeter saat diukur dari angka nol.',
      },
      {
        time: 180,
        title: 'Dari Meter ke Sentimeter',
        caption: '1 Meter sama dengan 100 Sentimeter (1 m = 100 cm).',
        narration: 'Ingat tangga satuan panjang! Setiap turun satu tangga dikali 10.',
      },
      {
        time: 300,
        title: 'Mengukur Lapangan (m)',
        caption: 'Untuk mengukur benda panjang seperti lapangan sekolah, kita pakai meter!',
        narration: 'Sekarang kamu siap mengukur benda apa saja di rumah!',
      },
    ],
  },
  {
    id: 'perkalian-ceria',
    title: 'Perkalian Mudah & Seru',
    description: 'Pahami perkalian sebagai penjumlahan berulang dengan apel dan bintang warna-warni!',
    duration: '6 Menit',
    durationSeconds: 360,
    gradeLabel: 'Kelas 2-4 SD',
    subjectId: 'matematika',
    theme: 'perkalian',
    chapters: [
      {
        time: 0,
        title: 'Konsep Perkalian',
        caption: '3 × 2 artinya ada 3 kotak, masing-masing berisi 2 apel.',
        narration: '2 ditambah 2 ditambah 2 sama dengan 6! Mudah sekali bukan?',
      },
      {
        time: 180,
        title: 'Trik Perkalian 5 dan 10',
        caption: 'Semua angka dikali 10 tinggal tambahkan angka 0 di belakangnya!',
        narration: 'Misalnya 4 × 10 = 40, dan 7 × 10 = 70. Kamu pasti cepat hafal!',
      },
    ],
  },
];

function makeMathQuestions(
  op: 'add' | 'subtract' | 'multiply' | 'divide',
  level: DifficultyLevel
): LearningQuestion[] {
  if (op === 'add') {
    const pairs: Record<DifficultyLevel, [number, number][]> = {
      Dasar: [
        [5, 3], [4, 2], [6, 3], [2, 5], [7, 2], [3, 3], [8, 1], [4, 5], [1, 6], [5, 4],
      ],
      Menengah: [
        [12, 7], [15, 8], [18, 6], [14, 9], [23, 12], [19, 11], [25, 14], [16, 15], [27, 8], [32, 16],
      ],
      Mahir: [
        [48, 37], [65, 29], [74, 48], [86, 35], [125, 45], [93, 28], [115, 65], [78, 54], [134, 46], [89, 77],
      ],
    };
    return pairs[level].map(([a, b], idx) => {
      const ans = a + b;
      const distractors = new Set<number>([ans, ans + 1, Math.max(1, ans - 1), ans + 2]);
      const opts = Array.from(distractors).sort((x, y) => x - y).map(String);
      return {
        id: `add-${level}-${idx}`,
        prompt: `${a} + ${b} = ?`,
        options: opts,
        correctIndex: opts.indexOf(String(ans)),
        explanation: `${a} ditambah ${b} sama dengan ${ans}. Bagus sekali!`,
        visualAid: level === 'Dasar' ? { type: 'add', a, b, emoji: '🍎' } : undefined,
      };
    });
  }

  if (op === 'subtract') {
    const pairs: Record<DifficultyLevel, [number, number][]> = {
      Dasar: [
        [12, 5], [8, 3], [9, 4], [10, 6], [7, 2], [11, 4], [6, 2], [10, 3], [9, 5], [8, 4],
      ],
      Menengah: [
        [24, 9], [31, 12], [28, 15], [35, 18], [40, 14], [27, 13], [33, 16], [45, 22], [38, 19], [50, 24],
      ],
      Mahir: [
        [82, 37], [95, 48], [120, 45], [104, 58], [150, 67], [91, 36], [112, 49], [135, 78], [160, 85], [142, 64],
      ],
    };
    return pairs[level].map(([a, b], idx) => {
      const ans = a - b;
      const distractors = new Set<number>([ans, ans + 1, Math.max(0, ans - 1), ans + 2]);
      const opts = Array.from(distractors).sort((x, y) => x - y).map(String);
      return {
        id: `sub-${level}-${idx}`,
        prompt: `${a} - ${b} = ?`,
        options: opts,
        correctIndex: opts.indexOf(String(ans)),
        explanation: `Dari ${a} diambil ${b}, sisanya adalah ${ans}.`,
        visualAid: level === 'Dasar' ? { type: 'subtract', a, b, emoji: '⭐' } : undefined,
      };
    });
  }

  if (op === 'multiply') {
    const pairs: Record<DifficultyLevel, [number, number][]> = {
      Dasar: [
        [2, 3], [3, 4], [2, 5], [4, 2], [5, 3], [3, 3], [4, 4], [5, 2], [2, 6], [3, 5],
      ],
      Menengah: [
        [6, 4], [7, 3], [8, 4], [6, 6], [7, 5], [9, 3], [8, 5], [6, 7], [9, 4], [7, 7],
      ],
      Mahir: [
        [12, 4], [9, 8], [11, 7], [15, 4], [8, 7], [12, 6], [14, 5], [9, 9], [13, 6], [16, 4],
      ],
    };
    return pairs[level].map(([a, b], idx) => {
      const ans = a * b;
      const distractors = new Set<number>([ans, ans + a, Math.max(1, ans - b), ans + 2]);
      const opts = Array.from(distractors).sort((x, y) => x - y).map(String);
      return {
        id: `mul-${level}-${idx}`,
        prompt: `${a} × ${b} = ?`,
        options: opts,
        correctIndex: opts.indexOf(String(ans)),
        explanation: `${a} × ${b} berarti ${a} kelompok berisi ${b}, hasilnya ${ans}.`,
        visualAid: level === 'Dasar' ? { type: 'multiply', a, b, emoji: '🍓' } : undefined,
      };
    });
  }

  const pairs: Record<DifficultyLevel, [number, number][]> = {
    Dasar: [
      [6, 2], [8, 2], [10, 5], [9, 3], [12, 3], [12, 4], [15, 5], [10, 2], [8, 4], [16, 4],
    ],
    Menengah: [
      [24, 4], [21, 3], [30, 5], [28, 4], [36, 6], [32, 4], [35, 5], [27, 3], [40, 5], [42, 6],
    ],
    Mahir: [
      [72, 8], [64, 8], [81, 9], [96, 8], [100, 5], [84, 7], [90, 6], [108, 9], [75, 5], [120, 6],
    ],
  };
  return pairs[level].map(([a, b], idx) => {
    const ans = a / b;
    const distractors = new Set<number>([ans, ans + 1, Math.max(1, ans - 1), ans + 2]);
    const opts = Array.from(distractors).sort((x, y) => x - y).map(String);
    return {
      id: `div-${level}-${idx}`,
      prompt: `${a} ÷ ${b} = ?`,
      options: opts,
      correctIndex: opts.indexOf(String(ans)),
      explanation: `${a} dibagi sama rata ke ${b} bagian menghasilkan ${ans}.`,
      visualAid: level === 'Dasar' ? { type: 'divide', a, b, emoji: '🍪' } : undefined,
    };
  });
}

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'matematika',
    name: 'Matematika',
    tagline: 'Berhitung cepat & logika seru',
    quote: 'Matematika Itu Menyenangkan! Setiap angka punya cerita',
    accentColor: '#16A34A',
    softBg: '#ECFDF5',
    topics: [
      {
        id: 'penjumlahan',
        title: 'Penjumlahan',
        shortDesc: 'Gabungkan angka dengan mudah',
        iconKey: 'plus',
        colorBg: '#22C55E',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: makeMathQuestions('add', 'Dasar'),
          Menengah: makeMathQuestions('add', 'Menengah'),
          Mahir: makeMathQuestions('add', 'Mahir'),
        },
      },
      {
        id: 'pengurangan',
        title: 'Pengurangan',
        shortDesc: 'Hitung sisa benda dengan teliti',
        iconKey: 'minus',
        colorBg: '#EF4444',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: makeMathQuestions('subtract', 'Dasar'),
          Menengah: makeMathQuestions('subtract', 'Menengah'),
          Mahir: makeMathQuestions('subtract', 'Mahir'),
        },
      },
      {
        id: 'perkalian',
        title: 'Perkalian',
        shortDesc: 'Penjumlahan berulang yang cepat',
        iconKey: 'multiply',
        colorBg: '#F97316',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: makeMathQuestions('multiply', 'Dasar'),
          Menengah: makeMathQuestions('multiply', 'Menengah'),
          Mahir: makeMathQuestions('multiply', 'Mahir'),
        },
      },
      {
        id: 'pembagian',
        title: 'Pembagian',
        shortDesc: 'Bagi sama rata bersama teman',
        iconKey: 'divide',
        colorBg: '#3B82F6',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: makeMathQuestions('divide', 'Dasar'),
          Menengah: makeMathQuestions('divide', 'Menengah'),
          Mahir: makeMathQuestions('divide', 'Mahir'),
        },
      },
    ],
  },
  {
    id: 'bahasa-indonesia',
    name: 'Bahasa Indonesia',
    tagline: 'Membaca, menulis & kosakata baku',
    quote: 'Membaca Membuka Jendela Dunia! Ayo perkaya kata',
    accentColor: '#2563EB',
    softBg: '#EFF6FF',
    topics: [
      {
        id: 'kosakata',
        title: 'Kosakata & Sinonim',
        shortDesc: 'Persamaan & lawan kata sehari-hari',
        iconKey: 'book',
        colorBg: '#3B82F6',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: [
            {
              id: 'bi-1',
              prompt: 'Lawan kata dari "Besar" adalah ...',
              options: ['Kecil', 'Tinggi', 'Luas', 'Panjang'],
              correctIndex: 0,
              explanation: 'Antonim (lawan kata) dari besar adalah kecil.',
            },
            {
              id: 'bi-2',
              prompt: 'Persamaan kata (sinonim) dari "Senang" adalah ...',
              options: ['Sedih', 'Gembira', 'Marah', 'Takut'],
              correctIndex: 1,
              explanation: 'Senang memiliki arti yang sama dengan gembira.',
            },
            {
              id: 'bi-3',
              prompt: 'Lawan kata dari "Rajin" adalah ...',
              options: ['Pandai', 'Cepat', 'Malas', 'Bersih'],
              correctIndex: 2,
              explanation: 'Lawan kata dari rajin adalah malas.',
            },
            {
              id: 'bi-4',
              prompt: 'Sinonim dari kata "Pintar" adalah ...',
              options: ['Bodoh', 'Cerdas', 'Lambat', 'Pelit'],
              correctIndex: 1,
              explanation: 'Pintar memiliki persamaan arti dengan cerdas atau pandai.',
            },
            {
              id: 'bi-5',
              prompt: 'Lawan kata dari "Panas" adalah ...',
              options: ['Hangat', 'Dingin', 'Terik', 'Kering'],
              correctIndex: 1,
              explanation: 'Antonim dari panas adalah dingin.',
            },
          ],
          Menengah: [
            {
              id: 'bi-m1',
              prompt: 'Kata baku yang benar adalah ...',
              options: ['Aktifitas', 'Aktivitas', 'Aktipitas', 'Aktip'],
              correctIndex: 1,
              explanation: 'Sesuai KBBI, penulisan baku adalah "Aktivitas" dengan huruf v.',
            },
            {
              id: 'bi-m2',
              prompt: 'Kalimat tanya selalu diakhiri dengan tanda ...',
              options: ['Titik (.)', 'Koma (,)', 'Tanya (?)', 'Seru (!)'],
              correctIndex: 2,
              explanation: 'Kalimat tanya diakhiri dengan tanda tanya (?).',
            },
            {
              id: 'bi-m3',
              prompt: 'Kata baku dari "Apotik" adalah ...',
              options: ['Apotek', 'Apotik', 'Apoteker', 'Apotikah'],
              correctIndex: 0,
              explanation: 'Penulisan kata baku yang benar dalam KBBI adalah "Apotek".',
            },
            {
              id: 'bi-m4',
              prompt: 'Lawan kata dari "Hemat" adalah ...',
              options: ['Irit', 'Boros', 'Sederhana', 'Cermat'],
              correctIndex: 1,
              explanation: 'Antonim dari hemat adalah boros.',
            },
          ],
          Mahir: [
            {
              id: 'bi-h1',
              prompt: 'Makna ungkapan "Buah tangan" adalah ...',
              options: ['Buah segar', 'Oleh-oleh', 'Anak kesayangan', 'Karya seni'],
              correctIndex: 1,
              explanation: '"Buah tangan" adalah ungkapan yang artinya oleh-oleh.',
            },
            {
              id: 'bi-h2',
              prompt: 'Gagasan utama dalam sebuah paragraf disebut ...',
              options: ['Judul', 'Ide pokok', 'Pantun', 'Sajak'],
              correctIndex: 1,
              explanation: 'Ide pokok adalah gagasan utama yang dibahas dalam paragraf.',
            },
            {
              id: 'bi-h3',
              prompt: 'Makna ungkapan "Rendah hati" adalah ...',
              options: ['Sombong', 'Tidak sombong', 'Pemalu', 'Penakut'],
              correctIndex: 1,
              explanation: '"Rendah hati" berarti baik budi dan tidak sombong.',
            },
            {
              id: 'bi-h4',
              prompt: 'Kalimat perintah biasanya diakhiri dengan tanda ...',
              options: ['Titik (.)', 'Seru (!)', 'Tanya (?)', 'Koma (,)'],
              correctIndex: 1,
              explanation: 'Kalimat perintah atau seruan diakhiri dengan tanda seru (!).',
            },
          ],
        },
      },
      {
        id: 'ejaan',
        title: 'Huruf Kapital & Ejaan',
        shortDesc: 'Menulis kalimat rapi dan benar',
        iconKey: 'star',
        colorBg: '#6366F1',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: [
            {
              id: 'ej-1',
              prompt: 'Penulisan nama orang yang benar adalah ...',
              options: ['fatih', 'Fatih', 'fAtih', 'FATIH'],
              correctIndex: 1,
              explanation: 'Huruf pertama nama orang wajib menggunakan huruf kapital.',
            },
            {
              id: 'ej-2',
              prompt: 'Kalimat berita diakhiri dengan tanda ...',
              options: ['Seru (!)', 'Tanya (?)', 'Titik (.)', 'Koma (,)'],
              correctIndex: 2,
              explanation: 'Kalimat berita selalu diakhiri tanda titik (.).',
            },
            {
              id: 'ej-3',
              prompt: 'Penulisan nama hari yang tepat adalah ...',
              options: ['senin', 'Senin', 'SENIN', 'seNin'],
              correctIndex: 1,
              explanation: 'Huruf pertama nama hari diawali huruf kapital.',
            },
            {
              id: 'ej-4',
              prompt: 'Huruf kapital digunakan pada ... kalimat.',
              options: ['Akhir', 'Tengah', 'Awal', 'Semua'],
              correctIndex: 2,
              explanation: 'Awal kalimat selalu ditulis dengan huruf kapital.',
            },
          ],
          Menengah: [
            {
              id: 'ej-m1',
              prompt: 'Manakah penulisan kalimat yang paling tepat?',
              options: [
                'feride pergi ke jakarta.',
                'Feride pergi ke Jakarta.',
                'Feride Pergi Ke Jakarta.',
                'feride pergi ke Jakarta.',
              ],
              correctIndex: 1,
              explanation: 'Awal kalimat, nama orang, dan nama kota memakai huruf kapital.',
            },
            {
              id: 'ej-m2',
              prompt: 'Penulisan nama bulan yang benar adalah ...',
              options: ['bulan agustus', 'Bulan Agustus', 'bulan Agustus', 'BULAN agustus'],
              correctIndex: 2,
              explanation: 'Nama bulan ("Agustus") diawali huruf kapital.',
            },
            {
              id: 'ej-m3',
              prompt: 'Tanda koma (,) digunakan untuk memisahkan ...',
              options: [
                'Akhir kalimat berita',
                'Perincian lebih dari dua benda',
                'Kalimat tanya',
                'Judul buku',
              ],
              correctIndex: 1,
              explanation: 'Contoh: Ibu membeli apel, jeruk, dan mangga.',
            },
          ],
          Mahir: [
            {
              id: 'ej-h1',
              prompt: 'Penulisan kata depan "di" yang benar untuk tempat adalah ...',
              options: ['disekolah', 'di sekolah', 'di-sekolah', 'diSekolah'],
              correctIndex: 1,
              explanation: 'Kata depan "di" yang menunjukkan tempat ditulis terpisah: di sekolah.',
            },
            {
              id: 'ej-h2',
              prompt: 'Penulisan imbuhan "di-" pada kata kerja pasif yang benar adalah ...',
              options: ['di baca', 'dibaca', 'di-baca', 'diBaca'],
              correctIndex: 1,
              explanation: 'Imbuhan "di-" pada kata kerja pasif ditulis serangkai: dibaca.',
            },
            {
              id: 'ej-h3',
              prompt: 'Singkatan gelar "Sarjana Pendidikan" yang tepat adalah ...',
              options: ['S.Pd', 'S.Pd.', 'Spd.', 'S,Pd'],
              correctIndex: 1,
              explanation: 'Penulisan gelar yang baku disertai titik di akhir: S.Pd.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'ipa',
    name: 'IPA',
    tagline: 'Alam, tumbuhan, hewan & sains',
    quote: 'Sains Mengungkap Keajaiban Alam! Ayo bereksperimen',
    accentColor: '#0284C7',
    softBg: '#F0F9FF',
    topics: [
      {
        id: 'tumbuhan-hewan',
        title: 'Makhluk Hidup',
        shortDesc: 'Bagian tumbuhan & hewan',
        iconKey: 'flask',
        colorBg: '#0EA5E9',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: [
            {
              id: 'ipa-1',
              prompt: 'Bagian tumbuhan yang menyerap air dari dalam tanah adalah ...',
              options: ['Daun', 'Akar', 'Bunga', 'Buah'],
              correctIndex: 1,
              explanation: 'Akar berada di dalam tanah untuk menyerap air dan mineral.',
              visualAid: { type: 'emoji', emoji: '🌱', label: 'Tumbuhan butuh air & cahaya matahari' },
            },
            {
              id: 'ipa-2',
              prompt: 'Hewan yang bernapas menggunakan insang adalah ...',
              options: ['Kucing', 'Ikan', 'Burung', 'Kelinci'],
              correctIndex: 1,
              explanation: 'Ikan hidup di air dan bernapas dengan insang.',
              visualAid: { type: 'emoji', emoji: '🐟', label: 'Ikan berenang di air' },
            },
            {
              id: 'ipa-3',
              prompt: 'Hewan pemakan tumbuhan disebut ...',
              options: ['Karnivora', 'Herbivora', 'Omnivora', 'Insektivora'],
              correctIndex: 1,
              explanation: 'Sapi, kambing, dan kelinci adalah hewan herbivora (pemakan tumbuhan).',
              visualAid: { type: 'emoji', emoji: '🐄', label: 'Sapi suka makan rumput hijau' },
            },
            {
              id: 'ipa-4',
              prompt: 'Alat indra manusia untuk melihat adalah ...',
              options: ['Telinga', 'Hidung', 'Mata', 'Kulit'],
              correctIndex: 2,
              explanation: 'Mata adalah indra penglihatan kita.',
            },
          ],
          Menengah: [
            {
              id: 'ipa-m1',
              prompt: 'Proses tumbuhan membuat makanan sendiri dengan cahaya matahari disebut ...',
              options: ['Respirasi', 'Fotosintesis', 'Adaptasi', 'Metamorfosis'],
              correctIndex: 1,
              explanation: 'Fotosintesis terjadi di daun dengan bantuan sinar matahari.',
            },
            {
              id: 'ipa-m2',
              prompt: 'Urutan metamorfosis kupu-kupu setelah ulat adalah ...',
              options: ['Telur', 'Kepompong', 'Kupu-kupu dewasa', 'Larva'],
              correctIndex: 1,
              explanation: 'Metamorfosis kupu-kupu: Telur → Ulat → Kepompong → Kupu-kupu.',
            },
            {
              id: 'ipa-m3',
              prompt: 'Tulang yang melindungi otak manusia adalah ...',
              options: ['Tulang rusuk', 'Tengkorak', 'Tulang belakang', 'Tulang paha'],
              correctIndex: 1,
              explanation: 'Tengkorak melindungi organ penting yaitu otak.',
            },
          ],
          Mahir: [
            {
              id: 'ipa-h1',
              prompt: 'Benda cair yang berubah menjadi gas saat dipanaskan disebut proses ...',
              options: ['Membeku', 'Mencair', 'Menguap', 'Menyublim'],
              correctIndex: 2,
              explanation: 'Air yang dipanaskan akan menguap menjadi uap air (gas).',
            },
            {
              id: 'ipa-h2',
              prompt: 'Perubahan wujud dari gas menjadi cair disebut ...',
              options: ['Mengembun', 'Membeku', 'Menguap', 'Mengkristal'],
              correctIndex: 0,
              explanation: 'Embun di pagi hari adalah contoh peristiwa mengembun.',
            },
            {
              id: 'ipa-h3',
              prompt: 'Gaya yang membuat buah apel jatuh ke bawah menuju tanah adalah ...',
              options: ['Gaya gesek', 'Gaya magnet', 'Gaya gravitasi', 'Gaya pegas'],
              correctIndex: 2,
              explanation: 'Gaya gravitasi Bumi menarik semua benda menuju pusat Bumi.',
            },
          ],
        },
      },
      {
        id: 'tata-surya',
        title: 'Bumi & Tata Surya',
        shortDesc: 'Planet, bulan, dan cuaca',
        iconKey: 'globe',
        colorBg: '#14B8A6',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: [
            {
              id: 'ts-1',
              prompt: 'Planet tempat kita tinggal adalah ...',
              options: ['Mars', 'Bumi', 'Jupiter', 'Venus'],
              correctIndex: 1,
              explanation: 'Bumi adalah planet ketiga dari Matahari dan tempat tinggal kita.',
              visualAid: { type: 'emoji', emoji: '🌍', label: 'Planet Bumi yang indah' },
            },
            {
              id: 'ts-2',
              prompt: 'Sumber energi panas dan cahaya terbesar bagi Bumi adalah ...',
              options: ['Bulan', 'Matahari', 'Bintang kecil', 'Lampu'],
              correctIndex: 1,
              explanation: 'Matahari menyinari dan menghangatkan Bumi setiap hari.',
              visualAid: { type: 'emoji', emoji: '☀️', label: 'Matahari pusat tata surya' },
            },
            {
              id: 'ts-3',
              prompt: 'Satelit alami yang mengelilingi Bumi adalah ...',
              options: ['Mars', 'Bulan', 'Komet', 'Saturnus'],
              correctIndex: 1,
              explanation: 'Bulan adalah satelit alami Bumi.',
            },
          ],
          Menengah: [
            {
              id: 'ts-m1',
              prompt: 'Planet terbesar dalam tata surya kita adalah ...',
              options: ['Merkurius', 'Saturnus', 'Jupiter', 'Neptunus'],
              correctIndex: 2,
              explanation: 'Jupiter adalah planet terbesar di Tata Surya.',
            },
            {
              id: 'ts-m2',
              prompt: 'Planet yang terkenal memiliki cincin indah adalah ...',
              options: ['Mars', 'Saturnus', 'Venus', 'Merkurius'],
              correctIndex: 1,
              explanation: 'Saturnus memiliki cincin es dan batuan yang sangat jelas.',
            },
            {
              id: 'ts-m3',
              prompt: 'Planet terdekat dengan Matahari adalah ...',
              options: ['Merkurius', 'Venus', 'Bumi', 'Mars'],
              correctIndex: 0,
              explanation: 'Merkurius adalah planet pertama yang paling dekat dengan Matahari.',
            },
          ],
          Mahir: [
            {
              id: 'ts-h1',
              prompt: 'Terjadinya siang dan malam disebabkan oleh ...',
              options: ['Rotasi Bumi', 'Revolusi Bulan', 'Angin kencang', 'Gerhana'],
              correctIndex: 0,
              explanation: 'Rotasi Bumi pada porosnya menyebabkan bagian Bumi bergantian terkena sinar Matahari.',
            },
            {
              id: 'ts-h2',
              prompt: 'Lama waktu yang dibutuhkan Bumi untuk satu kali berevolusi mengelilingi Matahari adalah ...',
              options: ['24 jam', '30 hari', '365¼ hari (1 tahun)', '7 hari'],
              correctIndex: 2,
              explanation: 'Revolusi Bumi memerlukan waktu 1 tahun (365¼ hari).',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'ips',
    name: 'IPS',
    tagline: 'Indonesia, budaya & lingkungan',
    quote: 'Cintai Nusantara! Kenali ragam budaya Indonesia',
    accentColor: '#059669',
    softBg: '#ECFDF5',
    topics: [
      {
        id: 'nusantara',
        title: 'Kenali Indonesia',
        shortDesc: 'Bendera, lambang & kepulauan',
        iconKey: 'globe',
        colorBg: '#10B981',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: [
            {
              id: 'ips-1',
              prompt: 'Warna bendera negara Indonesia adalah ...',
              options: ['Biru dan Putih', 'Merah dan Putih', 'Merah dan Kuning', 'Hijau dan Putih'],
              correctIndex: 1,
              explanation: 'Bendera Indonesia adalah Sang Saka Merah Putih.',
              visualAid: { type: 'emoji', emoji: '🇮🇩', label: 'Merah berarti berani, Putih berarti suci' },
            },
            {
              id: 'ips-2',
              prompt: 'Lambang negara Indonesia adalah ...',
              options: ['Harimau Sumatera', 'Garuda Pancasila', 'Komodo', 'Cendrawasih'],
              correctIndex: 1,
              explanation: 'Garuda Pancasila adalah lambang negara Indonesia.',
            },
            {
              id: 'ips-3',
              prompt: 'Lagu kebangsaan Indonesia adalah ...',
              options: ['Garuda Pancasila', 'Indonesia Raya', 'Halo-Halo Bandung', 'Satu Nusa Satu Bangsa'],
              correctIndex: 1,
              explanation: 'Lagu kebangsaan kita adalah Indonesia Raya ciptaan W.R. Supratman.',
            },
          ],
          Menengah: [
            {
              id: 'ips-m1',
              prompt: 'Hari Kemerdekaan Indonesia diperingati setiap tanggal ...',
              options: ['1 Juni', '17 Agustus', '10 November', '28 Oktober'],
              correctIndex: 1,
              explanation: 'Proklamasi Kemerdekaan Indonesia terjadi pada 17 Agustus 1945.',
            },
            {
              id: 'ips-m2',
              prompt: 'Semboyan bangsa Indonesia yang artinya berbeda-beda tetapi tetap satu adalah ...',
              options: ['Tut Wuri Handayani', 'Bhinneka Tunggal Ika', 'Pancasila', 'Sumpah Pemuda'],
              correctIndex: 1,
              explanation: 'Bhinneka Tunggal Ika tertulis pada pita di kaki Garuda Pancasila.',
            },
            {
              id: 'ips-m3',
              prompt: 'Rumah adat Tongkonan berasal dari provinsi ...',
              options: ['Bali', 'Sulawesi Selatan', 'Jawa Tengah', 'Papua'],
              correctIndex: 1,
              explanation: 'Rumah Tongkonan adalah rumah adat suku Toraja di Sulawesi Selatan.',
            },
          ],
          Mahir: [
            {
              id: 'ips-h1',
              prompt: 'Organisasi negara-negara Asia Tenggara disebut ...',
              options: ['PBB', 'ASEAN', 'APEC', 'WHO'],
              correctIndex: 1,
              explanation: 'ASEAN adalah kerja sama regional negara-negara Asia Tenggara.',
            },
            {
              id: 'ips-h2',
              prompt: 'Tanggal 28 Oktober diperingati sebagai Hari ...',
              options: ['Pahlawan', 'Sumpah Pemuda', 'Pendidikan Nasional', 'Kartini'],
              correctIndex: 1,
              explanation: 'Sumpah Pemuda diikrarkan pada 28 Oktober 1928.',
            },
            {
              id: 'ips-h3',
              prompt: 'Pulau terbesar di Indonesia adalah ...',
              options: ['Jawa', 'Bali', 'Kalimantan', 'Lombok'],
              correctIndex: 2,
              explanation: 'Kalimantan adalah pulau terbesar di wilayah Indonesia.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'bahasa-inggris',
    name: 'Bahasa Inggris',
    tagline: 'Words, numbers & greetings',
    quote: 'English Is Fun! Ayo belajar kata baru setiap hari',
    accentColor: '#E11D48',
    softBg: '#FFF1F2',
    topics: [
      {
        id: 'everyday-words',
        title: 'Everyday Words',
        shortDesc: 'Animals, colors & greetings',
        iconKey: 'book',
        colorBg: '#F43F5E',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: [
            {
              id: 'en-1',
              prompt: 'Bahasa Inggris dari "Buku" adalah ...',
              options: ['Pen', 'Book', 'Bag', 'Table'],
              correctIndex: 1,
              explanation: 'Book artinya Buku! I love reading a book.',
              visualAid: { type: 'emoji', emoji: '📘', label: 'A blue book!' },
            },
            {
              id: 'en-2',
              prompt: '"Good Morning" artinya ...',
              options: ['Selamat Malam', 'Selamat Pagi', 'Selamat Tidur', 'Sampai Jumpa'],
              correctIndex: 1,
              explanation: 'Good Morning digunakan untuk menyapa di pagi hari.',
            },
            {
              id: 'en-3',
              prompt: 'Bahasa Inggris dari angka "Tujuh" adalah ...',
              options: ['Five', 'Six', 'Seven', 'Eight'],
              correctIndex: 2,
              explanation: 'Five (5), Six (6), Seven (7), Eight (8).',
            },
            {
              id: 'en-4',
              prompt: 'Warna "Blue" artinya ...',
              options: ['Merah', 'Kuning', 'Biru', 'Hijau'],
              correctIndex: 2,
              explanation: 'Blue berarti Biru seperti langit cerah.',
            },
          ],
          Menengah: [
            {
              id: 'en-m1',
              prompt: 'Bahasa Inggris dari "Kucing" adalah ...',
              options: ['Dog', 'Cat', 'Bird', 'Rabbit'],
              correctIndex: 1,
              explanation: 'Cat artinya Kucing.',
            },
            {
              id: 'en-m2',
              prompt: 'My mother cooks in the ... (Ibuku memasak di ...)',
              options: ['Bedroom', 'Kitchen', 'Garden', 'Bathroom'],
              correctIndex: 1,
              explanation: 'Kitchen artinya dapur.',
            },
            {
              id: 'en-m3',
              prompt: 'What is the opposite of "Big"?',
              options: ['Tall', 'Small', 'Fast', 'Happy'],
              correctIndex: 1,
              explanation: 'Lawan kata Big (besar) adalah Small (kecil).',
            },
          ],
          Mahir: [
            {
              id: 'en-h1',
              prompt: 'Complete the sentence: "She ___ to school every day."',
              options: ['go', 'goes', 'going', 'went'],
              correctIndex: 1,
              explanation: 'Untuk subjek "She", kata kerja ditambah -es menjadi "goes".',
            },
            {
              id: 'en-h2',
              prompt: 'Yesterday, Fatih ___ a very interesting storybook.',
              options: ['read', 'reads', 'reading', 'will read'],
              correctIndex: 0,
              explanation: '"Yesterday" menunjukkan bentuk lampau (past tense): read.',
            },
            {
              id: 'en-h3',
              prompt: 'There ___ five apples in the basket.',
              options: ['is', 'are', 'am', 'was'],
              correctIndex: 1,
              explanation: 'Benda jamak ("five apples") menggunakan "are".',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'seni-budaya',
    name: 'Seni Budaya',
    tagline: 'Warna, musik & kreativitas',
    quote: 'Ekspresikan Imajinasimu! Warna membuat dunia ceria',
    accentColor: '#D97706',
    softBg: '#FFFBEB',
    topics: [
      {
        id: 'warna-musik',
        title: 'Warna & Alat Musik',
        shortDesc: 'Campuran warna & lagu daerah',
        iconKey: 'palette',
        colorBg: '#F59E0B',
        colorText: '#FFFFFF',
        questionsByLevel: {
          Dasar: [
            {
              id: 'sb-1',
              prompt: 'Campuran warna Merah dan Kuning menghasilkan warna ...',
              options: ['Hijau', 'Oranye (Jingga)', 'Ungu', 'Biru'],
              correctIndex: 1,
              explanation: 'Merah + Kuning = Oranye yang cerah!',
              visualAid: { type: 'emoji', emoji: '🎨', label: 'Ayo berkreasi dengan warna!' },
            },
            {
              id: 'sb-2',
              prompt: 'Campuran warna Biru dan Kuning menghasilkan warna ...',
              options: ['Hijau', 'Ungu', 'Merah', 'Oranye'],
              correctIndex: 0,
              explanation: 'Biru + Kuning = Hijau segar!',
            },
            {
              id: 'sb-3',
              prompt: 'Alat musik Angklung dimainkan dengan cara ...',
              options: ['Dipukul', 'Ditiup', 'Digoyangkan', 'Dipetik'],
              correctIndex: 2,
              explanation: 'Angklung terbuat dari bambu dan digoyangkan agar berbunyi.',
            },
          ],
          Menengah: [
            {
              id: 'sb-m1',
              prompt: 'Tiga warna primer (utama) adalah ...',
              options: [
                'Merah, Kuning, Biru',
                'Hijau, Ungu, Oranye',
                'Hitam, Putih, Abu',
                'Merah, Hijau, Cokelat',
              ],
              correctIndex: 0,
              explanation: 'Merah, Kuning, dan Biru adalah warna dasar (primer).',
            },
            {
              id: 'sb-m2',
              prompt: 'Tari Kecak adalah tarian tradisional yang terkenal dari ...',
              options: ['Aceh', 'Bali', 'Papua', 'Kalimantan'],
              correctIndex: 1,
              explanation: 'Tari Kecak berasal dari Pulau Bali.',
            },
            {
              id: 'sb-m3',
              prompt: 'Alat musik Sasando berasal dari provinsi ...',
              options: ['Nusa Tenggara Timur', 'Jawa Barat', 'Sumatera Utara', 'Riau'],
              correctIndex: 0,
              explanation: 'Sasando adalah alat musik petik khas Pulau Rote, NTT.',
            },
          ],
          Mahir: [
            {
              id: 'sb-h1',
              prompt: 'Karya seni rupa yang memiliki panjang, lebar, dan tinggi disebut ...',
              options: ['1 Dimensi', '2 Dimensi', '3 Dimensi', 'Abstrak'],
              correctIndex: 2,
              explanation: 'Patung dan vas bunga adalah contoh karya seni 3 Dimensi.',
            },
            {
              id: 'sb-h2',
              prompt: 'Motif batik tradisional yang berasal dari Solo dan Yogyakarta antara lain ...',
              options: ['Batik Parang', 'Songket Palembang', 'Ulos Batak', 'Tenun Ikat'],
              correctIndex: 0,
              explanation: 'Batik Parang merupakan motif klasik khas Keraton Solo & Yogyakarta.',
            },
          ],
        },
      },
    ],
  },
];
