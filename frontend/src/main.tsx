import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './utils/i18n'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

const loadingEl = document.getElementById('loading-screen')
if (loadingEl) {
  loadingEl.classList.add('fade-out')
  setTimeout(() => loadingEl.remove(), 600)
}
