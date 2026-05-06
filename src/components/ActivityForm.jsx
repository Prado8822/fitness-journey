import React, { useState } from 'react';

const ActivityForm = () => {
  const [activity, setActivity] = useState({
    type: '',
    duration: '',
    distance: '',
    intensity: '',
    date: ''
  });

  const handleChange = (e) => {
    setActivity({ ...activity, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = JSON.parse(localStorage.getItem('activities')) || [];
    stored.push(activity);
    localStorage.setItem('activities', JSON.stringify(stored));

    setActivity({ type: '', duration: '', distance: '', intensity: '', date: '' });
  };

  const inputClasses = "w-full p-3 bg-[#13072E]/60 border border-purple-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 placeholder-purple-300/40 [color-scheme:dark]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-[#13072E]/40 backdrop-blur-xl border border-purple-900/50 rounded-3xl shadow-[0_8px_30px_rgba(147,51,234,0.1)] max-w-md mx-auto">
      <input
        name="type"
        placeholder="Typ aktywności"
        value={activity.type}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        name="duration"
        placeholder="Czas (min)"
        value={activity.duration}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        name="distance"
        placeholder="Dystans (km)"
        value={activity.distance}
        onChange={handleChange}
        className={inputClasses}
      />
      <input
        name="intensity"
        placeholder="Intensywność"
        value={activity.intensity}
        onChange={handleChange}
        className={inputClasses}
      />
      <input
        type="date"
        name="date"
        value={activity.date}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <button type="submit" className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_15px_rgba(147,51,234,0.4)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.6)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-purple-400/30 tracking-widest uppercase">
        Dodaj
      </button>
    </form>
  );
};

export default ActivityForm;