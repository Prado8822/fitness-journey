import React from 'react';
import GoalTracker from '../components/GoalTracker';
import BadgeSystem from '../components/BadgeSystem';

const GoalsPage = () => {
  const current = 2; 
  const goal = 5;    
  const badges = [
    { title: 'Starter', description: 'Twoja pierwsza aktywność!' },
    { title: 'Regularny', description: '3 dni z rzędu!' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cele i motywacja</h1>
      <GoalTracker current={current} goal={goal} />
      <BadgeSystem badges={badges} />
    </div>
  );
};

export default GoalsPage;
