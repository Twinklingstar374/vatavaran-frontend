'use client';

import { 
  HiGlobeAmericas, 
  HiMapPin, 
  HiUserGroup, 
  HiPhoto, 
  HiCheckBadge, 
  HiChartBar, 
  HiSparkles,
  HiLightBulb,
  HiHandRaised,
  HiHeart
} from "react-icons/hi2";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Hero Banner */}
      <div className="relative w-full h-[600px] bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=800&fit=crop')] bg-cover bg-center"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-md rounded-full border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
            <HiSparkles className="text-sm" />
            Our Vision for 2030
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
            Advancing Global <span className="text-emerald-400">Sustainability</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed">
            At VatavaranTrack, we're building the infrastructure for a circular economy, leveraging deep technology to solve humanity's most pressing waste challenges.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-32 relative z-30 pb-24">
        {/* Mission Statement */}
        <div className="bg-white rounded-[40px] shadow-2xl p-16 mb-20 border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:bg-emerald-50 transition-colors duration-1000"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-6">Execution Strategy</h2>
            <p className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
              "To create a cleaner future by providing elite waste intelligence that empowers every community to make a measurable impact."
            </p>
            <div className="flex justify-center">
                <div className="h-1.5 w-24 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Core Capabilities</h2>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">The engine behind the movement</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: HiMapPin, title: 'GPS Verification', desc: 'Immutable collection tracking powered by precise geospatial intelligence.', color: 'text-blue-600' },
              { icon: HiUserGroup, title: 'Network Orchestration', desc: 'Proprietary role hierarchies for seamless staff and administrative coordination.', color: 'text-indigo-600' },
              { icon: HiPhoto, title: 'Visual Evidence', desc: 'Secure image documentation ensuring data integrity for every collection.', color: 'text-blue-500' },
              { icon: HiCheckBadge, title: 'Quality Assurance', desc: 'Multi-tier approval workflows to maintain organizational standards.', color: 'text-emerald-500' },
              { icon: HiChartBar, title: 'Predictive Analytics', desc: 'Actionable data insights designed for executive decision-making.', color: 'text-gray-900' },
              { icon: HiGlobeAmericas, title: 'Global Impact', desc: 'Environmental monitoring that visualizes real-world net-zero progress.', color: 'text-blue-700' }
            ].map((feature, index) => (
              <div key={index} className="p-10 bg-white rounded-[32px] shadow-lg hover:shadow-2xl transition-all border border-gray-100 flex flex-col group">
                <div className={`text-4xl p-4 bg-gray-50 rounded-2xl w-fit mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                    <feature.icon />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gray-900 rounded-[48px] p-20 text-white mb-24 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent)]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="md:w-1/3">
                <h2 className="text-4xl font-black mb-6 tracking-tighter leading-tight uppercase">Quantifying Our <span className="text-blue-500">Collective Success</span></h2>
                <p className="text-gray-400 font-medium italic">Our platform drives measurable results for the planet, tracked in real-time across the network.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full">
              {[
                { number: '10k+', label: 'Collections', icon: HiSparkles, color: 'text-blue-400' },
                { number: '2.5t', label: 'CO₂ Avoided', icon: HiGlobeAmericas, color: 'text-emerald-400' },
                { number: '100+', label: 'Operators', icon: HiUserGroup, color: 'text-indigo-400' }
              ].map((stat, index) => (
                <div key={index} className="text-center md:text-left">
                  <stat.icon className={`text-4xl mb-4 ${stat.color}`} />
                  <div className="text-6xl font-black mb-1 tracking-tighter">{stat.number}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: HiLightBulb, title: 'Radical Innovation', desc: 'Pushing the boundaries of what technologies can do for our environment.', color: 'bg-amber-50 text-amber-600' },
            { icon: HiHandRaised, title: 'Unity of Effort', desc: 'Deep collaboration across communities, staff, and leadership tiers.', color: 'bg-blue-50 text-blue-600' },
            { icon: HiHeart, title: 'Ethical Stewardship', desc: 'An unwavering commitment to long-term biodiversity and ecological health.', color: 'bg-rose-50 text-rose-600' }
          ].map((value, index) => (
            <div key={index} className="text-center p-12 bg-white rounded-[40px] shadow-sm border border-gray-100 hover:border-gray-300 transition-all flex flex-col items-center">
              <div className={`text-5xl p-6 rounded-[24px] mb-8 ${value.color}`}>
                <value.icon />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">{value.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
