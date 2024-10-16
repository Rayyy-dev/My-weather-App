import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faTint, faWind, faThermometerHalf, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setCities] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
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
    <div className={`weather-dashboard ${theme}`}>
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search for a city or country"
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
                  <span>{suggestion.name}, {suggestion.region}, {suggestion.country}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => handleSearch(city)} className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="weather-grid">
          <div className="weather-card current-weather">
            <h2>Current Weather</h2>
            <p>{weather.location.name}, {weather.location.country}</p>
            <div className="weather-main">
              <div className="temperature-container">
                <div className="temperature">{Math.round(weather.current.temp_c)}°C</div>
                <div className="condition">{weather.current.condition.text}</div>
                <div className="feels-like">Feels like {Math.round(weather.current.feelslike_c)}°C</div>
              </div>
            </div>
            <div className="weather-details">
              <div className="detail-item">
                <FontAwesomeIcon icon={faTint} className="detail-icon" />
                <p>Humidity: {weather.current.humidity}%</p>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faWind} className="detail-icon" />
                <p>Wind: {Math.round(weather.current.wind_kph)} km/h</p>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faThermometerHalf} className="detail-icon" />
                <p>Pressure: {weather.current.pressure_mb} hPa</p>
              </div>
            </div>
          </div>

          <div className="weather-card forecast">
            <h2>5-Day Forecast</h2>
            <div className="forecast-grid">
              {forecast.slice(0, 5).map((day, index) => (
                <div key={index} className="forecast-item">
                  <div className="forecast-day">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="forecast-temp">{Math.round(day.day.avgtemp_c)}°C</div>
                  <img src={day.day.condition.icon} alt="Weather icon" className="forecast-icon" />
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
          className={`tab ${activeTab === 'tenday' ? 'active' : ''}`}
          onClick={() => setActiveTab('tenday')}
        >
          10-Day Forecast
        </button>
      </div>

      {activeTab === 'hourly' && (
        <div className="hourly-forecast">
          {forecast[0].hour.map((hour, index) => (
            <div key={index} className="hourly-item">
              <div>{new Date(hour.time).getHours()}:00</div>
              <img src={hour.condition.icon} alt="Weather icon" className="hourly-icon" />
              <div>{hour.temp_c}°C</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tenday' && (
        <div className="tenday-forecast">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <div>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              <img src={day.day.condition.icon} alt="Weather icon" className="forecast-icon" />
              <div className="forecast-temps">
                <span className="max-temp">{day.day.maxtemp_c}°</span>
                <span className="min-temp">{day.day.mintemp_c}°</span>
              </div>
              <div className="forecast-condition">{day.day.condition.text}</div>
            </div>
          ))}
        </div>
      )}

      <button onClick={toggleTheme} className="theme-toggle">
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
      </button>
    </div>
  );
}

export default App;
