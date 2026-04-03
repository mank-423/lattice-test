import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherAPI } from '../services/weatherAPI';

export const useWeatherData = (latitude, longitude, selectedDate, skipFetch = false) => {
  const [weatherData, setWeatherData] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFirstRender = useRef(true);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!latitude || !longitude) return;

    // Clear cache if force refresh
    if (forceRefresh) {
      weatherAPI.clearCache();
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch weather and air quality in parallel for better performance
      const [weather, air] = await Promise.all([
        weatherAPI.getCurrentWeather(latitude, longitude, selectedDate),
        weatherAPI.getAirQuality(latitude, longitude, selectedDate)
      ]);

      setWeatherData(weather);
      setAirQuality(air);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, selectedDate]);

  useEffect(() => {
    // Skip fetch if skipFetch is true and it's not the first render
    if (skipFetch && !isFirstRender.current) {
      return;
    }
    
    fetchData();
    isFirstRender.current = false;
  }, [fetchData, skipFetch]);

  return { weatherData, airQuality, loading, error, refetch: () => fetchData(true) };
};