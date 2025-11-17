import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "50%" }}
      >
        {children}
      </div>
    </div>
  );
}
