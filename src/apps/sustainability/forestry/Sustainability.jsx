import React, { useState } from 'react';
import {
   Leaf,
   Globe,
   Trees,
   Activity,
   ArrowLeft,
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
   Bell,
   ChevronLeft,
  Grid
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
   SimpleCard,
   MetricTile,
   WorkerActivityTable,
   GeospatialPreview,
   FilterBar
} from '../../../shared/components/SharedComponents';

const ForestrySustainability = ({ onBack }) => {
   const [activeTab, setActiveTab] = useState('overview');
   const [activeLayer, setActiveLayer] = useState('Forestry Mask');
   const [userName] = useState('Admin Manager');

   const carbonData = [
      { id: 'F-PROT-01', area: '1,240 HA', carbonStock: '842,420 tCO2e', health: '99%', landUse: 'Primary Forest (Protected)', status: 'Verified' },
      { id: 'F-BUFF-12', area: '420 HA', carbonStock: '142,800 tCO2e', health: '96%', landUse: 'Buffer Zone', status: 'Active' },
      { id: 'F-REST-09', area: '215 HA', carbonStock: '65,400 tCO2e', health: '85%', landUse: 'Restoration Area', status: 'In Progress' },
   ];

   const columns = [
      { key: 'id', label: 'Forest Block' },
      { key: 'area', label: 'Land Area' },
      { key: 'landUse', label: 'Classification' },
      { key: 'carbonStock', label: 'Carbon Stock', render: (val) => <span className="text-[13px] font-bold text-emerald-600">{val}</span> },
      { key: 'health', label: 'Canopy Health', render: (val) => <span className="text-emerald-500 font-bold">{val}</span> },
      { key: 'status', label: 'MRV Status' },
   ];

   const renderContent = () => {
      switch (activeTab) {
         case 'geospatial':
            return (
               <div className="flex-1 relative flex overflow-hidden animate-in fade-in duration-500">
                  <div className="flex-1 bg-gray-200 relative">
                     <MapContainer center={[6.5244, 3.3792]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                        <ZoomControl position="bottomright" />
                     </MapContainer>

                     <div className="absolute top-8 left-8 right-8 z-[1000] flex justify-between pointer-events-none">
                        <div className="pointer-events-auto flex gap-4">
                           <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-xl flex items-center gap-6">
                              <Satellite size={18} className="text-emerald-600" />
                              <div>
                                 <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Active Layer</div>
                                 <div className="text-[12px] font-bold text-gray-900 leading-none">{activeLayer}</div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="absolute top-28 left-8 z-[1000] w-72 pointer-events-auto">
                        <SimpleCard title="Map Selection" icon={<Layers size={18} />}>
                           <div className="space-y-1.5">
                              {[
                                 { id: 'Satellite', label: 'Optical Fusion', icon: <Globe size={14} />, color: 'bg-gray-500' },
                                 { id: 'Carbon Density', label: 'Carbon Heatmap', icon: <Leaf size={14} />, color: 'bg-emerald-500' },
                                 { id: 'Forestry Mask', label: 'HCS Forest Mask', icon: <Trees size={14} />, color: 'bg-green-600' },
                                 { id: 'Degradation', label: 'Forest Degradation', icon: <Zap size={14} />, color: 'bg-orange-500' },
                              ].map(layer => (
                                 <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${activeLayer === layer.id ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm' : 'bg-white border-transparent text-gray-400 hover:bg-gray-50'
                                       }`}
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className={`w-2 h-2 rounded-full ${layer.color}`}></div>
                                       <span className="text-[12px] font-bold">{layer.label}</span>
                                    </div>
                                    {activeLayer === layer.id && <CheckCircle2 size={14} className="text-emerald-600" />}
                                 </button>
                              ))}
                           </div>
                        </SimpleCard>
                     </div>
                  </div>
               </div>
            );
         case 'plots':
            return (
               <div className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto h-full bg-gray-50/50">
                  <div className="flex justify-between items-end">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Forest Carbon Inventory</h2>
                        <p className="text-[14px] text-gray-400 font-medium">High-resolution sequestration monitoring for forest assets</p>
                     </div>
                     <div className="flex gap-4">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                           <Search size={16} className="text-gray-400" />
                           <input type="text" placeholder="Search Block ID..." className="outline-none text-[12px] font-bold w-48" />
                        </div>
                        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg">Report</button>
                     </div>
                  </div>
                  <SimpleCard title="Interactive Forest Ledger" icon={<Shield size={20} />}>
                     <WorkerActivityTable data={carbonData} columns={columns} />
                  </SimpleCard>
               </div>
            );
         default:
            return (
               <div className="p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full bg-gray-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <MetricTile label="Total Forest Carbon" value="4.2M" unit="tCO2e" color="bg-emerald-600" />
                     <MetricTile label="Conservation Rate" value="99.2" unit="%" color="bg-emerald-600" />
                     <MetricTile label="Biodiversity Index" value="8.4" unit="SCORE" color="bg-emerald-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <SimpleCard title="Canopy Density Matrix" icon={<Globe size={20} />}>
                        <div className="h-[380px] rounded-2xl overflow-hidden border border-gray-100">
                           <GeospatialPreview title="Forestry Mask Layer" points={[]} full={true} />
                        </div>
                     </SimpleCard>
                     <SimpleCard title="Carbon Accumulation Trend" icon={<BarChart4 size={20} />}>
                        <div className="p-10 text-center bg-white rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center">
                           <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Forest Sequestration Charting</p>
                           <div className="text-2xl font-black text-emerald-600 mt-4">+2.4% vs L.Y.</div>
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
               <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center p-2 shadow-lg ring-4 ring-emerald-50">
                  <Leaf className="text-white" size={24} />
               </div>
               <div>
                  <h1 className="text-lg font-black tracking-tighter leading-none uppercase text-gray-900">Forestry Sustainability <span className="text-gray-400 font-medium ml-1">Center</span></h1>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600 mt-1">Sustainability Node: Active</p>
               </div>
            </div>

            <div className="flex items-center gap-10">
               <div className="flex items-center gap-4">
                  <div className="text-right">
                     <div className="text-[11px] font-bold text-gray-900 leading-none">{userName}</div>
                     <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Sustainability Auditor</div>
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
                  <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] px-4 mb-4 italic">Sustainability Menu</div>
                  {[
                     { id: 'overview', label: 'Dashboard Hub', icon: <LayoutDashboard /> },
                     { id: 'geospatial', label: 'Geospatial Intel', icon: <MapIcon /> },
                     { id: 'plots', label: 'Plots Analytics', icon: <BarChart4 /> },
                  ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-xl translate-x-2' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                           }`}
                     >
                        {React.cloneElement(tab.icon, { size: 18 })}
                        <span className="text-[12px] font-bold uppercase tracking-widest">{tab.label}</span>
                     </button>
                  ))}
               </div>

               <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-2">
                                    <button onClick={onBack} className="w-full bg-white text-gray-700 border border-gray-200 font-bold uppercase tracking-widest py-4 rounded-2xl text-[11px] flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-sm"><Grid size={16} /> Back to Hub</button>

               </div>
            </aside>

            <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
               {renderContent()}
            </main>
         </div>
      </div>
   );
};

export default ForestrySustainability;
