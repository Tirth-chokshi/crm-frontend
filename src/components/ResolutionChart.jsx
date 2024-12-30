"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from "lucide-react";
import DatePicker from './ui/DatePIcker';
import { addDays, format, parseISO, eachDayOfInterval, isSameDay } from 'date-fns';

const CaseStatusChart = () => {
  const [data, setData] = useState([]);
  const [dateFrom, setDateFrom] = useState(addDays(new Date(), -7));
  const [dateTo, setDateTo] = useState(new Date());
  const [trend, setTrend] = useState({ percentage: 0, isUp: true });

  const generateDateRange = (startDate, endDate) => {
    return eachDayOfInterval({ start: startDate, end: endDate })
      .map(date => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
  };

  const fillMissingDates = (apiData, allDates) => {
    return allDates.map(date => {
      const existingData = apiData.find(item => 
        isSameDay(parseISO(item.date), parseISO(date))
      );
      
      return {
        date,
        resolved_cases: existingData ? parseInt(existingData.resolved_cases) : 0,
        remaining_cases: existingData ? parseInt(existingData.remaining_cases) : 0
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/analytics/caseresolution');
        const apiData = await response.json();
        
        const allDates = generateDateRange(dateFrom, dateTo);
        const completeData = fillMissingDates(apiData, allDates);
        
        // Calculate trend
        if (completeData.length >= 2) {
          const latest = completeData[completeData.length - 1].resolved_cases;
          const previous = completeData[completeData.length - 2].resolved_cases;
          const percentageChange = ((latest - previous) / previous) * 100;
          setTrend({
            percentage: Math.abs(percentageChange).toFixed(1),
            isUp: percentageChange > 0
          });
        }
        
        setData(completeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dateFrom, dateTo]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Resolution Status</CardTitle>
            <CardDescription>
              {format(dateFrom, 'MMMM d')} - {format(dateTo, 'MMMM d, yyyy')}
            </CardDescription>
          </div>
          <div className="flex space-x-4">
            <DatePicker date={dateFrom} setDate={setDateFrom} />
            <DatePicker date={dateTo} setDate={setDateTo} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 'auto']}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].name}
                          </span>
                          <span className="font-bold">
                            {payload[0].value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[1].name}
                          </span>
                          <span className="font-bold">
                            {payload[1].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="resolved_cases"
                stroke="#50e32b"
                strokeWidth={2}
                dot={false}
                name="Resolved Activities"
              />
              <Line
                type="monotone"
                dataKey="remaining_cases"
                stroke="#fa0011"
                strokeWidth={2}
                dot={false}
                name="Remaining Activities"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#50e32b' }}></div>
            <span className="text-sm text-muted-foreground">Resolved Activities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#fa0011' }}></div>
            <span className="text-sm text-muted-foreground">Remaining Activities</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CaseStatusChart;