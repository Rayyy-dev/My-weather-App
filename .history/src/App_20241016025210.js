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

  const apiKey = "74072ad194774534b56234435241510";
  const defaultCity = 'New York';

  useEffect(() => {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    setCities(savedCities);

    const lastViewedCity = localStorage.getItem('lastViewedCity');
    if (lastViewedCity) {
      fetchWeather(lastViewedCity);
    } else if (!savedCities.length) {
      detectLocation();
    } else {
      fetchWeather(savedCities[0]);
    }
  }, []);

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

      setWeather(weatherData);
      setForecast(forecastData.forecast.forecastday);
      setHourlyForecast(forecastData.forecast.forecastday[0].hour);
      localStorage.setItem('lastViewedCity', location);
    } catch (err) {
      setError("Failed to fetch weather data");
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
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to fetch city suggestions:', err);
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
      fetchWeather(cityName);
    }
  };

  const removeCity = (cityName) => {
    const updatedCities = cities.filter((c) => c !== cityName);
    setCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));

    if (updatedCities.length > 0) {
      fetchWeather(updatedCities[0]);
    } else {
      detectLocation();
    }
  };

  const handleCitySwitch = (cityName) => {
    fetchWeather(cityName);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeather(`${lat},${lon}`);
        },
        () => {
          fetchWeather(defaultCity);
        }
      );
    } else {
      fetchWeather(defaultCity);
    }
  };

  const renderWeatherAnimation = () => {
    if (!weather) return null;

    const condition = weather.current.condition.text.toLowerCase();
    if (condition.includes('rain')) {
      return (
        <div className="rain-animation">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      );
    }
    // Add more weather animations as needed
    return null;
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
          <button onClick={detectLocation}>Current Location</button>
          <button onClick={() => addCity(city)}>Add City</button>
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

      <div className="saved-cities">
        <h3>Saved Cities</h3>
        {cities.map((cityName, index) => (
          <div key={index} className="saved-city-item">
            <button onClick={() => handleCitySwitch(cityName)}>
              {cityName}
            </button>
            <button onClick={() => removeCity(cityName)} className="remove-city-btn">
              Remove
            </button>
          </div>
        ))}
      </div>

      <main>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <section className="current-weather">
            <h2>Current Weather in {weather.location.name}, {weather.location.country}</h2>
            {renderWeatherAnimation()}
            <div className="weather-details">
              <div>
                <img src={weather.current.condition.icon} alt="Weather icon" />
                <p>{weather.current.temp_c}°C</p>
                <p>{weather.current.condition.text}</p>
              </div>
              <div className="weather-info">
                <p>Wind: {weather.current.wind_kph} km/h</p>
                <p>Humidity: {weather.current.humidity}%</p>
                <p>Feels Like: {weather.current.feelslike_c}°C</p>
              </div>
            </div>
          </section>
        )}

        {/* Hourly and Daily forecast sections remain unchanged */}
      </main>

      <footer className="footer">
        <p>© 2024 MyWeatherApp - Your Personal Weather App</p>
      </footer>
    </div>
  );
}

export default App;
