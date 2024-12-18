'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

const data = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  registeredUsers: Math.floor(Math.random() * 8),
  uniqueUsers: Math.floor(Math.random() * 3),
}))

export function MonthlyUsersChart() {
  return (
    <div className="rounded-lg border ">
      <div className="bg-[#20B2AA] p-4 text-white">
        <h2 className="text-lg font-semibold">
          Monthly Registered Users & Unique Users Orders
        </h2>
      </div>
      <div className="p-4" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              type="number"
              domain={[1, 30]}
              ticks={Array.from({ length: 30 }, (_, i) => i + 1)}
            />
            <YAxis domain={[0, 8]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="registeredUsers"
              stroke="#2196F3"
              name="Registered Users"
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="uniqueUsers"
              stroke="#9E9E9E"
              name="Unique Users Orders"
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
