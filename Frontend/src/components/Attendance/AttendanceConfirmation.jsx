import React, { useEffect } from 'react';
import { getImageUrl } from '../../utils/EmployeeHelper';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const AttendanceConfirmation = ({ employee, isAlreadyMarked, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 mb-4">
            <img
              src={getImageUrl(employee?.userId?.profileImage)}
              alt={employee?.userId?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          </div>

          {/* Employee Name */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {employee?.userId?.name}
          </h2>

          {/* Status Message */}
          <div className={`flex items-center space-x-2 mb-4 ${
            isAlreadyMarked ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {isAlreadyMarked ? (
              <FaExclamationCircle className="text-2xl" />
            ) : (
              <FaCheckCircle className="text-2xl" />
            )}
            <span className="text-lg font-semibold">
              {isAlreadyMarked ? 'Attendance Already Marked' : 'Attendance Successfully Marked'}
            </span>
          </div>

          {/* Additional Info */}
          <p className="text-gray-600 text-center">
            {isAlreadyMarked 
              ? 'Your attendance has been recorded earlier today.'
              : 'Your attendance has been recorded successfully.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceConfirmation; 