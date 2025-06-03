import React, { useState, useEffect } from 'react';
import { fetchDepartment, getImageUrl, API_BASE_URL } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const Edit = () => {
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getDepartments = async () => {
      const res = await fetchDepartment();
      setDepartments(res);
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employee/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          const emp = response.data.employee;
          setEmployee(emp);
          
          // Set current image if it exists
          if (emp.userId?.profileImage) {
            setCurrentImage(getImageUrl(emp.userId.profileImage));
          }

          setFormData({
            name: emp.userId?.name || '',
            designation: emp.designation || '',
            salary: emp.salary || '',
            maritalStatus: emp.maritalStatus || '',
            department: emp.department?._id || '',
            image: null,
          });
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file');
          return;
        }
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size should be less than 5MB');
          return;
        }
        
        // Show preview of selected image
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setFormData((prevData) => ({
          ...prevData,
          [name]: file
        }));
        console.log('Image file selected:', {
          name: file.name,
          type: file.type,
          size: file.size
        });
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataObj = new FormData();
      
      // First append all non-file fields
      Object.keys(formData).forEach((key) => {
        if (key !== 'image') {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Then append the image file if it exists
      if (formData.image) {
        formDataObj.append('image', formData.image);
        console.log('Appending image file:', {
          name: formData.image.name,
          type: formData.image.type,
          size: formData.image.size
        });
      }

      console.log('Sending update request...');
      const response = await axios.put(
        `${API_BASE_URL}/api/employee/${id}`, 
        formDataObj,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log('Update response:', response.data);

      if (response.data.success) {
        // Clean up preview URL
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
        }
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      console.error('Error updating employee:', error.response || error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  if (loading || !employee || !departments || !formData) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center col-span-1 md:col-span-2">
        Edit Employee
      </h2>

      <div>
        <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Employee Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="maritalStatus" className="block mb-1 font-medium text-gray-700">Marital Status</label>
        <select
          name="maritalStatus"
          id="maritalStatus"
          onChange={handleChange}
          value={formData.maritalStatus}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>
      </div>

      <div>
        <label htmlFor="designation" className="block mb-1 font-medium text-gray-700">Designation</label>
        <input
          type="text"
          name="designation"
          id="designation"
          placeholder="Designation"
          onChange={handleChange}
          value={formData.designation}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label htmlFor="salary" className="block mb-1 font-medium text-gray-700">Salary</label>
        <input
          type="number"
          name="salary"
          id="salary"
          placeholder="Salary"
          onChange={handleChange}
          value={formData.salary}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="department" className="block mb-1 font-medium text-gray-700">Department</label>
        <select
          name="department"
          id="department"
          onChange={handleChange}
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

      <div>
        <label htmlFor="image" className="block mb-1 font-medium text-gray-700">Profile Image</label>
        <div className="mb-4">
          <img 
            src={previewImage || currentImage || 'https://via.placeholder.com/150'}
            alt="Profile Preview" 
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">
          Update Employee
        </button>
      </div>
    </form>
  );
};

export default Edit;
