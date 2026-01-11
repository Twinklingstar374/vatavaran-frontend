'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
  const [filter, setFilter] = useState('ALL'); // ALL, DUMP_ZONE, RECYCLING_CENTER

  // Load Leaflet CSS and library
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported');
      setCurrentLocation(fallbackLocation);
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setLocationError('Could not get your location. Showing Central Delhi.');
        setCurrentLocation(fallbackLocation);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const filteredZones = useMemo(() => {
    let zones = currentLocation ? sortZonesByDistance(dumpZones, currentLocation) : dumpZones;
    if (filter !== 'ALL') {
      zones = zones.filter(z => z.type === filter);
    }
    return zones;
  }, [currentLocation, filter]);

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    if (currentLocation && mapRef.current) {
      const routePoints = generateRoute(currentLocation, { lat: zone.lat, lng: zone.lng });
      setRoute(routePoints);
      const bounds = getBounds([currentLocation, { lat: zone.lat, lng: zone.lng }]);
      if (bounds) mapRef.current.fitBounds(bounds, { padding: [100, 100] });
    }
  };

  const createCustomIcon = (type, isSelected) => {
    if (!L) return null;

    let color = '#3B82F6'; // Default Blue
    let iconPath = '';

    if (type === 'truck') {
      iconPath = '<path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>';
      color = '#2563EB';
    } else if (type === 'DUMP_ZONE') {
      iconPath = '<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>';
      color = '#F59E0B'; // Orange
    } else if (type === 'RECYCLING_CENTER') {
      iconPath = '<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>';
      color = '#8B5CF6'; // Purple
    }

    const html = `
      <div class="relative ${isSelected ? 'scale-125 z-50' : ''} transition-all duration-300">
        <div style="background-color: ${color}" class="rounded-2xl p-2.5 shadow-xl border-2 border-white text-white">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">${iconPath}</svg>
        </div>
        ${isSelected ? `<div style="border-top-color: ${color}" class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8"></div>` : ''}
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-marker',
      iconSize: [45, 45],
      iconAnchor: [22.5, 45],
      popupAnchor: [0, -45]
    });
  };

  if (loading || !L) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-bold text-gray-900">Initializing Map...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['STAFF']}>
      <div className="relative h-screen w-full overflow-hidden bg-gray-100">
        {/* Header Controls */}
        <div className="absolute top-6 left-6 right-6 z-[1000] flex flex-col md:flex-row gap-4 pointer-events-none">
          <button
            onClick={() => router.back()}
            className="pointer-events-auto w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all border border-gray-100"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="pointer-events-auto flex bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-white/50">
            {['ALL', 'DUMP_ZONE', 'RECYCLING_CENTER'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all tracking-wider ${
                  filter === type 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <MapContainer
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={13}
          className="h-full w-full grayscale-[0.2]"
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={createCustomIcon('truck', false)} />
          
          <Circle
            center={[currentLocation.lat, currentLocation.lng]}
            radius={200}
            pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.1, weight: 1 }}
          />

          {filteredZones.map((zone) => (
            <Marker
              key={zone.id}
              position={[zone.lat, zone.lng]}
              icon={createCustomIcon(zone.type, selectedZone?.id === zone.id)}
              eventHandlers={{ click: () => handleZoneClick(zone) }}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-black text-gray-900 text-sm mb-1">{zone.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{zone.type.replace('_', ' ')}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {route && (
            <Polyline
              positions={route}
              pathOptions={{ color: '#2563EB', weight: 4, opacity: 0.6, dashArray: '8, 12' }}
            />
          )}
        </MapContainer>

        {/* Info Sidebar (Desktop) / Bottom Sheet (Mobile) */}
        {selectedZone && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:top-6 md:bottom-auto md:w-96 z-[1000] bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-gray-100 p-8 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${
                  selectedZone.type === 'DUMP_ZONE' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {selectedZone.type.replace('_', ' ')}
                </span>
                <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2">{selectedZone.name}</h2>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm uppercase tracking-tighter">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {formatDistance(selectedZone.distance)} away
                </div>
              </div>
              <button onClick={() => { setSelectedZone(null); setRoute(null); }} className="p-2 hover:bg-gray-100 rounded-2xl transition-all">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <p className="text-gray-500 font-medium mb-8 leading-relaxed">{selectedZone.address}</p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
              <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Capacity</p>
                <p className="text-xl font-black text-gray-900">{selectedZone.capacity}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Hours</p>
                <p className="text-xl font-black text-gray-900">{selectedZone.operatingHours.split(' ')[0]}</p>
              </div>
            </div>

            <button
              onClick={() => { alert(`Navigation started to ${selectedZone.name}`); setSelectedZone(null); setRoute(null); }}
              className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-lg hover:bg-gray-800 transition-all shadow-2xl hover:shadow-gray-900/40 flex items-center justify-center gap-3"
            >
              Start Navigation
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
            </button>
          </div>
        )}

        {/* Global Styles for Marker Overlays */}
        <style jsx global>{`
          .custom-marker {
            background: none !important;
            border: none !important;
          }
          .leaflet-container {
            font-family: inherit;
          }
          .leaflet-popup-content-wrapper {
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          }
          .leaflet-popup-tip {
            display: none;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
