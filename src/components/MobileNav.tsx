import { Castle, ScrollText, ShoppingBag, UserRound, Footprints } from 'lucide-react'
import { NavLink } from 'react-router-dom'
const items = [{ label: 'Reino', icon: Castle, path: '/' }, { label: 'Missões', icon: ScrollText, path: '/missoes' }, { label: 'Herói', icon: UserRound, path: '/heroi', hero: true }, { label: 'Jornada', icon: Footprints, path: '/jornada' }, { label: 'Mercado', icon: ShoppingBag, path: '/mercado' }]
export function MobileGameNavigation() { return <nav className="mobile-game-nav">{items.map(({ label, icon: Icon, path, hero }) => <NavLink key={label} to={path} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''} ${hero ? 'hero-link' : ''}`}><span><Icon size={hero ? 25 : 20} /></span><small>{label}</small></NavLink>)}</nav> }
export const MobileNav = MobileGameNavigation
