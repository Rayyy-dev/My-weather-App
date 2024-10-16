import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState(""); // State to store city input
  const [weather, setWeather] = useState(null); // State to store weather data
  const [error, setError] = useState(""); // State to handle errors

  // Function to fetch weather data
  const getWeather = async (event) => {
    event.preventDefault();
    
    // Reset error and weather data for new search
    setError("");
    setWeather(null);

    try {
      // Step 1: Get the WOEID of the city
      const response = await fetch(
        `https://www.metaweather.com/api/location/search/?query=${city}`
      );
      const cityData = await response.json();

      if (cityData.length === 0) {
        setError("City not found");
        return;
      }

      const woeid = cityData[0].woeid;

      // Step 2: Get the weather data using WOEID
      const weatherResponse = await fetch(
        `https://www.metaweather.com/api/location/${woeid}/`
      );
      const weatherData = await weatherResponse.json();

      setWeather(weatherData.consolidated_weather[0]); // Set weather for the first day
    } catch (err) {
      setError("Failed to fetch weather data");
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      
      {/* Input form for city */}
      <form onSubmit={getWeather}>
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter city name" 
        />
        <button type="submit">Get Weather</button>
      </form>

      {/* Display error if any */}
      {error && <p className="error">{error}</p>}

      {/* Display weather info if available */}
      {weather && (
        <div>
          <h3>Weather in {city}</h3>
          <p>Temperature: {weather.the_temp.toFixed(1)} °C</p>
          <p>Weather: {weather.weather_state_name}</p>
          <p>Humidity: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
