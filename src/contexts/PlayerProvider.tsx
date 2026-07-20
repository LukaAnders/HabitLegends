import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { useAuth } from './auth-context'
import { PlayerContext } from './player-context'
import { db, requireFirebase } from '../lib/firebase'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'
import type { PlayerProfile } from '../types/firebase'

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [snapshotState, setSnapshotState] = useState<{
    uid: string | null
    player: PlayerProfile | null
    error: string | null
  }>({ uid: null, player: null, error: null })

  useEffect(() => {
    if (authLoading) return
    if (!user) return

    return onSnapshot(
      doc(requireFirebase(db, 'Cloud Firestore'), 'users', user.uid),
      snapshot => {
        setSnapshotState({ uid: user.uid, player: snapshot.exists() ? snapshot.data() as PlayerProfile : null, error: null })
      },
      snapshotError => {
        setSnapshotState({ uid: user.uid, player: null, error: getFriendlyFirebaseError(snapshotError) })
      },
    )
  }, [user, authLoading])

  const isCurrentUser = Boolean(user && snapshotState.uid === user.uid)
  const player = isCurrentUser ? snapshotState.player : null
  const error = isCurrentUser ? snapshotState.error : null
  const loading = authLoading || Boolean(user && !isCurrentUser)
  const value = useMemo(() => ({ player, loading, error }), [player, loading, error])
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
