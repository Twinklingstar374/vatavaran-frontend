'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">VatavaranTrack</h3>
            <p className="text-gray-400 text-sm">
              Intelligent waste collection and approval system for a cleaner, greener future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/recycling-tips" className="text-gray-400 hover:text-white">
                  Recycling Tips
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/improvement" className="text-gray-400 hover:text-white">
                  Improvement Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@vatavarantrack.com</li>
              <li>📞 +91 1234567890</li>
              <li>📍 Mumbai, Maharashtra</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                💼
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 VatavaranTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
