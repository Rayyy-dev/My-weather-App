import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCloud, faSun, faTint, faWind, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('hourly');

  const apiKey = "74072ad194774534b56234435241510";
  const defaultCity = 'New York';

  useEffect(() => {
    fetchWeather(defaultCity);
  }, []);

  const fetchWeather = async (location) => {
    setLoading(true);
    setError('');
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`),
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5&aqi=no&alerts=no`)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const [weatherData, forecastData] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json()
      ]);

      setWeather(weatherData);
      setForecast(forecastData.forecast.forecastday);
      setHourlyForecast(forecastData.forecast.forecastday[0].hour);
      setCity(weatherData.location.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <div className="weather-dashboard">
      <form onSubmit={handleSearch} className="search-container">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <FontAwesomeIcon icon={faSearch} /> Search
        </button>
      </form>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="weather-grid">
          <div className="weather-card current-weather">
            <h2>Current Weather</h2>
            <p>{weather.location.name}, {weather.location.country}</p>
            <div className="weather-main">
              <div className="temperature">{weather.current.temp_c}°C</div>
              <div>
                <div className="condition">{weather.current.condition.text}</div>
                <div className="feels-like">Feels like {weather.current.feelslike_c}°C</div>
              </div>
            </div>
            <div className="weather-details">
              <div className="detail-item">
                <FontAwesomeIcon icon={faTint} className="detail-icon" />
                <p>Humidity</p>
                <p>{weather.current.humidity}%</p>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faWind} className="detail-icon" />
                <p>Wind</p>
                <p>{weather.current.wind_kph} km/h</p>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faThermometerHalf} className="detail-icon" />
                <p>Pressure</p>
                <p>{weather.current.pressure_mb} hPa</p>
              </div>
            </div>
          </div>

          <div className="weather-card forecast">
            <h2>5-Day Forecast</h2>
            <div className="forecast-grid">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-item">
                  <div>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="forecast-temp">{day.day.avgtemp_c}°C</div>
                  <div className="forecast-condition">{day.day.condition.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'hourly' ? 'active' : ''}`}
          onClick={() => setActiveTab('hourly')}
        >
          Hourly Forecast
        </button>
        <button
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Weather Details
        </button>
      </div>

      {activeTab === 'hourly' && (
        <div className="hourly-forecast">
          {hourlyForecast.map((hour, index) => (
            <div key={index} className="hourly-item">
              <div>{new Date(hour.time).getHours()}:00</div>
              <FontAwesomeIcon icon={faCloud} className="hourly-icon" />
              <div>{hour.temp_c}°C</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'details' && (
        <div className="weather-details-extended">
          {/* Add more detailed weather information here */}
          <div>Sunrise: {weather?.forecast?.forecastday[0]?.astro?.sunrise}</div>
          <div>Sunset: {weather?.forecast?.forecastday[0]?.astro?.sunset}</div>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
}

export default App;
