import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Crown } from 'lucide-react'
import { useAuth } from '../contexts/auth-context'
import { usePlayer } from '../contexts/player-context'

export function ProtectedRoute() {
  const { user, loading: authLoading, configured } = useAuth()
  const { loading: playerLoading } = usePlayer()
  const location = useLocation()

  if (!configured) return <div className="auth-loading"><Crown /><p>Firebase não configurado.</p></div>
  if (authLoading || (user && playerLoading)) return <div className="auth-loading"><Crown className="animate-pulse text-gold" /><p>Invocando seu reino...</p></div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
