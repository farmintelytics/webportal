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
  Search,
  Download,
  Share2
} from 'lucide-react';

import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartLegend
);

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-[var(--brand-primary)] text-white' 
        : 'text-black hover:bg-gray-100'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })}
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const AnalysisCard = ({ title, children, icon }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/5 shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      {icon && React.cloneElement(icon, { size: 16, className: 'text-[var(--brand-primary)]' })}
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">{title}</h4>
    </div>
    {children}
  </div>
);

const MonitoringPortal = ({ cropName = "Oil Palm", sensor = "Sentinel-2", onBack }) => {
  const [activeLayer, setActiveLayer] = useState('Satellite');
  const [activeTab, setActiveTab] = useState('Insights');
  const [selectedMonth, setSelectedMonth] = useState(3); // APR

  const months = ['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];

  // Map configuration
  const center = [6.5244, 3.3792]; 
  const zoom = 14;

  const mapLayers = {
    'Satellite': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    'Terrain': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    'NDVI': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
  };

  // Simulated farm blocks for GIS feel
  const blocks = [
    { id: 'BLK-A1', coords: [[6.53, 3.37], [6.535, 3.37], [6.535, 3.38], [6.53, 3.38]], health: 0.85, status: 'Healthy' },
    { id: 'BLK-B2', coords: [[6.52, 3.375], [6.525, 3.375], [6.525, 3.385], [6.52, 3.385]], health: 0.42, status: 'Stressed' },
    { id: 'BLK-C3', coords: [[6.51, 3.38], [6.515, 3.38], [6.515, 3.39], [6.51, 3.39]], health: 0.71, status: 'Stable' },
  ];

  const chartData = {
    labels: ['Pass 1', 'Pass 2', 'Pass 3', 'Pass 4', 'Pass 5', 'Pass 6'],
    datasets: [{
      label: 'NDVI Index',
      data: [0.42, 0.58, 0.65, 0.82, 0.78, 0.85],
      borderColor: '#16A34A',
      backgroundColor: 'rgba(22, 163, 74, 0.2)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#000',
      borderWidth: 3,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { 
      y: { min: 0, max: 1, grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } },
      x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } }
    }
  };

  return (
    <div className="h-screen flex bg-white text-black overflow-hidden font-sans border-t-8 border-black">
      {/* Left Navigation Sidebar */}
      <aside className="w-72 border-r-2 border-black p-6 flex flex-col gap-8 bg-white z-20">
        <div className="mb-2">
           <button 
             onClick={onBack}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-[var(--brand-primary)] transition-colors mb-6 group"
           >
             <RotateCcw size={12} className="group-hover:-rotate-90 transition-transform" />
             Return to Hub
           </button>
          <div className="text-[10px] font-black text-[var(--brand-primary)] uppercase tracking-[0.3em] mb-1">Geospatial Intelligence</div>
          <h1 className="text-2xl font-black tracking-tighter leading-none">{cropName} Monitoring</h1>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-black/30 mb-4 px-2">Satellite Map Views</div>
          <SidebarItem icon={<Globe />} label="Satellite View" active={activeLayer === 'Satellite'} onClick={() => setActiveLayer('Satellite')} />
          <SidebarItem icon={<MapIcon />} label="Terrain / Ops" active={activeLayer === 'Terrain'} onClick={() => setActiveLayer('Terrain')} />
          
          <div className="pt-8 space-y-2">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-black/30 mb-4 px-2">Vegetation Indices</div>
            <SidebarItem icon={<Activity />} label="NDVI Index" active={activeLayer === 'NDVI'} onClick={() => setActiveLayer('NDVI')} />
            <SidebarItem icon={<Zap />} label="SAR Radar" />
            <SidebarItem icon={<CloudRain />} label="Soil Moisture" />
          </div>
        </div>

        <div className="pt-6 border-t-2 border-black/5">
          <AnalysisCard title="Legend" icon={<Layers />}>
            <div className="space-y-2.5">
              {[
                { label: 'High Yield', color: 'bg-emerald-500' },
                { label: 'Healthy', color: 'bg-green-400' },
                { label: 'Under-performing', color: 'bg-amber-400' },
                { label: 'Cleared/Stressed', color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-1 rounded-full ${item.color}`}></div>
                  <span className="text-[9px] font-black text-black/60 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </AnalysisCard>
        </div>
      </aside>

      {/* Main Map View Port */}
      <main className="flex-1 relative bg-slate-900 overflow-hidden">
        <div className="absolute top-8 left-8 right-8 z-[1000] flex justify-between items-start pointer-events-none">
          <div className="flex gap-4 pointer-events-auto">
             <div className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-5">
                <Satellite size={22} className="text-[var(--brand-primary)]" />
                <div>
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Satellite Mission</div>
                   <div className="text-xs font-black">{sensor} · 10m Ground Res</div>
                </div>
             </div>
             <div className="bg-white text-black px-6 py-3 rounded-2xl flex items-center gap-5 border-2 border-black">
                <Globe size={22} className="text-black" />
                <div>
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Ortho-rectified</div>
                   <div className="text-xs font-black">UTM Zone 31N · WGS84</div>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-2 pointer-events-auto">
             <button className="bg-black text-white p-3 rounded-xl hover:bg-[var(--brand-primary)] transition-all"><Maximize2 size={20} /></button>
             <button className="bg-black text-white p-3 rounded-xl hover:bg-[var(--brand-primary)] transition-all"><MousePointer2 size={20} /></button>
             <button className="bg-black text-white p-3 rounded-xl hover:bg-[var(--brand-primary)] transition-all"><Share2 size={20} /></button>
          </div>
        </div>

        {/* REAL LEAFLET MAP WITH POLYGONS & POPUPS */}
        <div className="absolute inset-0 z-0">
           <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
             <TileLayer url={mapLayers[activeLayer] || mapLayers.Satellite} attribution='&copy; Esri' />
             
             {blocks.map(block => (
               <Polygon 
                 key={block.id}
                 positions={block.coords}
                 pathOptions={{ 
                   color: block.health > 0.7 ? '#10B981' : block.health > 0.5 ? '#F59E0B' : '#EF4444',
                   fillColor: block.health > 0.7 ? '#10B981' : block.health > 0.5 ? '#F59E0B' : '#EF4444',
                   fillOpacity: 0.3,
                   weight: 2
                 }}
               >
                 <Popup className="agri-popup">
                   <div className="p-2">
                     <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Asset ID</div>
                     <div className="text-sm font-black text-black mb-3">{block.id} · {cropName}</div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase">NDVI</div>
                          <div className="text-xs font-black">{block.health}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase">Status</div>
                          <div className={`text-xs font-black ${block.health > 0.7 ? 'text-emerald-500' : 'text-red-500'}`}>{block.status}</div>
                        </div>
                     </div>
                     <button className="mt-4 w-full bg-black text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Open Analytics</button>
                   </div>
                 </Popup>
               </Polygon>
             ))}

             {activeLayer === 'NDVI' && (
               <div className="absolute inset-0 bg-green-500/10 pointer-events-none z-[400] mix-blend-overlay"></div>
             )}
           </MapContainer>
        </div>

        {/* Bottom Time-Series Slider (Interactive) */}
        <div className="absolute bottom-8 left-8 right-8 z-[1000] flex items-center gap-8 bg-black/95 backdrop-blur-2xl p-7 rounded-[2.5rem] border border-white/10">
           <div className="flex items-center gap-5 border-r border-white/10 pr-8">
              <button className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-[var(--brand-primary)]"><RotateCcw size={18} /></button>
              <div>
                <div className="text-white font-black text-xs tracking-tighter uppercase mb-0.5">Temporal View</div>
                <div className="text-[10px] font-black text-[var(--brand-primary)] uppercase tracking-widest">{months[selectedMonth]} 2026 Analysis</div>
              </div>
           </div>
           <div className="flex-1 flex items-center gap-6">
              {months.map((m, i) => (
                <button 
                  key={m} 
                  onClick={() => setSelectedMonth(i)}
                  className={`flex-1 group relative py-4`}
                >
                  <div className={`h-2 w-full rounded-full transition-all duration-500 ${i <= selectedMonth ? 'bg-[var(--brand-primary)]' : 'bg-white/10'}`}></div>
                  <div className={`absolute -top-6 left-0 text-[10px] font-black transition-colors ${i === selectedMonth ? 'text-[var(--brand-primary)]' : 'text-white/40'}`}>{m}</div>
                  {i === selectedMonth && (
                    <div className="absolute top-2 left-0 w-6 h-6 bg-white rounded-full border-4 border-[var(--brand-primary)] shadow-xl shadow-[var(--brand-primary)]/40 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full animate-ping"></div>
                    </div>
                  )}
                </button>
              ))}
           </div>
        </div>
      </main>

      {/* Right Intelligence Sidebar */}
      <aside className="w-80 border-l-2 border-black p-6 flex flex-col gap-6 bg-white overflow-y-auto z-20">
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl mb-2">
           {['Insights', 'Climate'].map(t => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === t ? 'bg-black text-white shadow-xl' : 'text-black/40 hover:text-black'}`}
             >
               {t}
             </button>
           ))}
        </div>

        {activeTab === 'Insights' ? (
          <>
            <AnalysisCard title="Predicted Yield" icon={<TrendingUp />}>
              <div className="text-4xl font-black tracking-tighter mb-1">{(4820 * (0.8 + selectedMonth * 0.1)).toFixed(0)} <span className="text-sm font-bold text-black/30">MT</span></div>
              <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-black">
                <TrendingUp size={14} />
                <span>SEASONAL HARVEST EST.</span>
              </div>
            </AnalysisCard>

            <AnalysisCard title="NDVI Trend Analysis" icon={<Activity />}>
              <div className="h-40">
                 <Line data={chartData} options={chartOptions} />
              </div>
            </AnalysisCard>

            <AnalysisCard title="Alert History" icon={<AlertTriangle />}>
              <div className="space-y-3.5">
                {[
                  { b: 'Sector 4', r: 'Biomass Loss', c: 'text-red-600' },
                  { b: 'Sector 9', r: 'Soil Dryness', c: 'text-amber-600' },
                ].map(item => (
                  <div key={item.b} className="flex justify-between items-center border-b-2 border-gray-50 pb-2.5">
                    <span className="text-[11px] font-black text-black/80">{item.b}</span>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${item.c}`}>{item.r}</span>
                  </div>
                ))}
              </div>
            </AnalysisCard>
          </>
        ) : (
          <>
            <AnalysisCard title="Micro-Climate" icon={<CloudRain />}>
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-4xl font-black tracking-tighter">31°C</div>
                    <div className="text-[11px] font-black text-black/30 uppercase tracking-widest mt-1">Relative Humidity 68%</div>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <CloudRain size={28} className="text-blue-500" />
                  </div>
               </div>
            </AnalysisCard>

            <AnalysisCard title="Soil Moisture" icon={<Activity />}>
               <div className="space-y-5">
                  {[
                    { d: 'MAY 02', v: 38 },
                    { d: 'MAY 03', v: 34 },
                  ].map(day => (
                    <div key={day.d}>
                      <div className="flex justify-between text-[11px] font-black mb-1.5 uppercase tracking-tighter">
                        <span>{day.d}</span>
                        <span className={day.v < 40 ? 'text-amber-600' : 'text-[var(--brand-primary)]'}>{day.v}% Vol</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${day.v < 40 ? 'bg-amber-500' : 'bg-[var(--brand-primary)]'}`} style={{ width: `${day.v}%` }}></div>
                      </div>
                    </div>
                  ))}
               </div>
            </AnalysisCard>
          </>
        )}

        <button className="mt-auto w-full bg-black text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-[var(--brand-primary)] transition-all border-2 border-black mb-4">
          <span>Export GeoJSON</span>
        </button>
        <div className="text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Powered by Farmintelytics</div>
        </div>
      </aside>
    </div>
  );
};

export default MonitoringPortal;
