import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './striver_clone.jsx'
import './index.css'  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
