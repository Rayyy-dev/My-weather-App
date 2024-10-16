import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faTint, faWind, faThermometerHalf, faSun, faMoon, faCloud, faCloudRain, faSnowflake } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setCities] = useState([]);
  const [theme, setTheme] = useState('light');
  const [, setAstronomy] = useState(null);

  const apiKey = "74072ad194774534b56234435241510";
  const defaultCity = 'New York';

  useEffect(() => {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    setCities(savedCities);
    const lastViewedCity = localStorage.getItem('lastViewedCity') || defaultCity;
    fetchWeather(lastViewedCity);
  }, []);

  const fetchWeather = async (location) => {
    setLoading(true);
    setError('');
    try {
      const [weatherResponse, forecastResponse, astronomyResponse] = await Promise.all([
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`),
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10`),
        fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}`)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok || !astronomyResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const [weatherData, forecastData, astronomyData] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json(),
        astronomyResponse.json()
      ]);

      setWeather(weatherData);
      setForecast(forecastData.forecast.forecastday);
      setAstronomy(astronomyData.astronomy.astro);
      localStorage.setItem('lastViewedCity', location);
      setCity(weatherData.location.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to fetch city suggestions', err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    fetchSuggestions(value);
  };

  const handleSearch = (selectedCity) => {
    setCity(selectedCity);
    fetchWeather(selectedCity);
    setSuggestions([]);
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
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </button>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search location..."
              value={city}
              onChange={handleInputChange}
              className="search-input"
            />
            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSearch(suggestion.name)}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="suggestion-icon" />
                    <span>{suggestion.name}, {suggestion.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {loading && <div className="loading">Loading<span>.</span><span>.</span><span>.</span></div>}
        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="weather-grid">
            <div className="weather-card current-weather">
              <h2>Current Weather</h2>
              <p className="location">{weather.location.name}, {weather.location.country}</p>
              <div className="weather-main">
                <div className="temperature-container">
                  <div className="temperature">{Math.round(weather.current.temp_c)}°</div>
                  <div className="condition">
                    <FontAwesomeIcon icon={getWeatherIcon(weather.current.condition.text)} className="condition-icon" />
                    {weather.current.condition.text}
                  </div>
                </div>
                <div className="feels-like">Feels like {Math.round(weather.current.feelslike_c)}°</div>
              </div>
              <div className="weather-details">
                <div className="detail-item">
                  <FontAwesomeIcon icon={faTint} className="detail-icon" />
                  <p>{weather.current.humidity}%</p>
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faWind} className="detail-icon" />
                  <p>{Math.round(weather.current.wind_kph)} km/h</p>
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faThermometerHalf} className="detail-icon" />
                  <p>{weather.current.pressure_mb} hPa</p>
                </div>
              </div>
            </div>

            <div className="weather-card forecast">
              <h2>3-Day Forecast</h2>
              <div className="forecast-grid">
                {forecast.slice(0, 3).map((day, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-day">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <FontAwesomeIcon icon={getWeatherIcon(day.day.condition.text)} className="forecast-icon" />
                    <div className="forecast-temp">{Math.round(day.day.avgtemp_c)}°</div>
                    <div className="forecast-condition">{day.day.condition.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="weather-card hourly-forecast">
            <h2>Hourly Forecast</h2>
            <div className="hourly-grid">
              {forecast[0].hour.map((hour, index) => (
                <div key={index} className="hourly-item">
                  <div className="hourly-time">{new Date(hour.time).getHours()}:00</div>
                  <FontAwesomeIcon icon={getWeatherIcon(hour.condition.text)} className="hourly-icon" />
                  <div className="hourly-temp">{Math.round(hour.temp_c)}°</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="weather-card tenday-forecast">
            <h2>10-Day Forecast</h2>
            <div className="tenday-grid">
              {forecast.map((day, index) => (
                <div key={index} className="tenday-item">
                  <div className="tenday-day">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <FontAwesomeIcon icon={getWeatherIcon(day.day.condition.text)} className="tenday-icon" />
                  <div className="tenday-temps">
                    <span className="max-temp">{Math.round(day.day.maxtemp_c)}°</span>
                    <span className="min-temp">{Math.round(day.day.mintemp_c)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 WeatherNow. All rights reserved.</p>
      </footer>
    </div>
  );
}

function getWeatherIcon(condition) {
  condition = condition.toLowerCase();
  if (condition.includes('sun') || condition.includes('clear')) return faSun;
  if (condition.includes('cloud')) return faCloud;
  if (condition.includes('rain')) return faCloudRain;
  if (condition.includes('snow')) return faSnowflake;
  return faCloud; // default icon
}

export default App;