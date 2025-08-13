import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const loadingEl = document.getElementById('loading-screen')
if (loadingEl) {
  loadingEl.classList.add('fade-out')
  setTimeout(() => loadingEl.remove(), 600)
}
