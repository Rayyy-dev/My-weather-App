import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCloud, faSun, faTint, faWind, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [activeTab, setActiveTab] = useState('hourly');

  // ... keep your existing state and functions ...

  return (
    <div className="app-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button onClick={() => handleSearch(city)} className="search-button">
          <FontAwesomeIcon icon={faSearch} /> Search
        </button>
      </div>

      {weather && (
        <div className="weather-grid">
          <div className="weather-card">
            <h2>Current Weather</h2>
            <div className="current-weather">
              <div>
                <div className="temperature">{weather.current.temp_c}°C</div>
                <div className="condition">{weather.current.condition.text}</div>
              </div>
              <img src={weather.current.condition.icon} alt="Weather icon" />
            </div>
            <div className="weather-details">
              <div className="weather-detail">
                <FontAwesomeIcon icon={faTint} className="weather-detail-icon" />
                <span>Humidity: {weather.current.humidity}%</span>
              </div>
              <div className="weather-detail">
                <FontAwesomeIcon icon={faWind} className="weather-detail-icon" />
                <span>Wind: {weather.current.wind_kph} km/h</span>
              </div>
              <div className="weather-detail">
                <FontAwesomeIcon icon={faTachometerAlt} className="weather-detail-icon" />
                <span>Pressure: {weather.current.pressure_mb} hPa</span>
              </div>
            </div>
          </div>

          <div className="weather-card">
            <h2>5-Day Forecast</h2>
            <div className="forecast">
              {forecast.slice(0, 5).map((day, index) => (
                <div key={index} className="forecast-day">
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
        <div className="tab-list">
          <div
            className={`tab ${activeTab === 'hourly' ? 'active' : ''}`}
            onClick={() => setActiveTab('hourly')}
          >
            Hourly Forecast
          </div>
          <div
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Weather Details
          </div>
        </div>
        {activeTab === 'hourly' && (
          <div className="hourly-forecast">
            {/* Implement hourly forecast here */}
          </div>
        )}
        {activeTab === 'details' && (
          <div className="weather-details">
            {/* Implement additional weather details here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
