import React from 'react';
import { WeatherNow } from '../types';
import { 
  Wind, 
  Droplets, 
  Eye, 
  Gauge,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudFog,
  CloudSun
} from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherNow;
  unit: 'm' | 'i';
}

// Helper to map QWeather icon codes to Lucide components with animations
export const getWeatherIcon = (code: string, className: string = "w-6 h-6") => {
  const c = parseInt(code);
  const commonClass = className;

  if (c === 100) return <Sun className={`${commonClass} animate-spin-slow`} />; // Sunny
  if (c >= 101 && c <= 103) return <CloudSun className={`${commonClass} animate-float`} />; // Cloudy/Partly Cloudy
  if (c === 104) return <Cloud className={`${commonClass} animate-float`} />; // Overcast
  if (c >= 300 && c <= 399) return <CloudRain className={`${commonClass} animate-pulse-soft`} />; // Rain
  if (c >= 400 && c <= 499) return <Snowflake className={`${commonClass} animate-spin-slow`} />; // Snow
  if (c >= 500 && c <= 515) return <CloudFog className={`${commonClass} animate-float`} />; // Fog/Haze
  if (c >= 200 && c <= 213) return <Wind className={`${commonClass} animate-float`} />; // Wind
  return <CloudSun className={`${commonClass} animate-float`} />;
};

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const tempUnit = unit === 'm' ? '°C' : '°F';
  const speedUnit = unit === 'm' ? 'km/h' : 'mph';
  const precipUnit = unit === 'm' ? 'mm' : 'in';

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 text-white shadow-lg border border-white/20 h-full flex flex-col justify-center">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-4">
               {getWeatherIcon(data.icon, "w-24 h-24 text-yellow-300")}
               <div className="text-9xl font-bold tracking-tighter leading-none">
                {data.temp}
                <span className="text-4xl align-top font-normal text-white/70">{tempUnit}</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-medium text-white/90">{data.text}</div>
            <div className="text-lg text-white/60 mt-1">Feels like {data.feelsLike}{tempUnit}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
        <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 text-blue-200 mb-1">
            <Wind size={20} />
            <span className="text-sm font-medium">Wind</span>
          </div>
          <div className="text-lg font-bold">{data.windDir}</div>
          <div className="text-xs text-white/60">{data.windScale} Scale ({data.windSpeed} {speedUnit})</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 text-blue-200 mb-1">
            <Droplets size={20} />
            <span className="text-sm font-medium">Humidity</span>
          </div>
          <div className="text-lg font-bold">{data.humidity}%</div>
          <div className="text-xs text-white/60">Dew: {data.dew}{tempUnit}</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 text-blue-200 mb-1">
            <Gauge size={20} />
            <span className="text-sm font-medium">Pressure</span>
          </div>
          <div className="text-lg font-bold">{data.pressure} hPa</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 text-blue-200 mb-1">
            <Eye size={20} />
            <span className="text-sm font-medium">Visibility</span>
          </div>
          <div className="text-lg font-bold">{data.vis} km</div>
          <div className="text-xs text-white/60">Precip: {data.precip} {precipUnit}</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;