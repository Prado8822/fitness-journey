import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { Play, Square, Route, Zap, Radio, Check, Smile, X, Flame } from 'lucide-react'; // Добавил Flame
import localforage from 'localforage';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const calculateCalories = (duration, intensity, profile) => {
  const { weight, height, age, gender } = profile;
  
  if (!weight || !height || !age || !gender) return 0;

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseInt(age);
  const timeInHours = parseFloat(duration) / 60;

  let bmr = 10 * w + 6.25 * h - 5 * a;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  
  const bmrPerHour = bmr / 24;

  let met = 8.0; 

  if (intensity === 'low') met *= 0.8;
  if (intensity === 'high') met *= 1.2;

  const burnedCalories = Math.round(bmrPerHour * met * timeInHours);
  return burnedCalories > 0 ? burnedCalories : 0;
};

const TrackerWithMap = ({ onWorkoutSaved }) => {
  const { t } = useTranslation(); 
  const [positions, setPositions] = useState([]); 
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null); 
  const mapRef = useRef();

  const [userProfile, setUserProfile] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [savedStats, setSavedStats] = useState({ distance: '0.00', duration: '0' });
  const [selectedIntensity, setSelectedIntensity] = useState('medium'); 
  const [selectedMood, setSelectedMood] = useState('🙂');
  const [explodingButton, setExplodingButton] = useState(null); 

  const moods = [
    { id: 'terrible', emoji: '🥵' },
    { id: 'hard', emoji: '😫' },
    { id: 'normal', emoji: '😐' },
    { id: 'good', emoji: '🙂' },
    { id: 'great', emoji: '🤩' }
  ];

  const particles = Array.from({ length: 12 });
  
  const intensityStyles = {
    'low': { activeBg: 'bg-green-400/10 shadow-[0_0_15px_rgba(74,222,128,0.2)] border-green-500/40', idleBg: 'hover:bg-green-400/5', activeText: 'text-green-400', idleText: 'text-slate-500 hover:text-green-300/80', particle: 'bg-green-400' },
    'medium': { activeBg: 'bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.2)] border-yellow-500/40', idleBg: 'hover:bg-yellow-400/5', activeText: 'text-yellow-400', idleText: 'text-slate-500 hover:text-yellow-300/80', particle: 'bg-yellow-400' },
    'high': { activeBg: 'bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/40', idleBg: 'hover:bg-red-500/5', activeText: 'text-red-400', idleText: 'text-slate-500 hover:text-red-300/80', particle: 'bg-red-500' }
  };

  useEffect(() => {
    const loadProfile = async () => {
      const weight = await localforage.getItem('userWeight');
      const height = await localforage.getItem('userHeight');
      const age = await localforage.getItem('userAge');
      const gender = await localforage.getItem('userGender');
      setUserProfile({ weight, height, age, gender });
    };
    loadProfile();
  }, []);

  useEffect(() => {
    let watchId;
    if (isTracking) {
      if (!navigator.geolocation) {
        alert(t('tracker.geolocation_not_supported'));
        setIsTracking(false);
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const timestamp = pos.timestamp;

          setPositions((prev) => {
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              const dist = getDistanceFromLatLonInMeters(last.lat, last.lon, latitude, longitude);
              const timeDiff = (timestamp - last.timestamp) / 1000; 
              const currSpeed = timeDiff > 0 ? dist / timeDiff : 0;
              setDistance((d) => d + dist);
              setSpeed(currSpeed * 3.6); 
            }
            return [...prev, { lat: latitude, lon: longitude, timestamp }];
          });

          if (mapRef.current) mapRef.current.flyTo([latitude, longitude], 16);
        },
        (err) => { alert(t('tracker.error') + err.message); setIsTracking(false); },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      setSpeed(0);
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [isTracking, t]);

  const toggleTracking = () => {
    if (isTracking) {
      if (distance > 0 && startTime) {
        const durationMs = Date.now() - startTime;
        const durationMin = Math.max(1, Math.round(durationMs / 60000)); 
        const distKm = (distance / 1000).toFixed(2);
        
        setSavedStats({ distance: distKm, duration: durationMin.toString() });
        setSelectedIntensity('medium'); 
        setSelectedMood('🙂');           
        setShowModal(true);
      }

      setPositions([]);
      setDistance(0);
      setSpeed(0);
      setStartTime(null);
    } else {
      setStartTime(Date.now());
    }
    setIsTracking(!isTracking);
  };

  const handleIntensityClick = (level) => {
    setSelectedIntensity(level);
    setExplodingButton(level);
    setTimeout(() => setExplodingButton(null), 500);
  };

  const handleFinalSave = async () => {
    const finalCalories = calculateCalories(savedStats.duration, selectedIntensity, userProfile);

    const newActivity = {
      id: Date.now().toString(),
      type: 'Bieganie', 
      duration: savedStats.duration,
      distance: savedStats.distance,
      intensity: t(`add_activity.intensity_${selectedIntensity}`), 
      calories: finalCalories, // ДОБАВЛЯЕМ В БАЗУ
      mood: selectedMood,          
      date: new Date().toISOString().split('T')[0],
      customName: t('tracker.default_name') 
    };

    try {
      const storedActivities = (await localforage.getItem('activities')) || [];
      await localforage.setItem('activities', [...storedActivities, newActivity]);
    } catch (error) {
      console.error("Błąd podczas zapisywania z GPS:", error);
    }
    
    if (onWorkoutSaved) {
      onWorkoutSaved();
    }
    
    setShowModal(false);
  };

  return (
    <div className="bg-[#04111d]/60 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
      <style>{`
        .leaflet-container { background: #0B0316 !important; }
        .leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
        @keyframes particle-explode { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(0); opacity: 0; } }
        .animate-particle { animation: particle-explode 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
      `}</style>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-cyan-600/10 blur-[50px] pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 relative z-10 transform-gpu">
        <h2 className="text-xl font-black text-white tracking-wide drop-shadow-sm flex items-center gap-2">
          <Radio size={24} className="text-cyan-400" /> 
          {t('tracker.activity')}
        </h2>
        
        {isTracking ? (
          <div key="badge-live" className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            <span className="text-[10px] font-black text-red-400 tracking-widest uppercase">{t('tracker.live')}</span>
          </div>
        ) : (
          <div key="badge-offline" className="flex items-center gap-2 px-3 py-1 bg-slate-500/20 border border-slate-500/50 rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{t('tracker.offline')}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className={`bg-gradient-to-br from-[#0B0316]/80 to-[#04111d]/80 border rounded-2xl p-4 transition-all duration-300 ${isTracking ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-cyan-900/40'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Route size={16} className={isTracking ? "text-emerald-400" : "text-cyan-600"} />
            <p className="text-[10px] text-cyan-200/70 font-bold uppercase tracking-wider">{t('tracker.distance')}</p>
          </div>
          <p className={`font-black text-2xl transition-all duration-300 ${isTracking ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'text-cyan-100'}`}>
            {(distance / 1000).toFixed(2)} <span className="text-xs font-semibold text-cyan-500/60 uppercase tracking-widest">km</span>
          </p>
        </div>
        
        <div className={`bg-gradient-to-br from-[#0B0316]/80 to-[#04111d]/80 border rounded-2xl p-4 transition-all duration-300 ${isTracking ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-cyan-900/40'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className={isTracking ? "text-cyan-400" : "text-cyan-600"} />
            <p className="text-[10px] text-cyan-200/70 font-bold uppercase tracking-wider">{t('tracker.speed')}</p>
          </div>
          <p className={`font-black text-2xl transition-all duration-300 ${isTracking ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-cyan-100'}`}>
            {speed.toFixed(1)} <span className="text-xs font-semibold text-cyan-500/60 uppercase tracking-widest">km/h</span>
          </p>
        </div>
      </div>

      <div className={`h-64 w-full rounded-2xl overflow-hidden relative transition-all duration-500 z-10 ${isTracking ? 'border-2 border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border border-cyan-500/20 bg-[#061422]'}`}>
        {!isTracking ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 border-2 border-cyan-500/30 rounded-full animate-ping"></div>
                <div className="w-48 h-48 border border-cyan-500/20 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
             </div>
             <Radio size={40} className="text-cyan-500 mb-3 z-10 animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
             <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs z-10">{t('tracker.ready_to_start')}</span>
             <span className="text-cyan-600 text-[10px] uppercase tracking-wider mt-1 z-10">{t('tracker.waiting_for_gps')}</span>
          </div>
        ) : (
          <MapContainer
            center={[52.069167, 19.480556]}
            zoom={5}
            className="h-full w-full z-0"
            whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
            {positions.length > 0 && (
              <>
                <Polyline positions={positions.map((p) => [p.lat, p.lon])} color="#10b981" weight={5} opacity={0.9} className="drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <Marker position={[positions[positions.length - 1].lat, positions[positions.length - 1].lon]} />
              </>
            )}
          </MapContainer>
        )}
      </div>

      <div className="mt-6 relative z-10">
        <button
          onClick={toggleTracking}
          className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 ${
            isTracking 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/50 hover:bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
              : 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white border border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]'
          }`}
        >
          {isTracking ? <><Square size={18} /> {t('tracker.stop_workout')}</> : <><Play size={18} /> {t('tracker.start_workout')}</>}
        </button>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0316]/90 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="bg-[#13072E] border border-cyan-500/30 rounded-[2rem] p-5 w-full max-w-sm shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-300 relative">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-cyan-500/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-white tracking-wide mb-1 text-center mt-1">{t('tracker.summary')}</h3>
            <p className="text-cyan-200/50 text-[10px] font-medium mb-4 text-center uppercase tracking-widest">{t('tracker.rate_workout')}</p>
            
            <div className="flex justify-center gap-4 mb-2.5 bg-[#0B0316]/50 p-3 rounded-2xl border border-cyan-900/50 shadow-inner">
              <div className="flex-1 text-center">
                <p className="text-[9px] text-cyan-200/70 font-bold uppercase tracking-wider mb-0.5">{t('tracker.distance_short')}</p>
                <p className="font-black text-xl text-cyan-400">{savedStats.distance} <span className="text-[10px] text-cyan-500/60 uppercase">km</span></p>
              </div>
              <div className="w-px bg-cyan-900/50"></div>
              <div className="flex-1 text-center">
                <p className="text-[9px] text-cyan-200/70 font-bold uppercase tracking-wider mb-0.5">{t('tracker.time_short')}</p>
                <p className="font-black text-xl text-emerald-400">{savedStats.duration} <span className="text-[10px] text-emerald-500/60 uppercase">min</span></p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4 bg-orange-500/10 border border-orange-500/20 rounded-xl py-2 px-3 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <Flame size={16} className="text-orange-500 animate-pulse" />
              <span className="text-[10px] text-orange-200/70 font-bold uppercase tracking-wider">{t('stats_page.charts.calories', {defaultValue: 'Spalone kalorie'})}:</span>
              <span className="font-black text-lg text-orange-400">{calculateCalories(savedStats.duration, selectedIntensity, userProfile)} kcal</span>
            </div>

            <div className="mb-4">
              <label className="flex items-center justify-center gap-1.5 mb-1.5 text-[11px] font-medium text-cyan-200/70 tracking-wide uppercase">
                <Zap size={12} className="text-yellow-400" /> {t('tracker.intensity')}
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#0B0316]/50 border border-cyan-900/40 rounded-xl relative overflow-hidden">
                {['low', 'medium', 'high'].map((level) => {
                  const isSelected = selectedIntensity === level;
                  const styles = intensityStyles[level];
                  return (
                    <button
                      key={level}
                      onClick={() => handleIntensityClick(level)}
                      className={`relative group py-1.5 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-95 border ${
                        isSelected ? styles.activeBg : `border-transparent ${styles.idleBg}`
                      }`}
                    >
                      <span className={`relative z-10 font-bold text-[10px] sm:text-xs tracking-widest uppercase transition-colors duration-300 ${isSelected ? styles.activeText : styles.idleText}`}>
                        {t(`add_activity.intensity_${level}`)}
                      </span>
                      {explodingButton === level && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {particles.map((_, index) => (
                            <div 
                              key={index} 
                              className={`absolute w-1.5 h-1.5 rounded-full animate-particle ${styles.particle}`}
                              style={{
                                '--tw-translate-x': `${(Math.random() - 0.5) * 100}px`,
                                '--tw-translate-y': `${(Math.random() - 0.5) * 60}px`,
                                animationDelay: `${Math.random() * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-5">
              <label className="flex items-center justify-center gap-1.5 mb-1.5 text-[11px] font-medium text-cyan-200/70 tracking-wide uppercase">
                <Smile size={12} className="text-emerald-400" /> {t('tracker.mood')}
              </label>
              <div className="flex justify-between items-center p-1.5 bg-[#0B0316]/50 border border-cyan-900/40 rounded-xl">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.emoji)}
                    className={`text-xl sm:text-2xl p-1 rounded-lg transition-all duration-200 ${
                      selectedMood === m.emoji 
                        ? 'bg-cyan-500/20 scale-110 opacity-100 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                        : 'opacity-40 hover:opacity-100 hover:scale-110'
                    }`}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleFinalSave}
              className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all duration-300 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 flex items-center justify-center gap-2"
            >
              <Check size={18} strokeWidth={3} />
              {t('tracker.save_workout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerWithMap;