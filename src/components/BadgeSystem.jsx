import React from 'react';

const BadgeSystem = ({ badges }) => {
  if (!badges.length) return <p>Brak odznak</p>;

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {badges.map((badge, index) => (
        <div key={index} className="border p-3 rounded-lg text-center shadow-md">
          🏅 <strong>{badge.title}</strong>
          <p className="text-sm">{badge.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BadgeSystem;
