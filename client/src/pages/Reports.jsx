import React, { useEffect, useState } from 'react'
import { get } from '../api.js'

export default function Reports({ month, setMonth }) {
  const [rows, setRows] = useState([])
  useEffect(() => { (async () => setRows(await get(`/reports/category-budget-report?month=${month}`)))() }, [month])
  return (
    <div style={{ maxWidth: 640, margin: '16px auto', padding: '0 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <h2 style={{ margin: 0 }}>Reports</h2>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{ marginLeft: 'auto' }} />
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, fontWeight: 600, borderBottom:'1px solid #ddd', paddingBottom:6 }}>
          <div>Category</div><div>Spent</div><div>Budget</div><div>Remaining</div>
        </div>
        {rows.map(r => (
          <div key={r.categoryId} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, borderBottom:'1px solid #eee', padding:'6px 0' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:12, height:12, borderRadius:6, background:r.colorHex }} />
              {r.name}
            </div>
            <div>₹{r.spent.toFixed(2)}</div>
            <div>₹{r.budget.toFixed(2)}</div>
            <div style={{ color: r.remaining < 0 ? '#d22' : 'inherit' }}>₹{r.remaining.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}