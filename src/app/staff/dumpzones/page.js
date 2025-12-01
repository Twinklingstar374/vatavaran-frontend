'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { dumpZones, fallbackLocation } from '../../../data/dumpzones';
import { calculateDistance, formatDistance, generateRoute, getBounds, sortZonesByDistance } from '../../../utils/mapHelpers';

// Dynamically import map components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

export default function DumpZonesMapPage() {
  const router = useRouter();
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [route, setRoute] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(true);
  const [L, setL] = useState(null);
  const [zonesWithDistance, setZonesWithDistance] = useState([]);

  // Load Leaflet CSS and library
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      // Fix for default marker icons
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setCurrentLocation(fallbackLocation);
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        setLoading(false);
        console.log('Location updated:', location);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Could not get your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        setLocationError(errorMessage);
        setCurrentLocation(fallbackLocation);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Calculate distances when location changes
  useEffect(() => {
    if (currentLocation) {
      const sorted = sortZonesByDistance(dumpZones, currentLocation);
      setZonesWithDistance(sorted);
    }
  }, [currentLocation]);

  // Handle zone selection
  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    
    if (currentLocation && mapRef.current) {
      // Generate route
      const routePoints = generateRoute(currentLocation, { lat: zone.lat, lng: zone.lng });
      setRoute(routePoints);

      // Fit bounds to show route
      const bounds = getBounds([
        currentLocation,
        { lat: zone.lat, lng: zone.lng }
      ]);
      
      if (bounds && mapRef.current) {
        mapRef.current.fitBounds(bounds, { padding: [100, 100] });
      }
    }
  };

  // Handle mark as dumped
  const handleMarkAsDumped = () => {
    if (selectedZone) {
      alert(`Marked ${selectedZone.name} as dumped!`);
      setSelectedZone(null);
      setRoute(null);
    }
  };

  // Custom icons
  const createCustomIcon = (type) => {
    if (!L) return null;

    const iconHtml = type === 'truck' 
      ? `<div class="relative">
          <div class="absolute -inset-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          <div class="relative bg-blue-600 rounded-full p-3 shadow-lg">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
            </svg>
          </div>
        </div>`
      : `<div class="relative ${selectedZone?.id === type ? 'animate-bounce' : ''}">
          <div class="bg-green-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>`;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  if (loading || !L) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading map...</p>
            <p className="text-sm text-gray-500 mt-2">Getting your location</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!currentLocation) {
    return (
      <ProtectedRoute allowedRoles={['STAFF']}>
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-md p-8 bg-white rounded-2xl shadow-2xl text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location Required</h2>
            <p className="text-gray-600 mb-6">{locationError || 'Please enable location access to view dumping zones.'}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['STAFF']}>
      <div className="relative h-screen w-screen overflow-hidden">
        {/* Map Container */}
        <MapContainer
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={14}
          className="h-full w-full z-0"
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Staff Location Marker */}
          <Marker 
            position={[currentLocation.lat, currentLocation.lng]}
            icon={createCustomIcon('truck')}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold text-blue-600">Your Location</p>
                <p className="text-xs text-gray-600">Waste Collection Vehicle</p>
              </div>
            </Popup>
          </Marker>

          {/* Pulsing circle around staff location */}
          <Circle
            center={[currentLocation.lat, currentLocation.lng]}
            radius={100}
            pathOptions={{
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.1,
              weight: 2
            }}
          />

          {/* Dump Zone Markers */}
          {zonesWithDistance.map((zone) => (
            <Marker
              key={zone.id}
              position={[zone.lat, zone.lng]}
              icon={createCustomIcon(zone.id)}
              eventHandlers={{
                click: () => handleZoneClick(zone)
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-green-700 mb-2">{zone.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{zone.category}</p>
                  <p className="text-xs text-gray-600 mb-1">Capacity: {zone.capacity}</p>
                  <p className="text-xs font-semibold text-blue-600">
                    {formatDistance(zone.distance)} away
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route Polyline */}
          {route && (
            <Polyline
              positions={route}
              pathOptions={{
                color: '#10B981',
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 10',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}
        </MapContainer>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Bottom Sheet */}
        {selectedZone && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-2xl p-6 animate-slideUp">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedZone.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{selectedZone.address}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {selectedZone.category}
                  </span>
                  <span className="text-gray-600">
                    📍 {formatDistance(selectedZone.distance)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedZone(null);
                  setRoute(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Operating Hours</p>
                <p className="font-semibold text-gray-900">{selectedZone.operatingHours}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Capacity</p>
                <p className="font-semibold text-gray-900">{selectedZone.capacity}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Accepted Waste Types:</p>
              <div className="flex flex-wrap gap-2">
                {selectedZone.acceptedWaste.map((type, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleMarkAsDumped}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              Mark as Dumped ✓
            </button>
          </div>
        )}

        {/* Zone List (when no zone selected) */}
        {!selectedZone && zonesWithDistance.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-2xl shadow-xl p-4 max-h-48 overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-3">Nearby Dump Zones</h3>
            <div className="space-y-2">
              {zonesWithDistance.slice(0, 3).map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-green-50 rounded-xl transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{zone.name}</p>
                      <p className="text-xs text-gray-600">{zone.category}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600">
                      {formatDistance(zone.distance)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom CSS for animations */}
        <style jsx global>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
          .custom-marker {
            background: none;
            border: none;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
