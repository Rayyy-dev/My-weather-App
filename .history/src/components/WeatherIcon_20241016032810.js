import React from 'react';

const WeatherIcon = ({ code }) => {
  const getIconUrl = (code) => {
    return `http://cdn.weatherapi.com/weather/64x64/day/${code}.png`;
  };

  return <img src={getIconUrl(code)} alt="Weather icon" className="weather-icon" />;
};

export default WeatherIcon;
