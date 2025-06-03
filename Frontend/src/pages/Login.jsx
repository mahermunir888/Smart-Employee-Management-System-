import React, { useState } from 'react';
import bgImage from '../images/bg-image.jpg';
import logo from '../images/Logo.Jpeg';
import { useAuth } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });

      if (response.data.success) {
        login(response.data.user)
        localStorage.setItem("token", response.data.token)
        if (response.data.user.role === "Admin") {
          navigate('/admin-dashboard')
        }
        else{ 
          navigate("/employee-dashboard")
        }
      }

    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error)
      }
      else { setError("server error") }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Employee Management System
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-700">Login</h3>
          {error && < p className='text-red-500'>{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 mr-2" />
              Remember Me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
