import React, { useMemo } from 'react';
import { SunData, AirNow } from '../types';

interface AstroWidgetProps {
  data: SunData | null;
  air: AirNow | null;
}

const AstroWidget: React.FC<AstroWidgetProps> = ({ data, air }) => {
  const { sunrise, sunset } = data || {};

  const percentage = useMemo(() => {
    if (!sunrise || !sunset) return 0;
    
    const now = new Date();
    // Helper to parse time strings "HH:MM"
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    };

    const riseTime = parseTime(sunrise);
    const setTime = parseTime(sunset);
    
    if (now < riseTime) return 0;
    if (now > setTime) return 100;
    
    const total = setTime.getTime() - riseTime.getTime();
    const elapsed = now.getTime() - riseTime.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, [sunrise, sunset]);

  // SVG Geometry
  const width = 260; 
  const height = 130; 
  const radius = 100;
  const cx = width / 2;
  const cy = height - 15; // Bottom anchor

  // Calculate Sun Position
  // 0% -> PI radians (Left) -> 100% -> 0 radians (Right)
  const currentAngle = Math.PI * (1 - percentage / 100);
  const x = cx + radius * Math.cos(currentAngle); 
  const y = cy - radius * Math.sin(currentAngle); 

  if (!data) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white shadow-lg border border-white/20 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-1 relative z-10">
           <h3 className="text-lg font-semibold opacity-90">Astronomy</h3>
           {/* Air Stats Pill */}
           {air && (
            <div className="flex bg-white/5 rounded-lg py-1 px-3 gap-3 text-xs backdrop-blur-sm border border-white/10 shadow-inner">
                <div className="flex flex-col items-center">
                    <span className="opacity-50 text-[9px] uppercase tracking-wider">PM2.5</span>
                    <span className="font-bold">{air.pm2p5}</span>
                </div>
                <div className="w-[1px] bg-white/20 h-full"></div>
                <div className="flex flex-col items-center">
                    <span className="opacity-50 text-[9px] uppercase tracking-wider">PM10</span>
                    <span className="font-bold">{air.pm10}</span>
                </div>
                <div className="w-[1px] bg-white/20 h-full"></div>
                <div className="flex flex-col items-center">
                    <span className="opacity-50 text-[9px] uppercase tracking-wider">SO2</span>
                    <span className="font-bold">{air.so2}</span>
                </div>
            </div>
           )}
      </div>

      {/* Main Graphic Area */}
      <div className="flex-1 w-full flex flex-col justify-end items-center relative mt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id="sunPathGradient" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#f59e0b" /> {/* Amber */}
                     <stop offset="50%" stopColor="#facc15" /> {/* Yellow */}
                     <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <filter id="sunGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Background Sky Arc (Dashed) */}
            <path 
                d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="2" 
                strokeDasharray="5 5"
            />
            
            {/* Active Path (Progress) */}
             <path 
                d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} 
                fill="none" 
                stroke="url(#sunPathGradient)" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray={Math.PI * radius}
                strokeDashoffset={Math.PI * radius * (1 - percentage/100)}
                className="transition-all duration-1000 ease-out"
            />
            
            {/* Horizon Line */}
            <line x1="10" y1={cy} x2={width-10} y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

            {/* Sun Object */}
            <g style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                {/* Outer Glow */}
                <circle r="14" fill="rgba(253, 224, 71, 0.2)" filter="url(#sunGlow)" className="animate-pulse-soft" />
                {/* Core Sun */}
                <circle r="7" fill="#facc15" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
            </g>
        </svg>

        {/* Time Labels */}
        <div className="absolute bottom-0 w-full flex justify-between px-4 text-xs font-medium text-blue-200/80">
            <div className="flex flex-col items-start">
                <span>Sunrise</span>
                <span className="text-white text-sm">{sunrise}</span>
            </div>
            <div className="flex flex-col items-end">
                <span>Sunset</span>
                <span className="text-white text-sm">{sunset}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AstroWidget;