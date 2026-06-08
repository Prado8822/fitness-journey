import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, Share2, ArrowRight } from 'lucide-react';
import { toBlob } from 'html-to-image';
import localforage from 'localforage';

const BadgeSystem = ({ achievedBadges, stats, activeChallenge }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState('all'); 
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Сохраняем разблокированные ивентовые ачивки локально, чтобы они оставались навсегда
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
    // Оригинальные
    { id: 'starter', title: 'Starter', description: 'Ukończ swoją pierwszą aktywność!', icon: '🌟', target: 1, type: 'workouts' },
    { id: 'poczatkujacy', title: 'Początkujący', description: 'Zrób 5 treningów łącznie!', icon: '🥉', target: 5, type: 'workouts' },
    { id: 'amator', title: 'Amator', description: 'Zrób 10 treningów łącznie!', icon: '🥈', target: 10, type: 'workouts' },
    { id: 'weteran', title: 'Weteran', description: 'Zrób 50 treningów! Niesamowite!', icon: '🥇', target: 50, type: 'workouts' },
    { id: 'stowka', title: 'Setka!', description: '100 treningów. Jesteś legendą!', icon: '💯', target: 100, type: 'workouts' },
    { id: 'regularny', title: 'Regularny', description: 'Trenuj 3 dni z rzędu!', icon: '🔥', target: 3, type: 'streak' },
    { id: 'maszyna', title: 'Maszyna', description: 'Trenuj 7 dni z rzędu bez przerwy!', icon: '🤖', target: 7, type: 'streak' },
    { id: 'tytan', title: 'Tytan', description: 'Miesiąc (30 dni) treningów z rzędu!', icon: '👑', target: 30, type: 'streak' },
    { id: 'spacerowicz', title: 'Spacerowicz', description: 'Pokonaj łącznie 10 km dystansu!', icon: '🚶', target: 10, type: 'distance' },
    { id: 'maratonczyk', title: 'Maratończyk', description: 'Pokonaj łącznie 42 km dystansu!', icon: '🏃', target: 42, type: 'distance' },
    { id: 'podroznik', title: 'Podróżnik', description: 'Pokonaj łącznie 100 km dystansu!', icon: '🌍', target: 100, type: 'distance' },
    { id: 'aktywista', title: 'Aktywista', description: 'Ukończ 25 treningów!', icon: '👟', target: 25, type: 'workouts' },
    { id: 'elita', title: 'Elita', description: 'Ukończ 200 treningów!', icon: '💎', target: 200, type: 'workouts' },
    { id: 'cyborg', title: 'Cyborg', description: 'Pół tysiąca (500) treningów!', icon: '🦾', target: 500, type: 'workouts' },
    { id: 'zdeterminowany', title: 'Zdeterminowany', description: 'Dwa tygodnie (14 dni) z rzędu!', icon: '📅', target: 14, type: 'streak' },
    { id: 'fanatyk', title: 'Fanatyk', description: '60 dni treningów bez przerwy!', icon: '🤯', target: 60, type: 'streak' },
    { id: 'niepowstrzymany', title: 'Niepowstrzymany', description: '100 dni z rzędu! Maszyna!', icon: '🚀', target: 100, type: 'streak' },
    { id: 'weteran_roku', title: 'Rok w Biegu', description: '365 dni z rzędu! Absolutny rekord!', icon: '🏆', target: 365, type: 'streak' },
    { id: 'biegacz', title: 'Biegacz', description: 'Pokonaj łącznie 25 km!', icon: '⚡', target: 25, type: 'distance' },
    { id: 'ultramaratonczyk', title: 'Ultra', description: 'Pokonaj łącznie 200 km!', icon: '🏔️', target: 200, type: 'distance' },
    { id: 'wedrowiec', title: 'Wędrowiec', description: 'Pokonaj łącznie 500 km!', icon: '🗺️', target: 500, type: 'distance' },
    { id: 'zdobywca', title: 'Zdobywca', description: 'Pokonaj łącznie 1000 km!', icon: '🦅', target: 1000, type: 'distance' },
    { id: 'kosmonauta', title: 'Kosmonauta', description: '2000 km! Jesteś w kosmosie!', icon: '🌌', target: 2000, type: 'distance' },

    // НОВЫЕ 5 ЗОЛОТЫХ (ИВЕНТОВЫЕ - привязаны к твоим 5 временным целям)
    { id: 'event_sprint', challengeId: 'c1', title: 'Błyskawica', description: 'Ukończono Tygodniowy Sprint!', icon: '🌩️', target: 20, type: 'distance', isEvent: true },
    { id: 'event_zelazna', challengeId: 'c2', title: 'Żelazny Hart', description: 'Ukończono Żelazną Dyscyplinę!', icon: '🛡️', target: 5, type: 'workouts', isEvent: true },
    { id: 'event_maraton', challengeId: 'c3', title: 'Tytan Mocy', description: 'Ukończono Maraton Mocy!', icon: '🔱', target: 50, type: 'distance', isEvent: true },
    { id: 'event_start', challengeId: 'c4', title: 'Iskra', description: 'Ukończono Aktywny Start!', icon: '🌠', target: 7, type: 'workouts', isEvent: true },
    { id: 'event_dystans', challengeId: 'c5', title: 'Kosmiczny Pył', description: 'Ukończono Długi Dystans!', icon: '🪐', target: 100, type: 'distance', isEvent: true },
  ];

  const handleBadgeClick = (badge) => setSelectedBadge(badge);
  const closeModal = () => setSelectedBadge(null);
  const closeGallery = () => setIsGalleryOpen(false);

  useEffect(() => {
    if (selectedBadge || isGalleryOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedBadge, isGalleryOpen]);

  // Проверяем, выполнил ли пользователь активный ивент
  // СТАЛО:
useEffect(() => {
  const updateEvents = async () => {
    if (activeChallenge && activeChallenge.currentValue >= activeChallenge.target) {
      const evBadge = allBadges.find(b => b.challengeId === activeChallenge.id);
      if (evBadge && !unlockedEvents.includes(evBadge.id)) {
        const newUnlocked = [...unlockedEvents, evBadge.id];
        setUnlockedEvents(newUnlocked);
        await localforage.setItem('unlockedEventBadges', newUnlocked); // Асинхронное сохранение
      }
    }
  };
  updateEvents();
}, [activeChallenge, unlockedEvents]);

  // ШЕРИНГ
  const handleShare = async () => {
    if (!shareCardRef.current || !selectedBadge) return;
    setIsSharing(true);
    try {
      const blob = await toBlob(shareCardRef.current, { quality: 0.95, backgroundColor: '#0B0416' });
      if (!blob) throw new Error('Nie udało się wygenerować obrazka');
      const file = new File([blob], `${selectedBadge.id}-achievement.png`, { type: 'image/png' });
      
      // ССЫЛКА НА ПРИЛОЖЕНИЕ (замените на вашу реальную, когда опубликуете)
      const appUrl = 'https://twoja-aplikacja-fitness.pl'; 
      
      let shareTitle = 'Moje osiągnięcie!';
      let shareText = '';

      if (selectedBadge.isEvent) {
        // Текст для Золотых Трофеев (ивентовых)
        shareTitle = 'Złote Trofeum!';
        shareText = `Zdobyłem specjalne Złote Trofeum: ${selectedBadge.title}! 🏆\n\nSpróbuj mnie przebić! Dołącz do wyzwania w naszej aplikacji:\n👉 ${appUrl}`;
      } else {
        // Универсальный текст для ВСЕХ базовых ачивок
        shareText = `Kolejny cel osiągnięty: ${selectedBadge.title}! 🔥\n\nZbuduj formę razem ze mną. Pobierz aplikację i zacznij swój trening:\n👉 ${appUrl}`;
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
      alert('Nie udało się wygenerować obrazka 😔');
    } finally {
      setIsSharing(false);
    }
  };

  // МАТЕМАТИКА, ФИЛЬТРЫ И ИВЕНТЫ
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
        
        isAchieved = achievedBadges.some((b) => b.id === badge.id) || currentValue >= badge.target;
      }

      const rawProgress = (currentValue / badge.target) * 100;
      const displayProgress = Math.min(Math.max(rawProgress, 0), 100);
      const isAlmostDone = !isAchieved && displayProgress >= 80;

      return { ...badge, isAchieved, currentValue, displayProgress, isAlmostDone };
    }).filter(badge => {
      // ЛОГИКА СКРЫТИЯ ИВЕНТОВ
      if (badge.isEvent) {
         const isActiveEvent = activeChallenge && activeChallenge.id === badge.challengeId;
         // Если ивент не активен сейчас и не разблокирован навсегда — скрываем его
         if (!badge.isAchieved && !isActiveEvent) return false;
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
    
    // Динамические стили рамок
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
            {isGold ? 'Złote Trofeum' : 'Wydarzenie Aktywne'}
          </div>
        )}
        
        {badge.isAchieved && !isGold && <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent rounded-2xl pointer-events-none"></div>}
        {isGold && <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 to-transparent rounded-2xl pointer-events-none"></div>}
        {badge.isAlmostDone && !isActiveEvent && <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent rounded-2xl pointer-events-none"></div>}
        
        <div className={`text-3xl sm:text-4xl mb-2 relative ${badge.isAchieved ? (isGold ? 'animate-float drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'animate-float drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]') : (isActiveEvent ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'opacity-40')}`}>
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
              Odblokowano
            </div>
          ) : (
            <div className="w-full relative z-10">
              <div className="flex justify-between items-center mb-1">
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${isActiveEvent ? 'text-blue-300/70' : 'text-slate-500'}`}>
                    {badge.type === 'distance' ? `${badge.currentValue.toFixed(0)} / ${badge.target} km` : `${badge.currentValue} / ${badge.target}`}
                  </span>
                  {badge.isAlmostDone && <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider animate-pulse">Prawie!</span>}
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
            {selectedBadge.isEvent ? 'Złote Trofeum' : 'Nowe Osiągnięcie'}
          </div>

          <div className="text-8xl mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]">
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
            <span>Fitness App</span>
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

        <div className={`text-7xl mb-4 ${selectedBadge.isAchieved ? `icon-epic-tada ${selectedBadge.isEvent ? 'drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]' : 'drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]'}` : 'opacity-40 grayscale'}`}>
          {selectedBadge.isAchieved ? selectedBadge.icon : '🔒'}
        </div>
        
        <div className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm border
          ${selectedBadge.isAchieved ? (selectedBadge.isEvent ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-fuchsia-500/10 border-fuchsia-500/50 text-fuchsia-300') : selectedBadge.isEvent ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-800/50 border-slate-600/50 text-slate-400'}`}>
          {selectedBadge.isAchieved ? (selectedBadge.isEvent ? 'Złote Trofeum' : 'Legendarne Trofeum') : selectedBadge.isEvent ? 'Wydarzenie Aktywne' : 'Zablokowane'}
        </div>
        
        <h2 className={`text-3xl font-black mb-3 drop-shadow-md ${selectedBadge.isAchieved ? (selectedBadge.isEvent ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent' : 'bg-gradient-to-r from-fuchsia-400 via-white to-indigo-400 bg-clip-text text-transparent') : 'text-white'}`}>
          {selectedBadge.title}
        </h2>
        
        <p className="text-purple-200/80 text-sm mb-6 font-medium px-2">
          {selectedBadge.isAchieved ? selectedBadge.description : `Cel: ${selectedBadge.description}`}
        </p>

        {!selectedBadge.isAchieved && (
          <div className="w-full mb-6 px-4">
            <div className={`flex justify-between text-xs mb-2 font-bold uppercase tracking-wider ${selectedBadge.isEvent ? 'text-blue-300' : 'text-purple-300/70'}`}>
              <span>Postęp</span>
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
              <Share2 size={18} /> {isSharing ? 'Ładowanie...' : 'Udostępnij'}
            </button>
          )}
          <button
            onClick={closeModal}
            className={`font-bold py-3 px-4 rounded-xl transform transition-all duration-300 active:scale-95 tracking-wider uppercase text-sm border
              ${selectedBadge.isAchieved 
                ? (selectedBadge.isEvent ? 'flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-950 border-amber-400/40' : 'flex-1 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white border-fuchsia-400/40') 
                : 'w-full bg-slate-800/80 text-slate-300 border-slate-600/50 hover:bg-slate-700'}`}
          >
            {selectedBadge.isAchieved ? 'Zamknij' : 'Rozumiem'}
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
              Wszystkie Trofea
            </h2>
            <div className="text-[#8a72b1] text-xs sm:text-sm font-medium tracking-wider mt-1.5">
              Twoja kolekcja osiągnięć
            </div>
          </div>
          
          <div className="overflow-y-auto modal-scroll px-1 sm:px-2 flex-1 relative z-10">
            <div className="flex bg-[#110726] p-1.5 rounded-[16px] mb-6 border border-[#2a1b42] shadow-inner max-w-sm mx-auto">
              <button onClick={() => setFilter('all')} className={`flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all duration-300 ${filter === 'all' ? 'bg-[#2a1b42] text-white shadow-md' : 'text-[#8a72b1] hover:text-white'}`}>Wszystkie</button>
              <button onClick={() => setFilter('achieved')} className={`flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all duration-300 ${filter === 'achieved' ? 'bg-[#2a1b42] text-white shadow-md' : 'text-[#8a72b1] hover:text-white'}`}>Odblokowane</button>
              <button onClick={() => setFilter('locked')} className={`flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all duration-300 ${filter === 'locked' ? 'bg-[#2a1b42] text-white shadow-md' : 'text-[#8a72b1] hover:text-white'}`}>W toku</button>
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
              Zamknij
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
        <button onClick={() => setFilter('all')} className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-purple-600/50 text-white shadow-sm' : 'text-purple-300/50 hover:text-white'}`}>Wszystkie</button>
        <button onClick={() => setFilter('achieved')} className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-colors ${filter === 'achieved' ? 'bg-purple-600/50 text-white shadow-sm' : 'text-purple-300/50 hover:text-white'}`}>Odblokowane</button>
        <button onClick={() => setFilter('locked')} className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-colors ${filter === 'locked' ? 'bg-purple-600/50 text-white shadow-sm' : 'text-purple-300/50 hover:text-white'}`}>W toku</button>
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
              Odkryj Więcej
            </div>
            <div className="text-[10px] text-fuchsia-300/80 font-bold mt-1 uppercase tracking-widest">
              +{processedBadges.length - DISPLAY_LIMIT} Trofeów
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