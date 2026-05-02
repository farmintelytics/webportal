import React, { useState } from 'react';
import { 
  Leaf, 
  Globe, 
  Trees, 
  Activity, 
  ArrowLeft,
  LogOut,
  Layers,
  Satellite,
  CheckCircle2,
  BarChart4,
  TrendingUp,
  Wind,
  Droplets,
  Zap,
  LayoutDashboard,
  Calendar,
  Map as MapIcon,
  Maximize2,
  Search,
  Filter,
  Eye,
  Shield,
  User,
  Bell
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  SimpleCard, 
  MetricTile, 
  WorkerActivityTable, 
  GeospatialPreview, 
  FilterBar 
} from '../../shared/components/SharedComponents';

import OverviewSection from './sections/OverviewSection';
import GeospatialSection from './sections/GeospatialSection';
import PlotsSection from './sections/PlotsSection';

const SustainabilityPortal = ({ title, type, onSignOut, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeLayer, setActiveLayer] = useState('Carbon Density');
  const [userName] = useState('Admin Manager');

  const carbonData = [
    { id: 'P-RICE-01', area: '4.2 HA', carbonStock: '124.2 tCO2e', health: '98%', landUse: 'Primary Forest', status: 'Verified' },
    { id: 'P-CAS-12', area: '2.8 HA', carbonStock: '42.8 tCO2e', health: '92%', landUse: 'Agroforestry', status: 'Active' },
    { id: 'P-FFB-09', area: '12.5 HA', carbonStock: '185.4 tCO2e', health: '95%', landUse: 'Industrial', status: 'Verified' },
  ];

  const columns = [
    { key: 'id', label: 'Plot ID' },
    { key: 'area', label: 'Land Area' },
    { key: 'landUse', label: 'Land Classification' },
    { key: 'carbonStock', label: 'Carbon Stock', render: (val) => <span className="text-[13px] font-black text-emerald-600 italic">{val}</span> },
    { key: 'health', label: 'Canopy Health', render: (val) => <span className="text-emerald-500 font-bold">{val}</span> },
    { key: 'status', label: 'MRV Status' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'geospatial':
        return <GeospatialSection activeLayer={activeLayer} setActiveLayer={setActiveLayer} />;
      case 'plots':
        return <PlotsSection carbonData={carbonData} columns={columns} />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden font-sans antialiased">
      {/* Premium Top Navigation */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-[1100] shadow-sm">
         <div className="flex items-center gap-10">
            <button onClick={onBack} className="flex items-center gap-2 group">
               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                  <ArrowLeft size={18} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Exit to Hub</span>
                  <span className="text-[14px] font-black tracking-tight mt-1">FarmIntelytics</span>
               </div>
            </button>

            <div className="w-px h-8 bg-gray-100"></div>

            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center p-2 shadow-lg ring-4 ring-emerald-50">
                  <Leaf className="text-white" size={20} />
               </div>
               <div>
                  <h1 className="text-lg font-black tracking-tighter leading-none">{title} <span className="text-gray-400 italic font-medium ml-1">Core Intelligence</span></h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mt-1">Sustainability Node: Active</p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <div className="text-[11px] font-black text-gray-900 leading-none">{userName}</div>
                  <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Sustainability Auditor</div>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-emerald-50">
                  <User size={20} className="text-gray-400" />
               </div>
            </div>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar Navigation */}
         <aside className="w-80 bg-white border-r border-gray-100 flex flex-col z-[1050] shadow-2xl">
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
               <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-4 mb-4">Sustainability Menu</div>
               {[
                 { id: 'overview', label: 'Dashboard Hub', icon: <LayoutDashboard size={18}/> },
                 { id: 'geospatial', label: 'Geospatial Intel', icon: <MapIcon size={18}/> },
                 { id: 'plots', label: 'Plots Analytics', icon: <BarChart4 size={18}/> },
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
                     activeTab === tab.id ? 'bg-gray-900 text-white shadow-xl translate-x-2' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                   }`}
                 >
                    {React.cloneElement(tab.icon, { size: 18 })}
                    <span className="text-[12px] font-black uppercase tracking-widest">{tab.label}</span>
                 </button>
               ))}
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100">
               <button onClick={onSignOut} className="w-full bg-red-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl text-[11px] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-red-100">
                  <LogOut size={16} /> Sign Out
               </button>
            </div>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
            {renderContent()}
         </main>
      </div>
    </div>
  );
};

export default SustainabilityPortal;
