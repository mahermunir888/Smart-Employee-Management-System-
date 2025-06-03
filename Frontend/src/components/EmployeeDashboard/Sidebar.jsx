import React from 'react'
import logo from '../Logo2.png'
import { NavLink } from 'react-router-dom'
import { FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillWave, FaTachometerAlt, FaUsers, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../../context/authcontext';

function Sidebar() {
  const {user} = useAuth();

  return (
    <div className='bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
      <div className='bg-teal-600 flex items-center justify-center h-15'>
        <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        <h3 className='text-2xl text-center font-serif'> Employees MS</h3>
      </div>
      <div className='px-4'>
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
          } end >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to={`/employee-dashboard/profile/${user._id}`} className={({ isActive }) =>
          `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
        } >
          <FaUsers />
          <span>My Profile</span>
        </NavLink>

        <NavLink to="/employee-dashboard/leaves" className={({ isActive }) =>
          `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
        } >
          <FaCalendarAlt />
          <span>Leaves</span>
        </NavLink>

        <NavLink to={`/employee-dashboard/salary/${user._id}`} className={({ isActive }) =>
          `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
        }>
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>

        <NavLink to="/employee-dashboard/attendance/qr-code" className={({ isActive }) =>
          `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
        }>
          <FaQrcode />
          <span>My QR Code</span>
        </NavLink>

        <NavLink to="/employee-dashboard/setting" className={({ isActive }) =>
          `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
        }>
          <FaCogs />
          <span>Setting</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
