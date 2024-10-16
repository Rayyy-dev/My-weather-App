import React from 'react';

const WeatherIcon = ({ code }) => {
  const getIconClass = (code) => {
    const iconMap = {
      1000: 'fas fa-sun',
      1003: 'fas fa-cloud-sun',
      1006: 'fas fa-cloud',
      1009: 'fas fa-cloud',
      1030: 'fas fa-smog',
      1063: 'fas fa-cloud-rain',
      1066: 'fas fa-snowflake',
      1069: 'fas fa-cloud-sleet',
      1072: 'fas fa-cloud-rain',
      1087: 'fas fa-bolt',
      1114: 'fas fa-snowflake',
      1117: 'fas fa-wind',
      1135: 'fas fa-fog',
      1147: 'fas fa-fog',
      1150: 'fas fa-cloud-rain',
      1153: 'fas fa-cloud-rain',
      1168: 'fas fa-cloud-rain',
      1171: 'fas fa-cloud-rain',
      1180: 'fas fa-cloud-rain',
      1183: 'fas fa-cloud-rain',
      1186: 'fas fa-cloud-rain',
      1189: 'fas fa-cloud-rain',
      1192: 'fas fa-cloud-showers-heavy',
      1195: 'fas fa-cloud-showers-heavy',
      1198: 'fas fa-cloud-rain',
      1201: 'fas fa-cloud-rain',
      1204: 'fas fa-cloud-sleet',
      1207: 'fas fa-cloud-sleet',
      1210: 'fas fa-snowflake',
      1213: 'fas fa-snowflake',
      1216: 'fas fa-snowflake',
      1219: 'fas fa-snowflake',
      1222: 'fas fa-snowflake',
      1225: 'fas fa-snowflake',
      1237: 'fas fa-snowflake',
      1240: 'fas fa-cloud-rain',
      1243: 'fas fa-cloud-showers-heavy',
      1246: 'fas fa-cloud-showers-heavy',
      1249: 'fas fa-cloud-sleet',
      1252: 'fas fa-cloud-sleet',
      1255: 'fas fa-snowflake',
      1258: 'fas fa-snowflake',
      1261: 'fas fa-cloud-hail',
      1264: 'fas fa-cloud-hail',
      1273: 'fas fa-bolt',
      1276: 'fas fa-bolt',
      1279: 'fas fa-snowflake',
      1282: 'fas fa-snowflake',
    };

    return iconMap[code] || 'fas fa-question';
  };

  return <i className={`weather-icon ${getIconClass(code)}`}></i>;
};

export default WeatherIcon;
