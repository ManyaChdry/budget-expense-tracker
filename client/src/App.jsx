import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Reports from './pages/Reports.jsx'
import CategoriesSettings from './pages/CategoriesSettings.jsx'
import BudgetsSettings from './pages/BudgetsSettings.jsx'

const Nav = () => (
  <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', gap: 12, padding: 12, borderTop: '1px solid #ddd', background: '#fff', justifyContent: 'space-around' }}>
    <Link to="/">Dashboard</Link>
    <Link to="/reports">Reports</Link>
    <Link to="/settings/categories">Categories</Link>
    <Link to="/settings/budgets">Budgets</Link>
  </nav>
)

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('accessToken')
  return token ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  useEffect(() => {}, [month])
  return (
    <div style={{ paddingBottom: 64 }}>
      <Routes>
        <Route path="/auth" element={<AuthPage onSuccess={() => navigate('/')} />} />
        <Route path="/" element={<RequireAuth><Dashboard month={month} setMonth={setMonth} /></RequireAuth>} />
        <Route path="/reports" element={<RequireAuth><Reports month={month} setMonth={setMonth} /></RequireAuth>} />
        <Route path="/settings/categories" element={<RequireAuth><CategoriesSettings /></RequireAuth>} />
        <Route path="/settings/budgets" element={<RequireAuth><BudgetsSettings month={month} /></RequireAuth>} />
      </Routes>
      <Nav />
    </div>
  )
}