import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const ActivityTypeChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Enhanced color palette with better contrast and accessibility
  const COLORS = [
    '#2563eb', // Blue
    '#16a34a', // Green
    '#ea580c', // Orange
    '#7c3aed', // Purple
    '#db2777', // Pink
    '#0891b2', // Cyan
    '#854d0e'  // Brown
  ];

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

  // Custom label component with improved visibility
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null; // Don't show labels for small segments

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="font-semibold">{data.activity_type}</p>
          <p className="text-gray-600">Count: {data.total_activities}</p>
          <p className="text-gray-600">
            Percentage: {((data.total_activities / totalActivities) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            Error loading data: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-bold">Activity Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 p-4">
          {/* Left side: Table and Total */}
          <div className="w-full md:w-1/3">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-lg font-semibold text-blue-900">
                Total Activities: {totalActivities.toLocaleString()}
              </p>
            </div>
            
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="p-3 text-right text-sm font-semibold text-gray-900">Count</th>
                    <th className="p-3 text-right text-sm font-semibold text-gray-900">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((item, index) => (
                    <tr 
                      key={index}
                      className={`${
                        index === activeIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="p-3 text-sm">{item.activity_type}</td>
                      <td className="p-3 text-sm text-right">
                        {item.total_activities.toLocaleString()}
                      </td>
                      <td className="p-3 text-sm text-right">
                        {((item.total_activities / totalActivities) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right side: Enhanced Pie Chart */}
          <div className="w-full md:w-2/3">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="total_activities"
                  nameKey="activity_type"
                  label={renderCustomizedLabel}
                  onMouseEnter={onPieEnter}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  wrapperStyle={{
                    paddingLeft: "20px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTypeChart;