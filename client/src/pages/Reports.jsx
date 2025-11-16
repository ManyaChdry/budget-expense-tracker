import React, { useEffect, useState } from 'react'
import { get } from '../api.js'
import CategoryCard from '../components/CategoryCard.jsx'

export default function Reports({ month, setMonth }) {
 const [report, setReport] = useState([])

 useEffect(() => {
    (async () => {
      const r = await get(`/reports/category-budget-report?month=${month}`)
      setReport(r)
    })()
  }, [month])

  return (
    <div style={{ maxWidth: 640, margin: '16px auto', padding: '0 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <h2 style={{ margin: 0 }}>Reports</h2>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{ marginLeft: 'auto' }} />
      </div>
      {report?.map(r => (
        <CategoryCard key={r.categoryId} name={r.name} colorHex={r.colorHex} spent={r.spent} limit={r.budget} />
      ))}
    </div>
  )
}