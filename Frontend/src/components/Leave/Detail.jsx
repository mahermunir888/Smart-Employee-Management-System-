import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getImageUrl } from '../../utils/EmployeeHelper';
import LoadingSpinner from '../LoadingSpinner';

const Detail = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leave/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          setLeave(response.data.leave);
        }
      } catch (error) {
        console.error('Error fetching leave:', error);
        alert('Error fetching leave data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/leave/status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        setLeave({ ...leave, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
      alert('Error updating leave status');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!leave || !leave.employeeId?.userId) {
    return <div className="text-center py-4 text-gray-600">Employee not found or missing user data.</div>;
  }

  return (
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-8 text-center'>Leave Details</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <img
            src={getImageUrl(leave.employeeId.userId.profileImage)}
            alt='Profile'
            className='rounded-full border w-62'
            onError={(e) => {
              console.error('Image failed to load:', e);
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
        </div>

        <div>
          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold'>Employee ID:</p>
            <p className='font-medium'>{leave.employeeId.employeeid}</p>
          </div>

          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold'>Name:</p>
            <p className='font-medium'>{leave.employeeId.userId.name}</p>
          </div>

          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold'>Department:</p>
            <p className='font-medium'>{leave.employeeId.department?.dep_name}</p>
          </div>

          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold'>Start Date:</p>
            <p className='font-medium'>{new Date(leave.startDate).toLocaleDateString()}</p>
          </div>

          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold'>End Date:</p>
            <p className='font-medium'>{new Date(leave.endDate).toLocaleDateString()}</p>
          </div>

          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold'>Leave Type:</p>
            <p className='font-medium'>{leave.leaveType}</p>
          </div>

          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold'>Reason:</p>
            <p className='font-medium'>{leave.reason}</p>
          </div>

          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold'>
              {leave.status === "Pending" ? "Action:" : "Status:"}
            </p>
            {leave.status === "Pending" ? (
              <div className='flex space-x-3'>
                <button 
                  onClick={() => handleStatusUpdate("Approved")}
                  className='px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200'
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleStatusUpdate("Rejected")}
                  className='px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200'
                >
                  Reject
                </button>
              </div>
            ) : (
              <p className={`font-medium px-3 py-1 rounded-full text-sm ${
                leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {leave.status}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
