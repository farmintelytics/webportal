import React, { useState, useMemo } from 'react';
import {
   ChevronLeft,
   Grid,
   Satellite,
   User,
   LayoutDashboard,
   Map as MapIcon,
   BarChart4,
   Waves,
   Activity,
   Droplets
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

import OverviewSection from './sections/OverviewSection';
import GeospatialSection from './sections/GeospatialSection';
import PlotsSection from './sections/PlotsSection';

const CONFIG = {
   primaryColor: 'emerald',
   theme: 'Flooded / Water-Dependent',
   indices: [
      { id: 'NDWI', label: 'Water Index (NDWI)', legend: 'Dry - Flooded', color: 'from-blue-100 to-blue-700', active: true, opacity: 70 },
      { id: 'SAR', label: 'SAR (Flood Detection)', legend: 'Low - High Backscatter', color: 'from-gray-300 to-indigo-900', active: false, opacity: 60 },
      { id: 'NDVI', label: 'Vegetation (NDVI)', legend: 'Stressed - Healthy', color: 'from-red-400 via-yellow-300 to-emerald-600', active: false, opacity: 80 },
      { id: 'LSWI', label: 'Moisture (LSWI)', legend: 'Deficit - Adequate', color: 'from-orange-100 to-blue-500', active: false, opacity: 80 },
   ],
   kpis: [
      { label: 'Mean NDWI', value: '0.68', unit: 'FLOOD', icon: <Waves /> },
      { label: 'Irrigation Sync', value: '94', unit: '%', icon: <Droplets /> },
      { label: 'SAR Backscatter', value: '-12', unit: 'dB', icon: <Activity /> },
   ],
   layman: {
      health: 'Flooding is optimal. No water stress detected.',
      stress: 'Water levels dropping. Recommend irrigation check.',
      yield: 'Cumulative NDWI predicts yield within target range.'
   },
   drillDownType: 'Hydrology Anomaly'
};

const RiceMonitoring = ({ onBack }) => {
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
      { id: `B-RIC-01`, area: '4.2 HA', health: '98%', status: 'Healthy', ndvi: 0.72, layman: CONFIG.layman.health, advice: 'No action needed.', history: [0.3, 0.45, 0.58, 0.72, 0.75, 0.72] },
      { id: `B-RIC-04`, area: '2.8 HA', health: '35%', status: 'Stressed', ndvi: 0.35, layman: CONFIG.layman.stress, advice: 'Inspect and apply remediation.', history: [0.3, 0.32, 0.40, 0.38, 0.35, 0.33] },
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
            return <GeospatialSection 
                     layers={layers} 
                     setLayers={setLayers} 
                     plots={plots} 
                     selectedPlot={selectedPlot} 
                     setSelectedPlot={setSelectedPlot} 
                     showLayerList={showLayerList} 
                     setShowLayerList={setShowLayerList} 
                     config={CONFIG} 
                  />;
         case 'plots':
            return <PlotsSection plots={plots} columns={columns} />;
         default:
            return <OverviewSection dateRange={dateRange} setDateRange={setDateRange} config={CONFIG} />;
      }
   };

   return (
      <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden font-sans antialiased">
         <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 z-[1100] shadow-sm">
            <div className="flex items-center gap-8">
               <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"><ChevronLeft size={24} /></button>
               <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center p-2 shadow-lg ring-4 ring-gray-50"><Satellite className="text-white" size={24} /></div>
               <div>
                  <h1 className="text-lg font-black tracking-tighter leading-none uppercase italic">Rice <span className="text-gray-400 font-medium ml-1">Monitoring & RS</span></h1>
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

export default RiceMonitoring;
