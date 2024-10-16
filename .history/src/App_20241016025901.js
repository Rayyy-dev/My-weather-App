import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState(''); // City input from user
  const [suggestions, setSuggestions] = useState([]); // Store city suggestions
  const [weather, setWeather] = useState(null); // Current weather data
  const [forecast, setForecast] = useState([]); // 10-day forecast
  const [hourlyForecast, setHourlyForecast] = useState([]); // Hourly forecast
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error handling
  const [cities, setCities] = useState([]); // User-added cities

  const apiKey = "74072ad194774534b56234435241510"; // WeatherAPI key
  const defaultCity = 'New York'; // Default city if no geolocation

  useEffect(() => {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    setCities(savedCities);

    const lastViewedCity = localStorage.getItem('lastViewedCity');
    if (lastViewedCity) {
      fetchWeather(lastViewedCity); // Show weather for last viewed city
    } else if (!savedCities.length) {
      detectLocation(); // Try detecting location or show default city
    } else {
      fetchWeather(savedCities[0]); // Show weather for the first saved city
    }
  }, []);

  // Fetch weather data for city
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

  // Fetch city suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError('Failed to fetch city suggestions');
    }
  };

  // Handle city input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    fetchSuggestions(value); // Fetch suggestions as user types
  };

  // Handle search for selected city
  const handleSearch = (selectedCity) => {
    setCity(selectedCity);
    fetchWeather(selectedCity);
    setSuggestions([]); // Clear suggestions after selection
  };

  // Add city to saved cities list
  const addCity = (cityName) => {
    if (!cities.includes(cityName)) {
      const updatedCities = [...cities, cityName];
      setCities(updatedCities);
      localStorage.setItem('savedCities', JSON.stringify(updatedCities));
      fetchWeather(cityName);
    }
  };

  // Remove city from saved cities list
  const removeCity = (cityName) => {
    const updatedCities = cities.filter((c) => c !== cityName);
    setCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));

    if (updatedCities.length > 0) {
      fetchWeather(updatedCities[0]); // Show weather for the first city in the list
    } else {
      detectLocation(); // Fallback to location if no cities are left
    }
  };

  // Switch between saved cities
  const handleCitySwitch = (cityName) => {
    fetchWeather(cityName);
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
          fetchWeather(defaultCity); // Use default city if location fails
        }
      );
    } else {
      fetchWeather(defaultCity); // Fallback to default city
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">MyWeatherApp</div>
        <div className="search-location">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={handleInputChange}
            className="search-bar"
          />
          <button onClick={() => handleSearch(city)}>Search</button>
          <button onClick={detectLocation} className="current-location-btn">
            <i className="fas fa-map-marker-alt"></i> Current Location
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSearch(suggestion.name)}
              >
                {suggestion.name}, {suggestion.country}
              </div>
            ))}
          </div>
        )}
      </header>

      <main>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <section className="current-weather">
            <h2>Current Weather in {weather.location.name}, {weather.location.country}</h2>
            <div className="weather-details">
              <div className="weather-main">
                <img src={weather.current.condition.icon} alt="Weather icon" />
                <p className="temperature">{weather.current.temp_c}°C</p>
                <p className="condition">{weather.current.condition.text}</p>
              </div>
              <div className="weather-info">
                <p><i className="fas fa-wind"></i> Wind: {weather.current.wind_kph} km/h</p>
                <p><i className="fas fa-tint"></i> Humidity: {weather.current.humidity}%</p>
                <p><i className="fas fa-thermometer-half"></i> Feels Like: {weather.current.feelslike_c}°C</p>
              </div>
            </div>
          </section>
        )}

        {hourlyForecast.length > 0 && (
          <section className="hourly-weather">
            <h2>Hourly Forecast</h2>
            <div className="hourly-scroll">
              {hourlyForecast.map((hour, index) => (
                <div key={index} className="hour-item">
                  <p>{new Date(hour.time).getHours()}:00</p>
                  <img src={hour.condition.icon} alt="Weather icon" />
                  <p className="temperature">{hour.temp_c}°C</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {forecast.length > 0 && (
          <section className="daily-forecast">
            <h2>10-Day Forecast</h2>
            <div className="forecast-list">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-item">
                  <div className="forecast-date">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                  <img src={day.day.condition.icon} alt="Weather icon" />
                  <div className="forecast-temps">
                    <p>Max: {day.day.maxtemp_c}°C</p>
                    <p>Min: {day.day.mintemp_c}°C</p>
                  </div>
                  <p className="forecast-condition">{day.day.condition.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="saved-cities">
        <h3>Saved Cities</h3>
        <div className="saved-cities-list">
          {cities.map((cityName, index) => (
            <div key={index} className="saved-city-item">
              <button onClick={() => handleCitySwitch(cityName)}>
                {cityName}
              </button>
              <button onClick={() => removeCity(cityName)} className="remove-city-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => addCity(city)} className="add-city-btn">
          <i className="fas fa-plus"></i> Add Current City
        </button>
      </div>

      <footer className="footer">
        <p>© 2024 MyWeatherApp - Your Personal Weather App</p>
      </footer>
    </div>
  );
}

export default App;