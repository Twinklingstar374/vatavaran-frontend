// Map utility functions for distance calculation and route generation

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param {number} km - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(2)} km`;
}

/**
 * Generate a simple curved route between two points
 * Creates intermediate points for a smooth polyline
 * @param {object} start - Start coordinates {lat, lng}
 * @param {object} end - End coordinates {lat, lng}
 * @returns {array} Array of [lat, lng] coordinates
 */
export function generateRoute(start, end) {
  const points = [];
  const steps = 20; // Number of intermediate points
  
  // Calculate control point for bezier curve (offset to the side)
  const midLat = (start.lat + end.lat) / 2;
  const midLng = (start.lng + end.lng) / 2;
  
  // Offset perpendicular to the line for curve effect
  const dx = end.lng - start.lng;
  const dy = end.lat - start.lat;
  const offset = 0.002; // Adjust for curve intensity
  
  const controlLat = midLat - dx * offset;
  const controlLng = midLng + dy * offset;
  
  // Generate points along quadratic bezier curve
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = 
      Math.pow(1 - t, 2) * start.lat +
      2 * (1 - t) * t * controlLat +
      Math.pow(t, 2) * end.lat;
    const lng =
      Math.pow(1 - t, 2) * start.lng +
      2 * (1 - t) * t * controlLng +
      Math.pow(t, 2) * end.lng;
    
    points.push([lat, lng]);
  }
  
  return points;
}

/**
 * Get bounds that include all points
 * @param {array} points - Array of {lat, lng} objects
 * @returns {array} [[minLat, minLng], [maxLat, maxLng]]
 */
export function getBounds(points) {
  if (!points || points.length === 0) return null;
  
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;
  
  points.forEach(point => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  });
  
  return [
    [minLat, minLng],
    [maxLat, maxLng]
  ];
}

/**
 * Sort dump zones by distance from current location
 * @param {array} zones - Array of dump zones
 * @param {object} currentLocation - Current location {lat, lng}
 * @returns {array} Sorted array of zones with distance property
 */
export function sortZonesByDistance(zones, currentLocation) {
  return zones.map(zone => ({
    ...zone,
    distance: calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      zone.lat,
      zone.lng
    )
  })).sort((a, b) => a.distance - b.distance);
}
