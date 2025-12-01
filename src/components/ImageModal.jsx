// frontend/src/components/ImageModal.jsx
"use client";
import React from "react";

export default function ImageModal({ src, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="max-w-3xl w-full p-4">
        <img src={src} alt="preview" className="w-full object-contain rounded shadow-lg" />
      </div>
    </div>
  );
}
