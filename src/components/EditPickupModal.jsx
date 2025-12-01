// frontend/src/components/EditPickupModal.jsx
"use client";
import React, { useState } from "react";

export default function EditPickupModal({ pickup, onClose, onSave }) {
  const [category, setCategory] = useState(pickup.category || "DRY");
  const [weight, setWeight] = useState(pickup.weight || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState({
    lat: pickup.latitude || pickup.location?.lat,
    lng: pickup.longitude || pickup.location?.lng,
    address: pickup.location?.address || ""
  });

  function handleFile(e) {
    const f = e.target.files[0];
    setPhotoFile(f);
  }

  function captureLocation() {
    navigator.geolocation.getCurrentPosition(p => {
      setLocation({ lat: p.coords.latitude, lng: p.coords.longitude, address: "Current location" });
    }, () => alert("Unable to get location"));
  }

  function save() {
    onSave(pickup.id, { category, weight, photoFile, location });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg max-w-xl w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Pickup</h3>
        <div className="space-y-3">
          <div>
            <label className="block mb-1">Category</label>
            <input value={category} onChange={e=>setCategory(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block mb-1">Weight</label>
            <input value={weight} onChange={e=>setWeight(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block mb-1">Replace Photo</label>
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>

          <div>
            <button onClick={captureLocation} className="bg-[#2563eb] text-white px-3 py-2 rounded">
              Capture Location
            </button>
            {location && <div className="text-sm mt-1">Lat: {location.lat}, Lng: {location.lng}</div>}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={save} className="px-4 py-2 bg-[#2563eb] text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
