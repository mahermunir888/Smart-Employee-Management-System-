import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authcontext';
import LoadingSpinner from '../LoadingSpinner';

const List = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  let sno = 1;
  const { id } = useParams();
  const userId = id || user._id;
  const location = useLocation();
  const isEmployeeDashboard = location.pathname.includes('employee-dashboard');

  useEffect(() => {
    fetchLeaves();
  }, [userId]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      console.log("Fetching leaves for userId:", userId);
      const response = await axios.get(`http://localhost:5000/api/leave/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        console.log("Leaves data received:", response.data);
        setLeaves(response.data.leaves);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      console.error("Error response:", error.response);
      alert(error.response?.data?.error || "Failed to fetch leaves records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-gray-800'>
          {isEmployeeDashboard ? 'Manage Leaves' : 'Employee Leave Records'}
        </h3>
      </div>
      
      {isEmployeeDashboard && (
        <div className='flex justify-end mb-4'>
          <Link 
            to="/employee-dashboard/add-leave" 
            className="px-4 py-2 bg-teal-600 rounded text-white hover:bg-teal-700 transition duration-300"
          >
            Add New Leave
          </Link>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : leaves.length === 0 ? (
        <div className="text-center py-4 text-gray-600">No leave records found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mt-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">SNO</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">From</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">To</th>
                <th className="px-10 py-3 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{sno++}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{leave.leaveType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{leave.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default List;
