// "use client";

// export default function Header({ user }) {
//   return (
//     <header className="bg-green-700 text-white px-4 py-3 shadow-md">
//       <div className="container mx-auto flex justify-between items-center">

//         {/* App Name */}
//         <h1 className="text-2xl font-bold">
//           VatavaranTrack
//         </h1>

//         {/* Right Section */}
//         <div className="flex items-center gap-4">
//           {/* Role */}
//           {user && (
//             <span className="text-sm bg-green-900 px-3 py-1 rounded-full">
//               ({user.role})
//             </span>
//           )}

//           {/* Logout */}
//           <button
//             onClick={() => {
//               localStorage.removeItem("token");
//               localStorage.removeItem("user");
//               window.location.href = "/login";
//             }}
//             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
//           >
//             Logout
//           </button>
//         </div>

//       </div>
//     </header>
//   );
// }

// frontend/src/components/Header.jsx
"use client";
import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full bg-[#2563eb] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold tracking-tight">VatavaranTrack</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && <div className="text-sm font-medium">{user.name}</div>}
          {user && (
            <span className="ml-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium">
              {user.role ? `(${user.role})` : "(STAFF)"}
            </span>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              if (typeof window !== "undefined") window.location.href = "/";
            }}
            className="bg-white text-[#2563eb] px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-95"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
