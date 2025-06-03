import React from 'react'
import logo from '../Logo2.png'
import { NavLink } from 'react-router-dom'
import { FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillWave, FaTachometerAlt, FaUsers, FaClipboardList } from 'react-icons/fa';

function AdminSidebar() {
    return (
        <div className='bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
            <div className='bg-teal-600 flex items-center justify-center h-15'>
                <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
                <h3 className='text-2xl text-center font-serif'> Employees MS</h3>
            </div>
            <div className='px-4'>
                <NavLink
                    to="/admin-dashboard"
                    className={({ isActive }) =>
                        `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
                    } end >
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/admin-dashboard/employees" className={({ isActive }) =>
                        `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
                    } >
                    <FaUsers />
                    <span>Employee</span>
                </NavLink>

                <NavLink to="/admin-dashboard/departments" className={({ isActive }) =>
                        `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
                    } >
                    <FaBuilding />
                    <span>Department</span>
                </NavLink>

                <NavLink to="/admin-dashboard/attendance-records" className={({ isActive }) =>
                        `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
                    }>
                    <FaClipboardList className="text-xl" />
                    <span>Attendance</span>
                </NavLink>

                <NavLink to="/admin-dashboard/leaves" className={({ isActive }) =>
                        `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
                    }>
                    <FaCalendarAlt />
                    <span>Leave</span>
                </NavLink>

                <NavLink to="/admin-dashboard/salary/add" className={({ isActive }) =>
                        `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
                    }>
                    <FaMoneyBillWave />
                    <span>Salary</span>
                </NavLink>

                

                <NavLink to="/admin-dashboard/setting" className={({ isActive }) =>
                        `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`
                    }>
                    <FaCogs />
                    <span>Setting</span>
                </NavLink>
            </div>
        </div>
    )
}

export default AdminSidebar
