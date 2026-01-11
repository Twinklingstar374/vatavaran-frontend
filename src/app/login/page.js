'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import api from '@/utils/api';
import { HiLockClosed, HiEnvelope, HiArrowRight, HiShieldCheck } from "react-icons/hi2";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      login(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover scale-110 opacity-60 grayscale-[0.3] contrast-[1.1]"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-green-forest-in-the-sunlight-529-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/40 to-slate-950/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-3">
            Vatavaran<span className="text-blue-400">Track</span>
          </h1>
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] bg-blue-400/10 inline-block px-4 py-1 rounded-full border border-blue-400/20">
            Account Login
          </p>
        </div>

        {/* Simplified Pro Card - Glass Version */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] shadow-2xl p-10 border border-white/10">
          <div className="mb-10">
              <h2 className="text-2xl font-black text-white tracking-tight mb-1">Welcome Back</h2>
              <p className="text-xs text-gray-400 font-medium">Please log in to your account to continue.</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest border border-rose-500/20 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <HiEnvelope className="text-blue-400" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-white placeholder-gray-600 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <HiLockClosed className="text-blue-400" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-white placeholder-gray-600 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-gray-950 rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl hover:shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Log In <HiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs font-bold">
              Don't have an account?{' '}
              <Link href="/signup" className="text-white hover:text-blue-400 transition-colors font-black uppercase tracking-widest">
                Sign Up →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
