import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, requireFirebase } from '../lib/firebase'

export async function configureAuthPersistence() {
  await setPersistence(
    requireFirebase(auth, 'Firebase Authentication'),
    browserLocalPersistence,
  )
}

export async function ensurePlayerProfile(user: User) {
  const firestore = requireFirebase(db, 'Cloud Firestore')
  const userRef = doc(firestore, 'users', user.uid)
  const snapshot = await getDoc(userRef)
  if (snapshot.exists()) return

  const displayName = user.displayName?.trim() || user.email?.split('@')[0] || 'Aventureiro'
  await setDoc(userRef, {
    uid: user.uid,
    displayName,
    email: user.email ?? '',
    photoURL: user.photoURL ?? null,
    characterName: displayName,
    title: 'Aventureiro Iniciante',
    level: 1,
    currentXp: 0,
    totalXp: 0,
    gold: 100,
    streak: 0,
    longestStreak: 0,
    completedTasks: 0,
    lastActiveDate: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    avatar: {
      body: 'body_default', hair: 'hair_default', outfit: 'outfit_default',
      weapon: null, accessory: null, pet: null, background: 'background_default',
    },
  })
}

export async function registerWithEmail(displayName: string, email: string, password: string) {
  const firebaseAuth = requireFirebase(auth, 'Firebase Authentication')
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
  await updateProfile(credential.user, { displayName: displayName.trim() })
  await ensurePlayerProfile(credential.user)
  await setDoc(doc(requireFirebase(db, 'Cloud Firestore'), 'users', credential.user.uid), {
    displayName: displayName.trim(),
    characterName: displayName.trim(),
    email: credential.user.email ?? email,
    updatedAt: serverTimestamp(),
  }, { merge: true })
  return credential.user
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(requireFirebase(auth, 'Firebase Authentication'), email, password)
  await ensurePlayerProfile(credential.user)
  return credential.user
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(requireFirebase(auth, 'Firebase Authentication'), new GoogleAuthProvider())
  await ensurePlayerProfile(credential.user)
  return credential.user
}

export function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(requireFirebase(auth, 'Firebase Authentication'), email)
}

export function logout() {
  return signOut(requireFirebase(auth, 'Firebase Authentication'))
}
