import React, { useState, useEffect } from 'react';
import { fetchDepartment, getEmployees, API_BASE_URL } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    employeeId: '',
    basicSalary: '',
    allowance: '',
    deductions: '',
    payDate: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const res = await fetchDepartment();
      setDepartments(res);
    };
    getDepartments();
  }, []);

  const handleDepartment = async (e) => {
    const departmentId = e.target.value;
    setFormData({ ...formData, department: departmentId });
    const emps = await getEmployees(departmentId);
    setEmployees(emps);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create payload with all required fields
      const payload = {
        employeeId: formData.employeeId,
        department: formData.department,
        basicSalary: formData.basicSalary,
        allowance: formData.allowance,
        deductions: formData.deductions,
        payDate: formData.payDate
      };

      const response = await axios.post(`${API_BASE_URL}/api/salary/add`, payload, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        alert(response.data.message || "Salary added successfully");
        navigate("/admin-dashboard/employees");
      } else {
        alert(response.data.error || "Failed to add salary");
      }
    } catch (error) {
      console.error('Error submitting salary:', error.response?.data || error);
      alert(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center col-span-1 md:col-span-2">
        Add Salary
      </h2>

      {/* Department Dropdown */}
      <div>
        <label htmlFor="department" className="block mb-1 font-medium text-gray-700">Department</label>
        <select
          name="department"
          id="department"
          onChange={handleDepartment}
          value={formData.department}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select Department</option>
          {departments.map(dep => (
            <option key={dep._id} value={dep._id}>
              {dep.dep_name}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Dropdown */}
      <div>
        <label htmlFor="employeeId" className="block mb-1 font-medium text-gray-700">Employee</label>
        <select
          name="employeeId"
          id="employeeId"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
              {emp.employeeid} - {emp.userId?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Salary */}
      <div>
        <label htmlFor="basicSalary" className="block mb-1 font-medium text-gray-700">Basic Salary</label>
        <input
          type="number"
          name="basicSalary"
          id="basicSalary"
          placeholder="Basic Salary"
          onChange={handleChange}
          value={formData.basicSalary}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Allowances */}
      <div>
        <label htmlFor="allowance" className="block mb-1 font-medium text-gray-700">Allowances</label>
        <input
          type="number"
          name="allowance"
          id="allowance"
          placeholder="Allowances"
          onChange={handleChange}
          value={formData.allowance}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Deductions */}
      <div>
        <label htmlFor="deductions" className="block mb-1 font-medium text-gray-700">Deductions</label>
        <input
          type="number"
          name="deductions"
          id="deductions"
          placeholder="Deductions"
          onChange={handleChange}
          value={formData.deductions}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Pay Date */}
      <div>
        <label htmlFor="payDate" className="block mb-1 font-medium text-gray-700">Pay Date</label>
        <input
          type="date"
          name="payDate"
          id="payDate"
          onChange={handleChange}
          value={formData.payDate}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">
          Add Salary
        </button>
      </div>
    </form>
  );
};

export default Add;
