import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherIcon from './components/WeatherIcon';

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
            <i className="fas fa-map-marker-alt"></i>
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
                {suggestion.name}, {suggestion.region}, {suggestion.country}
              </div>
            ))}
          </div>
        )}
      </header>

      <main>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-content">
            <div className="weather-tabs">
              <button
                className={activeTab === 'current' ? 'active' : ''}
                onClick={() => setActiveTab('current')}
              >
                Current
              </button>
              <button
                className={activeTab === 'hourly' ? 'active' : ''}
                onClick={() => setActiveTab('hourly')}
              >
                Hourly
              </button>
              <button
                className={activeTab === 'daily' ? 'active' : ''}
                onClick={() => setActiveTab('daily')}
              >
                10-Day
              </button>
            </div>

            {activeTab === 'current' && (
              <section className="current-weather">
                <h2>{weather.location.name}, {weather.location.country}</h2>
                <div className="weather-details">
                  <div className="weather-main">
                    <WeatherIcon code={weather.current.condition.code} />
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

            {activeTab === 'hourly' && (
              <section className="hourly-weather">
                <h2>Hourly Forecast</h2>
                <div className="hourly-scroll">
                  {hourlyForecast.map((hour, index) => (
                    <div key={index} className="hour-item">
                      <p>{new Date(hour.time).getHours()}:00</p>
                      <WeatherIcon code={hour.condition.code} />
                      <p className="temperature">{hour.temp_c}°C</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'daily' && (
              <section className="daily-forecast">
                <h2>10-Day Forecast</h2>
                <div className="forecast-list">
                  {forecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                      <div className="forecast-date">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <WeatherIcon code={day.day.condition.code} />
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
          </div>
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
        <p>© 2024 WeatherNow - Your Personal Weather App</p>
      </footer>
    </div>
  );
}

export default App;
