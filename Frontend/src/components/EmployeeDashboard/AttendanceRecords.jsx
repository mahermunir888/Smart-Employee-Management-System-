import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { format } from 'date-fns';
import { FaSort, FaQrcode, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/authcontext';
import QRCode from 'qrcode.react';

const EmployeeAttendanceRecords = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showQRCode, setShowQRCode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/attendance/${user._id}`);
      
      if (response.data.success) {
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
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Attendance Records</h1>
          <p className="text-gray-600">View your attendance history</p>
        </div>
        <button
          onClick={() => setShowQRCode(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaQrcode className="text-xl" />
          <span>Show QR Code</span>
        </button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
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
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendanceRecords.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
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

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowQRCode(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Attendance QR Code</h2>
              <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-gray-100">
                <QRCode
                  value={user._id}
                  size={256}
                  level="H"
                  includeMargin={true}
                  className="mx-auto"
                />
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Show this QR code to your administrator to mark your attendance
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendanceRecords; 