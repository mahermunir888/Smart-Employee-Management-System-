import React, { useState, useEffect } from 'react';
import { fetchDepartment } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const res = await fetchDepartment();
      setDepartments(res);
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0]
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        'http://localhost:5000/api/employee/add',
        formDataObj,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && error.response.data && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center col-span-1 md:col-span-2">
        Add New Employee
      </h2>

      <div>
  <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Employee Name</label>
  <input type="text" name="name" id="name" placeholder="Employee Name" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
</div>

<div>
  <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Employee Email</label>
  <input type="email" name="email" id="email" placeholder="Employee Email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
</div>

<div>
  <label htmlFor="employeeId" className="block mb-1 font-medium text-gray-700">Employee ID</label>
  <input type="text" name="employeeId" id="employeeId" placeholder="Employee ID" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
</div>

<div>
  <label htmlFor="dob" className="block mb-1 font-medium text-gray-700">Date of Birth</label>
  <input type="date" name="dob" id="dob" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
</div>

<div>
  <label htmlFor="gender" className="block mb-1 font-medium text-gray-700">Gender</label>
  <select name="gender" id="gender" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required>
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>

<div>
  <label htmlFor="maritalStatus" className="block mb-1 font-medium text-gray-700">Marital Status</label>
  <select name="maritalStatus" id="maritalStatus" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required>
    <option value="">Select Status</option>
    <option value="Single">Single</option>
    <option value="Married">Married</option>
  </select>
</div>

<div>
  <label htmlFor="designation" className="block mb-1 font-medium text-gray-700">Designation</label>
  <input type="text" name="designation" id="designation" placeholder="Designation" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
</div>

<div>
  <label htmlFor="department" className="block mb-1 font-medium text-gray-700">Department</label>
  <select name="department" id="department" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required>
    <option value="">Select Department</option>
    {departments.map(dep => (
      <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
    ))}
  </select>
</div>

<div>
  <label htmlFor="salary" className="block mb-1 font-medium text-gray-700">Salary</label>
  <input type="number" name="salary" id="salary" placeholder="Salary" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
</div>

<div>
  <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
  <input type="password" name="password" id="password" placeholder="******" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
</div>

<div>
  <label htmlFor="role" className="block mb-1 font-medium text-gray-700">Role</label>
  <select name="role" id="role" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required>
    <option value="">Select Role</option>
    <option value="Employee">Employee</option>
    <option value="Admin">Admin</option>
  </select>
</div>

<div>
  <label htmlFor="image" className="block mb-1 font-medium text-gray-700">Profile Image</label>
  <input type="file" name="image" id="image" onChange={handleChange} className="w-full px-4 py-1 border rounded-lg" />
</div>

<div className="col-span-1 md:col-span-2">
  <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">
    Add Employee
  </button>
</div>

    </form>
  );
};

export default Add;
