import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faTint, faWind, faThermometerHalf, faSun, faMoon, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const [theme, setTheme] = useState('light');

  const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
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
      setCity(weatherData.location.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`app-container ${theme}`}>
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">WeatherNow</h1>
          <button onClick={toggleTheme} className="theme-toggle">
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </button>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search city..."
              value={city}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
          <button onClick={handleSearch} className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </header>

      <main className="main-content">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="weather-content">
            <div className="weather-header">
              <h2>{weather.location.name}, {weather.location.country}</h2>
              <p className="date-time">
                {new Date(weather.location.localtime).toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="weather-tabs">
              <button
                className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
                onClick={() => setActiveTab('current')}
              >
                Current
              </button>
              <button
                className={`tab-button ${activeTab === 'forecast' ? 'active' : ''}`}
                onClick={() => setActiveTab('forecast')}
              >
                5-Day Forecast
              </button>
            </div>

            {activeTab === 'current' && (
              <div className="current-weather">
                <div className="weather-main">
                  <img src={weather.current.condition.icon} alt="Weather icon" className="weather-icon" />
                  <div className="temperature-container">
                    <p className="temperature">{weather.current.temp_c}°C</p>
                    <p className="condition">{weather.current.condition.text}</p>
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
                    <p>Feels like</p>
                    <p>{weather.current.feelslike_c}°C</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'forecast' && (
              <div className="daily-forecast">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-date">
                      <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
                      <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <img src={day.day.condition.icon} alt="Weather icon" className="forecast-icon" />
                    <div className="forecast-temps">
                      <span className="max-temp">{day.day.maxtemp_c}°</span>
                      <span className="min-temp">{day.day.mintemp_c}°</span>
                    </div>
                    <p className="forecast-condition">{day.day.condition.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 WeatherNow - Your Personal Weather App</p>
      </footer>
    </div>
  );
}

export default App;
