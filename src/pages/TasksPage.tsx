import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter, Plus, ScrollText, Search, Sparkles, X } from 'lucide-react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { LevelUpModal } from '../components/rewards/LevelUpModal'
import { RewardModal } from '../components/rewards/RewardModal'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { TaskManagementCard } from '../components/tasks/TaskManagementCard'
import { DIFFICULTY_LABELS, FREQUENCY_LABELS, TASK_CATEGORIES } from '../constants/tasks'
import { useAuth } from '../contexts/auth-context'
import { useTaskCompletions } from '../hooks/useTaskCompletions'
import { useTasks } from '../hooks/useTasks'
import { completeTask } from '../services/taskCompletionService'
import { createTask, deleteTask, setTaskActive, updateTask } from '../services/taskService'
import type { CompletionReward } from '../types/completions'
import type { HabitTask, TaskDifficulty, TaskFrequency, TaskInput } from '../types/tasks'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'

type Toast = { type: 'success' | 'error'; message: string }

export function TasksPage() {
  const { user } = useAuth()
  const { tasks, loading, error } = useTasks()
  const { isCompleted } = useTaskCompletions()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<HabitTask | null>(null)
  const [deleting, setDeleting] = useState<HabitTask | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [reward, setReward] = useState<CompletionReward | null>(null)
  const [levelUp, setLevelUp] = useState<CompletionReward | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState<'all' | TaskDifficulty>('all')
  const [frequency, setFrequency] = useState<'all' | TaskFrequency>('all')

  const filtered = useMemo(() => tasks.filter(task => {
    const text = `${task.title} ${task.description}`.toLowerCase()
    return text.includes(search.toLowerCase()) && (category === 'all' || task.category === category)
      && (difficulty === 'all' || task.difficulty === difficulty)
      && (frequency === 'all' || task.frequency === frequency)
  }), [tasks, search, category, difficulty, frequency])
  const hasFilters = Boolean(search || category !== 'all' || difficulty !== 'all' || frequency !== 'all')

  function notify(next: Toast) { setToast(next); window.setTimeout(() => setToast(null), 3200) }
  async function save(input: TaskInput) { if (!user) return; setBusyId(editing?.id ?? 'create'); try { if (editing) { await updateTask(user.uid, editing.id, input); notify({ type: 'success', message: 'Missão atualizada no grimório.' }) } else { await createTask(user.uid, input); notify({ type: 'success', message: 'Nova missão adicionada à jornada.' }) } setFormOpen(false); setEditing(null) } catch (cause) { notify({ type: 'error', message: getFriendlyFirebaseError(cause) }) } finally { setBusyId(null) } }
  async function toggle(task: HabitTask) { if (!user) return; setBusyId(task.id); try { await setTaskActive(user.uid, task.id, !task.isActive); notify({ type: 'success', message: task.isActive ? 'Missão pausada.' : 'Missão reativada.' }) } catch (cause) { notify({ type: 'error', message: getFriendlyFirebaseError(cause) }) } finally { setBusyId(null) } }
  async function finish(task: HabitTask) { if (!user || busyId || isCompleted(task)) return; setBusyId(task.id); try { const result = await completeTask(user.uid, task.id); setReward(result) } catch (cause) { notify({ type: 'error', message: getFriendlyFirebaseError(cause) }) } finally { setBusyId(null) } }
  async function confirmDelete() { if (!user || !deleting) return; setBusyId(deleting.id); try { await deleteTask(user.uid, deleting.id); notify({ type: 'success', message: 'Missão removida do grimório.' }); setDeleting(null) } catch (cause) { notify({ type: 'error', message: getFriendlyFirebaseError(cause) }) } finally { setBusyId(null) } }
  function closeReward() { if (reward?.levelsGained) setLevelUp(reward); setReward(null) }
  function clearFilters() { setSearch(''); setCategory('all'); setDifficulty('all'); setFrequency('all') }

  return <main className="tasks-page"><header className="tasks-hero"><div><span className="eyebrow"><ScrollText size={15} />Grimório de aventuras</span><h1>Minhas Missões</h1><p>Transforme objetivos do mundo real em feitos dignos de uma lenda.</p></div><button onClick={() => { setEditing(null); setFormOpen(true) }} className="primary-game-button"><Plus size={18} />Nova missão</button></header><section className="task-filters"><div className="task-search"><Search size={17} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar no grimório..." /></div><div className="filter-select"><Filter size={15} /><select value={category} onChange={event => setCategory(event.target.value)}><option value="all">Todas as categorias</option>{TASK_CATEGORIES.map(value => <option key={value}>{value}</option>)}</select></div><select value={difficulty} onChange={event => setDifficulty(event.target.value as 'all' | TaskDifficulty)}><option value="all">Todas as raridades</option>{Object.entries(DIFFICULTY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={frequency} onChange={event => setFrequency(event.target.value as 'all' | TaskFrequency)}><option value="all">Todas as frequências</option>{Object.entries(FREQUENCY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{hasFilters && <button onClick={clearFilters} className="clear-filters"><X size={14} />Limpar</button>}</section>{error && <div role="alert" className="tasks-error">{error}</div>}{loading ? <div className="tasks-grid">{Array.from({ length: 4 }, (_, index) => <div key={index} className="task-skeleton" />)}</div> : filtered.length ? <motion.section layout className="tasks-grid">{filtered.map(task => <TaskManagementCard key={task.id} task={task} busy={busyId === task.id} completed={isCompleted(task)} onComplete={() => void finish(task)} onEdit={() => { setEditing(task); setFormOpen(true) }} onDelete={() => setDeleting(task)} onToggle={() => void toggle(task)} />)}</motion.section> : <section className="tasks-empty"><div className="empty-rune"><ScrollText size={35} /></div><h2>{hasFilters ? 'Nenhuma missão encontrada' : 'Seu grimório está vazio'}</h2><p>{hasFilters ? 'Altere os filtros para revelar outras aventuras.' : 'Crie sua primeira missão e dê início a uma nova jornada.'}</p><button onClick={hasFilters ? clearFilters : () => setFormOpen(true)}>{hasFilters ? 'Limpar filtros' : 'Criar primeira missão'}</button></section>}<TaskFormModal key={`${formOpen}-${editing?.id ?? 'new'}`} open={formOpen} task={editing} busy={busyId === (editing?.id ?? 'create')} onClose={() => { setFormOpen(false); setEditing(null) }} onSave={save} /><ConfirmDialog open={Boolean(deleting)} title="Apagar esta missão?" message={`“${deleting?.title ?? ''}” será removida permanentemente do seu grimório.`} busy={busyId === deleting?.id} onCancel={() => setDeleting(null)} onConfirm={() => void confirmDelete()} /><RewardModal reward={reward} onClose={closeReward} /><LevelUpModal open={Boolean(levelUp)} level={levelUp?.newLevel ?? 1} levelsGained={levelUp?.levelsGained ?? 0} onClose={() => setLevelUp(null)} /><AnimatePresence>{toast && <motion.div role="status" aria-live="polite" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`game-toast ${toast.type}`}><Sparkles size={18} />{toast.message}</motion.div>}</AnimatePresence></main>
}
