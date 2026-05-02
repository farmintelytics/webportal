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
        return (
          <div className="flex-1 relative flex overflow-hidden animate-in fade-in duration-500">
             <div className="flex-1 bg-gray-200 relative">
                <MapContainer center={[6.5244, 3.3792]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                   <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                   <ZoomControl position="bottomright" />
                </MapContainer>
                
                {/* Floating Top Bar HUD */}
                <div className="absolute top-8 left-8 right-8 z-[1000] flex justify-between pointer-events-none">
                   <div className="pointer-events-auto flex gap-4">
                      <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-xl flex items-center gap-6">
                         <Satellite size={18} className="text-emerald-600" />
                         <div>
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Active Layer</div>
                            <div className="text-[12px] font-black text-gray-900 leading-none">{activeLayer}</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Layer Selector Overlay */}
                <div className="absolute top-28 left-8 z-[1000] w-72 pointer-events-auto">
                   <SimpleCard title="Map Selection" icon={<Layers size={18} />}>
                      <div className="space-y-1.5">
                         {[
                           { id: 'Satellite', label: 'Optical Fusion', icon: <Globe size={14}/>, color: 'bg-gray-500' },
                           { id: 'Carbon Density', label: 'Carbon Heatmap', icon: <Leaf size={14}/>, color: 'bg-emerald-500' },
                           { id: 'Forestry Mask', label: 'HCS Forest Mask', icon: <Trees size={14}/>, color: 'bg-green-600' },
                           { id: 'Degradation', label: 'Forest Degradation', icon: <Zap size={14}/>, color: 'bg-orange-500' },
                         ].map(layer => (
                           <button 
                             key={layer.id} 
                             onClick={() => setActiveLayer(layer.id)}
                             className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                               activeLayer === layer.id ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm' : 'bg-white border-transparent text-gray-400 hover:bg-gray-50'
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
          <div className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto h-full">
             <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Plots Carbon Inventory</h2>
                   <p className="text-[14px] text-gray-400 font-medium">Granular carbon stock analysis per verified land plot</p>
                </div>
                <div className="flex gap-4">
                   <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                      <Search size={16} className="text-gray-400" />
                      <input type="text" placeholder="Search Plot ID..." className="outline-none text-[12px] font-bold w-48" />
                   </div>
                   <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">Download Report</button>
                </div>
             </div>
             <SimpleCard title="Interactive Plot Ledger" subtitle="Verified environmental data per industrial and smallholder block" icon={<Shield size={20} />}>
                <WorkerActivityTable data={carbonData} columns={columns} />
             </SimpleCard>
          </div>
        );
      default:
        return (
          <div className="p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <MetricTile label="Aggregate Carbon Stock" value="352k" unit="tCO2e" color="bg-emerald-600" />
               <MetricTile label="Net Zero Progress" value="72" unit="%" color="bg-emerald-600" />
               <MetricTile label="Verification Grade" value="A+" unit="GRADE" color="bg-emerald-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SimpleCard title="Geospatial Biomass Preview" icon={<Globe size={20} />}>
                  <div className="h-[380px] rounded-2xl overflow-hidden">
                     <GeospatialPreview title="Carbon Density Layer" points={[]} full={true} />
                  </div>
               </SimpleCard>
               <SimpleCard title="Temporal Sequestration Trend" icon={<BarChart4 size={20} />}>
                  <div className="p-10 text-center border-2 border-dashed border-gray-50 rounded-[2.5rem] h-full flex flex-col items-center justify-center">
                     <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Carbon Sequestration Charting</p>
                  </div>
               </SimpleCard>
            </div>
          </div>
        );
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
