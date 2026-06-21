import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Trophy, Target, Flame, Zap, Timer, Activity } from 'lucide-react';
import GoalTracker from '../components/GoalTracker';
import BadgeSystem from '../components/BadgeSystem';
import localforage from 'localforage';
import { useTranslation } from 'react-i18next';

const GoalsPage = () => {
  const { t } = useTranslation();

  const getChallengesList = () => [
    { 
      id: 'c1', title: t('goals_page.challenges.c1.title'), desc: t('goals_page.challenges.c1.desc'), 
      target: 20, type: 'distance', days: 7, 
      icon: Zap, colorBg: 'from-blue-600/20 to-cyan-500/20', colorBorder: 'border-blue-500/30', 
      colorText: 'text-cyan-400', progressBg: 'from-blue-500 to-cyan-400' 
    },
    { 
      id: 'c2', title: t('goals_page.challenges.c2.title'), desc: t('goals_page.challenges.c2.desc'), 
      target: 5, type: 'workouts', days: 5, 
      icon: Flame, colorBg: 'from-orange-500/20 to-red-600/20', colorBorder: 'border-orange-500/30', 
      colorText: 'text-orange-400', progressBg: 'from-orange-500 to-red-500' 
    },
    { 
      id: 'c3', title: t('goals_page.challenges.c3.title'), desc: t('goals_page.challenges.c3.desc'), 
      target: 50, type: 'distance', days: 14, 
      icon: Target, colorBg: 'from-purple-600/20 to-fuchsia-500/20', colorBorder: 'border-purple-500/30', 
      colorText: 'text-fuchsia-400', progressBg: 'from-purple-500 to-fuchsia-400' 
    },
    { 
      id: 'c4', title: t('goals_page.challenges.c4.title'), desc: t('goals_page.challenges.c4.desc'), 
      target: 7, type: 'workouts', days: 10, 
      icon: Activity, colorBg: 'from-emerald-500/20 to-green-600/20', colorBorder: 'border-emerald-500/30', 
      colorText: 'text-emerald-400', progressBg: 'from-emerald-500 to-green-400' 
    },
    { 
      id: 'c5', title: t('goals_page.challenges.c5.title'), desc: t('goals_page.challenges.c5.desc'), 
      target: 100, type: 'distance', days: 30, 
      icon: Timer, colorBg: 'from-rose-500/20 to-pink-600/20', colorBorder: 'border-rose-500/30', 
      colorText: 'text-rose-400', progressBg: 'from-rose-500 to-pink-400' 
    },
    { 
      id: 'c6', title: t('goals_page.challenges.c6.title', {defaultValue: 'Potwór Kalorii'}), desc: t('goals_page.challenges.c6.desc', {defaultValue: 'Spal 3000 kcal w 7 dni.'}), 
      target: 3000, type: 'calories', days: 7, 
      icon: Flame, colorBg: 'from-amber-500/20 to-orange-600/20', colorBorder: 'border-amber-500/30', 
      colorText: 'text-amber-400', progressBg: 'from-amber-400 to-orange-500' 
    },
    { 
      id: 'c7', title: t('goals_page.challenges.c7.title', {defaultValue: 'Ognisty Tydzień'}), desc: t('goals_page.challenges.c7.desc', {defaultValue: 'Spal 5000 kcal w 10 dni.'}), 
      target: 5000, type: 'calories', days: 10, 
      icon: Zap, colorBg: 'from-red-600/20 to-rose-600/20', colorBorder: 'border-red-500/30', 
      colorText: 'text-red-400', progressBg: 'from-red-500 to-rose-500' 
    }
  ];

  const getRanks = () => [
    { id: 1, name: t('goals_page.ranks.novice'), lvl: '1-4', colorClass: 'text-slate-400', bgClass: 'bg-slate-900/50 border-slate-700/50' },
    { id: 2, name: t('goals_page.ranks.beginner'), lvl: '5-9', colorClass: 'text-indigo-400', bgClass: 'bg-indigo-900/20 border-indigo-500/30' },
    { id: 3, name: t('goals_page.ranks.adept'), lvl: '10-14', colorClass: 'text-fuchsia-400', bgClass: 'bg-fuchsia-900/20 border-fuchsia-500/30' },
    { id: 4, name: t('goals_page.ranks.enthusiast'), lvl: '15-19', colorClass: 'text-blue-400', bgClass: 'bg-blue-900/20 border-blue-500/30' },
    { id: 5, name: t('goals_page.ranks.veteran'), lvl: '20-29', colorClass: 'text-orange-400', bgClass: 'bg-orange-900/20 border-orange-500/30' },
    { id: 6, name: t('goals_page.ranks.master'), lvl: '30-39', colorClass: 'text-red-400', bgClass: 'bg-red-900/20 border-red-500/30' },
    { id: 7, name: t('goals_page.ranks.champion'), lvl: '40-49', colorClass: 'text-rose-400', bgClass: 'bg-rose-900/20 border-rose-500/30' },
    { id: 8, name: t('goals_page.ranks.legend'), lvl: '50+', colorClass: 'text-amber-400', bgClass: 'bg-amber-500/20 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
  ];

  const [activities, setActivities] = useState([]);
  const [current, setCurrent] = useState(0);
  const [badges, setBadges] = useState([]);
  
  const [stats, setStats] = useState({ totalWorkouts: 0, maxStreak: 0, totalDistance: 0, currentStreak: 0, totalCalories: 0, maxCaloriesInOne: 0 });
  const [levelInfo, setLevelInfo] = useState({ level: 1, xp: 0, nextXp: 100, progress: 0 });
  
  const [isRanksOpen, setIsRanksOpen] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  
  const [clickedRankId, setClickedRankId] = useState(null);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const goal = 5;

  const getRankInfo = (level) => {
    if (level < 5) return { name: t('goals_page.ranks.novice'), color: 'text-slate-400' };
    if (level < 10) return { name: t('goals_page.ranks.beginner'), color: 'text-indigo-400' };
    if (level < 15) return { name: t('goals_page.ranks.adept'), color: 'text-fuchsia-400' };
    if (level < 20) return { name: t('goals_page.ranks.enthusiast'), color: 'text-blue-400' };
    if (level < 30) return { name: t('goals_page.ranks.veteran'), color: 'text-orange-400' };
    if (level < 40) return { name: t('goals_page.ranks.master'), color: 'text-red-400' };
    if (level < 50) return { name: t('goals_page.ranks.champion'), color: 'text-rose-400' };
    return { name: t('goals_page.ranks.legend'), color: 'text-amber-400' };
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
      const stored = (await localforage.getItem('activities')) || [];
      setActivities(stored);

      const weekly = stored.filter((a) => isThisWeek(a.date));
      const uniqueWeeklyDates = new Set(weekly.map(a => a.date)); 
      setCurrent(uniqueWeeklyDates.size);

      let totalDistance = 0;
      let totalCalories = 0;
      let maxCaloriesInOne = 0;

      stored.forEach(a => { 
        totalDistance += parseFloat(a.distance || 0); 
        const cal = parseInt(a.calories || 0);
        totalCalories += cal;
        if (cal > maxCaloriesInOne) maxCaloriesInOne = cal;
      });

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
      setStats({ totalWorkouts, maxStreak, totalDistance, currentStreak, totalCalories, maxCaloriesInOne });

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
      const currentXP = (totalWorkouts * 50) + Math.floor(totalDistance * 10) + Math.floor(totalCalories / 100) + (earnedBadgesCount * 100);
      const currentLevel = Math.floor(Math.sqrt(currentXP / 100)) + 1; 
      const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
      const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
      const levelProgress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

      setLevelInfo({ level: currentLevel, xp: currentXP, nextXp: xpForNextLevel, progress: levelProgress });

      const nowMs = new Date().getTime();
      const challengesList = getChallengesList(); 

      let savedChallenge = await localforage.getItem('dynamicChallengeState');

      if (!savedChallenge || nowMs > savedChallenge.endTime) {
        const nextIndex = savedChallenge ? (savedChallenge.index + 1) % challengesList.length : 0;
        const nextDuration = challengesList[nextIndex].days * 24 * 60 * 60 * 1000;
        
        savedChallenge = {
          index: nextIndex,
          startTime: nowMs,
          endTime: nowMs + nextDuration
        };
        await localforage.setItem('dynamicChallengeState', savedChallenge);
      }

      const currentChallengeData = challengesList[savedChallenge.index];
      const timeDiff = savedChallenge.endTime - nowMs;
      const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      const validActivities = stored.filter(a => {
      const [y, m, d] = a.date.split('-');
      const activityTime = new Date(y, m - 1, d).getTime();

      const startDate = new Date(savedChallenge.startTime);
      startDate.setHours(0, 0, 0, 0);
      const challengeStartTime = startDate.getTime();

      return activityTime >= challengeStartTime && activityTime <= savedChallenge.endTime;
    });

      let challengeValue = 0;
      if (currentChallengeData.type === 'distance') {
        challengeValue = validActivities.reduce((sum, a) => sum + parseFloat(a.distance || 0), 0);
      } else if (currentChallengeData.type === 'workouts') {
        challengeValue = validActivities.length;
      } else if (currentChallengeData.type === 'calories') {
        challengeValue = validActivities.reduce((sum, a) => sum + parseInt(a.calories || 0), 0);
      }

      setActiveChallenge({
        ...currentChallengeData,
        daysLeft,
        hoursLeft,
        currentValue: challengeValue,
        progressPercent: Math.min((challengeValue / currentChallengeData.target) * 100, 100)
      });
    };

    loadData();
  }, [t]);

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

  const handleRankClick = (id) => {
    setClickedRankId(id);
    setTimeout(() => {
      setClickedRankId(null);
    }, 400);
  };

  const RANKS = getRanks();

  const ranksModal = isRanksOpen && (
    <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/60 backdrop-blur-sm px-0 transition-opacity duration-300">
      <div 
        className={`w-full max-w-md bg-[#0B0416] rounded-t-[32px] border-t border-x border-[#2a1b42] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col h-[85vh]
          ${!isDragging ? 'transition-transform duration-300 ease-out' : ''} 
        `}
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        
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
            <h2 className="text-xl font-bold text-white tracking-wide">{t('goals_page.ranks_system_title')}</h2>
          </div>
          <button 
            onClick={() => setIsRanksOpen(false)}
            className="w-8 h-8 bg-[#1a0e30] hover:bg-[#2a1b42] rounded-full flex items-center justify-center text-[#8a72b1] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 modal-scroll overflow-x-hidden">
          <style>{`
            .modal-scroll::-webkit-scrollbar { width: 4px; }
            .modal-scroll::-webkit-scrollbar-track { background: transparent; }
            .modal-scroll::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
            
            /* АНИМАЦИИ ВЫЕЗДА И КЛИКА ДЛЯ РАНГОВ */
            @keyframes slideInRightRank {
              from { opacity: 0; transform: translateX(30px); }
              to { opacity: 1; transform: translateX(0); }
            }
            .animate-rank-item {
              animation: slideInRightRank 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              opacity: 0; 
            }
            @keyframes rank-click-wave {
              0% { transform: scale(0.95); opacity: 0.5; }
              100% { transform: scale(1.05); opacity: 0; }
            }
            .animate-rank-wave {
              animation: rank-click-wave 0.4s ease-out forwards;
            }
          `}</style>

          <div className="flex flex-col gap-3 pb-6">
            {RANKS.map((rank, i) => {
              const minLvl = parseInt(rank.lvl.split('-')[0]);
              const maxLvl = rank.lvl.includes('+') ? 999 : parseInt(rank.lvl.split('-')[1]);
              const isActive = levelInfo.level >= minLvl && levelInfo.level <= maxLvl;
              const isClicked = clickedRankId === rank.id;

              return (
                <button 
                  key={rank.id}
                  onClick={() => handleRankClick(rank.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border ${rank.bgClass} backdrop-blur-sm transition-all duration-300 relative animate-rank-item focus:outline-none select-none
                    ${isActive ? 'ring-2 ring-white/20 scale-[1.02] shadow-lg' : 'opacity-60 hover:opacity-100'}
                    ${isClicked ? 'scale-95 brightness-150' : 'hover:scale-[1.03]'}
                  `}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {isClicked && (
                    <span className="absolute inset-0 bg-white/20 animate-rank-wave rounded-2xl pointer-events-none"></span>
                  )}

                  <span className={`font-black tracking-wide flex items-center gap-2 relative z-10 ${rank.colorClass}`}>
                    {isActive && <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>}
                    {rank.name}
                  </span>
                  
                  <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg border relative z-10 transition-colors duration-300
                    ${isActive ? 'bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'bg-black/30 text-white/50 border-white/5'}
                  `}>
                    LVL {rank.lvl}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const caloriesToday = activities
    .filter(a => a.date === todayStr)
    .reduce((sum, a) => sum + parseInt(a.calories || 0), 0);

  return (
    <div className="pb-10 pt-0 space-y-6">

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
      <h1 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm mb-2">
        {t('goals_page.main_title')}
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
              {t('goals_page.your_profile')} <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
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
            <div className={`text-xs font-bold bg-black/20 ${activeChallenge.colorText} px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5`}>
              <Timer size={14} className="opacity-70" />
              {activeChallenge.daysLeft > 0 
                ? `${activeChallenge.daysLeft} d. ${activeChallenge.hoursLeft} h.` 
                : `${Math.max(0, activeChallenge.hoursLeft)} h.`}
          </div>
          </div>
          <p className="text-sm text-white/80 mb-4 font-medium">{activeChallenge.desc}</p>
          
          <div className={`flex justify-between text-xs ${activeChallenge.colorText} font-bold mb-1 uppercase tracking-wider`}>
            <span>{t('goals_page.challenge.progress')}</span>
            <span>
              {activeChallenge.type === 'distance' ? activeChallenge.currentValue.toFixed(1) : activeChallenge.currentValue} / {activeChallenge.target} 
              {activeChallenge.type === 'distance' ? ` ${t('goals_page.challenge.unit_km')}` : activeChallenge.type === 'calories' ? ' kcal' : ` ${t('goals_page.challenge.unit_workouts')}`}
            </span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-black/20">
            <div className={`h-full bg-gradient-to-r ${activeChallenge.progressBg} rounded-full relative transition-all duration-1000`} style={{ width: `${activeChallenge.progressPercent}%` }}>
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 rounded-full blur-[2px]"></div>
            </div>
          </div>
        </div>
      )}

      <GoalTracker 
        current={current} 
        goal={goal} 
        currentStreak={stats.currentStreak} 
        currentCalories={caloriesToday} 
        dailyCalorieGoal={400} 
      />
      
      <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
        <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-4">{t('goals_page.trophy_wall')}</h2>
        <BadgeSystem achievedBadges={badges} stats={stats} activeChallenge={activeChallenge} />
      </div>

      {isRanksOpen && createPortal(ranksModal, document.body)}
    </div>
  );
};

export default GoalsPage;