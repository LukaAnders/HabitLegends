import { collection, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, type Unsubscribe } from 'firebase/firestore'
import { auth, db, requireFirebase } from '../lib/firebase'
import type { PlayerProfile } from '../types/firebase'
import type { JourneyClaimResult, JourneyRegion, UserJourneyProgress } from '../types/journey'
import { applyXpGain } from '../utils/level'
import { createActivityLogEntry } from './activityLogService'

export function subscribeToJourneyRegions(
  onData: (regions: JourneyRegion[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const regionsQuery = query(collection(requireFirebase(db, 'Cloud Firestore'), 'journeyRegions'), orderBy('order', 'asc'))
  return onSnapshot(regionsQuery, snapshot => {
    onData(snapshot.docs.map(region => ({ id: region.id, ...region.data() }) as JourneyRegion))
  }, onError)
}

export function subscribeToJourneyProgress(
  userId: string,
  onData: (progress: UserJourneyProgress[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(collection(requireFirebase(db, 'Cloud Firestore'), 'users', userId, 'journey'), snapshot => {
    onData(snapshot.docs.map(progress => ({ id: progress.id, ...progress.data() }) as UserJourneyProgress))
  }, onError)
}

export async function claimJourneyRegionReward(userId: string, regionId: string): Promise<JourneyClaimResult> {
  if (requireFirebase(auth, 'Firebase Authentication').currentUser?.uid !== userId) throw new Error('permission-denied')
  const firestore = requireFirebase(db, 'Cloud Firestore')
  const profileRef = doc(firestore, 'users', userId)
  const regionRef = doc(firestore, 'journeyRegions', regionId)
  const progressRef = doc(firestore, 'users', userId, 'journey', regionId)
  const activityId = `journey_${regionId}`

  return runTransaction(firestore, async transaction => {
    const [profileSnapshot, regionSnapshot, progressSnapshot] = await Promise.all([
      transaction.get(profileRef), transaction.get(regionRef), transaction.get(progressRef),
    ])
    if (!profileSnapshot.exists()) throw new Error('player/profile-not-found')
    if (!regionSnapshot.exists()) throw new Error('journey/region-not-found')
    if (progressSnapshot.exists()) throw new Error('journey/reward-already-claimed')

    const player = profileSnapshot.data() as PlayerProfile
    const region = { id: regionSnapshot.id, ...regionSnapshot.data() } as JourneyRegion
    if (player.level < region.minimumLevel) throw new Error('journey/region-locked')
    if (region.previousRegionId) {
      const previousSnapshot = await transaction.get(doc(firestore, 'users', userId, 'journey', region.previousRegionId))
      if (!previousSnapshot.exists() || previousSnapshot.data().rewardClaimed !== true) throw new Error('journey/previous-region-required')
    }

    const levelResult = applyXpGain(player.level, player.currentXp, region.reward.xp)
    const totalXp = player.totalXp + region.reward.xp
    const gold = player.gold + region.reward.gold
    const objectivesSnapshot = Object.fromEntries(region.objectives.map(objective => [objective.id, objective.target]))

    transaction.update(profileRef, {
      level: levelResult.level,
      currentXp: levelResult.currentXp,
      totalXp,
      gold,
      ...(region.reward.title ? { title: region.reward.title } : {}),
      lastActionId: regionId,
      lastActionType: 'journey',
      updatedAt: serverTimestamp(),
    })
    transaction.set(progressRef, {
      regionId,
      status: 'completed',
      rewardClaimed: true,
      objectivesSnapshot,
      completedAt: serverTimestamp(),
      claimedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    createActivityLogEntry(transaction, firestore, userId, {
      id: activityId,
      type: 'journey_completed',
      title: `Região concluída: ${region.name}`,
      description: `Você dominou ${region.name} e recebeu ${region.reward.xp} XP e ${region.reward.gold} ouro.`,
      metadata: { regionId, xp: region.reward.xp, gold: region.reward.gold, title: region.reward.title ?? null },
      createdAt: serverTimestamp(),
    })

    return {
      region,
      xpEarned: region.reward.xp,
      goldEarned: region.reward.gold,
      titleUnlocked: region.reward.title,
    }
  })
}
