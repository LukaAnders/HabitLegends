import type { AchievementDefinition, AchievementRequirementType, AchievementStats } from '../types/achievements'

export function getAchievementProgress(type: AchievementRequirementType, stats: AchievementStats): number { return Math.max(0, stats[type]) }
export const calculateAchievementProgress = getAchievementProgress
export function isAchievementReady(definition: AchievementDefinition, stats: AchievementStats) { return getAchievementProgress(definition.requirement.type, stats) >= definition.requirement.target }
export const achievementCategoryLabels = { missions: 'Missões', consistency: 'Consistência', progression: 'Evolução', market: 'Mercado', collection: 'Coleção', journey: 'Jornada', secret: 'Secretas' } as const
export const achievementRarityLabels = { common: 'Comum', rare: 'Rara', epic: 'Épica', legendary: 'Lendária' } as const
