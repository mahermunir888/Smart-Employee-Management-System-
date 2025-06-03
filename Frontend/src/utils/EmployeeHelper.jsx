import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaDollarSign, FaCalendarAlt, FaEye, FaEllipsisV } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

// Base URL for the backend
export const API_BASE_URL = 'http://localhost:5000';

// Utility function to get image URL
export const getImageUrl = (filename) => {
  if (!filename) return 'https://via.placeholder.com/150';
  const imageUrl = `${API_BASE_URL}/uploads/${filename}`;
  console.log('Generated image URL:', imageUrl);
  return imageUrl;
};

const ActionMenu = ({ id, userId, onDelete }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/employee/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          alert('Employee deleted successfully');
          if (onDelete) {
            await onDelete(id);
          }
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert(error?.response?.data?.error || "Error deleting employee");
      }
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!showDropdown) {
      // Calculate position when opening
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const spaceAbove = buttonRect.top;
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        setDropdownPosition(spaceBelow > 150 ? 'bottom' : 'top');
      }
    }
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <button
        className="flex items-center gap-1 px-2 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition"
        onClick={()=> navigate(`/admin-dashboard/employees/salary/${id}`)}
      >
        <FaDollarSign size={14} />
        Salary
      </button>

      <button
        className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
        onClick={()=> navigate(`/admin-dashboard/employees/leaves/${userId}`)}
      >
        <FaCalendarAlt size={14} />
        Leave
      </button>

      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <FaEllipsisV className="w-5 h-5 text-gray-500" />
        </button>

        {showDropdown && (
          <div 
            className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 z-[100] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            style={{ 
              minWidth: '160px',
              maxHeight: '200px'
            }}
          >
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin-dashboard/employees/${id}`);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaEye className="mr-3 text-teal-600" />
                View Details
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin-dashboard/employees/edit/${id}`);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaEdit className="mr-3 text-blue-600" />
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaTrash className="mr-3 text-red-600" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "80px",
    center: true
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "100px",
    center: true
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "150px"
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "150px",
    center: true
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "150px",
    center: true
  },
  {
    name: "Action",
    cell: (row) => <ActionMenu id={row._id} userId={row.userId} onDelete={row.onDelete} />,
    width: "300px",
    center: true,
    style: {
      overflow: 'visible'
    }
  }
];

export const fetchDepartment = async () => {
  let departments

  try {
    const response = await axios.get('http://localhost:5000/api/department', {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.success) {
      departments = response.data.departments
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  } 
  return departments
};

// employees for salary form

export const getEmployees = async (id) => {
  let employees;

  try {
    const response = await axios.get(`http://localhost:5000/api/employee/department/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.success) {
      employees = response.data.employees
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  } 
  return employees
};

export const EmployeeButtons = ({ id, onDelete }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const menuRef = useRef(null);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/employee/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          alert('Employee deleted successfully');
          if (onDelete) {
            await onDelete(id);
          }
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert(error?.response?.data?.error || "Error deleting employee");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <FaEllipsisV className="w-5 h-5 text-gray-500" />
      </button>

      {showDropdown && (
        <div 
          className="absolute right-0 z-50 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
          style={{ minWidth: '160px' }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                navigate(`/admin-dashboard/employees/${id}`);
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaEye className="mr-3 text-teal-600" />
              View Details
            </button>

            <button
              onClick={() => {
                navigate(`/admin-dashboard/employees/edit/${id}`);
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaEdit className="mr-3 text-blue-600" />
              Edit
            </button>

            <button
              onClick={() => {
                handleDelete();
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaTrash className="mr-3 text-red-600" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};