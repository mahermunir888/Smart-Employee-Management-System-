import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { columns, EmployeeButtons, getImageUrl } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const handleDelete = async (deletedId) => {
    try {
      // First remove from local state for immediate UI feedback
      setEmployees(employees.filter(emp => emp._id !== deletedId));
      setFilteredEmployees(filteredEmployees.filter(emp => emp._id !== deletedId));
      
      // Then fetch fresh data from server
      await fetchEmployees();
    } catch (error) {
      console.error("Error handling delete:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = employees.filter(emp => 
      emp.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const fetchEmployees = async () => {
    setEmpLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/employee', {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("Response received:", response.data);

      if (response.data.success) {
        let sno = 1;
        const data = response.data.employees.map((emp) => ({
          _id: emp._id,
          userId: emp.userId?._id,
          sno: sno++,
          designation: emp.designation || "N/A",
          dep_name: emp.department?.dep_name || "N/A",
          name: emp.userId?.name || "N/A",
          dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : "N/A",
          profileImage: (
            <img
              src={getImageUrl(emp.userId?.profileImage)}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          ),
          onDelete: handleDelete // Pass the delete handler directly
        }));
        setEmployees(data);
        setFilteredEmployees(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert(error?.response?.data?.error || "Unknown error");
    } finally {
      setEmpLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect is running...");
    fetchEmployees();
  }, []);

  if (empLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='p-6 max-w-[1400px] mx-auto'>
      <div className='text-center mb-6'>
        <h3 className='text-3xl font-bold text-gray-800'>Manage Employee</h3>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder='Search by Emp Name'
          className='px-4 py-2 w-60 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
        />
        <Link
          to="/admin-dashboard/add-employee"
          className='px-6 py-2 bg-teal-600 rounded-lg text-white font-medium shadow-md hover:bg-teal-700 transition duration-300'
        >
          Add New Employee
        </Link>
      </div>

      <div className='overflow-x-auto shadow-md rounded-lg'>
        <DataTable
          columns={columns}
          data={filteredEmployees}
          pagination
          paginationPerPage={25}
          paginationRowsPerPageOptions={[25, 50, 100]}
          progressPending={empLoading}
          noDataComponent={
            <div className="p-4 text-center text-gray-600">
              {searchTerm ? "No matching employees found" : "No employees available"}
            </div>
          }
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
                fontSize: '14px'
              }
            },
            table: {
              style: {
                minWidth: '100%'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default List;
