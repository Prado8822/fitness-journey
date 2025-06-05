import React, { useEffect, useState } from 'react';
import GoalTracker from '../components/GoalTracker';
import BadgeSystem from '../components/BadgeSystem';

const GoalsPage = () => {
  const [activities, setActivities] = useState([]);
  const [current, setCurrent] = useState(0);
  const [badges, setBadges] = useState([]);
  const goal = 5;

  const isThisWeek = (dateStr) => {
    const now = new Date();
    const currentDate = new Date(dateStr);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return currentDate >= startOfWeek && currentDate <= endOfWeek;
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('activities')) || [];
    setActivities(stored);

    const weekly = stored.filter((a) => isThisWeek(a.date));
    setCurrent(weekly.length);

    const newBadges = [];
    if (stored.length >= 1) {
      newBadges.push({ title: 'Starter', description: 'Twoja pierwsza aktywność!' });
    }

    const dates = stored.map(a => a.date).sort();
    const uniqueDates = [...new Set(dates)];
    for (let i = 0; i < uniqueDates.length - 2; i++) {
      const d1 = new Date(uniqueDates[i]);
      const d2 = new Date(uniqueDates[i + 1]);
      const d3 = new Date(uniqueDates[i + 2]);
      if (
        d2 - d1 === 86400000 &&
        d3 - d2 === 86400000
      ) {
        newBadges.push({ title: 'Regularny', description: '3 dni z rzędu!' });
        break;
      }
    }

    if (stored.length >= 10) {
      newBadges.push({ title: 'Maratończyk', description: '10 aktywności!' });
    }

    setBadges(newBadges);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cele i motywacja</h1>
      <GoalTracker current={current} goal={goal} />
      <BadgeSystem badges={badges} />
    </div>
  );
};

export default GoalsPage;
