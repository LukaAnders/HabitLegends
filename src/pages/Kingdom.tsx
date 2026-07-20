import { useMemo, useState } from 'react'
import { BookOpen, Dumbbell, Flame, ScrollText, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DailyChest } from '../components/DailyProgress'
import { HeroStage } from '../components/HeroStage'
import { JourneyPath } from '../components/JourneyPath'
import { MerchantPreview } from '../components/MarketCard'
import { MainQuestCard, QuestCard } from '../components/QuestCard'
import { LevelUpModal } from '../components/rewards/LevelUpModal'
import { RewardModal } from '../components/rewards/RewardModal'
import { useAuth } from '../contexts/auth-context'
import { useTaskCompletions } from '../hooks/useTaskCompletions'
import { useTasks } from '../hooks/useTasks'
import { completeTask } from '../services/taskCompletionService'
import type { CompletionReward } from '../types/completions'
import type { Quest, Rarity } from '../data/gameData'
import type { HabitTask } from '../types/tasks'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'

const difficultyMap = { common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário' } satisfies Record<HabitTask['difficulty'], Rarity>
const categoryIcons = { 'Exercício': Dumbbell, 'Estudos': BookOpen, 'Foco': Target, 'Bem-estar': Flame }
function toQuest(task: HabitTask, completed: boolean, featured = false): Quest { return { id: task.id, name: task.title, description: task.description, category: task.category, difficulty: difficultyMap[task.difficulty], xp: task.xpReward, gold: task.goldReward, icon: categoryIcons[task.category as keyof typeof categoryIcons] ?? Target, state: completed ? 'Concluída' : task.isActive ? 'Disponível' : 'Em andamento', completed, featured } }

export function Kingdom() {
  const { user } = useAuth(); const { tasks, loading } = useTasks(); const { isCompleted } = useTaskCompletions(); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null); const [reward, setReward] = useState<CompletionReward | null>(null); const [levelUp, setLevelUp] = useState<CompletionReward | null>(null)
  const activeTasks = useMemo(() => tasks.filter(task => task.isActive).slice(0, 4), [tasks]); const quests = activeTasks.map((task, index) => toQuest(task, isCompleted(task), index === 0)); const featured = quests[0]; const others = quests.slice(1); const completed = tasks.filter(task => isCompleted(task)).length
  async function finish(quest: Quest) { if (!user || busy || quest.completed) return; setBusy(true); setError(null); try { setReward(await completeTask(user.uid, quest.id)) } catch (cause) { setError(getFriendlyFirebaseError(cause)) } finally { setBusy(false) } }
  function closeReward() { if (reward?.levelsGained) setLevelUp(reward); setReward(null) }
  return <main className="kingdom-page"><HeroStage />
    <section className="kingdom-section"><div className="section-title-row"><div><span className="eyebrow"><ScrollText size={14} /> Conselho de aventuras</span><h2 className="section-heading">Missões de hoje</h2></div><Link to="/missoes" className="text-xs font-bold uppercase tracking-wider text-gold">Ver grimório →</Link></div>{error && <div className="tasks-error">{error}</div>}{loading ? <div className="task-skeleton" /> : featured ? <div className={`quest-layout ${busy ? 'pointer-events-none opacity-70' : ''}`}><MainQuestCard quest={featured} onComplete={finish} /><div className="grid gap-3">{others.map(quest => <QuestCard key={quest.id} quest={quest} onComplete={finish} />)}</div></div> : <div className="tasks-empty min-h-64"><div className="empty-rune"><ScrollText size={32} /></div><h2>Nenhuma missão ativa</h2><p>Abra seu grimório e forje a primeira aventura do dia.</p><Link to="/missoes" className="mt-4 text-xs font-bold uppercase tracking-wider text-gold">Criar missão →</Link></div>}</section>
    <section className="kingdom-section grid gap-5 xl:grid-cols-[1.55fr_.75fr]"><JourneyPath /><DailyChest completed={completed} total={tasks.length} /></section><section className="kingdom-section"><MerchantPreview /></section>
    <RewardModal reward={reward} onClose={closeReward} /><LevelUpModal open={Boolean(levelUp)} level={levelUp?.newLevel ?? 1} levelsGained={levelUp?.levelsGained ?? 0} onClose={() => setLevelUp(null)} />
  </main>
}
