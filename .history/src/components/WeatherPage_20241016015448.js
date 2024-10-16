import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function WeatherPage() {
    const { city } = useParams();
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState("");

    const apiKey = "74072ad194774534b56234435241510"; // Your WeatherAPI key

    useEffect(() => {
        // Fetch current weather
        const fetchWeather = async () => {
            try {
                const weatherResponse = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
                );
                const forecastResponse = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`
                );
                const weatherData = await weatherResponse.json();
                const forecastData = await forecastResponse.json();

                if (weatherResponse.ok) {
                    setWeather(weatherData.current);
                    setForecast(forecastData.forecast.forecastday);
                } else {
                    setError(weatherData.error.message);
                }
            } catch (error) {
                setError("Failed to fetch weather data");
            }
        };

        fetchWeather();
    }, [city]);

    return (
        <div className="weather-page-container">
            {error && <p className="error">{error}</p>}
            {weather && (
                <div className="current-weather">
                    <h2>Current Weather in {city}</h2>
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
