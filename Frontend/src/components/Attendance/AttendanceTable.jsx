import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { format } from 'date-fns';
import { FaSort } from 'react-icons/fa';

const AttendanceTable = ({ selectedDate }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedDate]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      let url = '/api/attendance';
      
      if (selectedDate) {
        // Create start and end date for the selected date
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
        
        url = `/api/attendance?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }
      
      console.log('Fetching attendance from:', url);
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        console.log('Attendance records:', response.data.attendance);
        setAttendanceRecords(response.data.attendance);
        setError(null);
      } else {
        setError(response.data.error || 'Failed to fetch attendance records');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError(error.response?.data?.error || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedRecords = [...attendanceRecords].sort((a, b) => {
      if (key === 'date' || key === 'time') {
        const dateA = new Date(key === 'date' ? a[key] : a.date + ' ' + a.time);
        const dateB = new Date(key === 'date' ? b[key] : b.date + ' ' + b.time);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setAttendanceRecords(sortedRecords);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('employeeId.userId.name')}>
              Employee Name <FaSort className="inline ml-1" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('employeeId.employeeid')}>
              Employee ID <FaSort className="inline ml-1" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}>
              Date <FaSort className="inline ml-1" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('time')}>
              Time <FaSort className="inline ml-1" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}>
              Status <FaSort className="inline ml-1" />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attendanceRecords.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No attendance records found {selectedDate ? 'for the selected date' : ''}
              </td>
            </tr>
          ) : (
            attendanceRecords.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.employeeId?.userId?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.employeeId?.employeeid || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(record.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable; 