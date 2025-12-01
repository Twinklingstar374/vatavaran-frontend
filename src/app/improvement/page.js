'use client';

import { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      console.log('Improvement form submitted:', formData);
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', category: '', suggestion: '', priority: 'medium' });
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="text-6xl mb-4">💡</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Improvement Suggestions</h1>
          <p className="text-xl text-gray-600">
            Help us improve VatavaranTrack! Share your ideas and suggestions.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 animate-slideUp">
          {submitted && (
            <div className="bg-green-50 text-green-600 p-6 rounded-2xl mb-8 border border-green-200 animate-fadeIn text-center">
              <div className="text-5xl mb-3">✓</div>
              <div className="text-lg font-semibold">Thank you for your suggestion!</div>
              <div className="text-sm opacity-90 mt-1">We appreciate your feedback and will review it soon.</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select a category</option>
                <option value="ui">User Interface</option>
                <option value="features">New Features</option>
                <option value="performance">Performance</option>
                <option value="mobile">Mobile Experience</option>
                <option value="reporting">Reporting & Analytics</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <div className="flex gap-4">
                {['low', 'medium', 'high'].map((level) => (
                  <label key={level} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      value={level}
                      checked={formData.priority === level}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="mr-2 w-5 h-5 text-purple-600"
                    />
                    <span className={`capitalize font-medium ${
                      formData.priority === level ? 'text-purple-600' : 'text-gray-600'
                    } group-hover:text-purple-600 transition-colors`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Suggestion</label>
              <textarea
                value={formData.suggestion}
                onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                rows={8}
                placeholder="Please describe your suggestion in detail..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Suggestion →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
