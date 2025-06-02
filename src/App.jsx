import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home.jsx';
import AddActivity from './pages/AddActivity.jsx';
import StatsPage from './pages/StatsPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';

function App() {
  return (
    <Router>
      <nav className="p-4 bg-indigo-600 text-white flex gap-4">
        <Link to="/">🏠 Główna</Link>
        <Link to="/add">➕ Dodaj</Link>
        <Link to="/stats">📊 Statystyki</Link>
        <Link to="/goals">🎯 Cele</Link>
      </nav>

      <div className="max-w-2xl mx-auto mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddActivity />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
