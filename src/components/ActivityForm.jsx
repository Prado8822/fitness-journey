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

    // Сохраняем в localStorage
    const stored = JSON.parse(localStorage.getItem('activities')) || [];
    stored.push(activity);
    localStorage.setItem('activities', JSON.stringify(stored));

    // Очищаем форму
    setActivity({ type: '', duration: '', distance: '', intensity: '', date: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl shadow-md bg-white max-w-md mx-auto">
      <input
        name="type"
        placeholder="Typ aktywności"
        value={activity.type}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        name="duration"
        placeholder="Czas (min)"
        value={activity.duration}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        name="distance"
        placeholder="Dystans (km)"
        value={activity.distance}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="intensity"
        placeholder="Intensywność"
        value={activity.intensity}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="date"
        name="date"
        value={activity.date}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Dodaj
      </button>
    </form>
  );
};

export default ActivityForm;
