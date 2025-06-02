import React, { useState } from 'react';
import ActivityForm from '../components/ActivityForm';

const AddActivity = () => {
  const [activities, setActivities] = useState([]);

  const handleAdd = (activity) => {
    setActivities([...activities, activity]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dodaj aktywność</h1>
      <ActivityForm onAdd={handleAdd} />
    </div>
  );
};

export default AddActivity;
