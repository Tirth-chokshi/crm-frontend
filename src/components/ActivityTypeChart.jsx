"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useEffect, useState } from "react";

export default function ActivityTypeChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchActivityTypeData = async () => {
      try {
        const res = await fetch('http://localhost:8000/analytics/activitytype');
        if (!res.ok) {
          throw new Error('Failed to fetch activity type data');
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching activity type data:', err);
      }
    };

    fetchActivityTypeData();
  }, []);

  const totalActivities = data.reduce((sum, item) => sum + item.total_activities, 0);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error loading data: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side: Table and Total */}
          <div className="w-full md:w-1/3">
            <div className="mb-4">
            <div className="mt-4 p-3">
                <p className="font-semibold mb-4">Total Activities: {totalActivities}</p>
              </div>
              <h3 className="text-lg mt-2 from-neutral-300 mb-2">Activity Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-right">Count</th>
                      <th className="border p-2 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.activity_type}</td>
                        <td className="border p-2 text-right">{item.total_activities}</td>
                        <td className="border p-2 text-right">
                          {((item.total_activities / totalActivities) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             
            </div>
          </div>

          {/* Right side: Pie Chart */}
          <div className="w-full md:w-2/3">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="total_activities"
                  nameKey="activity_type"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}