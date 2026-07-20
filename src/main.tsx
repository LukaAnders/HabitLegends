import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { PlayerProvider } from './contexts/PlayerProvider'
import './styles.css'
import './achievements.css'
import './journal.css'
import './daily-reward.css'
import './avatar-composer.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </AuthProvider>
  </React.StrictMode>,
)
