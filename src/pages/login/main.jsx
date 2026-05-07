import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../styles.css'
import AppLogin from './AppLogin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppLogin />
  </StrictMode>,
)
