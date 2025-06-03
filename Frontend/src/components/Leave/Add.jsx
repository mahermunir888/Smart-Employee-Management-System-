import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';
import axios from 'axios';

const Add = () => {
  const { user } = useAuth();
  const [leave, setLeave] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/leave/add`,
        leave,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        navigate('/employee-dashboard/leaves');
      }
    } catch (error) {
      console.error("Error adding leave:", error.response?.data || error.message);
      alert("Error submitting leave request");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Request for Leave</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Leave Type</label>
          <select
            name="leaveType" 
            value={leave.leaveType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">Select Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
        </div>

        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label className="block mb-2 font-medium text-gray-700">From Date</label>
            <input
              name="startDate"
              value={leave.startDate}
              onChange={handleChange}
              required
              type="date"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-2 font-medium text-gray-700">To Date</label>
            <input
              name="endDate"
              value={leave.endDate}
              onChange={handleChange}
              required
              type="date"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Description</label>
          <textarea
            name="reason"
            value={leave.reason}
            onChange={handleChange}
            required
            rows="3"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Reason"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white w-full py-2 rounded hover:bg-teal-700 transition duration-200"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default Add;
