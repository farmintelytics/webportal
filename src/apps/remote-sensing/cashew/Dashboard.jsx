import React, { useState } from 'react';
import { 
  Globe, 
  Layers, 
  ChevronDown, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  Satellite, 
  Eye, 
  AlertTriangle, 
  Zap,
  CloudRain,
  Thermometer,
  Wind,
  Maximize2,
  MousePointer2,
  Map as MapIcon,
  Activity,
  Calendar,
  Filter,
  Search
} from 'lucide-react';

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-[var(--brand-primary)] text-white shadow-lg' 
        : 'text-black hover:bg-gray-100'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })}
    <span className="text-[12px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const AnalysisCard = ({ title, children, icon }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/5 shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      {icon && React.cloneElement(icon, { size: 16, className: 'text-[var(--brand-primary)]' })}
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">{title}</h4>
    </div>
    {children}
  </div>
);

const MonitoringDashboard = ({ cropName = "Cashew" }) => {
  const [activeLayer, setActiveLayer] = useState('NDVI');
  const [activeTab, setActiveTab] = useState('Analysis');

  const layers = [
    { id: 'NDVI', label: 'Vegetation Index', icon: <Activity /> },
    { id: 'RGB', label: 'Natural Color', icon: <Eye /> },
    { id: 'SAR', label: 'Radar (SAR)', icon: <Zap /> },
    { id: 'SOIL', label: 'Soil Moisture', icon: <CloudRain /> },
    { id: 'CLIMATE', label: 'Climate Risk', icon: <Thermometer /> },
  ];

  return (
    <div className="h-screen flex bg-white text-black overflow-hidden font-sans">
      {/* Left Navigation Sidebar */}
      <aside className="w-72 border-r-2 border-black p-6 flex flex-col gap-8 bg-white z-20">
        <div className="mb-4">
          <div className="text-[10px] font-black text-[var(--brand-primary)] uppercase tracking-[0.3em] mb-1">Geospatial Portal</div>
          <h1 className="text-2xl font-black tracking-tighter leading-none">{cropName} Intelligence</h1>
        </div>

        <div className="flex-1 space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4 px-2">Satellite Layers</div>
          {layers.map(layer => (
            <SidebarItem 
              key={layer.id}
              icon={layer.icon}
              label={layer.label}
              active={activeLayer === layer.id}
              onClick={() => setActiveLayer(layer.id)}
            />
          ))}
        </div>

        <div className="pt-6 border-t-2 border-black/5">
          <AnalysisCard title="Legend" icon={<Layers />}>
            <div className="space-y-3">
              {[
                { label: 'High Biomass', color: 'bg-emerald-500' },
                { label: 'Stable Growth', color: 'bg-green-400' },
                { label: 'Moisture Stress', color: 'bg-amber-400' },
                { label: 'Deforestation', color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-[10px] font-bold text-black/60 uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </AnalysisCard>
        </div>
      </aside>

      {/* Main Map View Port */}
      <main className="flex-1 relative bg-slate-900 overflow-hidden">
        {/* Map Header Overlay */}
        <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-start pointer-events-none">
          <div className="flex gap-4 pointer-events-auto">
             <div className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
                <Satellite size={20} className="text-[var(--brand-primary)]" />
                <div>
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-50">Active Satellite</div>
                   <div className="text-xs font-black">Sentinel-2B · 10m Res</div>
                </div>
             </div>
             <div className="bg-white text-black px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl border-2 border-black">
                <Calendar size={20} className="text-black" />
                <div>
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-50">Last Pass</div>
                   <div className="text-xs font-black">May 01, 2026 · 08:42 UTC</div>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-2 pointer-events-auto">
             <button className="bg-black text-white p-3 rounded-xl shadow-xl hover:bg-[var(--brand-primary)] transition-colors"><Maximize2 size={20} /></button>
             <button className="bg-black text-white p-3 rounded-xl shadow-xl hover:bg-[var(--brand-primary)] transition-colors"><MousePointer2 size={20} /></button>
             <button className="bg-black text-white p-3 rounded-xl shadow-xl hover:bg-[var(--brand-primary)] transition-colors"><RotateCcw size={20} /></button>
          </div>
        </div>

        {/* Simulated Satellite Map */}
        <div className="absolute inset-0 z-0">
           {/* Satellite Imagery Base Layer */}
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
           
           {/* Data Visualization Layer Overlay */}
           <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-1 p-4">
              {[...Array(96)].map((_, i) => {
                const intensity = (Math.sin(i * 0.5) + Math.cos(i * 0.8) + 2) / 4;
                let color = "bg-emerald-500/40";
                if (intensity < 0.3) color = "bg-red-500/40";
                else if (intensity < 0.5) color = "bg-amber-500/40";
                else if (intensity < 0.7) color = "bg-green-400/40";
                
                return (
                  <div 
                    key={i} 
                    className={`${color} rounded-sm border border-white/5 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/60 transition-all cursor-crosshair group relative`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                      VAL: {(intensity * 0.9).toFixed(2)}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Bottom Time Slider Overlay */}
        <div className="absolute bottom-8 left-8 right-8 z-10 flex items-center gap-6 bg-black/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
           <div className="flex items-center gap-4 border-r border-white/10 pr-6">
              <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-[var(--brand-primary)]"><RotateCcw size={16} /></button>
              <div className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">Time Series</div>
           </div>
           <div className="flex-1 flex items-center gap-4">
              {['JAN', 'FEB', 'MAR', 'APR', 'MAY'].map((m, i) => (
                <div key={m} className={`flex-1 h-1.5 rounded-full relative ${i < 4 ? 'bg-[var(--brand-primary)]' : 'bg-white/20'}`}>
                  <div className="absolute -top-6 left-0 text-[9px] font-black text-white/50">{m}</div>
                  {i === 4 && <div className="absolute -top-1.5 left-0 w-4 h-4 bg-white rounded-full border-4 border-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/50"></div>}
                </div>
              ))}
           </div>
           <div className="text-white font-black text-xs border-l border-white/10 pl-6">
              2026 SEASON
           </div>
        </div>
      </main>

      {/* Right Analysis Sidebar */}
      <aside className="w-80 border-l-2 border-black p-6 flex flex-col gap-6 bg-white overflow-y-auto z-20">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-2">
           {['Analysis', 'Climate'].map(t => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === t ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:text-black'}`}
             >
               {t}
             </button>
           ))}
        </div>

        {activeTab === 'Analysis' ? (
          <>
            <AnalysisCard title="Yield Prediction" icon={<TrendingUp />}>
              <div className="text-3xl font-black tracking-tighter mb-1">1,240 <span className="text-sm font-bold text-black/40">MT</span></div>
              <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-bold">
                <TrendingUp size={12} />
                <span>+8.4% vs Baseline</span>
              </div>
              <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--brand-primary)] w-[75%]"></div>
              </div>
            </AnalysisCard>

            <AnalysisCard title="NDVI Trend" icon={<Activity />}>
              <div className="h-24 flex items-end gap-1 px-1">
                {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-black rounded-t-sm hover:bg-[var(--brand-primary)] transition-colors cursor-help"
                    style={{ height: `${h}%` }}
                    title={`Pass ${i}: 0.${h}`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-black text-black/30">
                <span>WEEKS 01-12</span>
                <span>PEAK</span>
              </div>
            </AnalysisCard>

            <AnalysisCard title="Block Risk Audit" icon={<AlertTriangle />}>
              <div className="space-y-3">
                {[
                  { b: 'Ogba Block A', r: 'High', c: 'text-red-500' },
                  { b: 'Irele Sector 2', r: 'Low', c: 'text-emerald-500' },
                  { b: 'Ore Main Ridge', r: 'Med', c: 'text-amber-500' },
                ].map(item => (
                  <div key={item.b} className="flex justify-between items-center border-b border-black/5 pb-2">
                    <span className="text-[11px] font-bold">{item.b}</span>
                    <span className={`text-[10px] font-black uppercase ${item.c}`}>{item.r} RISK</span>
                  </div>
                ))}
              </div>
            </AnalysisCard>
          </>
        ) : (
          <>
            <AnalysisCard title="Local Weather" icon={<CloudRain />}>
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-4xl font-black tracking-tighter">28°C</div>
                    <div className="text-[11px] font-bold text-black/40 uppercase">Scattered Clouds</div>
                  </div>
                  <CloudRain size={32} className="text-blue-500" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <div className="text-[9px] font-black text-black/40 uppercase mb-1">Humidity</div>
                    <div className="text-xs font-black">74%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <div className="text-[9px] font-black text-black/40 uppercase mb-1">UV Index</div>
                    <div className="text-xs font-black">Low (2)</div>
                  </div>
               </div>
            </AnalysisCard>

            <AnalysisCard title="Soil Moisture Forecast" icon={<Activity />}>
               <div className="space-y-4">
                  {[
                    { d: 'MON', v: 42, s: 'Stable' },
                    { d: 'TUE', v: 38, s: 'Decreasing' },
                    { d: 'WED', v: 35, s: 'Critical' },
                  ].map(day => (
                    <div key={day.d}>
                      <div className="flex justify-between text-[10px] font-black mb-1">
                        <span>{day.d}</span>
                        <span className={day.v < 40 ? 'text-amber-600' : 'text-emerald-600'}>{day.v}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${day.v < 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${day.v}%` }}></div>
                      </div>
                    </div>
                  ))}
               </div>
            </AnalysisCard>
          </>
        )}

        <button className="mt-auto w-full bg-black text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-[var(--brand-primary)] transition-all flex items-center justify-center gap-3 group">
          <Globe size={18} className="group-hover:rotate-180 transition-transform duration-1000" />
          <span>Export GeoJSON</span>
        </button>
      </aside>
    </div>
  );
};

export default MonitoringDashboard;
