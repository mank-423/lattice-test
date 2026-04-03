// Convert Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

// Format temperature based on unit
export const formatTemperature = (temp, unit = 'C') => {
  if (temp === undefined || temp === null) return 'N/A';
  const value = unit === 'F' ? celsiusToFahrenheit(temp) : temp;
  return `${Math.round(value)}°${unit}`;
};

// Format time (HH:MM) from ISO string
export const formatTime = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get air quality level description
export const getAirQualityLevel = (aqi) => {
  if (aqi <= 50) return { text: 'Good', color: 'text-green-600 bg-green-50' };
  if (aqi <= 100) return { text: 'Moderate', color: 'text-yellow-600 bg-yellow-50' };
  if (aqi <= 150) return { text: 'Unhealthy for Sensitive Groups', color: 'text-orange-600 bg-orange-50' };
  if (aqi <= 200) return { text: 'Unhealthy', color: 'text-red-600 bg-red-50' };
  if (aqi <= 300) return { text: 'Very Unhealthy', color: 'text-purple-600 bg-purple-50' };
  return { text: 'Hazardous', color: 'text-maroon-600 bg-maroon-50' };
};

// Group hourly data for display (show every N hours)
export const groupHourlyData = (data, interval = 2) => {
  if (!data || !data.time) return [];
  return {
    time: data.time.filter((_, i) => i % interval === 0),
    temperature_2m: data.temperature_2m?.filter((_, i) => i % interval === 0),
    relative_humidity_2m: data.relative_humidity_2m?.filter((_, i) => i % interval === 0),
    precipitation: data.precipitation?.filter((_, i) => i % interval === 0),
    visibility: data.visibility?.filter((_, i) => i % interval === 0),
    wind_speed_10m: data.wind_speed_10m?.filter((_, i) => i % interval === 0),
    pm10: data.pm10?.filter((_, i) => i % interval === 0),
    pm2_5: data.pm2_5?.filter((_, i) => i % interval === 0)
  };
};