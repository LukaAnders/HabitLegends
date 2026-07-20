import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, ChevronRight, ScrollText, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/auth-context'
import { useActivityLog } from '../../hooks/useActivityLog'
import { getActivityColor, getActivityIcon } from '../../utils/journalUtils'

function formatRelativeTime(date: Date) {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return 'agora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours} h`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'ontem' : `há ${days} dias`
}

export function NotificationsMenu() {
  const { user } = useAuth()
  const { entries, loading, error } = useActivityLog()
  const [open, setOpen] = useState(false)
  const [lastSeen, setLastSeen] = useState(() => Number(localStorage.getItem(`habit-legends:notifications:${user?.uid ?? 'guest'}`) ?? 0))
  const containerRef = useRef<HTMLDivElement>(null)
  const recentEntries = entries.slice(0, 6)
  const unread = useMemo(() => entries.filter(entry => (entry.createdAt?.toMillis?.() ?? 0) > lastSeen).length, [entries, lastSeen])

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

  function toggleMenu() {
    setOpen(value => !value)
    if (!open && user) {
      const seenAt = Date.now()
      localStorage.setItem(`habit-legends:notifications:${user.uid}`, String(seenAt))
      setLastSeen(seenAt)
    }
  }

  return <div className="notifications-menu" ref={containerRef}>
    <button type="button" aria-label="Notificações" aria-haspopup="dialog" aria-expanded={open} onClick={toggleMenu} className={`notification-medallion ${open ? 'active' : ''}`}>
      <Bell size={18} />
      {unread > 0 && <span aria-label={`${unread} notificações não lidas`} />}
    </button>
    {open && <section className="notifications-panel" role="dialog" aria-label="Notificações recentes">
      <header><div><small>Mensagens do reino</small><h2>Notificações</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Fechar notificações"><X size={17} /></button></header>
      <div className="notifications-list">
        {loading && !entries.length ? <p className="notifications-state">Consultando as crônicas...</p>
          : error ? <p className="notifications-state error">{error}</p>
            : recentEntries.length ? recentEntries.map(entry => {
              const Icon = getActivityIcon(entry.type)
              const timestamp = entry.createdAt?.toDate?.()
              const color = getActivityColor(entry.type)
              return <article key={entry.id} className="notification-entry">
                <i style={{ color, borderColor: `${color}55` }}><Icon size={17} /></i>
                <div><strong>{entry.title}</strong><p>{entry.description}</p><time>{timestamp ? formatRelativeTime(timestamp) : 'agora'}</time></div>
              </article>
            }) : <div className="notifications-empty"><ScrollText size={27} /><strong>Nenhuma mensagem</strong><p>Seus novos feitos aparecerão aqui.</p></div>}
      </div>
      <Link to="/diario" onClick={() => setOpen(false)} className="notifications-footer">Abrir Diário de Aventuras <ChevronRight size={15} /></Link>
    </section>}
  </div>
}
