import { useState, type FormEvent } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { requestPasswordReset } from '../services/authService'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'

export function ForgotPasswordPage() { const [email, setEmail] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null); const [sent, setSent] = useState(false); async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(null); try { await requestPasswordReset(email); setSent(true) } catch (cause) { setError(getFriendlyFirebaseError(cause)) } finally { setLoading(false) } }
  return <AuthLayout eyebrow="Runas de recuperação" title="Recupere seu acesso" subtitle="Enviaremos um pergaminho de recuperação para seu e-mail.">{sent ? <div className="auth-success"><Mail size={27} /><h2>Mensagem enviada</h2><p>Confira sua caixa de entrada e também a pasta de spam.</p></div> : <form onSubmit={submit} className="auth-form"><label>E-mail<div className="auth-input"><Mail size={17} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="aventureiro@email.com" required autoComplete="email" /></div></label>{error && <p role="alert" className="auth-error">{error}</p>}<button disabled={loading} className="auth-submit">{loading ? 'Enviando pergaminho...' : 'Enviar recuperação'}</button></form>}<p className="auth-footer"><Link to="/login" className="inline-flex items-center gap-1"><ArrowLeft size={14} /> Voltar ao portal</Link></p></AuthLayout> }
