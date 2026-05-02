import React, { useState, useMemo } from 'react';
import {
   Globe,
   Layers,
   Satellite,
   Map as MapIcon,
   Activity,
   Zap,
   Droplets,
   Sun,
   Trees,
   CheckCircle2,
   BarChart4,
   TrendingUp,
   LayoutDashboard,
   Calendar,
   Maximize2,
   Search,
   Filter,
   Shield,
   User,
   Bell,
   X,
   Info,
   Navigation,
   RefreshCw,
   FileText,
   History,
   Settings2,
   ChevronDown,
   ChevronUp,
   Clock,
   ArrowRight,
   SlidersHorizontal,
   MapPin,
   LineChart,
   Waves,
   Thermometer,
   CloudRain,
   Leaf,
   Download,
   ChevronRight,
   ChevronLeft,
  Grid
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
   SimpleCard,
   MetricTile,
   WorkerActivityTable
} from '../../../shared/components/SharedComponents';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   RadialLinearScale,
   Title,
   Tooltip,
   Legend as ChartLegend,
   Filler
} from 'chart.js';

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   RadialLinearScale,
   Title,
   Tooltip,
   ChartLegend,
   Filler
);

const CONFIG = {
   primaryColor: 'lime',
   theme: 'Root / Starch Potential Focused',
   indices: [
      { id: 'NDVI', label: 'Biomass (NDVI)', legend: 'Sparse - Dense', color: 'from-amber-50 to-emerald-900', active: true, opacity: 80 },
      { id: 'NDRE', label: 'Chlorophyll (NDRE)', legend: 'Low - High', color: 'from-gray-100 to-teal-600', active: false, opacity: 80 },
      { id: 'LSWI', label: 'Moisture (LSWI)', legend: 'Dry - Moist', color: 'from-stone-200 to-sky-600', active: false, opacity: 60 },
   ],
   kpis: [
      { label: 'Leaf Area Index', value: 'OPTIMAL', unit: 'LAI', icon: <Activity /> },
      { label: 'Starch Proxy', value: '0.65', unit: 'NDVI', icon: <Zap /> },
      { label: 'Harvest Ready', value: '85', unit: '%', icon: <CheckCircle2 /> },
   ],
   layman: {
      health: 'Vegetation density is optimal. Tuber development is proceeding normally.',
      stress: 'Water stress detected. Supplemental irrigation recommended for yield preservation.',
      yield: 'Current LAI trajectory predicts 24.8 MT/ha harvest tonnage.'
   },
   drillDownType: 'Tuber Maturity Anomaly'
};

