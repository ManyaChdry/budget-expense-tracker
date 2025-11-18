import React, { useState } from 'react'
import { post } from '../api.js'

export default function AuthPage({ onSuccess, mode = 'login' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const submit = async () => {
    const path = mode === 'login' ? '/auth/login' : '/auth/sign-up'
    const r = await post(path, { email, password })
    if (r.accessToken) {
      localStorage.setItem('accessToken', r.accessToken)
      localStorage.setItem('refreshToken', r.refreshToken)
      onSuccess?.()
    }
  }
  return (
    <div className="auth-backdrop">
      {mode==='login' && (
        <div className="auth-message">Hi! Login to track your expenses 😊</div>
      )}
      <div className="auth-dialog">
        {mode==='signup' && <div className="auth-heading">Welcome!</div>}
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <div className="input-wrap">
          <input className="password-input" type={showPassword ? 'text' : 'password'} placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="button" className="toggle-eye" onClick={()=>setShowPassword(s=>!s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M2 2l20 20"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        <button className="submit-btn" onClick={submit}>{mode==='login'?'Log In':'Sign Up'}</button>
      </div>
      {mode==='signup' && (
        <div className="auth-message">Please sign up to start your financial journey with us 😊</div>
      )}
    </div>
  )
}