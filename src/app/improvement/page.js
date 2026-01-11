'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { 
  HiLightBulb, 
  HiCheckBadge, 
  HiXMark, 
  HiPaperAirplane,
  HiCpuChip,
  HiSparkles
} from "react-icons/hi2";

export default function ImprovementFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    suggestion: '',
    priority: 'medium'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/improvement', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', category: '', suggestion: '', priority: 'medium' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register insight. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-amber-100">
            <HiLightBulb className="text-sm" />
            Ideation Terminal
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6 leading-none uppercase">
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">Evolution</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Directly influence our technological roadmap with your logistical insights and feature requirements.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[48px] shadow-2xl p-10 md:p-16 border border-gray-100 relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -ml-32 -mt-32 transition-colors duration-1000 group-hover:bg-amber-100"></div>

          <div className="relative z-10">
            {submitted && (
                <div className="bg-emerald-50 text-emerald-700 p-8 rounded-[32px] mb-12 border border-emerald-100 font-black text-sm uppercase tracking-widest flex flex-col items-center gap-4 text-center animate-in zoom-in duration-500">
                    <HiCheckBadge className="text-5xl" />
                    <div>
                        <div className="text-lg">Insight Registered</div>
                        <div className="text-[10px] opacity-70 mt-1">Our engineering team will analyze this for the next development cycle.</div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-rose-50 text-rose-700 p-6 rounded-3xl mb-12 border border-rose-100 font-black text-sm uppercase tracking-widest flex items-center gap-3 animate-in shake duration-500">
                    <HiXMark className="text-2xl" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Contributor Name</label>
                    <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all font-bold text-gray-900"
                    placeholder="Operator Identity"
                    required
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Security Email</label>
                    <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all font-bold text-gray-900"
                    placeholder="auth@node.com"
                    required
                    />
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">System Domain</label>
                        <div className="relative">
                            <HiCpuChip className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl pointer-events-none" />
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all font-black text-gray-900 appearance-none"
                                required
                            >
                                <option value="">Select Protocol Area</option>
                                <option value="ui">User Interface (UX)</option>
                                <option value="features">Core Capabilities</option>
                                <option value="performance">Engine Performance</option>
                                <option value="mobile">Geospatial/Mobile</option>
                                <option value="reporting">Analytical Intelligence</option>
                                <option value="other">Ancillary Systems</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Urgency Priority</label>
                        <div className="flex gap-3 bg-gray-50 p-2 rounded-[24px] border-2 border-gray-100">
                            {['low', 'medium', 'high'].map((level) => (
                            <label key={level} className={`flex-1 flex items-center justify-center py-3 rounded-[18px] cursor-pointer transition-all font-black text-[10px] uppercase tracking-widest ${
                                formData.priority === level 
                                ? 'bg-white shadow-lg text-amber-600 border border-amber-50' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}>
                                <input
                                    type="radio"
                                    value={level}
                                    checked={formData.priority === level}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="hidden"
                                />
                                {level}
                            </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Strategic Suggestion</label>
                    <textarea
                        value={formData.suggestion}
                        onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                        rows={8}
                        placeholder="Detail the technical specifications or logistical requirements of your proposal..."
                        className="w-full px-8 py-8 bg-gray-50 border-2 border-gray-100 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-500 transition-all font-bold text-gray-900 resize-none min-h-[300px]"
                        required
                    />
                </div>

                <div className="pt-6">
                    <button
                    type="submit"
                    disabled={loading || submitted}
                    className="w-full py-8 bg-gray-900 text-white rounded-[32px] font-black text-xl uppercase tracking-widest hover:bg-black transition-all shadow-2xl hover:shadow-amber-100 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                    {loading ? (
                        <HiSparkles className="animate-spin text-2xl" />
                    ) : (
                        <>
                        Transmit Log
                        <HiPaperAirplane className="text-amber-400" />
                        </>
                    )}
                    </button>
                    <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-8">Secure End-to-End Encryption Enabled</p>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
