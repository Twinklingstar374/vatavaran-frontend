'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { 
  HiBars3, 
  HiXMark, 
  HiArrowRightOnRectangle, 
  HiHome, 
  HiInformationCircle, 
  HiChatBubbleLeftEllipsis, 
  HiLightBulb, 
  HiShieldCheck, 
  HiUserCircle,
  HiBriefcase,
  HiMapPin,
  HiSparkles,
  HiGlobeAmericas,
  HiCog6Tooth,
  HiChevronDown
} from "react-icons/hi2";

// User Profile Dropdown Component
function UserProfileDropdown({ user, role, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    if (!name) return user.email?.substring(0, 2).toUpperCase() || 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200"
      >
        {/* Avatar with Initials */}
        <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-sm shadow-md">
          {getInitials(user.name)}
        </div>
        
        {/* User Info */}
        <div className="text-left">
          <div className="text-sm font-bold leading-tight text-gray-900">
            {user.name || user.email?.split('@')[0]}
          </div>
          <div className="text-xs text-blue-600 font-bold">{role}</div>
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
              {role}
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
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
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

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Navbar Debug:', { user, role, hasUser: !!user, hasRole: !!role });
  }, [user, role]);


  const navLinks = [
    { name: 'Home', href: '/', icon: HiHome },
    { name: 'About', href: '/about', icon: HiInformationCircle },
    { name: 'Tips', href: '/recycling-tips', icon: HiSparkles },
    { name: 'Contact', href: '/contact', icon: HiChatBubbleLeftEllipsis },
    { name: 'Improve', href: '/improvement', icon: HiLightBulb },
  ];

  // Specific links for each role
  const roleLinks = {
    'STAFF': [
      { name: 'Dashboard', href: '/staff', icon: HiBriefcase },
      { name: 'Zones', href: '/staff/dumpzones', icon: HiMapPin },
    ],
    'SUPERVISOR': [
      { name: 'Dashboard', href: '/supervisor', icon: HiShieldCheck },
    ],
    'ADMIN': [
      { name: 'Admin Hub', href: '/admin', icon: HiShieldCheck },
    ],
  };

  // New Logic: 
  // If user is logged in: show role-specific links + Tips.
  // If user is NOT logged in: show all standard landing page links.
  const activeLinks = role 
    ? [...(roleLinks[role] || []), { name: 'Tips', href: '/recycling-tips', icon: HiSparkles }]
    : navLinks;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center group-hover:rotate-[10deg] transition-all duration-500 shadow-xl group-hover:shadow-blue-500/20 group-hover:scale-105 border border-white/10 ring-4 ring-gray-900/5">
                  <HiGlobeAmericas className="text-white text-2xl animate-spin-slow" />
                </div>
                <div className="flex flex-col -gap-1">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter hidden sm:block leading-none">
                    Vatavaran<span className="text-blue-600">Track</span>
                  </span>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest hidden sm:block opacity-60">Environmental Intelligence</span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {activeLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname === link.href
                        ? 'bg-gray-900 text-white shadow-md shadow-gray-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="text-lg" />
                    {link.name}
                  </Link>
                );
              })}

              {user ? (
                <UserProfileDropdown user={user} role={role} onLogout={() => setShowLogoutModal(true)} />
              ) : (
                <Link
                  href="/login"
                  className="ml-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                >
                  <HiUserCircle className="text-xl" />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all border border-gray-100"
              >
                {isOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen border-t border-gray-50' : 'max-h-0'}`}>
          <div className="px-4 py-6 space-y-2 bg-white/95 backdrop-blur-md">
            {activeLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-bold transition-all ${
                    pathname === link.href
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-xl" />
                  {link.name}
                </Link>
              );
            })}
            {user ? (
              <>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-600 hover:bg-gray-100 font-bold transition-all"
                >
                  <HiCog6Tooth className="text-xl" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-600 bg-red-50 font-bold transition-all mt-4 border border-red-100"
                >
                  <HiArrowRightOnRectangle className="text-xl" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-100 mt-4 text-center justify-center"
              >
                <HiUserCircle className="text-xl" />
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal - Light Blur Style */}
      {showLogoutModal && (
        <div className="fixed inset-0 w-full h-full bg-white/40 backdrop-blur-md flex items-center justify-center z-[99999] p-4 overflow-hidden">
          <div className="bg-white p-12 rounded-[48px] max-w-sm w-full shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] animate-in zoom-in-95 fade-in duration-300 relative border border-white">
            <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center mb-8 mx-auto shadow-inner">
                <HiArrowRightOnRectangle className="text-5xl text-red-600 ml-1" />
            </div>
            <h3 className="text-3xl font-black text-center text-gray-900 mb-2 tracking-tighter uppercase">Sign Out?</h3>
            <p className="text-gray-500 text-center mb-10 font-bold leading-relaxed px-4">
              Are you sure you want to log out of your session?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full px-6 py-5 bg-red-600 text-white rounded-[24px] font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full px-6 py-4 bg-gray-100 text-gray-700 rounded-[20px] font-black hover:bg-gray-200 transition-all text-sm uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
