import { StrictMode } from 'react'
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <App />
  </BrowserRouter>
    
  
)
