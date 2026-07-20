import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import { AuthContext } from './auth-context'
import { configureAuthPersistence, ensurePlayerProfile } from '../services/authService'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!auth) return
    let active = true
    void configureAuthPersistence().catch(() => undefined)
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      try {
        if (currentUser) await ensurePlayerProfile(currentUser)
        if (active) setUser(currentUser)
      } catch {
        if (active) setUser(currentUser)
      } finally {
        if (active) setLoading(false)
      }
    })
    return () => { active = false; unsubscribe() }
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    configured: isFirebaseConfigured,
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
