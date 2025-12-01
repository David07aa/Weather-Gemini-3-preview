import React, { useState, useEffect } from 'react';
import { getAllWeatherData, searchCity } from './services/weatherService';
import { WeatherDashboardData, City, UnitType, LangType } from './types';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import AirQuality from './components/AirQuality';
import AstroWidget from './components/AstroWidget';
import LifeIndices from './components/LifeIndices';
import SearchBar from './components/SearchBar';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<WeatherDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [unit, setUnit] = useState<UnitType>('m');
  const [lang, setLang] = useState<LangType>('zh');

  // Initial Load: Beijing or Geolocation
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Default to Beijing if no geo
        let defaultCity = await searchCity('Beijing', lang);
        
        // Try Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const q = `${pos.coords.longitude.toFixed(2)},${pos.coords.latitude.toFixed(2)}`;
                    const cities = await searchCity(q, lang);
                    if (cities.length > 0) {
                        setCurrentCity(cities[0]);
                    } else if (defaultCity.length > 0) {
                        setCurrentCity(defaultCity[0]);
                    }
                },
                (err) => {
                    if (defaultCity.length > 0) setCurrentCity(defaultCity[0]);
                }
            );
        } else {
            if (defaultCity.length > 0) setCurrentCity(defaultCity[0]);
        }
      } catch (e) {
        setError("Initialization failed");
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch data when city/unit/lang changes
  useEffect(() => {
    if (!currentCity) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const weatherData = await getAllWeatherData(currentCity.id, unit, lang);
        setData(weatherData);
      } catch (e) {
        setError(lang === 'zh' ? '获取天气数据失败' : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentCity, unit, lang]);

  const toggleUnit = () => setUnit(prev => prev === 'm' ? 'i' : 'm');
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
       {/* Background Elements for depth */}
       <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[100px]"></div>
       </div>

      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                QWeather React
            </h1>
            {currentCity && (
                <div className="text-sm opacity-70 flex items-center gap-2 mt-1">
                    <span className="font-semibold">{currentCity.name}</span>
                    <span>•</span>
                    <span>{currentCity.adm1}, {currentCity.country}</span>
                </div>
            )}
        </div>
        
        <SearchBar onCitySelect={setCurrentCity} lang={lang} />

        <div className="flex items-center gap-3">
            <button 
                onClick={toggleUnit}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-bold hover:bg-white/20 transition-all"
            >
                {unit === 'm' ? '°C' : '°F'}
            </button>
            <button 
                onClick={toggleLang}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-bold text-xs hover:bg-white/20 transition-all"
            >
                {lang === 'zh' ? 'EN' : '中'}
            </button>
        </div>
      </header>

      {loading && !data && (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="w-12 h-12 animate-spin text-white/50 mb-4" />
            <p className="opacity-70">Loading Forecast...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-center backdrop-blur-md">
            <p>{error}</p>
        </div>
      )}

      {data && !loading && (
        <main className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Top Row: Current Weather & Astro/Air */}
            {/* Using grid to ensure equal heights for columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
                <div className="lg:col-span-2 h-full">
                    <CurrentWeather data={data.now} unit={unit} />
                </div>
                {/* Right column flex container to distribute space evenly */}
                <div className="flex flex-col gap-6 h-full">
                    <div className="flex-1 min-h-[180px]">
                        <AirQuality data={data.air} />
                    </div>
                    <div className="flex-1 min-h-[180px]">
                        {/* Pass air data to AstroWidget as requested in design */}
                        <AstroWidget data={data.sun} air={data.air} />
                    </div>
                </div>
            </div>

            {/* Hourly Forecast */}
            <HourlyForecast data={data.hourly} unit={unit} />

            {/* Daily Forecast */}
            <DailyForecast data={data.daily} unit={unit} lang={lang} />

            {/* Life Indices */}
            <LifeIndices data={data.indices} />
            
             <footer className="mt-12 text-center text-xs opacity-40 pb-4">
                Powered by QWeather API • React • Tailwind
            </footer>
        </main>
      )}
    </div>
  );
};

export default App;