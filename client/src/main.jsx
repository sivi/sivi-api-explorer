import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LandingPage from './components/landing/LandingPage.jsx'
import { AppProvider } from './context/AppContext.jsx'
import ErrorBoundary from './components/app/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/playground" element={<App />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
)
