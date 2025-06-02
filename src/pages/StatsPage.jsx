import React from 'react';
import Stats from '../components/Stats';

const mockData = [
  { date: '01.06', duration: 30 },
  { date: '02.06', duration: 45 },
  { date: '03.06', duration: 20 },
];

const StatsPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Statystyki</h1>
      <Stats data={mockData} />
    </div>
  );
};

export default StatsPage;
