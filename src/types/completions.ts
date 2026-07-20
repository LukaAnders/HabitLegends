import type { Timestamp } from 'firebase/firestore'
import type { TaskDifficulty } from './tasks'

export interface TaskCompletion {
  id: string
  taskId: string
  taskTitle: string
  difficulty: TaskDifficulty
  category: string
  xpEarned: number
  goldEarned: number
  levelBonusGold: number
  periodKey: string
  completedAt: Timestamp
}

export interface CompletionReward {
  completionId: string
  taskId: string
  taskTitle: string
  xpEarned: number
  goldEarned: number
  levelBonusGold: number
  newGold: number
  previousLevel: number
  newLevel: number
  currentXp: number
  requiredXp: number
  levelsGained: number
  streak: number
}
