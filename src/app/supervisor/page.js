'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getTotalImpact } from '@/utils/impactCalculator';

export default function SupervisorDashboard() {
  const [pickups, setPickups] = useState([]);
  const [allPickups, setAllPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [status, setStatus] = useState('');
  const [staffId, setStaffId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        status: status || undefined,
        staffId: staffId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      
      const response = await api.get('/pickups', { params });
      setPickups(response.data.pickups);
      setTotalPages(response.data.pagination.pages);
      
      // Fetch all pickups for stats
      const allResponse = await api.get('/pickups', { params: { limit: 1000 } });
      setAllPickups(allResponse.data.pickups);
    } catch (err) {
      setError('Failed to load pickups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, status, staffId, startDate, endDate]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/pickups/${id}`, { status: newStatus });
      fetchPickups();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Calculate stats
  const today = new Date().toDateString();
  const pendingCount = allPickups.filter(p => p.status === 'PENDING').length;
  const approvedToday = allPickups.filter(p => 
    p.status === 'APPROVED' && new Date(p.updatedAt).toDateString() === today
  ).length;
  const rejectedToday = allPickups.filter(p => 
    p.status === 'REJECTED' && new Date(p.updatedAt).toDateString() === today
  ).length;
  
  // Active staff today
  const todayPickups = allPickups.filter(p => new Date(p.createdAt).toDateString() === today);
  const activeStaffIds = [...new Set(todayPickups.map(p => p.staffId))];
  
  // Staff leaderboard
  const staffStats = {};
  allPickups.forEach(p => {
    if (!staffStats[p.staffId]) {
      staffStats[p.staffId] = {
        name: p.staff?.name || `Staff ${p.staffId}`,
        pickups: 0,
        weight: 0,
        approved: 0
      };
    }
    staffStats[p.staffId].pickups++;
    staffStats[p.staffId].weight += p.weight;
    if (p.status === 'APPROVED') staffStats[p.staffId].approved++;
  });
  
  const leaderboard = Object.entries(staffStats)
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  const impact = getTotalImpact(allPickups);

  return (
    <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Supervisor Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl">⏳</div>
                <div className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">Pending</div>
              </div>
              <div className="text-4xl font-bold mb-1">{pendingCount}</div>
              <div className="text-sm opacity-90">Awaiting Approval</div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-4xl font-bold mb-1">{approvedToday}</div>
              <div className="text-sm opacity-90">Approved Today</div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="text-4xl mb-2">❌</div>
              <div className="text-4xl font-bold mb-1">{rejectedToday}</div>
              <div className="text-sm opacity-90">Rejected Today</div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-4xl font-bold mb-1">{activeStaffIds.length}</div>
              <div className="text-sm opacity-90">Active Staff Today</div>
            </div>
          </div>

          {/* Leaderboard & Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Productivity Leaderboard */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Top Performers</h3>
                <div className="text-4xl">🏆</div>
              </div>
              <div className="space-y-4">
                {leaderboard.map((staff, index) => (
                  <div key={staff.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-600">{staff.pickups} pickups • {staff.approved} approved</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{staff.weight.toFixed(1)}kg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Impact */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Team Impact</h3>
                <div className="text-4xl">🌍</div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30">
                  <div className="text-sm opacity-90 mb-1">Total CO₂ Saved</div>
                  <div className="text-3xl font-bold">{impact.co2}kg</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30">
                  <div className="text-sm opacity-90 mb-1">Trees Equivalent</div>
                  <div className="text-3xl font-bold">{impact.trees}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30">
                  <div className="text-sm opacity-90 mb-1">Total Collections</div>
                  <div className="text-3xl font-bold">{allPickups.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Pickups</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID</label>
                <input
                  type="number"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="Filter by Staff ID"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
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
              <p className="text-xl text-gray-500">No pickups found matching filters.</p>
            </div>
          ) : (
            <div className="bg-white shadow-xl overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pickups.map((pickup) => (
                    <tr key={pickup.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">#{pickup.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {pickup.staff?.name || `ID: ${pickup.staffId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pickup.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pickup.weight}kg</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pickup.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          pickup.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pickup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        {pickup.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(pickup.id, 'APPROVED')}
                              className="text-green-600 hover:text-green-900 font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(pickup.id, 'REJECTED')}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Reject
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
    </ProtectedRoute>
  );
}
