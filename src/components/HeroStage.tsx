import { motion } from 'framer-motion'
import { Backpack, Paintbrush, Shield, Sword } from 'lucide-react'
import { hero } from '../data/gameData'
import { LevelBadge, XpBar } from './GamePrimitives'

const particles = Array.from({ length: 14 }, (_, i) => ({ left: `${8 + (i * 37) % 84}%`, top: `${12 + (i * 29) % 70}%`, delay: i * .28, size: i % 3 + 2 }))

export function HeroStage({ bonusXp = 0 }: { bonusXp?: number }) {
  return <motion.section initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} className="hero-stage">
    <div className="sky-glow" /><div className="moon" /><div className="mountains mountain-back" /><div className="mountains mountain-front" />
    <div className="castle-silhouette"><i /><i /><i /></div><div className="ground-haze" />
    {particles.map((p, i) => <motion.span key={i} className="absolute z-[2] rounded-full bg-amber-200" style={{ left: p.left, top: p.top, width: p.size, height: p.size }} animate={{ y: [0, -13, 0], opacity: [.15, .8, .15] }} transition={{ duration: 3.6 + i % 4, delay: p.delay, repeat: Infinity }} />)}
    <div className="relative z-10 grid min-h-[530px] grid-cols-1 items-end lg:grid-cols-[minmax(240px,.75fr)_minmax(360px,1fr)_minmax(240px,.75fr)]">
      <div className="order-2 p-5 text-center lg:order-1 lg:self-center lg:p-8 lg:text-left">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.35em] text-gold">Personagem atual</p>
        <h1 className="font-display text-3xl font-bold text-parchment sm:text-4xl">{hero.characterName}</h1>
        <p className="mt-1 font-display text-sm text-amber-200/80">{hero.title}</p>
        <div className="mx-auto mt-5 max-w-sm lg:mx-0"><XpBar value={hero.xp + bonusXp} max={hero.nextLevelXp} /></div>
        <div className="mt-5 flex justify-center gap-2 lg:justify-start"><button className="game-action"><Backpack size={17} /> Inventário</button><button className="game-action"><Paintbrush size={17} /> Aparência</button></div>
      </div>
      <div className="order-1 flex min-h-[340px] items-end justify-center lg:order-2 lg:min-h-[510px]">
        <div className="hero-aura" />
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} className="hero-character">
          <div className="hero-cape" /><div className="hero-head"><div className="hero-hair" /><span className="hero-eye left" /><span className="hero-eye right" /></div>
          <div className="hero-body"><Shield className="hero-emblem" size={33} /><div className="hero-belt" /></div>
          <div className="hero-arm left" /><div className="hero-arm right"><Sword className="hero-sword" size={105} strokeWidth={1.2} /></div><div className="hero-leg left" /><div className="hero-leg right" />
        </motion.div>
        <div className="absolute bottom-3 z-30"><LevelBadge level={hero.level} /></div>
      </div>
      <div className="order-3 hidden self-center justify-self-end p-8 lg:block"><div className="lore-plaque"><span className="text-gold">✦</span><p>“A disciplina transforma os pequenos atos em grandes lendas.”</p></div></div>
    </div>
    <div className="stage-vignette" />
  </motion.section>
}
