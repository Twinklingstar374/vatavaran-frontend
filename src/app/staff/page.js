"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api"; // axios instance

// CO2 factors per category (kg CO₂ per kg waste)
const CO2_FACTORS = { plastic: 1.7, green: 0.3, dry: 0.5 };

// Badge thresholds
const BADGE_THRESHOLDS = [10, 50, 100];

// Simple Popup Message
const MessageBox = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <p className="text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function StaffDashboard() {
  const [user, setUser] = useState(null); // name
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Submission states
  const [category, setCategory] = useState("plastic");
  const [weight, setWeight] = useState("");
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [co2Saved, setCo2Saved] = useState(0);
  const [badges, setBadges] = useState([]);
  const [pickups, setPickups] = useState([]);

  const navigate = (path) => (window.location.href = path);

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedName = localStorage.getItem("userName");

    if (!token || !savedRole || !savedName) {
      navigate("/login");
      return;
    }

    if (savedRole !== "STAFF") {
      navigate("/");
      return;
    }

    setUser(savedName);
    setRole(savedRole);
    setLoading(false);
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // LOCATION FUNCTION
  const handleLocation = () => {
    if (!navigator.geolocation) {
      return setMessage("Geolocation not supported.");
    }

    setMessage("Fetching location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMessage(
          `Location captured: ${pos.coords.latitude.toFixed(
            3
          )}, ${pos.coords.longitude.toFixed(3)}`
        );
      },
      (err) => {
        console.error(err);
        setMessage("Unable to get location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  };

  // IMAGE PICKER
  const handleImage = (e) => {
    if (e.target.files.length > 0) setImage(e.target.files[0]);
  };

  // SUBMIT PICKUP (Mock for now)
  const handleSubmitPickup = async () => {
    if (isSubmitting) return;

    const numericWeight = parseFloat(weight);

    if (!numericWeight || numericWeight <= 0)
      return setMessage("Enter a valid weight.");

    if (!location) return setMessage("Capture location first.");

    setIsSubmitting(true);

    const co2 = numericWeight * CO2_FACTORS[category];

    try {
      // 🚀 Future API call (you will integrate later)
      // const token = localStorage.getItem("token");
      // await api.post("/api/waste/submit", payload, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      await new Promise((resolve) => setTimeout(resolve, 1200)); // Mock delay

      // Update badges + pickups
      setCo2Saved((prev) => {
        const total = prev + co2;

        const newBadges = BADGE_THRESHOLDS.filter(
          (b) => total >= b && !badges.includes(`${b} kg CO₂ saved!`)
        ).map((b) => `${b} kg CO₂ saved!`);

        if (newBadges.length > 0) setBadges((p) => [...p, ...newBadges]);

        return total;
      });

      const newPickup = {
        id: Date.now(),
        category,
        weight: numericWeight,
        co2: co2.toFixed(2),
        timestamp: new Date().toISOString(),
        location: {
          lat: location.lat.toFixed(3),
          lng: location.lng.toFixed(3),
        },
        staffName: user,
        status: "Submitted (Mock)",
      };

      setPickups((prev) => [newPickup, ...prev]);
      setMessage(`Success! CO₂ saved: ${co2.toFixed(2)} kg`);

      setWeight("");
      setImage(null);
      setLocation(null);
    } catch (err) {
      setMessage("Failed to submit entry.");
    }

    setIsSubmitting(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-green-600">Checking login...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-green-50">
      <MessageBox message={message} onClose={() => setMessage("")} />

      {/* NAVBAR */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">VatavaranTrack</h1>
        <div className="flex items-center gap-3">
          <span>
            Hi, {user} ({role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-green-700 px-4 py-2 rounded-full"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto mt-10 p-4 grid md:grid-cols-3 gap-6">
        {/* SUBMIT FORM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Submit Waste Entry</h2>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="plastic">Plastic</option>
            <option value="green">Green</option>
            <option value="dry">Dry</option>
          </select>

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />

          <button
            onClick={handleLocation}
            className="bg-blue-500 text-white w-full py-2 rounded mb-3"
          >
            {location ? "Location Selected" : "Capture Location"}
          </button>

          {location && (
            <p className="text-sm text-gray-700 mb-3">
              {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
            </p>
          )}

          <input
            type="file"
            onChange={handleImage}
            className="w-full p-2 border rounded mb-3"
          />

          <button
            onClick={handleSubmitPickup}
            disabled={isSubmitting}
            className="bg-green-600 text-white w-full py-2 rounded"
          >
            {isSubmitting ? "Submitting..." : "Submit Entry"}
          </button>
        </div>

        {/* PICKUP HISTORY */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">My Recent Pickups</h2>

          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Category</th>
                <th className="p-2">Weight</th>
                <th className="p-2">CO₂ Saved</th>
                <th className="p-2">Location</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {pickups.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No records yet.
                  </td>
                </tr>
              ) : (
                pickups.map((p) => {
                  const d = new Date(p.timestamp);
                  return (
                    <tr key={p.id} className="border-b">
                      <td className="p-2">{d.toLocaleString()}</td>
                      <td className="p-2 capitalize">{p.category}</td>
                      <td className="p-2">{p.weight} kg</td>
                      <td className="p-2">{p.co2} kg</td>
                      <td className="p-2">
                        {p.location.lat}, {p.location.lng}
                      </td>
                      <td className="p-2 text-yellow-700">{p.status}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
