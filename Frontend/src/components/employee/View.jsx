import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getImageUrl } from '../../utils/EmployeeHelper';
import LoadingSpinner from '../LoadingSpinner';

const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employee/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        alert("Error fetching employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!employee || !employee.userId) {
    return <p>Employee not found or missing user data.</p>;
  }

  return (
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      
      <h2 className='text-2xl font-bold mb-8 text-center'>Employee Details</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div>
      <img
        src={getImageUrl(employee.userId.profileImage)}
        alt="Profile"
        className="rounded-full border w-62"
        onError={(e) => {
          console.error('Image failed to load:', e);
          e.target.src = 'https://via.placeholder.com/150';
        }}
      />
      </div>
      
      <div>

         <div className='flex space-x-3 mb-5'>
       <p className='text-lg font-bold'>Employee ID:</p>
       <p className='font-medium'>{employee.employeeid}</p>
      </div>
      
      <div className='flex space-x-3 mb-5'>
       <p className='text-lg font-bold'>Name:</p>
       <p className='font-medium'>{employee.userId.name}</p>
      </div>

      <div className='flex space-x-3 mb-5'>
       <p className='text-lg font-bold'>Department:</p>
       <p className='font-medium'>{employee.department.dep_name}</p>
      </div>

      <div className='flex space-x-3 mb-5'>
       <p className='text-lg font-bold'>Designation:</p>
       <p className='font-medium'>{employee.designation}</p>
      </div>

      <div className='flex space-x-3 mb-5'>
       <p className='text-lg font-bold'>Date of Birth:</p>
       <p className='font-medium'>{new Date(employee.dob).toLocaleDateString()}</p>
      </div>

      <div className='flex space-x-3 mb-5'>
       <p className='text-lg font-bold'>Gender:</p>
       <p className='font-medium'>{employee.gender}</p>
      </div>

      <div className='flex space-x-3 mb-5'>
       <p className='text-lg font-bold'>Marital Status:</p>
       <p className='font-medium'>{employee.maritalStatus}</p>
      </div>
      </div>
      </div>
    </div>
  );
};

export default View;
