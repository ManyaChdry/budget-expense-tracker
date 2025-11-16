const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const authHeader = () => {
  const t = localStorage.getItem('accessToken')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export const post = async (path, body) => {
  const r = await fetch(`${base}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(body) })
  return r.json()
}
export const get = async (path) => {
  const r = await fetch(`${base}${path}`, { headers: { ...authHeader() } })
  return r.json()
}
export const patch = async (path, body) => {
  const r = await fetch(`${base}${path}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(body) })
  return r.json()
}
export const del = async (path) => {
  const r = await fetch(`${base}${path}`, { method: 'DELETE', headers: { ...authHeader() } })
  return r.json()
}