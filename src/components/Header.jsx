"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HiCog6Tooth, HiArrowRightOnRectangle, HiChevronDown } from "react-icons/hi2";

export default function Header({ user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (typeof window !== "undefined") window.location.href = "/";
  };

  return (
    <header className="w-full bg-[#2563eb] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black tracking-tight hover:opacity-90 transition-opacity">
            VatavaranTrack
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="relative" ref={dropdownRef}>
              {/* User Profile Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all group"
              >
                {/* Avatar with Initials */}
                <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center font-black text-sm shadow-md">
                  {getInitials(user.name)}
                </div>

                {/* User Info */}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-bold leading-tight">{user.name}</div>
                  <div className="text-xs text-blue-200 font-medium">{user.role || 'STAFF'}</div>
                </div>

                {/* Dropdown Arrow */}
                <HiChevronDown className={`text-lg transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Section */}
                  <div className="px-6 py-4 bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-base shadow-md">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-gray-900 truncate">{user.name}</div>
                        <div className="text-xs text-gray-500 font-medium truncate">{user.email}</div>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                      {user.role || 'STAFF'}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                    >
                      <HiCog6Tooth className="text-xl text-gray-400 group-hover:text-blue-600 transition-colors" />
                      <span className="font-bold text-sm">Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                    >
                      <HiArrowRightOnRectangle className="text-xl group-hover:translate-x-0.5 transition-transform" />
                      <span className="font-bold text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
