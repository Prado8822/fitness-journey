import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Clock, MapPin, Zap, CalendarDays, ChevronRight, X, 
  Flame, Dumbbell, Bike, Flower2, Footprints, Waves, Music, Sparkles 
} from 'lucide-react';

const AddActivity = () => {
  const [form, setForm] = useState({
    type: '',
    duration: '',
    distance: '',
    intensity: '',
    date: '',
  });

  const [activities, setActivities] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Заменили эмодзи на стильные SVG-компоненты с индивидуальными цветами
  const activityTypes = [
    { id: 'Bieganie', label: 'Bieganie', icon: <Flame size={36} className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" /> },
    { id: 'Trening siłowy', label: 'Siłownia', icon: <Dumbbell size={36} className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" /> },
    { id: 'Jazda na rowerze', label: 'Rower', icon: <Bike size={36} className="text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" /> },
    { id: 'Joga', label: 'Joga', icon: <Flower2 size={36} className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" /> },
    { id: 'Spacer', label: 'Spacer', icon: <Footprints size={36} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" /> },
    { id: 'Pływanie', label: 'Pływanie', icon: <Waves size={36} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" /> },
    { id: 'Taniec', label: 'Taniec', icon: <Music size={36} className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)]" /> },
    { id: 'Inne', label: 'Inne', icon: <Sparkles size={36} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" /> },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeSelect = (typeId) => {
    setForm({ ...form, type: typeId });
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.type) return alert('Wybierz typ aktywności!');
    const updated = [...activities, form];
    setActivities(updated);
    localStorage.setItem('activities', JSON.stringify(updated));
    setForm({ type: '', duration: '', distance: '', intensity: '', date: '' });
  };

  const handleDelete = (index) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
    localStorage.setItem('activities', JSON.stringify(updated));
  };

  const selectedActivity = activityTypes.find(a => a.id === form.type);

  const inputClasses = "w-full p-3 bg-[#13072E]/60 border border-purple-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 [color-scheme:dark]";
  const labelClasses = "flex items-center gap-2 mb-2 text-sm font-medium text-purple-200 tracking-wide";

  return (
    <div className="pb-10 pt-2 space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
        Dodaj Aktywność
      </h2>
      
      <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-900/50 rounded-3xl p-6 shadow-[0_8px_30px_rgba(147,51,234,0.15)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Главная кнопка выбора (теперь с поддержкой SVG) */}
          <div>
            <label className={labelClasses}>Typ aktywności</label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                form.type 
                ? 'border-fuchsia-500 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(232,121,249,0.2)]' 
                : 'border-purple-500/30 bg-[#13072E]/60 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center">
                  {selectedActivity ? React.cloneElement(selectedActivity.icon, { size: 28 }) : <Sparkles size={28} className="text-purple-400" />}
                </span>
                <span className={`font-semibold tracking-wide ${form.type ? 'text-white' : 'text-slate-400'}`}>
                  {selectedActivity?.label || 'Wybierz typ...'}
                </span>
              </div>
              <ChevronRight className="text-purple-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}><Clock size={16} className="text-indigo-400" /> Czas (min)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}><MapPin size={16} className="text-purple-400" /> Dystans (km)</label>
              <input type="number" name="distance" value={form.distance} onChange={handleChange} className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}><Zap size={16} className="text-yellow-400" /> Intensywność</label>
              <select name="intensity" value={form.intensity} onChange={handleChange} className={inputClasses}>
                <option value="" className="bg-[#0B0316]">-- Wybierz --</option>
                <option value="Niska" className="bg-[#0B0316]">Niska</option>
                <option value="Średnia" className="bg-[#0B0316]">Średnia</option>
                <option value="Wysoka" className="bg-[#0B0316]">Wysoka</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}><CalendarDays size={16} className="text-pink-400" /> Data</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClasses} required />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-[0_4px_15px_rgba(147,51,234,0.4)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.6)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-purple-400/30 tracking-widest uppercase">
            Zapisz trening
          </button>
        </form>
      </div>

      {/* Модальное окно выбора активности */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0316]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#13072E] border border-purple-500/30 rounded-[2.5rem] p-8 w-full max-w-lg shadow-[0_0_50px_rgba(147,51,234,0.3)] relative animate-in zoom-in-95 duration-300">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-purple-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <h3 className="text-2xl font-black mb-8 text-center bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">
              Wybierz aktywność
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {activityTypes.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => handleTypeSelect(activity.id)}
                  className="group relative p-4 rounded-2xl border border-purple-500/10 bg-[#0B0316]/50 hover:bg-purple-900/40 hover:border-purple-400/50 transition-all duration-300 cursor-pointer flex items-center gap-4 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(147,51,234,0.2)] active:scale-95 overflow-hidden"
                >
                  <span className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                    {activity.icon}
                  </span>
                  <span className="font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors relative z-10">
                    {activity.label}
                  </span>
                  
                  {/* Легкий градиент на фоне при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* История */}
      {activities.length > 0 && (
        <div className="bg-[#13072E]/40 backdrop-blur-xl border border-purple-900/50 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(147,51,234,0.1)] transition-all duration-300">
          <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="w-full flex items-center justify-between p-5 text-purple-200 hover:bg-[#13072E]/60 transition-colors">
            <span className="font-bold tracking-wide">Historia aktywności ({activities.length})</span>
            <ChevronDown className={`transform transition-transform duration-300 text-purple-400 ${isHistoryOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`transition-all duration-500 ease-in-out ${isHistoryOpen ? 'max-h-[1000px] opacity-100 p-5 pt-0' : 'max-h-0 opacity-0 px-5 overflow-hidden'}`}>
            <ul className="space-y-3 mt-2">
              {activities.map((a, i) => {
                // Ищем иконку для истории (если старая запись без SVG, подставляем звезду)
                const histIcon = activityTypes.find(type => type.id === a.type)?.icon || <Sparkles size={20} className="text-purple-400" />;
                
                return (
                  <li key={i} className="border border-purple-500/20 p-4 rounded-xl flex justify-between items-start bg-[#13072E]/60 backdrop-blur-md shadow-inner">
                    <div className="text-slate-300 text-sm leading-relaxed">
                      <div className="flex items-center gap-2 mb-1">
                        {React.cloneElement(histIcon, { size: 18 })}
                        <strong className="text-white text-base tracking-wide">{a.type}</strong> 
                        <span className="text-purple-400/60 ml-1 text-xs">{a.date}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1"><Clock size={12} className="text-indigo-400"/> <span className="text-purple-200">{a.duration} min</span></span>
                        <span className="flex items-center gap-1"><MapPin size={12} className="text-purple-400"/> <span className="text-purple-200">{a.distance} km</span></span>
                        <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-400"/> <span className="text-purple-200">{a.intensity}</span></span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(i)} className="text-red-400 hover:text-red-300 hover:drop-shadow-[0_0_5px_rgba(248,113,113,0.6)] ml-4 p-2 rounded-lg transition-all duration-200 uppercase text-xs font-bold tracking-wider">
                      Usuń
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddActivity;