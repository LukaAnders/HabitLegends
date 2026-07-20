import { createContext, useContext } from 'react'
import type { PlayerProfile } from '../types/firebase'

export interface PlayerContextValue {
  player: PlayerProfile | null
  loading: boolean
  error: string | null
}

export const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer deve ser usado dentro de PlayerProvider.')
  return context
}
