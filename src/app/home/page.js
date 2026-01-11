'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  HiGlobeAmericas, 
  HiMapPin, 
  HiChartBar, 
  HiCheckBadge, 
  HiBookOpen, 
  HiArrowPathRoundedSquare, 
  HiSparkles,
  HiUsers,
  HiArrowRight
} from "react-icons/hi2";

export default function HomePage() {
  const { user } = useAuth();

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
