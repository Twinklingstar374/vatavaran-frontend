// Comprehensive waste management locations for Delhi NCR
// Categorized into Dump Zones and Specialized Recycling Centers

export const dumpZones = [
  // --- NORTH DELHI ---
  {
    id: 1,
    name: "Rohini Waste Management Hub",
    lat: 28.7041,
    lng: 77.1025,
    type: "DUMP_ZONE",
    category: "General Waste",
    capacity: "82%",
    status: "active",
    address: "Sector 11, Rohini, North Delhi",
    operatingHours: "24/7",
    acceptedWaste: ["Plastic", "Paper", "Metal", "Organic"]
  },
  {
    id: 2,
    name: "Civil Lines Recycling Unit",
    lat: 28.6811,
    lng: 77.2228,
    type: "RECYCLING_CENTER",
    category: "Specialized Recycling",
    capacity: "45%",
    status: "active",
    address: "Near Metro Station, Civil Lines",
    operatingHours: "9 AM - 8 PM",
    acceptedWaste: ["Paper", "Glass", "E-Waste"]
  },

  // --- SOUTH DELHI ---
  {
    id: 3,
    name: "Okhla Integrated Facility",
    lat: 28.5450,
    lng: 77.2732,
    type: "DUMP_ZONE",
    category: "Industrial & Domestic",
    capacity: "90%",
    status: "active",
    address: "Okhla Industrial Estate Phase III",
    operatingHours: "24/7",
    acceptedWaste: ["Metal", "Plastic", "Industrial"]
  },
  {
    id: 4,
    name: "Saket Eco-Point",
    lat: 28.5244,
    lng: 77.2167,
    type: "RECYCLING_CENTER",
    category: "Plastic & Paper",
    capacity: "30%",
    status: "active",
    address: "Press Enclave Road, Saket",
    operatingHours: "8 AM - 10 PM",
    acceptedWaste: ["Plastic", "Paper"]
  },

  // --- EAST DELHI ---
  {
    id: 5,
    name: "Gazipur Recovery Facility",
    lat: 28.6250,
    lng: 77.3300,
    type: "DUMP_ZONE",
    category: "Bulk Collection",
    capacity: "95%",
    status: "active",
    address: "Gazipur Border, East Delhi",
    operatingHours: "24/7",
    acceptedWaste: ["All Categories"]
  },
  {
    id: 6,
    name: "Laxmi Nagar Bins",
    lat: 28.6304,
    lng: 77.2777,
    type: "DUMP_ZONE",
    category: "Mixed Waste",
    capacity: "65%",
    status: "active",
    address: "Main Vikas Marg, Laxmi Nagar",
    operatingHours: "24/7",
    acceptedWaste: ["Plastic", "Organic", "Paper"]
  },

  // --- WEST DELHI ---
  {
    id: 7,
    name: "Dwarka Smart Bin A-1",
    lat: 28.5921,
    lng: 77.0460,
    type: "DUMP_ZONE",
    category: "Residential Waste",
    capacity: "55%",
    status: "active",
    address: "Sector 6, Dwarka, West Delhi",
    operatingHours: "24/7",
    acceptedWaste: ["Plastic", "Paper", "Metal"]
  },
  {
    id: 8,
    name: "Janakpuri E-Waste Hub",
    lat: 28.6214,
    lng: 77.0878,
    type: "RECYCLING_CENTER",
    category: "Electronic Waste",
    capacity: "20%",
    status: "active",
    address: "District Center, Janakpuri",
    operatingHours: "10 AM - 7 PM",
    acceptedWaste: ["Laptops", "Mobiles", "Batteries", "Plastics"]
  },

  // --- CENTRAL DELHI ---
  {
    id: 9,
    name: "Connaught Place Eco-bins",
    lat: 28.6304,
    lng: 77.2177,
    type: "RECYCLING_CENTER",
    category: "Public Area Recycling",
    capacity: "40%",
    status: "active",
    address: "Inner Circle, Connaught Place",
    operatingHours: "24/7",
    acceptedWaste: ["Plastic Bottles", "Cans", "Paper"]
  }
];

// Fallback to Central Delhi (Connaught Place)
export const fallbackLocation = {
  lat: 28.6304,
  lng: 77.2177
};
