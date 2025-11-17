import React, { useEffect, useState } from "react";
import { get } from "../api.js";
import CategoryCard from "../components/CategoryCard.jsx";

export default function Reports({ month, setMonth }) {
  const [report, setReport] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await get(`/reports/category-budget-report?month=${month}`);
      setReport(r);
    })();
  }, [month]);

  return (
    <div className="container page-fill">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h2 style={{ margin: 0 }}>Reports</h2>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ marginLeft: "auto" }}
        />
      </div>
      <div
        style={{
          width: "80%",
        }}
      >
        {report?.map((r) => (
          <CategoryCard
            key={r.categoryId}
            name={r.name}
            colorHex={r.colorHex}
            spent={r.spent}
            limit={r.budget}
          />
        ))}
      </div>
    </div>
  );
}
