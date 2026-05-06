import React from 'react';

const GoalTracker = ({ current, goal }) => {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-900/50 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-lg font-semibold text-purple-200 tracking-wide drop-shadow-sm">Cel tygodniowy</h2>
        <p className="text-purple-300/80 font-medium text-sm">
          <span className="text-white font-bold text-lg">{current}</span> / {goal} treningów
        </p>
      </div>
      <div className="w-full bg-[#0B0316] rounded-full h-5 border border-purple-900/30 shadow-inner overflow-hidden">
        <div
          className="bg-gradient-to-r from-fuchsia-500 to-purple-500 h-full rounded-full shadow-[0_0_15px_rgba(217,70,239,0.8)] transition-all duration-1000 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full rounded-full" style={{ filter: 'blur(2px)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;