import React, { useEffect, useState } from 'react';
import { LeaveButtons } from '../../utils/LeaveHelper';
import DataTable from 'react-data-table-component';
import { columns } from '../../utils/LeaveHelper';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

const Table = () => {
    const [leaves, setLeaves] = useState(null);
    const [filteredLeaves, setFilteredLeaves] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/leave', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("Response received:", response.data);

            if (response.data.success) {
                let sno = 1;
                const data = response.data.leaves.map((leave) => ({
                    _id: leave._id,
                    sno: sno++,
                    employeeId: leave.employeeId?.employeeid || "N/A",
                    name: leave.employeeId?.userId?.name || "N/A",
                    leaveType: leave.leaveType,
                    department: leave.employeeId?.department?.dep_name || "N/A",
                    days: Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)),
                    status: leave.status || "Pending",
                    action: (<LeaveButtons Id={leave._id} />),
                }));
                setLeaves(data);
                setFilteredLeaves(data);
            }
        } catch (error) {
            console.error("Error fetching leaves:", error);
            alert(error?.response?.data?.error || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        let filtered = leaves;
        if (value) {
            filtered = leaves.filter(leave =>
                leave.name.toLowerCase().includes(value.toLowerCase()) ||
                leave.employeeId.toString().includes(value)
            );
        }

        if (activeFilter !== 'All') {
            filtered = filtered.filter(leave => leave.status === activeFilter);
        }

        setFilteredLeaves(filtered);
    };

    const handleStatusFilter = (status) => {
        setActiveFilter(status);
        let filtered = leaves;

        if (status !== 'All') {
            filtered = leaves.filter(leave => leave.status === status);
        }

        if (searchTerm) {
            filtered = filtered.filter(leave =>
                leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leave.employeeId.toString().includes(searchTerm)
            );
        }

        setFilteredLeaves(filtered);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div className='p-6'>
                <div className='text-center mb-6'>
                    <h3 className='text-2xl font-bold text-gray-800'>Manage Leaves</h3>
                </div>
                <div className='flex justify-between items-center mb-4'>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder='Search by Employee Name' 
                        className='px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500' 
                    />
                    <div className='space-x-3'>
                        <button 
                            onClick={() => handleStatusFilter('All')}
                            className={`px-4 py-1 rounded transition-colors duration-200 ${
                                activeFilter === 'All' 
                                ? 'bg-gray-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('Pending')}
                            className={`px-4 py-1 rounded transition-colors duration-200 ${
                                activeFilter === 'Pending' 
                                ? 'bg-yellow-600 text-white' 
                                : 'bg-yellow-400 text-yellow-700 hover:bg-yellow-500'
                            }`}
                        >
                            Pending
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('Approved')}
                            className={`px-4 py-1 rounded transition-colors duration-200 ${
                                activeFilter === 'Approved' 
                                ? 'bg-teal-600 text-white' 
                                : 'bg-teal-500 text-teal-700 hover:bg-teal-600'
                            }`}
                        >
                            Approved
                        </button>
                        <button 
                            onClick={() => handleStatusFilter('Rejected')}
                            className={`px-4 py-1 rounded transition-colors duration-200 ${
                                activeFilter === 'Rejected' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-red-300 text-red-700 hover:bg-red-400'
                            }`}
                        >
                            Rejected
                        </button>
                    </div>
                </div>

                <DataTable 
                    columns={columns} 
                    data={filteredLeaves || []} 
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
                                fontSize: '14px'
                            }
                        }
                    }}
                    noDataComponent={
                        <div className="text-center py-4 text-gray-600">
                            No leaves found
                        </div>
                    }
                />
            </div>
        </>
    );
};

export default Table;
