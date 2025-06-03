import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper'
import axios from 'axios'
import LoadingSpinner from '../LoadingSpinner'

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setdepLoading] = useState(false);
  const [filteredDepartments, setfilteredDepartments] = useState([]);

  const fetchDepartment = async () => {
    setdepLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/department', {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.departments.map((dep) => ({
          _id: dep._id,
          sno: sno++,
          dep_name: dep.dep_name,
          action: (<DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete} />)
        }));
        setDepartments(data);
        setfilteredDepartments(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setdepLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const onDepartmentDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/department/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        fetchDepartment(); // Re-fetch fresh data
      }
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

 
  const filterDepartments = (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const records = departments.filter(dep =>
      dep.dep_name.toLowerCase().includes(searchTerm)
    );
    setfilteredDepartments(records);
  };

  // 🖼️ UI Return
  if (depLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className='p-6 bg-gray-50 shadow-lg rounded-lg'>
        <div className='text-center mb-6'>
          <h3 className='text-3xl font-bold text-gray-800'>Manage Departments</h3>
        </div>

        <div className='flex justify-between items-center mb-4'>
          <input 
            type="text" 
            placeholder='Search by Dep Name' 
            className='px-4 py-2 w-60 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
            onChange={filterDepartments} 
          />
          <Link 
            to="/admin-dashboard/add-department" 
            className='px-6 py-2 bg-teal-600 rounded-lg text-white font-medium shadow-md hover:bg-teal-700 transition duration-300'
          >
            Add New Department
          </Link>
        </div>

        <div className='overflow-x-auto'>
          <DataTable 
            columns={columns} 
            data={filteredDepartments} 
            pagination 
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#F3F4F6',
                  fontWeight: 'bold',
                  color: '#111827', 
                  fontSize: '14px'
                }
              },
              cells: {
                style: {
                  padding: '12px',
                  borderBottom: '1px solid #E5E7EB', 
                  fontSize: '14px'
                }
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DepartmentList;
