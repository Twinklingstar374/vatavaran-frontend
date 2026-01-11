'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  HiMapPin,
  HiPlus,
  HiCalendarDays,
  HiCube,
  HiCheckBadge,
  HiTrophy,
  HiSparkles,
  HiArrowPath,
  HiArchiveBox,
  HiXMark,
  HiTrash,
  HiPencilSquare,
  HiEye
} from "react-icons/hi2";

export default function StaffDashboard() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [page, setPage] = useState(1); // Assuming page state for pagination
  const [totalPages, setTotalPages] = useState(1); // Assuming totalPages state for pagination
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
    setError('');
    try {
      const response = await api.get('/pickups/my', {
        params: { sortBy, sortOrder, page } // Added page to params
      });

      const list = response.data?.pickups ?? response.data ?? [];
      setPickups(list);
      setTotalPages(response.data?.totalPages || 1); // Assuming totalPages comes from API

      if (list.length > 0 && !attendance) {
        const today = new Date().toDateString();
        const todayPickups = list.filter(p => new Date(p.createdAt).toDateString() === today);
        if (todayPickups.length > 0) markAttendance();
      }
    } catch (err) {
      console.error('fetchPickups error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load pickups');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, attendance, markAttendance, page]); // Added page to dependencies

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

  const today = new Date().toDateString();
  const todayPickups = pickups.filter(p => new Date(p.createdAt).toDateString() === today);
  const totalWeight = pickups.reduce((sum, p) => sum + p.weight, 0);
  const approvedCount = pickups.filter(p => p.status === 'APPROVED').length;
  const pendingCount = pickups.filter(p => p.status === 'PENDING').length;
  const approvalRate = pickups.length > 0 ? ((approvedCount / pickups.length) * 100).toFixed(1) : 0;

  return (
    <ProtectedRoute allowedRoles={['STAFF']}>
      <div className="w-full min-h-screen bg-[#F0F4F8] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">My Dashboard</h1>
              <p className="text-gray-500 font-medium">Manage your daily pickups and rewards</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/staff/dumpzones"
                className="group px-7 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg flex items-center gap-3 border border-gray-200"
              >
                <HiMapPin className="text-2xl text-blue-600 group-hover:scale-110 transition-transform" />
                Nearby Zones
              </Link>
              <Link
                href="/staff/new"
                className="group px-7 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <HiPlus className="text-2xl group-hover:rotate-90 transition-transform" />
                Log Pickup
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Status Card */}
            <div className="bg-white rounded-3xl shadow-lg p-7 border border-gray-100 transition-all hover:shadow-xl group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <HiCalendarDays className="text-2xl text-amber-500" />
                </div>
                {attendance && <div className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Checked In</div>}
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{todayPickups.length}</p>
              <p className="text-sm font-bold text-gray-500 uppercase">Pickups Today</p>
              {attendance && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1 font-medium">
                  <span className="text-emerald-500">●</span> Logged at {attendance.checkInTime}
                </p>
              )}
            </div>

            {/* Total Weight Card */}
            <div className="bg-white rounded-3xl shadow-lg p-7 border border-gray-100 transition-all hover:shadow-xl group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <HiCube className="text-2xl text-blue-500" />
                </div>
                <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Performance</div>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{totalWeight.toFixed(1)}kg</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">Total Collected Weight</p>
            </div>

            {/* Quality Score Card */}
            <div className="bg-white rounded-3xl shadow-lg p-7 border border-gray-100 transition-all hover:shadow-xl group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <HiCheckBadge className="text-2xl text-purple-500" />
                </div>
                <div className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Quality</div>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{approvalRate}%</p>
              <p className="text-sm font-bold text-gray-500 uppercase">Approval Rating</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {approvedCount} of {pickups.length} verified
              </p>
            </div>
          </div>

          {/* Rewards & Performance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Reward Points Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Total Rewards</p>
                  <h3 className="text-4xl font-black text-gray-900">
                    {pickups.filter(p => p.status === 'APPROVED').length * 10} <span className="text-lg font-medium text-gray-500">Points</span>
                  </h3>
                </div>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                   <HiTrophy className="text-3xl text-blue-600" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                  <span>Progress to Next Tier</span>
                  <span>{((pickups.filter(p => p.status === 'APPROVED').length * 10) % 100)}/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-inner"
                    style={{ width: `${(pickups.filter(p => p.status === 'APPROVED').length * 10) % 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-3 font-medium">
                  *Points increase only after supervisor approval of your collections.
                </p>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Quick Summary</h3>
                <HiSparkles className="text-3xl text-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <p className="text-xs text-blue-300 font-bold uppercase mb-1">Approved</p>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <p className="text-xs text-yellow-300 font-bold uppercase mb-1">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <p className="text-xs text-green-300 font-bold uppercase mb-1">Today</p>
                  <p className="text-2xl font-bold">{todayPickups.length}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <p className="text-xs text-purple-300 font-bold uppercase mb-1">Total Weight</p>
                  <p className="text-2xl font-bold">{totalWeight.toFixed(1)}kg</p>
                </div>
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
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200 flex items-center gap-2">
              <HiXMark className="text-xl" />
              {error}
            </div>
          )}

          {/* Pickups Table */}
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              <HiArrowPath className="text-5xl mb-4 animate-spin mx-auto text-blue-500" />
              <div className="text-xl font-bold">Loading pickups...</div>
            </div>
          ) : pickups.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-lg">
              <HiArchiveBox className="text-6xl mb-4 mx-auto text-gray-300" />
              <p className="text-xl text-gray-500 mb-4">No pickups found</p>
              <Link
                href="/staff/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md"
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
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pickups.map((pickup) => (
                    <tr key={pickup.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-l-4 border-transparent hover:border-blue-500">
                        {new Date(pickup.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {pickup.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pickup.weight}kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pickup.imageUrl && (
                          <div className="relative group/img w-14 h-14 cursor-pointer" onClick={() => setSelectedImage(pickup.imageUrl)}>
                            <img
                              src={pickup.imageUrl}
                              alt="Pickup"
                              className="w-full h-full object-cover rounded-xl border-2 border-gray-100 group-hover/img:border-blue-400 transition-all shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white">
                                <HiEye className="text-xl" />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                          pickup.status === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm' :
                          pickup.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm' :
                          'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm'
                        }`}>
                          {pickup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <div className="flex justify-end gap-3">
                            {['PENDING', 'REJECTED'].includes(pickup.status) ? (
                            <>
                                <button
                                onClick={() => router.push(`/staff/edit/${pickup.id}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Edit Pickup"
                                >
                                <HiPencilSquare className="text-xl" />
                                </button>
                                <button
                                onClick={() => setDeleteConfirm(pickup.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Pickup"
                                >
                                <HiTrash className="text-xl" />
                                </button>
                            </>
                            ) : (
                            <span className="text-xs text-gray-400 italic flex items-center gap-1">
                                <HiCheckBadge className="text-lg text-green-500" />
                                Verified
                            </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-gray-800 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-all z-10 shadow-lg"
            >
              <HiXMark className="text-2xl" />
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-full object-contain max-h-[90vh]"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                <HiTrash className="text-3xl text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-center text-gray-900 mb-2">Delete Pickup?</h3>
            <p className="text-gray-500 text-center mb-8">
              This action cannot be undone. This collection record will be permanently removed.
            </p>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 font-bold transition-all shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}