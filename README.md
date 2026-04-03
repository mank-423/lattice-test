# Lattice test dashboard

A responsive, feature-rich weather application that provides real-time and historical weather insights using the Open-Meteo API. The app automatically detects your location via GPS and delivers comprehensive weather data with beautiful visualizations.

## ✨ Features

### 📍 Current Weather & Hourly Forecast
- **Automatic Location Detection** - GPS-based location detection with city name resolution
- **Date Selection** - View weather for any date (past or future up to 16 days)
- **Weather Metrics Display**:
  - Temperature (Current, Min, Max) with °C/°F toggle
  - Atmospheric conditions (Humidity, UV Index, Precipitation)
  - Sun cycle (Sunrise, Sunset times)
  - Wind & Air metrics (Max wind speed, Precipitation probability)
  - Complete Air Quality metrics (AQI, PM10, PM2.5, CO, NO₂, SO₂)

### 📊 Interactive Charts
- **Temperature Trend** - Hourly temperature graph with unit toggle
- **Humidity & Precipitation** - Combined visualization
- **Visibility & Wind Speed** - Track wind patterns
- **Air Quality** - PM10 & PM2.5 trends

### 📈 Historical Analysis
- **Date Range Selection** - Analyze trends up to 2 years
- **Temperature Trends** - Mean, Max, Min temperatures
- **Sun Cycle** - Sunrise/Sunset times in IST
- **Precipitation Analysis** - Total rainfall with visual indicators
- **Wind Analysis** - Speed and direction patterns
- **Air Quality Trends** - PM10 & PM2.5 (when available)

## 🚀 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: Open-Meteo
- **Date Handling**: date-fns
- **HTTP Client**: Native Fetch API

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Step 1: Clone the repository
```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start the development server
```bash
npm run dev
```

### Step 4: Build for production
```bash
npm run build
```

### Step 5: Preview production build
```bash
npm run preview
```

### Step 4: Build for production
```bash
npm run dev
```

## Project structure

```bash
weather-dashboard/
├── src/
│   ├── components/
│   │   ├── CurrentWeather/
│   │   │   ├── AirQualityMetrics.jsx
│   │   │   ├── AtmosphericMetrics.jsx
│   │   │   ├── MetricsCard.jsx
│   │   │   ├── SunCycle.jsx
│   │   │   ├── TemperatureMetrics.jsx
│   │   │   └── WindMetrics.jsx
│   │   └── Charts/
│   │       ├── MultiMetricChart.jsx
│   │       └── TemperatureChart.jsx
│   ├── pages/
│   │   ├── CurrentWeatherPage.jsx
│   │   └── HistoricalAnalysisPage.jsx
│   ├── hooks/
│   │   ├── useGeolocation.js
│   │   └── useWeatherData.js
│   ├── services/
│   │   └── weatherAPI.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Key features

### 1. Automatic Location Detection
### 2. Real-time Weather Data
### 3. Interactive Charts
### 4. Historical Analysis




