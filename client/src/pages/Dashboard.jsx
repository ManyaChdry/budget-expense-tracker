import React, { useEffect, useState } from 'react'
import { get, post, patch } from '../api.js'

export default function Dashboard({ month, setMonth }) {
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ Category: '', expenseName: '', expense: '', date: new Date().toISOString().slice(0,10) })
  const [toast, setToast] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [editingId, setEditingId] = useState(null)

  const loadBase = async () => {
    setCategories(await get('/categories'))
  }
  useEffect(() => { loadBase() }, [])

  useEffect(() => {
    (async () => {
      const rows = await get(`/expenses?month=${month}`)
      setExpenses(Array.isArray(rows) ? rows : [])
    })()
  }, [month])

  const saveExpense = async () => {
    const payload = { ...form, expense: Number(form.expense), date: form.date }
    const r = editingId ? await patch(`/expenses/${editingId}`, payload) : await post('/expenses', payload)
    setShowForm(false)
    setEditingId(null)
    if (typeof r?.withinBudget === 'boolean') {
      setToast(r.withinBudget ? 'Within budget' : 'Over budget')
      setTimeout(() => setToast(null), 2000)
    }
    const ex = await get(`/expenses?month=${month}`)
    setExpenses(Array.isArray(ex) ? ex : [])
  }

  const currentLabel = new Date(`${month}-01`).toLocaleString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div style={{ maxWidth: 640, margin: '16px auto', padding: '0 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{currentLabel}</h2>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{ marginLeft: 'auto' }} />
        <button onClick={() => setShowForm(true)}>Add Expense</button>
      </div>

      <h3 style={{ margin: '16px 0 8px' }}>Expenses</h3>
      <div>
        {expenses.length === 0 && <div style={{ color:'#777' }}>No expenses for this month</div>}
        {expenses.map(e => {
          const cat = e.categoryId && typeof e.categoryId === 'object' ? e.categoryId : categories.find(c => c._id === e.categoryId)
          return (
            <div key={e._id} style={{ display:'grid', gridTemplateColumns:'1fr 2fr 1fr 1fr auto', gap:8, borderBottom:'1px solid #eee', padding:'6px 0' }}>
              <div>{e.date?.slice(0,10)}</div>
              <div>{e.expenseName}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {cat && <div style={{ width:12, height:12, borderRadius:6, background:cat.colorHex }} />}
                <span>{cat?.name || 'Uncategorized'}</span>
              </div>
              <div style={{ textAlign:'right' }}>₹{Number(e.amount).toFixed(2)}</div>
              <button onClick={() => { setEditingId(e._id); setShowForm(true); setForm({ Category: (e.categoryId?._id ?? e.categoryId ?? ''), expenseName: e.expenseName || '', expense: String(e.amount ?? ''), date: (e.date || new Date().toISOString().slice(0,10)).slice(0,10) }) }}>Edit</button>
            </div>
          )
        })}
      </div>
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, minWidth: 320 }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Expense' : 'Add Expense'}</h3>
            <select value={form.Category} onChange={e=>setForm(f=>({ ...f, Category: e.target.value }))} style={{ width: '100%', marginBottom: 8 }}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input placeholder="Name" value={form.expenseName} onChange={e=>setForm(f=>({ ...f, expenseName: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
            <input type="number" placeholder="Amount" value={form.expense} onChange={e=>setForm(f=>({ ...f, expense: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
            <input type="date" value={form.date} onChange={e=>setForm(f=>({ ...f, date: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveExpense} disabled={!form.Category || !form.expense}>Save</button>
              <button onClick={() => { setShowForm(false); setEditingId(null) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div style={{ position: 'fixed', bottom: 72, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: toast.includes('Over') ? '#d22' : '#2a7', color: '#fff', padding: '8px 12px', borderRadius: 6 }}>{toast}</span>
      </div>}
    </div>
  )
}