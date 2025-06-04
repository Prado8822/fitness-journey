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


  // Загрузка активностей из localStorage
  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      const parsed = JSON.parse(stored);
      setActivities(parsed);
      filterActivitiesByDate(value, parsed);
    }
  }, []);

  // Фильтрация при смене даты
  const handleDateChange = (date) => {
    setValue(date);
    filterActivitiesByDate(date, activities);
  };

  const filterActivitiesByDate = (date, allActivities) => {
    const dateStr = formatDate(date);
    const filtered = allActivities.filter(act => act.date === dateStr);
    setSelectedActivities(filtered);
  };

  // Удаление активности
  const handleDelete = (indexToDelete) => {
    const dateStr = formatDate(value);
    const updatedActivities = activities.filter((act, i) => {
      if (act.date !== dateStr) return true;
      const filteredForDate = activities.filter(a => a.date === dateStr);
      return act !== filteredForDate[indexToDelete];
    });
    setActivities(updatedActivities);
    setSelectedActivities(prev => prev.filter((_, i) => i !== indexToDelete));
    localStorage.setItem('activities', JSON.stringify(updatedActivities)); // сохранение!
  };

  const activityDates = new Set(activities.map(a => a.date));

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
          <ul className="space-y-2">
            {selectedActivities.map((a, i) => (
              <li key={i} className="border p-3 rounded flex justify-between items-start">
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
        ) : (
          <p className="text-gray-500">Brak aktywności w tym dniu.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
