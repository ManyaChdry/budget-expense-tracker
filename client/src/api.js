const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const authHeader = () => {
  const t = localStorage.getItem('accessToken')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

const refreshAccessToken = async () => {
  const rt = localStorage.getItem('refreshToken')
  if (!rt) return null
  try {
    const r = await fetch(`${base}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: rt }) })
    if (!r.ok) return null
    const data = await r.json()
    if (data.accessToken) localStorage.setItem('accessToken', data.accessToken)
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
    return data.accessToken || null
  } catch {
    return null
  }
}

const request = async (path, init = {}) => {
  const first = await fetch(`${base}${path}`, { ...init, headers: { ...(init.headers || {}), ...authHeader() } })
  if (first.status === 401) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      const second = await fetch(`${base}${path}`, { ...init, headers: { ...(init.headers || {}), Authorization: `Bearer ${newAccess}` } })
      return second.json()
    } else {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
  return first.json()
}

export const post = async (path, body) => {
  return request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}
export const get = async (path) => {
  return request(path)
}
export const patch = async (path, body) => {
  return request(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}
export const del = async (path) => {
  return request(path, { method: 'DELETE' })
}