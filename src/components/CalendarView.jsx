import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const [value, setValue] = useState(new Date());

  return (
    <div className="mb-4">
      <Calendar onChange={setValue} value={value} />
    </div>
  );
};

export default CalendarView;
