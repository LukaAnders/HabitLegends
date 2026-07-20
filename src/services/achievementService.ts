import { collection, doc, onSnapshot, runTransaction, serverTimestamp, type Unsubscribe } from 'firebase/firestore'
import { auth, db, requireFirebase } from '../lib/firebase'
import type { AchievementClaimResult, AchievementDefinition, AchievementStats, UserAchievement } from '../types/achievements'
import type { PlayerProfile } from '../types/firebase'
import { applyXpGain } from '../utils/level'
import { getAchievementProgress, isAchievementReady } from '../utils/achievementUtils'
import { createActivityLogEntry } from './activityLogService'

export function subscribeToAchievements(onData: (value: AchievementDefinition[]) => void, onError: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(requireFirebase(db, 'Cloud Firestore'), 'achievements'), snap => onData(snap.docs.map(item => ({ id: item.id, ...item.data() }) as AchievementDefinition).filter(item => item.isActive).sort((a, b) => a.order - b.order)), onError)
}
export function subscribeToUserAchievements(userId: string, onData: (value: UserAchievement[]) => void, onError: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(requireFirebase(db, 'Cloud Firestore'), 'users', userId, 'achievements'), snap => onData(snap.docs.map(item => ({ id: item.id, ...item.data() }) as UserAchievement)), onError)
}
export async function unlockAchievement(userId: string, definition: AchievementDefinition, stats: AchievementStats): Promise<boolean> {
  if (requireFirebase(auth, 'Firebase Authentication').currentUser?.uid !== userId || !isAchievementReady(definition, stats)) return false
  const firestore = requireFirebase(db, 'Cloud Firestore'); const progressRef = doc(firestore, 'users', userId, 'achievements', definition.id)
  return runTransaction(firestore, async transaction => {
    const existing = await transaction.get(progressRef); if (existing.data()?.unlocked === true) return false
    transaction.set(progressRef, { achievementId: definition.id, currentProgress: getAchievementProgress(definition.requirement.type, stats), target: definition.requirement.target, unlocked: true, unlockedAt: serverTimestamp(), rewardClaimed: false, rewardClaimedAt: null, updatedAt: serverTimestamp() })
    createActivityLogEntry(transaction, firestore, userId, { id: `achievement_unlocked_${definition.id}`, type: 'achievement_unlocked', title: `Conquista desbloqueada: ${definition.name}`, description: definition.description, metadata: { achievementId: definition.id, achievementName: definition.name, rarity: definition.rarity, xp: definition.reward.xp, gold: definition.reward.gold }, createdAt: serverTimestamp() })
    return true
  })
}
export async function evaluateAchievements(userId: string, definitions: AchievementDefinition[], progress: UserAchievement[], stats: AchievementStats): Promise<AchievementDefinition[]> {
  const known = new Set(progress.filter(item => item.unlocked).map(item => item.achievementId)); const unlocked: AchievementDefinition[] = []
  for (const definition of definitions) if (!known.has(definition.id) && isAchievementReady(definition, stats) && await unlockAchievement(userId, definition, stats)) unlocked.push(definition)
  return unlocked
}
export async function claimAchievementReward(userId: string, achievementId: string): Promise<AchievementClaimResult> {
  if (requireFirebase(auth, 'Firebase Authentication').currentUser?.uid !== userId) throw new Error('permission-denied')
  const firestore = requireFirebase(db, 'Cloud Firestore'), definitionRef = doc(firestore, 'achievements', achievementId), progressRef = doc(firestore, 'users', userId, 'achievements', achievementId), profileRef = doc(firestore, 'users', userId)
  return runTransaction(firestore, async transaction => {
    const [definitionSnap, progressSnap, profileSnap] = await Promise.all([transaction.get(definitionRef), transaction.get(progressRef), transaction.get(profileRef)])
    if (!definitionSnap.exists() || !progressSnap.exists() || !profileSnap.exists()) throw new Error('achievement/not-found')
    const achievement = { id: definitionSnap.id, ...definitionSnap.data() } as AchievementDefinition, progress = progressSnap.data() as UserAchievement, player = profileSnap.data() as PlayerProfile
    if (!progress.unlocked) throw new Error('achievement/locked'); if (progress.rewardClaimed) throw new Error('achievement/already-claimed')
    const level = applyXpGain(player.level, player.currentXp, achievement.reward.xp)
    transaction.update(profileRef, { level: level.level, currentXp: level.currentXp, totalXp: player.totalXp + achievement.reward.xp, gold: player.gold + achievement.reward.gold, ...(achievement.reward.titleId ? { title: achievement.reward.titleId } : {}), lastActionId: achievementId, lastActionType: 'achievement', updatedAt: serverTimestamp() })
    transaction.update(progressRef, { rewardClaimed: true, rewardClaimedAt: serverTimestamp(), updatedAt: serverTimestamp() })
    createActivityLogEntry(transaction, firestore, userId, { id: `achievement_reward_${achievementId}`, type: 'achievement_reward_claimed', title: `Recompensa resgatada: ${achievement.name}`, description: `Você recebeu ${achievement.reward.xp} XP e ${achievement.reward.gold} ouro.`, metadata: { achievementId, achievementName: achievement.name, rarity: achievement.rarity, xp: achievement.reward.xp, gold: achievement.reward.gold }, createdAt: serverTimestamp() })
    return { achievement, xpEarned: achievement.reward.xp, goldEarned: achievement.reward.gold, previousLevel: player.level, newLevel: level.level, levelsGained: level.levelsGained }
  })
}
