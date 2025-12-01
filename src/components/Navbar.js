'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoClick = (e) => {
    if (user) {
      e.preventDefault();
      setShowLogoutModal(true);
    }
  };

  const handleLogoutAndRedirect = () => {
    logout();
    setShowLogoutModal(false);
    router.push('/home');
  };

  const handleDashboardClick = () => {
    if (user) {
      if (user.role === 'STAFF') router.push('/staff');
      else if (user.role === 'SUPERVISOR') router.push('/supervisor');
      else if (user.role === 'ADMIN') router.push('/admin');
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                href={user ? "#" : "/home"} 
                onClick={handleLogoClick}
                className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent hover:from-green-700 hover:to-blue-700 transition-all"
              >
                🌱 VatavaranTrack
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {!user ? (
                // PUBLIC NAVBAR
                <>
                  <Link href="/home" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium">
                    Home
                  </Link>
                  <Link href="/about" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium">
                    About Us
                  </Link>
                  <Link href="/recycling-tips" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium">
                    Recycling Tips
                  </Link>
                  <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium">
                    Contact Us
                  </Link>
                  <Link href="/improvement" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium">
                    Improvement Form
                  </Link>
                  <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium ml-2">
                    Login
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium ml-2 transition-all shadow-sm hover:shadow-md">
                    Signup
                  </Link>
                </>
              ) : (
                // DASHBOARD NAVBAR (LOGGED IN)
                <>
                  <button 
                    onClick={handleDashboardClick}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                  >
                    Dashboard
                  </button>
                  <span className="px-4 py-2 text-gray-700 font-medium">
                    Hello, <span className="text-blue-600">{user.name}</span>
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-all ml-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Modal with Backdrop Blur */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white/95 backdrop-blur-xl p-8 rounded-2xl max-w-md mx-4 shadow-2xl border border-white/20 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Return to Home</h3>
              <p className="text-gray-600">
                You must logout to return to the home page.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutAndRedirect}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
