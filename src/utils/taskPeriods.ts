import type { Timestamp } from 'firebase/firestore'
import type { HabitTask, TaskFrequency } from '../types/tasks'

function pad(value: number) { return String(value).padStart(2, '0') }

export function getLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function getWeekKey(date = new Date()) {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${utc.getUTCFullYear()}-W${pad(week)}`
}

export function getPeriodKey(frequency: TaskFrequency, taskId: string, date = new Date()) {
  if (frequency === 'once') return `once_${taskId}`
  if (frequency === 'weekly') return getWeekKey(date)
  return getLocalDateKey(date)
}

export function getCompletionId(task: Pick<HabitTask, 'id' | 'frequency'>, date = new Date()) {
  return `${task.id}_${getPeriodKey(task.frequency, task.id, date)}`
}

export function getStreakUpdate(currentStreak: number, longestStreak: number, lastActiveDate: Timestamp | null, now = new Date()) {
  if (!lastActiveDate) return { streak: 1, longestStreak: Math.max(1, longestStreak) }
  const last = lastActiveDate.toDate()
  if (getLocalDateKey(last) === getLocalDateKey(now)) return { streak: currentStreak, longestStreak }
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12)
  const streak = getLocalDateKey(last) === getLocalDateKey(yesterday) ? currentStreak + 1 : 1
  return { streak, longestStreak: Math.max(streak, longestStreak) }
}
