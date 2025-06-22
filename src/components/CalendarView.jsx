import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const [value, setValue] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const formatDate = (date) =>
    date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

  const isGoalMet = (activitiesForDay) => {
    const totalMinutes = activitiesForDay.reduce((sum, a) => sum + Number(a.duration), 0);
    return totalMinutes >= 30;
  };

  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      const parsed = JSON.parse(stored);
      setActivities(parsed);
      filterActivitiesByDate(value, parsed);
    }
  }, []);

  const handleDateChange = (date) => {
    setValue(date);
    filterActivitiesByDate(date, activities);
  };

  const filterActivitiesByDate = (date, allActivities) => {
    const dateStr = formatDate(date);
    const filtered = allActivities.filter((act) => act.date === dateStr);
    setSelectedActivities(filtered);
  };

  const handleDelete = (indexToDelete) => {
    const dateStr = formatDate(value);
    const updatedActivities = activities.filter((act, i) => {
      if (act.date !== dateStr) return true;
      const filteredForDate = activities.filter((a) => a.date === dateStr);
      return act !== filteredForDate[indexToDelete];
    });
    setActivities(updatedActivities);
    setSelectedActivities((prev) => prev.filter((_, i) => i !== indexToDelete));
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
  };

  const activityDates = new Set(activities.map((a) => a.date));

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = formatDate(date);
      if (activityDates.has(dateStr)) {
        return (
          <div className="flex justify-center mt-1">
            <span className="text-green-600 text-sm">●</span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="mb-6">
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
      />

      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">
          Aktywności dla: {formatDate(value)}
        </h3>

        {selectedActivities.length > 0 ? (
          <div
            className={`p-4 rounded-xl border shadow-sm mb-4 transition
              ${isGoalMet(selectedActivities) ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>

            <p className={`mb-3 font-medium ${isGoalMet(selectedActivities) ? 'text-green-600' : 'text-red-600'}`}>
              {isGoalMet(selectedActivities)
                ? '🎯 Cel na ten dzień został osiągnięty!'
                : '❌ Cel na ten dzień NIE został osiągnięty.'}
            </p>

            <ul className="space-y-2">
              {selectedActivities.map((a, i) => (
                <li key={i} className="border p-3 rounded flex justify-between items-start bg-white">
                  <div>
                    <strong>{a.type}</strong> – {a.date} <br />
                    Czas: {a.duration} min, Dystans: {a.distance} km, Intensywność: {a.intensity}
                  </div>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-600 hover:underline ml-4"
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">Brak aktywności w tym dniu.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
