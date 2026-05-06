import React, { useState } from 'react';

const BadgeSystem = ({ badges }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const allBadges = [
    {
      id: 'starter',
      title: 'Starter',
      description: 'Twoja pierwsza aktywność!',
    },
    {
      id: 'regularny',
      title: 'Regularny',
      description: '3 dni z rzędu!',
    },
  ];

  const handleBadgeClick = (badge) => {
    const achieved = badges.some((b) => b.title === badge.title);
    if (!achieved) return; 
    setSelectedBadge(badge);
  };

  const closeModal = () => {
    setSelectedBadge(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allBadges.map((badge) => {
          const achieved = badges.some((b) => b.title === badge.title);

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`border rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 backdrop-blur-xl relative overflow-hidden
                ${achieved 
                  ? 'border-green-400/30 bg-[#13072E]/60 shadow-[0_4px_20px_rgba(34,197,94,0.15)] cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(34,197,94,0.25)] hover:border-green-400/50' 
                  : 'border-purple-900/30 bg-[#0B0316]/40 opacity-60 cursor-default grayscale-[0.3]'}
              `}
            >
              {achieved && <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/20 blur-2xl rounded-full"></div>}
              <div className="text-3xl mb-3 drop-shadow-md">🏅</div>
              <div className="text-lg font-bold text-white tracking-wide mb-1">{badge.title}</div>
              <div className="mb-3 text-sm text-purple-200/80">{badge.description}</div>
              <div className={`mt-auto px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase border 
                ${achieved ? 'text-green-400 border-green-400/30 bg-green-400/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'text-slate-500 border-slate-700 bg-slate-800/50'}`}>
                {achieved ? '✅ Wykonano' : '⏳ Jeszcze nie'}
              </div>
            </div>
          );
        })}
      </div>

      {selectedBadge && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B0316]/80 backdrop-blur-md overflow-hidden">
          
          {/* Стили для неонового импульса */}
          <style>{`
            @keyframes neon-pulse-1 {
              0% { transform: scale(0.8); opacity: 1; box-shadow: 0 0 20px #d946ef, inset 0 0 20px #d946ef; }
              100% { transform: scale(2.5); opacity: 0; box-shadow: 0 0 60px #d946ef, inset 0 0 60px #d946ef; border-width: 0px; }
            }
            @keyframes neon-pulse-2 {
              0% { transform: scale(0.8); opacity: 1; box-shadow: 0 0 20px #6366f1, inset 0 0 20px #6366f1; }
              100% { transform: scale(3.5); opacity: 0; box-shadow: 0 0 80px #6366f1, inset 0 0 80px #6366f1; border-width: 0px; }
            }
            .animate-shockwave-1 {
              animation: neon-pulse-1 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
            }
            .animate-shockwave-2 {
              animation: neon-pulse-2 1.5s cubic-bezier(0.1, 0.8, 0.3, 1) 0.2s forwards;
              opacity: 0;
            }
          `}</style>

          {/* Кольца неоновой ударной волны */}
          <div className="absolute w-64 h-64 border-2 border-fuchsia-400 rounded-full animate-shockwave-1 pointer-events-none"></div>
          <div className="absolute w-64 h-64 border-2 border-indigo-400 rounded-full animate-shockwave-2 pointer-events-none"></div>
          <div className="absolute w-40 h-40 bg-fuchsia-600/30 blur-[60px] rounded-full animate-pulse pointer-events-none"></div>

          {/* Само модальное окно */}
          <div className="bg-[#13072E] border border-purple-500/30 rounded-3xl shadow-[0_0_50px_rgba(147,51,234,0.4)] p-8 w-80 text-center relative animate-in zoom-in-95 duration-300 z-10">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-fuchsia-600/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="text-6xl mb-6 animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">🏆</div>
            <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
              {selectedBadge.title}
            </h2>
            <p className="text-purple-200 text-lg mb-8 font-medium">{selectedBadge.description}</p>
            
            <button
              onClick={closeModal}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_15px_rgba(147,51,234,0.4)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.6)] transform transition-all duration-300 active:scale-95 border border-purple-400/30 tracking-widest uppercase"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BadgeSystem;