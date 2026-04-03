import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from 'recharts';
import { groupHourlyData } from '../../utils/helpers';

export const MultiMetricChart = ({ hourlyData, title, metrics, airQualityData }) => {
  // Use air quality data if provided for PM metrics, otherwise use regular hourly data
  let dataSource = hourlyData;
  
  // Special handling for air quality metrics
  if (metrics.some(m => m.key === 'pm10' || m.key === 'pm25') && airQualityData?.hourly) {
    dataSource = airQualityData.hourly;
  }
  
  if (!dataSource || !dataSource.time) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
        No data available for {title}
      </div>
    );
  }

  const groupedData = groupHourlyData(dataSource, 2);
  
  const chartData = groupedData.time.map((time, index) => {
    const dataPoint = { 
      time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    metrics.forEach(metric => {
      let value = groupedData[metric.dataKey]?.[index];
      
      // Handle potential undefined or null values
      if (value === undefined || value === null) {
        value = 0;
      }
      
      // Convert visibility from meters to kilometers for better readability
      if (metric.key === 'visibility') {
        value = value / 1000; // Convert to km
      }
      
      dataPoint[metric.key] = value;
    });
    
    return dataPoint;
  });

  // Check if data is constant (all values the same)
  const isConstantData = (data, key) => {
    const values = data.map(item => item[key]).filter(v => v !== undefined);
    if (values.length === 0) return false;
    const firstValue = values[0];
    return values.every(v => v === firstValue);
  };

  // Get min and max for Y axis
  const getYAxisDomain = (data, key) => {
    const values = data.map(item => item[key]).filter(v => v !== undefined);
    if (values.length === 0) return [0, 100];
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // If all values are the same, add padding
    if (min === max) {
      return [min * 0.9, max * 1.1];
    }
    
    return [min * 0.9, max * 1.1];
  };

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border max-w-xs">
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} className="text-sm" style={{ color: item.color }}>
              {item.name}: {typeof item.value === 'number' ? item.value.toFixed(1) : item.value} {item.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Check if all values are zero
  const hasNonZeroData = chartData.some(data => 
    metrics.some(metric => data[metric.key] > 0)
  );

  // Show special message for constant visibility data
  const isVisibilityConstant = metrics.some(m => m.key === 'visibility') && 
                               isConstantData(chartData, 'visibility');
  
  const isWindSpeedMetric = metrics.some(m => m.key === 'wind_speed');

  if (!hasNonZeroData && !isVisibilityConstant) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">📊</p>
            <p>No data available for selected date</p>
            <p className="text-xs mt-1">Try selecting a different date</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      
      {/* Show info message for constant visibility */}
      {isVisibilityConstant && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          ℹ️ Visibility is excellent and constant at {chartData[0]?.visibility?.toFixed(1)} km today
        </div>
      )}
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
              // Use dynamic domain for better visualization
              domain={isWindSpeedMetric ? [0, 'auto'] : ['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {metrics.map((metric, idx) => {
              // For constant visibility, use an area chart instead of line
              if (metric.key === 'visibility' && isVisibilityConstant) {
                return (
                  <Area
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    fill="#bfdbfe"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={0.3}
                    name={`${metric.name} (${metric.unit})`}
                  />
                );
              }
              
              return (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  name={`${metric.name} (${metric.unit})`}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Show statistics summary for better insights */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {metrics.map(metric => {
            const values = chartData.map(d => d[metric.key]).filter(v => v !== undefined);
            if (values.length === 0) return null;
            
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const max = Math.max(...values);
            const min = Math.min(...values);
            
            return (
              <div key={metric.key} className="bg-gray-50 p-2 rounded">
                <div className="font-medium text-gray-700">{metric.name}</div>
                <div className="flex justify-between mt-1">
                  <span>Min: {min.toFixed(1)}</span>
                  <span>Avg: {avg.toFixed(1)}</span>
                  <span>Max: {max.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};