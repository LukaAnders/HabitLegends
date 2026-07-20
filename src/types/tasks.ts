import type { Timestamp } from 'firebase/firestore'

export type TaskDifficulty = 'common' | 'rare' | 'epic' | 'legendary'
export type TaskFrequency = 'once' | 'daily' | 'weekly'

export interface HabitTask {
  id: string
  userId: string
  title: string
  description: string
  category: string
  difficulty: TaskDifficulty
  frequency: TaskFrequency
  weekDays?: number[]
  dueDate?: Timestamp | null
  xpReward: number
  goldReward: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface TaskInput {
  title: string
  description: string
  category: string
  difficulty: TaskDifficulty
  frequency: TaskFrequency
  weekDays?: number[]
  dueDate?: Date | null
  isActive?: boolean
}
