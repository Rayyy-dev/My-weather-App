import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function WeatherPage() {
    const { city } = useParams(); // Get city from URL params
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const apiKey = "74072ad194774534b56234435241510"; // Weather API Key

    useEffect(() => {
        setLoading(true);

        // Fetch weather data
        const fetchWeather = async () => {
            try {
                const weatherResponse = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
                );
                const forecastResponse = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&hour=24`
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

        fetchWeather();
    }, [city]);

    return (
        <div className="weather-page">
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {weather && (
                <div className="current-weather">
                    <h2>Current Weather in {city}</h2>
                    <img src={weather.condition.icon} alt="Weather icon" />
                    <p>{weather.temp_c} °C, {weather.condition.text}</p>
                    <p>Wind Speed: {weather.wind_kph} km/h</p>
                    <p>Humidity: {weather.humidity}%</p>
                </div>
            )}

            {/* Hourly Weather */}
            {hourlyForecast && (
                <div className="hourly-weather">
                    <h3>Hourly Forecast</h3>
                    <div className="hourly-scroll">
                        {hourlyForecast.map((hour, index) => (
                            <div key={index} className="hour-item">
                                <p>{new Date(hour.time).getHours()}:00</p>
                                <img src={hour.condition.icon} alt="Weather icon" />
                                <p>{hour.temp_c} °C</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 10-Day Forecast */}
            {forecast && (
                <div className="daily-forecast">
                    <h3>10-Day Forecast</h3>
                    <div className="forecast-list">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-item">
                                <div>{day.date}</div>
                                <img src={day.day.condition.icon} alt="Weather icon" />
                                <div>
                                    <p>Max: {day.day.maxtemp_c} °C</p>
                                    <p>Min: {day.day.mintemp_c} °C</p>
                                    <p>{day.day.condition.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WeatherPage;
