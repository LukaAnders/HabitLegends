import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/auth-context'
import { subscribeToTasks } from '../services/taskService'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'
import type { HabitTask } from '../types/tasks'

export function useTasks() {
  const { user } = useAuth()
  const [state, setState] = useState<{ uid: string | null; tasks: HabitTask[]; error: string | null }>({ uid: null, tasks: [], error: null })

  useEffect(() => {
    if (!user) return
    return subscribeToTasks(
      user.uid,
      tasks => setState({ uid: user.uid, tasks, error: null }),
      error => setState({ uid: user.uid, tasks: [], error: getFriendlyFirebaseError(error) }),
    )
  }, [user])

  return useMemo(() => ({
    tasks: state.uid === user?.uid ? state.tasks : [],
    loading: Boolean(user && state.uid !== user.uid),
    error: state.uid === user?.uid ? state.error : null,
  }), [state, user])
}
