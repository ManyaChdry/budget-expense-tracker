import React, { useEffect, useState } from 'react'
import { get, post, patch, del } from '../api.js'

export default function BudgetsSettings({ month }) {
  const [categories, setCategories] = useState([])
  const [rows, setRows] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAmount, setEditAmount] = useState('')
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

  const openEdit = (c) => {
    setEditingId(c._id)
    setEditName(c.name || '')
    const row = map.get(c._id)
    setEditAmount(row?.amount != null ? String(row.amount) : '')
    setShowEdit(true)
  }
  const saveEdit = async () => {
    if (!editingId) return
    const row = map.get(editingId)
    const cat = categories.find(x => x._id === editingId)
    if (cat && editName !== cat.name) {
      await patch(`/categories/${editingId}`, { name: editName })
    }
    if (editAmount !== '') {
      const amt = Number(editAmount)
      if (row) {
        await patch(`/budgets/${row._id}`, { amount: amt })
      } else {
        await post('/budgets', { categoryId: editingId, month, amount: amt })
      }
    }
    setCategories(await get('/categories'))
    setRows(await get(`/budgets?month=${month}`))
    setShowEdit(false)
    setEditingId(null)
    setEditName('')
    setEditAmount('')
  }

  return (
    <div className="container page-fill">
      <h2>Budgets</h2>
      <div className="dialog">
        <table className="table">
          <thead>
            <tr><th>Category</th><th>Budget</th><th></th></tr>
          </thead>
          <tbody>
            {categories.map(c => {
              const row = map.get(c._id)
              return (
                <tr key={c._id}>
                  <td><span style={{ display:'inline-flex', alignItems:'center', gap:8 }}><span className="dot" style={{ background:c.colorHex }}></span>{c.name}</span></td>
                  <td>{row?.amount ?? ''}</td>
                  <td><div className="actions"><button className="btn-outline" onClick={()=>openEdit(c)}>Edit</button>{row && <button className="btn-outline" onClick={()=>remove(row._id)}>Remove</button>}</div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {showEdit && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Category</h3>
            <div className="form-stack">
              <input placeholder="Name" value={editName} onChange={e=>setEditName(e.target.value)} />
              <input type="text" placeholder="Budget" value={editAmount} onChange={e=>setEditAmount(e.target.value)} />
            </div>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <button onClick={saveEdit}>Save</button>
              <button className="btn-outline" onClick={()=>{ setShowEdit(false); setEditingId(null) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}