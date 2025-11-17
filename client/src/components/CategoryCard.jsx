import React from "react";
export default function CategoryCard({ name, colorHex, spent, limit }) {
  const ratio = limit > 0 ? Math.min(spent / limit, 1) : 0;
  const remaining = limit - spent;
  const over = remaining < 0;
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: colorHex,
          }}
        />
        <div style={{ fontWeight: 600 }}>{name}</div>
        {over && (
          <span
            style={{
              marginLeft: "auto",
              color: "#fff",
              background: "#d22",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            OVER BUDGET
          </span>
        )}
      </div>
      <div
        style={{ height: 8, background: "#eee", borderRadius: 4, marginTop: 8 }}
      >
        <div
          style={{
            width: `${ratio * 100}%`,
            height: 8,
            background: over ? "#d22" : "#2a7",
            borderRadius: 4,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <div>
          ₹{spent.toFixed(2)} / ₹{limit.toFixed(2)}
        </div>
        <div>
          {over
            ? `Over by ₹${Math.abs(remaining).toFixed(2)}`
            : `Remaining ₹${remaining.toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}
