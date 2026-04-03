import React, { useState } from 'react';
import { CurrentWeatherPage } from './pages/CurrentWeatherPage';
import { HistoricalAnalysisPage } from './pages/HistoricalAnalysisPage';
import { Cloud, BarChart3 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-20 md:top-0 md:bottom-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-around md:justify-center md:gap-8 py-2">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
                activeTab === 'current'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Cloud size={24} />
              <span className="text-xs font-medium">Current</span>
            </button>
            
            <button
              onClick={() => setActiveTab('historical')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
                activeTab === 'historical'
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={24} />
              <span className="text-xs font-medium">Historical</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Add padding bottom for mobile navigation */}
      <div className="pb-16 md:pb-0 md:pt-16">
        {activeTab === 'current' ? <CurrentWeatherPage /> : <HistoricalAnalysisPage />}
      </div>
    </div>
  );
}

export default App;