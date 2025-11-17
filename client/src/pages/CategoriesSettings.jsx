import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { get, post, patch, del } from "../api.js";

export default function CategoriesSettings() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [colorHex, setColorHex] = useState("#ffd1dc");
  const [colorPickerFor, setColorPickerFor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const pastels = [
    "#F8C8DC",
    "#F4A7BA",
    "#F7DDE2",
    "#F9C6C9",
    "#FFD6D6",
    "#F5B7B1",
    "#F7C1BB",
    "#F3A6A6",
    "#F7D1CF",
    "#FFEBEE",

    "#FFD8B1",
    "#FFE2C6",
    "#FBCDB0",
    "#FFCCB6",
    "#FFD4C2",
    "#F7BFA0",
    "#FAD4C0",
    "#FEE3D4",
    "#F9BA8F",
    "#FFE8DA",

    "#FFF9C4",
    "#FFF1A8",
    "#F8E6A0",
    "#F7EFCE",
    "#FFEDB3",
    "#FFF4CE",
    "#F2E6A7",
    "#FAEAB1",
    "#FBEED3",
    "#FFF7DA",

    "#D2E8D5",
    "#C8E6C9",
    "#D0F0C0",
    "#E3F9E5",
    "#CAE7C1",
    "#D8F5D1",
    "#DEF5E5",
    "#E0F7E9",
    "#CCF3DA",
    "#EAFBF1",

    "#D6EAF8",
    "#AEDFF7",
    "#C7EFFF",
    "#CCE7FF",
    "#D8F0FF",
    "#BEE3F8",
    "#CAE4F1",
    "#DAF4FF",
    "#B5DFF2",
    "#E1F7FF",

    "#E6DAF7",
    "#DCCFF5",
    "#E3D9FF",
    "#CEBFF4",
    "#E7D5FB",
    "#F0E1FF",
    "#D0C0E4",
    "#EADCF8",
    "#F3E8FF",
    "#D5C7EE",

    "#D4F4EC",
    "#CFF9EC",
    "#BAF2E9",
    "#D7FFF5",
    "#B7EFEA",
    "#C7F9F0",
    "#DFFEF7",
    "#CBF9E2",
    "#E3FFF8",
    "#E1F8F4",

    "#F2F2F2",
    "#EFEFEF",
    "#E8E8E8",
    "#F5F5F5",
    "#ECECEC",
    "#F8F5F2",
    "#EDE7E3",
    "#F7EFEA",
    "#E4E2DD",
    "#F6F4EE",

    "#E7D9C4",
    "#F2E4D5",
    "#EBDCCB",
    "#F4E8D5",
    "#F0E2CA",
    "#DECFBC",
    "#F9F0DF",
    "#E8DCCC",
    "#F7EBD8",
    "#ECD9C8",

    "#FFEFF7",
    "#FFF3F6",
    "#F4F9FF",
    "#EEF8F2",
    "#FFF7EE",
    "#F5EEFF",
    "#FFF0E8",
    "#F1FFF6",
    "#EAF1FF",
    "#FFF6FA",
  ];
  const load = async () => setRows(await get("/categories"));
  useEffect(() => {
    load();
  }, []);
  const add = async () => {
    await post("/categories", { name, colorHex });
    setName("");
    setColorHex("#ffd1dc");
    setShowAddModal(false);
    load();
  };
  const update = async (id, data) => {
    await patch(`/categories/${id}`, data);
    load();
  };
  const remove = async (id) => {
    await del(`/categories/${id}`);
    load();
  };
  return (
    <div className="container">
      <h2>Categories</h2>
      <button
        className="icon-btn"
        style={{ marginBottom: 16 }}
        onClick={() => setShowAddModal(true)}
      >
        + Add Category
      </button>
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <h3>Add Category</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="palette">
            {pastels.map((p) => (
              <button
                key={p}
                type="button"
                className="swatch"
                style={{
                  background: p,
                  border:
                    p === colorHex
                      ? "2px solid #333"
                      : "1px solid var(--border)",
                }}
                onClick={() => setColorHex(p)}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={add} disabled={!name}>
              Add
            </button>
            <button
              className="btn-outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      {rows.map((r) => (
        <div
          key={r._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid #eee",
            padding: "8px 0",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: r.colorHex,
            }}
          />
          <input
            defaultValue={r.name}
            onBlur={(e) => update(r._id, { name: e.target.value })}
          />
          <button
            className="btn-outline"
            onClick={() =>
              setColorPickerFor(colorPickerFor === r._id ? null : r._id)
            }
          >
            Change color
          </button>
          <Modal
            open={colorPickerFor === r._id}
            onClose={() => setColorPickerFor(null)}
          >
            <h3>Pick a color</h3>
            <div className="palette">
              {pastels.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="swatch"
                  style={{
                    background: p,
                    border:
                      p === r.colorHex
                        ? "2px solid #333"
                        : "1px solid var(--border)",
                  }}
                  onClick={() => {
                    update(r._id, { colorHex: p });
                    setColorPickerFor(null);
                  }}
                />
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                className="btn-outline"
                onClick={() => setColorPickerFor(null)}
              >
                Cancel
              </button>
            </div>
          </Modal>
          <button style={{ marginLeft: "auto" }} onClick={() => remove(r._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
