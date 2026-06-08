import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage'; // ИМПОРТ НОВОЙ БАЗЫ ДАННЫХ
import { 
  Flame, Dumbbell, Bike, Flower2, Footprints, Waves, Sparkles, HeartPulse,
  Mountain, Swords, Wind, Activity, Clock, Zap, Smile, CheckCircle2, ChevronRight, MapPin, CalendarDays, ChevronLeft, X, Droplet, Apple, Battery
} from 'lucide-react';

const Home = ({ userName, gender, periodDate }) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Локальный стэйт для даты цикла
  const [localPeriodDate, setLocalPeriodDate] = useState(() => localStorage.getItem('periodDate') || periodDate || '');

  // НОВЫЙ СТЭЙТ: Режим редактирования даты
  const [isEditingCycle, setIsEditingCycle] = useState(false);

  // Стэйты для анимации взрыва
  const [isExploding, setIsExploding] = useState(false);
  const [explosionParticles, setExplosionParticles] = useState([]);
  const [explosionOrigin, setExplosionOrigin] = useState({ x: 0, y: 0 });
  
  const [showZeroStreakMessage, setShowZeroStreakMessage] = useState(false);
  const [isGoalAnimating, setIsGoalAnimating] = useState(false);

  // Стэйты для модального окна полного календаря
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const [selectedActivityItem, setSelectedActivityItem] = useState(null);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);

  // --- ИЗМЕНЕНИЕ: АСИНХРОННАЯ ЗАГРУЗКА ИЗ localforage ---
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const stored = await localforage.getItem('activities');
        if (stored) {
          setActivities(stored);
        }
      } catch (error) {
        console.error("Błąd podczas ładowania aktywności:", error);
      }
    };
    
    loadActivities();
  }, []);

  useEffect(() => {
    // Надежная синхронизация: всегда берем самую свежую дату из памяти телефона
    setLocalPeriodDate(localStorage.getItem('periodDate') || '');
  }, [periodDate]);

  const activityTypes = [
    { id: 'Bieganie', icon: <Flame size={20} className="text-orange-400" /> },
    { id: 'Trening siłowy', icon: <Dumbbell size={20} className="text-slate-300" /> },
    { id: 'Jazda na rowerze', icon: <Bike size={20} className="text-sky-400" /> },
    { id: 'Joga', icon: <Flower2 size={20} className="text-pink-400" /> },
    { id: 'Spacer', icon: <Footprints size={20} className="text-emerald-400" /> },
    { id: 'Pływanie', icon: <Waves size={20} className="text-blue-400" /> },
    { id: 'Kardio', icon: <HeartPulse size={20} className="text-red-400" /> },
    { id: 'Trekking', icon: <Mountain size={20} className="text-emerald-500" /> },
    { id: 'Sporty walki', icon: <Swords size={20} className="text-rose-500" /> },
    { id: 'Rolki', icon: <Wind size={20} className="text-cyan-400" /> },
    { id: 'Rozciąganie', icon: <Activity size={20} className="text-violet-400" /> },
    { id: 'Inne', icon: <Sparkles size={20} className="text-yellow-400" /> },
  ];

  const getIconForType = (type) => {
    const found = activityTypes.find(a => a.id === type);
    return found ? found.icon : <Sparkles size={20} className="text-purple-400" />;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const todayStr = new Date().toISOString().split('T')[0];
    const hasActivitySelected = activities.some(a => a.date === selectedDate);

    if (selectedDate === todayStr) {
      if (hasActivitySelected) {
        if (hour >= 5 && hour < 12) return "Poranny trening zaliczony! 🔥";
        if (hour >= 12 && hour < 18) return "Świetne tempo dzisiaj! ⚡";
        return "Świetna robota dzisiaj! 🌙";
      } else {
        if (hour >= 5 && hour < 12) return "Gotowy na poranny trening? 🌅";
        if (hour >= 12 && hour < 18) return "Czas na popołudniową aktywność! ⚡";
        return "Zacznij swoją aktywność już teraz! 🌙";
      }
    } else if (selectedDate < todayStr) {
      if (hasActivitySelected) {
        return "Trening zaliczony w tym dniu! 🔥";
      } else {
        return "Dzień regeneracji? 🌱";
      }
    } else {
      return "Planujesz nowy trening? 🎯";
    }
  };

  const getCycleData = (targetDateStr, startDateStr) => {
    if (gender !== 'female' || !startDateStr) return null;
    
    const target = new Date(targetDateStr);
    const start = new Date(startDateStr);
    target.setHours(0,0,0,0);
    start.setHours(0,0,0,0);
    
    const diffTime = target - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null; 
    
    const cycleDayNum = (diffDays % 28) + 1;

    if (cycleDayNum >= 1 && cycleDayNum <= 7) {
      return { 
        day: cycleDayNum, name: "Faza menstruacyjna", icon: Waves, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30",
        goal: 20, energy: "Niski", 
        advice: "Daj ciału odpocząć. Wybierz lekką Jogę, Rozciąganie lub krótki spacer.",
        nutrition: "Jedz pokarmy bogate w żelazo, zdrowe tłuszcze i gorzką czekoladę."
      };
    } else if (cycleDayNum >= 8 && cycleDayNum <= 12) { 
      return { 
        day: cycleDayNum, name: "Faza folikularna", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30",
        goal: 40, energy: "Wysoki", 
        advice: "Energia rośnie! Świetny czas na Kardio, bieganie i nowe wyzwania.",
        nutrition: "Wybieraj lekkie, świeże posiłki, sałatki, chude białko i fermentowane jedzenie."
      };
    } else if (cycleDayNum >= 13 && cycleDayNum <= 15) {
      return { 
        day: cycleDayNum, name: "Owulacja", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30",
        goal: 45, energy: "Maksymalny", 
        advice: "Jesteś na szczycie! Najlepszy czas na ciężką Siłownię i bicie rekordów.",
        nutrition: "Jedz warzywa krzyżowe (np. brokuły), aby pomóc w metabolizmie estrogenów."
      };
    } else {
      return { 
        day: cycleDayNum, name: "Faza lutealna", icon: Flower2, color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/30",
        goal: 30, energy: "Spadający", 
        advice: "Zwolnij tempo w drugiej połowie fazy. Wybierz Pilates lub umiarkowany trening.",
        nutrition: "Sięgaj po złożone węglowodany (bataty, komosa), by zapobiec spadkom cukru."
      };
    }
  };

  const currentCycleData = getCycleData(selectedDate, localPeriodDate);

  const getDaysUntilNextPeriod = () => {
    if (!localPeriodDate) return 28;
    const today = new Date();
    const start = new Date(localPeriodDate);
    today.setHours(0,0,0,0);
    start.setHours(0,0,0,0);
    
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 28;
    
    const currentDayInCycle = (diffDays % 28) + 1;
    return 28 - currentDayInCycle + 1;
  };

  const daysUntilNextPeriod = getDaysUntilNextPeriod();

  const getDatesOfWeek = () => {
    const curr = new Date(selectedDate);
    const week = [];
    const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(first));

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      week.push(nextDate);
    }
    return week;
  };

  const weekDates = getDatesOfWeek();
  const weekDaysShort = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];

  const defaultGoalMinutes = gender === 'female' ? 30 : 50;
  const dailyGoalMinutes = currentCycleData ? currentCycleData.goal : defaultGoalMinutes; 
  
  const todayActivities = activities.filter(a => a.date === selectedDate);
  const totalMinutesToday = todayActivities.reduce((sum, a) => sum + parseInt(a.duration || 0), 0);
  const goalProgress = Math.min((totalMinutesToday / dailyGoalMinutes) * 100, 100);
  const isGoalReached = totalMinutesToday >= dailyGoalMinutes;

  const calculateStreak = () => {
    if (!activities || activities.length === 0) return 0;

    const uniqueDates = [...new Set(activities.map(a => a.date))].sort();
    const latestDateStr = uniqueDates[uniqueDates.length - 1];
    
    let currDate = new Date(latestDateStr);
    let streak = 0;

    while (true) {
      const year = currDate.getFullYear();
      const month = String(currDate.getMonth() + 1).padStart(2, '0');
      const day = String(currDate.getDate()).padStart(2, '0');
      const checkStr = `${year}-${month}-${day}`;

      if (uniqueDates.includes(checkStr)) {
        streak++;
        currDate.setDate(currDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  const handleGoalClick = () => {
    if (isGoalAnimating) return;
    setIsGoalAnimating(true);
    setTimeout(() => {
      setIsGoalAnimating(false);
    }, 400);
  };

  const handleStreakClick = (e) => {
    if (isExploding || showZeroStreakMessage) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    setExplosionOrigin({ x: originX, y: originY });

    if (currentStreak < 2) {
      setShowZeroStreakMessage(true);
      setTimeout(() => {
        setShowZeroStreakMessage(false);
      }, 2000); 
      return;
    }

    const particleCount = Math.min(30 + currentStreak * 4, 80); 
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 350; 
      
      const typeRand = Math.random();
      let type = 'lava';
      let emoji = '';
      let color = '';

      if (typeRand > 0.5) {
        type = 'emoji'; 
        emoji = '🔥';
      } else {
        type = 'lava';
        const colors = ['text-orange-500', 'text-red-600', 'text-yellow-400'];
        color = colors[Math.floor(Math.random() * colors.length)];
      }

      const size = type === 'lava' ? (6 + Math.random() * 14) : 24; 

      return {
        id: i,
        type,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        size,
        targetScale: type === 'lava' ? (1 + Math.random() * 1) : (1 + Math.random() * 1.5), 
        duration: 0.6 + Math.random() * 0.5,
        rot: Math.random() * 360,
        emoji,
        color
      };
    });

    setExplosionParticles(newParticles);
    setIsExploding(true);

    setTimeout(() => {
      setIsExploding(false);
      setExplosionParticles([]);
    }, 1100);
  };

  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
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
    setSelectedDate(`${calendarYear}-${formattedMonth}-${formattedDay}`);
    setIsDatePickerOpen(false); 
  };

  const openCalendar = () => {
    const [y, m] = selectedDate.split('-');
    setCalendarYear(parseInt(y, 10));
    setCalendarMonth(parseInt(m, 10) - 1);
    setIsDatePickerOpen(true);
  };

  const handleLogPeriod = () => {
    setLocalPeriodDate(selectedDate);
    localStorage.setItem('periodDate', selectedDate);
    setIsEditingCycle(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalProgress / 100) * circumference;

  return (
    <div className="w-full pb-28 pt-6 px-4 sm:px-6 mx-auto max-w-7xl relative">
      
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        
        .fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .animate-modal-pop { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes modalPop { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        @keyframes fire-lava-burst {
          0% { transform: translate(-50%, -50%) scale(0) rotate(var(--rot)); opacity: 1; filter: brightness(2); }
          20% { opacity: 1; filter: brightness(1.5); }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(var(--s)) rotate(calc(var(--rot) + 180deg)); opacity: 0; filter: blur(3px) brightness(0.5); }
        }
        
        @keyframes shock-wave {
          0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; border-width: 8px; }
          100% { transform: translate(-50%, -50%) scale(5); opacity: 0; border-width: 0px; }
        }
        
        @keyframes earthquake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-3px, 2px) rotate(-1deg); }
          50% { transform: translate(3px, -2px) rotate(1deg); }
        }
        
        .animate-quake { animation: earthquake 0.4s ease-in-out; }
        .animate-wave { animation: shock-wave 0.6s ease-out forwards; }
        
        .lava-particle { 
          border-radius: 50%; 
          background-color: currentColor; 
          box-shadow: inset -2px -2px 6px rgba(0,0,0,0.3), 0 0 15px currentColor; 
        }

        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes float-up-fade {
          0% { opacity: 0; transform: translateY(0) scale(0.8); }
          15% { opacity: 1; transform: translateY(-25px) scale(1); }
          85% { opacity: 1; transform: translateY(-40px) scale(1); }
          100% { opacity: 0; transform: translateY(-55px) scale(0.8); }
        }
        .animate-error-shake { animation: error-shake 0.4s ease-in-out; }

        @keyframes success-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); filter: brightness(1.2); }
          100% { transform: scale(1); }
        }
        .animate-success-pop { animation: success-pop 0.4s ease-in-out; }

        @keyframes pink-breathe {
          0%, 100% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.1); }
          50% { box-shadow: 0 0 15px rgba(236, 72, 153, 0.35); }
        }
        .pink-glow-breathe {
          animation: pink-breathe 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* ШАПКА */}
      <div className="mb-8 text-left fade-in-up">
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent mb-1">
          {userName ? `Cześć, ${userName}!` : 'Cześć!'}
        </h2>
        <p className="text-purple-400/60 text-sm font-medium tracking-wide">
          {getGreeting()}
        </p>
      </div>

      {/* МИНИ-НЕДЕЛЯ С КНОПКОЙ КАЛЕНДАРЯ */}
      <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 mb-4 shadow-[0_8px_30px_rgba(147,51,234,0.1)] fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-white font-bold tracking-wide">Wybrany Tydzień</span>
          
          <button 
            onClick={openCalendar}
            className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 hover:bg-purple-500/25 text-purple-400 hover:text-purple-300 rounded-lg transition-all active:scale-95 border border-purple-500/20 select-none focus:outline-none"
          >
            <CalendarDays size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider select-none">Kalendarz</span>
          </button>
        </div>
        
        <div className="flex justify-between items-center gap-1">
          {weekDates.map((dateObj, i) => {
            const dateStr = dateObj.toISOString().split('T')[0];
            const isSelected = dateStr === selectedDate;
            const isTodayBtn = dateStr === todayStr;
            
            const dayActivitiesArr = activities.filter(a => a.date === dateStr);
            const hasActivity = dayActivitiesArr.length > 0;
            
            const dayCycle = getCycleData(dateStr, localPeriodDate);
            const isPeriodDay = dayCycle && dayCycle.day >= 1 && dayCycle.day <= 7;

            let dotClass = "bg-purple-400";
            if (hasActivity) {
              const defDayGoal = gender === 'female' ? 30 : 50; 
              const dayGoal = dayCycle ? dayCycle.goal : defDayGoal;
              const dayMinutes = dayActivitiesArr.reduce((sum, a) => sum + parseInt(a.duration || 0), 0);
              if (isSelected) dotClass = "bg-white shadow-[0_0_5px_white]";
              else if (dayMinutes >= dayGoal) dotClass = "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.6)]";
            }

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center justify-center w-11 h-16 rounded-2xl transition-all duration-300 relative active:scale-90 select-none focus:outline-none
                  ${isSelected 
                    ? 'bg-gradient-to-b from-fuchsia-500 to-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                    : isTodayBtn 
                      ? 'bg-purple-500/20 border border-purple-500/50' 
                      : 'hover:bg-white/5 border border-transparent'}
                `}
              >
                {/* РОЗОВАЯ ТОЧКА МЕСЯЧНЫХ */}
                {isPeriodDay && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.8)] animate-pulse"></div>
                )}

                <span className={`text-[10px] font-bold uppercase mb-1 select-none ${isSelected ? 'text-purple-100' : 'text-purple-400/60'}`}>
                  {weekDaysShort[i]}
                </span>
                <span className={`text-base font-black select-none ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {dateObj.getDate()}
                </span>
                
                {hasActivity && (
                  <span className={`absolute bottom-[2px] w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- БЛОК С ЖЕНСКИМ ЦИКЛОМ (Показывается только если gender === 'female') --- */}
      {gender === 'female' && (
        <div className="mb-6 flex flex-col items-center w-full fade-in-up" style={{ animationDelay: '0.15s' }}>
          
          {/* КАРТОЧКА ВИДЖЕТА */}
          {currentCycleData ? (
            <div 
              onClick={() => setIsCycleModalOpen(true)}
              className="w-full bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-3 shadow-inner flex items-center justify-between cursor-pointer hover:bg-[#13072E]/60 hover:border-pink-500/30 transition-all group" 
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${currentCycleData.bg} ${currentCycleData.color} shadow-inner`}>
                  <currentCycleData.icon size={18} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-0.5 group-hover:text-pink-100 transition-colors">
                    {currentCycleData.name} <span className="text-purple-400/60 ml-1">Dzień {currentCycleData.day}</span>
                  </h4>
                  <p className="text-[10px] text-purple-300/70 font-medium line-clamp-1">{currentCycleData.advice}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-purple-500/30 group-hover:text-pink-400 transition-colors" />
            </div>
          ) : (
            <div className="w-full bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-3 shadow-inner flex items-center justify-between select-none opacity-80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400/50 shadow-inner">
                  <Flower2 size={18} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-0.5">
                    Cykl menstruacyjny
                  </h4>
                  <p className="text-[10px] text-purple-300/60 font-medium line-clamp-1">Brak danych. Zaznacz dzień startu poniżej.</p>
                </div>
              </div>
            </div>
          )}

          {/* УМНАЯ КНОПКА С РЕЖИМОМ РЕДАКТИРОВАНИЯ */}
          {!localPeriodDate || isEditingCycle ? (
            <button
              onClick={handleLogPeriod}
              className="mt-3 px-4 py-3 w-[90%] sm:w-[80%] bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:text-pink-200 hover:bg-pink-500/20 text-[10.5px] font-black tracking-widest uppercase rounded-2xl active:scale-95 transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 pink-glow-breathe"
            >
              <Droplet size={16} className="animate-pulse" />
              <span>Miesiączka zaczęła się {isToday ? 'dzisiaj' : 'w tym dniu'}</span>
            </button>
          ) : (
            <div className="mt-3 w-[90%] sm:w-[80%] flex h-11 rounded-2xl border border-pink-500/30 bg-pink-500/10 overflow-hidden pink-glow-breathe transition-all">
              
              <div className="flex-1 flex items-center justify-center px-1 sm:px-2 text-pink-400 text-[8.5px] sm:text-[10px] font-black tracking-widest uppercase text-center leading-none whitespace-nowrap">
                {currentCycleData && currentCycleData.day <= 7 ? (
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <span>Miesiączka: {8 - currentCycleData.day} {8 - currentCycleData.day === 1 ? 'dzień' : 'dni'}</span>
                    <span className="opacity-40">|</span>
                    <span className="text-pink-500/80">Następna za {daysUntilNextPeriod} dni</span>
                  </span>
                ) : (
                  <span>Następna za {daysUntilNextPeriod} dni</span>
                )}
              </div>
              
              <div className="w-px bg-pink-500/30"></div>
              
              <button 
                onClick={() => setIsEditingCycle(true)}
                className="w-14 flex items-center justify-center text-pink-400 hover:text-white hover:bg-pink-500/30 transition-colors focus:outline-none"
              >
                <X size={16} strokeWidth={3} />
              </button>
              
            </div>
          )}
          
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        {/* КАРТОЧКА ЦЕЛИ ДНЯ */}
        <div 
          onClick={handleGoalClick}
          className={`bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-5 flex flex-col items-center justify-center relative overflow-hidden select-none transition-all duration-500 cursor-pointer
            ${isGoalAnimating 
              ? (isGoalReached ? 'animate-success-pop shadow-[0_0_30px_rgba(52,211,153,0.3)]' : 'animate-error-shake shadow-inner') 
              : 'hover:bg-[#13072E]/60 shadow-inner'}
          `}
        >
          <span className="text-xs font-bold text-purple-200 tracking-wider uppercase mb-3 flex items-center gap-1.5 z-10 text-center">
            <Clock size={14} className={isGoalReached ? 'text-emerald-400' : 'text-indigo-400'}/> Cel Dnia
          </span>
          <div className="relative flex items-center justify-center w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#0B0316]" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={(2 * Math.PI * 40) - (goalProgress / 100) * (2 * Math.PI * 40)}
                className={`transition-all duration-1000 ease-out ${isGoalReached ? 'text-emerald-400' : 'text-fuchsia-500'}`} 
                style={{ filter: `drop-shadow(0px 0px 8px ${isGoalReached ? 'rgba(52,211,153,0.7)' : 'rgba(217,70,239,0.7)'})` }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center mt-0.5">
              <span className={`text-xl font-black transition-colors duration-500 leading-none ${isGoalReached ? 'text-emerald-400' : 'text-white'}`}>
                {totalMinutesToday}
              </span>
              <span className="text-[9px] font-bold text-purple-400 uppercase mt-1">/ {dailyGoalMinutes} min</span>
            </div>
          </div>
          {isGoalReached && (
             <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.2)] animate-pulse">
               <CheckCircle2 size={12}/> Zrealizowano
             </div>
          )}
        </div>

        {/* КАРТОЧКА СЕРИИ */}
        <div 
          onClick={handleStreakClick}
          className={`bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-5 flex flex-col items-center justify-center relative cursor-pointer transition-colors z-20 select-none
            ${isExploding ? 'animate-quake' : showZeroStreakMessage ? 'animate-error-shake' : 'hover:bg-[#13072E]/60'}
            shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] hover:shadow-[inset_0_0_20px_rgba(249,115,22,0.15)] overflow-hidden
          `}
        >
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent transition-opacity duration-300 pointer-events-none rounded-3xl ${isExploding ? 'opacity-100' : 'opacity-0'}`} />

          <div className="absolute -right-6 -bottom-6 opacity-20 relative z-0 pointer-events-none">
            <Flame size={100} className="text-orange-500" />
          </div>

          <span className="text-xs font-bold text-purple-200 tracking-wider uppercase mb-2 flex items-center gap-1.5 relative z-10">
            <Flame size={14} className="text-orange-400"/> Seria
          </span>
          <div className="flex items-end gap-1 relative z-10 mt-2">
            <span className="text-5xl font-black bg-gradient-to-br from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              {currentStreak}
            </span>
          </div>
          <span className="text-[10px] font-bold text-purple-400/60 uppercase tracking-widest mt-1 relative z-10">Dni z rzędu</span>
        </div>

      </div>

      {/* АКТИВНОСТИ ЗА ВЫБРАННЫЙ ДЕНЬ */}
      <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-extrabold text-white tracking-wide">
            Aktywności: <span className="text-purple-400">{selectedDate}</span>
          </h3>
        </div>

        <div className="space-y-3">
          {todayActivities.length === 0 ? (
            <button 
              onClick={() => navigate('/add')} 
              className="w-full bg-[#13072E]/30 border border-purple-500/30 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-inner hover:bg-[#13072E]/60 hover:border-purple-500/50 transition-all active:scale-95 group focus:outline-none"
            >
              <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Activity size={28} className="text-purple-400/80 group-hover:text-fuchsia-400 transition-colors" />
              </div>
              <p className="text-slate-200 font-bold tracking-wide mb-1.5 group-hover:text-white transition-colors">Brak aktywności</p>
              <p className="text-[10px] text-fuchsia-400/80 uppercase tracking-widest font-bold bg-fuchsia-500/10 px-3 py-1 rounded-lg">
                + Dodaj pierwszy trening
              </p>
            </button>
          ) : (
            [...todayActivities].reverse().map((a, i) => {
              const displayLabel = a.customName ? a.customName : a.type;
              
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedActivityItem(a)}
                  className="bg-[#13072E]/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between group shadow-sm hover:border-purple-500/40 transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0B0316]/60 border border-purple-500/20 flex items-center justify-center shadow-inner group-hover:border-purple-400/50 transition-colors">
                      {getIconForType(a.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold tracking-wide mb-1 text-base group-hover:text-purple-100 transition-colors truncate">
                        {displayLabel}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-300/70 whitespace-nowrap">
                          <Clock size={12} className="text-indigo-400"/> {a.duration} min
                        </span>
                        {a.distance && (
                          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-300/70 whitespace-nowrap">
                            <MapPin size={12} className="text-sky-400"/> {a.distance} km
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-300/70 whitespace-nowrap">
                          <Zap size={12} className="text-yellow-400"/> {a.intensity}
                        </span>
                        {a.mood && (
                          <span className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-purple-300/70 whitespace-nowrap">
                            <Smile size={12} className="text-emerald-400"/> {a.mood}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-purple-500/30 group-hover:text-purple-400 transition-colors ml-3 shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- МОДАЛЬНОЕ ОКНО "ПОДРОБНОСТИ ЦИКЛА" --- */}
      {isCycleModalOpen && currentCycleData && (
        <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center bg-[#0B0316]/90 backdrop-blur-md transition-all duration-300">
          <div className="bg-[#13072E] border-t sm:border border-purple-500/40 rounded-t-[2rem] sm:rounded-[2rem] p-6 w-full max-w-md shadow-[0_-20px_60px_rgba(168,85,247,0.2)] animate-modal-pop">
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentCycleData.bg} ${currentCycleData.color} shadow-inner`}>
                  <currentCycleData.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">{currentCycleData.name}</h3>
                  <p className="text-sm font-bold text-purple-400/80">Dzień {currentCycleData.day} cyklu</p>
                </div>
              </div>
              <button onClick={() => setIsCycleModalOpen(false)} className="text-purple-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full focus:outline-none">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-[#0B0316]/60 border border-purple-500/10 rounded-2xl p-4 flex gap-3">
                <Battery size={20} className={currentCycleData.color} />
                <div>
                  <p className="text-[10px] font-bold uppercase text-purple-400/60 mb-0.5">Poziom energii</p>
                  <p className="text-sm text-white font-medium">{currentCycleData.energy}</p>
                </div>
              </div>

              <div className="bg-[#0B0316]/60 border border-purple-500/10 rounded-2xl p-4 flex gap-3">
                <Dumbbell size={20} className="text-fuchsia-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-purple-400/60 mb-0.5">Trening (Cel: {currentCycleData.goal} min)</p>
                  <p className="text-sm text-white font-medium leading-snug">{currentCycleData.advice}</p>
                </div>
              </div>

              <div className="bg-[#0B0316]/60 border border-purple-500/10 rounded-2xl p-4 flex gap-3">
                <Apple size={20} className="text-emerald-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-purple-400/60 mb-0.5">Odżywianie</p>
                  <p className="text-sm text-white font-medium leading-snug">{currentCycleData.nutrition}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsCycleModalOpen(false)} 
              className="w-full py-3.5 bg-purple-500/10 text-purple-300 font-bold tracking-widest uppercase rounded-2xl hover:bg-purple-500/20 active:scale-95 transition-all focus:outline-none"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ АКТИВНОСТИ --- */}
      {selectedActivityItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-[#0B0316]/90 backdrop-blur-md transition-all duration-300">
          <div className="bg-[#13072E] border border-purple-500/40 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.3)] relative animate-modal-pop text-center">
            
            <button type="button" onClick={() => setSelectedActivityItem(null)} className="absolute top-4 right-4 text-purple-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full z-10 focus:outline-none">
              <X size={20} />
            </button>

            <div className="w-20 h-20 mx-auto bg-[#0B0316]/60 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              {React.cloneElement(getIconForType(selectedActivityItem.type), { size: 36 })}
            </div>
            
            <h3 className="text-2xl font-black text-white mb-1">
              {selectedActivityItem.customName || selectedActivityItem.type}
            </h3>
            <p className="text-sm text-purple-400/60 font-medium mb-6">{selectedActivityItem.date}</p>

            <div className="grid grid-cols-2 gap-3 text-left mb-6">
              <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-purple-400/60 mb-1"><Clock size={12}/> Czas</span>
                <span className="text-white font-bold whitespace-nowrap">{selectedActivityItem.duration} min</span>
              </div>
              {selectedActivityItem.distance && (
                <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-purple-400/60 mb-1"><MapPin size={12}/> Dystans</span>
                  <span className="text-white font-bold whitespace-nowrap">{selectedActivityItem.distance} km</span>
                </div>
              )}
              <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-purple-400/60 mb-1"><Zap size={12}/> Intensywność</span>
                <span className="text-white font-bold whitespace-nowrap">{selectedActivityItem.intensity}</span>
              </div>
              {selectedActivityItem.mood && (
                <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-xl p-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-purple-400/60 mb-1"><Smile size={12}/> Nastrój</span>
                  <span className="text-white font-bold text-lg leading-none">{selectedActivityItem.mood}</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setSelectedActivityItem(null)} 
              className="w-full py-3 bg-purple-500/10 text-purple-300 font-bold tracking-widest uppercase rounded-xl hover:bg-purple-500/20 transition-colors focus:outline-none"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛЬНОЕ ОКНО КАЛЕНДАРЯ --- */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-[#0B0316]/90 backdrop-blur-md transition-all duration-300">
          <div className="bg-[#13072E] border border-purple-500/40 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.3)] relative animate-modal-pop">
            
            <button type="button" onClick={() => setIsDatePickerOpen(false)} className="absolute top-4 right-4 text-purple-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full z-10 focus:outline-none">
              <X size={20} />
            </button>

            <div className="flex justify-between items-center mb-6 mt-2 px-2 relative z-0">
              <button type="button" onClick={handlePrevMonth} className="p-2 text-purple-400 hover:text-fuchsia-400 hover:bg-white/5 rounded-xl transition-all focus:outline-none">
                <ChevronLeft size={24} />
              </button>
              <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-sm select-none">
                {monthNames[calendarMonth]} <span className="text-purple-400">{calendarYear}</span>
              </h3>
              <button type="button" onClick={handleNextMonth} className="p-2 text-purple-400 hover:text-fuchsia-400 hover:bg-white/5 rounded-xl transition-all focus:outline-none">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDaysShort.map((day, i) => (
                <div key={i} className="text-center text-xs font-bold text-purple-300/60 uppercase tracking-wider py-1 select-none">
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
                const isSelected = selectedDate === dString;
                
                const todayObj = new Date();
                const isToday = todayObj.getDate() === dayNumber && todayObj.getMonth() === calendarMonth && todayObj.getFullYear() === calendarYear;
                
                const dayActivitiesArr = activities.filter(a => a.date === dString);
                const dayMinutes = dayActivitiesArr.reduce((sum, a) => sum + parseInt(a.duration || 0), 0);
                const hasActivity = dayActivitiesArr.length > 0;
                
                const dayCycle = getCycleData(dString, localPeriodDate);
                const isPeriodDay = dayCycle && dayCycle.day >= 1 && dayCycle.day <= 7;
                const defaultDayGoal = gender === 'female' ? 30 : 50; 
                const dayGoal = dayCycle ? dayCycle.goal : defaultDayGoal;
                const isDayGoalReached = dayMinutes >= dayGoal;

                return (
                  <button
                    key={dayNumber}
                    type="button"
                    onClick={() => handleDateSelect(dayNumber)}
                    className={`relative h-10 w-full rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 active:scale-90 select-none focus:outline-none
                      ${isSelected 
                        ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' 
                        : isToday 
                          ? 'border border-purple-500/50 text-purple-300 hover:bg-purple-500/20' 
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {isPeriodDay && (
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.8)] animate-pulse"></div>
                    )}
                    
                    {dayNumber}
                    
                    {hasActivity && !isSelected && (
                      <span className={`absolute bottom-[2px] w-1 h-1 rounded-full ${isDayGoalReached ? 'bg-emerald-400' : 'bg-purple-400'}`}></span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-center">
                <button 
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(today.toISOString().split('T')[0]);
                    setIsDatePickerOpen(false);
                  }}
                  className="text-sm font-bold text-purple-400 hover:text-fuchsia-400 transition-colors tracking-widest uppercase focus:outline-none select-none"
                >
                  Dzisiaj
                </button>
            </div>
          </div>
        </div>
      )}

      {/* АНИМАЦИЯ ПОДСКАЗКИ СЕРИИ */}
      {showZeroStreakMessage && (
        <div 
          className="fixed z-[9999] pointer-events-none left-0 right-0 w-full flex justify-center px-4"
          style={{ 
            top: explosionOrigin.y - 10,  
            animation: 'float-up-fade 2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div className="bg-[#0B0316]/90 border border-orange-500/50 text-white text-[11px] sm:text-xs font-bold px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] backdrop-blur-md flex items-center gap-2 max-w-full text-center">
            <Flame size={16} className="text-orange-400 shrink-0" />
            <span className="whitespace-normal leading-tight">Trenuj 2 dni z rzędu, by odpalić ogień!</span>
          </div>
        </div>
      )}

      {/* ВЗРЫВ */}
      {isExploding && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-visible">
          <div 
            className="absolute w-20 h-20 rounded-full border border-orange-500/40 animate-wave shadow-[0_0_15px_#f97316]"
            style={{ left: explosionOrigin.x, top: explosionOrigin.y, transform: 'translate(-50%, -50%)' }}
          ></div>
          
          {explosionParticles.map((p) => (
            <div 
              key={p.id} 
              className={`absolute flex items-center justify-center select-none ${p.color}`}
              style={{
                left: explosionOrigin.x,
                top: explosionOrigin.y,
                width: p.type === 'lava' ? `${p.size}px` : 'auto',
                height: p.type === 'lava' ? `${p.size}px` : 'auto',
                fontSize: p.type === 'emoji' ? `${p.size}px` : 'inherit',
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--rot': `${p.rot}deg`,
                '--s': p.targetScale,
                animation: `fire-lava-burst ${p.duration}s cubic-bezier(0.15, 0.9, 0.3, 1) forwards`
              }}
            >
              {p.type === 'lava' ? (
                <div className="w-full h-full lava-particle"></div>
              ) : (
                <span className="drop-shadow-lg">{p.emoji}</span>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;