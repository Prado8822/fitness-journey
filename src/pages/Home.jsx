// src/pages/Home.jsx
import React from 'react';
import ActivityList from '../components/ActivityList';
import CalendarView from '../components/CalendarView';

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Twoje Aktywności</h1>
      <CalendarView />
      <ActivityList />
    </div>
  );
};

export default Home;
