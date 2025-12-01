import { 
  QWEATHER_API_KEY, 
  BASE_URL_WEATHER, 
  BASE_URL_GEO, 
  LIFE_INDICES_TYPES 
} from '../constants';
import { 
  City, 
  WeatherNow, 
  WeatherHourly, 
  WeatherDaily, 
  AirNow, 
  SunData, 
  LifeIndex, 
  WeatherDashboardData,
  UnitType,
  LangType
} from '../types';

async function fetchAPI(url: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams({
    key: QWEATHER_API_KEY,
    ...params
  });
  
  const response = await fetch(`${url}?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (data.code !== '200') {
    throw new Error(`QWeather API Error Code: ${data.code}`);
  }
  return data;
}

export const searchCity = async (location: string, lang: LangType = 'zh'): Promise<City[]> => {
  try {
    const data = await fetchAPI(`${BASE_URL_GEO}/city/lookup`, { location, lang });
    return data.location || [];
  } catch (error) {
    console.error("Failed to search city", error);
    return [];
  }
};

export const getAllWeatherData = async (
  locationId: string, 
  unit: UnitType = 'm', 
  lang: LangType = 'zh'
): Promise<WeatherDashboardData> => {
  try {
    const [nowRes, hourlyRes, dailyRes, airRes, sunRes, indicesRes] = await Promise.allSettled([
      fetchAPI(`${BASE_URL_WEATHER}/weather/now`, { location: locationId, unit, lang }),
      fetchAPI(`${BASE_URL_WEATHER}/weather/24h`, { location: locationId, unit, lang }),
      fetchAPI(`${BASE_URL_WEATHER}/weather/7d`, { location: locationId, unit, lang }),
      fetchAPI(`${BASE_URL_WEATHER}/air/now`, { location: locationId, lang }),
      fetchAPI(`${BASE_URL_WEATHER}/astronomy/sun`, { location: locationId, lang, date: new Date().toISOString().split('T')[0].replace(/-/g, '') }),
      fetchAPI(`${BASE_URL_WEATHER}/indices/1d`, { location: locationId, lang, type: LIFE_INDICES_TYPES.join(',') })
    ]);

    const now: WeatherNow = nowRes.status === 'fulfilled' ? nowRes.value.now : {} as WeatherNow;
    const hourly: WeatherHourly[] = hourlyRes.status === 'fulfilled' ? hourlyRes.value.hourly : [];
    const daily: WeatherDaily[] = dailyRes.status === 'fulfilled' ? dailyRes.value.daily : [];
    const air: AirNow | null = airRes.status === 'fulfilled' ? airRes.value.now : null;
    
    // Fallback for sun data if astronomy endpoint fails (it often does in free tier if location isn't precise), use daily forecast data
    let sun: SunData | null = null;
    if (sunRes.status === 'fulfilled') {
        sun = { sunrise: sunRes.value.sunrise, sunset: sunRes.value.sunset };
    } else if (daily.length > 0) {
        sun = { sunrise: daily[0].sunrise, sunset: daily[0].sunset };
    }

    const indices: LifeIndex[] = indicesRes.status === 'fulfilled' ? indicesRes.value.daily : [];

    return { now, hourly, daily, air, sun, indices };

  } catch (error) {
    console.error("Error fetching weather data", error);
    throw error;
  }
};
