import React, { useState } from 'react'
import { post } from '../api.js'

export default function AuthPage({ onSuccess }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = async () => {
    const path = tab === 'login' ? '/auth/login' : '/auth/sign-up'
    const r = await post(path, { email, password })
    if (r.accessToken) {
      localStorage.setItem('accessToken', r.accessToken)
      localStorage.setItem('refreshToken', r.refreshToken)
      onSuccess?.()
    }
  }
  return (
    <div className="auth-backdrop">
      <div className="auth-dialog">
        <h3>{tab==='login' ? 'Welcome back' : 'Create account'}</h3>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          <button className="btn-outline" onClick={() => setTab('login')} disabled={tab==='login'}>Log In</button>
          <button className="btn-outline" onClick={() => setTab('signup')} disabled={tab==='signup'}>Sign Up</button>
        </div>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={submit}>{tab==='login'?'Log In':'Sign Up'}</button>
      </div>
    </div>
  )
}