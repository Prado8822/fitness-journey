import React, { useState, useEffect } from 'react';

const AddActivity = () => {
  const [form, setForm] = useState({
    type: '',
    duration: '',
    distance: '',
    intensity: '',
    date: '',
  });

  const [activities, setActivities] = useState([]);

  // Загружаем при старте
  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...activities, form];
    setActivities(updated);
    localStorage.setItem('activities', JSON.stringify(updated));
    setForm({
      type: '',
      duration: '',
      distance: '',
      intensity: '',
      date: '',
    });
  };

  const handleDelete = (index) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
    localStorage.setItem('activities', JSON.stringify(updated));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dodaj Aktywność</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Typ aktywności</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Wybierz --</option>
            <option value="Bieganie">Bieganie</option>
            <option value="Trening siłowy">Trening siłowy</option>
            <option value="Jazda na rowerze">Jazda na rowerze</option>
            <option value="Joga">Joga</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Czas trwania (minuty)</label>
          <input type="number" name="duration" value={form.duration} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block mb-1">Dystans (km)</label>
          <input type="number" name="distance" value={form.distance} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block mb-1">Intensywność</label>
          <select name="intensity" value={form.intensity} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Wybierz --</option>
            <option value="Niska">Niska</option>
            <option value="Średnia">Średnia</option>
            <option value="Wysoka">Wysoka</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Data</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Zapisz</button>
      </form>

      <h3 className="text-xl font-bold mt-8">Dodane aktywności:</h3>
      <ul className="mt-2 space-y-2">
        {activities.map((a, i) => (
          <li key={i} className="border p-3 rounded flex justify-between items-start gap-4">
            <div>
              <strong>{a.type}</strong> – {a.date} <br />
              Czas: {a.duration} min, Dystans: {a.distance} km, Intensywność: {a.intensity}
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="text-red-600 hover:underline"
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddActivity;
