import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, Plus, BarChart2, Target, Settings, X, Sparkles, 
  Download, Upload, Trash2, Globe, User, Ruler, Weight, 
  HeartPulse, ChevronRight, FileJson, Calendar
} from 'lucide-react';
import localforage from 'localforage';
import { useTranslation } from 'react-i18next';

import Home from './pages/Home.jsx';
import AddActivity from './pages/AddActivity.jsx';
import StatsPage from './pages/StatsPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; 
};

function App() {
  const { i18n } = useTranslation();

  const [userName, setUserName] = useState('');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsClosing, setIsSettingsClosing] = useState(false);
  
  const [lang, setLang] = useState('pl');

  const [gender, setGender] = useState('');
  const [periodDate, setPeriodDate] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');


  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadSettings = async () => {
      let storedLang = await localforage.getItem('appLanguage');
      
      if (storedLang === 'uk') {
        storedLang = 'ua';
        await localforage.setItem('appLanguage', 'ua'); // Сразу исправляем в памяти
      }
      
      if (storedLang) {
        setLang(storedLang);
        i18n.changeLanguage(storedLang);
      }

      const storedName = await localforage.getItem('userName');
      if (storedName) setUserName(storedName);

      const storedGender = await localforage.getItem('userGender');
      if (storedGender) setGender(storedGender); 
      else setShowWelcomeModal(true);
      
      const storedPeriod = await localforage.getItem('periodDate');
      if (storedPeriod) setPeriodDate(storedPeriod);

      const storedAge = await localforage.getItem('userAge');
      if (storedAge) setAge(storedAge);

      const storedHeight = await localforage.getItem('userHeight');
      if (storedHeight) setHeight(storedHeight);

      const storedWeight = await localforage.getItem('userWeight');
      if (storedWeight) setWeight(storedWeight);


    };

    loadSettings();
  }, [i18n]);

  const closeSettings = () => {
    setIsSettingsClosing(true);
    setTimeout(() => {
      setIsSettingsOpen(false);
      setIsSettingsClosing(false);
    }, 300); 
  };

  const handleUpdate = async (key, value, setter) => {
    setter(value);
    if (value === '' || value === null) {
      await localforage.removeItem(key);
    } else {
      await localforage.setItem(key, value.toString());
    }
  };

  const handleLanguageChange = async (newLang) => {
    setLang(newLang); 
    await localforage.setItem('appLanguage', newLang); 
    i18n.changeLanguage(newLang); 
  };

  const handleGenderChange = async (selectedGender) => {
    setGender(selectedGender);
    await localforage.setItem('userGender', selectedGender);
    if (selectedGender !== 'female') {
      setPeriodDate('');
      await localforage.removeItem('periodDate');
      await localforage.removeItem('backupPeriodDate');
    }
  };

  const t = {
    pl: {
      settingsTitle: "Ustawienia",
      profile: "PROFIL",
      params: "PARAMETRY FIZYCZNE",
      lang: "Język",
      name: "Imię",
      age: "Wiek",
      height: "Wzrost",
      weight: "Waga",
      gender: "Płeć",
      female: "Kobieta",
      male: "Mężczyzna",
      sec: "BEZPIECZEŃSTWO",
      bio: "Face ID / Touch ID",
      data: "DANE APLIKACJI",
      backupDownload: "Eksport",
      backupDownloadDesc: "Pobierz plik JSON",
      backupUpload: "Import",
      backupUploadDesc: "Przywróć dane z pliku",
      danger: "NIEBEZPIECZNA STREFA",
      resetData: "Skasuj wszystkie dane",
      localInfo: "Dane są zapisywane lokalnie na urządzeniu",
      confirmReset: "Czy na pewno chcesz usunąć WSZYSTKIE dane? Tej operacji nie można cofnąć.",
      importSuccess: "Dane zostały pomyślnie wczytane!",
      importError: "Błąd podczas ładowania pliku.",
      navHome: "Główna",
      navStats: "Statystyki",
      navGoals: "Cele"
    },
    en: {
      settingsTitle: "Settings",
      profile: "PROFILE",
      params: "PHYSICAL PARAMS",
      lang: "Language",
      name: "Name",
      age: "Age",
      height: "Height",
      weight: "Weight",
      gender: "Gender",
      female: "Female",
      male: "Male",
      sec: "SECURITY",
      bio: "Face ID / Touch ID",
      data: "APP DATA",
      backupDownload: "Export",
      backupDownloadDesc: "Download JSON file",
      backupUpload: "Import",
      backupUploadDesc: "Restore from file",
      danger: "DANGER ZONE",
      resetData: "Reset all data",
      localInfo: "Data is stored locally on your device",
      confirmReset: "Are you sure you want to delete ALL data? This cannot be undone.",
      importSuccess: "Data imported successfully!",
      importError: "Error loading file.",
      navHome: "Home",
      navStats: "Stats",
      navGoals: "Goals"
    },
    ua: {
      settingsTitle: "Налаштування",
      profile: "ПРОФІЛЬ",
      params: "ФІЗИЧНІ ПАРАМЕТРИ",
      lang: "Мова",
      name: "Ім'я",
      age: "Вік",
      height: "Зріст",
      weight: "Вага",
      gender: "Стать",
      female: "Жіноча",
      male: "Чоловіча",
      sec: "БЕЗПЕКА",
      bio: "Face ID / Touch ID",
      data: "ДАНІ ДОДАТКУ",
      backupDownload: "Експорт",
      backupDownloadDesc: "Завантажити JSON файл",
      backupUpload: "Імпорт",
      backupUploadDesc: "Відновити з файлу",
      danger: "НЕБЕЗПЕЧНА ЗОНА",
      resetData: "Скинути всі дані",
      localInfo: "Дані зберігаються локально на пристрої",
      confirmReset: "Ви впевнені, що хочете видалити ВСІ дані? Цю дію неможливо скасувати.",
      importSuccess: "Дані успішно імпортовано!",
      importError: "Помилка завантаження файлу.",
      navHome: "Головна",
      navStats: "Статистика",
      navGoals: "Цілі"
    }
  };

  const handleWelcomeChoice = async (selectedGender) => {
    await handleGenderChange(selectedGender);
    setShowWelcomeModal(false);
  };

  const handleExportData = async () => {
    try {
      const activities = (await localforage.getItem('activities')) || [];
      const exportObject = {
        profile: { userName, gender, age, height, weight, periodDate, lang },
        activities: activities,
        exportDate: new Date().toISOString()
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "Fitness_Backup.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      alert(t[lang].importError);
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.profile) {
          if (importedData.profile.userName) await localforage.setItem('userName', importedData.profile.userName);
          if (importedData.profile.gender) await localforage.setItem('userGender', importedData.profile.gender);
          if (importedData.profile.age) await localforage.setItem('userAge', importedData.profile.age);
          if (importedData.profile.height) await localforage.setItem('userHeight', importedData.profile.height);
          if (importedData.profile.weight) await localforage.setItem('userWeight', importedData.profile.weight);
          if (importedData.profile.periodDate) await localforage.setItem('periodDate', importedData.profile.periodDate);
          if (importedData.profile.lang) await localforage.setItem('appLanguage', importedData.profile.lang);
        }
        if (importedData.activities) {
          await localforage.setItem('activities', importedData.activities);
        }
        alert(t[lang].importSuccess);
        window.location.reload(); 
      } catch (error) {
        alert(t[lang].importError);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = async () => {
    if (window.confirm(t[lang].confirmReset)) {
      await localforage.clear();
      window.location.reload();
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center w-16 shrink-0 space-y-1 transition-all duration-300 ${
      isActive ? 'text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]' : 'text-slate-500 hover:text-purple-300'
    }`;

  const rowClass = "flex items-center justify-between p-4 bg-[#13072E]/60 border-b border-white/5 last:border-none transition-colors";
  const inputClass = "bg-[#0B0316]/80 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-white/20 text-center shadow-inner";

  return (
    <Router>
      <ScrollToTop />
      
      <div className="min-h-screen w-full overflow-x-hidden bg-[#0B0316] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(107,33,168,0.25),rgba(11,3,22,1))] text-slate-100 font-sans pb-28 relative">
        
        <style>{`
          .animate-modal-pop { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes modalPop { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
          
          /* Анимации для выдвижного меню */
          .animate-slide-in-left { animation: slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-slide-out-left { animation: slideOutLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          @keyframes slideOutLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }

          /* Анимации для затемнения фона */
          .animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
          .animate-fade-out { animation: fadeOut 0.3s ease-in forwards; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

          .group:hover .rotate-gear { animation: spin-slow 3s linear infinite; }
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }

          /* УБИРАЕМ СТРЕЛОЧКИ У INPUT TYPE NUMBER */
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield; /* Firefox */
          }
        `}</style>

        <div 
          className="fixed top-0 left-0 w-full z-[90] pointer-events-none"
          style={{
            height: 'calc(env(safe-area-inset-top) + 20px)',
            background: 'linear-gradient(to bottom, rgba(11, 3, 22, 0.8) 0%, rgba(11, 3, 22, 0) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
          }}
        ></div>
        <header 
          className="max-w-xl mx-auto px-4 relative z-40"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
        >
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-[#13072E]/60 border border-purple-500/20 rounded-xl text-purple-400 hover:text-white hover:bg-purple-600/30 transition-all shadow-[0_0_10px_rgba(147,51,234,0.1)] group active:scale-95 focus:outline-none"
          >
            <Settings size={20} className="rotate-gear" />
          </button>
        </header>

        <main className="max-w-xl mx-auto mt-4 px-4 relative z-30">
          <Routes>
            <Route path="/" element={<Home userName={userName} gender={gender} periodDate={periodDate} lang={lang} />} />
            <Route path="/add" element={<AddActivity lang={lang} />} />
            <Route path="/stats" element={<StatsPage lang={lang} />} />
            <Route path="/goals" element={<GoalsPage lang={lang} />} />
          </Routes>
        </main>

        <nav 
          className="fixed bottom-0 left-0 w-full bg-[#13072E]/80 backdrop-blur-xl border-t border-purple-900/50 z-50"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex justify-center items-end gap-6 sm:gap-10 max-w-xl mx-auto px-4 pt-2.5 pb-3 relative">
            
            <NavLink to="/" className={navLinkClass}>
              <HomeIcon size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-1">{t[lang].navHome}</span>
            </NavLink>
            
            <div className="relative w-14 flex justify-center shrink-0">
              <NavLink to="/add" className="absolute -top-[60px] group">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-full shadow-[0_4px_15px_rgba(147,51,234,0.4)] transform transition-all duration-300 group-hover:scale-105 group-active:scale-95 border border-purple-500/30">
                  <Plus size={28} strokeWidth={2.5} />
                </div>
              </NavLink>
            </div>

            <NavLink to="/stats" className={navLinkClass}>
              <BarChart2 size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-1">{t[lang].navStats}</span>
            </NavLink>
            
            <NavLink to="/goals" className={navLinkClass}>
              <Target size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-1">{t[lang].navGoals}</span>
            </NavLink>
          </div>
        </nav>

        {(isSettingsOpen || isSettingsClosing) && (
          <div className="fixed inset-0 z-[150] flex">
            <div 
              className={`absolute inset-0 bg-[#0B0316]/70 backdrop-blur-sm ${isSettingsClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
              onClick={closeSettings}
            ></div>

            <div className={`relative w-[85%] max-w-sm h-full bg-[#0B0316] border-r border-purple-500/30 shadow-[20px_0_60px_rgba(168,85,247,0.2)] flex flex-col overflow-y-auto ${isSettingsClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}>
              
              <div 
                className="px-6 pb-4 border-b border-purple-500/20 bg-[#13072E]/40 sticky top-0 z-10 backdrop-blur-md flex items-center justify-between"
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
              >
                <h3 className="text-xl font-black text-white">{t[lang].settingsTitle}</h3>
                <button type="button" onClick={closeSettings} className="text-purple-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full focus:outline-none active:scale-90">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 flex-1 space-y-6">
                
                <div>
                  <span className="text-[10px] font-bold text-purple-400/60 uppercase tracking-[0.15em] ml-4 mb-2 block">
                    {t[lang].profile}
                  </span>
                  <div className="bg-[#13072E]/40 border border-purple-500/20 rounded-[1.5rem] overflow-hidden shadow-sm">
                    
                    <div className={rowClass}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center"><Globe size={16} /></div>
                        <span className="text-sm font-medium">{t[lang].lang}</span>
                      </div>
                      <div className="flex bg-[#0B0316]/80 p-1 rounded-xl border border-white/5">
                        {['pl', 'en', 'ua'].map((l) => (
                          <button
                            key={l}
                            onClick={() => handleLanguageChange(l)} 
                            className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                              lang === l ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={rowClass}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center"><User size={16} /></div>
                        <span className="text-sm font-medium">{t[lang].name}</span>
                      </div>
                      <input 
                        type="text" 
                        value={userName} 
                        onChange={(e) => handleUpdate('userName', e.target.value, setUserName)}
                        placeholder="..."
                        className={`${inputClass} w-32`}
                      />
                    </div>

                    <div className={`${rowClass} flex-col items-stretch gap-3`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center"><HeartPulse size={16} /></div>
                        <span className="text-sm font-medium">{t[lang].gender}</span>
                      </div>
                      <div className="flex bg-[#0B0316]/80 p-1 rounded-xl border border-white/5 w-full">
                        <button
                          onClick={() => handleGenderChange('female')}
                          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                            gender === 'female' ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(219,39,119,0.5)]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {t[lang].female}
                        </button>
                        <button
                          onClick={() => handleGenderChange('male')}
                          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                            gender === 'male' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.5)]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {t[lang].male}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-purple-400/60 uppercase tracking-[0.15em] ml-4 mb-2 block">
                    {t[lang].params}
                  </span>
                  <div className="bg-[#13072E]/40 border border-purple-500/20 rounded-[1.5rem] overflow-hidden shadow-sm">
                    <div className={rowClass}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center"><Calendar size={16} /></div>
                        <span className="text-sm font-medium">{t[lang].age}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" value={age} onChange={(e) => handleUpdate('userAge', e.target.value, setAge)} placeholder="-" className={`${inputClass} w-20`} />
                        <span className="w-4"></span>
                      </div>
                    </div>
                    
                    <div className={rowClass}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center"><Ruler size={16} /></div>
                        <span className="text-sm font-medium">{t[lang].height}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" value={height} onChange={(e) => handleUpdate('userHeight', e.target.value, setHeight)} placeholder="-" className={`${inputClass} w-20`} />
                        <span className="text-xs font-bold text-white/30 w-4">cm</span>
                      </div>
                    </div>

                    <div className={rowClass}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center"><Weight size={16} /></div>
                        <span className="text-sm font-medium">{t[lang].weight}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" value={weight} onChange={(e) => handleUpdate('userWeight', e.target.value, setWeight)} placeholder="-" className={`${inputClass} w-20`} />
                        <span className="text-xs font-bold text-white/30 w-4">kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.15em] ml-4 mb-2 block">
                    {t[lang].data}
                  </span>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[1.5rem] overflow-hidden shadow-sm">
                    <button onClick={handleExportData} className={`w-full text-left flex items-center justify-between p-4 border-b border-emerald-500/10 hover:bg-emerald-500/10 transition-colors focus:outline-none active:bg-emerald-500/20`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><Download size={16} /></div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-emerald-400">{t[lang].backupDownload}</span>
                          <span className="text-[10px] text-emerald-400/50">{t[lang].backupDownloadDesc}</span>
                        </div>
                      </div>
                      <FileJson size={16} className="text-emerald-500/40" />
                    </button>

                    <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportData} className="hidden" />
                    <button onClick={() => fileInputRef.current.click()} className={`w-full text-left flex items-center justify-between p-4 hover:bg-emerald-500/10 transition-colors focus:outline-none active:bg-emerald-500/20`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><Upload size={16} /></div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-emerald-400">{t[lang].backupUpload}</span>
                          <span className="text-[10px] text-emerald-400/50">{t[lang].backupUploadDesc}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-emerald-500/40" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-red-500/60 uppercase tracking-[0.15em] ml-4 mb-2 block">
                    {t[lang].danger}
                  </span>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-[1.5rem] overflow-hidden shadow-sm">
                    <button onClick={handleResetData} className={`w-full text-left flex items-center p-4 hover:bg-red-500/10 transition-colors focus:outline-none active:bg-red-500/20`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center"><Trash2 size={16} /></div>
                        <span className="text-sm font-bold text-red-400">{t[lang].resetData}</span>
                      </div>
                    </button>
                  </div>
                </div>

                <p className="text-[9px] text-center text-purple-400/30 uppercase tracking-[0.1em] pb-4">
                  {t[lang].localInfo}
                </p>

              </div>
            </div>
          </div>
        )}

        {showWelcomeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-[#0B0316]/95 backdrop-blur-md transition-all duration-300">
            <div className="bg-[#13072E] border border-purple-500/40 rounded-[2.5rem] p-8 w-full max-w-sm shadow-[0_0_80px_rgba(168,85,247,0.4)] relative animate-modal-pop text-center">
              <button onClick={() => handleWelcomeChoice('male')} className="absolute top-4 right-4 text-purple-400/60 hover:text-white transition-colors p-2 bg-white/5 rounded-full z-10 focus:outline-none">
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
                <button onClick={() => handleWelcomeChoice('female')} className="w-full py-4 rounded-2xl font-black tracking-widest uppercase transition-all bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] active:scale-95">
                  Jestem kobietą
                </button>
                <button onClick={() => handleWelcomeChoice('male')} className="w-full py-4 rounded-2xl font-black tracking-widest uppercase transition-all bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] active:scale-95">
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