import { ChevronRight, type LucideIcon } from 'lucide-react'

export function SectionTitle({ icon: Icon, title, subtitle, action }: { icon: LucideIcon; title: string; subtitle?: string; action?: string }) {
  return <div className="mb-4 flex items-end justify-between gap-4"><div><div className="flex items-center gap-2"><Icon className="text-gold" size={20} /><h2 className="font-display text-lg font-bold text-ivory sm:text-xl">{title}</h2></div>{subtitle && <p className="mt-1 text-xs text-muted sm:text-sm">{subtitle}</p>}</div>{action && <button className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gold transition hover:text-amber-300 sm:text-sm">{action}<ChevronRight size={16} /></button>}</div>
}
