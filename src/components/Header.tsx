import { usePlayer } from '../contexts/player-context'
import { GoldCounter, LevelBadge, StreakCounter } from './GamePrimitives'
import { NotificationsMenu } from './notifications/NotificationsMenu'
import { PlayerMenu } from './player/PlayerMenu'

export function GameTopBar() {
  const { player } = usePlayer()

  return <header className="game-topbar">
    <div className="flex min-w-0 items-center gap-3">
      <LevelBadge level={player?.level ?? 1} />
      <PlayerMenu />
    </div>
    <div className="flex items-center gap-2">
      <GoldCounter value={player?.gold ?? 0} />
      <StreakCounter value={player?.streak ?? 0} />
      <NotificationsMenu />
    </div>
  </header>
}

export const Header = GameTopBar
