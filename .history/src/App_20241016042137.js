import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);
  const [activeTab, setActiveTab] = useState('current');

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
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`),
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10&hour=24`)
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

  const addCity = (cityName) => {
    if (!cities.includes(cityName)) {
      const updatedCities = [...cities, cityName];
      setCities(updatedCities);
      localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    }
  };

  const removeCity = (cityName) => {
    const updatedCities = cities.filter((c) => c !== cityName);
    setCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
  };

  const handleCitySwitch = (cityName) => {
    fetchWeather(cityName);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        () => {
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">WeatherNow</div>
        <div className="search-container">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search city..."
              value={city}
              onChange={handleInputChange}
              className="search-bar"
            />
            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSearch(suggestion.name)}
                  >
                    {suggestion.name}, {suggestion.region}, {suggestion.country}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => handleSearch(city)} className="btn search-button">
            <i className="fas fa-search"></i>
          </button>
          <button onClick={detectLocation} className="btn current-location-btn">
            <i className="fas fa-map-marker-alt"></i>
          </button>
        </div>
      </header>

      <main className="main-content">
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-content">
            <div className="weather-tabs">
              <button
                className={`btn tab ${activeTab === 'current' ? 'active' : ''}`}
                onClick={() => setActiveTab('current')}
              >
                Current
              </button>
              <button
                className={`btn tab ${activeTab === 'daily' ? 'active' : ''}`}
                onClick={() => setActiveTab('daily')}
              >
                10-Day Forecast
              </button>
            </div>

            {activeTab === 'current' && (
              <div className="current-weather">
                <div className="weather-location">
                  <h2>{weather.location.name}</h2>
                  <p>{new Date(weather.location.localtime).toLocaleString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="weather-main">
                  <img src={weather.current.condition.icon} alt="Weather icon" className="weather-icon" />
                  <div className="temperature-container">
                    <p className="temperature">{weather.current.temp_c}°C</p>
                    <p className="condition">{weather.current.condition.text}</p>
                  </div>
                </div>
                <div className="weather-details">
                  <div className="detail-item">
                    <i className="fas fa-tint"></i>
                    <p>Precipitation</p>
                    <p>{weather.current.precip_mm}mm</p>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-water"></i>
                    <p>Humidity</p>
                    <p>{weather.current.humidity}%</p>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-wind"></i>
                    <p>Wind</p>
                    <p>{weather.current.wind_kph} km/h</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hourly' && (
              <div className="hourly-forecast">
                <h2>Hourly Forecast</h2>
                <div className="forecast-list">
                  {hourlyForecast.map((hour, index) => (
                    <div key={index} className="forecast-item">
                      <p>{new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <img src={hour.condition.icon} alt="Weather icon" />
                      <p>{hour.temp_c}°C</p>
                      <p>{hour.condition.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'daily' && (
              <div className="daily-forecast">
                <h2>10-Day Forecast</h2>
                <div className="forecast-list">
                  {forecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                      <p className="forecast-date">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      <img src={day.day.condition.icon} alt="Weather icon" className="forecast-icon" />
                      <div className="forecast-temps">
                        <span className="max-temp">Max: {day.day.maxtemp_c}°C</span>
                        <span className="min-temp">Min: {day.day.mintemp_c}°C</span>
                      </div>
                      <p className="forecast-condition">{day.day.condition.text}</p>
                    </div>
                  ))}
                </div>
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
