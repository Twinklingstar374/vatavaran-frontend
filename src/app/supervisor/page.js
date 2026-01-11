'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  HiChartBar, 
  HiCheckBadge, 
  HiXMark, 
  HiUsers, 
  HiClock, 
  HiCube,
  HiChevronLeft,
  HiChevronRight,
  HiFunnel,
  HiTrophy,
  HiArrowPath
} from "react-icons/hi2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

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
      
      const allResponse = await api.get('/pickups', { params: { limit: 1000 } });
      setAllPickups(allResponse.data.pickups);
    } catch (err) {
      setError('Failed to load performance data.');
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
      alert('Action could not be completed.');
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
  
  const activeStaffIds = [...new Set(allPickups.map(p => p.staffId))];

  const staffStats = {};
  allPickups.forEach(p => {
    if (!staffStats[p.staffId]) {
      staffStats[p.staffId] = {
        name: p.staff?.name || `Champion ${p.staffId}`,
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

  return (
    <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
      <div className="w-full min-h-screen bg-[#F8FAFC] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">Operations Hub</h1>
              <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Verify data and monitor individual performance</p>
            </div>
            <button 
                onClick={fetchPickups}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
                <HiArrowPath className={loading ? 'animate-spin' : ''} />
                Refresh Hub
            </button>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-[32px] shadow-lg p-8 border border-gray-100 group hover:border-amber-400 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <HiClock className="text-2xl" />
                </div>
                <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-tighter">Queue</span>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1 tracking-tighter">{pendingCount}</p>
              <p className="text-xs font-black text-gray-400 tracking-widest uppercase">Pending Approval</p>
            </div>

            <div className="bg-white rounded-[32px] shadow-lg p-8 border border-gray-100 group hover:border-emerald-500 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <HiCheckBadge className="text-2xl" />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">Verified</span>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1 tracking-tighter">{approvedToday}</p>
              <p className="text-xs font-black text-gray-400 tracking-widest uppercase">Success Today</p>
            </div>

            <div className="bg-white rounded-[32px] shadow-lg p-8 border border-gray-100 group hover:border-rose-500 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <HiXMark className="text-2xl" />
                </div>
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-tighter">Flagged</span>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1 tracking-tighter">{rejectedToday}</p>
              <p className="text-xs font-black text-gray-400 tracking-widest uppercase">Rejected Today</p>
            </div>

            <div className="bg-white rounded-[32px] shadow-lg p-8 border border-gray-100 group hover:border-blue-600 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <HiUsers className="text-2xl" />
                </div>
                <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">Force</span>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1 tracking-tighter">{activeStaffIds.length}</p>
              <p className="text-xs font-black text-gray-400 tracking-widest uppercase">Staff Active</p>
            </div>
          </div>

          {/* Tactical Intelligence Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Status Flow (Doughnut) */}
            <div className="bg-white rounded-[40px] shadow-xl p-10 border border-gray-100 flex flex-col h-[450px]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Verification Flow</h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-100">Quality Index</span>
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <Doughnut 
                        data={{
                            labels: ['Approved', 'Pending', 'Rejected'],
                            datasets: [{
                                data: [
                                    allPickups.filter(p => p.status === 'APPROVED').length,
                                    allPickups.filter(p => p.status === 'PENDING').length,
                                    allPickups.filter(p => p.status === 'REJECTED').length,
                                ],
                                backgroundColor: [
                                    'rgba(16, 185, 129, 0.9)', // Emerald-500
                                    'rgba(245, 158, 11, 0.9)', // Amber-500
                                    'rgba(244, 63, 94, 0.9)',  // Rose-500
                                ],
                                borderColor: '#ffffff',
                                borderWidth: 3,
                                hoverOffset: 15
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: {
                                        padding: 20,
                                        usePointStyle: true,
                                        font: { weight: 'black', family: 'Inter', size: 10 }
                                    }
                                }
                            },
                            cutout: '70%'
                        }}
                    />
                </div>
            </div>

            {/* Throughput Intensity (Bar) */}
            <div className="bg-white rounded-[40px] shadow-xl p-10 border border-gray-100 flex flex-col h-[450px]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Operational Power</h3>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-blue-100">Top Velocity</span>
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <Bar 
                        data={{
                            labels: leaderboard.map(s => s.name.split(' ')[0]),
                            datasets: [{
                                label: 'Verified Throughput',
                                data: leaderboard.map(s => s.weight),
                                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                                borderRadius: 10,
                                barThickness: 40
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { grid: { display: false }, ticks: { font: { weight: 'black', size: 10 } } },
                                x: { grid: { display: false }, ticks: { font: { weight: 'black', size: 10 } } }
                            }
                        }}
                    />
                </div>
            </div>
          </div>

          {/* Performance Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Leaderboard */}
            <div className="lg:col-span-3 bg-white rounded-[32px] shadow-xl p-10 border border-gray-100">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <HiTrophy className="text-3xl text-amber-500" />
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Excellence Leaderboard</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global operator rankings by verified biomass recovery</p>
                    </div>
                </div>
                <div className="hidden md:block text-[10px] bg-gray-900 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest">Weight Metric (KG)</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {leaderboard.map((staff, index) => (
                  <div key={staff.id} className="p-6 bg-[#FBFDFF] rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all group relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 text-6xl font-black text-gray-100 group-hover:text-blue-50 transition-colors pointer-events-none">0{index + 1}</div>
                    <div className="relative z-10">
                        <div className="font-black text-gray-900 leading-tight mb-4 text-lg uppercase truncate">{staff.name}</div>
                        <div className="text-3xl font-black text-gray-900 tracking-tight mb-2">{staff.weight.toFixed(0)}<span className="text-[10px] text-blue-500 ml-1">KG</span></div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{staff.pickups} Operations</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-100 mb-10">
            <div className="flex items-center gap-2 mb-6 text-gray-900">
                <HiFunnel className="text-xl text-blue-600" />
                <h3 className="text-xl font-black tracking-tight">Intelligent Filter</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-900"
                >
                  <option value="">Global Status</option>
                  <option value="PENDING">Pending Approval</option>
                  <option value="APPROVED">Verified Success</option>
                  <option value="REJECTED">Flagged Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Operator ID</label>
                <input
                  type="number"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="ID Search..."
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Timeline Start</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Timeline End</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-900"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-10 border border-red-100 font-bold flex items-center gap-2">
                <HiXMark className="text-xl" />
                {error}
            </div>
          )}

          {/* Pickups Table */}
          {loading ? (
            <div className="flex flex-col items-center py-24 text-gray-400">
              <HiArrowPath className="text-5xl animate-spin mb-4 text-blue-600" />
              <p className="font-black uppercase tracking-widest text-xs">Cataloging records...</p>
            </div>
          ) : pickups.length === 0 ? (
            <div className="flex flex-col items-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <HiFunnel className="text-6xl text-gray-100 mb-4" />
              <p className="text-gray-400 font-bold">No operations found matching these parameters.</p>
            </div>
          ) : (
            <div className="bg-white shadow-2xl overflow-hidden rounded-[40px] border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ref ID</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Operator</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Metric</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Decision</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {pickups.map((pickup) => (
                    <tr key={pickup.id} className="hover:bg-[#FBFDFF] transition-all group">
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-400">#{pickup.id.toString().padStart(4, '0')}</td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="font-black text-gray-900">{pickup.staff?.name || `ID: ${pickup.staffId}`}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Staff Member</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                         <div className="flex items-center gap-2">
                             <HiCube className="text-gray-300" />
                             <span className="font-black text-gray-900">{pickup.weight.toFixed(1)} <span className="text-gray-400 font-bold ml-1 text-xs uppercase">KG</span></span>
                         </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                         <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded-lg border border-gray-200">{pickup.category}</span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full border ${
                          pickup.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          pickup.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {pickup.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-black space-x-2">
                        {pickup.status === 'PENDING' && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStatusUpdate(pickup.id, 'APPROVED')}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-100 flex items-center gap-2"
                            >
                              <HiCheckBadge />
                              Verify
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(pickup.id, 'REJECTED')}
                              className="px-4 py-2 bg-white text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-50 transition-all flex items-center gap-2"
                            >
                              <HiXMark />
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center mt-12 gap-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
              title="Previous Page"
            >
              <HiChevronLeft className="text-xl" />
            </button>
            <div className="flex flex-col items-center">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Navigation</span>
                <span className="text-sm font-black text-gray-900">
                    {page} <span className="text-gray-300 mx-2">/</span> {totalPages}
                </span>
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
              title="Next Page"
            >
              <HiChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
