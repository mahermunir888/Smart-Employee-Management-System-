import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import LoadingSpinner from '../LoadingSpinner';

const View = () => {
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  let sno = 1;

  
  const isEmployeeDashboard = location.pathname.includes('/employee-dashboard');

  useEffect(() => {
    fetchSalaries();
  }, [id]);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/salary/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
      alert(error.response?.data?.error || "Failed to fetch salary records.");
    } finally {
      setLoading(false);
    }
  };

  const filterSalaries = (query) => {
    if (!salaries) return;
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId?.employeeid
        ?.toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-auto p-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Salary History</h2>
      </div>

      {!isEmployeeDashboard && (
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search By Emp ID"
            className="border px-4 py-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) => filterSalaries(e.target.value)}
          />
        </div>
      )}

      {filteredSalaries && filteredSalaries.length > 0 ? (
        <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 mt-12">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SNO</th>
                {!isEmployeeDashboard && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp ID</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Allowance</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pay Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSalaries.map((salary) => (
                <tr key={salary._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sno++}</td>
                  {!isEmployeeDashboard && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {salary.employeeId?.employeeid || "N/A"}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{salary.basicSalary?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{salary.allowance?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{salary.deductions?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{salary.netSalary?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(salary.payDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">No salary records found</div>
      )}
    </div>
  );
};

export default View;
