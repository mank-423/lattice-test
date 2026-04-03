// Open-Meteo API service
const BASE_URL = 'https://api.open-meteo.com/v1';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1';

export const weatherAPI = {
  // Get current weather, hourly forecast, and daily data
  async getCurrentWeather(latitude, longitude, date = null) {
    const currentDate = date ? new Date(date) : new Date();
    const dateStr = currentDate.toISOString().split('T')[0];

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,apparent_temperature',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m,pressure_msl',
      daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
      timezone: 'auto',
      start_date: dateStr,
      end_date: dateStr
    });

    const response = await fetch(`${BASE_URL}/forecast?${params}`);
    return response.json();
  },

  // Get air quality data
  async getAirQuality(latitude, longitude, date = null) {
    const currentDate = date ? new Date(date) : new Date();
    const dateStr = currentDate.toISOString().split('T')[0];

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide',
      current: 'european_aqi',
      timezone: 'auto',
      start_date: dateStr,
      end_date: dateStr
    });

    try {
      const response = await fetch(`${AIR_QUALITY_URL}/air-quality?${params}`);
      const data = await response.json();

      // Log the data to verify structure
      console.log('Air Quality Data:', data);

      return data;
    } catch (error) {
      console.error('Error fetching air quality:', error);
      return null;
    }
  },

  // Get historical data for date range (max 2 years)
  async getHistoricalData(latitude, longitude, startDate, endDate) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset',
      hourly: 'pm10,pm2_5',
      timezone: 'auto',
      start_date: startDate,
      end_date: endDate
    });

    try {
      const response = await fetch(`${BASE_URL}/forecast?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if we got valid data
      if (data.error) {
        console.error('API Error:', data.reason);
        throw new Error(data.reason || 'Failed to fetch historical data');
      }

      console.log('Historical Data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },

  // Get hourly data for specific date with all required metrics
  async getHourlyData(latitude, longitude, date) {
    const dateStr = date.toISOString().split('T')[0];

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: 'temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m',
      timezone: 'auto',
      start_date: dateStr,
      end_date: dateStr
    });

    try {
      const response = await fetch(`${BASE_URL}/forecast?${params}`);
      const data = await response.json();

      // Convert visibility from meters to kilometers for better readability
      if (data.hourly && data.hourly.visibility) {
        data.hourly.visibility = data.hourly.visibility.map(v => v / 1000);
        if (data.hourly_units) {
          data.hourly_units.visibility = 'km';
        }
      }

      console.log('Hourly Data with visibility:', data);
      return data;
    } catch (error) {
      console.error('Error fetching hourly data:', error);
      return null;
    }
  },
};