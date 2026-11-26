import React, { useEffect, useMemo, useState } from 'react';
import { Gamepad2, Home, Trophy, User, Volume2, VolumeX } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import {
  AvatarId,
  DifficultyLevel,
  GradeNumber,
  LeaderboardEntry,
  LearningQuestion,
  QuizBankDoc,
  ScreenId,
  StudentProfile,
  SubjectId,
  TopicInfo,
} from './types';
import { BASELINE_ONLINE_LEADERBOARD, INITIAL_PROFILES, SUBJECTS } from './data/curriculum';
import {
  DAERAH_LIST,
  getQuestionsByGradeAndSubject,
  SD_QUIZ_BANK,
  SEKOLAH_LIST,
} from './data/quizDatabase';
import {
  fetchQuizBankFromFirestore,
  loadUserProfileFromFirestore,
  seedAdminQuizBankIfAuthorized,
  signInWithGoogleStudent,
  signOutStudent,
  subscribeOnlineLeaderboard,
  syncStudentToFirestore,
} from './services/onlineSync';
import { AppLogo, KidAvatar } from './components/CartoonArt';
import { SplashScreen } from './components/SplashScreen';
import { ProfileSelectScreen } from './components/ProfileSelectScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { SubjectScreen } from './components/SubjectScreen';
import { InteractiveLearnScreen } from './components/InteractiveLearnScreen';
import { VideoLessonScreen } from './components/VideoLessonScreen';
import { QuizScreen } from './components/QuizScreen';
import { GamesHubScreen } from './components/GamesHubScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { soundFX } from './utils/sound';

