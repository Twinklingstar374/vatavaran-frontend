'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { 
  HiGlobeAmericas, 
  HiMapPin, 
  HiChartBar, 
  HiCheckBadge, 
  HiBookOpen, 
  HiArrowPathRoundedSquare, 
  HiSparkles,
  HiUsers,
  HiArrowRight,
  HiCube,
  HiTrophy
} from "react-icons/hi2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function HomePage() {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pickups', { params: { limit: 1000 } });
      setPickups(response.data.pickups || []);
    } catch (err) {
      console.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics
  const totalWeight = pickups.reduce((sum, p) => sum + p.weight, 0);
  const approvedCount = pickups.filter(p => p.status === 'APPROVED').length;
  
  // Category breakdown
  const categoryStats = {};
  pickups.forEach(p => {
    categoryStats[p.category] = (categoryStats[p.category] || 0) + p.weight;
  });
  
  const categoryData = Object.entries(categoryStats).map(([category, weight]) => ({
    category,
    weight: weight.toFixed(1)
  })).sort((a, b) => b.weight - a.weight);

  // Staff leaderboard
  const staffStats = {};
  pickups.forEach(p => {
    if (!staffStats[p.staffId]) {
      staffStats[p.staffId] = {
        name: p.staff?.name || `Staff ${p.staffId}`,
        weight: 0
      };
    }
    staffStats[p.staffId].weight += p.weight;
  });
  
  const leaderboard = Object.entries(staffStats)
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  const activeStaffCount = Object.keys(staffStats).length;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="relative w-full bg-gray-900 text-white min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=800&fit=crop')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 w-full py-20">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-md rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <HiSparkles className="text-sm" />
              Intelligence in Action
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              Clean future,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">trackable</span> impact.
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl font-medium leading-relaxed">
              VatavaranTrack is the intelligent waste management system designed for transparency, efficiency, and environmental progress.
            </p>

            {/* CTA Buttons */}
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <Link
                  href="/signup"
                  className="group px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-xl hover:bg-gray-100 transition-all shadow-2xl flex items-center gap-2 justify-center"
                >
                  Get Started
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="px-10 py-5 bg-transparent border-2 border-white/20 backdrop-blur-lg text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all"
                >
                  Login
                </Link>
              </div>
            ) : (
                <div className="flex mb-16">
                    <Link
                    href={user.role === 'STAFF' ? '/staff' : user.role === 'SUPERVISOR' ? '/supervisor' : '/admin'}
                    className="group px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-2xl hover:shadow-blue-200 flex items-center gap-2"
                    >
                    Go to Dashboard
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}
          </div>
          
          <div className="hidden lg:block animate-in fade-in zoom-in duration-1000">
            <HiGlobeAmericas className="text-[280px] text-blue-500/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Analytics Section - Only for logged-in users */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Real-Time Analytics
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Track performance and environmental impact across the platform
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <HiChartBar className="text-2xl text-blue-600" />
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{pickups.length}</p>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Pickups</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <HiCube className="text-2xl text-emerald-600" />
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{totalWeight.toFixed(0)}kg</p>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Weight</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <HiCheckBadge className="text-2xl text-purple-600" />
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">
                {pickups.length > 0 ? ((approvedCount / pickups.length) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-sm font-bold text-gray-500 uppercase">Approval Rate</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <HiUsers className="text-2xl text-amber-600" />
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{activeStaffCount}</p>
              <p className="text-sm font-bold text-gray-500 uppercase">Active Staff</p>
            </div>
          </div>

          {/* Charts */}
          {!loading && pickups.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Waste Category Distribution */}
              <div className="bg-white rounded-[40px] shadow-xl p-10 border border-gray-100 flex flex-col h-[500px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Waste Distribution</h3>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-blue-100">By Category</span>
                </div>
                <div className="flex-grow flex items-center justify-center">
                  <Doughnut 
                    data={{
                      labels: categoryData.map(c => c.category),
                      datasets: [{
                        data: categoryData.map(c => c.weight),
                        backgroundColor: [
                          'rgba(37, 99, 235, 0.9)',
                          'rgba(16, 185, 129, 0.9)',
                          'rgba(245, 158, 11, 0.9)',
                          'rgba(244, 63, 94, 0.9)',
                          'rgba(139, 92, 246, 0.9)',
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

              {/* Top Performers */}
              <div className="bg-white rounded-[40px] shadow-xl p-10 border border-gray-100 flex flex-col h-[500px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Top Performers</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-100">By Weight (KG)</span>
                </div>
                <div className="flex-grow flex items-center justify-center">
                  <Bar 
                    data={{
                      labels: leaderboard.map(s => s.name.split(' ')[0]),
                      datasets: [{
                        label: 'Weight Collected',
                        data: leaderboard.map(s => s.weight),
                        backgroundColor: 'rgba(37, 99, 235, 0.8)',
                        borderRadius: 12,
                        barThickness: 40
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
          )}

          {loading && (
            <div className="text-center py-20">
              <div className="text-gray-400 font-bold">Loading analytics...</div>
            </div>
          )}
        </div>
      )}

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: HiMapPin,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50',
              title: 'GPS Intelligence',
              description: 'Precise coordinate-based tracking for every collection, ensuring complete accountability.'
            },
            {
              icon: HiChartBar,
              color: 'text-blue-500',
              bg: 'bg-blue-50',
              title: 'Impact Analytics',
              description: 'Real-time data visualization of waste patterns and environmental savings.'
            },
            {
              icon: HiCheckBadge,
              color: 'text-purple-500',
              bg: 'bg-purple-50',
              title: 'Verification Loop',
              description: 'Multi-tier approval process to maintain high-quality data and operational standards.'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-10 rounded-[32px] shadow-lg hover:shadow-2xl transition-all border border-gray-50"
            >
              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`text-3xl ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-500 font-medium leading-[1.6]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gray-900 rounded-[48px] p-16 md:p-24 text-white text-center shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Together, we build a greener legacy.</h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-400 font-medium max-w-3xl mx-auto">
            Our platform provides the tools. You provide the action. Let's make every gram of waste count toward a cleaner world.
          </p>
          <Link
            href="/recycling-tips"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-xl hover:bg-gray-100 transition-all shadow-xl"
          >
            <HiBookOpen className="text-2xl text-blue-600" />
            Recycling Wisdom
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { number: '1,200+', label: 'Verified Collections', icon: HiArrowPathRoundedSquare, color: 'text-blue-600' },
            { number: '850kg', label: 'CO₂ Emissions Prevented', icon: HiSparkles, color: 'text-amber-500' },
            { number: '150+', label: 'Active Champions', icon: HiUsers, color: 'text-emerald-500' }
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center p-10 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <stat.icon className={`text-4xl ${stat.color} mb-6`} />
              <div className="text-5xl font-black text-gray-900 mb-2 tracking-tighter">{stat.number}</div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
