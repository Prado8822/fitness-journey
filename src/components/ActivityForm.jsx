import React, { useState } from 'react';

const ActivityForm = ({ onAdd }) => {
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
    onAdd(activity);
    setActivity({ type: '', duration: '', distance: '', intensity: '', date: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl shadow-md">
      <input name="type" placeholder="Typ aktywności" value={activity.type} onChange={handleChange} className="input" required />
      <input name="duration" placeholder="Czas (min)" value={activity.duration} onChange={handleChange} className="input" required />
      <input name="distance" placeholder="Dystans (km)" value={activity.distance} onChange={handleChange} className="input" />
      <input name="intensity" placeholder="Intensywność" value={activity.intensity} onChange={handleChange} className="input" />
      <input type="date" name="date" value={activity.date} onChange={handleChange} className="input" required />
      <button type="submit" className="btn">Dodaj</button>
    </form>
  );
};

export default ActivityForm;
