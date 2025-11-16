import React, { useEffect, useState } from 'react'
import { get, post, patch, del } from '../api.js'

export default function BudgetsSettings({ month }) {
  const [categories, setCategories] = useState([])
  const [rows, setRows] = useState([])
  useEffect(() => { (async () => {
    setCategories(await get('/categories'))
    setRows(await get(`/budgets?month=${month}`))
  })() }, [month])

  const map = new Map(rows.map(r => [r.categoryId?._id || r.categoryId, r]))
  const setAmt = async (categoryId, amount) => {
    const row = map.get(categoryId)
    if (!row) {
      await post('/budgets', { categoryId, month, amount: Number(amount) })
      setRows(await get(`/budgets?month=${month}`))
    } else {
      await patch(`/budgets/${row._id}`, { amount: Number(amount) })
      setRows(await get(`/budgets?month=${month}`))
    }
  }
  const remove = async (id) => { await del(`/budgets/${id}`); setRows(await get(`/budgets?month=${month}`)) }

  return (
    <div style={{ maxWidth: 640, margin: '16px auto', padding: '0 12px' }}>
      <h2>Budgets</h2>
      {categories.map(c => {
        const row = map.get(c._id)
        return (
          <div key={c._id} style={{ display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid #eee', padding:'8px 0' }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: c.colorHex }} />
            <div style={{ flex: 1 }}>{c.name}</div>
            <input type="number" defaultValue={row?.amount || ''} onBlur={e=>setAmt(c._id, e.target.value)} />
            {row && <button onClick={()=>remove(row._id)}>Remove</button>}
          </div>
        )
      })}
    </div>
  )
}