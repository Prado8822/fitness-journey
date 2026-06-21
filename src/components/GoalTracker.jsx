import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; 

const GoalTracker = ({ current, goal, currentStreak, currentCalories = 0, dailyCalorieGoal = 400 }) => {
  const { t } = useTranslation(); 
  const [isFlipped, setIsFlipped] = useState(false);

  const progress = Math.min((current / goal) * 100, 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const isEmpty = current === 0;
  const isCompleted = current >= goal;
  const isExceeded = current > goal;

  let statusBadge;
  if (isExceeded) {
    statusBadge = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
        {t('goal_tracker.status_exceeded')}
      </div>
    );
  } else if (isCompleted) {
    statusBadge = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
        {t('goal_tracker.status_completed')}
      </div>
    );
  } else {
    statusBadge = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
        {t('goal_tracker.status_keep_going')}
      </div>
    );
  }

  const progressCal = Math.min((currentCalories / dailyCalorieGoal) * 100, 100);
  const strokeDashoffsetCal = circumference - (progressCal / 100) * circumference;
  
  const isEmptyCal = currentCalories === 0;
  const isCompletedCal = currentCalories >= dailyCalorieGoal;
  const isExceededCal = currentCalories > dailyCalorieGoal;

  let statusBadgeCal;
  if (isExceededCal) {
    statusBadgeCal = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] sm:text-xs font-black tracking-widest uppercase animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]">
        {t('goal_tracker.status_cal_exceeded', {defaultValue: '🔥 Prawdziwy Ogień!'})}
      </div>
    );
  } else if (isCompletedCal) {
    statusBadgeCal = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.3)]">
        {t('goal_tracker.status_cal_completed', {defaultValue: '🎯 Cel dnia zdobyty!'})}
      </div>
    );
  } else {
    statusBadgeCal = (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase animate-pulse">
        {t('goal_tracker.status_cal_keep_going', {defaultValue: '⚡ Spalaj dalej!'})}
      </div>
    );
  }

  return (
    <div 
      className="relative w-full cursor-pointer group perspective-1000" 
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }} 
    >
      <style>{`
        .flip-inner {
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-front, .flip-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flip-back {
          transform: rotateY(180deg);
        }
      `}</style>


      <div className={`relative w-full flip-inner ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* ================= ЛИЦЕВАЯ СТОРОНА (ТРЕНИРОВКИ) ================= */}
        <div className="flip-front w-full bg-[#13072E]/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)] flex items-center justify-between hover:bg-[#13072E]/60 transition-colors">
          <div className="flex-1 pr-4">
            <h2 className="text-sm font-bold text-purple-300/70 uppercase tracking-widest mb-2">{t('goal_tracker.weekly_goal_title')}</h2>
            <p className="text-purple-300/80 font-medium text-sm mt-2">
              {t('goal_tracker.complete_prefix')} <span className="text-white font-bold">{goal}</span> {t('goal_tracker.complete_suffix')}
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {statusBadge}
              
              {currentStreak > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase animate-pulse">
                  {t('goal_tracker.streak_days', { count: currentStreak })}
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
              {isEmpty ? (
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(147, 51, 234, 0.2)" strokeWidth="3" strokeDasharray="6 4" />
              ) : (
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke={isExceeded ? "rgba(251, 191, 36, 0.1)" : "rgba(147, 51, 234, 0.1)"} strokeWidth="8" />
              )}
              <circle
                cx="50" cy="50" r={radius} fill="transparent"
                stroke={isExceeded ? "url(#goldGradient)" : "url(#neonGradient)"}
                strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">{current}</span>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-1">{t('goal_tracker.of_goal', { goal })}</span>
            </div>
          </div>
        </div>

        <div className="flip-back absolute inset-0 w-full h-full bg-[#13072E]/40 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(249,115,22,0.1)] flex items-center justify-between hover:bg-[#13072E]/60 transition-colors">
          <div className="flex-1 pr-4">
            <h2 className="text-sm font-bold text-orange-300/70 uppercase tracking-widest mb-2 flex items-center gap-2">
              {t('goal_tracker.daily_calories_title', {defaultValue: 'Dzienny Cel Kalorii'})}
            </h2>
            <p className="text-orange-200/80 font-medium text-sm mt-2 leading-snug">
              {t('goal_tracker.burned_today', {defaultValue: 'Spalono dzisiaj'})} <span className="text-white font-black">{currentCalories}</span> kcal.
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {statusBadgeCal}
            </div>
          </div>

          <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
            <svg 
              className={`w-full h-full transform -rotate-90 transition-all duration-500 ${
                isExceededCal ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]'
              }`} 
              viewBox="0 0 100 100"
            >
              {isEmptyCal ? (
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="3" strokeDasharray="6 4" />
              ) : (
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke={isExceededCal ? "rgba(239, 68, 68, 0.1)" : "rgba(249, 115, 22, 0.1)"} strokeWidth="8" />
              )}
              <circle
                cx="50" cy="50" r={radius} fill="transparent"
                stroke={isExceededCal ? "url(#fireGradient)" : "url(#orangeGradient)"}
                strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffsetCal} strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#facc15" />
                </linearGradient>
                <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white leading-none">{currentCalories}</span>
              <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mt-1">/ {dailyCalorieGoal}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GoalTracker;