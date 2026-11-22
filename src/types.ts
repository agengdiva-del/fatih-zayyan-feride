export type AvatarId = 'fatih' | 'zayyan' | 'feride' | 'bintang' | 'zahra';

export type SubjectId =
  | 'bahasa-indonesia'
  | 'matematika'
  | 'ipa'
  | 'ips'
  | 'bahasa-inggris'
  | 'seni-budaya';

export type DifficultyLevel = 'Dasar' | 'Menengah' | 'Mahir';

export type GradeNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type ScreenId =
  | 'splash'
  | 'profile-select'
  | 'dashboard'
  | 'subject'
  | 'learn'
  | 'video'
  | 'quiz'
  | 'games'
  | 'leaderboard'
  | 'profile';

export interface StudentProfile {
  id: string;
  uid?: string;
  name: string;
  grade: string;
  gradeBand?: string;
  gradeNumber: GradeNumber;
  daerah: string;
  sekolah: string;
  avatarId: AvatarId;
  xp: number;
  weeklyProgress: number;
  badgesCount: number;
  certificatesCount: number;
  completedTopics: string[];
  unlockedBadges: string[];
}

export interface LeaderboardEntry {
  id: string;
  uid: string;
  displayName: string;
  avatarId: AvatarId;
  grade: string;
  gradeNumber: GradeNumber;
  daerah: string;
  sekolah: string;
  xp: number;
  badgesCount: number;
  isOnlineSynced?: boolean;
}

export interface LearningQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  gradeNumber?: GradeNumber;
  subjectId?: SubjectId;
  topicTitle?: string;
  visualAid?: {
    type: 'add' | 'subtract' | 'multiply' | 'divide' | 'emoji';
    a?: number;
    b?: number;
    emoji?: string;
    label?: string;
  };
}

export interface QuizBankDoc {
  id: string;
  subjectId: SubjectId;
  gradeNumber: GradeNumber;
  topicTitle: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicInfo {
  id: string;
  title: string;
  shortDesc: string;
  iconKey: 'plus' | 'minus' | 'multiply' | 'divide' | 'book' | 'flask' | 'globe' | 'palette' | 'star';
  colorBg: string;
  colorText: string;
  questionsByLevel: Record<DifficultyLevel, LearningQuestion[]>;
}

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  tagline: string;
  quote: string;
  accentColor: string;
  softBg: string;
  topics: TopicInfo[];
}

export interface VideoLessonItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  gradeLabel: string;
  subjectId: SubjectId;
  theme: 'pecahan' | 'bangun-datar' | 'satuan-panjang' | 'perkalian';
  chapters: {
    time: number;
    title: string;
    caption: string;
    narration: string;
  }[];
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  color: string;
  iconType: 'trophy' | 'rocket' | 'bulb' | 'heart';
}
