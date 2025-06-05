import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

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
    setSelectedBadge(badge);
  };

  const closeModal = () => {
    setSelectedBadge(null);
  };

  // Конфетти при открытии модалки
  useEffect(() => {
    if (selectedBadge) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [selectedBadge]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

        {allBadges.map((badge) => {
          const achieved = badges.some((b) => b.title === badge.title);

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className="border rounded-xl p-4 shadow bg-white flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
            >
              <div className="text-2xl mb-2">🏅 <strong>{badge.title}</strong></div>
              <div className="mb-2 text-sm text-gray-700">{badge.description}</div>
              <div className={`mt-2 text-sm font-medium ${achieved ? 'text-green-600' : 'text-gray-400'}`}>
                {achieved ? '✅ Wykonano' : '⏳ Jeszcze nie'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center relative">
            <h2 className="text-xl font-semibold mb-2">🎉 {selectedBadge.title}</h2>
            <p className="text-gray-700 mb-4">{selectedBadge.description}</p>
            <button
              onClick={closeModal}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BadgeSystem;
