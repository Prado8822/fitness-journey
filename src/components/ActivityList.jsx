import React from 'react';

const ActivityList = ({ activities }) => {
  // Проверка: если activities нет ИЛИ он пустой
  if (!activities || activities.length === 0) {
    return;
  }

  return (
    <ul className="space-y-2">
      {activities.map((act, index) => (
        <li key={index} className="p-3 border rounded-md shadow-sm">
          <strong>{act.type}</strong> - {act.date}<br />
          Czas: {act.duration} min, Dystans: {act.distance} km, Intensywność: {act.intensity}
        </li>
      ))}
    </ul>
  );
};

export default ActivityList;
