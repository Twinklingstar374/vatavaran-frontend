'use client';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      {/* Hero Banner */}
      <div className="relative w-full h-96 bg-gradient-to-r from-blue-600 to-green-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=400&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-white text-center px-4">
          <div className="animate-fadeIn">
            <div className="text-6xl mb-4">🌿</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About VatavaranTrack</h1>
            <p className="text-xl md:text-2xl opacity-90">Building a Sustainable Future Together</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Statement */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12 border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mb-8">
            To create a cleaner, greener future by providing efficient waste tracking and management 
            solutions that empower communities to make a positive environmental impact through intelligent 
            technology and sustainable practices.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '📍', title: 'GPS Location Tracking', desc: 'Real-time waste collection tracking with precise GPS coordinates' },
              { icon: '👥', title: 'Role-Based Access', desc: 'Dedicated dashboards for Staff, Supervisors, and Administrators' },
              { icon: '📸', title: 'Photo Evidence', desc: 'Visual documentation and categorization of waste types' },
              { icon: '✅', title: 'Approval Workflow', desc: 'Quality control through supervisor approval system' },
              { icon: '📊', title: 'Analytics & Reports', desc: 'Comprehensive insights for better decision making' },
              { icon: '🌱', title: 'Impact Tracking', desc: 'Monitor environmental impact and CO₂ savings' }
            ].map((feature, index) => (
              <div key={index} className="flex items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-5xl mr-4">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white mb-12 shadow-2xl">
          <h2 className="text-4xl font-bold mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '1000+', label: 'Waste Collections', icon: '♻️' },
              { number: '500kg', label: 'CO₂ Saved', icon: '🌱' },
              { number: '50+', label: 'Active Users', icon: '👥' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                <div className="text-6xl mb-3">{stat.icon}</div>
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🎯', title: 'Innovation', desc: 'Leveraging technology for environmental solutions' },
            { icon: '🤝', title: 'Collaboration', desc: 'Working together for a sustainable future' },
            { icon: '💚', title: 'Sustainability', desc: 'Committed to long-term environmental impact' }
          ].map((value, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="text-6xl mb-4">{value.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
