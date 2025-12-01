export const WASTE_CATEGORIES = [
  "DRY",
  "GREEN",
  "PLASTIC",
  "E_WASTE",
  "GLASS",
  "ORGANIC",
  "OTHER",
];

export const PICKUP_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

let pickupIdCounter = 100;
let mockPickups = [
  {
    id: 1,
    staffId: "staff1",
    staffName: "John Doe",
    category: "PLASTIC",
    weight: 25.5,
    status: "APPROVED",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: { lat: 40.7128, lng: -74.006, address: "Zone A" },
    photo: null,
  },
  {
    id: 2,
    staffId: "staff1",
    staffName: "John Doe",
    category: "ORGANIC",
    weight: 15.0,
    status: "PENDING",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    location: { lat: 40.758, lng: -73.9855, address: "Zone B" },
    photo: null,
  },
  {
    id: 3,
    staffId: "staff2",
    staffName: "Jane Smith",
    category: "E_WASTE",
    weight: 10.5,
    status: "APPROVED",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    location: { lat: 40.7489, lng: -73.968, address: "Zone A" },
    photo: null,
  },
  {
    id: 4,
    staffId: "staff2",
    staffName: "Jane Smith",
    category: "GLASS",
    weight: 8.0,
    status: "REJECTED",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    location: { lat: 40.7614, lng: -73.9776, address: "Zone C" },
    photo: null,
  },
  {
    id: 5,
    staffId: "staff3",
    staffName: "Mike Johnson",
    category: "GREEN",
    weight: 30.0,
    status: "APPROVED",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    location: { lat: 40.7549, lng: -73.984, address: "Zone B" },
    photo: null,
  },
];

export const getMockPickups = () => [...mockPickups];

export const addMockPickup = (pickup) => {
  const newPickup = {
    ...pickup,
    id: pickupIdCounter++,
    timestamp: new Date().toISOString(),
  };
  mockPickups.push(newPickup);
  return newPickup;
};

export const updateMockPickup = (id, updates) => {
  const index = mockPickups.findIndex((p) => p.id === parseInt(id));
  if (index !== -1) {
    mockPickups[index] = { ...mockPickups[index], ...updates };
    return mockPickups[index];
  }
  return null;
};

export const getPickupsByStaff = (staffId) => {
  return mockPickups.filter((p) => p.staffId === staffId);
};

export const getTodayStats = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayPickups = mockPickups.filter((p) => {
    const pickupDate = new Date(p.timestamp);
    pickupDate.setHours(0, 0, 0, 0);
    return pickupDate.getTime() === today.getTime();
  });

  const categoryStats = {};
  const staffStats = {};
  const zoneStats = {};

  todayPickups.forEach((pickup) => {
    if (pickup.status === "APPROVED") {
      categoryStats[pickup.category] = (categoryStats[pickup.category] || 0) + pickup.weight;
      staffStats[pickup.staffName] = (staffStats[pickup.staffName] || 0) + pickup.weight;
      const zone = pickup.location.address;
      zoneStats[zone] = (zoneStats[zone] || 0) + pickup.weight;
    }
  });

  return { categoryStats, staffStats, zoneStats };
};
