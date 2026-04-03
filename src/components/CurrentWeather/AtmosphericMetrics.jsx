import React from 'react';
import { MetricsCard } from './MetricsCard';
import { Droplet, Wind, Sun } from 'lucide-react';

export const AtmosphericMetrics = ({ humidity, uvIndex, precipitation }) => {
  const getUVLevel = (uv) => {
    if (uv <= 2) return { text: 'Low', color: 'text-green-600' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-yellow-600' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-600' };
    if (uv <= 10) return { text: 'Very High', color: 'text-red-600' };
    return { text: 'Extreme', color: 'text-purple-600' };
  };

  const uvLevel = getUVLevel(uvIndex);

  return (
    <MetricsCard title="Atmospheric Conditions" icon="🌤️">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet size={18} className="text-blue-500" />
            <span className="text-sm text-gray-600">Humidity</span>
          </div>
          <span className="text-lg font-semibold">{humidity}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun size={18} className="text-yellow-500" />
            <span className="text-sm text-gray-600">UV Index</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-semibold">{uvIndex}</span>
            <span className={`text-xs ml-2 ${uvLevel.color}`}>{uvLevel.text}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💧</span>
            <span className="text-sm text-gray-600">Precipitation</span>
          </div>
          <span className="text-lg font-semibold">{precipitation} mm</span>
        </div>
      </div>
    </MetricsCard>
  );
};