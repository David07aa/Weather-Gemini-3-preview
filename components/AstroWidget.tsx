import React, { useMemo, useState, useEffect } from 'react';
import { SunData, AirNow } from '../types';

interface AstroWidgetProps {
  data: SunData | null;
  air: AirNow | null;
}

const AstroWidget: React.FC<AstroWidgetProps> = ({ data, air }) => {
  const { sunrise, sunset } = data || {};

  // Calculate the target percentage based on current time
  const targetPercentage = useMemo(() => {
    if (!sunrise || !sunset) return 0;
    
    const now = new Date();
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

  // Animation State
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let start: number;
    const duration = 1500; // 1.5s animation on mount
    
    const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const p = Math.min((timestamp - start) / duration, 1);
        
        // Cubic Ease Out
        const ease = 1 - Math.pow(1 - p, 3);
        
        setPercentage(targetPercentage * ease);
        
        if (p < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
  }, [targetPercentage]);

  // SVG Configuration
  const width = 320;
  const height = 160;
  const radius = 110;
  const cx = width / 2;
  const cy = height - 40; // Horizon baseline, leaving room for text

  // Calculate Sun Position
  // Angle: PI (Left/Sunrise) -> 0 (Right/Sunset)
  const angle = Math.PI * (1 - percentage / 100);
  const x = cx + radius * Math.cos(angle);
  const y = cy - radius * Math.sin(angle);

  // Dash calculations for the progress stroke
  const arcLength = Math.PI * radius;
  const dashOffset = arcLength * (1 - percentage / 100);

  if (!data) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white shadow-lg border border-white/20 h-full flex flex-col relative overflow-hidden">
      {/* Header & Air Quality Stats */}
      <div className="flex justify-between items-start z-10 mb-2">
           <h3 className="text-lg font-semibold opacity-90">Astronomy</h3>
           {air && (
            <div className="flex bg-white/5 rounded-lg py-1 px-3 gap-3 text-xs backdrop-blur-sm border border-white/10 shadow-inner items-center">
                <div className="flex flex-col items-center">
                    <span className="opacity-50 text-[8px] uppercase tracking-wider">PM2.5</span>
                    <span className="font-bold leading-tight">{air.pm2p5}</span>
                </div>
                <div className="w-[1px] bg-white/20 h-4"></div>
                <div className="flex flex-col items-center">
                    <span className="opacity-50 text-[8px] uppercase tracking-wider">PM10</span>
                    <span className="font-bold leading-tight">{air.pm10}</span>
                </div>
                 <div className="w-[1px] bg-white/20 h-4"></div>
                <div className="flex flex-col items-center">
                    <span className="opacity-50 text-[8px] uppercase tracking-wider">SO2</span>
                    <span className="font-bold leading-tight">{air.so2}</span>
                </div>
            </div>
           )}
      </div>

      {/* Main Animation Area */}
      <div className="flex-1 w-full flex items-end justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            <defs>
                <linearGradient id="sunGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#fbbf24" />
                     <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Horizon Line */}
            <line x1="20" y1={cy} x2={width-20} y2={cy} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

            {/* Trajectory (Dashed Arc) */}
            <path 
                d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
            />
            
            {/* Progress Arc (Solid Gradient) */}
             <path 
                d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} 
                fill="none" 
                stroke="url(#sunGradient)" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={dashOffset}
            />
            
            {/* Vertical Guide Line */}
            <line 
                x1={x} y1={y} x2={x} y2={cy} 
                stroke="rgba(255,255,255,0.4)" 
                strokeWidth="1" 
                strokeDasharray="2 2"
                opacity={percentage > 0 && percentage < 100 ? 1 : 0}
            />

            {/* Sun Group */}
            <g transform={`translate(${x}, ${y})`}>
                {/* Rotating Rays */}
                <g className="animate-spin-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                         <line 
                            key={deg}
                            x1="0" y1="-12" x2="0" y2="-16" 
                            stroke="#fbbf24" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                            transform={`rotate(${deg})`}
                            className="opacity-90"
                         />
                    ))}
                </g>
                {/* Sun Core */}
                <circle r="8" fill="#fbbf24" filter="url(#glow)" />
                <circle r="4" fill="#fff" fillOpacity="0.3" />
            </g>

            {/* Time Labels - Embedded in SVG for perfect alignment with Arc Start/End */}
            <g transform={`translate(${cx - radius}, ${cy + 20})`} textAnchor="middle">
                 <text fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold" dy="-5">Sunrise</text>
                 <text fill="white" fontSize="12" dy="10">{sunrise}</text>
            </g>

            <g transform={`translate(${cx + radius}, ${cy + 20})`} textAnchor="middle">
                 <text fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold" dy="-5">Sunset</text>
                 <text fill="white" fontSize="12" dy="10">{sunset}</text>
            </g>
        </svg>
      </div>
    </div>
  );
};

export default AstroWidget;