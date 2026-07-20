import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query,
  serverTimestamp, Timestamp, updateDoc, type Unsubscribe,
} from 'firebase/firestore'
import { DIFFICULTY_REWARDS } from '../constants/tasks'
import { db, requireFirebase } from '../lib/firebase'
import type { HabitTask, TaskInput } from '../types/tasks'

function tasksCollection(userId: string) {
  return collection(requireFirebase(db, 'Cloud Firestore'), 'users', userId, 'tasks')
}

function normalizedTask(input: TaskInput) {
  const reward = DIFFICULTY_REWARDS[input.difficulty]
  return {
    title: input.title.trim(), description: input.description.trim(), category: input.category,
    difficulty: input.difficulty, frequency: input.frequency,
    weekDays: input.frequency === 'weekly' ? input.weekDays ?? [] : [],
    dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
    xpReward: reward.xp, goldReward: reward.gold, isActive: input.isActive ?? true,
  }
}

export async function createTask(userId: string, input: TaskInput) {
  return addDoc(tasksCollection(userId), {
    ...normalizedTask(input), userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
}

export function updateTask(userId: string, taskId: string, input: TaskInput) {
  const firestore = requireFirebase(db, 'Cloud Firestore')
  return updateDoc(doc(firestore, 'users', userId, 'tasks', taskId), {
    ...normalizedTask(input), userId, updatedAt: serverTimestamp(),
  })
}

export function deleteTask(userId: string, taskId: string) {
  return deleteDoc(doc(requireFirebase(db, 'Cloud Firestore'), 'users', userId, 'tasks', taskId))
}

export function setTaskActive(userId: string, taskId: string, isActive: boolean) {
  return updateDoc(doc(requireFirebase(db, 'Cloud Firestore'), 'users', userId, 'tasks', taskId), {
    isActive, updatedAt: serverTimestamp(),
  })
}

export function subscribeToTasks(
  userId: string,
  onData: (tasks: HabitTask[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const taskQuery = query(tasksCollection(userId), orderBy('createdAt', 'desc'))
  return onSnapshot(taskQuery, snapshot => {
    onData(snapshot.docs.map(taskDoc => ({ id: taskDoc.id, ...taskDoc.data() }) as HabitTask))
  }, onError)
}
