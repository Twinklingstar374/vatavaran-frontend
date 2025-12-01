'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center animate-fadeIn">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="text-8xl animate-bounce-slow">🌍</div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                VatavaranTrack
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Intelligent Waste Collection and Approval System for a Cleaner, Greener Future 🌱
            </p>

            {/* CTA Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Link
                  href="/signup"
                  className="group px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started →
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '📍',
              title: 'GPS Tracking',
              description: 'Real-time location tracking for all waste collection activities with precise coordinates'
            },
            {
              icon: '📊',
              title: 'Smart Analytics',
              description: 'Comprehensive reports and insights for better decision making and environmental impact'
            },
            {
              icon: '✅',
              title: 'Approval System',
              description: 'Streamlined workflow for quality control and verification of waste collections'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Join Us in Making a Difference</h2>
          <p className="text-xl mb-8 opacity-90">
            Together, we can create a cleaner and more sustainable environment for future generations
          </p>
          <Link
            href="/recycling-tips"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Learn Recycling Tips 📚
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '1000+', label: 'Waste Collections', icon: '♻️' },
            { number: '500kg', label: 'CO₂ Saved', icon: '🌱' },
            { number: '50+', label: 'Active Users', icon: '👥' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-5xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
