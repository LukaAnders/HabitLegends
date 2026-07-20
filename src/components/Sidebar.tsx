import { motion } from 'framer-motion'
import { Crown, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigation } from '../data/gameData'

export function GameSidebar() { return <aside className="game-sidebar"><div className="brand-crest"><div className="crest-icon"><Crown size={24} /></div><div><p className="font-display text-lg font-bold tracking-wider text-parchment">Habit</p><p className="-mt-1 text-[9px] font-bold tracking-[.36em] text-gold">LEGENDS</p></div></div><div className="ornament"><span>✦</span></div><nav className="flex flex-1 flex-col gap-1">{navigation.map(({ label, icon: Icon, path }, index) => <motion.div key={label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .04 }}><NavLink to={path} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><Icon size={21} /><span>{label}</span></NavLink></motion.div>)}</nav><div className="ornament"><span>◇</span></div><button className="sidebar-link text-mist hover:text-red-300"><LogOut size={19} /> Sair do reino</button></aside> }
export const Sidebar = GameSidebar
