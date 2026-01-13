'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiCog6Tooth, HiArrowRightOnRectangle, HiChevronDown } from "react-icons/hi2";

export default function UserProfileDropdown({ user, className = '' }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

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
        if (!name) return user?.email?.substring(0, 2).toUpperCase() || 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        if (typeof window !== "undefined") window.location.href = "/login";
    };

    if (!user) return null;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200 shadow-sm"
            >
                {/* Avatar with Initials */}
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-sm shadow-md">
                    {getInitials(user.name)}
                </div>

                {/* User Info - Hidden on mobile */}
                <div className="hidden md:block text-left">
                    <div className="text-sm font-bold leading-tight text-gray-900">
                        {user.name || user.email?.split('@')[0]}
                    </div>
                    <div className="text-xs text-blue-600 font-bold">{user.role}</div>
                </div>

                {/* Dropdown Arrow */}
                <HiChevronDown className={`text-lg text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
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
                                <div className="text-sm font-black text-gray-900 truncate">
                                    {user.name || 'User'}
                                </div>
                                <div className="text-xs text-gray-500 font-medium truncate">{user.email}</div>
                            </div>
                        </div>
                        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                            {user.role}
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
    );
}
