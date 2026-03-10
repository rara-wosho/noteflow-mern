import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from "react-router";
import Sidebar from './components/Sidebar.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Sidebar />
      <div className="ml-60">
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>,
)
