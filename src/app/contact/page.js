'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { 
  HiEnvelope, 
  HiPhone, 
  HiMapPin, 
  HiPaperAirplane, 
  HiCheckBadge, 
  HiXMark,
  HiGlobeAmericas,
  HiCommandLine,
  HiChatBubbleLeftEllipsis
} from "react-icons/hi2";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch transmission. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16 animate-in fade-in slide-in-from-left-5 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100">
            <HiCommandLine className="text-sm" />
            Global Support
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6 leading-none uppercase">
            Start the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Dialogue</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Reach out to our executive response team for any operational queries, technical support, or partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-12 border border-gray-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-colors duration-1000 group-hover:bg-blue-100"></div>

                <div className="relative z-10">
                    {submitted && (
                    <div className="bg-emerald-50 text-emerald-700 p-6 rounded-3xl mb-8 border border-emerald-100 font-black text-sm uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in">
                        <HiCheckBadge className="text-2xl" />
                        Transmission Successful. Expect a response shortly.
                    </div>
                    )}

                    {error && (
                    <div className="bg-rose-50 text-rose-700 p-6 rounded-3xl mb-8 border border-rose-100 font-black text-sm uppercase tracking-widest flex items-center gap-3 animate-in shake duration-500">
                        <HiXMark className="text-2xl" />
                        {error}
                    </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Full Identity</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Access Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Reference Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900"
                                placeholder="Purpose of Enquiry"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Transmission Content</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={6}
                                className="w-full px-6 py-6 bg-gray-50 border-2 border-gray-100 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900 resize-none h-48"
                                placeholder="Elucidate your requirements..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || submitted}
                            className="w-full py-6 bg-gray-900 text-white rounded-[32px] font-black text-xl uppercase tracking-widest hover:bg-black transition-all shadow-2xl hover:shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <HiPaperAirplane className="animate-pulse" />
                            ) : (
                                <>
                                    Dispatch Transmission
                                    <HiPaperAirplane className="text-blue-400" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-white rounded-[40px] shadow-xl p-10 border border-gray-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-10 flex items-center gap-2">
                    <HiGlobeAmericas className="text-blue-600 text-lg" />
                    Global Terminals
                </h3>
                <div className="space-y-10">
                    {[
                        { icon: HiEnvelope, label: 'Secure Email', value: 'ops@vatavarantrack.com', color: 'bg-blue-50 text-blue-600' },
                        { icon: HiPhone, label: 'Direct Hotline', value: '+91 (123) 456-7890', color: 'bg-emerald-50 text-emerald-600' },
                        { icon: HiMapPin, label: 'Operational HQ', value: 'Innovation Hub, Mumbai, IN', color: 'bg-gray-900 text-white' }
                    ].map((item, index) => (
                        <div key={index} className="flex items-start gap-6 group">
                            <div className={`p-4 rounded-2xl ${item.color} text-2xl group-hover:scale-110 transition-transform shadow-sm`}>
                                <item.icon />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                                <div className="text-lg font-black text-gray-900">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-[40px] shadow-2xl p-10 text-white relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mb-24 -mr-24 opacity-50"></div>
                
                <h3 className="text-xl font-black mb-8 uppercase tracking-widest flex items-center gap-2 relative z-10">
                    <HiChatBubbleLeftEllipsis className="text-blue-400" />
                    Connect Hub
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    {['Intelligence', 'LinkedIn', 'Terminal', 'Meta'].map((platform, index) => (
                    <button
                        key={index}
                        className="bg-white/5 backdrop-blur-md border border-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
                    >
                        {platform}
                    </button>
                    ))}
                </div>
                <div className="mt-10 pt-10 border-t border-white/5 relative z-10">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Operational 24/7/365</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
