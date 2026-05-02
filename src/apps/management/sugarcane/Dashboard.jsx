import React, { useState } from 'react';
import { 
  Zap, 
  Users, 
  Map as MapIcon, 
  RotateCcw, 
  Truck, 
  Activity,
  User,
  Scale,
  Layers,
  Camera,
  Navigation,
  Satellite,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Globe,
  Trees,
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

const SugarcaneDashboard = ({ activeSection }) => {
  const [activeLayer, setActiveLayer] = useState('plots');

  const carbonData = [
    { id: 'FOR-CAN-01', area: 'Riparian Buffer', type: 'Wetland Forest', carbonStock: '62,400 tCO2e', health: '97%', status: 'Verified' },
    { id: 'EST-CAN-09', area: 'Main Cane Fields', type: 'Industrial Sugarcane', carbonStock: '92,800 tCO2e', health: '94%', status: 'Active' },
  ];

  const operatorData = [
    { id: 'OP-401', name: 'John Musa', task: 'Harvesting', plot: 'Plot-92', tonnage: '42.4 MT', status: 'In Transit', location: { lat: 6.5544, lng: 3.4092 }, evidence: '' },
    { id: 'OP-382', name: 'Alice Peters', task: 'Planting', plot: 'Plot-104', tonnage: '--', status: 'Completed', location: { lat: 6.5501, lng: 3.4012 }, evidence: '' },
  ];

  const columns = [
    { key: 'evidence', label: 'Field Evidence', render: (val) => <EvidenceThumbnail src={val} /> },
    { key: 'id', label: 'Operator ID' },
    { key: 'name', label: 'Name' },
    { key: 'task', label: 'Operation' },
    { key: 'tonnage', label: 'Est. Tonnage', render: (val) => <span className="text-[13px] font-black text-gray-900">{val}</span> },
    { key: 'location', label: 'Field GPS', render: (val) => <LocationBadge lat={val.lat} lng={val.lng} /> },
    { key: 'status', label: 'Status' },
  ];

  const carbonColumns = [
    { key: 'area', label: 'Carbon Project Area' },
    { key: 'type', label: 'Classification' },
    { key: 'carbonStock', label: 'Est. Carbon Stock', render: (val) => <span className="text-[13px] font-black text-green-600">{val}</span> },
    { key: 'health', label: 'Biomass Health', render: (val) => <span className="text-emerald-500 font-bold">{val}</span> },
    { key: 'status', label: 'MRV Status' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'sustainability':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricTile label="Cane Carbon Stock" value="155k" unit="tCO2e" color="bg-green-600" />
                <MetricTile label="Soil Organic Carbon" value="4.8" unit="%" color="bg-green-600" />
                <MetricTile label="Bagasse Energy" value="2.4" unit="MW" color="bg-green-600" />
                <MetricTile label="Bonsucro Status" value="100" unit="%" color="bg-emerald-500" />
             </div>
             <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                   <SimpleCard title="Biomass Intelligence" icon={<Globe size={20} />}>
                      <div className="h-[400px] relative">
                         <GeospatialPreview title="Cane Biomass Intel" points={[]} full={true} />
                      </div>
                   </SimpleCard>
                   <SimpleCard title="Carbon Verification" icon={<BarChart4 size={20} />}>
                      <WorkerActivityTable data={carbonData} columns={carbonColumns} />
                   </SimpleCard>
                </div>
                <div className="lg:w-1/3 space-y-6">
                   <SimpleCard title="Energy Recovery" icon={<Wind size={20} />}>
                      <div className="p-8 text-center bg-green-50/50 rounded-3xl border border-green-100">
                         <div className="text-5xl font-black text-green-600 mb-2">88.4<span className="text-xl">%</span></div>
                         <div className="text-[10px] font-black text-green-700 uppercase tracking-widest">Bagasse Co-generation Efficiency</div>
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
                <GeospatialPreview title="Cane Estate Spatial Intel" points={[{ x: '35%', y: '45%', color: '#16A34A', label: 'Plot 92 Active' }]} full={true} />
             </div>
             <div className="lg:w-1/4 flex flex-col gap-6 overflow-y-auto">
                <SimpleCard title="Layer Selector" icon={<Layers size={18} />}>
                   <div className="space-y-2">
                      {[
                        { id: 'satellite', label: 'Satellite View', icon: <Satellite size={14}/> },
                        { id: 'plots', label: 'Cane Blocks', icon: <MapIcon size={14}/> },
                        { id: 'logistics', label: 'Truck Routing', icon: <Truck size={14}/> },
                      ].map(layer => (
                        <button 
                          key={layer.id} 
                          onClick={() => setActiveLayer(layer.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            activeLayer === layer.id ? 'bg-green-50 border-green-200 text-green-900' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              {layer.icon}
                              <span className="text-[12px] font-bold">{layer.label}</span>
                           </div>
                           {activeLayer === layer.id && <CheckCircle2 size={14} className="text-green-600" />}
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
             <FilterBar filters={[{ label: 'Operator Type' }, { label: 'Mill Queue' }]} />
             <SimpleCard title="Operator Activity & Presence" icon={<Users size={20} />}>
                <WorkerActivityTable data={operatorData} columns={columns} />
             </SimpleCard>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricTile label="Total Tonnage (Day)" value="428" unit="MT" color="bg-green-600" />
              <MetricTile label="Harvested Area" value="142" unit="HA" color="bg-green-600" />
              <MetricTile label="Avg Ratoon Age" value="2.4" unit="YRS" color="bg-green-600" />
              <MetricTile label="Logistics Health" value="94" unit="%" color="bg-emerald-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SimpleCard title="Carbon Footprint" icon={<Leaf size={20} />}>
                  <div className="text-4xl font-black text-green-600 mb-4 tracking-tighter">155,200 <span className="text-sm font-bold text-gray-300">tCO2e</span></div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Biomass Reservoir</div>
               </SimpleCard>
               <SimpleCard title="Mill Gate Scale" icon={<Scale size={20} />}>
                  <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                     <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Live Weighbridge Feed</p>
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
          <p className="text-[14px] text-gray-500 mt-1 font-medium italic">Sugarcane Logistics Hub · Cane Intelligence</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default SugarcaneDashboard;
