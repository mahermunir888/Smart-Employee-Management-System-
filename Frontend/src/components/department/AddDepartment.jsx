import axios from 'axios'
import React, { useState } from 'react'
import { FaAudioDescription } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AddDepartment = () => {
    const [department, setdepartment] = useState({ dep_name: '', description: '' })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setdepartment({ ...department, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/api/department/add', department, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                navigate("/admin-dashboard/departments")
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg w-full">
            <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Add New Department</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="dep_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Department Name
                    </label>
                    <input
                        type="text"
                        name="dep_name"
                        onChange={handleChange}
                        placeholder="Enter Department Name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition duration-300"
                >
                    Add Department
                </button>
            </form>
        </div>
    )
}

export default AddDepartment
