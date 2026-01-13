'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  HiUser, 
  HiLockClosed, 
  HiCheckCircle, 
  HiXCircle,
  HiArrowLeft,
  HiShieldCheck
} from "react-icons/hi2";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      await api.patch('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update password' 
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['STAFF', 'SUPERVISOR', 'ADMIN']}>
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="text-gray-400 text-xl font-bold">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['STAFF', 'SUPERVISOR', 'ADMIN']}>
      <div className="min-h-screen bg-[#F8FAFC] py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-6 transition-colors"
            >
              <HiArrowLeft className="text-xl" />
              Back
            </button>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">Settings</h1>
            <p className="text-gray-500 font-medium">Manage your account preferences</p>
          </div>

          {/* Profile Information Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <HiUser className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-500 font-medium">Your account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-900">
                    {user?.name || 'N/A'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-900">
                    {user?.email || 'N/A'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Role
                  </label>
                  <div className="px-4 py-3 bg-blue-50 rounded-xl border border-blue-200 font-bold text-blue-700 flex items-center gap-2">
                    <HiShieldCheck className="text-lg" />
                    {user?.role || 'N/A'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    User ID
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-900">
                    #{user?.id || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
                <HiLockClosed className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Change Password</h2>
                <p className="text-sm text-gray-500 font-medium">Update your account password</p>
              </div>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-bold ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <HiCheckCircle className="text-2xl" />
                ) : (
                  <HiXCircle className="text-2xl" />
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <HiLockClosed className="text-xl" />
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
