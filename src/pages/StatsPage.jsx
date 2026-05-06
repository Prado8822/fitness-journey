import React, { useEffect, useState } from 'react';
import Stats from '../components/Stats';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#d946ef', '#8b5cf6', '#6366f1', '#ec4899', '#a855f7'];

const StatsPage = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

  const dailyTotals = activities.reduce((acc, act) => {
    acc[act.date] = (acc[act.date] || 0) + parseInt(act.duration);
    return acc;
  }, {});

  const dataForBar = Object.entries(dailyTotals).map(([date, duration]) => ({
    date,
    duration,
  }));

  const typeTotals = activities.reduce((acc, act) => {
    acc[act.type] = (acc[act.type] || 0) + 1;
    return acc;
  }, {});

  const dataForPie = Object.entries(typeTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const averageDuration = activities.length
    ? (activities.reduce((sum, a) => sum + parseInt(a.duration), 0) / activities.length).toFixed(1)
    : 0;

  const totalDistance = activities.reduce((sum, a) => sum + parseFloat(a.distance || 0), 0).toFixed(2);

  const mostActiveDay = Object.entries(dailyTotals).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max, ['', 0])[0];

  return (
    <div className="pb-10 pt-2 space-y-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
        Statystyki
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-900/50 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
          <h2 className="text-lg font-semibold mb-6 text-purple-200 tracking-wide drop-shadow-sm text-center">Czas trwania (min)</h2>
          <Stats data={dataForBar} />
        </div>

        <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-900/50 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.1)]">
          <h2 className="text-lg font-semibold mb-2 text-purple-200 tracking-wide drop-shadow-sm text-center">Typy aktywności</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataForPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={60}
                  stroke="rgba(19,7,46,0.5)"
                  strokeWidth={3}
                  label={{ fill: '#e2e8f0', fontSize: 12 }}
                  labelLine={{ stroke: '#a855f7', strokeWidth: 1 }}
                >
                  {dataForPie.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0px 0px 6px rgba(217,70,239,0.5))' }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(19, 7, 46, 0.85)', 
                    borderColor: 'rgba(147, 51, 234, 0.3)', 
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#d8b4fe' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#13072E]/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.15)]">
        <h2 className="text-xl font-bold mb-6 text-fuchsia-300 tracking-wide drop-shadow-sm">Podsumowanie</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
            <span className="text-purple-200 font-medium">Średni czas</span>
            <span className="text-white font-bold text-lg">{averageDuration} <span className="text-purple-400/60 text-sm font-normal">min</span></span>
          </div>
          
          <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
            <span className="text-purple-200 font-medium">Łączny dystans</span>
            <span className="text-white font-bold text-lg">{totalDistance} <span className="text-purple-400/60 text-sm font-normal">km</span></span>
          </div>
          
          <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
            <span className="text-purple-200 font-medium">Liczba aktywności</span>
            <span className="text-white font-bold text-lg">{activities.length}</span>
          </div>
          
          <div className="flex justify-between items-center pt-1">
            <span className="text-purple-200 font-medium">Najbardziej aktywny dzień</span>
            <span className="text-fuchsia-400 font-bold drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]">{mostActiveDay || 'Brak danych'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;