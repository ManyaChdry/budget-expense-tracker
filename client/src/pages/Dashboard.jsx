import React, { useEffect, useState } from 'react'
import { get, post } from '../api.js'
import CategoryCard from '../components/CategoryCard.jsx'

export default function Dashboard({ month, setMonth }) {
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ Category: '', expenseName: '', expense: '', date: new Date().toISOString().slice(0,10) })
  const [toast, setToast] = useState(null)
  const [report, setReport] = useState([])
  const [expenses, setExpenses] = useState([])

  const loadBase = async () => {
    setCategories(await get('/categories'))
  }
  useEffect(() => { loadBase() }, [])
  useEffect(() => {
    (async () => {
      const r = await get(`/reports/category-budget-report?month=${month}`)
      setReport(r)
    })()
  }, [month])

  useEffect(() => {
    (async () => {
      const rows = await get(`/expenses?month=${month}`)
      setExpenses(Array.isArray(rows) ? rows : [])
    })()
  }, [month])

  const saveExpense = async () => {
    const r = await post('/expenses', { ...form, expense: Number(form.expense), date: form.date })
    setShowForm(false)
    setToast(r.withinBudget ? 'Within budget' : 'Over budget')
    setTimeout(() => setToast(null), 2000)
    const rep = await get(`/reports/category-budget-report?month=${month}`)
    setReport(rep)
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
      {report.map(r => (
        <CategoryCard key={r.categoryId} name={r.name} colorHex={r.colorHex} spent={r.spent} limit={r.budget} />
      ))}

      <h3 style={{ margin: '16px 0 8px' }}>Expenses</h3>
      <div>
        {expenses.length === 0 && <div style={{ color:'#777' }}>No expenses for this month</div>}
        {expenses.map(e => {
          return (
            <div key={e._id} style={{ display:'grid', gridTemplateColumns:'1fr 2fr 1fr 1fr', gap:8, borderBottom:'1px solid #eee', padding:'6px 0' }}>
              <div>{e.date?.slice(0,10)}</div>
              <div>{e.expenseName}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {e.categoryId && <div style={{ width:12, height:12, borderRadius:6, background:e.categoryId.colorHex }} />}
                <span>{e.categoryId?.name || 'Uncategorized'}</span>
              </div>
              <div style={{ textAlign:'right' }}>₹{Number(e.amount).toFixed(2)}</div>
            </div>
          )
        })}
      </div>
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, minWidth: 320 }}>
            <h3 style={{ marginTop: 0 }}>Add Expense</h3>
            <select value={form.Category} onChange={e=>setForm(f=>({ ...f, Category: e.target.value }))} style={{ width: '100%', marginBottom: 8 }}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input placeholder="Name" value={form.expenseName} onChange={e=>setForm(f=>({ ...f, expenseName: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
            <input type="number" placeholder="Amount" value={form.expense} onChange={e=>setForm(f=>({ ...f, expense: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
            <input type="date" value={form.date} onChange={e=>setForm(f=>({ ...f, date: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveExpense} disabled={!form.Category || !form.expense}>Save</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
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