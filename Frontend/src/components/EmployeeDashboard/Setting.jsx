import React, { useState } from 'react';
import { useAuth } from '../../context/authcontext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Setting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [setting, setSetting] = useState({
    userId: user._id,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);

  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (setting.newPassword !== setting.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/setting/change-password',
        setting,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        alert("Your Password Successfully Updated")
        setError(null);
        navigate('/login');
      }
    } catch (error) {
      setError(
        error?.response?.data?.error || 'Something went wrong. Please try again.'
      );
    }
  };

  const renderPasswordField = (label, name, isVisible) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          name={name}
          value={setting[name]}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <span
          onClick={() => toggleVisibility(name)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
        >
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Change Password</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderPasswordField('Current Password', 'currentPassword', visibility.currentPassword)}
          {renderPasswordField('New Password', 'newPassword', visibility.newPassword)}
          {renderPasswordField('Confirm New Password', 'confirmPassword', visibility.confirmPassword)}

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
