import React from 'react';

const GoalTracker = ({ current, goal }) => {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="font-bold mb-2">Cel tygodniowy</h2>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p>{current} / {goal} treningów</p>
    </div>
  );
};

export default GoalTracker;