const CassavaMonitoring = ({ onBack }) => {
   const [activeTab, setActiveTab] = useState('overview');
   const [showLayerList, setShowLayerList] = useState(true);
   const [dateRange, setDateRange] = useState('Current Season Analytics');
   const [userName] = useState('Admin Manager');
   const [selectedPlot, setSelectedPlot] = useState(null);

   const [layers, setLayers] = useState([
      { id: 'google', label: 'Google Satellite', active: true, opacity: 100, legend: 'Natural Color', color: 'from-gray-500 to-gray-900', url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' },
      ...CONFIG.indices
   ]);

   const plots = [
      { id: `B-CAS-01`, area: '4.2 HA', health: '98%', status: 'Healthy', ndvi: 0.72, layman: CONFIG.layman.health, advice: 'No action needed.', history: [0.3, 0.45, 0.58, 0.72, 0.75, 0.72] },
      { id: `B-CAS-04`, area: '2.8 HA', health: '35%', status: 'Stressed', ndvi: 0.35, layman: CONFIG.layman.stress, advice: 'Inspect and apply remediation.', history: [0.3, 0.32, 0.40, 0.38, 0.35, 0.33] },
   ];

   const columns = [
      { key: 'id', label: 'Plot ID' },
      { key: 'area', label: 'Area' },
      { key: 'health', label: 'Health Score', render: (val) => <span className={`font-bold ${parseInt(val) < 40 ? 'text-red-500' : 'text-emerald-500'}`}>{val}</span> },
      { key: 'status', label: 'Status', render: (val) => <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${val === 'Stressed' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{val}</span> },
      { key: 'layman', label: 'Field Summary' },
      { key: 'action', label: 'Analysis', render: (_, row) => <button onClick={() => { setSelectedPlot(row); setActiveTab('geospatial'); }} className="text-sky-600 font-bold uppercase text-[10px] hover:underline">Drill Down</button> }
   ];

   const renderContent = () => {
      switch (activeTab) {
         case 'geospatial':
            return (
               <div className="flex-1 flex flex-col relative animate-in fade-in duration-500">
                  <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-[1010]">
                     <div className="flex items-center gap-6 flex-1 max-w-4xl">
                        <div className="relative flex-1">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                           <input type="text" placeholder="Locate Cassava Plot..." className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-12 pr-4 text-[12px] font-bold outline-none focus:border-emerald-500 transition-all" />
                        </div>
                     </div>
                     <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 italic">Sentinel-2 Multispectral Standard</div>
                  </div>

                  <div className="flex-1 bg-gray-200 relative overflow-hidden">
                     <MapContainer center={[6.5244, 3.3792]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        {layers.filter(l => l.active).map(layer => (
                           <TileLayer key={layer.id} url={layer.url || "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"} opacity={layer.opacity / 100} />
                        ))}
                        {plots.map(plot => (
                           <Polygon key={plot.id} positions={[[6.5244, 3.3792], [6.5264, 3.3792], [6.5264, 3.3812], [6.5244, 3.3812]]} pathOptions={{ color: '#10b981', fillOpacity: 0.2 }} eventHandlers={{ click: () => setSelectedPlot(plot) }} />
                        ))}
                        <ZoomControl position="bottomleft" />
                     </MapContainer>

                     <div className={`absolute top-4 right-4 z-[1000] flex flex-col transition-all duration-300 pointer-events-none ${showLayerList ? 'w-64' : 'w-12'}`}>
                        <div className="bg-gray-900 text-white shadow-2xl rounded-none flex flex-col pointer-events-auto overflow-hidden border border-gray-800">
                           <div className="p-3 flex items-center justify-between border-b border-gray-800 bg-black/50">
                              <div className={`flex items-center gap-2 ${!showLayerList && 'hidden'}`}>
                                 <Layers size={14} className="text-emerald-500" />
                                 <span className="text-[9px] font-bold uppercase tracking-widest leading-none text-white">GIS Intelligence</span>
                              </div>
                              <button onClick={() => setShowLayerList(!showLayerList)} className={`p-1.5 hover:bg-gray-800 rounded-none transition-all ${!showLayerList && 'w-full flex justify-center'}`}>
                                 {showLayerList ? <ChevronRight size={14} /> : <Layers size={20} className="text-emerald-500" />}
                              </button>
                           </div>
                           {showLayerList && (
                              <div className="flex-1 overflow-y-auto p-4 space-y-5 animate-in fade-in duration-300">
                                 {layers.map(layer => (
                                    <div key={layer.id} className="space-y-2">
                                       <button onClick={() => setLayers(layers.map(l => l.id === layer.id ? { ...l, active: !l.active } : l))} className="flex items-center gap-2 group text-left w-full">
                                          <div className={`w-3 h-3 rounded-none border transition-all shrink-0 flex items-center justify-center ${layer.active ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}>{layer.active && <CheckCircle2 size={8} className="text-black" />}</div>
                                          <span className={`text-[8px] font-bold uppercase tracking-widest leading-tight ${layer.active ? 'text-emerald-400' : 'text-gray-500'}`}>{layer.label}</span>
                                       </button>
                                       {layer.active && (
                                          <div className="pl-5 space-y-2">
                                             <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[7px] font-bold text-gray-500 uppercase tracking-widest"><span>{layer.legend}</span><span>{layer.opacity}%</span></div>
                                                <div className={`h-1 w-full rounded-none bg-gradient-to-r ${layer.color}`}></div>
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>

                        {selectedPlot && showLayerList && (
                           <div className="mt-4 bg-gray-900 border border-gray-800 rounded-none p-5 shadow-2xl animate-in slide-in-from-right-10 duration-500 pointer-events-auto flex flex-col gap-4">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-1 leading-none italic">{CONFIG.drillDownType}</div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">{selectedPlot.id}</h3>
                                 </div>
                                 <button onClick={() => setSelectedPlot(null)} className="p-1.5 hover:bg-gray-800 rounded-none transition-all text-gray-500"><X size={16} /></button>
                              </div>
                              <div className="bg-black/50 p-4 rounded-none border border-gray-800">
                                 <div className="text-[8px] font-bold text-gray-500 uppercase mb-2 italic">Summary</div>
                                 <p className="text-[11px] font-bold italic leading-tight text-emerald-100">"{selectedPlot.layman}"</p>
                              </div>
                              <div className="space-y-2">
                                 <div className="flex items-center justify-between px-1">
                                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none italic">Trend</span>
                                    <TrendingUp size={10} className="text-emerald-500" />
                                 </div>
                                 <div className="h-24 bg-black rounded-none p-2 border border-gray-800">
                                    <Line
                                       data={{
                                          labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
                                          datasets: [{ fill: true, data: selectedPlot.history, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4, pointRadius: 0 }]
                                       }}
                                       options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 6 } } } } }}
                                    />
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 pt-3 border-t border-gray-800 space-y-2">
                                 <Zap size={12} className="text-emerald-500" />
                                 <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300 italic leading-tight">{selectedPlot.advice}</span>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            );
         case 'plots':
            return (
               <div className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto h-full bg-gray-50/50">
                  <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Cassava Analytical Ledger</h2>
                        <p className="text-[14px] text-gray-400 font-medium mt-1">Literature-validated remote sensing outputs aggregated per farm block</p>
                     </div>
                     <div className="flex gap-4">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                           <Search size={16} className="text-gray-400" />
                           <input type="text" placeholder="Search Plot ID..." className="outline-none text-[12px] font-bold w-48" />
                        </div>
                     </div>
                  </div>
                  <SimpleCard title="Verified Farm Data" icon={<Shield size={20} />}>
                     <WorkerActivityTable data={plots} columns={columns} />
                  </SimpleCard>
               </div>
            );
         default:
            return (
               <div className="p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full bg-gray-50/50">
                  <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"><Calendar size={20} /></div>
                        <div>
                           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none italic">Theme: {CONFIG.theme}</div>
                           <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="text-lg font-black italic uppercase outline-none bg-transparent cursor-pointer mt-1">
                              <option>Current Season Analytics</option>
                              <option>Historical Time-Series</option>
                           </select>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <button className="px-6 py-2.5 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg">Download Report</button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {CONFIG.kpis.map((kpi, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-2xl transition-all">
                           <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                              {React.cloneElement(kpi.icon, { size: 24 })}
                           </div>
                           <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">{kpi.label}</div>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-3xl font-black italic tracking-tighter uppercase">{kpi.value}</span>
                                 <span className="text-[12px] font-bold text-gray-300">{kpi.unit}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <SimpleCard title="Cassava Growth Trajectory" icon={<TrendingUp size={20} />}>
                        <div className="h-[300px] mt-6">
                           <Line data={{
                              labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
                              datasets: [
                                 { label: 'Mean NDVI', data: [0.4, 0.45, 0.6, 0.74, 0.72, 0.68], borderColor: '#10b981', tension: 0.4, fill: true, backgroundColor: 'rgba(16, 185, 129, 0.05)' },
                                 { label: 'Nutrient/Water Proxy', data: [0.35, 0.38, 0.42, 0.55, 0.52, 0.48], borderColor: '#3b82f6', tension: 0.4, borderDash: [5, 5] }
                              ]
                           }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' } } } } }} />
                        </div>
                     </SimpleCard>

                     <SimpleCard title="Physiological Health Matrix" icon={<Activity size={20} />}>
                        <div className="h-[300px] mt-6 flex items-center justify-center">
                           <Radar
                              data={{
                                 labels: ['NDVI', 'NDRE', 'LSWI', 'LST', 'VHI', 'EVI'],
                                 datasets: [{
                                    label: 'Active Blocks Mean',
                                    data: [85, 74, 62, 45, 90, 80],
                                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                    borderColor: '#10b981',
                                    pointBackgroundColor: '#10b981',
                                 }]
                              }}
                              options={{
                                 scales: { r: { angleLines: { display: false }, suggestedMin: 0, suggestedMax: 100, ticks: { display: false } } },
                                 plugins: { legend: { display: false } }
                              }}
                           />
                        </div>
                     </SimpleCard>
                  </div>
               </div>
            );
      }
   };

   return (
      <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden font-sans antialiased">
         <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 z-[1100] shadow-sm">
            <div className="flex items-center gap-8">
               <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"><ChevronLeft size={24} /></button>
               <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center p-2 shadow-lg ring-4 ring-gray-50"><Satellite className="text-white" size={24} /></div>
               <div>
                  <h1 className="text-lg font-black tracking-tighter leading-none uppercase italic">Cassava <span className="text-gray-400 font-medium ml-1">Monitoring & RS</span></h1>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600 mt-1 leading-none italic uppercase">Theme: {CONFIG.theme}</p>
               </div>
            </div>
            <div className="flex items-center gap-10">
               <div className="flex items-center gap-4">
                  <div className="text-right">
                     <div className="text-[11px] font-bold text-gray-900 leading-none italic uppercase">{userName}</div>
                     <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 italic">Enterprise Auditor</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-emerald-50 shadow-sm">
                     <User size={20} className="text-gray-400" />
                  </div>
               </div>
            </div>
         </header>
         <div className="flex-1 flex overflow-hidden">
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col z-[1050]">
               <div className="flex-1 overflow-y-auto p-6 space-y-1.5">
                  <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] px-4 mb-4 leading-none italic">Analytical Center</div>
                  {[
                     { id: 'overview', label: 'Operational Center', icon: <LayoutDashboard /> },
                     { id: 'geospatial', label: 'Geospatial Intel', icon: <MapIcon /> },
                     { id: 'plots', label: 'Plots Analytics', icon: <BarChart4 /> },
                  ].map(tab => (
                     <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-xl translate-x-2' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}>{React.cloneElement(tab.icon, { size: 18 })}<span className="text-[12px] font-bold uppercase tracking-widest">{tab.label}</span></button>
                  ))}
               </div>
               <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-2">
                                    <button onClick={onBack} className="w-full bg-white text-gray-700 border border-gray-200 font-bold uppercase tracking-widest py-4 rounded-2xl text-[11px] flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-sm"><Grid size={16} /> Back to Hub</button>

               </div>
            </aside>
            <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">{renderContent()}</main>
         </div>
      </div>
   );
};

export default CassavaMonitoring;
