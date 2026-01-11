'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiEnvelope, HiPhone, HiMapPin } from 'react-icons/hi2';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on map-intensive pages
  if (pathname === '/staff/dumpzones') {
    return null;
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">
              Vatavaran<span className="text-emerald-500">Track</span>
            </h3>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
              Next-generation environmental orchestration and industrial waste lifecycle management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Protocols</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Project Ethos
                </Link>
              </li>
              <li>
                <Link href="/recycling-tips" className="text-gray-400 hover:text-white transition-colors">
                  Recycling Ops
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Global Support
                </Link>
              </li>
              <li>
                <Link href="/improvement" className="text-gray-400 hover:text-white transition-colors">
                  System Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">HQ Contact</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li className="flex items-center gap-3 text-gray-400">
                <HiEnvelope className="text-emerald-500 text-lg" />
                ops@vatavarantrack.net
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <HiPhone className="text-emerald-500 text-lg" />
                +91 123 456 7890
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <HiMapPin className="text-emerald-500 text-lg" />
                Mumbai Hub, IN
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Network</h3>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-all transform hover:-translate-y-1">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-all transform hover:-translate-y-1">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-all transform hover:-translate-y-1">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-all transform hover:-translate-y-1">
                <FaLinkedin size={24} />
              </a>
            </div>
            <div className="mt-8">
                <div className="px-4 py-2 border border-emerald-500/20 rounded-full bg-emerald-500/5 inline-block text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    Operational Status: Online
                </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            &copy; 2026 VatavaranTrack. Precision Sustainability.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Security Details</a>
              <a href="#" className="hover:text-white transition-colors">Usage Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
