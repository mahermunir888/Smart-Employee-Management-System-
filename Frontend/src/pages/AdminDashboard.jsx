import React, { useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/Navbar';
import AdminSummary from '../components/dashboard/AdminSummary';
import SalaryChart from '../components/dashboard/SalaryChart';
import SummaryCard from '../components/EmployeeDashboard/Summary';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate('/login');
    }
  }, [navigate]);


  return (
    <div className='flex'>

      <AdminSidebar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard;
