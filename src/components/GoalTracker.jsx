import React from 'react';

const GoalTracker = ({ current, goal, currentStreak }) => {
  // Ограничиваем прогресс для кольца максимум на 100%, чтобы SVG не ломался
  const progress = Math.min((current / goal) * 100, 100);
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Проверки состояний
  const isEmpty = current === 0;
  const isCompleted = current >= goal;
  const isExceeded = current > goal;

  // Определяем какой бейджик показывать
  let statusBadge;
  if (isExceeded) {
    statusBadge = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
        🌟 Cel Przekroczony!
      </div>
    );
  } else if (isCompleted) {
    statusBadge = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
        🎯 Cel Osiągnięty!
      </div>
    );
  } else {
    statusBadge = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
        💪 Trzymaj tak dalej!
      </div>
    );
  }

  return (
    <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)] flex items-center justify-between">
      <div className="flex-1 pr-4">
        <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-2">Cel tygodniowy</h2>
        <p className="text-purple-300/80 font-medium text-sm mt-2">
          Ukończ <span className="text-white font-bold">{goal}</span> treningów w tym tygodniu.
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {statusBadge}
          
          {/* БЛОК: Серия активности (Streak) */}
          {currentStreak > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase animate-pulse">
              🔥 {currentStreak} dni z rzędu
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
        <svg 
          className={`w-full h-full transform -rotate-90 transition-all duration-500 ${
            isExceeded ? 'drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]'
          }`} 
          viewBox="0 0 100 100"
        >
          {/* Фоновое кольцо или пунктир для пустого состояния */}
          {isEmpty ? (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="rgba(147, 51, 234, 0.2)"
              strokeWidth="3"
              strokeDasharray="6 4" // Пунктирная линия для пустого состояния
            />
          ) : (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              // Меняем цвет фонового кольца если цель перевыполнена
              stroke={isExceeded ? "rgba(251, 191, 36, 0.1)" : "rgba(147, 51, 234, 0.1)"}
              strokeWidth="8"
            />
          )}

          {/* Кольцо прогресса */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            // Меняем градиент при перевыполнении
            stroke={isExceeded ? "url(#goldGradient)" : "url(#neonGradient)"}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            {/* Стандартный фиолетовый градиент */}
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            {/* Золотой градиент для перевыполнения */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Текст внутри кольца */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-black text-white leading-none">{current}</span>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-1">z {goal}</span>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;