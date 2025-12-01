import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, History } from 'lucide-react';
import { searchCity } from '../services/weatherService';
import { City, LangType } from '../types';

interface SearchBarProps {
  onCitySelect: (city: City) => void;
  lang: LangType;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect, lang }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<City[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weather_city_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length > 1) {
      const cities = await searchCity(val, lang);
      setResults(cities);
      setIsOpen(true);
    } else {
      setResults([]);
    }
  };

  const selectCity = (city: City) => {
    onCitySelect(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);

    // Add to history
    const newHistory = [city, ...history.filter(h => h.id !== city.id)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('weather_city_history', JSON.stringify(newHistory));
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            // Round to 2 decimals for API formatting
            const q = `${longitude.toFixed(2)},${latitude.toFixed(2)}`;
            const cities = await searchCity(q, lang);
            if (cities.length > 0) {
                selectCity(cities[0]);
            }
        }, (err) => {
            alert('Geolocation failed or denied.');
        });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md z-50" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={lang === 'zh' ? "搜索城市..." : "Search City..."}
          className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 rounded-full py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
        {query && (
             <button 
                onClick={() => { setQuery(''); setResults([]); }}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
             >
                 <X size={16} />
             </button>
        )}
        <button 
            onClick={handleLocationClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-blue-200 transition-colors"
            title="Locate Me"
        >
          <MapPin size={20} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <div>
                 <div className="px-4 py-2 text-xs font-bold text-white/40 uppercase tracking-wider">Search Results</div>
                 {results.map((city) => (
                    <div
                        key={city.id}
                        onClick={() => selectCity(city)}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-white flex justify-between items-center"
                    >
                        <span>{city.name}</span>
                        <span className="text-xs opacity-50">{city.adm1}, {city.country}</span>
                    </div>
                ))}
            </div>
          ) : query.length === 0 && history.length > 0 ? (
            <div>
                 <div className="px-4 py-2 text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                     <History size={12} /> Recent
                 </div>
                 {history.map((city) => (
                    <div
                        key={city.id}
                        onClick={() => selectCity(city)}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-white flex justify-between items-center"
                    >
                        <span>{city.name}</span>
                        <span className="text-xs opacity-50">{city.adm1}, {city.country}</span>
                    </div>
                ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-4 text-center text-white/50">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
