import React, { useState } from 'react';
import { MetricsCard } from './MetricsCard';
import { formatTemperature } from '../../utils/helpers';
import { Thermometer, ArrowUp, ArrowDown } from 'lucide-react';

export const TemperatureMetrics = ({ currentTemp, minTemp, maxTemp }) => {
  const [unit, setUnit] = useState('C');

  return (
    <MetricsCard title="Temperature" icon="🌡️">
      <div className="space-y-3">
        

        {/* Current Temperature */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800">
            {formatTemperature(currentTemp, unit)}
          </div>
          <div className="text-sm text-gray-500 mt-1">Current</div>
        </div>

        {/* Min/Max */}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1 text-blue-500">
              <ArrowDown size={16} />
              <span className="text-sm font-medium">Min</span>
            </div>
            <div className="text-xl font-semibold text-gray-700">
              {formatTemperature(minTemp, unit)}
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1 text-red-500">
              <ArrowUp size={16} />
              <span className="text-sm font-medium">Max</span>
            </div>
            <div className="text-xl font-semibold text-gray-700">
              {formatTemperature(maxTemp, unit)}
            </div>
          </div>
        </div>
      </div>
    </MetricsCard>
  );
};