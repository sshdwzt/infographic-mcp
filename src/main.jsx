import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Payment from './pages/Payment'
import Dashboard from './pages/Dashboard'
import AIEngine from './pages/AIEngine'
import Workspace from './pages/Workspace'
import Reports from './pages/Reports'
import BigScreen from './pages/BigScreen'
import DemoLayout from './components/demo/DemoLayout'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/bigscreen" element={<BigScreen />} />
          <Route path="/demo" element={<DemoLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ai-engine" element={<AIEngine />} />
            <Route path="workspace" element={<Workspace />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
)
