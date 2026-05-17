import React, { useState, useEffect } from 'react';
import { 
  Flame, Dumbbell, Bike, Flower2, Footprints, Waves, Sparkles, HeartPulse,
  Mountain, Swords, Wind, Activity, Clock, Zap, Smile, CheckCircle2, ChevronRight, MapPin
} from 'lucide-react';

const Home = () => {
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Стэйты для анимации взрыва
  const [isExploding, setIsExploding] = useState(false);
  const [explosionParticles, setExplosionParticles] = useState([]);
  const [explosionOrigin, setExplosionOrigin] = useState({ x: 0, y: 0 });

  // Загружаем данные
  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

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

  const getDatesOfWeek = () => {
    const curr = new Date();
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

  const dailyGoalMinutes = 30; 
  const todayActivities = activities.filter(a => a.date === selectedDate);
  const totalMinutesToday = todayActivities.reduce((sum, a) => sum + parseInt(a.duration || 0), 0);
  const goalProgress = Math.min((totalMinutesToday / dailyGoalMinutes) * 100, 100);

  const calculateStreak = () => {
    let streak = 0;
    let currDate = new Date();
    
    const todayStr = currDate.toISOString().split('T')[0];
    const hasWorkoutToday = activities.some(a => a.date === todayStr);

    if (!hasWorkoutToday) {
      currDate.setDate(currDate.getDate() - 1);
      const yesterdayStr = currDate.toISOString().split('T')[0];
      if (!activities.some(a => a.date === yesterdayStr)) {
        return 0; 
      }
    }

    while (true) {
      const dStr = currDate.toISOString().split('T')[0];
      if (activities.some(a => a.date === dStr)) {
        streak++;
        currDate.setDate(currDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Эпичная логика взрыва (Графическая лава)
  const handleStreakClick = (e) => {
    if (isExploding) return;
    
    // Получаем координаты клика, чтобы взрыв был ровно из карточки на весь экран
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    setExplosionOrigin({ x: originX, y: originY });

    const particleCount = Math.min(30 + currentStreak * 6, 120); 
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      // Разлет на весь экран
      const velocity = 50 + Math.random() * 350; 
      const size = 6 + Math.random() * 20; 
      
      const colors = ['text-orange-500', 'text-red-500', 'text-yellow-400', 'text-orange-400'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const duration = 0.6 + Math.random() * 0.8;
      const rot = (angle * 180 / Math.PI) + 45; 
      
      // 3 типа частиц: 1 - капли лавы, 2 - искры, 3 - эмодзи (для эффекта Telegram)
      const typeRand = Math.random();
      let type = 'drop';
      if (typeRand > 0.85) type = 'emoji';
      else if (typeRand > 0.6) type = 'spark';

      let emoji = '';
      if (type === 'emoji') {
        const emojis = ['🔥'];
        emoji = emojis[Math.floor(Math.random() * emojis.length)];
      }

      return {
        id: i,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        size,
        color,
        duration,
        rot,
        type,
        emoji
      };
    });

    setExplosionParticles(newParticles);
    setIsExploding(true);

    setTimeout(() => {
      setIsExploding(false);
      setExplosionParticles([]);
    }, 1500);
  };

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalProgress / 100) * circumference;

  return (
    <div className="w-full pb-28 pt-6 px-4 sm:px-6 mx-auto max-w-7xl relative">
      
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        
        /* Анимация летящей лавы */
        @keyframes lava-fly {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(var(--rot));
            opacity: 1;
            filter: brightness(2);
          }
          30% { opacity: 1; filter: brightness(1.5); }
          100% {
            /* Добавляем гравитацию (+150px вниз) */
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty) + 150px)) scale(1.5) rotate(calc(var(--rot) + 90deg));
            opacity: 0;
            filter: blur(2px) brightness(0.5);
          }
        }

        /* Ударная волна */
        @keyframes lava-shockwave {
          0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; border-width: 15px; }
          100% { transform: translate(-50%, -50%) scale(5); opacity: 0; border-width: 0px; }
        }

        /* Тряска карточки */
        @keyframes card-earthquake {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-4px, 3px) rotate(-2deg); }
          40% { transform: translate(4px, -3px) rotate(2deg); }
          60% { transform: translate(-3px, -3px) rotate(-1deg); }
          80% { transform: translate(3px, 3px) rotate(1deg); }
        }
        
        .animate-card-earthquake {
          animation: card-earthquake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-lava-shockwave {
          animation: lava-shockwave 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        /* Форма капли лавы */
        .lava-drop { 
          border-radius: 0 50% 50% 50%; /* Форма слезы/капли */
          background-color: currentColor;
          box-shadow: inset 2px -2px 6px rgba(0,0,0,0.4), 0 0 15px currentColor;
        }
        /* Форма искры */
        .lava-spark { 
          border-radius: 10px; 
          height: 3px !important; 
          background-color: currentColor;
          box-shadow: 0 0 10px currentColor;
        }
      `}</style>

      {/* ШАПКА */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-left animate-in fade-in-up duration-500">
          <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm mb-1">
            Twój Dashboard
          </h2>
          <p className="text-purple-400/60 text-sm font-medium tracking-wide">
            Gotowy na dzisiejsze wyzwanie?
          </p>
        </div>
      </div>

      {/* МИНИ-НЕДЕЛЯ */}
      <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 mb-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-white font-bold tracking-wide">Ten Tydzień</span>
        </div>
        <div className="flex justify-between items-center gap-1">
          {weekDates.map((dateObj, i) => {
            const dateStr = dateObj.toISOString().split('T')[0];
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const hasActivity = activities.some(a => a.date === dateStr);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center justify-center w-11 h-16 rounded-2xl transition-all duration-300 relative active:scale-90
                  ${isSelected 
                    ? 'bg-gradient-to-b from-fuchsia-500 to-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                    : isToday 
                      ? 'bg-purple-500/20 border border-purple-500/50' 
                      : 'hover:bg-white/5 border border-transparent'}
                `}
              >
                <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-purple-100' : 'text-purple-400/60'}`}>
                  {weekDaysShort[i]}
                </span>
                <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {dateObj.getDate()}
                </span>
                
                {hasActivity && (
                  <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white shadow-[0_0_5px_white]' : 'bg-purple-400'}`}></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        
        {/* КАРТОЧКА ЦЕЛИ ДНЯ */}
        <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-5 flex flex-col items-center justify-center relative shadow-inner">
          <span className="text-xs font-bold text-purple-200 tracking-wider uppercase mb-3 flex items-center gap-1.5 z-10">
            <Clock size={14} className="text-indigo-400"/> Cel Dnia
          </span>
          <div className="relative flex items-center justify-center w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#0B0316]" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={(2 * Math.PI * 40) - (goalProgress / 100) * (2 * Math.PI * 40)}
                className="text-fuchsia-500 transition-all duration-1000 ease-out" 
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(217,70,239,0.7))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white">{totalMinutesToday}</span>
              <span className="text-[9px] font-bold text-purple-400 uppercase">/ {dailyGoalMinutes} min</span>
            </div>
          </div>
          {totalMinutesToday >= dailyGoalMinutes && (
             <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded-lg">
               <CheckCircle2 size={12}/> Zrealizowano
             </div>
          )}
        </div>

        {/* КАРТОЧКА СЕРИИ */}
        <div 
          onClick={handleStreakClick}
          className={`bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-5 flex flex-col items-center justify-center relative cursor-pointer transition-colors z-20 
            ${isExploding ? 'animate-card-earthquake' : 'hover:bg-[#13072E]/60'}
            /* Убрал грязный квадрат! Заменил на аккуратное свечение */
            shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] hover:shadow-[inset_0_0_20px_rgba(249,115,22,0.15)]
          `}
        >
          {/* Статичная фоновая иконка */}
          <div className="absolute -right-6 -bottom-6 opacity-20 relative z-0 pointer-events-none">
            <Flame size={100} className="text-orange-500" />
          </div>

          <span className="text-xs font-bold text-purple-200 tracking-wider uppercase mb-2 flex items-center gap-1.5 relative z-10">
            <Flame size={14} className="text-orange-400"/> Seria
          </span>
          <div className="flex items-end gap-1 relative z-10 mt-2">
            <span className="text-5xl font-black bg-gradient-to-br from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] select-none">
              {currentStreak}
            </span>
          </div>
          <span className="text-[10px] font-bold text-purple-400/60 uppercase tracking-widest mt-1 relative z-10 select-none">Dni z rzędu</span>
        </div>

      </div>

      {/* АКТИВНОСТИ ЗА ВЫБРАННЫЙ ДЕНЬ */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-extrabold text-white tracking-wide">
            Aktywności: <span className="text-purple-400">{selectedDate}</span>
          </h3>
        </div>

        <div className="space-y-3">
          {todayActivities.length === 0 ? (
            <div className="bg-[#0B0316]/50 border border-purple-500/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-inner">
              <Sparkles size={40} className="text-purple-500/30 mb-3" />
              <p className="text-slate-300 font-bold tracking-wide mb-1">Brak aktywności</p>
              <p className="text-xs text-purple-400/50">W tym dniu jeszcze nie trenowałeś.</p>
            </div>
          ) : (
            [...todayActivities].reverse().map((a, i) => {
              const displayLabel = a.customName ? a.customName : a.type;
              
              return (
                <div key={i} className="bg-[#13072E]/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between group shadow-sm hover:border-purple-500/40 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0B0316]/60 border border-purple-500/20 flex items-center justify-center shadow-inner">
                      {getIconForType(a.type)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold tracking-wide mb-1 text-base">{displayLabel}</h4>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-300/70">
                          <Clock size={12} className="text-indigo-400"/> {a.duration} min
                        </span>
                        {a.distance && (
                          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-300/70">
                            <MapPin size={12} className="text-sky-400"/> {a.distance} km
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-300/70">
                          <Zap size={12} className="text-yellow-400"/> {a.intensity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-purple-500/30 group-hover:text-purple-400 transition-colors" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* КОНТЕЙНЕР АНИМАЦИИ (Вынесен поверх всего приложения - fixed inset-0) */}
      {isExploding && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {/* Ударная волна */}
          <div 
            className="absolute w-24 h-24 rounded-full border border-orange-500/80 animate-lava-shockwave shadow-[0_0_20px_#f97316]"
            style={{ left: explosionOrigin.x, top: explosionOrigin.y }}
          ></div>
          
          {/* Частицы лавы */}
          {explosionParticles.map((p) => (
            <div 
              key={p.id} 
              className={`absolute flex items-center justify-center ${p.color}`}
              style={{
                left: explosionOrigin.x,
                top: explosionOrigin.y,
                width: p.type !== 'emoji' ? `${p.size}px` : 'auto',
                height: p.type !== 'emoji' ? `${p.size}px` : 'auto',
                fontSize: p.type === 'emoji' ? `${p.size * 2}px` : 'inherit',
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--rot': `${p.rot}deg`,
                '--s': p.type === 'emoji' ? 1 : 1.5,
                animation: `lava-fly ${p.duration}s cubic-bezier(0.15, 0.9, 0.3, 1) forwards`
              }}
            >
              {p.type === 'drop' && <div className="w-full h-full lava-drop bg-current"></div>}
              {p.type === 'spark' && <div className="w-full h-full lava-spark bg-current"></div>}
              {p.type === 'emoji' && <span>{p.emoji}</span>}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;