'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getTotalImpact, getImpactMessage } from '@/utils/impactCalculator';

export default function StaffDashboard() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const router = useRouter();

  // Check and mark attendance
  useEffect(() => {
    const today = new Date().toDateString();
    const storedAttendance = localStorage.getItem('staffAttendance');
    
    if (storedAttendance) {
      const attendanceData = JSON.parse(storedAttendance);
      if (attendanceData.date === today) {
        setAttendance(attendanceData);
      } else {
        // New day, reset attendance
        localStorage.removeItem('staffAttendance');
      }
    }
  }, []);

  const markAttendance = useCallback(() => {
    const today = new Date().toDateString();
    const now = new Date().toLocaleTimeString();
    const attendanceData = {
      date: today,
      checkInTime: now,
      firstPickup: true
    };
    localStorage.setItem('staffAttendance', JSON.stringify(attendanceData));
    setAttendance(attendanceData);
  }, []);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/pickups/my', {
        params: { sortBy, sortOrder }
      });
      setPickups(response.data);
      
      // Auto mark attendance on first pickup of the day
      if (response.data.length > 0 && !attendance) {
        const today = new Date().toDateString();
        const todayPickups = response.data.filter(p => 
          new Date(p.createdAt).toDateString() === today
        );
        if (todayPickups.length > 0) {
          markAttendance();
        }
      }
    } catch (err) {
      setError('Failed to load pickups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, attendance, markAttendance]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pickups/${id}`);
      setDeleteConfirm(null);
      fetchPickups();
    } catch (err) {
      alert('Failed to delete pickup: ' + (err.response?.data?.message || err.message));
    }
  };

  // Calculate stats
  const today = new Date().toDateString();
  const todayPickups = pickups.filter(p => new Date(p.createdAt).toDateString() === today);
  const totalWeight = pickups.reduce((sum, p) => sum + p.weight, 0);
  const approvedCount = pickups.filter(p => p.status === 'APPROVED').length;
  const pendingCount = pickups.filter(p => p.status === 'PENDING').length;
  const approvalRate = pickups.length > 0 ? ((approvedCount / pickups.length) * 100).toFixed(1) : 0;
  const impact = getTotalImpact(pickups);

  // Productivity score (0-100)
  const productivityScore = Math.min(100, Math.floor(
    (pickups.length * 10) + (totalWeight * 2) + (approvedCount * 5)
  ));

  return (
    <ProtectedRoute allowedRoles={['STAFF']}>
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Staff Dashboard</h1>
            <div className="flex gap-3">
              <Link
                href="/staff/dumpzones"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>📍</span>
                Dump Zones Map
              </Link>
              <Link
                href="/staff/new"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                + Create Pickup
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Attendance Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">✓</div>
                {attendance && <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold">Checked In</div>}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{todayPickups.length}</div>
              <div className="text-sm text-gray-600">Pickups Today</div>
              {attendance && (
                <div className="text-xs text-gray-500 mt-2">Check-in: {attendance.checkInTime}</div>
              )}
            </div>

            {/* Total Collections */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{pickups.length}</div>
              <div className="text-sm text-gray-600">Total Collections</div>
            </div>

            {/* Total Weight */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{totalWeight.toFixed(1)}kg</div>
              <div className="text-sm text-gray-600">Total Weight</div>
            </div>

            {/* Approval Rate */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{approvalRate}%</div>
              <div className="text-sm text-gray-600">Approval Rate</div>
              <div className="text-xs text-gray-500 mt-1">{approvedCount}/{pickups.length} approved</div>
            </div>
          </div>

          {/* Productivity & Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Productivity Score */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Productivity Score</h3>
                <div className="text-4xl">📊</div>
              </div>
              <div className="text-6xl font-bold mb-2">{productivityScore}</div>
              <div className="text-lg opacity-90 mb-4">out of 100</div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${productivityScore}%` }}
                ></div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Environmental Impact</h3>
                <div className="text-4xl">🌱</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="opacity-90">CO₂ Saved</span>
                  <span className="text-2xl font-bold">{impact.co2}kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Trees Equivalent</span>
                  <span className="text-2xl font-bold">{impact.trees}</span>
                </div>
                {impact.bottles > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="opacity-90">Bottles Saved</span>
                    <span className="text-2xl font-bold">{impact.bottles}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort Pickups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="weight">Weight</option>
                  <option value="category">Category</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
              {error}
            </div>
          )}

          {/* Pickups Table */}
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">⏳</div>
              <div className="text-xl">Loading pickups...</div>
            </div>
          ) : pickups.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-lg">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-gray-500 mb-4">No pickups found</p>
              <Link
                href="/staff/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Create Your First Pickup
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-xl overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Impact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pickups.map((pickup) => (
                    <tr key={pickup.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(pickup.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pickup.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pickup.weight}kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pickup.imageUrl && (
                          <img
                            src={pickup.imageUrl}
                            alt="Pickup"
                            className="h-16 w-16 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-all"
                            onClick={() => setSelectedImage(pickup.imageUrl)}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pickup.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          pickup.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pickup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate" title={getImpactMessage(pickup.category, pickup.weight)}>
                          {getImpactMessage(pickup.category, pickup.weight)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        {pickup.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => router.push(`/staff/edit/${pickup.id}`)}
                              className="text-blue-600 hover:text-blue-900 font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(pickup.id)}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-screen p-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-all"
                >
                  ×
                </button>
                <img
                  src={selectedImage}
                  alt="Full size"
                  className="max-w-full max-h-screen object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl max-w-md mx-4 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this pickup? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}