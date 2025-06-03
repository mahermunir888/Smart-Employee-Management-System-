import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', salary: 140000 },
  { name: 'Feb', salary: 150000 },
  { name: 'Mar', salary: 145000 },
  { name: 'Apr', salary: 150000 },
  { name: 'May', salary: 155000 },
  { name: 'Jun', salary: 158000 },
]

const SalaryBarChart = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `Rs: ${value.toLocaleString()}`} />
          <Bar dataKey="salary" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalaryBarChart
