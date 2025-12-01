// frontend/src/components/PickupCard.jsx

"use client";

import { useState } from "react";
// Added props: isStaff, onEdit, onDelete, onPreviewImage
export default function PickupCard({ pickup, onApprove, onReject, isSupervisor, isStaff, onEdit, onDelete, onPreviewImage }) {
  const [showImage, setShowImage] = useState(false);

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  const isPending = pickup.status === "PENDING";
  const showSupervisorActions = isSupervisor && isPending;
  const showStaffActions = isStaff && isPending; // Logic for Staff Edit/Delete

  return (
    <>
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition text-black">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            {/* 🛑 Text color changed to black */}
            <h3 className="font-semibold text-lg text-black">{pickup.category}</h3> 
            {pickup.staffName && (
              // 🛑 Text color changed to black
              <p className="text-sm text-black">Staff: {pickup.staffName}</p> 
            )}
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[pickup.status]}`}
          >
            {pickup.status}
          </span>
        </div>

        {/* Details */}
        {/* 🛑 Text color changed to black */}
        <div className="space-y-1 text-sm text-black">
          <p><strong className="text-black">Weight:</strong> {pickup.weight} kg</p>
          <p><strong className="text-black">Time:</strong> {new Date(pickup.createdAt).toLocaleString()}</p>

          {pickup.location && (
            <p>
              <strong className="text-black">Location:</strong>{" "}
              {/* Assuming location has address field from handleEdit */}
              {pickup.location.address || "GPS Coordinates"} 
            </p>
          )}
        </div>

        {/* Thumbnail */}
        {pickup.imageUrl && (
          <img
            src={pickup.imageUrl}
            alt="pickup"
            onClick={() => onPreviewImage(pickup.imageUrl)} // Use prop for modal trigger
            className="mt-3 w-28 h-24 object-cover rounded cursor-pointer border"
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
            
            {/* 🛑 STAFF Edit / Delete Buttons (PENDING only) */}
            {showStaffActions && (
                <>
                    <button
                      onClick={() => onEdit(pickup)} // Pass pickup object for EditModal
                      className="flex-1 border border-gray-700 hover:bg-gray-100 text-black px-4 py-2 rounded-lg transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(pickup.id)} // Pass ID for Delete API
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm"
                    >
                      Delete
                    </button>
                </>
            )}

            {/* Supervisor Approve / Reject Buttons (PENDING only) */}
            {showSupervisorActions && (
                <>
                    <button
                      onClick={() => onApprove(pickup.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(pickup.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Reject
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Full Image Modal (You should use your ImageModal component here, 
          not inline code, but keeping your original structure for now) */}
      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-lg">
            <img src={pickup.imageUrl} className="w-full rounded" />
            <button
              onClick={() => setShowImage(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}