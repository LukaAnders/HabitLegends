import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Package, Shield, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/auth-context'
import { usePlayer } from '../../contexts/player-context'
import { logout } from '../../services/authService'

export function PlayerMenu() {
  const { user } = useAuth()
  const { player } = usePlayer()
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  async function leaveKingdom() {
    if (leaving) return
    setLeaving(true)
    try {
      await logout()
    } finally {
      setLeaving(false)
      setOpen(false)
    }
  }

  return <div className="player-menu" ref={containerRef}>
    <button type="button" className="player-menu-trigger" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(value => !value)}>
      <span><small>Aventureiro</small><strong>{player?.displayName ?? 'Aventureiro'}</strong></span>
      <ChevronDown size={14} className={open ? 'open' : ''} />
    </button>
    {open && <section className="player-menu-panel" role="menu">
      <header><i><UserRound size={19} /></i><div><strong>{player?.displayName ?? 'Aventureiro'}</strong><small>{user?.email ?? `Herói de nível ${player?.level ?? 1}`}</small></div></header>
      <nav>
        <Link role="menuitem" to="/heroi" onClick={() => setOpen(false)}><Shield size={16} /><span><strong>Câmara do Herói</strong><small>Visual e equipamentos</small></span></Link>
        <Link role="menuitem" to="/inventario" onClick={() => setOpen(false)}><Package size={16} /><span><strong>Inventário</strong><small>Artefatos conquistados</small></span></Link>
      </nav>
      <button type="button" role="menuitem" className="player-menu-logout" disabled={leaving} onClick={() => void leaveKingdom()}><LogOut size={16} />{leaving ? 'Saindo...' : 'Sair do Reino'}</button>
    </section>}
  </div>
}
