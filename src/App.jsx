import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Plus, BarChart2, Target, Settings, X, Sparkles } from 'lucide-react';

import Home from './pages/Home.jsx';
import AddActivity from './pages/AddActivity.jsx';
import StatsPage from './pages/StatsPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';

// --- ИСПРАВЛЕНИЕ ПРОКРУТКИ: Компонент, который всегда кидает в начало страницы ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; 
};

function App() {
  // ГЛОБАЛЬНЫЕ СТЭЙТЫ НАСТРОЕК
  const [userName, setUserName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempName, setTempName] = useState('');

  // --- НОВЫЕ СТЭЙТЫ: ПОЛ И ЦИКЛ ---
  const [gender, setGender] = useState(''); // 'male' или 'female'
  const [tempGender, setTempGender] = useState('');
  const [periodDate, setPeriodDate] = useState('');
  const [tempPeriodDate, setTempPeriodDate] = useState('');

  // --- НОВЫЙ СТЭЙТ ДЛЯ ПРИВЕТСТВЕННОГО ОКНА ---
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Загружаем данные при старте приложения
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      setTempName(storedName);
    }

    const storedGender = localStorage.getItem('userGender');
    if (storedGender) {
      setGender(storedGender);
      setTempGender(storedGender);
    }
    
    // ИСПРАВЛЕНИЕ: Окно показывается ВСЕГДА при каждом запуске/обновлении
    setShowWelcomeModal(true);

    const storedPeriod = localStorage.getItem('periodDate');
    if (storedPeriod) {
      setPeriodDate(storedPeriod);
      setTempPeriodDate(storedPeriod);
    }
  }, []);

  // --- ЛОГИКА ОНБОРДИНГА ---
  const handleWelcomeChoice = (selectedGender) => {
    setGender(selectedGender);
    setTempGender(selectedGender);
    localStorage.setItem('userGender', selectedGender);

    // Если при входе выбрали "Мужчину" (или нажали крестик), 
    // сразу зачищаем память от женского цикла, чтобы не было багов.
    if (selectedGender !== 'female') {
      setPeriodDate('');
      setTempPeriodDate('');
      localStorage.removeItem('periodDate');
      localStorage.removeItem('backupPeriodDate');
    }

    setShowWelcomeModal(false);
  };

  // Сохраняем все настройки
  const saveSettings = () => {
    // Сохраняем имя
    setUserName(tempName);
    if (tempName.trim() === '') {
      localStorage.removeItem('userName');
    } else {
      localStorage.setItem('userName', tempName);
    }

    // Сохраняем пол
    setGender(tempGender);
    if (tempGender) {
      localStorage.setItem('userGender', tempGender);
    } else {
      localStorage.removeItem('userGender');
    }

    // ВАЖНАЯ ФУНКЦИЯ: Если выбран мужчина или пол не выбран, 
    // мы полностью очищаем память от женского цикла!
    if (tempGender !== 'female') {
      setPeriodDate('');
      setTempPeriodDate('');
      localStorage.removeItem('periodDate');
      localStorage.removeItem('backupPeriodDate'); // на всякий случай очищаем и бэкап
    }

    setIsSettingsOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full space-y-1 transition-all duration-300 ${
      isActive ? 'text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]' : 'text-slate-500 hover:text-purple-300'
    }`;

  // Получаем periodDate напрямую из localStorage для передачи в Home (так как стэйт теперь управляется там)
  const currentPeriodDate = localStorage.getItem('periodDate') || '';

  return (
    <Router>
      <ScrollToTop />
      
      <div className="min-h-screen w-full overflow-x-hidden bg-[#0B0316] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(107,33,168,0.25),rgba(11,3,22,1))] text-slate-100 font-sans pb-28">
        
        <style>{`
          .animate-modal-pop { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes modalPop { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
          .group:hover .rotate-gear { animation: spin-slow 3s linear infinite; }
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        `}</style>

        <header className="max-w-xl mx-auto pt-6 px-4 relative z-40">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-[#13072E]/60 border border-purple-500/20 rounded-xl text-purple-400 hover:text-white hover:bg-purple-600/30 transition-all shadow-[0_0_10px_rgba(147,51,234,0.1)] group active:scale-95 focus:outline-none"
          >
            <Settings size={20} className="rotate-gear" />
          </button>
        </header>

        <main className="max-w-xl mx-auto mt-2 px-4">
          <Routes>
            {/* ИСПРАВЛЕНИЕ: Передаем пол и дату в Home */}
            <Route path="/" element={<Home userName={userName} gender={gender} periodDate={currentPeriodDate} />} />
            <Route path="/add" element={<AddActivity />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 left-0 w-full bg-[#13072E]/80 backdrop-blur-xl border-t border-purple-900/50 pb-safe z-50">
          <div className="flex justify-between items-center max-w-xl mx-auto px-6 h-20 relative">
            <NavLink to="/" className={navLinkClass}>
              <HomeIcon size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-1">Główna</span>
            </NavLink>
            
            <NavLink to="/add" className="relative group -top-6">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-full shadow-[0_4px_15px_rgba(147,51,234,0.4)] transform transition-all duration-300 group-hover:scale-105 group-active:scale-95 border border-purple-500/30">
                <Plus size={28} strokeWidth={2.5} />
              </div>
            </NavLink>
            
            <NavLink to="/stats" className={navLinkClass}>
              <BarChart2 size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-1">Statystyki</span>
            </NavLink>
            
            <NavLink to="/goals" className={navLinkClass}>
              <Target size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-1">Cele</span>
            </NavLink>
          </div>
        </nav>

        {/* --- ГЛОБАЛЬНОЕ МОДАЛЬНОЕ ОКНО НАСТРОЕК --- */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 bg-[#0B0316]/90 backdrop-blur-md transition-all duration-300">
            <div className="bg-[#13072E] border border-purple-500/40 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.3)] relative animate-modal-pop text-center max-h-[90vh] overflow-y-auto">
              
              <button type="button" onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-purple-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full z-10 focus:outline-none">
                <X size={20} />
              </button>

              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-2">
                <Settings size={28} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-6">Ustawienia</h3>
              
              {/* ПОЛЕ: ИМЯ */}
              <div className="text-left mb-5">
                <label className="block text-xs font-bold text-purple-300/70 uppercase tracking-widest mb-2 ml-1">
                  Jak masz na imię?
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Wpisz imię..."
                    className="w-full bg-[#0B0316]/60 border border-purple-500/30 rounded-2xl pl-4 pr-12 py-3 text-white placeholder-purple-400/30 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 transition-all"
                  />
                  {tempName && (
                    <button 
                      onClick={() => {
                        setTempName('');
                        setUserName('');
                        localStorage.removeItem('userName');
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500/80 hover:text-red-400 transition-colors p-1 focus:outline-none"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>

              {/* ПОЛЕ: ВЫБОР ПОЛА */}
              <div className="text-left mb-5">
                <label className="block text-xs font-bold text-purple-300/70 uppercase tracking-widest mb-2 ml-1">
                  Płeć
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTempGender('female')}
                    className={`py-3 rounded-xl font-bold transition-all border ${
                      tempGender === 'female' 
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.2)]' 
                        : 'bg-[#0B0316]/60 border-purple-500/20 text-purple-400/60 hover:bg-[#0B0316]'
                    }`}
                  >
                    Kobieta
                  </button>
                  <button
                    onClick={() => setTempGender('male')}
                    className={`py-3 rounded-xl font-bold transition-all border ${
                      tempGender === 'male' 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                        : 'bg-[#0B0316]/60 border-purple-500/20 text-purple-400/60 hover:bg-[#0B0316]'
                    }`}
                  >
                    Mężczyzna
                  </button>
                </div>
              </div>

              <button 
                onClick={saveSettings} 
                className="w-full py-4 mt-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-black tracking-widest uppercase rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] focus:outline-none"
              >
                Zapisz
              </button>
            </div>
          </div>
        )}

        {/* --- ЭКРАН ОНБОРДИНГА (ПРИВЕТСТВИЕ) --- */}
        {showWelcomeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-[#0B0316]/95 backdrop-blur-md transition-all duration-300">
            <div className="bg-[#13072E] border border-purple-500/40 rounded-[2.5rem] p-8 w-full max-w-sm shadow-[0_0_80px_rgba(168,85,247,0.4)] relative animate-modal-pop text-center">
              
              {/* Крестик выбирает мужчину по умолчанию и закрывает окно */}
              <button 
                type="button" 
                onClick={() => handleWelcomeChoice('male')} 
                className="absolute top-4 right-4 text-purple-400/60 hover:text-white transition-colors p-2 bg-white/5 rounded-full z-10 focus:outline-none"
              >
                <X size={20} />
              </button>
              
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                <Sparkles size={36} className="text-white animate-pulse" />
              </div>

              <h2 className="text-2xl font-black text-white mb-3">Witaj w aplikacji! 👋</h2>
              <p className="text-sm text-purple-300/80 mb-8 leading-relaxed px-2">
                Zanim zaczniemy osiągać cele, powiedz nam, jak mamy dostosować Twój profil. 
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleWelcomeChoice('female')}
                  className="w-full py-4 rounded-2xl font-black tracking-widest uppercase transition-all bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] active:scale-95"
                >
                  Jestem kobietą
                </button>
                <button
                  onClick={() => handleWelcomeChoice('male')}
                  className="w-full py-4 rounded-2xl font-black tracking-widest uppercase transition-all bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95"
                >
                  Jestem mężczyzną
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Router>
  );
}

export default App;