const STORAGE_KEY = 'fzf_kids_app_v2';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F2F8FF] flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full card-kid border-2 border-sky-100 space-y-4">
            <div className="text-4xl">🤖</div>
            <h1 className="font-display font-bold text-2xl text-slate-900">Ups, ada kendala kecil!</h1>
            <p className="text-sm font-bold text-slate-600">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-2xl bg-[#2563EB] text-white font-display font-bold text-lg cursor-pointer"
            >
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
          return parsed.profiles;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>('fatih');
  const [screen, setScreen] = useState<ScreenId>('splash');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('matematika');
  const [selectedTopic, setSelectedTopic] = useState<TopicInfo>(SUBJECTS[0].topics[0]);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('Dasar');
  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(5);
  const [gradeQuizQuestions, setGradeQuizQuestions] = useState<LearningQuestion[] | null>(null);
  const [quizTitleOverride, setQuizTitleOverride] = useState<string | undefined>(undefined);
  const [muted, setMuted] = useState(false);

  // Firebase Online State
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [firestoreLeaderboard, setFirestoreLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quizBank, setQuizBank] = useState<QuizBankDoc[]>(SD_QUIZ_BANK);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles }));
    } catch {
      // ignore storage errors
    }
  }, [profiles]);

  // Load SD Grade 1-6 Quiz Bank from Firestore (with seamless local fallback)
  useEffect(() => {
    fetchQuizBankFromFirestore().then((docs) => {
      setQuizBank(docs);
    });
  }, []);

  // Subscribe to live online leaderboard from Firestore
  useEffect(() => {
    const unsub = subscribeOnlineLeaderboard(
      (entries) => setFirestoreLeaderboard(entries),
      (err) => console.warn('Leaderboard sync info:', err.message)
    );
    return () => unsub();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        await seedAdminQuizBankIfAuthorized(user.email);
        try {
          const remote = await loadUserProfileFromFirestore(user.uid);
          if (remote) {
            const remoteProfile: StudentProfile = {
              id: `google-${user.uid}`,
              uid: user.uid,
              name: remote.name || user.displayName || 'Siswa Robot',
              avatarId: remote.avatarId || 'fatih',
              customPhotoUrl: remote.customPhotoUrl ?? null,
              grade: remote.grade || 'Kelas 4 SD',
              gradeNumber: (remote.gradeNumber as GradeNumber) || 4,
              gradeBand:
                (remote.gradeNumber || 4) <= 2
                  ? 'Kelas 1-2 SD'
                  : (remote.gradeNumber || 4) <= 4
                  ? 'Kelas 3-4 SD'
                  : 'Kelas 4-6 SD',
              daerah: remote.daerah || DAERAH_LIST[0],
              sekolah: remote.sekolah || SEKOLAH_LIST[0],
              xp: remote.xp ?? 200,
              weeklyProgress: remote.weeklyProgress ?? 30,
              badgesCount: remote.badgesCount ?? 2,
              certificatesCount: remote.certificatesCount ?? 1,
              completedTopics: remote.completedTopics || [],
              unlockedBadges: remote.unlockedBadges || ['sahabat-baik'],
            };
            setProfiles((prev) => {
              const idx = prev.findIndex((p) => p.uid === user.uid || p.id === remoteProfile.id);
              if (idx >= 0) {
                const clone = [...prev];
                clone[idx] = { ...clone[idx], ...remoteProfile };
                return clone;
              }
              return [...prev, remoteProfile];
            });
            setActiveProfileId(remoteProfile.id);
            setSelectedGrade(remoteProfile.gradeNumber);
          }
        } catch (err) {
          console.warn('Could not load remote user profile:', err);
        }
      }
    });
    return () => unsub();
  }, []);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const activeSubject = SUBJECTS.find((s) => s.id === selectedSubjectId) || SUBJECTS[0];

  // Combine Firestore real-time leaderboard with baseline SD students
  const combinedOnlineLeaderboard = useMemo(() => {
    const map = new Map<string, LeaderboardEntry>();
    BASELINE_ONLINE_LEADERBOARD.forEach((b) => map.set(b.uid, b));
    firestoreLeaderboard.forEach((f) => map.set(f.uid, f));
    return Array.from(map.values()).sort((a, b) => b.xp - a.xp);
  }, [firestoreLeaderboard]);

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundFX.muted = next;
    if (!next) soundFX.playTap();
  };

  const persistIfSignedIn = async (updatedProfile: StudentProfile) => {
    if (authUser && updatedProfile.uid === authUser.uid) {
      try {
        await syncStudentToFirestore(updatedProfile, authUser.uid);
      } catch (err) {
        console.warn('Firestore sync warning:', err);
      }
    }
  };

  const addXP = (amount: number, completedTopicId?: string) => {
    if (amount <= 0 && !completedTopicId) return;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfile.id) return p;
        const nextTopics =
          completedTopicId && !p.completedTopics.includes(completedTopicId)
            ? [...p.completedTopics, completedTopicId]
            : p.completedTopics;
        const nextProgress = Math.min(100, p.weeklyProgress + (amount > 0 ? 5 : 0));
        const updated: StudentProfile = {
          ...p,
          xp: p.xp + amount,
          weeklyProgress: nextProgress,
          completedTopics: nextTopics,
        };
        persistIfSignedIn(updated);
        return updated;
      })
    );
  };

  const handleAddProfile = (
    name: string,
    gradeNumber: GradeNumber,
    avatarId: AvatarId,
    daerah: string,
    sekolah: string,
    customPhotoUrl?: string | null
  ) => {
    const newId = `siswa-${Date.now()}`;
    const gradeBand =
      gradeNumber <= 2 ? 'Kelas 1-2 SD' : gradeNumber <= 4 ? 'Kelas 3-4 SD' : 'Kelas 4-6 SD';
    const created: StudentProfile = {
      id: newId,
      name,
      grade: `Kelas ${gradeNumber} SD`,
      gradeBand,
      gradeNumber,
      daerah,
      sekolah,
      avatarId,
      customPhotoUrl: customPhotoUrl ?? null,
      xp: 100,
      weeklyProgress: 20,
      badgesCount: 1,
      certificatesCount: 0,
      completedTopics: [],
      unlockedBadges: ['sahabat-baik'],
    };
    setProfiles((prev) => [...prev, created]);
    setActiveProfileId(newId);
    setSelectedGrade(gradeNumber);
    setScreen('dashboard');
  };

  const handleUpdateProfile = (updates: Partial<StudentProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfile.id) return p;
        const updated = { ...p, ...updates };
        if (updates.gradeNumber) {
          setSelectedGrade(updates.gradeNumber);
        }
        persistIfSignedIn(updated);
        return updated;
      })
    );
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogleStudent();
      const existingRemote = await loadUserProfileFromFirestore(user.uid);
      if (existingRemote) {
        const remoteId = `google-${user.uid}`;
        const loaded: StudentProfile = {
          id: remoteId,
          uid: user.uid,
          name: existingRemote.name || user.displayName || activeProfile.name,
          avatarId: existingRemote.avatarId || activeProfile.avatarId,
          customPhotoUrl: existingRemote.customPhotoUrl ?? activeProfile.customPhotoUrl ?? null,
          grade: existingRemote.grade || activeProfile.grade,
          gradeNumber: (existingRemote.gradeNumber as GradeNumber) || activeProfile.gradeNumber,
          gradeBand:
            ((existingRemote.gradeNumber as GradeNumber) || activeProfile.gradeNumber) <= 2
              ? 'Kelas 1-2 SD'
              : ((existingRemote.gradeNumber as GradeNumber) || activeProfile.gradeNumber) <= 4
              ? 'Kelas 3-4 SD'
              : 'Kelas 4-6 SD',
          daerah: existingRemote.daerah || activeProfile.daerah,
          sekolah: existingRemote.sekolah || activeProfile.sekolah,
          xp: existingRemote.xp ?? activeProfile.xp,
          weeklyProgress: existingRemote.weeklyProgress ?? activeProfile.weeklyProgress,
          badgesCount: existingRemote.badgesCount ?? activeProfile.badgesCount,
          certificatesCount: existingRemote.certificatesCount ?? activeProfile.certificatesCount,
          completedTopics: existingRemote.completedTopics || activeProfile.completedTopics,
          unlockedBadges: existingRemote.unlockedBadges || activeProfile.unlockedBadges,
        };
        setProfiles((prev) => {
          const withoutDup = prev.filter((p) => p.uid !== user.uid && p.id !== remoteId);
          return [...withoutDup, loaded];
        });
        setActiveProfileId(remoteId);
        setSelectedGrade(loaded.gradeNumber);
      } else {
        // Attach current active profile to this Google account and sync immediately
        const bound: StudentProfile = {
          ...activeProfile,
          id: `google-${user.uid}`,
          uid: user.uid,
          name: activeProfile.name || user.displayName || 'Siswa Robot',
        };
        setProfiles((prev) =>
          prev.map((p) => (p.id === activeProfile.id ? bound : p))
        );
        setActiveProfileId(bound.id);
        await syncStudentToFirestore(bound, user.uid);
      }
      if (screen === 'profile-select' || screen === 'splash') {
        setScreen('dashboard');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk dengan Google.';
      setAuthError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    await signOutStudent();
    setActiveProfileId('fatih');
    setScreen('profile-select');
  };

  const launchGradeQuiz = (gradeNum: GradeNumber, subjectFilter?: SubjectId) => {
    const questions = getQuestionsByGradeAndSubject(quizBank, gradeNum, subjectFilter);
    setGradeQuizQuestions(questions);
    const subjName = subjectFilter
      ? SUBJECTS.find((s) => s.id === subjectFilter)?.name || 'SD'
      : 'Semua Mapel';
    setQuizTitleOverride(`Kuis ${subjName} Kelas ${gradeNum}`);
    setScreen('quiz');
  };

  if (screen === 'splash') {
    return <SplashScreen onStart={() => setScreen('profile-select')} />;
  }

  if (screen === 'profile-select') {
    return (
      <ProfileSelectScreen
        profiles={profiles}
        onSelectProfile={(id) => {
          setActiveProfileId(id);
          const chosen = profiles.find((p) => p.id === id);
          if (chosen) setSelectedGrade(chosen.gradeNumber);
          setScreen('dashboard');
        }}
        onAddProfile={handleAddProfile}
        onGoogleLogin={handleGoogleLogin}
        googleLoading={googleLoading}
        authError={authError}
      />
    );
  }

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'games', label: 'Game', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Peringkat', icon: <Trophy className="w-5 h-5" /> },
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  const activeNavTab: ScreenId =
    screen === 'games' || screen === 'leaderboard' || screen === 'profile' ? screen : 'dashboard';

  return (
    <div className="min-h-screen bg-[#F2F8FF] text-slate-900 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-sky-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              setScreen('dashboard');
            }}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            aria-label="Beranda Fatih Zayyan Feride"
          >
            <AppLogo size="sm" showSun={false} />
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    setScreen(item.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-display font-bold text-base whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#1D4ED8] bg-sky-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleMute}
              className="w-10 h-10 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 flex items-center justify-center cursor-pointer transition-colors"
              aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                setScreen('profile');
              }}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 cursor-pointer transition-colors"
            >
              <KidAvatar
                avatarId={activeProfile.avatarId}
                photoUrl={activeProfile.customPhotoUrl}
                size={32}
              />
              <span className="font-display font-bold text-sm text-slate-900 whitespace-nowrap">
                {activeProfile.name}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-10">
        {screen === 'dashboard' && (
          <DashboardScreen
            profile={activeProfile}
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            onSelectSubject={(subjId) => {
              setSelectedSubjectId(subjId);
              const subj = SUBJECTS.find((s) => s.id === subjId);
              if (subj && subj.topics.length > 0) {
                setSelectedTopic(subj.topics[0]);
              }
              setScreen('subject');
            }}
            onStartGradeQuiz={(g) => launchGradeQuiz(g)}
            onOpenVideo={() => setScreen('video')}
            onOpenGames={() => setScreen('games')}
          />
        )}

        {screen === 'subject' && (
          <SubjectScreen
            subject={activeSubject}
            avatarId={activeProfile.avatarId}
            photoUrl={activeProfile.customPhotoUrl}
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            onBack={() => setScreen('dashboard')}
            onStartLearn={(topic) => {
              setSelectedTopic(topic);
              setScreen('learn');
            }}
            onStartQuiz={(topic) => {
              setGradeQuizQuestions(null);
              setQuizTitleOverride(undefined);
              setSelectedTopic(topic);
              setScreen('quiz');
            }}
            onStartGradeQuiz={(g) => launchGradeQuiz(g, activeSubject.id)}
            onOpenVideo={() => setScreen('video')}
          />
        )}

        {screen === 'learn' && (
          <InteractiveLearnScreen
            topic={selectedTopic}
            level={selectedLevel}
            avatarId={activeProfile.avatarId}
            photoUrl={activeProfile.customPhotoUrl}
            onBack={() => setScreen('subject')}
            onEarnXP={(xp, topicId) => addXP(xp, topicId)}
          />
        )}

        {screen === 'video' && (
          <VideoLessonScreen
            onBack={() => setScreen('dashboard')}
            onCompleteVideo={(xp) => addXP(xp)}
          />
        )}

        {screen === 'quiz' && (
          <QuizScreen
            subject={activeSubject}
            topic={selectedTopic}
            level={selectedLevel}
            avatarId={activeProfile.avatarId}
            photoUrl={activeProfile.customPhotoUrl}
            gradeNumber={gradeQuizQuestions ? selectedGrade : undefined}
            overrideQuestions={gradeQuizQuestions}
            quizTitleOverride={quizTitleOverride}
            onBack={() => {
              setGradeQuizQuestions(null);
              setQuizTitleOverride(undefined);
              setScreen('subject');
            }}
            onFinishQuiz={(xpEarned, scorePct) => {
              addXP(xpEarned);
              if (scorePct >= 80) {
                setProfiles((prev) =>
                  prev.map((p) => {
                    if (p.id !== activeProfile.id) return p;
                    const updated = { ...p, certificatesCount: p.certificatesCount + 1 };
                    persistIfSignedIn(updated);
                    return updated;
                  })
                );
              }
            }}
          />
        )}

        {screen === 'games' && (
          <GamesHubScreen
            onBack={() => setScreen('dashboard')}
            onEarnXP={(xp) => addXP(xp)}
          />
        )}

        {screen === 'leaderboard' && (
          <LeaderboardScreen
            onlineEntries={combinedOnlineLeaderboard}
            activeProfile={activeProfile}
            isGoogleSignedIn={Boolean(authUser)}
            onGoogleLogin={handleGoogleLogin}
            onBack={() => setScreen('dashboard')}
          />
        )}

        {screen === 'profile' && (
          <ProfileScreen
            profile={activeProfile}
            isGoogleSignedIn={Boolean(authUser)}
            onGoogleLogin={handleGoogleLogin}
            onGoogleLogout={handleGoogleLogout}
            onBack={() => setScreen('dashboard')}
            onUpdateProfile={handleUpdateProfile}
            onSwitchProfile={() => setScreen('profile-select')}
            muted={muted}
            onToggleMute={handleToggleMute}
          />
        )}
      </main>

      <nav
        aria-label="Navigasi Utama"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-sky-100 h-16 grid grid-cols-4 items-center px-2 shadow-[0_-4px_16px_rgba(29,78,216,0.06)]"
      >
        {navItems.map((item) => {
          const isActive = activeNavTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                soundFX.playTap();
                setScreen(item.id);
              }}
              className={`flex flex-col items-center justify-center h-full gap-0.5 cursor-pointer transition-colors ${
                isActive ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {item.icon}
              <span className="text-[11px] font-display font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
