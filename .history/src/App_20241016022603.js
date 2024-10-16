import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState(''); // City input from user
  const [weather, setWeather] = useState(null); // Current weather data
  const [forecast, setForecast] = useState([]); // 10-day forecast
  const [hourlyForecast, setHourlyForecast] = useState([]); // Hourly forecast
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error handling

  const apiKey = "74072ad194774534b56234435241510"; // WeatherAPI key

  useEffect(() => {
    if (!city) {
      detectLocation();
    }
  }, []);

  // Fetch weather data for city
  const fetchWeather = async (location) => {
    setLoading(true);
    try {
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`
      );
      const forecastResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10&hour=24`
      );

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      setWeather(weatherData.current);
      setForecast(forecastData.forecast.forecastday);
      setHourlyForecast(forecastData.forecast.forecastday[0].hour);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  // Detect user's location using Geolocation API
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeather(`${lat},${lon}`);
        },
        () => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Handle search for a city
  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeather(city);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">MyWeatherApp</div>
        <div className="search-location">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-bar"
            />
            <button type="submit">Search</button>
          </form>
          <button onClick={detectLocation} className="current-location-btn">
            Current Location
          </button>
        </div>
        <nav className="menu">
          <a href="#current">Today</a>
          <a href="#hourly">Hourly</a>
          <a href="#forecast">10-Day Forecast</a>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Display Error or Loading */}
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {/* Current Weather Section */}
        {weather && (
          <section id="current" className="current-weather">
            <h2>Current Weather</h2>
            <div className="weather-details">
              <div>
                <img src={weather.condition.icon} alt="Weather icon" />
                <p>{weather.temp_c}°C</p>
                <p>{weather.condition.text}</p>
              </div>
              <div className="weather-info">
                <p>Wind: {weather.wind_kph} km/h</p>
                <p>Humidity: {weather.humidity}%</p>
                <p>Feels Like: {weather.feelslike_c}°C</p>
              </div>
            </div>
          </section>
        )}

        {/* Hourly Weather Section */}
        {hourlyForecast.length > 0 && (
          <section id="hourly" className="hourly-weather">
            <h2>Hourly Forecast</h2>
            <div className="hourly-scroll">
              {hourlyForecast.map((hour, index) => (
                <div key={index} className="hour-item">
                  <p>{new Date(hour.time).getHours()}:00</p>
                  <img src={hour.condition.icon} alt="Weather icon" />
                  <p>{hour.temp_c}°C</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10-Day Forecast Section */}
        {forecast.length > 0 && (
          <section id="forecast" className="daily-forecast">
            <h2>10-Day Forecast</h2>
            <div className="forecast-list">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-item">
                  <div>{day.date}</div>
                  <img src={day.day.condition.icon} alt="Weather icon" />
                  <div>
                    <p>Max: {day.day.maxtemp_c}°C</p>
                    <p>Min: {day.day.mintemp_c}°C</p>
                    <p>{day.day.condition.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 MyWeatherApp - Your Personal Weather App</p>
      </footer>
    </div>
  );
}

export default App;
