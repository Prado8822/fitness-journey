import React from 'react';
import ActivityList from '../components/ActivityList';
import CalendarView from '../components/CalendarView';

const Home = () => {
  return (
    <div className="pb-10 pt-2">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
        Twoje Aktywności
      </h2>
      <CalendarView />
      <ActivityList />
    </div>
  );
};

export default Home;