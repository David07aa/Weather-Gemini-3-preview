export const QWEATHER_API_KEY = '6c7a4e43d4484607a3b749ef6793fa93';

// Use Dev API for free tier
export const BASE_URL_WEATHER = 'https://devapi.qweather.com/v7';
export const BASE_URL_GEO = 'https://geoapi.qweather.com/v2';

export const ICONS_MAP: Record<string, string> = {
  // Mapping QWeather icon codes to Lucide icon names (handled in component)
  // This is a reference for potential future custom icon mapping
  '100': 'Sun',
  '101': 'CloudSun',
  '102': 'Cloud',
  '103': 'Cloud',
  '104': 'Cloudy',
  '300': 'CloudRain',
  '301': 'CloudRain',
  '305': 'CloudRainWind',
  '306': 'CloudRain',
  '307': 'CloudRain',
  '400': 'Snowflake',
  '401': 'Snowflake',
  '501': 'CloudFog',
  // ... others default to generic weather icon
};

export const LIFE_INDICES_TYPES = [
  '1', // Sport
  '2', // Car Wash
  '3', // Dress
  '5', // UV
  '9', // Flu
  '15', // Traffic
];
