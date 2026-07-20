import type { Timestamp } from 'firebase/firestore'

export type AchievementCategory = 'missions' | 'consistency' | 'progression' | 'market' | 'collection' | 'journey' | 'secret'
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type AchievementRequirementType = 'completedTasks' | 'currentStreak' | 'longestStreak' | 'level' | 'totalXp' | 'totalGoldEarned' | 'purchasedItems' | 'equippedItems' | 'epicTasksCompleted' | 'legendaryTasksCompleted' | 'journeyRegionsCompleted'
export interface AchievementDefinition { id: string; name: string; description: string; category: AchievementCategory; rarity: AchievementRarity; iconUrl: string; secret: boolean; requirement: { type: AchievementRequirementType; target: number }; reward: { xp: number; gold: number; titleId?: string | null; itemId?: string | null }; order: number; isActive: boolean }
export interface UserAchievement { id: string; achievementId: string; currentProgress: number; target: number; unlocked: boolean; unlockedAt: Timestamp | null; rewardClaimed: boolean; rewardClaimedAt: Timestamp | null; updatedAt: Timestamp }
export interface AchievementStats { completedTasks: number; currentStreak: number; longestStreak: number; level: number; totalXp: number; totalGoldEarned: number; purchasedItems: number; equippedItems: number; epicTasksCompleted: number; legendaryTasksCompleted: number; journeyRegionsCompleted: number }
export interface AchievementView extends AchievementDefinition { progress: UserAchievement | null; currentProgress: number; percent: number; unlocked: boolean; rewardClaimed: boolean }
export interface AchievementClaimResult { achievement: AchievementDefinition; xpEarned: number; goldEarned: number; previousLevel: number; newLevel: number; levelsGained: number }
