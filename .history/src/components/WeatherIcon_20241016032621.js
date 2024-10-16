import React from 'react';

const WeatherIcon = ({ code }) => {
  const getIconClass = (code) => {
    const iconMap = {
      1000: 'wi wi-day-sunny',
      1003: 'wi wi-day-cloudy',
      1006: 'wi wi-cloudy',
      1009: 'wi wi-cloudy',
      1030: 'wi wi-fog',
      1063: 'wi wi-day-rain',
      1066: 'wi wi-day-snow',
      1069: 'wi wi-day-sleet',
      1072: 'wi wi-day-sleet',
      1087: 'wi wi-day-lightning',
      1114: 'wi wi-snow',
      1117: 'wi wi-snow',
      1135: 'wi wi-fog',
      1147: 'wi wi-fog',
      1150: 'wi wi-day-showers',
      1153: 'wi wi-day-showers',
      1168: 'wi wi-day-sleet',
      1171: 'wi wi-day-sleet',
      1180: 'wi wi-day-rain',
      1183: 'wi wi-day-rain',
      1186: 'wi wi-day-rain',
      1189: 'wi wi-day-rain',
      1192: 'wi wi-day-rain',
      1195: 'wi wi-day-rain',
      1198: 'wi wi-day-sleet',
      1201: 'wi wi-day-sleet',
      1204: 'wi wi-day-sleet',
      1207: 'wi wi-day-sleet',
      1210: 'wi wi-day-snow',
      1213: 'wi wi-day-snow',
      1216: 'wi wi-day-snow',
      1219: 'wi wi-day-snow',
      1222: 'wi wi-day-snow',
      1225: 'wi wi-day-snow',
      1237: 'wi wi-day-snow',
      1240: 'wi wi-day-rain',
      1243: 'wi wi-day-rain',
      1246: 'wi wi-day-rain',
      1249: 'wi wi-day-sleet',
      1252: 'wi wi-day-sleet',
      1255: 'wi wi-day-snow',
      1258: 'wi wi-day-snow',
      1261: 'wi wi-day-snow',
      1264: 'wi wi-day-snow',
      1273: 'wi wi-day-lightning',
      1276: 'wi wi-day-lightning',
      1279: 'wi wi-day-snow',
      1282: 'wi wi-day-snow',
    };
    return iconMap[code] || 'wi wi-na';
  };

  return <i className={`weather-icon ${getIconClass(code)}`}></i>;
};

export default WeatherIcon;
