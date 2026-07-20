import { Crown, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

export function AuthLayout({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return <main className="auth-page"><div className="auth-moon" /><div className="auth-mountains" /><div className="auth-particles">{Array.from({ length: 10 }, (_, index) => <i key={index} style={{ left: `${8 + index * 9}%`, animationDelay: `${index * .35}s` }} />)}</div><section className="auth-panel"><div className="auth-crest"><Crown size={28} /></div><div className="text-center"><span className="eyebrow justify-center"><Sparkles size={13} />{eyebrow}</span><h1 className="mt-2 font-display text-3xl font-bold text-parchment">{title}</h1><p className="mx-auto mt-2 max-w-sm text-sm text-mist">{subtitle}</p></div>{children}</section></main>
}
