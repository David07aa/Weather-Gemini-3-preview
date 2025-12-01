import React from 'react';
import { LifeIndex } from '../types';
import { Car, Shirt, Sun, Dumbbell, Pill, Bus } from 'lucide-react';

interface LifeIndicesProps {
  data: LifeIndex[];
}

const getIconForIndex = (type: string) => {
  switch (type) {
    case '1': return <Dumbbell size={18} />; // Sport
    case '2': return <Car size={18} />; // Car Wash
    case '3': return <Shirt size={18} />; // Dress
    case '5': return <Sun size={18} />; // UV
    case '9': return <Pill size={18} />; // Flu/Health
    case '15': return <Bus size={18} />; // Traffic
    default: return <Sun size={18} />;
  }
};

const LifeIndices: React.FC<LifeIndicesProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white shadow-lg border border-white/20">
      <h3 className="text-xl font-semibold mb-6 opacity-90">Life Style</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item) => (
            <div key={item.type} className="bg-blue-500/10 hover:bg-blue-500/20 rounded-2xl p-5 transition-colors flex flex-col justify-between h-32 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 opacity-80 text-blue-100">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        {getIconForIndex(item.type)}
                    </div>
                    <span className="text-sm font-medium tracking-wide truncate">{item.name}</span>
                </div>
                <div className="mt-2">
                    <div className="font-bold text-2xl tracking-tight text-white">{item.category}</div>
                    {item.text && <div className="text-[10px] opacity-50 mt-1 line-clamp-1">{item.text}</div>}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default LifeIndices;