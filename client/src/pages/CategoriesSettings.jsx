import React, { useEffect, useState } from 'react'
import { get, post, patch, del } from '../api.js'

export default function CategoriesSettings() {
  const [rows, setRows] = useState([])
  const [name, setName] = useState('')
  const [colorHex, setColorHex] = useState('#4a90e2')
  const load = async () => setRows(await get('/categories'))
  useEffect(() => { load() }, [])
  const add = async () => { await post('/categories', { name, colorHex }); setName(''); load() }
  const update = async (id, data) => { await patch(`/categories/${id}`, data); load() }
  const remove = async (id) => { await del(`/categories/${id}`); load() }
  return (
    <div style={{ maxWidth: 640, margin: '16px auto', padding: '0 12px' }}>
      <h2>Categories</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input type="color" value={colorHex} onChange={e=>setColorHex(e.target.value)} />
        <button onClick={add} disabled={!name}>Add</button>
      </div>
      {rows.map(r => (
        <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #eee', padding: '8px 0' }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: r.colorHex }} />
          <input defaultValue={r.name} onBlur={e=>update(r._id, { name: e.target.value })} />
          <input type="color" defaultValue={r.colorHex} onBlur={e=>update(r._id, { colorHex: e.target.value })} />
          <button style={{ marginLeft: 'auto' }} onClick={()=>remove(r._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}