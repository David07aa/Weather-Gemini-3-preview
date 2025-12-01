export interface City {
  name: string;
  id: string;
  lat: string;
  lon: string;
  adm2: string; // District/County
  adm1: string; // Province/State
  country: string;
  tz: string;
  utcOffset: string;
  isDst: string;
  type: string;
  rank: string;
  fxLink: string;
}

export interface WeatherNow {
  obsTime: string;
  temp: string;
  feelsLike: string;
  icon: string;
  text: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud: string;
  dew: string;
}

export interface WeatherHourly {
  fxTime: string;
  temp: string;
  icon: string;
  text: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  pop: string; // Probability of precipitation
  precip: string;
  pressure: string;
  cloud: string;
  dew: string;
}

export interface WeatherDaily {
  fxDate: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonPhaseIcon: string;
  tempMax: string;
  tempMin: string;
  iconDay: string;
  textDay: string;
  iconNight: string;
  textNight: string;
  wind360Day: string;
  windDirDay: string;
  windScaleDay: string;
  windSpeedDay: string;
  wind360Night: string;
  windDirNight: string;
  windScaleNight: string;
  windSpeedNight: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud: string;
  uvIndex: string;
}

export interface AirNow {
  pubTime: string;
  aqi: string;
  level: string;
  category: string;
  primary: string;
  pm10: string;
  pm2p5: string;
  no2: string;
  so2: string;
  co: string;
  o3: string;
}

export interface SunData {
  sunrise: string;
  sunset: string;
}

export interface LifeIndex {
  date: string;
  type: string;
  name: string;
  level: string;
  category: string;
  text: string;
}

export interface WeatherDashboardData {
  now: WeatherNow;
  hourly: WeatherHourly[];
  daily: WeatherDaily[];
  air: AirNow | null;
  sun: SunData | null;
  indices: LifeIndex[];
}

export type UnitType = 'm' | 'i'; // Metric, Imperial
export type LangType = 'zh' | 'en';
