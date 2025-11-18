import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Reports from './pages/Reports.jsx'
import CategoriesSettings from './pages/CategoriesSettings.jsx'
import BudgetsSettings from './pages/BudgetsSettings.jsx'

const Nav = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const logout = () => { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); navigate('/auth/login') }
  const onAuth = pathname.startsWith('/auth')
  const authToggleTo = pathname.includes('signup') ? '/auth/login' : '/auth/signup'
  const authToggleLabel = pathname.includes('signup') ? 'Login' : 'Sign Up'
  return (
    <nav className="nav">
      <div className="brand"><span className="brand-icon">💸</span>Budget Tracker</div>
      <div className="nav-items">
        {onAuth ? (
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={authToggleTo}>
            <span className="nav-icon">{pathname.includes('signup') ? '🔐' : '📝'}</span>{authToggleLabel}
          </NavLink>
        ) : (
          <>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/"><span className="nav-icon">📊</span>Dashboard</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/reports"><span className="nav-icon">📈</span>Reports</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/settings/categories"><span className="nav-icon">🗂️</span>Categories</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/settings/budgets"><span className="nav-icon">💼</span>Budgets</NavLink>
            <button className="nav-link nav-btn" onClick={logout}><span className="nav-icon">🚪</span>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('accessToken')
  return token ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  useEffect(() => {}, [month])
  return (
    <div className="app" style={{ paddingTop: 64 }}>

      <Routes>
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<AuthPage mode="login" onSuccess={() => navigate('/')} />} />
        <Route path="/auth/signup" element={<AuthPage mode="signup" onSuccess={() => navigate('/')} />} />
        <Route path="/" element={<RequireAuth><Dashboard month={month} setMonth={setMonth} /></RequireAuth>} />
        <Route path="/reports" element={<RequireAuth><Reports month={month} setMonth={setMonth} /></RequireAuth>} />
        <Route path="/settings/categories" element={<RequireAuth><CategoriesSettings /></RequireAuth>} />
        <Route path="/settings/budgets" element={<RequireAuth><BudgetsSettings month={month} /></RequireAuth>} />
      </Routes>
      <Nav />
    </div>
  )
}