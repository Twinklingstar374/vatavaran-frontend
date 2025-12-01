'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getTotalImpact } from '@/utils/impactCalculator';

export default function AdminDashboard() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const response = await api.get('/pickups', { params: { limit: 1000 } });
      setPickups(response.data.pickups);
    } catch (err) {
      console.error('Failed to load pickups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage('');
    
    try {
      await api.post('/auth/create-user', newUser);
      setMessage('User created successfully!');
      setNewUser({ name: '', email: '', password: '', role: 'STAFF' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  // Calculate stats
  const totalWeight = pickups.reduce((sum, p) => sum + p.weight, 0);
  const approvedCount = pickups.filter(p => p.status === 'APPROVED').length;
  const pendingCount = pickups.filter(p => p.status === 'PENDING').length;
  const rejectedCount = pickups.filter(p => p.status === 'REJECTED').length;
  
  // Category breakdown
  const categoryStats = {};
  pickups.forEach(p => {
    categoryStats[p.category] = (categoryStats[p.category] || 0) + p.weight;
  });
  
  const categoryData = Object.entries(categoryStats).map(([category, weight]) => ({
    category,
    weight: weight.toFixed(1),
    percentage: ((weight / totalWeight) * 100).toFixed(1)
  })).sort((a, b) => b.weight - a.weight);

  // Staff leaderboard
  const staffStats = {};
  pickups.forEach(p => {
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

  // Last 7 days approvals
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    const count = pickups.filter(p => 
      p.status === 'APPROVED' && new Date(p.updatedAt).toDateString() === dateStr
    ).length;
    last7Days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    });
  }

  const maxApprovals = Math.max(...last7Days.map(d => d.count), 1);
  const impact = getTotalImpact(pickups);

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-4xl font-bold mb-1">{pickups.length}</div>
              <div className="text-sm opacity-90">Total Collections</div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-4xl font-bold mb-1">{approvedCount}</div>
              <div className="text-sm opacity-90">Approved</div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="text-4xl mb-2">⏳</div>
              <div className="text-4xl font-bold mb-1">{pendingCount}</div>
              <div className="text-sm opacity-90">Pending</div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="text-4xl mb-2">⚖️</div>
              <div className="text-4xl font-bold mb-1">{totalWeight.toFixed(1)}kg</div>
              <div className="text-sm opacity-90">Total Weight</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Waste by Category */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Waste by Category</h3>
              <div className="space-y-4">
                {categoryData.map((cat, index) => (
                  <div key={cat.category}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-900">{cat.category}</span>
                      <span className="text-gray-600">{cat.weight}kg ({cat.percentage}%)</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' :
                          'bg-pink-500'
                        }`}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approvals per Day (Last 7 Days) */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Approvals (Last 7 Days)</h3>
              <div className="flex items-end justify-between h-64 gap-2">
                {last7Days.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                      style={{ height: `${(day.count / maxApprovals) * 100}%`, minHeight: day.count > 0 ? '20px' : '0' }}
                      title={`${day.count} approvals`}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2 font-medium">{day.date}</div>
                    <div className="text-sm font-bold text-gray-900">{day.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard & Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Staff Leaderboard */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Top Staff</h3>
                <div className="text-4xl">🏆</div>
              </div>
              <div className="space-y-4">
                {leaderboard.map((staff, index) => (
                  <div key={staff.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-indigo-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-600">{staff.pickups} pickups</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{staff.weight.toFixed(1)}kg</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Total Impact</h3>
                <div className="text-4xl">🌍</div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-5 border border-white/30">
                  <div className="text-sm opacity-90 mb-1">CO₂ Saved</div>
                  <div className="text-4xl font-bold">{impact.co2}kg</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-5 border border-white/30">
                  <div className="text-sm opacity-90 mb-1">Trees Equivalent</div>
                  <div className="text-4xl font-bold">{impact.trees}</div>
                </div>
                {impact.bottles > 0 && (
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl p-5 border border-white/30">
                    <div className="text-sm opacity-90 mb-1">Bottles Saved</div>
                    <div className="text-4xl font-bold">{impact.bottles}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Create User Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New User</h3>
            
            {message && (
              <div className={`p-4 rounded-xl mb-6 ${
                message.includes('success') ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="STAFF">Staff</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
