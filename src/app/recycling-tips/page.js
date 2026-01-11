'use client';

import { 
  HiSparkles, 
  HiGlobeAmericas, 
  HiBolt, 
  HiArrowPath, 
  HiCube, 
  HiSun, 
  HiComputerDesktop, 
  HiDocumentText, 
  HiShoppingBag,
  HiCheckBadge,
  HiCloudArrowDown,
  HiCurrencyDollar
} from "react-icons/hi2";

export default function RecyclingTipsPage() {
  const tips = [
    {
      title: "Plastic Polymers",
      icon: HiCube,
      color: "from-blue-600 to-cyan-500",
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=300&fit=crop",
      tips: [
        "Neutralize contaminants via rinsing",
        "Segregate polymers by resin codes",
        "Transition to multi-use alternatives",
        "Remove non-polymer enclosures",
        "Analyze recycling codes (1-7)"
      ]
    },
    {
      title: "Bio-Organic",
      icon: HiSun,
      color: "from-emerald-600 to-green-500",
      image: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=400&h=300&fit=crop",
      tips: [
        "Optimize microbial decomposition",
        "Segregate nutrient-rich biomass",
        "Deploy compost for landscape health",
        "Exclude high-fat organic materials",
        "Maintain optimal moisture levels"
      ]
    },
    {
      title: "E-Waste Assets",
      icon: HiComputerDesktop,
      color: "from-indigo-600 to-purple-500",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop",
      tips: [
        "Zero-landfill electronic disposal",
        "Utilize certified recovery centers",
        "Extend lifecycle through donation",
        "Perform secure data sanitization",
        "Isolate energy cells and batteries"
      ]
    },
    {
      title: "Pulp & Cellulose",
      icon: HiDocumentText,
      color: "from-amber-600 to-orange-500",
      image: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=400&h=300&fit=crop",
      tips: [
        "Systemic cellulose fiber recovery",
        "Remove adhesive and film overlays",
        "Optimize volumetric cardboard storage",
        "Execute dual-sided resource usage",
        "Procure recycled pulp derivatives"
      ]
    },
    {
      title: "Techno-Textiles",
      icon: HiShoppingBag,
      color: "from-rose-600 to-pink-500",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop",
      tips: [
        "Redistribute textile assets to NGOs",
        "Repurpose fibers for industrial cleaning",
        "Engage technical recycling programs",
        "Source durable high-density fabrics",
        "Prioritize cellular repair protocols"
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="relative w-full bg-slate-900 text-white min-h-[500px] md:min-h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=900&fit=crop')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 w-full">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-md rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <HiArrowPath className="text-sm animate-spin-slow" />
                Global Recycling Protocols
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-none">
              Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Resource</span> Recovery
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-xl">
                Operational guides and best practices to maximize environmental net-zero impact across all waste verticals.
            </p>
          </div>
          <div className="hidden lg:block">
              <HiGlobeAmericas className="text-[240px] text-emerald-500/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {tips.map((category, index) => (
            <div
              key={index}
              className="group bg-white rounded-[40px] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 mix-blend-multiply`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <category.icon className="text-5xl text-white mb-4 group-hover:scale-125 transition-transform duration-500" />
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{category.title}</h3>
                </div>
              </div>

              {/* Tips List */}
              <div className="p-10 flex-grow bg-white">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Execution Checklist</p>
                <ul className="space-y-4">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-4 group/item">
                      <div className="mt-1 p-1 bg-gray-50 rounded-lg group-hover/item:bg-emerald-50 transition-colors">
                        <HiCheckBadge className="text-emerald-500 text-lg" />
                      </div>
                      <span className="text-gray-600 font-medium leading-tight group-hover/item:text-gray-900 transition-colors">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Why Recycling Matters Section */}
        <div className="bg-white rounded-[48px] shadow-2xl p-16 md:p-24 border border-gray-100 relative overflow-hidden mb-24">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50"></div>
            
            <div className="relative z-10 text-center mb-20 animate-in fade-in duration-700">
                <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.5em] mb-4">Value Proposition</h2>
                <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none uppercase">The Logic of Circularity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
                {[
                {
                    icon: HiArrowPath,
                    title: 'Resource Loop',
                    description: 'Securing the supply chain by reclaiming and reinjecting vital materials back into productive utility.',
                    color: 'text-blue-600'
                },
                {
                    icon: HiCloudArrowDown,
                    title: 'Carbon Sink',
                    description: 'Systemically lowering organizational greenhouse gas footprints via optimized secondary processing.',
                    color: 'text-emerald-600'
                },
                {
                    icon: HiCurrencyDollar,
                    title: 'Venture Capital',
                    description: 'Unlocking dormant economic value in discarded assets through efficient recovery workflows.',
                    color: 'text-gray-900'
                }
                ].map((benefit, index) => (
                <div key={index} className="flex flex-col items-center md:items-start text-center md:text-left group">
                    <div className={`p-6 bg-gray-50 rounded-[32px] mb-8 group-hover:scale-110 transition-all ${benefit.color}`}>
                        <benefit.icon className="text-4xl" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">{benefit.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{benefit.description}</p>
                </div>
                ))}
            </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: '75%', label: 'Energy Savings', icon: HiBolt, color: 'bg-emerald-500' },
            { number: '95%', label: 'H2O Recovery', icon: HiGlobeAmericas, color: 'bg-blue-600' },
            { number: '100%', label: 'Potential Yield', icon: HiSparkles, color: 'bg-indigo-600' },
            { number: '∞', label: 'Ecosystem Cycle', icon: HiArrowPath, color: 'bg-gray-900' }
          ].map((stat, index) => (
            <div key={index} className="group relative bg-white p-10 rounded-[32px] shadow-lg border border-gray-100 hover:bg-gray-900 transition-all duration-500 overflow-hidden">
                <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                    <stat.icon className="text-8xl text-white" />
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="text-xl" />
                </div>
                <div className="text-5xl font-black text-gray-900 mb-1 tracking-tighter group-hover:text-white transition-colors">{stat.number}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-500 transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
