import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { LeaderboardEntry, QuizBankDoc, StudentProfile } from '../types';
import { SD_QUIZ_BANK } from '../data/quizDatabase';

export async function signInWithGoogleStudent(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutStudent(): Promise<void> {
  await signOut(auth);
}

export async function syncStudentToFirestore(profile: StudentProfile, uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const lbRef = doc(db, 'leaderboard', uid);

  const safeName = profile.name.trim().slice(0, 40) || 'Siswa SD';
  const safeDaerah = profile.daerah.trim().slice(0, 50) || 'DKI Jakarta';
  const safeSekolah = profile.sekolah.trim().slice(0, 60) || 'SDN 01 Menteng';
  const safeGradeNumber = Math.min(6, Math.max(1, Math.round(profile.gradeNumber || 4)));

  try {
    await setDoc(
      userRef,
      {
        uid,
        displayName: safeName,
        avatarId: profile.avatarId,
        grade: profile.grade,
        gradeNumber: safeGradeNumber,
        daerah: safeDaerah,
        sekolah: safeSekolah,
        xp: Math.max(0, Math.round(profile.xp)),
        weeklyProgress: Math.min(100, Math.max(0, Math.round(profile.weeklyProgress))),
        badgesCount: Math.max(0, Math.round(profile.badgesCount)),
        certificatesCount: Math.max(0, Math.round(profile.certificatesCount)),
        completedTopics: profile.completedTopics.slice(0, 50),
        unlockedBadges: profile.unlockedBadges.slice(0, 20),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }

  try {
    await setDoc(
      lbRef,
      {
        uid,
        displayName: safeName,
        avatarId: profile.avatarId,
        grade: profile.grade,
        gradeNumber: safeGradeNumber,
        daerah: safeDaerah,
        sekolah: safeSekolah,
        xp: Math.max(0, Math.round(profile.xp)),
        badgesCount: Math.max(0, Math.round(profile.badgesCount)),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `leaderboard/${uid}`);
  }
}

export async function loadUserProfileFromFirestore(uid: string): Promise<Partial<StudentProfile> | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      uid,
      name: d.displayName,
      avatarId: d.avatarId,
      grade: d.grade,
      gradeNumber: d.gradeNumber,
      daerah: d.daerah,
      sekolah: d.sekolah,
      xp: d.xp,
      weeklyProgress: d.weeklyProgress,
      badgesCount: d.badgesCount,
      certificatesCount: d.certificatesCount,
      completedTopics: d.completedTopics || [],
      unlockedBadges: d.unlockedBadges || [],
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeOnlineLeaderboard(
  onData: (entries: LeaderboardEntry[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(db, 'leaderboard'),
    where('xp', '>=', 0),
    orderBy('xp', 'desc'),
    limit(100)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: LeaderboardEntry[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          uid: data.uid,
          displayName: data.displayName,
          avatarId: data.avatarId,
          grade: data.grade,
          gradeNumber: data.gradeNumber,
          daerah: data.daerah,
          sekolah: data.sekolah,
          xp: data.xp,
          badgesCount: data.badgesCount,
          isOnlineSynced: true,
        };
      });
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'leaderboard');
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) onError(wrapped);
      }
    }
  );
}

export async function fetchQuizBankFromFirestore(): Promise<QuizBankDoc[]> {
  try {
    const q = query(
      collection(db, 'quizzes'),
      where('gradeNumber', '>=', 1),
      where('gradeNumber', '<=', 6)
    );
    const snap = await getDocs(q);
    if (snap.empty) return SD_QUIZ_BANK;
    const docs = snap.docs.map((d) => d.data() as QuizBankDoc);
    // Merge Firestore quizzes with local SD_QUIZ_BANK so all grades 1-6 are guaranteed complete
    const byId = new Map<string, QuizBankDoc>();
    SD_QUIZ_BANK.forEach((item) => byId.set(item.id, item));
    docs.forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
  } catch {
    // Graceful fallback if offline or rules disallow before auth
    return SD_QUIZ_BANK;
  }
}

export async function seedAdminQuizBankIfAuthorized(userEmail?: string | null): Promise<void> {
  if (userEmail !== 'aluncell@gmail.com') return;
  try {
    const q = query(
      collection(db, 'quizzes'),
      where('gradeNumber', '>=', 1),
      where('gradeNumber', '<=', 6)
    );
    const existing = await getDocs(q);
    if (existing.size >= SD_QUIZ_BANK.length) return;
    await Promise.all(
      SD_QUIZ_BANK.map((qDoc) =>
        setDoc(doc(db, 'quizzes', qDoc.id), qDoc, { merge: true })
      )
    );
  } catch (error) {
    console.warn('Quiz seed skipped:', error);
  }
}
