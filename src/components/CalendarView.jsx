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
          <div className="flex justify-center mt-1 absolute bottom-1 left-0 right-0">
            <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full shadow-[0_0_5px_rgba(232,121,249,0.8)]"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="mb-6">
      <div className="bg-[#13072E]/60 backdrop-blur-xl border border-purple-900/50 rounded-3xl p-5 shadow-[0_8px_30px_rgba(147,51,234,0.1)] overflow-hidden">
        <style>{`
          .react-calendar {
            background: transparent;
            border: none;
            width: 100%;
            color: #e2e8f0;
            font-family: inherit;
          }
          .react-calendar__navigation button {
            color: #e2e8f0;
            min-width: 44px;
            background: none;
            font-size: 16px;
            margin-top: 8px;
            border-radius: 12px;
            transition: background 0.2s;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background: rgba(147, 51, 234, 0.2);
          }
          .react-calendar__month-view__weekdays {
            text-transform: uppercase;
            font-weight: 600;
            font-size: 0.75em;
            color: #a855f7;
            text-decoration: none;
          }
          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
          }
          .react-calendar__tile {
            color: #e2e8f0;
            background: none;
            padding: 14px 6px;
            border-radius: 12px;
            transition: all 0.2s;
            position: relative;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background: rgba(147, 51, 234, 0.2);
          }
          .react-calendar__tile--now {
            background: rgba(147, 51, 234, 0.1);
            color: #d8b4fe;
          }
          .react-calendar__tile--now:enabled:hover,
          .react-calendar__tile--now:enabled:focus {
            background: rgba(147, 51, 234, 0.3);
          }
          .react-calendar__tile--active,
          .react-calendar__tile--active:enabled:hover,
          .react-calendar__tile--active:enabled:focus {
            background: linear-gradient(to top right, #9333ea, #4f46e5);
            color: white;
            box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
          }
          .react-calendar__month-view__days__day--neighboringMonth {
            color: #475569;
          }
        `}</style>
        
        <Calendar
          onChange={handleDateChange}
          value={value}
          tileContent={tileContent}
          className="react-calendar-custom"
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4 text-purple-200 tracking-wide drop-shadow-sm">
          Aktywności dla: <span className="text-white">{formatDate(value)}</span>
        </h3>

        {selectedActivities.length > 0 ? (
          <div
            className={`p-5 rounded-2xl border backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] mb-4 transition-all duration-300
              ${isGoalMet(selectedActivities) ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>

            <p className={`mb-4 font-semibold tracking-wide ${isGoalMet(selectedActivities) ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]' : 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.4)]'}`}>
              {isGoalMet(selectedActivities)
                ? '🎯 Cel na ten dzień został osiągnięty!'
                : '❌ Cel na ten dzień NIE został osiągnięty.'}
            </p>

            <ul className="space-y-3">
              {selectedActivities.map((a, i) => (
                <li key={i} className="border border-purple-500/20 p-4 rounded-xl flex justify-between items-start bg-[#13072E]/80 shadow-inner">
                  <div className="text-slate-300 text-sm leading-relaxed">
                    <strong className="text-white text-base tracking-wide">{a.type}</strong> <span className="text-purple-400/60 ml-2 text-xs">{a.date}</span> <br />
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>⏱ <span className="text-purple-300">{a.duration} min</span></span>
                      <span>📏 <span className="text-purple-300">{a.distance} km</span></span>
                      <span>⚡ <span className="text-purple-300">{a.intensity}</span></span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-400 hover:text-red-300 hover:drop-shadow-[0_0_5px_rgba(248,113,113,0.6)] ml-4 p-2 rounded-lg transition-all duration-200 uppercase text-xs font-bold tracking-wider"
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-purple-900/30 bg-[#13072E]/40 backdrop-blur-md text-center">
            <p className="text-purple-300/60 font-medium tracking-wide">Brak aktywności w tym dniu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;