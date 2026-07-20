import { Bell, ChevronDown } from 'lucide-react'
import { hero } from '../data/gameData'
import { GoldCounter, LevelBadge, StreakCounter } from './GamePrimitives'

export function GameTopBar() { return <header className="game-topbar"><div className="flex min-w-0 items-center gap-3"><LevelBadge level={hero.level} /><div className="min-w-0"><p className="truncate text-xs text-mist">Aventureiro</p><button className="flex items-center gap-1 font-display text-sm font-bold text-parchment sm:text-base">{hero.userName} <ChevronDown size={14} className="text-gold" /></button></div></div><div className="flex items-center gap-2"><GoldCounter value={hero.gold} /><StreakCounter value={hero.streak} /><button aria-label="Notificações" className="notification-medallion"><Bell size={18} /><span /></button></div></header> }
export const Header = GameTopBar
