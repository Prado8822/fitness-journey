import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, Share2, ArrowRight } from 'lucide-react';
import { toBlob } from 'html-to-image';
import localforage from 'localforage';
import { useTranslation } from 'react-i18next'; // <-- ИМПОРТ

const BadgeSystem = ({ achievedBadges, stats, activeChallenge }) => {
  const { t } = useTranslation(); // <-- ХУК
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState('all'); 
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const [unlockedEvents, setUnlockedEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      const stored = await localforage.getItem('unlockedEventBadges') || [];
      setUnlockedEvents(stored);
    };
    loadEvents();
  }, []);

  const shareCardRef = useRef(null);

  const allBadges = [
    { id: 'starter', title: t('badge_system.badges.starter_title'), description: t('badge_system.badges.starter_desc'), icon: '🌟', target: 1, type: 'workouts' },
    { id: 'poczatkujacy', title: t('badge_system.badges.poczatkujacy_title'), description: t('badge_system.badges.poczatkujacy_desc'), icon: '🥉', target: 5, type: 'workouts' },
    { id: 'amator', title: t('badge_system.badges.amator_title'), description: t('badge_system.badges.amator_desc'), icon: '🥈', target: 10, type: 'workouts' },
    { id: 'weteran', title: t('badge_system.badges.weteran_title'), description: t('badge_system.badges.weteran_desc'), icon: '🥇', target: 50, type: 'workouts' },
    { id: 'stowka', title: t('badge_system.badges.stowka_title'), description: t('badge_system.badges.stowka_desc'), icon: '💯', target: 100, type: 'workouts' },
    { id: 'regularny', title: t('badge_system.badges.regularny_title'), description: t('badge_system.badges.regularny_desc'), icon: '🔥', target: 3, type: 'streak' },
    { id: 'maszyna', title: t('badge_system.badges.maszyna_title'), description: t('badge_system.badges.maszyna_desc'), icon: '🤖', target: 7, type: 'streak' },
    { id: 'tytan', title: t('badge_system.badges.tytan_title'), description: t('badge_system.badges.tytan_desc'), icon: '👑', target: 30, type: 'streak' },
    { id: 'spacerowicz', title: t('badge_system.badges.spacerowicz_title'), description: t('badge_system.badges.spacerowicz_desc'), icon: '🚶', target: 10, type: 'distance' },
    { id: 'maratonczyk', title: t('badge_system.badges.maratonczyk_title'), description: t('badge_system.badges.maratonczyk_desc'), icon: '🏃', target: 42, type: 'distance' },
    { id: 'podroznik', title: t('badge_system.badges.podroznik_title'), description: t('badge_system.badges.podroznik_desc'), icon: '🌍', target: 100, type: 'distance' },
    { id: 'aktywista', title: t('badge_system.badges.aktywista_title'), description: t('badge_system.badges.aktywista_desc'), icon: '👟', target: 25, type: 'workouts' },
    { id: 'elita', title: t('badge_system.badges.elita_title'), description: t('badge_system.badges.elita_desc'), icon: '💎', target: 200, type: 'workouts' },
    { id: 'cyborg', title: t('badge_system.badges.cyborg_title'), description: t('badge_system.badges.cyborg_desc'), icon: '🦾', target: 500, type: 'workouts' },
    { id: 'zdeterminowany', title: t('badge_system.badges.zdeterminowany_title'), description: t('badge_system.badges.zdeterminowany_desc'), icon: '📅', target: 14, type: 'streak' },
    { id: 'fanatyk', title: t('badge_system.badges.fanatyk_title'), description: t('badge_system.badges.fanatyk_desc'), icon: '🤯', target: 60, type: 'streak' },
    { id: 'niepowstrzymany', title: t('badge_system.badges.niepowstrzymany_title'), description: t('badge_system.badges.niepowstrzymany_desc'), icon: '🚀', target: 100, type: 'streak' },
    { id: 'weteran_roku', title: t('badge_system.badges.weteran_roku_title'), description: t('badge_system.badges.weteran_roku_desc'), icon: '🏆', target: 365, type: 'streak' },
    { id: 'biegacz', title: t('badge_system.badges.biegacz_title'), description: t('badge_system.badges.biegacz_desc'), icon: '⚡', target: 25, type: 'distance' },
    { id: 'ultramaratonczyk', title: t('badge_system.badges.ultramaratonczyk_title'), description: t('badge_system.badges.ultramaratonczyk_desc'), icon: '🏔️', target: 200, type: 'distance' },
    { id: 'wedrowiec', title: t('badge_system.badges.wedrowiec_title'), description: t('badge_system.badges.wedrowiec_desc'), icon: '🗺️', target: 500, type: 'distance' },
    { id: 'zdobywca', title: t('badge_system.badges.zdobywca_title'), description: t('badge_system.badges.zdobywca_desc'), icon: '🦅', target: 1000, type: 'distance' },
    { id: 'kosmonauta', title: t('badge_system.badges.kosmonauta_title'), description: t('badge_system.badges.kosmonauta_desc'), icon: '🌌', target: 2000, type: 'distance' },
    { id: 'plomyk', title: t('badge_system.badges.plomyk_title', {defaultValue: 'Płomyk'}), description: t('badge_system.badges.plomyk_desc', {defaultValue: 'Spal pierwsze 1,000 kcal.'}), icon: '🕯️', target: 1000, type: 'calories_total' },
    { id: 'ognisko', title: t('badge_system.badges.ognisko_title', {defaultValue: 'Ognisko'}), description: t('badge_system.badges.ognisko_desc', {defaultValue: 'Spal łącznie 2,500 kcal.'}), icon: '🏕️', target: 2500, type: 'calories_total' },
    { id: 'pochodnia', title: t('badge_system.badges.pochodnia_title', {defaultValue: 'Pochodnia'}), description: t('badge_system.badges.pochodnia_desc', {defaultValue: 'Spal łącznie 5,000 kcal.'}), icon: '🧨', target: 5000, type: 'calories_total' },

    { id: 'event_sprint', challengeId: 'c1', title: t('badge_system.badges.event_sprint_title'), description: t('badge_system.badges.event_sprint_desc'), icon: '🌩️', target: 20, type: 'distance', isEvent: true },
    { id: 'event_zelazna', challengeId: 'c2', title: t('badge_system.badges.event_zelazna_title'), description: t('badge_system.badges.event_zelazna_desc'), icon: '🛡️', target: 5, type: 'workouts', isEvent: true },
    { id: 'event_maraton', challengeId: 'c3', title: t('badge_system.badges.event_maraton_title'), description: t('badge_system.badges.event_maraton_desc'), icon: '🔱', target: 50, type: 'distance', isEvent: true },
    { id: 'event_start', challengeId: 'c4', title: t('badge_system.badges.event_start_title'), description: t('badge_system.badges.event_start_desc'), icon: '🌠', target: 7, type: 'workouts', isEvent: true },
    { id: 'event_dystans', challengeId: 'c5', title: t('badge_system.badges.event_dystans_title'), description: t('badge_system.badges.event_dystans_desc'), icon: '🪐', target: 100, type: 'distance', isEvent: true },
    { id: 'spalacz', title: t('badge_system.badges.spalacz_title', {defaultValue: 'Spalacz'}), description: t('badge_system.badges.spalacz_desc', {defaultValue: 'Spal łącznie 20,000 kcal. Ale gorąco!'}), icon: '☄️', target: 20000, type: 'calories_total', isLegendary: true },
    { id: 'wulkan', title: t('badge_system.badges.wulkan_title', {defaultValue: 'Wulkan'}), description: t('badge_system.badges.wulkan_desc', {defaultValue: 'Spal 100,000 kcal! Prawdziwy żywioł!'}), icon: '🌋', target: 100000, type: 'calories_total', isLegendary: true },
    { id: 'supernowa', title: t('badge_system.badges.supernowa_title', {defaultValue: 'Supernowa'}), description: t('badge_system.badges.supernowa_desc', {defaultValue: 'Spal 1,000 kcal podczas jednego treningu!'}), icon: '💥', target: 1000, type: 'calories_one', isLegendary: true },
  ];

  const handleBadgeClick = (badge) => setSelectedBadge(badge);
  const closeModal = () => setSelectedBadge(null);
  const closeGallery = () => setIsGalleryOpen(false);

  useEffect(() => {
    if (selectedBadge || isGalleryOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedBadge, isGalleryOpen]);

  useEffect(() => {
    const updateEvents = async () => {
      if (activeChallenge && activeChallenge.currentValue >= activeChallenge.target) {
        const evBadge = allBadges.find(b => b.challengeId === activeChallenge.id);
        if (evBadge && !unlockedEvents.includes(evBadge.id)) {
          const newUnlocked = [...unlockedEvents, evBadge.id];
          setUnlockedEvents(newUnlocked);
          await localforage.setItem('unlockedEventBadges', newUnlocked); 
        }
      }
    };
    updateEvents();
  }, [activeChallenge, unlockedEvents]);


  const handleShare = async () => {
    if (!shareCardRef.current || !selectedBadge) return;
    setIsSharing(true);
    try {
      const blob = await toBlob(shareCardRef.current, { quality: 0.95, backgroundColor: '#0B0416' });
      if (!blob) throw new Error(t('badge_system.ui.share_error'));
      const file = new File([blob], `${selectedBadge.id}-achievement.png`, { type: 'image/png' });
      
      const appUrl = 'https://prado8822.github.io/fitness-journey/'; 
      
      let shareTitle = t('badge_system.ui.share_default_title');
      let shareText = '';

      if (selectedBadge.isEvent) {
        shareTitle = t('badge_system.ui.share_gold_title');
        shareText = t('badge_system.ui.share_gold_text', { title: selectedBadge.title, url: appUrl });
      } else {
        shareText = t('badge_system.ui.share_default_text', { title: selectedBadge.title, url: appUrl });
      }

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: shareText,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `trofeum-${selectedBadge.title}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Błąd podczas udostępniania:', error);
      alert(t('badge_system.ui.share_error'));
    } finally {
      setIsSharing(false);
    }
  };

  const processedBadges = useMemo(() => {
    return allBadges.map(badge => {
      let isAchieved = false;
      let currentValue = 0;
      
      if (badge.isEvent) {
        isAchieved = unlockedEvents.includes(badge.id);
        if (activeChallenge && activeChallenge.id === badge.challengeId) {
           currentValue = activeChallenge.currentValue;
        }
        if (currentValue >= badge.target) isAchieved = true;
      } else {
        if (badge.type === 'workouts') currentValue = stats?.totalWorkouts || 0;
        if (badge.type === 'streak') currentValue = stats?.maxStreak || 0;
        if (badge.type === 'distance') currentValue = stats?.totalDistance || 0;
        if (badge.type === 'calories_total') currentValue = stats?.totalCalories || 0;
        if (badge.type === 'calories_one') currentValue = stats?.maxCaloriesInOne || 0;
        
        isAchieved = achievedBadges.some((b) => b.id === badge.id) || currentValue >= badge.target;
      }

      const rawProgress = (currentValue / badge.target) * 100;
      const displayProgress = Math.min(Math.max(rawProgress, 0), 100);
      const isAlmostDone = !isAchieved && displayProgress >= 80;

      return { ...badge, isAchieved, currentValue, displayProgress, isAlmostDone };
    }).filter(badge => {
      if (badge.isEvent) {
         const isActiveEvent = activeChallenge && activeChallenge.id === badge.challengeId;
         if (!badge.isAchieved && !isActiveEvent) return false;
      }
      if (badge.isLegendary && !badge.isAchieved && badge.displayProgress < 10) {
        return false; 
      }
      
      if (filter === 'achieved') return badge.isAchieved;
      if (filter === 'locked') return !badge.isAchieved;
      return true;
    }).sort((a, b) => {
      if (a.isEvent !== b.isEvent) return a.isEvent ? -1 : 1; // Ивенты первее
      if (b.displayProgress !== a.displayProgress) return b.displayProgress - a.displayProgress;
      return a.target - b.target;
    });
  }, [allBadges, achievedBadges, stats, filter, activeChallenge, unlockedEvents]);

  const DISPLAY_LIMIT = 5; 
  const badgesToShow = !isGalleryOpen ? processedBadges.slice(0, DISPLAY_LIMIT) : processedBadges;

  const renderBadgeCard = (badge) => {
    const isGold = badge.isEvent && badge.isAchieved;
    const isActiveEvent = badge.isEvent && !badge.isAchieved;

    let cardClasses = 'border-purple-900/30 bg-[#0B0316]/40 hover:bg-[#13072E]/60';
    
    if (isGold) {
        cardClasses = 'border-amber-400 bg-amber-950/20 shadow-[0_4px_15px_rgba(251,191,36,0.15)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.3)] hover:-translate-y-1';
    } else if (badge.isAchieved) {
        cardClasses = 'border-fuchsia-500/40 bg-[#13072E]/80 shadow-[0_4px_15px_rgba(217,70,239,0.1)] hover:shadow-[0_6px_20px_rgba(217,70,239,0.3)] hover:border-fuchsia-400 hover:-translate-y-1';
    } else if (isActiveEvent) {
        cardClasses = 'border-blue-500/40 bg-blue-900/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:-translate-y-1';
    } else if (badge.isAlmostDone) {
        cardClasses = 'border-amber-500/50 bg-[#13072E]/60 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:-translate-y-1';
    }

    return (
      <div key={badge.id} onClick={() => handleBadgeClick(badge)} className={`border rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 relative cursor-pointer ${cardClasses}`}>
        {badge.isEvent && (
          <div className={`absolute -top-2 px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-widest z-20 ${isGold ? 'bg-amber-400 text-amber-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse'}`}>
            {isGold ? t('badge_system.ui.gold_trophy') : t('badge_system.ui.active_event')}
          </div>
        )}
        
        {badge.isAchieved && !isGold && <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent rounded-2xl pointer-events-none"></div>}
        {isGold && <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 to-transparent rounded-2xl pointer-events-none"></div>}
        {badge.isAlmostDone && !isActiveEvent && <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent rounded-2xl pointer-events-none"></div>}
        
        <div className={`text-3xl sm:text-4xl mb-2 relative ${badge.isAchieved ? (isGold ? 'animate-float [text-shadow:0_0_15px_rgba(251,191,36,0.5)]' : 'animate-float [text-shadow:0_0_10px_rgba(255,255,255,0.2)]') : (isActiveEvent ? '[text-shadow:0_0_10px_rgba(59,130,246,0.4)]' : 'opacity-40')}`}>
          {badge.icon}
          {!badge.isAchieved && (
            <div className={`absolute inset-0 flex items-center justify-center rounded-full backdrop-blur-[1px] ${isActiveEvent ? 'bg-black/20' : 'bg-black/40'}`}>
              <Lock size={16} className={isActiveEvent ? "text-blue-400 opacity-90" : badge.isAlmostDone ? "text-amber-400 opacity-90" : "text-white opacity-80"} />
            </div>
          )}
        </div>
        
        <div className={`text-[11px] sm:text-xs font-black tracking-wide mb-1 leading-tight relative z-10 ${badge.isAchieved ? (isGold ? 'text-amber-300' : 'text-white') : (isActiveEvent ? 'text-blue-200' : badge.isAlmostDone ? 'text-amber-100' : 'text-slate-400')}`}>
          {badge.title}
        </div>
        
        <div className="mt-auto pt-2 w-full">
          {badge.isAchieved ? (
            <div className={`text-[9px] font-bold tracking-wider uppercase relative z-10 ${isGold ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]'}`}>
              {t('badge_system.ui.unlocked')}
            </div>
          ) : (
            <div className="w-full relative z-10">
              <div className="flex justify-between items-center mb-1">
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${isActiveEvent ? 'text-blue-300/70' : 'text-slate-500'}`}>
                    {badge.type === 'distance' ? `${badge.currentValue.toFixed(0)} / ${badge.target} km` : `${badge.currentValue} / ${badge.target}`}
                  </span>
                  {badge.isAlmostDone && <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider animate-pulse">{t('badge_system.ui.almost')}</span>}
              </div>
              <div className="h-1.5 w-full bg-gray-800/80 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${isActiveEvent ? 'bg-blue-500/80 shadow-[0_0_5px_rgba(59,130,246,0.8)]' : badge.isAlmostDone ? 'bg-amber-500/80 shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'bg-purple-600/50'}`} style={{ width: `${badge.displayProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const shareExportCard = selectedBadge && selectedBadge.isAchieved && (
    <div className="fixed top-[-9999px] left-[-9999px] z-[-1] pointer-events-none">
      <div 
        ref={shareCardRef}
        className="w-[400px] h-[500px] bg-[#0B0416] flex flex-col items-center justify-center relative overflow-hidden"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0B0416] to-indigo-900/40 z-0"></div>
        <div className="absolute top-10 left-10 text-5xl opacity-20 transform -rotate-45 blur-[1px]">🚀</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 transform rotate-12">🌌</div>
        <div className="absolute top-32 right-12 text-3xl opacity-20">✨</div>
        <div className="absolute bottom-32 left-16 text-4xl opacity-15">🔥</div>
        
        <div className={`absolute w-[300px] h-[300px] blur-[80px] rounded-full z-0 ${selectedBadge.isEvent ? 'bg-amber-600/30' : 'bg-fuchsia-600/30'}`}></div>

        <div className={`relative z-10 flex flex-col items-center text-center p-8 border rounded-[32px] backdrop-blur-md w-[340px] ${selectedBadge.isEvent ? 'border-amber-500/40 bg-amber-950/40 shadow-[0_0_50px_rgba(251,191,36,0.3)]' : 'border-purple-500/30 bg-[#13072E]/80 shadow-[0_0_50px_rgba(147,51,234,0.4)]'}`}>
          <div className={`text-[10px] font-black tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full border ${selectedBadge.isEvent ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30'}`}>
            {selectedBadge.isEvent ? t('badge_system.ui.gold_trophy') : t('badge_system.ui.new_achievement')}
          </div>

          <div className="text-8xl mb-6 [text-shadow:0_0_30px_rgba(255,255,255,0.6)]">
            {selectedBadge.icon}
          </div>
          
          <h2 className="text-4xl font-black mb-3 text-white drop-shadow-lg">
            {selectedBadge.title}
          </h2>
          
          <p className="text-purple-200/90 text-sm font-medium mb-8 px-4">
            {selectedBadge.description}
          </p>

          <div className={`w-full h-[1px] bg-gradient-to-r from-transparent via-${selectedBadge.isEvent ? 'amber' : 'purple'}-500/50 to-transparent mb-6`}></div>

          <div className="text-xs text-purple-300 font-bold tracking-widest uppercase flex items-center gap-2">
            <span>Ember</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </div>
  );

  const modalContent = selectedBadge && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0B0316]/90 backdrop-blur-md px-4 overflow-hidden">
      <style>{`
        @keyframes epicModalScale { from { transform: scale(0.7) translateY(30px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .modal-epic-appear { animation: epicModalScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes epicTada { 0% { transform: scale(0) rotate(-15deg); opacity: 0; } 40% { transform: scale(1.2) rotate(10deg); opacity: 1; } 70% { transform: scale(0.9) rotate(-5deg); } 100% { transform: scale(1) rotate(0deg); } }
        .icon-epic-tada { animation: epicTada 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        @keyframes epicScreenWave { 0% { transform: scale(0); opacity: 0.8; border-width: 25px; } 100% { transform: scale(4); opacity: 0; border-width: 0px; } }
        .screen-wave-1 { animation: epicScreenWave 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; box-shadow: 0 0 30px currentColor, inset 0 0 30px currentColor; border-color: currentColor; }
        .screen-wave-2 { animation: epicScreenWave 2s cubic-bezier(0.1, 0.8, 0.3, 1) 0.4s infinite; box-shadow: 0 0 40px currentColor, inset 0 0 40px currentColor; border-color: currentColor; }
        @keyframes epicBurst { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
        .burst-core { animation: epicBurst 0.7s ease-out forwards; }
      `}</style>

      {selectedBadge.isAchieved && (
        <>
          <div className={`absolute w-[400px] h-[400px] burst-core pointer-events-none z-0 ${selectedBadge.isEvent ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(251,191,36,0)_70%)]' : 'bg-[radial-gradient(circle,rgba(255,255,255,0.7)_0%,rgba(217,70,239,0)_70%)]'}`}></div>
          <div className={`absolute w-48 h-48 border-solid rounded-full screen-wave-1 pointer-events-none z-0 ${selectedBadge.isEvent ? 'text-amber-500' : 'text-fuchsia-500'}`}></div>
          <div className={`absolute w-48 h-48 border-solid rounded-full screen-wave-2 pointer-events-none z-0 ${selectedBadge.isEvent ? 'text-yellow-400' : 'text-indigo-500'}`}></div>
          <div className={`absolute w-[300px] h-[300px] blur-[80px] rounded-full animate-pulse pointer-events-none z-0 ${selectedBadge.isEvent ? 'bg-amber-600/30' : 'bg-fuchsia-600/20'}`}></div>
        </>
      )}

      <div className={`bg-[#13072E]/95 border rounded-[32px] p-6 w-full max-w-sm flex flex-col items-center text-center relative z-10 modal-epic-appear backdrop-blur-xl ${selectedBadge.isEvent && selectedBadge.isAchieved ? 'border-amber-500/50 shadow-[0_0_60px_rgba(251,191,36,0.3)]' : 'border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.3)]'}`}>
        <button onClick={closeModal} className="absolute top-4 right-4 text-purple-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-20">
          <X size={20} />
        </button>

        <div className={`text-7xl mb-4 ${selectedBadge.isAchieved ? `icon-epic-tada ${selectedBadge.isEvent ? '[text-shadow:0_0_30px_rgba(251,191,36,0.6)]' : '[text-shadow:0_0_30px_rgba(255,255,255,0.5)]'}` : 'opacity-40 grayscale'}`}>
          {selectedBadge.isAchieved ? selectedBadge.icon : '🔒'}
        </div>
        
        <div className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm border
          ${selectedBadge.isAchieved ? (selectedBadge.isEvent ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-fuchsia-500/10 border-fuchsia-500/50 text-fuchsia-300') : selectedBadge.isEvent ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-800/50 border-slate-600/50 text-slate-400'}`}>
          {selectedBadge.isAchieved ? (selectedBadge.isEvent ? t('badge_system.ui.gold_trophy') : t('badge_system.ui.legendary_trophy')) : selectedBadge.isEvent ? t('badge_system.ui.active_event') : t('badge_system.ui.locked')}
        </div>
        
        <h2 className={`text-3xl font-black mb-3 drop-shadow-md ${selectedBadge.isAchieved ? (selectedBadge.isEvent ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent' : 'bg-gradient-to-r from-fuchsia-400 via-white to-indigo-400 bg-clip-text text-transparent') : 'text-white'}`}>
          {selectedBadge.title}
        </h2>
        
        <p className="text-purple-200/80 text-sm mb-6 font-medium px-2">
          {selectedBadge.isAchieved ? selectedBadge.description : t('badge_system.ui.goal', { desc: selectedBadge.description })}
        </p>

        {!selectedBadge.isAchieved && (
          <div className="w-full mb-6 px-4">
            <div className={`flex justify-between text-xs mb-2 font-bold uppercase tracking-wider ${selectedBadge.isEvent ? 'text-blue-300' : 'text-purple-300/70'}`}>
              <span>{t('badge_system.ui.progress')}</span>
              <span>{Math.floor(selectedBadge.displayProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-purple-900/50">
               <div className={`h-full rounded-full ${selectedBadge.isEvent ? 'bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-purple-500/60'}`} style={{ width: `${selectedBadge.displayProgress}%` }}></div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3 w-full">
          {selectedBadge.isAchieved && (
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 active:scale-95 border border-white/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Share2 size={18} /> {isSharing ? t('badge_system.ui.loading') : t('badge_system.ui.share')}
            </button>
          )}
          <button
            onClick={closeModal}
            className={`font-bold py-3 px-4 rounded-xl transform transition-all duration-300 active:scale-95 tracking-wider uppercase text-sm border
              ${selectedBadge.isAchieved 
                ? (selectedBadge.isEvent ? 'flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-950 border-amber-400/40' : 'flex-1 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white border-fuchsia-400/40') 
                : 'w-full bg-slate-800/80 text-slate-300 border-slate-600/50 hover:bg-slate-700'}`}
          >
            {selectedBadge.isAchieved ? t('badge_system.ui.close') : t('badge_system.ui.understand')}
          </button>
        </div>
      </div>
    </div>
  );

  const galleryModal = isGalleryOpen && (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScale { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.4); border-radius: 10px; }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.8); }
      `}</style>
      
      <div className="bg-[#0B0416] border border-[#2a1b42] rounded-[32px] shadow-[0_0_80px_rgba(76,29,149,0.3)] w-full max-w-3xl h-[85vh] sm:h-[90vh] flex flex-col relative animate-[modalScale_0.3s_ease-out] overflow-hidden">
        
        <button 
          onClick={closeGallery} 
          className="absolute top-5 right-5 w-9 h-9 bg-[#1a0e30] hover:bg-[#2a1b42] rounded-full flex items-center justify-center text-[#8a72b1] hover:text-white transition-colors z-20"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col h-full p-5 sm:p-6 pb-4">
          <div className="flex flex-col items-center mt-2 mb-6 shrink-0 relative z-10">
            <div className="w-16 h-16 bg-[#110726] border border-[#2a1b42] rounded-[20px] flex items-center justify-center mb-4 shadow-inner">
              <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">🏆</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {t('badge_system.ui.all_trophies')}
            </h2>
            <div className="text-[#8a72b1] text-xs sm:text-sm font-medium tracking-wider mt-1.5">
              {t('badge_system.ui.collection')}
            </div>
          </div>
          
          <div className="overflow-y-auto modal-scroll px-1 sm:px-2 flex-1 relative z-10">
            <div className="flex bg-[#110726] p-1.5 rounded-[16px] mb-6 border border-[#2a1b42] shadow-inner max-w-sm mx-auto">
              <button onClick={() => setFilter('all')} className={`flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all duration-300 ${filter === 'all' ? 'bg-[#2a1b42] text-white shadow-md' : 'text-[#8a72b1] hover:text-white'}`}>{t('badge_system.ui.filter_all')}</button>
              <button onClick={() => setFilter('achieved')} className={`flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all duration-300 ${filter === 'achieved' ? 'bg-[#2a1b42] text-white shadow-md' : 'text-[#8a72b1] hover:text-white'}`}>{t('badge_system.ui.filter_achieved')}</button>
              <button onClick={() => setFilter('locked')} className={`flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all duration-300 ${filter === 'locked' ? 'bg-[#2a1b42] text-white shadow-md' : 'text-[#8a72b1] hover:text-white'}`}>{t('badge_system.ui.filter_locked')}</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-2">
               {processedBadges.map(renderBadgeCard)}
            </div>
          </div>

          <div className="pt-5 shrink-0 relative z-10 mt-2">
            <button 
              onClick={closeGallery} 
              className="w-full bg-[#1e103c] hover:bg-[#2a1b42] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 active:scale-[0.98] border border-[#2a1b42]"
            >
              {t('badge_system.ui.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 10px rgba(147, 51, 234, 0.2); border-color: rgba(168, 85, 247, 0.4); } 50% { box-shadow: 0 0 25px rgba(147, 51, 234, 0.6); border-color: rgba(217, 70, 239, 0.8); } }
      `}</style>

      {shareExportCard}

      <div className="flex bg-black/20 p-1 rounded-xl mb-6 border border-purple-500/20">
        <button onClick={() => setFilter('all')} className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-purple-600/50 text-white shadow-sm' : 'text-purple-300/50 hover:text-white'}`}>{t('badge_system.ui.filter_all')}</button>
        <button onClick={() => setFilter('achieved')} className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-colors ${filter === 'achieved' ? 'bg-purple-600/50 text-white shadow-sm' : 'text-purple-300/50 hover:text-white'}`}>{t('badge_system.ui.filter_achieved')}</button>
        <button onClick={() => setFilter('locked')} className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-colors ${filter === 'locked' ? 'bg-purple-600/50 text-white shadow-sm' : 'text-purple-300/50 hover:text-white'}`}>{t('badge_system.ui.filter_locked')}</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {badgesToShow.map(renderBadgeCard)}
        
        {!isGalleryOpen && processedBadges.length > DISPLAY_LIMIT && (
           <div
            onClick={() => setIsGalleryOpen(true)}
            className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer bg-gradient-to-b from-purple-900/10 to-[#13072E] hover:from-purple-800/30 group animate-[pulse-glow_3s_infinite]"
          >
            <div className="w-14 h-14 rounded-full bg-fuchsia-600/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-fuchsia-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
               <ArrowRight className="text-fuchsia-300 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]" size={28} />
            </div>
            <div className="text-xs font-black tracking-wide text-white uppercase drop-shadow-md">
              {t('badge_system.ui.discover_more')}
            </div>
            <div className="text-[10px] text-fuchsia-300/80 font-bold mt-1 uppercase tracking-widest">
              {t('badge_system.ui.more_trophies', { count: processedBadges.length - DISPLAY_LIMIT })}
            </div>
          </div>
        )}
      </div>

      {selectedBadge && createPortal(modalContent, document.body)}
      {isGalleryOpen && createPortal(galleryModal, document.body)}
    </>
  );
};

export default BadgeSystem;