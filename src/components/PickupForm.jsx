
import { useState } from "react";
import { WASTE_CATEGORIES } from "../utils/mockdata";

export default function PickupForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    category: "DRY",
    weight: "",
    photo: null,
  });

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: "Current Location",
        }),
      () =>
        setLocation({
          lat: 40.7128,
          lng: -74.006,
          address: "Default Zone",
        })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ ...formData, location });
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 text-gray-950">
      <h2 className="text-xl font-bold mb-4">Submit Waste Pickup</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          >
            {WASTE_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-semibold">Weight (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
            className="w-full border p-2 rounded mt-1 placeholder-gray-900"
            placeholder="Enter weight"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold">Upload Photo</label>

          <label className="w-full border rounded p-3 mt-1 flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100">
            <span>{formData.photo ? "Change Image" : "Choose Image"}</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>

          {formData.photo && (
            <img src={formData.photo} className="mt-2 h-24 rounded border object-cover" />
          )}
        </div>

        {/* Location */}
        <button
          onClick={getLocation}
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {location ? "✓ Location Captured" : "Capture Location"}
        </button>

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Pickup"}
        </button>
      </form>
    </div>
  );
}
