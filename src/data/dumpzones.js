// Mock dumping zone data for VatavaranTrack
// These are eco-friendly waste collection points around Delhi NCR

export const dumpZones = [
  {
    id: 1,
    name: "Sector 22 Eco Dump Point",
    lat: 28.5221,
    lng: 77.1922,
    category: "Plastic & Metal",
    capacity: "85%",
    status: "active",
    address: "Sector 22, Dwarka, New Delhi",
    operatingHours: "24/7",
    acceptedWaste: ["Plastic", "Metal", "Glass"]
  },
  {
    id: 2,
    name: "VatavaranTrack Central Bin",
    lat: 28.5248,
    lng: 77.2003,
    category: "All Types",
    capacity: "60%",
    status: "active",
    address: "Central Market, Dwarka, New Delhi",
    operatingHours: "6 AM - 10 PM",
    acceptedWaste: ["Plastic", "Paper", "Metal", "Glass", "Organic", "E-Waste"]
  },
  {
    id: 3,
    name: "Green Park Waste Depot",
    lat: 28.5267,
    lng: 77.1845,
    category: "Organic & Paper",
    capacity: "45%",
    status: "active",
    address: "Green Park Extension, New Delhi",
    operatingHours: "24/7",
    acceptedWaste: ["Organic", "Paper", "Clothes"]
  },
  {
    id: 4,
    name: "EcoCycle Recycling Hub",
    lat: 28.5182,
    lng: 77.1961,
    category: "E-Waste Specialist",
    capacity: "70%",
    status: "active",
    address: "Sector 18, Dwarka, New Delhi",
    operatingHours: "9 AM - 6 PM",
    acceptedWaste: ["E-Waste", "Metal", "Plastic"]
  },
  {
    id: 5,
    name: "Smart Collection Unit - A1",
    lat: 28.5294,
    lng: 77.1899,
    category: "Mixed Waste",
    capacity: "55%",
    status: "active",
    address: "Sector 21, Dwarka, New Delhi",
    operatingHours: "24/7",
    acceptedWaste: ["Plastic", "Paper", "Metal", "Glass"]
  }
];

// Fallback coordinates (Dwarka, Delhi) if geolocation fails
export const fallbackLocation = {
  lat: 28.5221,
  lng: 77.1922
};
