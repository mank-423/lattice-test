import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatTemperature, groupHourlyData } from '../../utils/helpers';

export const TemperatureChart = ({ hourlyData }) => {
  const [unit, setUnit] = useState('C');

  if (!hourlyData || !hourlyData.time) {
    return <div className="text-center py-8 text-gray-500">No temperature data available</div>;
  }

  // Prepare data for chart (show every 2 hours to avoid clutter on mobile)
  const groupedData = groupHourlyData(hourlyData, 2);
  
  const chartData = groupedData.time.map((time, index) => ({
    time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    temperature: groupedData.temperature_2m?.[index] || 0,
    originalTemp: groupedData.temperature_2m?.[index] || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-lg">
            {formatTemperature(payload[0].value, unit)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Temperature Trend</h3>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              label={{ 
                value: `Temperature (°${unit})`, 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 11 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name={`Temperature (°${unit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};