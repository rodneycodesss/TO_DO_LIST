import React, { useState, useEffect } from "react";
import "./CompletedTasksStyles.css"; // Apply styles


const Calendar = ({date, handleInfoChange}) => {
  const [selectedDate, setSelectedDate] = useState("");
  
  useEffect(() => {
    setSelectedDate(date ?? "2025-08-15"); // Default selected date
  }, [date]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    handleInfoChange(event, 'Date');
  };


  return (
    <div>
      <input 
        type="date" 
        onChange={handleDateChange} 
        value={selectedDate}  
        min={selectedDate} // Disable dates before selected one
        className="calendar-input"
      />
    </div>
  ); 
};

export default Calendar;

