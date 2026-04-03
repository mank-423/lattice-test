import { MetricsCard } from './MetricsCard';
import { Sunrise, Sunset } from 'lucide-react';
import { formatTime } from '../../utils/helpers';

export const SunCycle = ({ sunrise, sunset }) => {
  return (
    <MetricsCard title="Sun Cycle" icon="☀️">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sunrise size={20} className="text-orange-500" />
            <span className="text-sm text-gray-600">Sunrise</span>
          </div>
          <span className="text-base font-semibold">{formatTime(sunrise)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sunset size={20} className="text-orange-600" />
            <span className="text-sm text-gray-600">Sunset</span>
          </div>
          <span className="text-base font-semibold">{formatTime(sunset)}</span>
        </div>

        {/* Day length calculation */}
        {sunrise && sunset && (
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Day Length: {Math.round((new Date(sunset) - new Date(sunrise)) / (1000 * 60))} minutes
            </div>
          </div>
        )}
      </div>
    </MetricsCard>
  );
};