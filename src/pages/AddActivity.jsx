import React, { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';
import { 
  Clock, MapPin, Zap, CalendarDays, X, History,
  Flame, Dumbbell, Bike, Flower2, Footprints, Waves, Sparkles, HeartPulse,
  Mountain, Swords, Wind, Activity, ChevronLeft, ChevronRight, ArrowRight,
  Plus, Minus, RefreshCw, Smile, Navigation, Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import TrackerWithMap from '../components/Tracker';

const calculateCalories = (duration, intensity, type, userProfile) => {
  const { weight, height, age, gender } = userProfile;
  
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

  const baseMets = {
    'Bieganie': 8.0,
    'Trening siłowy': 5.0,
    'Jazda na rowerze': 6.0,
    'Joga': 2.5,
    'Spacer': 3.5,
    'Pływanie': 7.0,
    'Kardio': 7.5,
    'Trekking': 6.5,
    'Sporty walki': 8.5,
    'Rolki': 6.0,
    'Rozciąganie': 2.0,
    'Inne': 4.0
  };

  let met = baseMets[type] || 4.0;

  if (intensity === 'Niska' || intensity === 'low') met *= 0.8;
  if (intensity === 'Wysoka' || intensity === 'high') met *= 1.2;

  const burnedCalories = Math.round(bmrPerHour * met * timeInHours);
  
  return burnedCalories > 0 ? burnedCalories : 0;
};

const AddActivity = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('gps'); // 'gps' lub 'manual'

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: '',
    duration: '',
    distance: '',
    intensity: '',
    mood: '',
    customName: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [activities, setActivities] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [explodingButton, setExplodingButton] = useState(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(null);

  const [userProfile, setUserProfile] = useState({});

  const activityTypes = [
    { id: 'Bieganie', label: t('activities_labels.running', { defaultValue: 'Bieganie' }), requiresDistance: true, icon: <Flame size={24} className="text-orange-400" /> },
    { id: 'Trening siłowy', label: t('activities_labels.gym', { defaultValue: 'Siłownia' }), requiresDistance: false, icon: <Dumbbell size={24} className="text-slate-300" /> },
    { id: 'Jazda na rowerze', label: t('activities_labels.cycling', { defaultValue: 'Rower' }), requiresDistance: true, icon: <Bike size={24} className="text-sky-400" /> },
    { id: 'Joga', label: t('activities_labels.yoga', { defaultValue: 'Joga' }), requiresDistance: false, icon: <Flower2 size={24} className="text-pink-400" /> },
    { id: 'Spacer', label: t('activities_labels.walking', { defaultValue: 'Spacer' }), requiresDistance: true, icon: <Footprints size={24} className="text-emerald-400" /> },
    { id: 'Pływanie', label: t('activities_labels.swimming', { defaultValue: 'Pływanie' }), requiresDistance: true, icon: <Waves size={24} className="text-blue-400" /> },
    { id: 'Kardio', label: t('activities_labels.cardio', { defaultValue: 'Kardio' }), requiresDistance: false, icon: <HeartPulse size={24} className="text-red-400" /> },
    { id: 'Trekking', label: t('activities_labels.trekking', { defaultValue: 'Trekking' }), requiresDistance: true, icon: <Mountain size={24} className="text-emerald-500" /> },
    { id: 'Sporty walki', label: t('activities_labels.martial_arts', { defaultValue: 'Sztuki walki' }), requiresDistance: false, icon: <Swords size={24} className="text-rose-500" /> },
    { id: 'Rolki', label: t('activities_labels.rollerblading', { defaultValue: 'Rolki' }), requiresDistance: true, icon: <Wind size={24} className="text-cyan-400" /> },
    { id: 'Rozciąganie', label: t('activities_labels.stretching', { defaultValue: 'Rozciąganie' }), requiresDistance: false, icon: <Activity size={24} className="text-violet-400" /> },
    { id: 'Inne', label: t('activities_labels.other', { defaultValue: 'Inne' }), requiresDistance: false, icon: <Sparkles size={24} className="text-yellow-400" /> },
  ];

  const moods = [
    { id: 'terrible', emoji: '🥵' },
    { id: 'hard', emoji: '😫' },
    { id: 'normal', emoji: '😐' },
    { id: 'good', emoji: '🙂' },
    { id: 'great', emoji: '🤩' }
  ];

  const loadActivitiesAndProfile = async () => {
    try {
      const storedActivities = await localforage.getItem('activities');
      if (storedActivities) {
        setActivities(storedActivities);
      }

      const w = await localforage.getItem('userWeight');
      const h = await localforage.getItem('userHeight');
      const a = await localforage.getItem('userAge');
      const g = await localforage.getItem('userGender');
      
      setUserProfile({ weight: w, height: h, age: a, gender: g });

    } catch (error) {
      console.error("Błąd podczas ładowania danych:", error);
    }
  };

  useEffect(() => {
    loadActivitiesAndProfile();
  }, []);

  useEffect(() => {
    if (isHistoryOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isHistoryOpen]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 200) {
      setDragY(1000);
      setTimeout(() => {
        setIsHistoryOpen(false);
        setDragY(0);
      }, 300);
    } else {
      setDragY(0);
    }
    touchStartY.current = null;
  };

  const closeHistory = () => {
    setDragY(1000);
    setTimeout(() => {
      setIsHistoryOpen(false);
      setDragY(0);
    }, 300);
  };

  const openHistory = () => {
    setDragY(0);
    setIsHistoryOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'duration') {
      const val = value.replace(/[^\d]/g, '');
      setForm({ ...form, [name]: val });
    } else if (name === 'distance') {
      let val = value.replace(/,/g, '.');
      val = val.replace(/[^\d.]/g, '');
      const dotIndex = val.indexOf('.');
      if (dotIndex !== -1) {
        val = val.slice(0, dotIndex + 1) + val.slice(dotIndex + 1).replace(/\./g, '');
      }
      setForm({ ...form, [name]: val });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const adjustTime = (amount) => {
    setForm(prev => {
      let current = parseInt(prev.duration) || 0;
      let next = Math.max(0, current + amount);
      return { ...prev, duration: next === 0 ? '' : next.toString() };
    });
  };

  const adjustDistance = (amount) => {
    setForm(prev => {
      let current = parseFloat(prev.distance) || 0;
      let next = Math.max(0, current + amount);
      return { ...prev, distance: next === 0 ? '' : parseFloat(next.toFixed(1)).toString() };
    });
  };

  const handleTypeSelect = (typeId) => {
    const selected = activityTypes.find(a => a.id === typeId);
    setForm({ 
      ...form, 
      type: typeId, 
      customName: '',
      distance: selected && !selected.requiresDistance ? '' : form.distance 
    });
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleRepeat = (activity) => {
    setForm({
      type: activity.type,
      duration: activity.duration,
      distance: activity.distance || '',
      intensity: activity.intensity,
      mood: activity.mood || '',
      customName: activity.customName || '',
      date: new Date().toISOString().split('T')[0],
    });
    setStep(2);
    closeHistory();
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleIntensityClick = (level) => {
    setForm({ ...form, intensity: level });
    setExplodingButton(level);
    setTimeout(() => setExplodingButton(null), 500);
  };

  const handleMoodSelect = (mood) => {
    setForm({ ...form, mood });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.duration || form.duration <= 0) return alert(t('add_activity.alert_duration'));
    if (!form.intensity) return alert(t('add_activity.alert_intensity')); 
    if (!form.mood) return alert(t('add_activity.alert_mood')); 

    const calculatedCalories = calculateCalories(form.duration, form.intensity, form.type, userProfile);

    const newActivity = {
      ...form,
      calories: calculatedCalories 
    };

    const updated = [...activities, newActivity];
    setActivities(updated);
    
    try {
      await localforage.setItem('activities', updated);
    } catch (error) {
      console.error("Błąd podczas zapisywania:", error);
    }
    
    setForm({ type: '', duration: '', distance: '', intensity: '', mood: '', customName: '', date: new Date().toISOString().split('T')[0] });
    setStep(1); 
    window.scrollTo(0, 0);
  };

  const handleDelete = async (index) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
    
    try {
      await localforage.setItem('activities', updated);
      
      if (updated.length === 0) {
        await localforage.removeItem('unlockedEventBadges');
        await localforage.removeItem('dynamicChallengeState');
      }
    } catch (error) {
      console.error("Błąd podczas usuwania:", error);
    }
  };

  const handleClearAllHistory = async () => {
    if (window.confirm(t('add_activity.confirm_clear', {defaultValue: 'Czy na pewno chcesz usunąć całą historię? Twój postęp i trofea zostaną całkowicie zresetowane!'}))) {
      setActivities([]);
      try {
        await localforage.removeItem('activities');
        await localforage.removeItem('unlockedEventBadges');
        await localforage.removeItem('dynamicChallengeState');
        closeHistory();
      } catch (error) {
        console.error("Błąd podczas czyszczenia historii:", error);
      }
    }
  };

  const monthNames = [t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'), t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'), t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')];
  const weekDays = [t('days.mon'), t('days.tue'), t('days.wed'), t('days.thu'), t('days.fri'), t('days.sat'), t('days.sun')];
  
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  const startingEmptyCells = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  const handleDateSelect = (day) => {
    const formattedMonth = String(calendarMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setForm(prev => ({ ...prev, date: `${calendarYear}-${formattedMonth}-${formattedDay}` }));
    setIsDatePickerOpen(false);
  };

  const setToday = () => {
    const today = new Date();
    setCalendarMonth(today.getMonth());
    setCalendarYear(today.getFullYear());
    handleDateSelect(today.getDate());
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return t('add_activity.select_date');
    const [y, m, d] = dateString.split('-');
    return `${d} ${monthNames[parseInt(m, 10) - 1]} ${y}`;
  };

  const selectedActivity = activityTypes.find(a => a.id === form.type);
  const showDistance = !selectedActivity || selectedActivity.requiresDistance;

  const labelClasses = "flex items-center justify-center gap-2 mb-4 text-sm font-medium text-purple-200 tracking-wide uppercase";
  const particles = Array.from({ length: 12 });

  const intensityStyles = {
    'Niska': { activeBg: 'bg-green-400/10 shadow-[0_0_15px_rgba(74,222,128,0.2)] border-green-500/40', idleBg: 'hover:bg-green-400/5', activeText: 'text-green-400', idleText: 'text-slate-500 hover:text-green-300/80', particle: 'bg-green-400' },
    'Średnia': { activeBg: 'bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.2)] border-yellow-500/40', idleBg: 'hover:bg-yellow-400/5', activeText: 'text-yellow-400', idleText: 'text-slate-500 hover:text-yellow-300/80', particle: 'bg-yellow-400' },
    'Wysoka': { activeBg: 'bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/40', idleBg: 'hover:bg-red-500/5', activeText: 'text-red-400', idleText: 'text-slate-500 hover:text-red-300/80', particle: 'bg-red-500' }
  };

  const getIntensityTranslation = (lvl) => {
    if (lvl === 'Niska' || lvl === 'low') return t('add_activity.intensity_low');
    if (lvl === 'Średnia' || lvl === 'medium') return t('add_activity.intensity_medium');
    if (lvl === 'Wysoka' || lvl === 'high') return t('add_activity.intensity_high');
    return lvl;
  };

  return (
    <div className="w-full pb-28 pt-2 px-4 sm:px-6 mx-auto max-w-7xl overflow-hidden relative">
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
      <style>{`
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        input, textarea {
          -webkit-user-select: auto;
          -moz-user-select: auto;
          -ms-user-select: auto;
          user-select: auto;
          caret-color: #c084fc;
        }

        ::selection { background: transparent; }
        ::-moz-selection { background: transparent; }

        @keyframes particle-explode { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(0); opacity: 0; } }
        .animate-particle { animation: particle-explode 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        
        input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .slide-in-right { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideInRight { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        .group:hover .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        
        @keyframes float-badge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .animate-float { animation: float-badge 3s ease-in-out infinite; }
      `}</style>

      <div className="flex bg-[#13072E]/60 p-1.5 rounded-2xl border border-purple-500/20 w-full max-w-xl mx-auto shadow-inner mb-8 relative z-20">
        <button
          onClick={() => setActiveTab('gps')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
            activeTab === 'gps' 
              ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
              : 'text-purple-400/50 hover:text-purple-300/80 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Navigation size={16} /> {t('add_activity.tab_gps', 'GPS')}
        </button>
        <button
          onClick={() => {
            setActiveTab('manual');
            setStep(1); 
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
            activeTab === 'manual' 
              ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
              : 'text-purple-400/50 hover:text-purple-300/80 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Plus size={16} /> {t('add_activity.tab_manual')}
        </button>
      </div>

      <div className={activeTab === 'gps' ? 'fade-in-up block -mx-4 sm:-mx-6' : 'hidden'}>
         <TrackerWithMap onWorkoutSaved={loadActivitiesAndProfile} />
      </div>

      <div className={activeTab === 'manual' ? 'block' : 'hidden'}>
        {step === 1 && (
          <div className="flex justify-between items-start mb-8 relative z-10 fade-in-up">
            <div className="text-left">
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm mb-2">
                {t('add_activity.heading_what')}
              </h2>
              <p className="text-purple-400/60 text-sm font-medium tracking-wide">
                {t('add_activity.subheading_select')}
              </p>
            </div>
              
              <button 
                type="button"
                onClick={openHistory}
                className="relative w-12 h-12 flex items-center justify-center bg-[#13072E]/60 border border-purple-500/30 rounded-2xl text-purple-400 hover:text-white hover:bg-purple-600/40 hover:border-purple-400 transition-all shadow-[0_0_15px_rgba(147,51,234,0.15)] group active:scale-95 shrink-0"
              >
                <History size={24} className="animate-spin-slow" />
                
                {activities.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#0B0316] shadow-lg animate-float">
                    {activities.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="fade-in-up space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {activityTypes.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => handleTypeSelect(activity.id)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#13072E]/40 backdrop-blur-md border border-purple-500/20 rounded-2xl hover:border-purple-400/60 hover:bg-[#13072E]/80 transition-all duration-300 active:scale-[0.98] group shadow-[0_4px_20px_rgba(147,51,234,0.05)] hover:shadow-[0_4px_25px_rgba(147,51,234,0.15)]"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="shrink-0 w-12 h-12 bg-[#0B0316]/60 rounded-xl border border-purple-500/20 flex items-center justify-center group-hover:border-purple-400/50 group-hover:scale-110 transition-all duration-300">
                        {React.cloneElement(activity.icon, { className: `${activity.icon.props.className} drop-shadow-[0_0_8px_currentColor]` })}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <span className="block text-base sm:text-lg font-extrabold text-slate-200 tracking-wide group-hover:text-white transition-colors truncate">
                          {activity.label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 ml-2">
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="slide-in-right space-y-6 relative z-10">
              
              <div className="flex items-center justify-between mb-6 gap-3">
                <button 
                  type="button"
                  onClick={goBack}
                  className="w-12 h-12 flex items-center justify-center bg-[#13072E]/60 border border-purple-500/30 rounded-xl text-purple-400 hover:text-white hover:border-purple-400 hover:bg-purple-900/30 transition-all active:scale-95 shadow-[0_0_15px_rgba(147,51,234,0.15)] shrink-0"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex-1 flex items-center justify-center gap-2.5 min-w-0">
                  {selectedActivity && (
                    <div className="p-1.5 bg-[#13072E]/60 rounded-lg border border-purple-500/20 shadow-[0_0_10px_rgba(147,51,234,0.2)] shrink-0 hidden sm:block">
                      {React.cloneElement(selectedActivity.icon, { size: 20 })}
                    </div>
                  )}
                  {form.type === 'Inne' ? (
                    <input 
                      type="text"
                      value={form.customName}
                      onChange={(e) => setForm({...form, customName: e.target.value})}
                      placeholder={t('add_activity.custom_name_placeholder')}
                      className="bg-transparent border-b border-purple-500/50 text-xl sm:text-2xl font-black text-white text-center focus:outline-none focus:border-purple-400 placeholder:text-purple-300/30 w-full max-w-[200px]"
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm truncate text-center">
                      {t('add_activity.add_prefix')}: {selectedActivity?.label}
                    </h2>
                  )}
                </div>

                <button 
                  type="button"
                  onClick={openHistory}
                  className="relative w-12 h-12 flex items-center justify-center bg-[#13072E]/60 border border-purple-500/30 rounded-xl text-purple-400 hover:text-white hover:bg-purple-600/40 hover:border-purple-400 transition-all shadow-[0_0_15px_rgba(147,51,234,0.15)] group active:scale-95 shrink-0"
                >
                  <History size={22} className="animate-spin-slow" />
                  {activities.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-[#0B0316] shadow-lg animate-float">
                      {activities.length}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-900/50 rounded-3xl p-5 md:p-8 shadow-[0_8px_30px_rgba(147,51,234,0.15)] relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className={`grid gap-5 transition-all duration-500 ${showDistance ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    
                    <div 
                      className="bg-[#0B0316]/60 border border-purple-500/20 rounded-[2rem] p-5 flex flex-col items-center justify-center relative group hover:border-purple-500/50 transition-colors shadow-inner"
                      onWheel={(e) => { e.preventDefault(); adjustTime(e.deltaY < 0 ? 1 : -1); }}
                    >
                      <label className={labelClasses}><Clock size={18} className="text-indigo-400" /> {t('add_activity.time')}</label>
                      
                      <div className="flex items-center justify-between w-full mt-2">
                        <button type="button" onClick={() => adjustTime(-5)} className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 hover:bg-indigo-500 hover:text-white active:scale-90 transition-all shadow-sm shrink-0">
                          <Minus size={24} strokeWidth={3} />
                        </button>
                        
                        <div className="flex flex-col items-center min-w-[80px]">
                          <input 
                            type="text"
                            inputMode="numeric" 
                            name="duration" 
                            value={form.duration} 
                            onChange={handleChange} 
                            className="bg-transparent text-center text-5xl font-black text-white w-full focus:outline-none placeholder:text-slate-700" 
                            placeholder="0" 
                          />
                          <span className="text-[11px] text-purple-400/60 uppercase tracking-widest mt-1 font-bold">{t('add_activity.minutes')}</span>
                        </div>

                        <button type="button" onClick={() => adjustTime(5)} className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 hover:bg-indigo-500 hover:text-white active:scale-90 transition-all shadow-sm shrink-0">
                          <Plus size={24} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                    
                    {showDistance && (
                      <div 
                        className="bg-[#0B0316]/60 border border-purple-500/20 rounded-[2rem] p-5 flex flex-col items-center justify-center relative group hover:border-purple-500/50 transition-colors shadow-inner animate-in fade-in zoom-in-95 duration-300"
                        onWheel={(e) => { e.preventDefault(); adjustDistance(e.deltaY < 0 ? 0.1 : -0.1); }}
                      >
                        <label className={labelClasses}><MapPin size={18} className="text-purple-400" /> {t('add_activity.distance')}</label>
                        
                        <div className="flex items-center justify-between w-full mt-2">
                          <button type="button" onClick={() => adjustDistance(-0.5)} className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white active:scale-90 transition-all shadow-sm shrink-0">
                            <Minus size={24} strokeWidth={3} />
                          </button>
                          
                          <div className="flex flex-col items-center min-w-[80px]">
                            <input 
                              type="text"
                              inputMode="decimal"
                              name="distance" 
                              value={form.distance} 
                              onChange={handleChange} 
                              className="bg-transparent text-center text-5xl font-black text-white w-full focus:outline-none placeholder:text-slate-700" 
                              placeholder="0.0" 
                            />
                            <span className="text-[11px] text-purple-400/60 uppercase tracking-widest mt-1 font-bold">{t('add_activity.kilometers')}</span>
                          </div>

                          <button type="button" onClick={() => adjustDistance(0.5)} className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white active:scale-90 transition-all shadow-sm shrink-0">
                            <Plus size={24} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center justify-center gap-2 mb-3 text-sm font-medium text-purple-200 tracking-wide uppercase"><Zap size={16} className="text-yellow-400" /> {t('add_activity.intensity')}</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 p-1.5 bg-[#0B0316]/50 border border-purple-950 rounded-2xl relative overflow-hidden shadow-inner">
                      {['Niska', 'Średnia', 'Wysoka'].map((level) => {
                        const isSelected = form.intensity === level;
                        const styles = intensityStyles[level];
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => handleIntensityClick(level)}
                            className={`relative group p-3 sm:p-4 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 border ${
                              isSelected ? styles.activeBg : `border-transparent ${styles.idleBg}`
                            }`}
                          >
                            <span className={`relative z-10 font-bold text-[11px] sm:text-sm tracking-widest uppercase transition-colors duration-300 ${isSelected ? styles.activeText : styles.idleText}`}>
                              {getIntensityTranslation(level)}
                            </span>
                            {explodingButton === level && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {particles.map((_, index) => (
                                  <div 
                                    key={index} 
                                    className={`absolute w-1.5 h-1.5 rounded-full animate-particle ${styles.particle}`}
                                    style={{
                                      '--tw-translate-x': `${(Math.random() - 0.5) * 120}px`,
                                      '--tw-translate-y': `${(Math.random() - 0.5) * 80}px`,
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

                  <div>
                    <label className="flex items-center justify-center gap-2 mb-3 text-sm font-medium text-purple-200 tracking-wide uppercase"><Smile size={16} className="text-emerald-400" /> {t('add_activity.mood')}</label>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-[#0B0316]/50 border border-purple-950 rounded-2xl shadow-inner">
                      {moods.map((m) => {
                        const isSelected = form.mood === m.emoji;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleMoodSelect(m.emoji)}
                            className={`text-2xl sm:text-3xl p-2 rounded-xl transition-all duration-300 active:scale-90 border-none outline-none ${
                              isSelected 
                                ? 'bg-purple-800 scale-110 shadow-[0_0_8px_rgba(147,51,234,0.3)] opacity-100' 
                                : 'bg-transparent opacity-40 hover:opacity-100 hover:scale-110'
                            }`}
                          >
                            {m.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-center gap-2 mb-3 text-sm font-medium text-purple-200 tracking-wide uppercase"><CalendarDays size={16} className="text-pink-400" /> {t('add_activity.date')}</label>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(true)}
                      className="w-full min-h-[4rem] p-3 px-3 sm:px-5 bg-[#0B0316]/60 border border-purple-500/20 rounded-2xl hover:border-purple-400/50 hover:bg-[#13072E]/60 transition-all duration-300 flex items-center justify-between gap-2 group text-left shadow-inner"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all shrink-0">
                          <CalendarDays size={20} />
                        </div>
                        <span className="font-bold tracking-wide text-white text-sm sm:text-base truncate">
                          {formatDisplayDate(form.date)}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-purple-400/50 uppercase tracking-widest bg-purple-500/10 px-2 sm:px-3 py-1.5 rounded-lg group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors shrink-0">
                        {t('add_activity.change')}
                      </span>
                    </button>
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-5 px-6 rounded-2xl shadow-[0_4px_20px_rgba(147,51,234,0.4)] hover:shadow-[0_6px_30px_rgba(147,51,234,0.6)] transform transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-purple-400/30 tracking-widest uppercase text-lg mt-8 flex items-center justify-center gap-3">
                    <Sparkles size={24} />
                    {t('add_activity.save_workout')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {isHistoryOpen && (
            <div 
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#0B0316]/90 backdrop-blur-sm sm:px-4"
              style={{
                opacity: (dragY > 200 && !isDragging) || dragY === 1000 ? 0 : 1,
                transition: 'opacity 0.3s ease-out'
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) closeHistory();
              }}
            >
              <div 
                className="bg-[#13072E] border-t sm:border border-purple-500/30 rounded-t-[2.5rem] sm:rounded-[2rem] w-full max-w-lg h-[85vh] sm:h-[80vh] flex flex-col relative shadow-[0_-10px_40px_rgba(147,51,234,0.15)] animate-in slide-in-from-bottom-full duration-300"
                style={{ 
                  transform: `translateY(${dragY}px)`, 
                  transition: !isDragging ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'none' 
                }}
              >
                
                <div className="w-full flex justify-center pt-2 pb-4 sm:hidden">
                  <div 
                    className="px-8 py-4 active:opacity-50 transition-opacity cursor-grab"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="w-16 h-1.5 bg-purple-500/40 rounded-full pointer-events-none"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-6 pb-4 pt-0 sm:pt-6 border-b border-purple-500/20">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    {t('add_activity.history_title')}
                  </h2>
                  
                  <div className="flex items-center gap-2">
                    {activities.length > 0 && (
                      <button 
                        type="button"
                        onClick={handleClearAllHistory}
                        className="p-2 bg-red-500/10 rounded-xl text-red-400 hover:text-white hover:bg-red-500/30 transition-colors shadow-inner"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    
                    <button 
                      type="button"
                      onClick={closeHistory} 
                      className="p-2 bg-white/5 rounded-full text-purple-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X size={24}/>
                    </button>
                  </div>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1 space-y-3 pb-24 hide-scrollbar">
                  {activities.length === 0 ? (
                    <div className="text-center text-purple-400/50 mt-10">
                      <History size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="font-bold tracking-wide">{t('add_activity.history_empty')}</p>
                      <p className="text-xs mt-1">{t('add_activity.history_do_first')}</p>
                    </div>
                  ) : (
                    [...activities].reverse().map((a, i) => {
                      const actualIndex = activities.length - 1 - i;
                      const actDef = activityTypes.find(type => type.id === a.type);
                      const displayLabel = a.customName ? a.customName : (actDef ? actDef.label : a.type);
                      const histIcon = actDef?.icon || <Sparkles size={20} className="text-purple-400" />;
                      
                      return (
                        <div key={i} className="border border-purple-500/20 p-4 rounded-2xl flex justify-between items-start bg-[#0B0316]/80 shadow-inner">
                          <div className="text-slate-300 text-sm w-full">
                            <div className="flex items-center gap-3 mb-3">
                              {React.cloneElement(histIcon, { size: 20, className: `${histIcon.props.className} drop-shadow-[0_0_5px_currentColor]` })}
                              <strong className="text-white text-base tracking-wide">{displayLabel}</strong> 
                              <span className="text-purple-400/60 ml-auto text-xs font-medium">{a.date}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-purple-900/40 pt-2.5">
                              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-200"><Clock size={14} className="text-indigo-400"/> {a.duration} min</span>
                              {a.distance && <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-200"><MapPin size={14} className="text-purple-400"/> {a.distance} km</span>}
                              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-200"><Zap size={14} className="text-yellow-400"/> {getIntensityTranslation(a.intensity)}</span>
                              
                              {a.calories && <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-200"><Flame size={14} className="text-orange-500"/> {a.calories} kcal</span>}
                              
                              {a.mood && <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-200"><Smile size={14} className="text-emerald-400"/> {a.mood}</span>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <button type="button" onClick={() => handleRepeat(a)} className="text-sky-400 hover:text-sky-300 p-2.5 bg-sky-500/10 hover:bg-sky-500/20 rounded-xl transition-colors flex items-center justify-center">
                              <RefreshCw size={16} strokeWidth={2.5} />
                            </button>
                            <button type="button" onClick={() => handleDelete(actualIndex)} className="text-red-400 hover:text-red-300 p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors flex items-center justify-center">
                              <X size={16} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {isDatePickerOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-[#0B0316]/90 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-[#13072E] border border-purple-500/40 rounded-[2rem] p-6 pt-14 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.3)] relative animate-in zoom-in-95 duration-300">
                
                <button type="button" onClick={() => setIsDatePickerOpen(false)} className="absolute top-4 right-4 text-purple-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full z-10">
                  <X size={20} />
                </button>

                <div className="flex justify-between items-center mb-6 px-2 relative z-0">
                  <button type="button" onClick={handlePrevMonth} className="p-2 text-purple-400 hover:text-fuchsia-400 hover:bg-white/5 rounded-xl transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-sm">
                    {monthNames[calendarMonth]} <span className="text-purple-400">{calendarYear}</span>
                  </h3>
                  <button type="button" onClick={handleNextMonth} className="p-2 text-purple-400 hover:text-fuchsia-400 hover:bg-white/5 rounded-xl transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day, i) => (
                    <div key={i} className="text-center text-xs font-bold text-purple-300/60 uppercase tracking-wider py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                  {Array.from({ length: startingEmptyCells }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNumber = i + 1;
                    const dString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                    const isSelected = form.date === dString;
                    
                    const todayObj = new Date();
                    const isToday = todayObj.getDate() === dayNumber && todayObj.getMonth() === calendarMonth && todayObj.getFullYear() === calendarYear;

                    return (
                      <button
                        key={dayNumber}
                        type="button"
                        onClick={() => handleDateSelect(dayNumber)}
                        className={`h-10 w-full rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 active:scale-90
                          ${isSelected 
                            ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' 
                            : isToday 
                              ? 'border border-purple-500/50 text-purple-300 hover:bg-purple-500/20' 
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        {dayNumber}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex justify-center">
                    <button 
                      type="button"
                      onClick={setToday}
                      className="text-sm font-bold text-purple-400 hover:text-fuchsia-400 transition-colors tracking-widest uppercase"
                    >
                      {t('add_activity.today')}
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default AddActivity;