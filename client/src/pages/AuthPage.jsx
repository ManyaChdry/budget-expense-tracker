import React, { useState } from 'react'
import { post } from '../api.js'

export default function AuthPage({ onSuccess }) {
  const [tab, setTab] = useState('login')
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const submit = async () => {
    const path = tab === 'login' ? '/auth/login' : '/auth/sign-up'
    const r = await post(path, { Email, Password })
    if (r.accessToken) {
      localStorage.setItem('accessToken', r.accessToken)
      localStorage.setItem('refreshToken', r.refreshToken)
      onSuccess?.()
    }
  }
  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab('login')} disabled={tab==='login'}>Log In</button>
        <button onClick={() => setTab('signup')} disabled={tab==='signup'}>Sign Up</button>
      </div>
      <input placeholder="Email" value={Email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
      <input type="password" placeholder="Password" value={Password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
      <button onClick={submit} style={{ width: '100%' }}>{tab==='login'?'Log In':'Sign Up'}</button>
    </div>
  )
}