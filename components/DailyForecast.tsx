import React from 'react';
import { WeatherDaily } from '../types';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { getWeatherIcon } from './CurrentWeather';

interface DailyForecastProps {
  data: WeatherDaily[];
  unit: 'm' | 'i';
  lang: 'zh' | 'en';
}

const DailyForecast: React.FC<DailyForecastProps> = ({ data, unit, lang }) => {
  const tempUnit = unit === 'm' ? '°C' : '°F';

  // Prepare chart data
  const chartData = data.map(day => ({
    name: new Date(day.fxDate).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short' }),
    max: parseInt(day.tempMax),
    min: parseInt(day.tempMin),
    iconDay: day.iconDay,
    iconNight: day.iconNight,
    textDay: day.textDay
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold mb-1 text-white">{label}</p>
          <div className="space-y-1">
            <p className="text-yellow-400 font-medium">High: {payload[0].value}{tempUnit}</p>
            <p className="text-blue-400 font-medium">Low: {payload[1].value}{tempUnit}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 pb-0 text-white shadow-lg border border-white/20 flex flex-col">
      <h3 className="text-xl font-semibold mb-6 opacity-90">7-Day Forecast</h3>
      
      {/* Header Grid: Aligned with the chart columns */}
      <div className="grid grid-cols-7 mb-2 text-center relative z-10">
        {data.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium opacity-80">
                    {new Date(day.fxDate).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short' })}
                </span>
                <div className="flex flex-col items-center gap-1">
                    {getWeatherIcon(day.iconDay, "w-6 h-6 text-white")}
                    <div className="opacity-50 scale-75">
                        {getWeatherIcon(day.iconNight, "w-6 h-6 text-white")}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Chart View */}
      <div className="h-[140px] w-full -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* XAxis with padding ensures points align with the center of the columns above */}
            <XAxis dataKey="name" hide padding={{ left: 20, right: 20 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
            <Area 
                type="monotone" 
                dataKey="max" 
                stroke="#facc15" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMax)" 
            />
            <Area 
                type="monotone" 
                dataKey="min" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMin)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyForecast;