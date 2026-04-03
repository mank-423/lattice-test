import React from 'react';
import { MetricsCard } from './MetricsCard';
import { getAirQualityLevel } from '../../utils/helpers';

export const AirQualityMetrics = ({ airData }) => {
  if (!airData) {
    return (
      <MetricsCard title="Air Quality" icon="🏭">
        <div className="text-center text-gray-500 py-4">
          No air quality data available
        </div>
      </MetricsCard>
    );
  }

  const aqiLevel = getAirQualityLevel(airData.current?.european_aqi || 0);
  
  // Get current hour index (find closest time to now)
  const now = new Date();
  const currentHour = now.getHours();
  const hourlyTimes = airData.hourly?.time || [];
  
  // Find index for current time or use latest available
  let currentIndex = hourlyTimes.findIndex(time => {
    const hour = new Date(time).getHours();
    return hour === currentHour;
  });
  
  if (currentIndex === -1 && hourlyTimes.length > 0) {
    currentIndex = hourlyTimes.length - 1; // Use latest data
  }

  const getCurrentValue = (data) => {
    if (!data || !data[currentIndex]) return 'N/A';
    return data[currentIndex];
  };

  return (
    <MetricsCard title="Air Quality" icon="🏭">
      <div className="space-y-3">
        {/* AQI */}
        <div className={`p-2 rounded-lg ${aqiLevel.color}`}>
          <div className="text-sm font-medium">Air Quality Index</div>
          <div className="text-2xl font-bold">{airData.current?.european_aqi || 'N/A'}</div>
          <div className="text-xs">{aqiLevel.text}</div>
        </div>

        {/* Particulate Matter */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-gray-600">PM10</div>
            <div className="font-semibold">
              {getCurrentValue(airData.hourly?.pm10)} µg/m³
            </div>
          </div>
          <div>
            <div className="text-gray-600">PM2.5</div>
            <div className="font-semibold">
              {getCurrentValue(airData.hourly?.pm2_5)} µg/m³
            </div>
          </div>
          <div>
            <div className="text-gray-600">CO</div>
            <div className="font-semibold">
              {getCurrentValue(airData.hourly?.carbon_monoxide)} µg/m³
            </div>
          </div>
          <div>
            <div className="text-gray-600">CO₂</div>
            <div className="font-semibold">N/A</div>
            <div className="text-xs text-gray-400">Not available</div>
          </div>
          <div>
            <div className="text-gray-600">NO₂</div>
            <div className="font-semibold">
              {getCurrentValue(airData.hourly?.nitrogen_dioxide)} µg/m³
            </div>
          </div>
          <div>
            <div className="text-gray-600">SO₂</div>
            <div className="font-semibold">
              {getCurrentValue(airData.hourly?.sulphur_dioxide)} µg/m³
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-2">
          *Data shown for current hour
        </div>
      </div>
    </MetricsCard>
  );
};