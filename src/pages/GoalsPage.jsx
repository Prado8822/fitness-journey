import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Trophy, Target, Flame, Zap, Timer, Activity } from 'lucide-react';
import GoalTracker from '../components/GoalTracker';
import BadgeSystem from '../components/BadgeSystem';
import localforage from 'localforage';

// Список динамических вызовов
const CHALLENGES_LIST = [
  { 
    id: 'c1', title: 'Tygodniowy Sprint', desc: 'Pokonaj 20 km w ciągu 7 dni.', 
    target: 20, type: 'distance', days: 7, 
    icon: Zap, colorBg: 'from-blue-600/20 to-cyan-500/20', colorBorder: 'border-blue-500/30', 
    colorText: 'text-cyan-400', progressBg: 'from-blue-500 to-cyan-400' 
  },
  { 
    id: 'c2', title: 'Żelazna Dyscyplina', desc: 'Wykonaj 5 treningów w 5 dni.', 
    target: 5, type: 'workouts', days: 5, 
    icon: Flame, colorBg: 'from-orange-500/20 to-red-600/20', colorBorder: 'border-orange-500/30', 
    colorText: 'text-orange-400', progressBg: 'from-orange-500 to-red-500' 
  },
  { 
    id: 'c3', title: 'Maraton Mocy', desc: 'Pokonaj 50 km w ciągu 14 dni.', 
    target: 50, type: 'distance', days: 14, 
    icon: Target, colorBg: 'from-purple-600/20 to-fuchsia-500/20', colorBorder: 'border-purple-500/30', 
    colorText: 'text-fuchsia-400', progressBg: 'from-purple-500 to-fuchsia-400' 
  },
  { 
    id: 'c4', title: 'Aktywny Start', desc: 'Wykonaj 7 treningów w 10 dni.', 
    target: 7, type: 'workouts', days: 10, 
    icon: Activity, colorBg: 'from-emerald-500/20 to-green-600/20', colorBorder: 'border-emerald-500/30', 
    colorText: 'text-emerald-400', progressBg: 'from-emerald-500 to-green-400' 
  },
  { 
    id: 'c5', title: 'Długi Dystans', desc: 'Pokonaj 100 km w 30 dni.', 
    target: 100, type: 'distance', days: 30, 
    icon: Timer, colorBg: 'from-rose-500/20 to-pink-600/20', colorBorder: 'border-rose-500/30', 
    colorText: 'text-rose-400', progressBg: 'from-rose-500 to-pink-400' 
  }
];

