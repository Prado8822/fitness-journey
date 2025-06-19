import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Функция для подсчёта расстояния между двумя точками в метрах
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // радиус Земли в метрах
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
  const [positions, setPositions] = useState([]); // {lat, lon, timestamp}
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
            const timeDiff = (timestamp - last.timestamp) / 1000; // секунды
            const currSpeed = timeDiff > 0 ? dist / timeDiff : 0;
            setDistance((d) => d + dist);
            setSpeed(currSpeed * 3.6); // перевод в км/ч
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
    <div>
      <h2>Трекер активности</h2>
      <p>Пройдено: {(distance / 1000).toFixed(2)} км</p>
      <p>Скорость: {speed.toFixed(2)} км/ч</p>

      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
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
              color="blue"
            />
            <Marker position={[positions[positions.length - 1].lat, positions[positions.length - 1].lon]} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default TrackerWithMap;
