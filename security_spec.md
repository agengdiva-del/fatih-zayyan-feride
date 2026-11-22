# Security Specification & Dirty Dozen Audit

## 1. Data Invariants
1. `users/{userId}` documents can only be read, created, or updated by the verified authenticated owner (`request.auth.uid == userId`), and `uid` inside the payload must equal `request.auth.uid`.
2. `leaderboard/{entryId}` documents contain zero PII (no email, phone, or private metadata). They are publicly readable only when `xp >= 0` and `gradeNumber` is between `1` and `6`. Writes are allowed only when `entryId == request.auth.uid`, `email_verified == true`, and `updatedAt == request.time`.
3. `quizzes/{quizId}` documents are readable when `gradeNumber >= 1 && gradeNumber <= 6`, and writable only by verified admins (`isAdmin()`).
4. All document IDs must satisfy `^[a-zA-Z0-9_\-]+$` and length `<= 128`.
5. All strings and arrays enforce strict `.size()` limits and strict key allowlists (`hasAll` + `hasOnly`).

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated user profile write**: `POST /users/user1` with `request.auth == null`.
2. **Cross-user profile read**: `GET /users/otherUid` when signed in as `userA`.
3. **UID spoofing in leaderboard create**: `SET /leaderboard/userA` with `data.uid = "userB"`.
4. **Shadow/ghost field injection**: `SET /users/userA` including extra field `isAdmin: true`.
5. **Unverified email write**: `SET /leaderboard/userA` when `request.auth.token.email_verified == false`.
6. **Negative XP poisoning**: `UPDATE /leaderboard/userA` with `xp: -500`.
7. **Out-of-range gradeNumber**: `SET /leaderboard/userA` with `gradeNumber: 9`.
8. **Client timestamp forgery**: `SET /leaderboard/userA` with `updatedAt` != `request.time`.
9. **Oversized displayName DoW**: `SET /leaderboard/userA` with 500-char `displayName`.
10. **Immutable UID mutation**: `UPDATE /users/userA` changing `uid` field.
11. **Non-admin quiz tampering**: `SET /quizzes/q1` by a regular student account.
12. **Unbounded completedTopics array**: `UPDATE /users/userA` with 200 items in `completedTopics`.
