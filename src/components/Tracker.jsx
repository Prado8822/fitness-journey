import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const TrackerWithMap = () => {
  const [positions, setPositions] = useState([]); 
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const mapRef = useRef();

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const timestamp = pos.timestamp;

        setPositions((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const dist = getDistanceFromLatLonInMeters(
              last.lat,
              last.lon,
              latitude,
              longitude
            );
            const timeDiff = (timestamp - last.timestamp) / 1000; 
            const currSpeed = timeDiff > 0 ? dist / timeDiff : 0;
            setDistance((d) => d + dist);
            setSpeed(currSpeed * 3.6); 
          }

          return [...prev, { lat: latitude, lon: longitude, timestamp }];
        });

        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 16);
        }
      },
      (err) => alert('Ошибка геолокации: ' + err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-900/50 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
      <style>{`
        .leaflet-container {
          background: #0B0316 !important;
        }
        .leaflet-tile-pane {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
      
      <h2 className="text-lg font-bold mb-4 text-purple-200 tracking-wide drop-shadow-sm flex items-center gap-2">
        <span className="text-fuchsia-400">📍</span> Tracker aktywności
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0B0316]/60 border border-purple-500/20 rounded-2xl p-4 shadow-inner">
          <p className="text-xs text-purple-300/70 font-medium uppercase tracking-wider mb-1">Odległość</p>
          <p className="text-fuchsia-400 font-bold text-xl drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]">
            {(distance / 1000).toFixed(2)} <span className="text-sm font-normal text-purple-300">km</span>
          </p>
        </div>
        <div className="bg-[#0B0316]/60 border border-purple-500/20 rounded-2xl p-4 shadow-inner">
          <p className="text-xs text-purple-300/70 font-medium uppercase tracking-wider mb-1">Prędkość</p>
          <p className="text-indigo-400 font-bold text-xl drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]">
            {speed.toFixed(2)} <span className="text-sm font-normal text-purple-300">km/h</span>
          </p>
        </div>
      </div>

      <div className="h-64 w-full rounded-2xl overflow-hidden border border-purple-500/30 relative shadow-[0_0_20px_rgba(147,51,234,0.2)]">
        <MapContainer
          center={[52.069167, 19.480556]}
          zoom={4}
          className="h-full w-full z-0"
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {positions.length > 0 && (
            <>
              <Polyline
                positions={positions.map((p) => [p.lat, p.lon])}
                color="#d946ef"
                weight={4}
                opacity={0.8}
              />
              <Marker position={[positions[positions.length - 1].lat, positions[positions.length - 1].lon]} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default TrackerWithMap;