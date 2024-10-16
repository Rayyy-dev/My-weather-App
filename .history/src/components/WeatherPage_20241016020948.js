import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function WeatherPage() {
    const { city } = useParams(); // Get the city from URL (if entered manually)
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState("");
    const [currentCity, setCurrentCity] = useState(city);
    const [loading, setLoading] = useState(false);

    const apiKey = "74072ad194774534b56234435241510"; // Your WeatherAPI key

    const navigate = useNavigate();

    // Function to fetch weather by city or coordinates
    const fetchWeather = async (query) => {
        setLoading(true);
        try {
            const weatherResponse = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}&aqi=no`
            );
            const forecastResponse = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=5`
            );

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            if (weatherResponse.ok) {
                setWeather(weatherData.current);
                setForecast(forecastData.forecast.forecastday);
                setCurrentCity(weatherData.location.name); // Set city name to the detected or searched city
            } else {
                setError(weatherData.error.message);
            }
        } catch (error) {
            setError("Failed to fetch weather data");
        } finally {
            setLoading(false);
        }
    };

    // Function to detect user's current location using Geolocation API
    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeather(`${lat},${lon}`);
                },
                () => {
                    setError("Unable to retrieve your location");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    // If a city is provided via URL, fetch weather for that city; otherwise, detect location
    useEffect(() => {
        if (city) {
            fetchWeather(city);
        } else {
            detectLocation();
        }
    }, [city]);

    // Auto-refresh weather data every 10 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentCity) {
                fetchWeather(currentCity);
            }
        }, 600000); // 600,000ms = 10 minutes

        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [currentCity]);

    // Function to handle searching for another location
    const handleSearch = (e) => {
        e.preventDefault();
        const newCity = e.target.elements.city.value;
        if (newCity) {
            navigate(`/weather/${newCity}`);
        }
    };

    return (
        <div className="weather-page-container">
            {/* Search for different locations */}
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" name="city" placeholder="Search for another city..." />
                <button type="submit">Search</button>
            </form>

            {/* Display current location button */}
            <button onClick={detectLocation} className="location-button">
                Use Current Location
            </button>

            {/* Display loading or weather information */}
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {weather && (
                <div className="current-weather">
                    <h2>Current Weather in {currentCity}</h2>
                    <img src={weather.condition.icon} alt="Weather icon" />
                    <p>Temperature: {weather.temp_c} °C</p>
                    <p>Condition: {weather.condition.text}</p>
                    <p>Humidity: {weather.humidity}%</p>
                </div>
            )}

            {forecast && (
                <div className="forecast-container">
                    <h2>5-Day Forecast</h2>
                    <div className="forecast">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-day">
                                <p>{day.date}</p>
                                <img src={day.day.condition.icon} alt="Weather icon" />
                                <p>{day.day.avgtemp_c} °C</p>
                                <p>{day.day.condition.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WeatherPage;
