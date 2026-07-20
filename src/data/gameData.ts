import {
  BookOpen, Brain, Castle, Dumbbell, Flame, Footprints, Gem,
  Medal, Package, ScrollText, ShoppingBag, Sparkles, Sword, Target, Trophy,
  UserRound, type LucideIcon,
} from 'lucide-react'

export type Rarity = 'Comum' | 'Raro' | 'Épico' | 'Lendário'
export type QuestState = 'Disponível' | 'Em andamento' | 'Concluída'
export type JourneyState = 'completed' | 'active' | 'locked'
export interface NavItem { label: string; icon: LucideIcon; path: string }
export interface Quest { id: number; name: string; description: string; category: string; difficulty: Rarity; xp: number; gold: number; icon: LucideIcon; state: QuestState; featured?: boolean; completed?: boolean }
export interface MarketItem { id: number; name: string; type: string; rarity: Rarity; price: number; icon: LucideIcon; accent: string; level?: number }
export interface JourneyNode { name: string; subtitle: string; state: JourneyState; icon: LucideIcon }

export const navigation: NavItem[] = [
  { label: 'Reino', icon: Castle, path: '/' }, { label: 'Missões', icon: ScrollText, path: '/missoes' },
  { label: 'Jornada', icon: Footprints, path: '/jornada' }, { label: 'Herói', icon: UserRound, path: '/heroi' },
  { label: 'Inventário', icon: Package, path: '/inventario' }, { label: 'Mercado', icon: ShoppingBag, path: '/mercado' },
  { label: 'Conquistas', icon: Trophy, path: '/conquistas' }, { label: 'Diário', icon: BookOpen, path: '/diario' },
]

export const hero = { userName: 'Luka', characterName: 'Aerendil', title: 'Guardião do Alvorecer', level: 12, xp: 2840, nextLevelXp: 3500, gold: 1280, streak: 14 }

export const quests: Quest[] = [
  { id: 3, name: 'Crônicas do Conhecimento', description: 'Estude por uma hora e fortaleça sua inteligência.', category: 'Estudos', difficulty: 'Épico', xp: 150, gold: 60, icon: BookOpen, state: 'Disponível', featured: true },
  { id: 1, name: 'Ritual do Despertar', description: 'Comece o dia com intenção e energia.', category: 'Bem-estar', difficulty: 'Comum', xp: 40, gold: 15, icon: Flame, state: 'Disponível' },
  { id: 2, name: 'Forje Corpo e Mente', description: 'Treine por pelo menos trinta minutos.', category: 'Exercício', difficulty: 'Raro', xp: 90, gold: 35, icon: Dumbbell, state: 'Em andamento' },
  { id: 4, name: 'A Hora Inabalável', description: 'Complete uma sessão de foco profundo.', category: 'Foco', difficulty: 'Lendário', xp: 250, gold: 100, icon: Target, state: 'Disponível' },
]

export const journey: JourneyNode[] = [
  { name: 'Vila dos Iniciantes', subtitle: 'Capítulo I', state: 'completed', icon: Castle },
  { name: 'Floresta da Disciplina', subtitle: 'Capítulo II', state: 'completed', icon: Footprints },
  { name: 'Montanhas da Persistência', subtitle: 'Você está aqui', state: 'active', icon: Trophy },
  { name: 'Templo do Foco', subtitle: 'Nível 15', state: 'locked', icon: Brain },
  { name: 'Castelo das Lendas', subtitle: 'Nível 25', state: 'locked', icon: Sparkles },
]

export const marketItems: MarketItem[] = [
  { id: 1, name: 'Espada Solar', type: 'Arma', rarity: 'Lendário', price: 850, icon: Sword, accent: '#F2B84B' },
  { id: 2, name: 'Orbe do Oráculo', type: 'Relíquia', rarity: 'Épico', price: 620, icon: Gem, accent: '#A855F7' },
  { id: 3, name: 'Medalhão Silvestre', type: 'Amuleto', rarity: 'Raro', price: 340, icon: Medal, accent: '#3B82F6', level: 14 },
]

export const rarity = {
  Comum: { text: 'text-emerald-300', border: 'border-emerald-500/45', bg: 'bg-emerald-500/10', glow: 'rgba(34,197,94,.2)' },
  Raro: { text: 'text-blue-300', border: 'border-blue-500/45', bg: 'bg-blue-500/10', glow: 'rgba(59,130,246,.22)' },
  Épico: { text: 'text-purple-300', border: 'border-purple-500/50', bg: 'bg-purple-500/10', glow: 'rgba(168,85,247,.25)' },
  Lendário: { text: 'text-amber-300', border: 'border-amber-400/50', bg: 'bg-amber-400/10', glow: 'rgba(242,184,75,.26)' },
} satisfies Record<Rarity, { text: string; border: string; bg: string; glow: string }>
