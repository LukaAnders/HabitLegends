import type { Timestamp } from 'firebase/firestore'

export interface PlayerAvatar {
  body: string
  hair: string
  outfit: string
  weapon: string | null
  accessory: string | null
  pet: string | null
  background: string
}

export interface PlayerProfile {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  characterName: string
  title: string
  level: number
  currentXp: number
  totalXp: number
  gold: number
  streak: number
  longestStreak: number
  completedTasks: number
  lastActiveDate: Timestamp | null
  lastActionId?: string
  lastActionType?: 'completion' | 'purchase'
  avatar: PlayerAvatar
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface PlayerQuest {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'Comum' | 'Raro' | 'Épico' | 'Lendário'
  xp: number
  gold: number
  state: 'Disponível' | 'Em andamento' | 'Concluída'
  completedAt?: Timestamp
}
