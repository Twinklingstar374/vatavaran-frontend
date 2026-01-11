'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  HiChartBar, 
  HiEnvelope, 
  HiLightBulb, 
  HiUserGroup, 
  HiCube, 
  HiCheckBadge,
  HiClock,
  HiXMark,
  HiUserPlus,
  HiShieldCheck,
  HiArrowPath,
  HiChatBubbleLeftRight,
  HiBriefcase
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


export default function AdminDashboard() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [contactMessages, setContactMessages] = useState([]);
  const [improvementSuggestions, setImprovementSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPickups(),
      fetchContactMessages(),
      fetchImprovementSuggestions()
    ]);
    setLoading(false);
  };

  const fetchPickups = async () => {
    try {
      const response = await api.get('/pickups', { params: { limit: 1000 } });
      setPickups(response.data.pickups);
    } catch (err) {
      console.error('Failed to load pickups');
    }
  };

  const fetchContactMessages = async () => {
    try {
      const response = await api.get('/contact');
      setContactMessages(response.data);
    } catch (err) {
      console.error('Failed to load contact messages');
    }
  };

  const fetchImprovementSuggestions = async () => {
    try {
      const response = await api.get('/improvement');
      setImprovementSuggestions(response.data);
    } catch (err) {
      console.error('Failed to load improvement suggestions');
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
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="w-full min-h-screen bg-[#F8FAFC] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-2">Executive Summary</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Full ecosystem oversight and analytics</p>
            </div>
            <div className="flex gap-4">
              <button 
                  onClick={fetchData}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-600"
                  title="Sync Data"
              >
                  <HiArrowPath className={loading ? 'animate-spin' : ''} />
              </button>
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Core Engine Live</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-10 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-gray-100 max-w-fit shadow-inner">
            {[
              { id: 'overview', label: 'Overview', icon: HiChartBar },
              { id: 'messages', label: 'Support Queue', icon: HiEnvelope, count: contactMessages.length },
              { id: 'suggestions', label: 'Insights', icon: HiLightBulb, count: improvementSuggestions.length },
              { id: 'users', label: 'Network', icon: HiUserGroup }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gray-900 text-white shadow-2xl' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-white'
                }`}
              >
                <tab.icon className="text-lg" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg ml-1 font-black ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-[32px] shadow-xl p-8 border border-gray-100 relative group overflow-hidden transition-all hover:shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <HiChartBar className="text-2xl" />
                            </div>
                            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">Activity</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lifetime Operations</p>
                        <p className="text-5xl font-black text-gray-900 leading-none tracking-tighter">{pickups.length}</p>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-xl p-8 border border-gray-100 relative group overflow-hidden transition-all hover:shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <HiCube className="text-2xl" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">Resources</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Mass (KG)</p>
                        <p className="text-5xl font-black text-gray-900 leading-none tracking-tighter">{totalWeight.toFixed(0)}</p>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-xl p-8 border border-gray-100 relative group overflow-hidden transition-all hover:shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <HiCheckBadge className="text-2xl" />
                            </div>
                            <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-tighter">Verification</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trust Rating</p>
                        <p className="text-5xl font-black text-gray-900 leading-none tracking-tighter">{pickups.length > 0 ? ((approvedCount / pickups.length) * 100).toFixed(0) : 0}%</p>
                    </div>

                    <div className="bg-gray-900 rounded-[32px] shadow-2xl p-8 relative group overflow-hidden text-white border-none transition-all hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-white/10 text-white rounded-2xl group-hover:scale-110 transition-transform">
                                <HiClock className="text-2xl" />
                            </div>
                            <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase tracking-tighter font-mono">Critical</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Action Required</p>
                        <p className="text-5xl font-black leading-none tracking-tighter">{pendingCount}</p>
                        <p className="text-[10px] text-blue-400 mt-4 font-black uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">Awaiting validation protocol</p>
                    </div>
                </div>

                {/* Actionable Intelligence / Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Waste Stream Distribution (Doughnut) */}
                    <div className="bg-white rounded-[40px] shadow-xl p-10 border border-gray-100 flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Waste Stream</h3>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-blue-100">Live Distribution</span>
                        </div>
                        <div className="flex-grow flex items-center justify-center p-4">
                            <Doughnut 
                                data={{
                                    labels: categoryData.map(c => c.category),
                                    datasets: [{
                                        data: categoryData.map(c => c.weight),
                                        backgroundColor: [
                                            'rgba(17, 24, 39, 0.9)',   // Gray-900
                                            'rgba(37, 99, 235, 0.9)',  // Blue-600
                                            'rgba(16, 185, 129, 0.9)', // Emerald-500
                                            'rgba(245, 158, 11, 0.9)', // Amber-500
                                            'rgba(244, 63, 94, 0.9)',  // Rose-500
                                        ],
                                        borderColor: '#ffffff',
                                        borderWidth: 4,
                                        hoverOffset: 20
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                padding: 20,
                                                usePointStyle: true,
                                                font: { weight: 'bold', family: 'Inter' }
                                            }
                                        }
                                    },
                                    cutout: '65%'
                                }}
                            />
                        </div>
                    </div>

                    {/* Capacity Analysis (Bar) */}
                    <div className="bg-white rounded-[40px] shadow-xl p-10 border border-gray-100 flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Capacity Analysis</h3>
                            <button className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-100 italic">By Weight (KG)</button>
                        </div>
                        <div className="flex-grow flex items-center justify-center p-4">
                            <Bar 
                                data={{
                                    labels: leaderboard.map(s => s.name.split(' ')[0]),
                                    datasets: [{
                                        label: 'Verified Weight',
                                        data: leaderboard.map(s => s.weight),
                                        backgroundColor: 'rgba(37, 99, 235, 0.8)',
                                        borderRadius: 12,
                                        barThickness: 32
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false }
                                    },
                                    scales: {
                                        y: {
                                            grid: { display: false },
                                            ticks: { font: { weight: 'bold' } }
                                        },
                                        x: {
                                            grid: { display: false },
                                            ticks: { font: { weight: 'bold' } }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Performance & Contributor Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Performance Elites */}
                    <div className="bg-white rounded-[40px] shadow-xl p-10 border border-gray-100 lg:col-span-3">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-1">Elite Network</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Top system contributors ranked by verified throughput</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400">
                                <HiBriefcase className="text-3xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {leaderboard.map((staff, index) => (
                                <div key={staff.id} className="p-8 bg-[#FBFDFF] rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all group flex flex-col justify-between h-48 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 text-8xl font-black text-gray-100/50 group-hover:text-blue-50/50 transition-colors pointer-events-none">0{index + 1}</div>
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="text-3xl font-black text-gray-900 tracking-tight uppercase">{staff.weight.toFixed(0)} <span className="text-[10px] text-blue-500 font-bold ml-1 uppercase">kg</span></div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="font-black text-gray-900 text-xl uppercase tracking-tight mb-1">{staff.name}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{staff.pickups} Pickups</span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{staff.approved} Approved</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-4">Support Queue</h2>
                    <span className="text-[10px] font-black text-gray-400 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full uppercase tracking-widest">{contactMessages.length} Messages</span>
                </div>
                {contactMessages.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                        <HiEnvelope className="text-6xl text-gray-100 mb-6" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Queue Empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {contactMessages.map((msg) => (
                            <div key={msg.id} className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-lg hover:shadow-2xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{msg.subject}</h3>
                                        <div className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                                            <span className="text-gray-900">{msg.name}</span>
                                            <span className="text-gray-200">|</span>
                                            <span>{msg.email}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="bg-[#FBFDFF] p-8 rounded-[32px] border border-gray-100 relative shadow-inner">
                                    <HiChatBubbleLeftRight className="absolute -top-4 -left-4 text-4xl text-blue-100" />
                                    <p className="text-gray-600 leading-relaxed font-medium italic">
                                        "{msg.message}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Community Insights</h2>
                    <div className="bg-blue-600 w-16 h-1 rounded-full"></div>
                </div>
                {improvementSuggestions.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                        <HiLightBulb className="text-6xl text-gray-100 mb-6" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Awaiting Insights</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {improvementSuggestions.map((sug) => (
                            <div key={sug.id} className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-lg hover:shadow-2xl transition-all flex flex-col h-full group">
                                <div className="flex justify-between items-start mb-8">
                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        sug.priority === 'high' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                                        sug.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {sug.priority} Priority
                                    </span>
                                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">
                                        {new Date(sug.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 capitalize group-hover:text-amber-500 transition-colors tracking-tight">{sug.category.replace('-', ' ')}</h3>
                                <div className="bg-gray-50 flex-grow p-8 rounded-[32px] mb-8 shadow-inner border border-gray-100">
                                    <p className="text-gray-600 font-medium italic leading-relaxed">"{sug.suggestion}"</p>
                                </div>
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center font-black text-white text-xs">
                                        {sug.name.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-gray-900 uppercase tracking-tight">{sug.name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{sug.email}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="bg-white rounded-[40px] shadow-2xl p-12 border border-gray-100">
                    <div className="flex items-center gap-3 mb-10">
                        <HiUserPlus className="text-4xl text-blue-600" />
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Network Expansion</h3>
                    </div>
                    
                    {message && (
                        <div className={`p-6 rounded-3xl mb-10 flex items-center gap-3 font-black text-sm uppercase tracking-widest border animate-pulse ${
                            message.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                            {message.includes('success') ? <HiCheckBadge className="text-2xl" /> : <HiXMark className="text-2xl" />}
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Display Name</label>
                            <input
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900"
                                placeholder="Full Name..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Access Email</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900"
                                placeholder="name@vatavantrack.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Secure Passkey</label>
                            <input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">System Privilege</label>
                            <div className="relative">
                                <HiShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl pointer-events-none" />
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-black text-gray-900 appearance-none"
                                >
                                    <option value="STAFF">Standard Operator (Staff)</option>
                                    <option value="SUPERVISOR">Verification Tier (Supervisor)</option>
                                    <option value="ADMIN">Executive Tier (Admin)</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-6">
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full py-6 bg-gray-900 text-white rounded-[24px] font-black text-xl uppercase tracking-widest hover:bg-black transition-all shadow-2xl hover:shadow-gray-300 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {creating ? (
                                    <HiArrowPath className="animate-spin text-2xl" />
                                ) : (
                                    <>
                                        <HiUserPlus className="text-2xl" />
                                        Initialize Protocol
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
