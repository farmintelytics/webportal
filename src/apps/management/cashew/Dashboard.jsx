import React, { useState } from 'react';
import { 
  Calendar, 
  Map as MapIcon, 
  Users, 
  Box, 
  BarChart3, 
  Activity,
  User,
  Trees,
  TrendingUp,
  AlertCircle,
  ClipboardList,
  Target,
  Search,
  Filter,
  BarChart4,
  Layers,
  Satellite,
  Camera,
  Navigation,
  CheckCircle2,
  Leaf,
  Globe,
  Droplets,
  Wind
} from 'lucide-react';
import { 
  SimpleCard, 
  MetricTile, 
  WorkerActivityTable, 
  GeospatialPreview, 
  FilterBar,
  EvidenceThumbnail,
  LocationBadge
} from '../../../shared/components/SharedComponents';

const CashewDashboard = ({ activeSection }) => {
  const [activeLayer, setActiveLayer] = useState('carbon');

  const workerData = [
    { id: 'W-092', name: 'Samuel Obi', task: 'Pruning', plot: 'Block A-12', output: '42 Trees', status: 'In Progress', location: { lat: 6.5244, lng: 3.3792 }, evidence: '' },
    { id: 'W-045', name: 'Grace John', task: 'Harvesting', plot: 'Block B-04', output: '1.2 MT RCN', status: 'Completed', location: { lat: 6.5201, lng: 3.3812 }, evidence: '' },
  ];

  const carbonData = [
    { id: 'FOR-01', area: 'Forestry Reserve', type: 'High Density', carbonStock: '124,200 tCO2e', health: '98%', status: 'Verified' },
    { id: 'GRP-04', area: 'Smallholder Group D', type: 'Agroforestry', carbonStock: '42,800 tCO2e', health: '92%', status: 'Active' },
    { id: 'EST-09', area: 'Main Estate Cluster', type: 'Industrial', carbonStock: '185,400 tCO2e', health: '95%', status: 'Verified' },
  ];

  const columns = [
    { key: 'evidence', label: 'Evidence', render: (val) => <EvidenceThumbnail src={val} /> },
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Worker Name' },
    { key: 'task', label: 'Specific Task' },
    { key: 'plot', label: 'Assigned Plot' },
    { key: 'output', label: 'Work Output', render: (val) => <span className="text-[13px] font-black text-gray-900 italic">{val}</span> },
    { key: 'location', label: 'Field Location', render: (val) => <LocationBadge lat={val.lat} lng={val.lng} /> },
    { key: 'status', label: 'Status' },
  ];

  const carbonColumns = [
    { key: 'area', label: 'Carbon Project Area' },
    { key: 'type', label: 'Classification' },
    { key: 'carbonStock', label: 'Est. Carbon Stock', render: (val) => <span className="text-[13px] font-black text-emerald-600">{val}</span> },
    { key: 'health', label: 'Biomass Health', render: (val) => <span className="text-emerald-500 font-bold">{val}</span> },
    { key: 'status', label: 'MRV Status' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'sustainability':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricTile label="Total Carbon Stock" value="352k" unit="tCO2e" color="bg-emerald-600" />
                <MetricTile label="Forestry Biomass" value="124" unit="kT" color="bg-emerald-600" />
                <MetricTile label="Net Sequestration" value="14.2" unit="%" color="bg-emerald-600" />
                <MetricTile label="MRV Compliance" value="100" unit="%" color="bg-emerald-500" />
             </div>

             <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                   <SimpleCard title="Carbon Monitoring & Estimation" icon={<Globe size={20} />}>
                      <div className="h-[400px] relative">
                         <GeospatialPreview title="Biomass & Carbon Layer" points={[]} full={true} />
                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-sm z-10">
                            <div className="text-[10px] font-black text-gray-400 uppercase mb-3">Analysis Layers</div>
                            <div className="space-y-2">
                               {['Forestry Density', 'Group Carbon Stock', 'Estate Emission'].map(l => (
                                 <div key={l} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[11px] font-bold text-gray-700">{l}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </SimpleCard>
                   <SimpleCard title="Carbon Project Ledger" subtitle="Verified Forestry, Groups, and Estates calculations" icon={<BarChart4 size={20} />}>
                      <WorkerActivityTable data={carbonData} columns={carbonColumns} />
                   </SimpleCard>
                </div>
                <div className="lg:w-1/3 space-y-6">
                   <SimpleCard title="Forestry Health" icon={<Trees size={20} />}>
                      <div className="p-8 text-center bg-emerald-50/50 rounded-3xl border border-emerald-100">
                         <div className="text-5xl font-black text-emerald-600 mb-2">98.4<span className="text-xl">%</span></div>
                         <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Canopy Integrity Index</div>
                      </div>
                   </SimpleCard>
                   <SimpleCard title="Environmental KPIs" icon={<Wind size={20} />}>
                      <div className="space-y-6">
                         {[
                           { l: 'Methane Recovery', v: '92%', c: 'bg-emerald-500' },
                           { l: 'Water Usage Eff.', v: '84%', c: 'bg-blue-500' },
                           { l: 'Soil Organic Carbon', v: '4.2%', c: 'bg-amber-600' },
                         ].map(item => (
                           <div key={item.l}>
                              <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                                 <span className="text-gray-400">{item.l}</span>
                                 <span>{item.v}</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                 <div className={`h-full ${item.c}`} style={{ width: item.v }}></div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </SimpleCard>
                </div>
             </div>
          </div>
        );
      case 'geospatial':
        return (
          <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-220px)] animate-in fade-in slide-in-from-bottom-4">
             <div className="lg:w-3/4 h-full relative">
                <GeospatialPreview title="Cashew Estate Intel Map" points={[]} full={true} />
             </div>
             <div className="lg:w-1/4 flex flex-col gap-6 overflow-y-auto pr-2">
                <SimpleCard title="Map Layer Selector" icon={<Layers size={18} />}>
                   <div className="space-y-2">
                      {[
                        { id: 'satellite', label: 'High-Res Satellite', icon: <Satellite size={14}/> },
                        { id: 'plots', label: 'Plot Boundaries', icon: <MapIcon size={14}/> },
                        { id: 'health', label: 'NDVI Health Map', icon: <Activity size={14}/> },
                        { id: 'workers', label: 'Live Worker GPS', icon: <Users size={14}/> },
                      ].map(layer => (
                        <button 
                          key={layer.id} 
                          onClick={() => setActiveLayer(layer.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            activeLayer === layer.id ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              {layer.icon}
                              <span className="text-[12px] font-bold">{layer.label}</span>
                           </div>
                           {activeLayer === layer.id && <CheckCircle2 size={14} className="text-orange-600" />}
                        </button>
                      ))}
                   </div>
                </SimpleCard>
             </div>
          </div>
        );
      case 'workers':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <FilterBar filters={[{ label: 'Task Category' }, { label: 'Plot Zone' }]} />
             <SimpleCard title="Worker Management Ledger" icon={<Users size={20} />}>
                <WorkerActivityTable data={workerData} columns={columns} />
             </SimpleCard>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricTile label="Total RCN Harvested" value="48.6" unit="MT" color="bg-orange-600" />
              <MetricTile label="Trees Managed" value="12,482" unit="TREES" color="bg-orange-600" />
              <MetricTile label="Active Workforce" value="42" unit="PERS" color="bg-orange-600" />
              <MetricTile label="Estate Health" value="94" unit="%" color="bg-emerald-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SimpleCard title="Sustainability Impact" icon={<Leaf size={20} />}>
                  <div className="flex items-center justify-between mb-6">
                     <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carbon Sequestered</div>
                        <div className="text-3xl font-black text-emerald-600">352,400 <span className="text-sm font-bold text-gray-300">tCO2e</span></div>
                     </div>
                     <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <Globe className="text-emerald-500" size={32} />
                     </div>
                  </div>
                  <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[72%]"></div>
                  </div>
                  <div className="mt-3 text-[10px] font-bold text-gray-400 uppercase">Target: 500k tCO2e by 2027</div>
               </SimpleCard>
               <SimpleCard title="Recent Field Logs" icon={<ClipboardList size={20} />}>
                  <div className="space-y-4">
                    {workerData.slice(0, 4).map((w, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                         <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
                            <span className="text-[12px] font-bold text-gray-800">{w.name} · {w.plot}</span>
                         </div>
                         <span className="text-[10px] font-black text-gray-400 uppercase">{w.task}</span>
                      </div>
                    ))}
                  </div>
               </SimpleCard>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1700px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter capitalize">{(activeSection || 'dashboard').replace(/-/g, ' ')}</h1>
          <p className="text-[14px] text-gray-500 mt-1 font-medium italic">Cashew Estate Management Node · Rivers Cluster</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default CashewDashboard;
