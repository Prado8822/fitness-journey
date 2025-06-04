import React, { useEffect, useState } from 'react';
import Stats from '../components/Stats';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

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
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Statystyki</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Czas trwania (Bar Chart)</h2>
          <Stats data={dataForBar} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Typy aktywności (Pie Chart)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataForPie}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {dataForPie.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Podsumowanie</h2>
        <p>Średni czas: {averageDuration} minut</p>
        <p>Łączny dystans: {totalDistance} km</p>
        <p>Liczba aktywności: {activities.length}</p>
        <p>Najbardziej aktywny dzień: {mostActiveDay || 'Brak danych'}</p>
      </div>
    </div>
  );
};

export default StatsPage;
