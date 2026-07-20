import { doc, getDoc, increment, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db, requireFirebase } from '../lib/firebase'
import type { PlayerProfile, PlayerQuest } from '../types/firebase'

export async function getPlayerProfile(userId: string) {
  const firestore = requireFirebase(db, 'Cloud Firestore')
  const snapshot = await getDoc(doc(firestore, 'users', userId))
  return snapshot.exists() ? snapshot.data() as PlayerProfile : null
}

export async function completePlayerQuest(userId: string, quest: PlayerQuest) {
  const firestore = requireFirebase(db, 'Cloud Firestore')
  const profileRef = doc(firestore, 'users', userId)
  const questRef = doc(firestore, 'users', userId, 'quests', quest.id)

  await runTransaction(firestore, async transaction => {
    const questSnapshot = await transaction.get(questRef)

    if (questSnapshot.exists() && questSnapshot.data().state === 'Concluída') {
      throw new Error('Esta missão já foi concluída.')
    }

    transaction.set(questRef, {
      ...quest,
      state: 'Concluída',
      completedAt: serverTimestamp(),
    }, { merge: true })

    transaction.update(profileRef, {
      xp: increment(quest.xp),
      gold: increment(quest.gold),
      updatedAt: serverTimestamp(),
    })
  })
}
