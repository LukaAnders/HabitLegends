import { Bell, ChevronDown } from 'lucide-react'
import { GoldCounter, LevelBadge, StreakCounter } from './GamePrimitives'
import { usePlayer } from '../contexts/player-context'

export function GameTopBar() { const { player } = usePlayer(); return <header className="game-topbar"><div className="flex min-w-0 items-center gap-3"><LevelBadge level={player?.level ?? 1} /><div className="min-w-0"><p className="truncate text-xs text-mist">Aventureiro</p><button className="flex items-center gap-1 font-display text-sm font-bold text-parchment sm:text-base">{player?.displayName ?? 'Aventureiro'} <ChevronDown size={14} className="text-gold" /></button></div></div><div className="flex items-center gap-2"><GoldCounter value={player?.gold ?? 0} /><StreakCounter value={player?.streak ?? 0} /><button aria-label="Notificações" className="notification-medallion"><Bell size={18} /><span /></button></div></header> }
export const Header = GameTopBar
