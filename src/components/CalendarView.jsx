import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const [value, setValue] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Загрузка активностей из localStorage при первом рендере
  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      const parsed = JSON.parse(stored);
      setActivities(parsed);
      filterActivitiesByDate(value, parsed); // сразу фильтруем по текущей дате
    }
  }, []);

  // При выборе даты — фильтруем активности
  const handleDateChange = (date) => {
    setValue(date);
    filterActivitiesByDate(date, activities);
  };

  const filterActivitiesByDate = (date, allActivities) => {
    const dateStr = date.toISOString().split('T')[0];
    const filtered = allActivities.filter(act => act.date === dateStr);
    setSelectedActivities(filtered);
  };

  // Определение дат, на которые есть активности
  const activityDates = new Set(activities.map(a => a.date));

  // Добавляем точку к датам с активностями
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
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
          Aktywności dla: {value.toISOString().split('T')[0]}
        </h3>

        {selectedActivities.length > 0 ? (
          <ul className="space-y-2">
            {selectedActivities.map((a, i) => (
              <li key={i} className="border p-3 rounded">
                <strong>{a.type}</strong> – {a.date} <br />
                Czas: {a.duration} min, Dystans: {a.distance} km, Intensywność: {a.intensity}
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
