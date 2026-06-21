import React, { useEffect, useState } from 'react';
import localforage from 'localforage'; 
import Stats from '../components/Stats';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Clock, MapPin, Activity, Flame, Trophy, CalendarDays, Brain, Heart, TrendingUp, TrendingDown, Medal, X, ChevronRight, ChevronLeft, Zap, Scale } from 'lucide-react'; 
import { useTranslation } from 'react-i18next'; 

const COLORS = ['#d946ef', '#8b5cf6', '#6366f1', '#ec4899', '#a855f7'];

const StatsPage = () => {
  const { t } = useTranslation(); 
  const [activities, setActivities] = useState([]);
  const [timeFilter, setTimeFilter] = useState('wszystko');
  const [selectedDayActivities, setSelectedDayActivities] = useState(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const [userProfile, setUserProfile] = useState({ weight: null, height: null });

  const formatFriendlyDate = (dateStr) => {
    if (!dateStr) return t('stats_page.records.none');
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = t(`months_short.${monthKeys[dateObj.getMonth()]}`);
    return `${day} ${month}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedActivities = await localforage.getItem('activities');
        if (storedActivities) setActivities(storedActivities);

        const weight = await localforage.getItem('userWeight');
        const height = await localforage.getItem('userHeight');
        setUserProfile({ weight, height });

      } catch (error) {
        console.error("Błąd podczas ładowania aktywności:", error);
      }
    };

    loadData();
  }, []);

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
    name: t(`activities.${name}`, { defaultValue: name }), 
    value,
  }));

  const dailyCaloriesTotals = filteredActivities.reduce((acc, act) => {
    acc[act.date] = (acc[act.date] || 0) + parseInt(act.calories || 0); 
    return acc;
  }, {});

  const dataForCaloriesChart = Object.entries(dailyCaloriesTotals)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, calories]) => ({
      date: formatFriendlyDate(date),
      calories,
    }));

  let bmi = null;
  let bmiCategory = '';
  let bmiColor = ''; 
  let bmiGradient = ''; 
  let bmiProgress = 0;

  if (userProfile.weight && userProfile.height) {
    const w = parseFloat(userProfile.weight);
    const hM = parseFloat(userProfile.height) / 100;
    bmi = (w / (hM * hM)).toFixed(1);
    
    if (bmi < 18.5) { 
      bmiCategory = t('stats_page.bmi.underweight', {defaultValue: 'Niedowaga'}); 
      bmiColor = '#38bdf8'; // sky-400
      bmiGradient = 'from-sky-300 to-blue-500';
      bmiProgress = (bmi / 18.5) * 25; 
    } else if (bmi < 25) { 
      bmiCategory = t('stats_page.bmi.normal', {defaultValue: 'W normie'}); 
      bmiColor = '#34d399'; // emerald-400
      bmiGradient = 'from-emerald-300 to-green-500';
      bmiProgress = 25 + ((bmi - 18.5) / 6.5) * 25; 
    } else if (bmi < 30) { 
      bmiCategory = t('stats_page.bmi.overweight', {defaultValue: 'Nadwaga'}); 
      bmiColor = '#facc15'; // yellow-400
      bmiGradient = 'from-yellow-300 to-amber-500';
      bmiProgress = 50 + ((bmi - 25) / 5) * 25; 
    } else { 
      bmiCategory = t('stats_page.bmi.obese', {defaultValue: 'Otyłość'}); 
      bmiColor = '#f87171'; // red-400
      bmiGradient = 'from-red-400 to-rose-600';
      bmiProgress = 75 + Math.min(((bmi - 30) / 10) * 25, 25); 
    }
  }

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
    trendText = t('stats_page.summary.trend_more', { count: past7Days - prev7Days });
    trendColor = 'text-emerald-400';
  } else if (past7Days < prev7Days) {
    trendIcon = <TrendingDown size={14} />;
    trendText = t('stats_page.summary.trend_less', { count: prev7Days - past7Days });
    trendColor = 'text-rose-400';
  } else {
    trendText = t('stats_page.summary.trend_same');
    trendColor = 'text-slate-400';
  }

  const longestWorkout = activities.reduce((max, a) => parseInt(a.duration || 0) > parseInt(max.duration || 0) ? a : max, { duration: 0 });
  const longestDistance = activities.reduce((max, a) => parseFloat(a.distance || 0) > parseFloat(max.distance || 0) ? a : max, { distance: 0 });
  const favoriteType = Object.entries(typeTotals).sort((a, b) => b[1] - a[1])[0] || ['Brak', 0];

  const goodMoods = ['🤩', '🙂', '😍', '😊', '😁', '😀'];
  const positiveActs = activities.filter(a => goodMoods.includes(a.mood));
  
  const intensityCounts = positiveActs.reduce((acc, a) => {
    if (a.intensity) acc[a.intensity] = (acc[a.intensity] || 0) + 1;
    return acc;
  }, {});
  
  const bestIntensity = Object.entries(intensityCounts).sort((a, b) => b[1] - a[1])[0];

  const getLocalDateStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  let heatmapEndDate = new Date();
  if (activities.length > 0) {
    const futuremostDate = new Date(Math.max(...activities.map(a => new Date(a.date))));
    if (futuremostDate > heatmapEndDate) {
      heatmapEndDate = futuremostDate;
    }
  }

  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(heatmapEndDate);
    d.setDate(d.getDate() - (27 - i));
    const dStr = getLocalDateStr(d);
    
    const dayActs = activities.filter(a => a.date === dStr);
    const mins = dayActs.reduce((sum, a) => sum + parseInt(a.duration || 0), 0);
    return { date: dStr, mins };
  });

  const averageDuration = filteredActivities.length
    ? (filteredActivities.reduce((sum, a) => sum + parseInt(a.duration || 0), 0) / filteredActivities.length).toFixed(1)
    : 0;

  const totalDistanceStr = filteredActivities.reduce((sum, a) => sum + parseFloat(a.distance || 0), 0).toFixed(2);

  const mostActiveDay = Object.entries(dailyTotals).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max, ['', 0])[0];

  const totalCalories = filteredActivities.reduce((sum, a) => sum + parseInt(a.calories || 0), 0);

  const getIntensityGrammar = (rawLvl) => {
    if (!rawLvl) return '';
    const l = rawLvl.toLowerCase();
    if (l.includes('niska') || l.includes('low')) return t('stats_page.insight.intensity_low');
    if (l.includes('średnia') || l.includes('srednia') || l.includes('medium')) return t('stats_page.insight.intensity_medium');
    if (l.includes('wysoka') || l.includes('high')) return t('stats_page.insight.intensity_high');
    return rawLvl;
  };

  const getTranslatedIntensity = (rawLvl) => {
    if (!rawLvl) return '';
    const l = rawLvl.toLowerCase();
    if (l.includes('niska') || l.includes('low')) return t('add_activity.intensity_low');
    if (l.includes('średnia') || l.includes('srednia') || l.includes('medium')) return t('add_activity.intensity_medium');
    if (l.includes('wysoka') || l.includes('high')) return t('add_activity.intensity_high');
    return rawLvl;
  };

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-full z-[90] pointer-events-none"
        style={{
          height: 'calc(env(safe-area-inset-top) + 80px)',
          background: 'linear-gradient(to bottom, rgba(11, 3, 22, 1) 0%, rgba(11, 3, 22, 0.6) 40%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      ></div>
      <div className="pb-10 space-y-6 fade-in-up">
        
        <style>{`
          .fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes fadeInUp { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .animate-modal-pop { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes modalPop { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        `}</style>

        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm mb-4">
          {t('stats_page.title')}
        </h1>

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
              {f === 'tydzien' ? t('stats_page.filters.week') : f === 'miesiac' ? t('stats_page.filters.month') : t('stats_page.filters.all')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)] flex flex-col">
            <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-indigo-400" /> 
              {t('stats_page.charts.duration')}
            </h2>
            <div className="flex-1 min-h-[200px]">
              {dataForBar.length > 0 ? (
                <Stats data={dataForBar} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-purple-400/50 uppercase tracking-widest">
                  {t('stats_page.charts.no_data')}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)] flex flex-col">
            <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={16} className="text-fuchsia-400" />
              {t('stats_page.charts.activity_types')}
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
                    <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400/60">{t('stats_page.charts.sum')}</span>
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
                {t('stats_page.charts.no_data')}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-gradient-to-br from-[#13072E]/60 to-[#1a0b3b]/60 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(249,115,22,0.1)] flex flex-col relative overflow-hidden">
            <h2 className="text-sm font-bold text-orange-300/80 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
              <Flame size={16} className="text-orange-500" /> 
              {t('stats_page.charts.calories', {defaultValue: 'Spalone Kalorie'})}
            </h2>
            <div className="flex-1 min-h-[220px] -ml-2">
              {dataForCaloriesChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataForCaloriesChart} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(11, 3, 22, 0.85)', backdropFilter: 'blur(10px)', borderColor: 'rgba(249, 115, 22, 0.4)', borderRadius: '14px', color: '#f8fafc', boxShadow: '0 8px 30px rgba(0,0,0,0.6)', fontWeight: 'bold', fontSize: '12px' }}
                      itemStyle={{ color: '#f97316' }}
                      cursor={{ stroke: 'rgba(249, 115, 22, 0.3)', strokeWidth: 2, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#f97316" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorCalories)" 
                      activeDot={{ r: 6, fill: '#0B0316', stroke: '#f97316', strokeWidth: 3, style: { filter: 'drop-shadow(0px 0px 8px rgba(249,115,22,0.8))' } }}
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(249,115,22,0.4))' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-orange-400/50 uppercase tracking-widest">
                  {t('stats_page.charts.no_data')}
                </div>
              )}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600/5 rounded-full blur-[60px] pointer-events-none"></div>
          </div>

          <div className="bg-gradient-to-br from-[#13072E]/60 to-[#1a0b3b]/60 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(14,165,233,0.1)] flex flex-col relative overflow-hidden">
            <h2 className="text-sm font-bold text-sky-300/80 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <Scale size={16} className="text-sky-400" /> 
              {t('stats_page.bmi.title', {defaultValue: 'Wskaźnik BMI'})}
            </h2>

            {bmi ? (
              <div className="flex flex-col items-center justify-center flex-1 z-10 py-2">
                <div className="relative mb-2 flex items-center justify-center">
                  <div className="absolute inset-0 blur-[30px] rounded-full opacity-30" style={{ backgroundColor: bmiColor }}></div>
                  <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b ${bmiGradient} drop-shadow-sm`}>
                    {bmi}
                  </span>
                </div>
                <div 
                  className={`text-[10px] font-black uppercase tracking-widest mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md`}
                  style={{ color: bmiColor, boxShadow: `0 0 15px ${bmiColor}30` }}
                >
                  {bmiCategory}
                </div>
                <div className="w-full max-w-[260px] relative mt-2 h-4 bg-[#0B0316]/80 rounded-full border border-white/5 p-0.5 flex gap-1 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 w-1/4 rounded-l-full opacity-90"></div>
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 w-1/4 opacity-90"></div>
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 w-1/4 opacity-90"></div>
                  <div className="h-full bg-gradient-to-r from-red-400 to-rose-500 w-1/4 rounded-r-full opacity-90"></div>
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-white rounded-[4px] shadow-[0_0_12px_rgba(255,255,255,0.9)] border border-slate-200 transition-all duration-1000 ease-out z-10 flex items-center justify-center"
                    style={{ left: `calc(${Math.min(Math.max(bmiProgress, 2), 98)}% - 8px)` }}
                  >
                    <div className="w-0.5 h-3 bg-slate-300 rounded-full"></div>
                  </div>
                </div>

                <div className="flex justify-between w-full mt-8 text-xs text-slate-400 font-medium px-4">
                  <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-wider opacity-60 mb-0.5">{t('stats_page.bmi.weight', {defaultValue: 'Waga'})}</span>
                    <strong className="text-white text-sm">{userProfile.weight} kg</strong>
                  </div>
                  <div className="w-px bg-slate-700/50"></div>
                  <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-wider opacity-60 mb-0.5">{t('stats_page.bmi.height', {defaultValue: 'Wzrost'})}</span>
                    <strong className="text-white text-sm">{userProfile.height} cm</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 z-10 p-4">
                <Scale size={48} className="mb-4 text-sky-400 opacity-50" />
                <p className="text-sm font-bold text-white tracking-wide">
                  {t('stats_page.bmi.no_data', {defaultValue: 'Wprowadź wagę i wzrost w ustawieniach'})}
                </p>
              </div>
            )}
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>

        <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
          <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CalendarDays size={16} className="text-pink-400" />
            {t('stats_page.heatmap.title')}
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {heatmapDays.map((day, i) => {
              let boxClass = "bg-[#0B0316]/80 border border-purple-500/10 text-purple-300/40";
              if (day.mins > 0 && day.mins <= 30) boxClass = "bg-fuchsia-500/40 border border-fuchsia-500/50 shadow-[0_0_8px_rgba(217,70,239,0.3)] text-white";
              if (day.mins > 30 && day.mins <= 60) boxClass = "bg-fuchsia-500/80 border border-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.5)] text-white";
              if (day.mins > 60) boxClass = "bg-pink-400 border border-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.8)] text-white font-black";

              const dayNumber = parseInt(day.date.split('-')[2], 10);
              const dayActs = activities.filter(a => a.date === day.date);

              return (
                <div 
                  key={i} 
                  onClick={() => {
                    if (dayActs.length > 0) {
                      setSelectedDayActivities(dayActs);
                      setCurrentActivityIndex(0);
                    }
                  }}
                  className={`aspect-square rounded-xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer hover:scale-110 hover:z-10 ${boxClass}`}
                >
                  <span className="text-xs font-bold leading-none">{dayNumber}</span>
                  {day.mins > 0 && <span className="text-[9px] opacity-90 mt-0.5 font-semibold leading-none">{day.mins}m</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#13072E]/80 to-[#1e0a45]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.15)] relative overflow-hidden">
            <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none">
              <Trophy size={120} />
            </div>
            <h2 className="text-sm font-bold text-yellow-300/80 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10">
              <Trophy size={16} className="text-yellow-400" /> {t('stats_page.records.title')}
            </h2>
            
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300/60 mb-1">{t('stats_page.records.longest_workout')}</p>
                <p className="text-white font-black text-lg">{longestWorkout.duration ? `${longestWorkout.duration} min` : t('stats_page.records.none')} <span className="text-xs font-semibold text-purple-400/80 ml-1">{longestWorkout.type ? `(${t(`activities.${longestWorkout.type}`, {defaultValue: longestWorkout.type})})` : ''}</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300/60 mb-1">{t('stats_page.records.best_distance')}</p>
                <p className="text-white font-black text-lg">{longestDistance.distance ? `${longestDistance.distance} km` : t('stats_page.records.none')} <span className="text-xs font-semibold text-purple-400/80 ml-1">{longestDistance.type ? `(${t(`activities.${longestDistance.type}`, {defaultValue: longestDistance.type})})` : ''}</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300/60 mb-1">{t('stats_page.records.favorite_sport')}</p>
                <p className="text-white font-black text-lg flex items-center gap-2">
                  {favoriteType[0] !== 'Brak' && <Medal size={16} className="text-yellow-500" />} {favoriteType[0] !== 'Brak' ? t(`activities.${favoriteType[0]}`, {defaultValue: favoriteType[0]}) : t('stats_page.records.none')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#13072E]/80 to-[#1e0a45]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.15)] relative overflow-hidden flex flex-col">
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
              <Brain size={120} />
            </div>
            <h2 className="text-sm font-bold text-emerald-300/80 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <Brain size={16} className="text-emerald-400" /> {t('stats_page.insight.title')}
            </h2>
            
            <div className="flex-1 flex flex-col justify-center relative z-10">
              {bestIntensity ? (
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                    <Heart size={24} className="text-emerald-400" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {t('stats_page.insight.best_mood')} <span className="text-emerald-400 font-black tracking-wide">{getIntensityGrammar(bestIntensity[0])}</span>
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-purple-400/60 font-medium">{t('stats_page.insight.no_mood')}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <h2 className="text-xl font-black text-white tracking-wide">{t('stats_page.summary.title')}</h2>
            <div className={`flex items-center shrink-0 gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0B0316]/50 border border-purple-500/10 ${trendColor}`}>
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
                <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">{t('stats_page.summary.avg_time')}</p>
                <p className="text-white font-black text-lg leading-none">{averageDuration} <span className="text-purple-300/50 text-xs font-bold ml-0.5">min</span></p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-2xl bg-[#0B0316]/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mr-4 shadow-inner">
                <MapPin size={20} className="text-sky-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">{t('stats_page.summary.total_distance')}</p>
                <p className="text-white font-black text-lg leading-none">{totalDistanceStr} <span className="text-purple-300/50 text-xs font-bold ml-0.5">km</span></p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-2xl bg-[#0B0316]/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mr-4 shadow-inner">
                <Activity size={20} className="text-fuchsia-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">{t('stats_page.summary.activity_count')}</p>
                <p className="text-white font-black text-lg leading-none">{filteredActivities.length}</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-2xl bg-[#0B0316]/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mr-4 shadow-inner">
                <Zap size={20} className="text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">{t('stats_page.summary.calories')}</p>
                <p className="text-white font-black text-lg leading-none">
                  {totalCalories > 0 ? totalCalories.toLocaleString() : "0"} <span className="text-purple-300/50 text-xs font-bold ml-0.5">kcal</span>
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-2xl bg-[#0B0316]/50 border border-purple-500/10 hover:border-purple-500/30 transition-colors relative overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mr-4 shadow-inner z-10">
                <Flame size={20} className="text-orange-400" />
              </div>
              <div className="flex-1 z-10">
                <p className="text-[10px] font-bold uppercase text-purple-400/60 tracking-wider mb-0.5">{t('stats_page.summary.most_active_day')}</p>
                <p className="text-orange-300 font-black text-lg leading-none drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
                  {formatFriendlyDate(mostActiveDay)}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {selectedDayActivities && selectedDayActivities.length > 0 && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center px-4 bg-[#0B0316]/90 backdrop-blur-md">
          <div className="bg-[#13072E] border border-purple-500/40 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.5)] animate-modal-pop text-center relative overflow-hidden">
            
            <button 
              onClick={() => setSelectedDayActivities(null)} 
              className="absolute top-4 right-4 text-purple-400 p-2 bg-white/5 rounded-full hover:text-white transition-colors z-20"
            >
              <X size={20}/>
            </button>

            {selectedDayActivities.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentActivityIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentActivityIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-purple-400 disabled:opacity-20 hover:text-white z-20 transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  onClick={() => setCurrentActivityIndex(prev => Math.min(selectedDayActivities.length - 1, prev + 1))}
                  disabled={currentActivityIndex === selectedDayActivities.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-400 disabled:opacity-20 hover:text-white z-20 transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <div className="relative z-10 px-6">
              
              <div className="mb-6">
                {selectedDayActivities.length > 1 && (
                  <div className="text-[9px] font-bold text-fuchsia-400/80 mb-2 uppercase tracking-widest">
                    {t('stats_page.modal.workout_x_of_y', { current: currentActivityIndex + 1, total: selectedDayActivities.length })}
                  </div>
                )}
                <h3 className="text-2xl font-black text-white">
                  {selectedDayActivities[currentActivityIndex].customName || t(`activities.${selectedDayActivities[currentActivityIndex].type}`, {defaultValue: selectedDayActivities[currentActivityIndex].type})}
                </h3>
                <p className="text-xs text-purple-400/60 font-semibold mt-1">
                  {formatFriendlyDate(selectedDayActivities[currentActivityIndex].date)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-left mb-6">
                <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase text-purple-400/60 mb-1">{t('stats_page.modal.time')}</p>
                  <p className="text-white font-bold">{selectedDayActivities[currentActivityIndex].duration} min</p>
                </div>
                <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase text-purple-400/60 mb-1">{t('stats_page.modal.intensity')}</p>
                  <p className="text-white font-bold">{getTranslatedIntensity(selectedDayActivities[currentActivityIndex].intensity)}</p>
                </div>
                {selectedDayActivities[currentActivityIndex].distance && (
                  <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3">
                    <p className="text-[10px] font-bold uppercase text-purple-400/60 mb-1">{t('stats_page.modal.distance')}</p>
                    <p className="text-white font-bold">{selectedDayActivities[currentActivityIndex].distance} km</p>
                  </div>
                )}
                {selectedDayActivities[currentActivityIndex].mood && (
                  <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3">
                    <p className="text-[10px] font-bold uppercase text-purple-400/60 mb-1">{t('stats_page.modal.mood')}</p>
                    <p className="text-white font-bold text-lg leading-none">{selectedDayActivities[currentActivityIndex].mood}</p>
                  </div>
                )}
                
                {selectedDayActivities[currentActivityIndex].calories && (
                  <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3 col-span-2 flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase text-orange-400/80 mb-0 flex items-center gap-1">
                      <Flame size={12} className="text-orange-500" />
                      {t('stats_page.charts.calories', {defaultValue: 'Spalone kalorie'})}
                    </p>
                    <p className="text-orange-400 font-black">{selectedDayActivities[currentActivityIndex].calories} kcal</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setSelectedDayActivities(null)} 
                className="w-full py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold tracking-widest uppercase rounded-xl transition-colors"
              >
                {t('stats_page.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatsPage;