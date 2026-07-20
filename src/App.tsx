import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { MobileNav } from './components/MobileNav'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Sidebar } from './components/Sidebar'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { Kingdom } from './pages/Kingdom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { TasksPage } from './pages/TasksPage'
import { MarketPage } from './pages/MarketPage'
import { InventoryPage } from './pages/InventoryPage'
import { HeroPage } from './pages/HeroPage'

function GameLayout() { return <div className="min-h-screen bg-ink text-ivory"><Sidebar /><div className="lg:pl-[232px]"><Header /><Outlet /></div><MobileNav /></div> }
function Placeholder() { return <div className="grid min-h-[70vh] place-items-center px-6 text-center"><div><p className="font-display text-2xl text-ivory">Região ainda inexplorada</p><p className="mt-2 text-sm text-muted">Esta área será revelada em uma próxima jornada.</p></div></div> }

export default function App() { return <BrowserRouter><Routes>
  <Route path="/login" element={<LoginPage />} /><Route path="/cadastro" element={<RegisterPage />} /><Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
  <Route element={<ProtectedRoute />}><Route element={<GameLayout />}><Route path="/" element={<Kingdom />} /><Route path="/missoes" element={<TasksPage />} /><Route path="/jornada" element={<Placeholder />} /><Route path="/heroi" element={<HeroPage />} /><Route path="/inventario" element={<InventoryPage />} /><Route path="/mercado" element={<MarketPage />} /><Route path="/conquistas" element={<Placeholder />} /><Route path="/diario" element={<Placeholder />} /></Route></Route>
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes></BrowserRouter> }
