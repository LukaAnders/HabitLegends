import { describe, expect, it } from 'vitest'
import { getAchievementProgress } from './achievementUtils'
import type { AchievementStats } from '../types/achievements'
const stats: AchievementStats = { completedTasks: 37, currentStreak: 3, longestStreak: 8, level: 5, totalXp: 840, totalGoldEarned: 400, purchasedItems: 2, equippedItems: 1, epicTasksCompleted: 4, legendaryTasksCompleted: 1, journeyRegionsCompleted: 1 }
describe('getAchievementProgress', () => { it('centraliza todos os tipos de requisito', () => { expect(getAchievementProgress('completedTasks', stats)).toBe(37); expect(getAchievementProgress('journeyRegionsCompleted', stats)).toBe(1); expect(getAchievementProgress('totalGoldEarned', stats)).toBe(400) }); it('nunca retorna progresso negativo', () => { expect(getAchievementProgress('currentStreak', { ...stats, currentStreak: -1 })).toBe(0) }) })