// УРОВНИ
const RANKS = [
  { id: 1, name: 'Nowicjusz', lvl: '1-4', colorClass: 'text-slate-400', bgClass: 'bg-slate-900/50 border-slate-700/50' },
  { id: 2, name: 'Początkujący', lvl: '5-9', colorClass: 'text-indigo-400', bgClass: 'bg-indigo-900/20 border-indigo-500/30' },
  { id: 3, name: 'Adept Fitnessu', lvl: '10-14', colorClass: 'text-fuchsia-400', bgClass: 'bg-fuchsia-900/20 border-fuchsia-500/30' },
  { id: 4, name: 'Entuzjasta', lvl: '15-19', colorClass: 'text-blue-400', bgClass: 'bg-blue-900/20 border-blue-500/30' },
  { id: 5, name: 'Weteran', lvl: '20-29', colorClass: 'text-orange-400', bgClass: 'bg-orange-900/20 border-orange-500/30' },
  { id: 6, name: 'Mistrz', lvl: '30-39', colorClass: 'text-red-400', bgClass: 'bg-red-900/20 border-red-500/30' },
  { id: 7, name: 'Czempion', lvl: '40-49', colorClass: 'text-rose-400', bgClass: 'bg-rose-900/20 border-rose-500/30' },
  { id: 8, name: 'Legenda', lvl: '50+', colorClass: 'text-amber-400', bgClass: 'bg-amber-500/20 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
];

const GoalsPage = () => {
  const [activities, setActivities] = useState([]);
  const [current, setCurrent] = useState(0);
  const [badges, setBadges] = useState([]);
  
  const [stats, setStats] = useState({ totalWorkouts: 0, maxStreak: 0, totalDistance: 0, currentStreak: 0 });
  const [levelInfo, setLevelInfo] = useState({ level: 1, xp: 0, nextXp: 100, progress: 0 });
  
  // Состояния окна
  const [isRanksOpen, setIsRanksOpen] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  
  const [activeChallenge, setActiveChallenge] = useState(null);
  const goal = 5;

  const getRankInfo = (level) => {
    if (level < 5) return { name: 'Nowicjusz', color: 'text-slate-400' };
    if (level < 10) return { name: 'Początkujący', color: 'text-indigo-400' };
    if (level < 15) return { name: 'Adept Fitnessu', color: 'text-fuchsia-400' };
    if (level < 20) return { name: 'Entuzjasta', color: 'text-blue-400' };
    if (level < 30) return { name: 'Weteran', color: 'text-orange-400' };
    if (level < 40) return { name: 'Mistrz', color: 'text-red-400' };
    if (level < 50) return { name: 'Czempion', color: 'text-rose-400' };
    return { name: 'Legenda', color: 'text-amber-400' };
  };

  const isThisWeek = (dateStr) => {
    const now = new Date();
    const currentDate = new Date(dateStr);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return currentDate >= startOfWeek && currentDate <= endOfWeek;
  };

  useEffect(() => {
    const loadData = async () => {
      // ИСПОЛЬЗУЕМ LOCALFORAGE ДЛЯ ТРЕНИРОВОК
      const stored = (await localforage.getItem('activities')) || [];
      setActivities(stored);

      // === ИСПРАВЛЕННАЯ ЛОГИКА ДЛЯ УНИКАЛЬНЫХ ДНЕЙ НЕДЕЛИ ===
      const weekly = stored.filter((a) => isThisWeek(a.date));
      const uniqueWeeklyDates = new Set(weekly.map(a => a.date)); // Оставляем только уникальные даты
      setCurrent(uniqueWeeklyDates.size); // Передаем количество уникальных дней
      // ======================================================

      let totalDistance = 0;
      stored.forEach(a => { totalDistance += parseFloat(a.distance || 0); });

      const dates = stored.map(a => a.date).sort();
      const uniqueDates = [...new Set(dates)];
      let maxStreak = 0;
      let currentStreak = 0;
      
      if (uniqueDates.length > 0) {
        currentStreak = 1;
        maxStreak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const d1 = new Date(uniqueDates[i]);
          const d2 = new Date(uniqueDates[i + 1]);
          d1.setHours(0,0,0,0);
          d2.setHours(0,0,0,0);
          const diffDays = Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 1;
          }
        }
      }

      const totalWorkouts = stored.length;
      setStats({ totalWorkouts, maxStreak, totalDistance, currentStreak });

      const newBadges = [];
      if (totalWorkouts >= 1) newBadges.push({ id: 'starter' });
      if (totalWorkouts >= 5) newBadges.push({ id: 'poczatkujacy' });
      if (totalWorkouts >= 10) newBadges.push({ id: 'amator' });
      if (totalWorkouts >= 50) newBadges.push({ id: 'weteran' });
      if (totalWorkouts >= 100) newBadges.push({ id: 'stowka' });
      if (maxStreak >= 3) newBadges.push({ id: 'regularny' });
      if (maxStreak >= 7) newBadges.push({ id: 'maszyna' });
      if (maxStreak >= 30) newBadges.push({ id: 'tytan' });
      if (totalDistance >= 10) newBadges.push({ id: 'spacerowicz' });
      if (totalDistance >= 42) newBadges.push({ id: 'maratonczyk' });
      if (totalDistance >= 100) newBadges.push({ id: 'podroznik' });
      setBadges(newBadges);

      const earnedBadgesCount = newBadges.length;
      const currentXP = (totalWorkouts * 50) + Math.floor(totalDistance * 10) + (earnedBadgesCount * 100);
      const currentLevel = Math.floor(Math.sqrt(currentXP / 100)) + 1; 
      const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
      const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
      const levelProgress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

      setLevelInfo({ level: currentLevel, xp: currentXP, nextXp: xpForNextLevel, progress: levelProgress });

      const nowMs = new Date().getTime();
      
      // ИСПОЛЬЗУЕМ LOCALFORAGE ДЛЯ ЧЕЛЛЕНДЖЕЙ
      let savedChallenge = await localforage.getItem('dynamicChallengeState');

      if (!savedChallenge || nowMs > savedChallenge.endTime) {
        const nextIndex = savedChallenge ? (savedChallenge.index + 1) % CHALLENGES_LIST.length : 0;
        const nextDuration = CHALLENGES_LIST[nextIndex].days * 24 * 60 * 60 * 1000;
        
        savedChallenge = {
          index: nextIndex,
          startTime: nowMs,
          endTime: nowMs + nextDuration
        };
        // СОХРАНЯЕМ В LOCALFORAGE
        await localforage.setItem('dynamicChallengeState', savedChallenge);
      }

      const currentChallengeData = CHALLENGES_LIST[savedChallenge.index];
      const daysLeft = Math.max(1, Math.ceil((savedChallenge.endTime - nowMs) / (1000 * 60 * 60 * 24)));

      const validActivities = stored.filter(a => {
        const t = new Date(a.date).getTime();
        return t >= savedChallenge.startTime && t <= savedChallenge.endTime;
      });

      let challengeValue = 0;
      if (currentChallengeData.type === 'distance') {
        challengeValue = validActivities.reduce((sum, a) => sum + parseFloat(a.distance || 0), 0);
      } else if (currentChallengeData.type === 'workouts') {
        challengeValue = validActivities.length;
      }

      setActiveChallenge({
        ...currentChallengeData,
        daysLeft,
        currentValue: challengeValue,
        progressPercent: Math.min((challengeValue / currentChallengeData.target) * 100, 100)
      });
    };

    loadData();
  }, []);

  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    startYRef.current = clientY - offsetY;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const newOffset = Math.max(0, clientY - startYRef.current);
    setOffsetY(newOffset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (offsetY > 100) {
      setIsRanksOpen(false);
      setTimeout(() => setOffsetY(0), 300);
    } else {
      setOffsetY(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, offsetY]);

  useEffect(() => {
    if (isRanksOpen) {
      document.body.style.overflow = 'hidden';
      setOffsetY(0);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isRanksOpen]);

  const ranksModal = isRanksOpen && (
    <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/60 backdrop-blur-sm px-0 transition-opacity duration-300">
      <div 
        className={`w-full max-w-md bg-[#0B0416] rounded-t-[32px] border-t border-x border-[#2a1b42] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col h-[85vh]
          ${!isDragging ? 'transition-transform duration-300 ease-out' : ''} 
        `}
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        
        {/* ПОЛЗУНОК */}
        <div className="w-full flex justify-center shrink-0 pt-2 pb-1">
          <div 
            className="py-3 px-10 cursor-grab active:cursor-grabbing touch-none group"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div 
              className={`w-14 h-1.5 rounded-full pointer-events-none transition-all duration-200 
                ${isDragging ? 'bg-[#2a1b42]' : 'bg-[#4c3275] group-hover:bg-[#5a3b8a]'}
              `}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center px-6 pb-4 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Trophy className="text-fuchsia-400" size={24} />
            <h2 className="text-xl font-bold text-white tracking-wide">System Rangi</h2>
          </div>
          <button 
            onClick={() => setIsRanksOpen(false)}
            className="w-8 h-8 bg-[#1a0e30] hover:bg-[#2a1b42] rounded-full flex items-center justify-center text-[#8a72b1] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 modal-scroll">
          <style>{`
            .modal-scroll::-webkit-scrollbar { width: 4px; }
            .modal-scroll::-webkit-scrollbar-track { background: transparent; }
            .modal-scroll::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
          `}</style>

          <div className="flex flex-col gap-3 pb-6">
            {RANKS.map((rank) => {
              const minLvl = parseInt(rank.lvl.split('-')[0]);
              const maxLvl = rank.lvl.includes('+') ? 999 : parseInt(rank.lvl.split('-')[1]);
              const isActive = levelInfo.level >= minLvl && levelInfo.level <= maxLvl;

              return (
                <div 
                  key={rank.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${rank.bgClass} backdrop-blur-sm transition-all ${isActive ? 'ring-2 ring-white/20 scale-[1.02]' : 'opacity-60'}`}
                >
                  <span className={`font-black tracking-wide ${rank.colorClass}`}>
                    {rank.name}
                  </span>
                  <span className="bg-black/30 text-white/50 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg border border-white/5">
                    LVL {rank.lvl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-10 pt-2 space-y-6">
      <h1 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm mb-2">
        Cele i osiągnięcia
      </h1>

      <div 
        onClick={() => setIsRanksOpen(true)}
        className="bg-[#13072E]/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 shadow-[0_4px_20px_rgba(147,51,234,0.15)] relative overflow-hidden cursor-pointer hover:bg-[#13072E]/80 transition-colors group"
      >
        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-[shine_4s_infinite]"></div>
        <style>{`@keyframes shine { 100% { left: 200%; } }`}</style>
        
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              Twój profil <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
            </div>
            <div className="text-xl font-black text-white flex items-center gap-2">
              <span className="bg-fuchsia-500 text-white text-xs px-2 py-1 rounded-md">LVL {levelInfo.level}</span>
              <span className={getRankInfo(levelInfo.level).color}>{getRankInfo(levelInfo.level).name}</span>
            </div>
          </div>
          <div className="text-right text-xs text-purple-300/70 font-medium">
            <span className="text-white font-bold">{levelInfo.xp}</span> / {levelInfo.nextXp} XP
          </div>
        </div>
        
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mt-3 border border-purple-500/20">
          <div className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${levelInfo.progress}%` }}>
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {activeChallenge && (
        <div className={`bg-gradient-to-br ${activeChallenge.colorBg} border ${activeChallenge.colorBorder} rounded-2xl p-5 relative overflow-hidden shadow-lg`}>
          <div className={`absolute -right-4 -top-4 opacity-10 text-8xl pointer-events-none ${activeChallenge.colorText}`}>
            <activeChallenge.icon />
          </div>
          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <activeChallenge.icon className={activeChallenge.colorText} size={20} />
              <h3 className="font-black tracking-wide text-white">{activeChallenge.title}</h3>
            </div>
            <div className={`text-xs font-bold bg-black/20 ${activeChallenge.colorText} px-2 py-1 rounded-md uppercase tracking-wider`}>
              Zostało {activeChallenge.daysLeft} {activeChallenge.daysLeft === 1 ? 'dzień' : 'dni'}
            </div>
          </div>
          <p className="text-sm text-white/80 mb-4 font-medium">{activeChallenge.desc}</p>
          
          <div className={`flex justify-between text-xs ${activeChallenge.colorText} font-bold mb-1 uppercase tracking-wider`}>
            <span>Postęp</span>
            <span>
              {activeChallenge.type === 'distance' ? activeChallenge.currentValue.toFixed(1) : activeChallenge.currentValue} / {activeChallenge.target} {activeChallenge.type === 'distance' ? 'km' : 'tren.'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-black/20">
            <div className={`h-full bg-gradient-to-r ${activeChallenge.progressBg} rounded-full relative transition-all duration-1000`} style={{ width: `${activeChallenge.progressPercent}%` }}>
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 rounded-full blur-[2px]"></div>
            </div>
          </div>
        </div>
      )}

      <GoalTracker current={current} goal={goal} currentStreak={stats.currentStreak} />
      
      <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
        <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-4">Twoja ściana trofeów</h2>
        <BadgeSystem achievedBadges={badges} stats={stats} activeChallenge={activeChallenge} />
      </div>

      
      {isRanksOpen && createPortal(ranksModal, document.body)}
    </div>
  );
};

export default GoalsPage;