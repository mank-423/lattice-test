import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeoLocation';
import { weatherAPI } from '../services/weatherAPI';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { MapPin, Calendar, Loader, AlertCircle, Info } from 'lucide-react';
import { formatTime } from '../utils/helpers';

export const HistoricalAnalysisPage = () => {
  const { latitude, longitude, loading: locationLoading, city } = useGeolocation();
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxStartDate = new Date();
  maxStartDate.setFullYear(maxStartDate.getFullYear() - 2);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!latitude || !longitude) return;
      
      // Validate date range
      const timeDiff = endDate - startDate;
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      if (daysDiff > 730) {
        setError('Date range cannot exceed 2 years');
        return;
      }
      
      if (daysDiff < 0) {
        setError('End date must be after start date');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];
        
        const data = await weatherAPI.getHistoricalData(latitude, longitude, startStr, endStr);
        
        // Check if we have daily data
        if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
          setError('No historical data available for this date range. Try a different range.');
          setHistoricalData(null);
        } else {
          setHistoricalData(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch historical data. Please try a different date range.');
        setHistoricalData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [latitude, longitude, startDate, endDate]);

  const handleStartDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setStartDate(newDate);
  };

  const handleEndDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setEndDate(newDate);
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  // Prepare chart data safely
  const prepareChartData = () => {
    if (!historicalData?.daily?.time) return [];
    
    const daily = historicalData.daily;
    return daily.time.map((time, index) => ({
      date: new Date(time).toLocaleDateString(),
      tempMax: daily.temperature_2m_max?.[index],
      tempMin: daily.temperature_2m_min?.[index],
      tempMean: daily.temperature_2m_mean?.[index],
      precipitation: daily.precipitation_sum?.[index],
      windSpeed: daily.wind_speed_10m_max?.[index],
      windDirection: daily.wind_direction_10m_dominant?.[index],
      sunrise: daily.sunrise?.[index],
      sunset: daily.sunset?.[index]
    }));
  };

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <MapPin size={18} />
            <span className="text-sm">{city || 'Your Location'}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Historical Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-1">Analyze trends up to 2 years back</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Date Range Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-green-500" />
              <span className="font-medium">Date Range (Max 2 years):</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate.toISOString().split('T')[0]}
                  onChange={handleStartDateChange}
                  min={maxStartDate.toISOString().split('T')[0]}
                  max={endDate.toISOString().split('T')[0]}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate.toISOString().split('T')[0]}
                  onChange={handleEndDateChange}
                  min={startDate.toISOString().split('T')[0]}
                  max={new Date().toISOString().split('T')[0]}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm block">{error}</span>
                <span className="text-xs text-red-600 mt-1 block">
                  Tip: Try selecting a more recent date range or reduce the number of days
                </span>
              </div>
            </div>
          )}
          
          {/* Info Message */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2 text-blue-700">
            <Info size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm block">Historical Data Availability</span>
              <span className="text-xs text-blue-600 mt-1 block">
                Open-Meteo provides historical weather data. For best results, select a date range within the last 30-60 days.
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Loader className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">Analyzing historical data...</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && !historicalData && !error && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600">Select a date range to view historical weather trends</p>
          </div>
        )}

        {/* Charts */}
        {!loading && historicalData && historicalData.daily && chartData.length > 0 && (
          <div className="space-y-6">
            {/* Temperature Trends */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Temperature Trends (Mean, Max, Min)</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }} 
                      interval="preserveStartEnd"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="tempMax" stroke="#ef4444" name="Max Temp (°C)" dot={false} />
                    <Line type="monotone" dataKey="tempMean" stroke="#f97316" name="Mean Temp (°C)" dot={false} />
                    <Line type="monotone" dataKey="tempMin" stroke="#3b82f6" name="Min Temp (°C)" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sun Cycle in IST */}
            {historicalData.daily.sunrise && historicalData.daily.sunset && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Sun Cycle (IST)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sunrise (IST)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sunset (IST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {chartData.slice(-7).map((data, idx) => {
                        const sunrise = historicalData.daily.sunrise?.[idx];
                        const sunset = historicalData.daily.sunset?.[idx];
                        return (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm">{data.date}</td>
                            <td className="px-4 py-2 text-sm">{sunrise ? formatTime(sunrise) : 'N/A'}</td>
                            <td className="px-4 py-2 text-sm">{sunset ? formatTime(sunset) : 'N/A'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Precipitation */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Precipitation</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }} 
                      interval="preserveStartEnd"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="precipitation" fill="#3b82f6" name="Precipitation (mm)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Total Precipitation: {(historicalData.daily.precipitation_sum?.reduce((a, b) => a + b, 0) || 0).toFixed(1)} mm
                </p>
              </div>
            </div>

            {/* Wind Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Wind Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Max Wind Speed</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="windSpeed" stroke="#10b981" name="Wind Speed (km/h)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Dominant Wind Direction</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 360]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="windDirection" stroke="#8b5cf6" name="Direction (°)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};