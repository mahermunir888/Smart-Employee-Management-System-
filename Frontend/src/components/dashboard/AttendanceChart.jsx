import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Present', value: 8 },
  { name: 'Absent', value: 2 },
  { name: 'On Leave', value: 2 },
]

const COLORS = ['#10b981', '#f97316', '#3b82f6'] // green, orange, blue

const EmployeeAttendanceChart = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EmployeeAttendanceChart
