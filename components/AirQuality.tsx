import React from 'react';
import { AirNow } from '../types';

interface AirQualityProps {
  data: AirNow | null;
}

const getAqiColor = (aqi: number) => {
  if (aqi <= 50) return 'bg-green-500 border-green-500';
  if (aqi <= 100) return 'bg-yellow-500 border-yellow-500';
  if (aqi <= 150) return 'bg-orange-500 border-orange-500';
  if (aqi <= 200) return 'bg-red-500 border-red-500';
  if (aqi <= 300) return 'bg-purple-500 border-purple-500';
  return 'bg-rose-900 border-rose-900';
};

const AirQuality: React.FC<AirQualityProps> = ({ data }) => {
  if (!data) return null;

  const aqiVal = parseInt(data.aqi);
  const colorClass = getAqiColor(aqiVal);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white shadow-lg border border-white/20 h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start z-10">
        <h3 className="text-lg font-semibold opacity-90">Air Quality</h3>
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-sm ${colorClass.split(' ')[0]}`}>
          {data.category}
        </span>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow relative z-10">
        {/* Gauge Chart Representation */}
        <div className="w-32 h-32 rounded-full border-[10px] border-white/10 flex flex-col items-center justify-center relative">
            <div 
                className={`absolute inset-0 rounded-full border-[10px] ${colorClass.split(' ')[1]} opacity-80`} 
                style={{ 
                    clipPath: `inset(${100 - (aqiVal / 300) * 100}% 0 0 0)`,
                    transition: 'clip-path 1s ease-out'
                }}
            ></div>
            <div className="flex flex-col items-center justify-center z-10 bg-white/10 backdrop-blur-sm w-24 h-24 rounded-full shadow-inner">
                 <span className="text-3xl font-bold">{data.aqi}</span>
                 <span className="text-[10px] opacity-60 uppercase">AQI</span>
            </div>
        </div>
        <p className="mt-4 text-center opacity-80 text-sm font-medium bg-white/5 px-3 py-1 rounded-full">
            Primary: {data.primary === 'NA' ? 'None' : data.primary}
        </p>
      </div>
    </div>
  );
};

export default AirQuality;