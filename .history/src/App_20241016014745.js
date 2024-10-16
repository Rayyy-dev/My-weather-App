import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState(""); // State to store city input
  const [weather, setWeather] = useState(null); // State to store weather data
  const [error, setError] = useState(""); // State to handle errors

  // Your actual WeatherAPI key
  const apiKey = "74072ad194774534b56234435241510"; // This is your API key

  // Function to fetch weather data
  const getWeather = async (event) => {
    event.preventDefault();

    // Reset error and weather data for new search
    setError("");
    setWeather(null);

    try {
      // Fetch weather data from WeatherAPI
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
      );
      const weatherData = await response.json();

      if (response.ok) {
        setWeather(weatherData.current); // Set weather data for the current day
      } else {
        setError(weatherData.error.message);
      }
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
          <p>Temperature: {weather.temp_c} °C</p>
          <p>Condition: {weather.condition.text}</p>
          <p>Humidity: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
