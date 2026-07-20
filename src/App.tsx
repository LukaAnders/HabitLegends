import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { MobileNav } from './components/MobileNav'
import { Sidebar } from './components/Sidebar'
import { Kingdom } from './pages/Kingdom'

function Placeholder() {
  return <div className="grid min-h-[70vh] place-items-center px-6 text-center"><div><p className="font-display text-2xl text-ivory">Região ainda inexplorada</p><p className="mt-2 text-sm text-muted">Esta área será revelada em uma próxima jornada.</p></div></div>
}

export default function App() {
  return <BrowserRouter><div className="min-h-screen bg-ink text-ivory"><Sidebar /><div className="lg:pl-[232px]"><Header /><Routes><Route path="/" element={<Kingdom />} /><Route path="/missoes" element={<Placeholder />} /><Route path="/jornada" element={<Placeholder />} /><Route path="/heroi" element={<Placeholder />} /><Route path="/inventario" element={<Placeholder />} /><Route path="/mercado" element={<Placeholder />} /><Route path="/conquistas" element={<Placeholder />} /><Route path="/diario" element={<Placeholder />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></div><MobileNav /></div></BrowserRouter>
}
