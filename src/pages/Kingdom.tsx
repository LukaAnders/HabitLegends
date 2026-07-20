import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollText, Sparkles, X } from 'lucide-react'
import { DailyChest } from '../components/DailyProgress'
import { HeroStage } from '../components/HeroStage'
import { JourneyPath } from '../components/JourneyPath'
import { MerchantPreview } from '../components/MarketCard'
import { MainQuestCard, QuestCard } from '../components/QuestCard'
import { quests as initialQuests, type Quest } from '../data/gameData'

export function Kingdom() { const [quests, setQuests] = useState(initialQuests); const [reward, setReward] = useState<Quest | null>(null); const completed = quests.filter(q => q.completed).length; const bonusXp = useMemo(() => quests.filter(q => q.completed).reduce((sum, q) => sum + q.xp, 0), [quests]); const featured = quests.find(q => q.featured)!; const others = quests.filter(q => !q.featured);
  const completeQuest = (quest: Quest) => { if (quest.completed) return; setQuests(all => all.map(q => q.id === quest.id ? { ...q, completed: true, state: 'Concluída' } : q)); setReward(quest); window.setTimeout(() => setReward(null), 2800) }
  return <main className="kingdom-page"><HeroStage bonusXp={bonusXp} />
    <section className="kingdom-section"><div className="section-title-row"><div><span className="eyebrow"><ScrollText size={14} /> Conselho de aventuras</span><h2 className="section-heading">Missões de hoje</h2></div><button className="text-xs font-bold uppercase tracking-wider text-gold">Ver grimório →</button></div><div className="quest-layout"><MainQuestCard quest={featured} onComplete={completeQuest} /><div className="grid gap-3">{others.map(q => <QuestCard key={q.id} quest={q} onComplete={completeQuest} />)}</div></div></section>
    <section className="kingdom-section grid gap-5 xl:grid-cols-[1.55fr_.75fr]"><JourneyPath /><DailyChest completed={completed} total={quests.length} /></section>
    <section className="kingdom-section"><MerchantPreview /></section>
    <AnimatePresence>{reward && <motion.div initial={{ opacity: 0, y: 30, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="reward-toast"><motion.div animate={{ rotate: [0, 12, -12, 0] }} className="reward-toast-icon"><Sparkles size={23} /></motion.div><div className="min-w-0 flex-1"><p className="eyebrow">Missão concluída</p><p className="truncate font-display text-sm font-bold text-parchment">{reward.name}</p><p className="text-xs text-mist">+{reward.xp} XP · +{reward.gold} ouro</p></div><button onClick={() => setReward(null)}><X size={17} /></button></motion.div>}</AnimatePresence>
  </main> }
