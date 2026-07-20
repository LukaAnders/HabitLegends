import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useAuth } from '../contexts/auth-context'
import { db, requireFirebase } from '../lib/firebase'
import type { TaskCompletion } from '../types/completions'
import type { HabitTask } from '../types/tasks'
import { getCompletionId } from '../utils/taskPeriods'

export function useTaskCompletions() {
  const { user } = useAuth()
  const [state, setState] = useState<{ uid: string | null; completions: TaskCompletion[] }>({ uid: null, completions: [] })
  useEffect(() => {
    if (!user) return
    const completionQuery = query(collection(requireFirebase(db, 'Cloud Firestore'), 'users', user.uid, 'taskCompletions'), orderBy('completedAt', 'desc'))
    return onSnapshot(completionQuery, snapshot => setState({ uid: user.uid, completions: snapshot.docs.map(item => ({ id: item.id, ...item.data() }) as TaskCompletion) }))
  }, [user])
  const completions = useMemo(() => state.uid === user?.uid ? state.completions : [], [state, user])
  const ids = useMemo(() => new Set(completions.map(completion => completion.id)), [completions])
  return { completions, loading: Boolean(user && state.uid !== user.uid), isCompleted: (task: Pick<HabitTask, 'id' | 'frequency'>) => ids.has(getCompletionId(task)) }
}
