import React from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home as HomeIcon, Plus, BarChart2, Target } from 'lucide-react';

import Home from './pages/Home.jsx';
import AddActivity from './pages/AddActivity.jsx';
import StatsPage from './pages/StatsPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';

function App() {
  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full space-y-1 transition-all duration-300 ${
      isActive ? 'text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]' : 'text-slate-500 hover:text-purple-300'
    }`;

  return (
    <Router>
      {/* ФИКС БЕЛОЙ РАМКИ: 
        Добавлены классы w-full и overflow-x-hidden. 
        Они запрещают странице скроллиться по горизонтали, отсекая любые вылезающие элементы!
      */}
      <div className="min-h-screen w-full overflow-x-hidden bg-[#0B0316] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(107,33,168,0.25),rgba(11,3,22,1))] text-slate-100 font-sans pb-28">
        
        {/* Шапка FITTRACK удалена отсюда */}

        <main className="max-w-xl mx-auto mt-6 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
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

      </div>
    </Router>
  );
}

export default App;