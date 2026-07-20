import { doc, runTransaction, serverTimestamp, Timestamp } from 'firebase/firestore'
import { DIFFICULTY_REWARDS } from '../constants/tasks'
import { db, requireFirebase } from '../lib/firebase'
import type { CompletionReward } from '../types/completions'
import type { PlayerProfile } from '../types/firebase'
import type { HabitTask } from '../types/tasks'
import { applyXpGain, getXpRequiredForLevel } from '../utils/level'
import { getCompletionId, getPeriodKey, getStreakUpdate } from '../utils/taskPeriods'

export async function completeTask(userId: string, taskId: string): Promise<CompletionReward> {
  const firestore = requireFirebase(db, 'Cloud Firestore')
  const profileRef = doc(firestore, 'users', userId)
  const taskRef = doc(firestore, 'users', userId, 'tasks', taskId)
  const now = new Date()

  return runTransaction(firestore, async transaction => {
    const profileSnapshot = await transaction.get(profileRef)
    const taskSnapshot = await transaction.get(taskRef)
    if (!profileSnapshot.exists()) throw new Error('player/profile-not-found')
    if (!taskSnapshot.exists()) throw new Error('task/not-found')

    const profile = profileSnapshot.data() as PlayerProfile
    const task = { id: taskSnapshot.id, ...taskSnapshot.data() } as HabitTask
    if (task.userId !== userId) throw new Error('permission-denied')
    if (!task.isActive) throw new Error('task/inactive')

    const completionId = getCompletionId(task, now)
    const completionRef = doc(firestore, 'users', userId, 'taskCompletions', completionId)
    const completionSnapshot = await transaction.get(completionRef)
    if (completionSnapshot.exists()) throw new Error('task/already-completed')

    const reward = DIFFICULTY_REWARDS[task.difficulty]
    const levelResult = applyXpGain(profile.level, profile.currentXp, reward.xp)
    const levelBonusGold = levelResult.levelsGained * 50
    const newGold = profile.gold + reward.gold + levelBonusGold
    const streakResult = getStreakUpdate(profile.streak, profile.longestStreak, profile.lastActiveDate, now)

    transaction.update(profileRef, {
      level: levelResult.level, currentXp: levelResult.currentXp,
      totalXp: (profile.totalXp ?? 0) + reward.xp, gold: newGold,
      streak: streakResult.streak, longestStreak: streakResult.longestStreak,
      completedTasks: (profile.completedTasks ?? 0) + 1,
      lastActiveDate: Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12)),
      updatedAt: serverTimestamp(),
    })
    transaction.set(completionRef, {
      taskId: task.id, taskTitle: task.title, difficulty: task.difficulty, category: task.category,
      xpEarned: reward.xp, goldEarned: reward.gold, levelBonusGold,
      periodKey: getPeriodKey(task.frequency, task.id, now), completedAt: serverTimestamp(),
    })
    transaction.update(taskRef, {
      isActive: task.frequency === 'once' ? false : task.isActive,
      updatedAt: serverTimestamp(),
    })

    return {
      completionId, taskId: task.id, taskTitle: task.title,
      xpEarned: reward.xp, goldEarned: reward.gold, levelBonusGold, newGold,
      previousLevel: profile.level, newLevel: levelResult.level,
      currentXp: levelResult.currentXp, requiredXp: getXpRequiredForLevel(levelResult.level),
      levelsGained: levelResult.levelsGained, streak: streakResult.streak,
    }
  })
}
