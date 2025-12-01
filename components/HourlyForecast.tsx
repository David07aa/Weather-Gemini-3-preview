import React from 'react';
import { WeatherHourly } from '../types';
import { getWeatherIcon } from './CurrentWeather';

interface HourlyForecastProps {
  data: WeatherHourly[];
  unit: 'm' | 'i';
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, unit }) => {
  const tempUnit = unit === 'm' ? '°C' : '°F';

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white shadow-lg border border-white/20 w-full">
      <h3 className="text-xl font-semibold mb-4 opacity-90">24h Forecast</h3>
      <div className="flex overflow-x-auto pb-2 gap-3 snap-x no-scrollbar">
        {data.map((hour, index) => {
            const date = new Date(hour.fxTime);
            const timeStr = date.getHours().toString().padStart(2, '0') + ':00';
            
            return (
                <div key={index} className="flex-shrink-0 flex flex-col items-center justify-between bg-blue-500/20 hover:bg-blue-500/30 transition-colors rounded-2xl py-4 w-20 snap-start border border-white/5 backdrop-blur-sm h-[140px]">
                    <span className="text-xs font-medium opacity-80">{timeStr}</span>
                    <div className="my-2 scale-90 transform">
                        {getWeatherIcon(hour.icon, "w-8 h-8 text-white")}
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-auto">
                        <span className="text-lg font-bold">{hour.temp}{tempUnit}</span>
                        {parseInt(hour.pop) > 0 && (
                            <span className="text-[10px] text-blue-200">{hour.pop}%</span>
                        )}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;