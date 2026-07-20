import type { Timestamp } from 'firebase/firestore'

export type ActivityLogType =
  | 'task_completed'
  | 'level_up'
  | 'item_purchased'
  | 'item_equipped'
  | 'achievement_unlocked'
  | 'achievement_reward_claimed'
  | 'journey_region_completed'
  | 'journey_completed'
  | 'streak_milestone'

export interface ActivityLogEntry {
  id: string
  type: ActivityLogType
  title: string
  description: string
  metadata: Record<string, unknown>
  createdAt: Timestamp
}
