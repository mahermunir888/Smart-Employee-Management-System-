import React from 'react'
import SummaryCard from './SummaryCard'
import SalaryChart from './SalaryChart' 
import AttendanceChart from './AttendanceChart'
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers
} from 'react-icons/fa'

const AdminSummary = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Dashboard Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard icon={<FaUsers className="text-white text-3xl" />} text="Total Employees" number={12} color="bg-teal-600" />
        <SummaryCard icon={<FaBuilding className="text-white text-3xl" />} text="Total Departments" number={5} color="bg-yellow-500" />
        <SummaryCard icon={<FaMoneyBillWave className="text-white text-3xl" />} text="Monthly Salary" number="Rs: 150,000" color="bg-red-500" />
      </div>

      <div className="mt-16">
        <h4 className="text-2xl font-bold text-gray-700 text-center mb-8">Leave Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard icon={<FaFileAlt className="text-white text-2xl" />} text="Leave Applied" number={5} color="bg-blue-500" />
          <SummaryCard icon={<FaCheckCircle className="text-white text-2xl" />} text="Leave Approved" number={2} color="bg-green-500" />
          <SummaryCard icon={<FaHourglassHalf className="text-white text-2xl" />} text="Leave Pending" number={4} color="bg-yellow-500" />
          <SummaryCard icon={<FaTimesCircle className="text-white text-2xl" />} text="Leave Rejected" number={1} color="bg-red-500" />
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
          <h5 className="text-xl font-semibold text-gray-700 mb-4 text-center">Daily Attendance Overview</h5>
          <AttendanceChart />
          <h5 className="text-xl font-semibold text-gray-700 mb-4 text-center">Monthly Salary Overview</h5>
          <SalaryChart /> 
        </div>
      </div>
    </div>
  )
}

export default AdminSummary
