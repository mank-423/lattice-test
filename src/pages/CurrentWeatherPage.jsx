import { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeoLocation';
import { useWeatherData } from '../hooks/useWeatherData';
import { weatherAPI } from '../services/weatherAPI';
import { TemperatureMetrics } from '../components/CurrentWeather/TemperatureMetrics';
import { AtmosphericMetrics } from '../components/CurrentWeather/AtmosphericMetrics';
import { SunCycle } from '../components/CurrentWeather/SunCycle';
import { WindMetrics } from '../components/CurrentWeather/WindMetrics';
import { AirQualityMetrics } from '../components/CurrentWeather/AirQualityMetrics';
import { TemperatureChart } from '../components/Charts/TemperatureChart';
import { MultiMetricChart } from '../components/Charts/MultiMetricChart';
import { formatDate } from '../utils/helpers';
import { Calendar, MapPin, Loader, RefreshCw } from 'lucide-react';

export const CurrentWeatherPage = () => {
    const { latitude, longitude, loading: locationLoading, error: locationError, city } = useGeolocation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [hourlyData, setHourlyData] = useState(null);
    const [hourlyLoading, setHourlyLoading] = useState(false);

    const { weatherData, airQuality, loading: weatherLoading, error: weatherError, refetch } = useWeatherData(
        latitude,
        longitude,
        selectedDate,
    );

    // Fetch hourly data separately for charts
    useEffect(() => {
        const fetchHourlyData = async () => {
            if (!latitude || !longitude) return;

            setHourlyLoading(true);
            try {
                const data = await weatherAPI.getHourlyData(latitude, longitude, selectedDate);
                setHourlyData(data.hourly);
            } catch (error) {
                console.error('Error fetching hourly data:', error);
            } finally {
                setHourlyLoading(false);
            }
        };

        fetchHourlyData();
    }, [latitude, longitude, selectedDate]);

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setSelectedDate(newDate);
    };

    const handleRefresh = () => {
        refetch();
        // Also refresh hourly data
        if (latitude && longitude) {
            weatherAPI.getHourlyData(latitude, longitude, selectedDate).then(data => {
                setHourlyData(data.hourly);
            });
        }
    };

    if (locationLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Detecting your location...</p>
                    <p className="text-sm text-gray-400 mt-2">Please allow GPS access</p>
                </div>
            </div>
        );
    }

    if (locationError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
                    <div className="text-red-500 text-6xl mb-4">📍</div>
                    <h2 className="text-xl font-semibold mb-2">Location Error</h2>
                    <p className="text-gray-600 mb-4">{locationError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (weatherLoading && !weatherData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Loading weather data...</p>
                </div>
            </div>
        );
    }

    if (weatherError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold mb-2">Error Loading Weather</h2>
                    <p className="text-gray-600 mb-4">{weatherError}</p>
                    <button
                        onClick={handleRefresh}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Extract data from API responses
    const current = weatherData?.current || {};
    const daily = weatherData?.daily || {};
    const hourly = weatherData?.hourly || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-8">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <MapPin size={18} />
                                <span className="text-sm">{city || 'Your Location'}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Weather Dashboard
                            </h1>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                            title="Refresh"
                        >
                            <RefreshCw size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Date Selector */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-blue-500" />
                            <span className="font-medium">Select Date:</span>
                        </div>
                        <input
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={handleDateChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            max={new Date().toISOString().split('T')[0]}
                        />
                        <div className="text-sm text-gray-500">
                            Showing data for: {formatDate(selectedDate)}
                        </div>
                    </div>
                </div>

                {/* Current Weather Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <TemperatureMetrics
                        currentTemp={current.temperature_2m}
                        minTemp={daily.temperature_2m_min?.[0]}
                        maxTemp={daily.temperature_2m_max?.[0]}
                    />
                    <AtmosphericMetrics
                        humidity={current.relative_humidity_2m}
                        uvIndex={current.uv_index}
                        precipitation={daily.precipitation_sum?.[0] || 0}
                    />
                    <SunCycle
                        sunrise={daily.sunrise?.[0]}
                        sunset={daily.sunset?.[0]}
                    />
                    <WindMetrics
                        maxWindSpeed={daily.wind_speed_10m_max?.[0]}
                        precipitationProb={daily.precipitation_probability_max?.[0]}
                    />
                    <AirQualityMetrics airData={airQuality} />
                </div>

                {/* Charts Section */}
                {/* Charts Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span>📊</span> Hourly Forecast Analysis
                    </h2>

                    {hourlyLoading ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <Loader className="animate-spin mx-auto mb-2" size={32} />
                            <p className="text-gray-500">Loading hourly data...</p>
                        </div>
                    ) : (
                        <>
                            <TemperatureChart hourlyData={hourlyData || hourly} />

                            <MultiMetricChart
                                hourlyData={hourlyData || hourly}
                                title="Relative Humidity & Precipitation"
                                metrics={[
                                    { key: 'relative_humidity', name: 'Humidity', unit: '%', dataKey: 'relative_humidity_2m' },
                                    { key: 'precipitation', name: 'Precipitation', unit: 'mm', dataKey: 'precipitation' }
                                ]}
                            />

                            <MultiMetricChart
                                hourlyData={hourlyData || hourly}
                                title="Visibility & Wind Speed"
                                metrics={[
                                    { key: 'visibility', name: 'Visibility', unit: 'km', dataKey: 'visibility' },
                                    { key: 'wind_speed', name: 'Wind Speed', unit: 'km/h', dataKey: 'wind_speed_10m' }
                                ]}
                            />

                            {/* Pass airQuality data specifically for PM metrics */}
                            <MultiMetricChart
                                hourlyData={hourlyData || hourly}
                                airQualityData={airQuality}
                                title="Air Quality - PM10 & PM2.5"
                                metrics={[
                                    { key: 'pm10', name: 'PM10', unit: 'µg/m³', dataKey: 'pm10' },
                                    { key: 'pm25', name: 'PM2.5', unit: 'µg/m³', dataKey: 'pm2_5' }
                                ]}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};