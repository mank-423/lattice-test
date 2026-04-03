import { MetricsCard } from './MetricsCard';
import { Wind as WindIcon } from 'lucide-react';

export const WindMetrics = ({ maxWindSpeed, precipitationProb }) => {
  return (
    <MetricsCard title="Wind & Air" icon="💨">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WindIcon size={18} className="text-teal-500" />
            <span className="text-sm text-gray-600">Max Wind Speed</span>
          </div>
          <span className="text-lg font-semibold">{maxWindSpeed} km/h</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="text-sm text-gray-600">Precip. Probability</span>
          </div>
          <span className="text-lg font-semibold">{precipitationProb}%</span>
        </div>
      </div>
    </MetricsCard>
  );
};