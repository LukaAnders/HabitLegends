import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, type Firestore, type Transaction, type Unsubscribe } from 'firebase/firestore'
import { db, requireFirebase } from '../lib/firebase'
import type { ActivityLogType } from '../types/activity'
import type { ActivityLogEntry } from '../types/activity'

export interface ActivityLogInput {
  id: string
  type: ActivityLogType
  title: string
  description: string
  metadata?: Record<string, string | number | boolean | null>
  createdAt: unknown
}

export async function createActivity(userId: string, input: Omit<ActivityLogInput, 'createdAt'>) { const firestore = requireFirebase(db, 'Cloud Firestore'); await setDoc(doc(firestore, 'users', userId, 'activityLog', input.id), { ...input, metadata: input.metadata ?? {}, createdAt: serverTimestamp() }) }
export function subscribeActivity(userId: string, pageSize: number, onData: (entries: ActivityLogEntry[]) => void, onError: (error: Error) => void): Unsubscribe { const activityQuery = query(collection(requireFirebase(db, 'Cloud Firestore'), 'users', userId, 'activityLog'), orderBy('createdAt', 'desc'), limit(pageSize)); return onSnapshot(activityQuery, snapshot => onData(snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as ActivityLogEntry)), onError) }
export async function getActivities(userId: string, pageSize = 20) { const snapshot = await getDocs(query(collection(requireFirebase(db, 'Cloud Firestore'), 'users', userId, 'activityLog'), orderBy('createdAt', 'desc'), limit(pageSize))); return snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as ActivityLogEntry) }

export function createActivityLogEntry(
  transaction: Transaction,
  firestore: Firestore,
  userId: string,
  input: ActivityLogInput,
) {
  transaction.set(doc(firestore, 'users', userId, 'activityLog', input.id), {
    type: input.type,
    title: input.title,
    description: input.description,
    metadata: input.metadata ?? {},
    createdAt: input.createdAt,
  })
}
