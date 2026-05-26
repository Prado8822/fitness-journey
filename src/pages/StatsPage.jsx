import React, { useEffect, useState } from 'react';
import Stats from '../components/Stats';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, MapPin, Activity, Flame, Trophy, CalendarDays, Brain, Heart, TrendingUp, TrendingDown, Medal } from 'lucide-react'; 

const COLORS = ['#d946ef', '#8b5cf6', '#6366f1', '#ec4899', '#a855f7'];

const formatFriendlyDate = (dateStr) => {
  if (!dateStr) return 'Brak danych';
  const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  return `${day} ${month}`;
};

const StatsPage = () => {
  const [activities, setActivities] = useState([]);
  const [timeFilter, setTimeFilter] = useState('wszystko'); // 'tydzien', 'miesiac', 'wszystko'
  const [selectedDayActivities, setSelectedDayActivities] = useState(null);
  const [selectedActivityItem, setSelectedActivityItem] = useState(null);

  console.log("Selected Activities:", selectedDayActivities);

  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

  // --- ЛОГИКА ФИЛЬТРАЦИИ ДЛЯ ГРАФИКОВ ---
  const getFilteredActivities = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return activities.filter(act => {
      if (timeFilter === 'wszystko') return true;
      
      const actDate = new Date(act.date);
      actDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(now - actDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeFilter === 'tydzien') return diffDays <= 7;
      if (timeFilter === 'miesiac') return diffDays <= 30;
      return true;
    });
  };

  const filteredActivities = getFilteredActivities();

  // --- ПОДСЧЕТЫ ДЛЯ ГРАФИКОВ ---
  const dailyTotals = filteredActivities.reduce((acc, act) => {
    acc[act.date] = (acc[act.date] || 0) + parseInt(act.duration || 0);
    return acc;
  }, {});

  const dataForBar = Object.entries(dailyTotals)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, duration]) => ({
      date: formatFriendlyDate(date),
      duration,
    }));

  const typeTotals = filteredActivities.reduce((acc, act) => {
    acc[act.type] = (acc[act.type] || 0) + 1;
    return acc;
  }, {});

  const dataForPie = Object.entries(typeTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // --- ТРЕНДЫ (ЭТА НЕДЕЛЯ VS ПРОШЛАЯ НЕДЕЛЯ) ---
  const now = new Date();
  const past7Days = activities.filter(a => (now - new Date(a.date)) <= 7 * 24 * 60 * 60 * 1000).length;
  const prev7Days = activities.filter(a => {
    const diff = now - new Date(a.date);
    return diff > 7 * 24 * 60 * 60 * 1000 && diff <= 14 * 24 * 60 * 60 * 1000;
  }).length;
  
  let trendIcon = null;
  let trendText = '';
  let trendColor = '';
  
  if (past7Days > prev7Days) {
    trendIcon = <TrendingUp size={14} />;
    trendText = `${past7Days - prev7Days} więcej niż tyg. temu`;
    trendColor = 'text-emerald-400';
  } else if (past7Days < prev7Days) {
    trendIcon = <TrendingDown size={14} />;
    trendText = `${prev7Days - past7Days} mniej niż tyg. temu`;
    trendColor = 'text-rose-400';
  } else {
    trendText = 'Tyle samo co tyg. temu';
    trendColor = 'text-slate-400';
  }

  // --- ЛИЧНЫЕ РЕКОРДЫ ---
  const longestWorkout = activities.reduce((max, a) => parseInt(a.duration || 0) > parseInt(max.duration || 0) ? a : max, { duration: 0 });
  const longestDistance = activities.reduce((max, a) => parseFloat(a.distance || 0) > parseFloat(max.distance || 0) ? a : max, { distance: 0 });
  const favoriteType = Object.entries(typeTotals).sort((a, b) => b[1] - a[1])[0] || ['Brak', 0];

  // --- MOOD INSIGHT (Анализ настроения) ---
  const goodMoods = ['🤩', '🙂', '😍', '😊', '😁', '😀'];
  const positiveActs = activities.filter(a => goodMoods.includes(a.mood));
  
  const intensityCounts = positiveActs.reduce((acc, a) => {
    if (a.intensity) acc[a.intensity] = (acc[a.intensity] || 0) + 1;
    return acc;
  }, {});
  
  const bestIntensity = Object.entries(intensityCounts).sort((a, b) => b[1] - a[1])[0];

  // --- ТЕПЛОВАЯ КАРТА (ИСПРАВЛЕННАЯ: Локальное время + учет будущих дат) ---
  const getLocalDateStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  let heatmapEndDate = new Date();
  if (activities.length > 0) {
    // Защита от тестовых тренировок в будущем: двигаем конец карты на самую позднюю дату
    const futuremostDate = new Date(Math.max(...activities.map(a => new Date(a.date))));
    if (futuremostDate > heatmapEndDate) {
      heatmapEndDate = futuremostDate;
    }
  }

  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(heatmapEndDate);
    d.setDate(d.getDate() - (27 - i));
    const dStr = getLocalDateStr(d);
    
    // Считаем минуты за этот день
    const dayActs = activities.filter(a => a.date === dStr);
    const mins = dayActs.reduce((sum, a) => sum + parseInt(a.duration || 0), 0);
    return { date: dStr, mins };
  });

  // --- ОБЩИЕ ПОДСЧЕТЫ ---
  const averageDuration = filteredActivities.length
    ? (filteredActivities.reduce((sum, a) => sum + parseInt(a.duration || 0), 0) / filteredActivities.length).toFixed(1)
    : 0;

  const totalDistanceStr = filteredActivities.reduce((sum, a) => sum + parseFloat(a.distance || 0), 0).toFixed(2);

  const mostActiveDay = Object.entries(dailyTotals).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max, ['', 0])[0];

  return (
    <div className="pb-10 pt-2 space-y-6 fade-in-up">
      <style>{`
        .fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <h1 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm mb-4">
        Statystyki
      </h1>

      {/* ТАБЫ ФИЛЬТРОВ */}
      <div className="flex bg-[#13072E]/60 p-1.5 rounded-2xl border border-purple-500/20 w-full mx-auto shadow-inner">
        {['tydzien', 'miesiac', 'wszystko'].map(f => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all focus:outline-none ${
              timeFilter === f 
                ? 'bg-purple-500/20 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)] border border-purple-500/30' 
                : 'text-purple-400/50 hover:text-purple-300/80 hover:bg-white/5 border border-transparent'
            }`}
          >
            {f === 'tydzien' ? 'Tydzień' : f === 'miesiac' ? 'Miesiąc' : 'Wszystko'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* График длительности */}
        <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)] flex flex-col">
          <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock size={16} className="text-indigo-400" /> 
            Czas trwania
          </h2>
          <div className="flex-1 min-h-[200px]">
            {dataForBar.length > 0 ? (
              <Stats data={dataForBar} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-purple-400/50 uppercase tracking-widest">
                Brak danych
              </div>
            )}
          </div>
        </div>

        {/* Круговой график типов */}
        <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)] flex flex-col">
          <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity size={16} className="text-fuchsia-400" />
            Typy aktywności
          </h2>
          
          {dataForPie.length > 0 ? (
            <>
              <div className="h-48 relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataForPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={55}
                      stroke="rgba(19,7,46,0.8)"
                      strokeWidth={4}
                      paddingAngle={2}
                    >
                      {dataForPie.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0px 0px 8px rgba(217,70,239,0.3))' }} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(11, 3, 22, 0.95)', borderColor: 'rgba(147, 51, 234, 0.2)', borderRadius: '16px', color: '#f8fafc', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', fontWeight: 'bold', fontSize: '12px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-white">{filteredActivities.length}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400/60">Suma</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-auto">
                {dataForPie.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 5px ${COLORS[index % COLORS.length]}` }} />
                    <span className="text-xs font-semibold text-slate-300 truncate">{entry.name}</span>
                    <span className="text-xs font-bold text-white ml-auto">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm font-bold text-purple-400/50 uppercase tracking-widest">
              Brak danych
            </div>
          )}
        </div>
      </div>

      {/* ТЕПЛОВАЯ КАРТА (Heatmap) */}
      <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
        <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-4 flex items-center gap-2">
          <CalendarDays size={16} className="text-pink-400" />
          Mapa Aktywności (Ostatnie 28 dni)
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {heatmapDays.map((day, i) => {
            let boxClass = "bg-[#0B0316]/80 border border-purple-500/10 text-purple-500/30";
            if (day.mins > 0 && day.mins <= 30) boxClass = "bg-fuchsia-500/40 border border-fuchsia-500/50 shadow-[0_0_8px_rgba(217,70,239,0.3)] text-fuchsia-100";
            if (day.mins > 30 && day.mins <= 60) boxClass = "bg-fuchsia-500/80 border border-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.5)] text-white";
            if (day.mins > 60) boxClass = "bg-pink-400 border border-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.8)] text-white font-black";

            const dayNumber = parseInt(day.date.split('-')[2], 10);
            const dayActs = activities.filter(a => a.date === day.date);

            return (
              <div 
                key={i} 
                onClick={() => dayActs.length > 0 && setSelectedDayActivities(dayActs)}
                className={`aspect-square rounded-xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer hover:scale-110 hover:z-10 ${boxClass}`}
              >
                <span className="text-[10px] sm:text-xs font-bold leading-none">{dayNumber}</span>
                {day.mins > 0 && <span className="text-[8px] sm:text-[9px] opacity-80 mt-0.5 font-semibold leading-none">{day.mins}m</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ДЛЯ СПИСКА ТРЕНИРОВОК */}
      {selectedDayActivities && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center px-4 bg-[#0B0316]/90 backdrop-blur-md">
          <div className="bg-[#13072E] border border-purple-500/40 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.3)] animate-modal-pop">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">Aktywności: {formatFriendlyDate(selectedDayActivities[0].date)}</h3>
              <button onClick={() => setSelectedDayActivities(null)} className="text-purple-400 p-2 bg-white/5 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-3">
              {selectedDayActivities.map((a, i) => (
                <div key={i} onClick={() => setSelectedActivityItem(a)} className="bg-[#0B0316]/50 border border-purple-500/20 rounded-xl p-4 cursor-pointer hover:border-fuchsia-500/50 transition-all">
                  <p className="text-white font-bold">{a.customName || a.type}</p>
                  <p className="text-purple-400 text-xs">{a.duration} min • {a.intensity}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedDayActivities(null)} className="w-full mt-6 py-3 bg-purple-500/10 text-purple-300 font-bold rounded-xl">Zamknij</button>
          </div>
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ АКТИВНОСТИ */}
      {selectedDayActivities && selectedDayActivities.length > 0 && (
  <div className="fixed inset-0 z-[140] flex items-center justify-center px-4 bg-[#0B0316]/90 backdrop-blur-md">
    <div className="bg-[#13072E] border border-purple-500/40 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.3)] animate-modal-pop">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-white">
          {formatFriendlyDate(selectedDayActivities[0].date)}
        </h3>
        <button onClick={() => setSelectedDayActivities(null)} className="text-purple-400 p-2 bg-white/5 rounded-full">
          <X size={20}/>
        </button>
      </div>
      
      <div className="space-y-3">
        {selectedDayActivities.map((a, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedActivityItem(a)} 
            className="bg-[#0B0316]/50 border border-purple-500/20 rounded-xl p-4 cursor-pointer hover:border-fuchsia-500/50 transition-all"
          >
            <p className="text-white font-bold">{a.customName || a.type}</p>
            <p className="text-purple-400 text-xs">{a.duration} min • {a.intensity}</p>
          </div>
        ))}
      </div>
      
      <button onClick={() => setSelectedDayActivities(null)} className="w-full mt-6 py-3 bg-purple-500/10 text-purple-300 font-bold rounded-xl">Zamknij</button>
    </div>
  </div>
)}

      {/* ЛИЧНЫЕ РЕКОРДЫ И ИНСАЙТЫ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Рекорды */}
        <div className="bg-gradient-to-br from-[#13072E]/80 to-[#1e0a45]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.15)] relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none">
            <Trophy size={120} />
          </div>
          <h2 className="text-sm font-bold text-yellow-300/80 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10">
            <Trophy size={16} className="text-yellow-400" /> Osobiste Rekordy
          </h2>
          
          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-[10px] font-bold uppercase text-purple-300/60 mb-1">Najdłuższy trening</p>
              <p className="text-white font-black text-lg">{longestWorkout.duration ? `${longestWorkout.duration} min` : 'Brak'} <span className="text-xs font-semibold text-purple-400/80 ml-1">{longestWorkout.type ? `(${longestWorkout.type})` : ''}</span></p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-purple-300/60 mb-1">Najlepszy dystans</p>
              <p className="text-white font-black text-lg">{longestDistance.distance ? `${longestDistance.distance} km` : 'Brak'} <span className="text-xs font-semibold text-purple-400/80 ml-1">{longestDistance.type ? `(${longestDistance.type})` : ''}</span></p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-purple-300/60 mb-1">Ulubiony sport</p>
              <p className="text-white font-black text-lg flex items-center gap-2">
                {favoriteType[0] !== 'Brak' && <Medal size={16} className="text-yellow-500" />} {favoriteType[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Умный инсайт */}
        <div className="bg-gradient-to-br from-[#13072E]/80 to-[#1e0a45]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.15)] relative overflow-hidden flex flex-col">
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Brain size={120} />
          </div>
          <h2 className="text-sm font-bold text-emerald-300/80 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
            <Brain size={16} className="text-emerald-400" /> Twój Insight
          </h2>
          
          <div className="flex-1 flex flex-col justify-center relative z-10">
            {bestIntensity ? (
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                  <Heart size={24} className="text-emerald-400" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  Najlepszy nastrój (🤩/🙂) masz zazwyczaj po treningach o <span className="text-emerald-400 font-black tracking-wide">{bestIntensity[0].toUpperCase()}J</span> intensywności.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-purple-400/60 font-medium">Dodawaj ocenę nastroju po treningu, aby odblokować analizę samopoczucia! 🧠</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Блок Подсумование */}
      <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-black text-white tracking-wide">Podsumowanie</h2>
          
          {/* Индикатор тренда для количества тренировок */}
          <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0B0316]/50 border border-purple-500/10 ${trendColor}`}>
            {trendIcon}
            <span>{trendText}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          
          <div className="flex items-center p-3 rounded-2xl bg-[#0B0316]/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mr-4 shadow-inner">
              <Clock size={20} className="text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">Średni czas</p>
              <p className="text-white font-black text-lg leading-none">{averageDuration} <span className="text-purple-300/50 text-xs font-bold ml-0.5">min</span></p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-2xl bg-[#0B0316]/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mr-4 shadow-inner">
              <MapPin size={20} className="text-sky-400" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">Łączny dystans</p>
              <p className="text-white font-black text-lg leading-none">{totalDistanceStr} <span className="text-purple-300/50 text-xs font-bold ml-0.5">km</span></p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-2xl bg-[#0B0316]/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mr-4 shadow-inner">
              <Activity size={20} className="text-fuchsia-400" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">Liczba aktywności</p>
              <p className="text-white font-black text-lg leading-none">{filteredActivities.length}</p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-2xl bg-[#0B0316]/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors relative overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mr-4 shadow-inner z-10">
              <Flame size={20} className="text-orange-400" />
            </div>
            <div className="flex-1 z-10">
              <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">Najbardziej aktywny dzień</p>
              <p className="text-orange-300 font-black text-lg leading-none drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
                {formatFriendlyDate(mostActiveDay)}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatsPage;