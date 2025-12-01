'use client';

export default function RecyclingTipsPage() {
  const tips = [
    {
      title: "Plastic Waste",
      icon: "♻️",
      color: "from-blue-500 to-cyan-500",
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=300&fit=crop",
      tips: [
        "Rinse containers before recycling",
        "Remove caps and labels when possible",
        "Avoid single-use plastics",
        "Use reusable bags and bottles",
        "Check recycling codes (1-7)"
      ]
    },
    {
      title: "Organic Waste",
      icon: "🌱",
      color: "from-green-500 to-emerald-500",
      image: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=400&h=300&fit=crop",
      tips: [
        "Compost food scraps and yard waste",
        "Separate organic waste from other trash",
        "Use compost for gardening",
        "Avoid meat and dairy in home compost",
        "Keep compost moist but not wet"
      ]
    },
    {
      title: "E-Waste",
      icon: "💻",
      color: "from-purple-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop",
      tips: [
        "Never throw electronics in regular trash",
        "Find certified e-waste recycling centers",
        "Donate working devices",
        "Remove personal data before recycling",
        "Recycle batteries separately"
      ]
    },
    {
      title: "Paper Waste",
      icon: "📄",
      color: "from-orange-500 to-yellow-500",
      image: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=400&h=300&fit=crop",
      tips: [
        "Recycle newspapers, magazines, and cardboard",
        "Remove plastic windows from envelopes",
        "Flatten cardboard boxes",
        "Use both sides of paper",
        "Choose recycled paper products"
      ]
    },
    {
      title: "Clothes & Textiles",
      icon: "👕",
      color: "from-red-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop",
      tips: [
        "Donate wearable clothes to charity",
        "Repurpose old fabrics for cleaning",
        "Find textile recycling programs",
        "Buy quality items that last longer",
        "Repair instead of replacing"
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=400&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6 animate-bounce-slow">♻️</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
            Recycling Tips & Best Practices
          </h1>
          <p className="text-2xl md:text-3xl text-green-100 max-w-3xl mx-auto mb-4 animate-slideUp">
            "Small actions create big impact"
          </p>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Learn how to properly recycle different types of waste and contribute to a cleaner, greener planet
          </p>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((category, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2 group-hover:scale-125 transition-transform">{category.icon}</div>
                    <h3 className="text-2xl font-bold">{category.title}</h3>
                  </div>
                </div>
              </div>

              {/* Tips List */}
              <div className="p-6">
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start group/item">
                      <span className="text-green-500 mr-3 mt-1 text-lg group-hover/item:scale-125 transition-transform">✓</span>
                      <span className="text-gray-700 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Why Recycling Matters Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Why Recycling Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: '🌍',
                title: 'Save Resources',
                description: 'Recycling conserves natural resources and reduces the need for raw materials extraction'
              },
              {
                icon: '💨',
                title: 'Reduce Emissions',
                description: 'Proper recycling reduces greenhouse gas emissions and air pollution significantly'
              },
              {
                icon: '💰',
                title: 'Save Energy',
                description: 'Recycling uses less energy than producing new products from raw materials'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all">
                <div className="text-6xl mb-4 group-hover:animate-bounce-slow">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { number: '75%', label: 'Energy Saved', icon: '⚡' },
            { number: '95%', label: 'Water Saved', icon: '💧' },
            { number: '100%', label: 'Recyclable', icon: '♻️' },
            { number: '∞', label: 'Times Reusable', icon: '🔄' }
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-green-500 to-blue-500 text-white p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="text-5xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
