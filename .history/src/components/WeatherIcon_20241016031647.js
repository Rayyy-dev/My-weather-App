import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, faCloudSun, faCloud, faSmog, faCloudRain, faSnowflake, 
  faCloudSleet, faBolt, faWind, faFog, faCloudShowersHeavy, faCloudHail, faQuestion
} from '@fortawesome/free-solid-svg-icons';

const WeatherIcon = ({ code }) => {
  const getIcon = (code) => {
    const iconMap = {
      1000: faSun,
      1003: faCloudSun,
      1006: faCloud,
      1009: faCloud,
      1030: faSmog,
      1063: faCloudRain,
      1066: faSnowflake,
      1069: faCloudSleet,
      1072: faCloudRain,
      1087: faBolt,
      1114: faSnowflake,
      1117: faWind,
      1135: faFog,
      1147: faFog,
      1150: faCloudRain,
      1153: faCloudRain,
      1168: faCloudRain,
      1171: faCloudRain,
      1180: faCloudRain,
      1183: faCloudRain,
      1186: faCloudRain,
      1189: faCloudRain,
      1192: faCloudShowersHeavy,
      1195: faCloudShowersHeavy,
      1198: faCloudRain,
      1201: faCloudRain,
      1204: faCloudSleet,
      1207: faCloudSleet,
      1210: faSnowflake,
      1213: faSnowflake,
      1216: faSnowflake,
      1219: faSnowflake,
      1222: faSnowflake,
      1225: faSnowflake,
      1237: faSnowflake,
      1240: faCloudRain,
      1243: faCloudShowersHeavy,
      1246: faCloudShowersHeavy,
      1249: faCloudSleet,
      1252: faCloudSleet,
      1255: faSnowflake,
      1258: faSnowflake,
      1261: faCloudHail,
      1264: faCloudHail,
      1273: faBolt,
      1276: faBolt,
      1279: faSnowflake,
      1282: faSnowflake,
    };

    return iconMap[code] || faQuestion;
  };

  return <FontAwesomeIcon icon={getIcon(code)} className="weather-icon" />;
};

export default WeatherIcon;
