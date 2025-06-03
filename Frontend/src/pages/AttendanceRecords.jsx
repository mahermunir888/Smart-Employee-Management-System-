import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceTable from '../components/Attendance/AttendanceTable';
import { FaQrcode } from 'react-icons/fa';
import { format } from 'date-fns';

const AttendanceRecords = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    // Format date as YYYY-MM-DD
    return format(today, 'yyyy-MM-dd');
  });

  // Update date if it changes during the day
  useEffect(() => {
    const updateDate = () => {
      const today = new Date();
      const formattedToday = format(today, 'yyyy-MM-dd');
      if (formattedToday !== selectedDate) {
        setSelectedDate(formattedToday);
      }
    };

    // Update date every minute
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Attendance Records</h1>
          <p className="text-gray-600">View and manage employee attendance records</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="date-filter" className="text-gray-600">Filter by Date:</label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={handleDateChange}
              max={format(new Date(), 'yyyy-MM-dd')} // Prevent selecting future dates
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={() => navigate('/admin-dashboard/attendance/scan')}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaQrcode className="text-xl" />
            <span>Scan QR Code</span>
          </button>
        </div>
      </div>
      
      <AttendanceTable selectedDate={selectedDate} />
    </div>
  );
};

export default AttendanceRecords; 