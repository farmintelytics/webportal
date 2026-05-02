import React, { useState } from 'react';
import { 
  Droplets, 
  Users, 
  Activity, 
  MapPin, 
  Map as MapIcon,
  BarChart4,
  Layers,
  Camera,
  Navigation,
  Satellite,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ThermometerSun,
  LayoutDashboard,
  Leaf,
  Globe,
  Wind,
  Trees
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

const RiceDashboard = ({ activeSection }) => {
  const [activeLayer, setActiveLayer] = useState('plots');

  const carbonData = [
    { id: 'FOR-RICE-01', area: 'Wetland Buffer', type: 'Riparian', carbonStock: '42,400 tCO2e', health: '98%', status: 'Verified' },
    { id: 'EST-RICE-09', area: 'Main Paddies', type: 'Lowland Rice', carbonStock: '62,800 tCO2e', health: '94%', status: 'Active' },
  ];

  const paddyData = [
    { id: 'W-012', name: 'Musa John', task: 'Transplanting', plot: 'P-Rice-01', output: '0.4 HA', status: 'Active', location: { lat: 6.5544, lng: 3.4092 }, evidence: '' },
    { id: 'W-015', name: 'Alice Peters', task: 'Irrigation', plot: 'P-Rice-04', output: 'Verified', status: 'Completed', location: { lat: 6.5501, lng: 3.4012 }, evidence: '' },
  ];

  const columns = [
    { key: 'evidence', label: 'Evidence', render: (val) => <EvidenceThumbnail src={val} /> },
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Worker Name' },
    { key: 'task', label: 'Specific Task' },
    { key: 'plot', label: 'Assigned Plot' },
    { key: 'output', label: 'Work Output', render: (val) => <span className="text-[13px] font-black text-gray-900 italic">{val}</span> },
    { key: 'location', label: 'Field GPS', render: (val) => <LocationBadge lat={val.lat} lng={val.lng} /> },
    { key: 'status', label: 'Status' },
  ];

  const carbonColumns = [
    { key: 'area', label: 'Carbon Project Area' },
    { key: 'type', label: 'Classification' },
    { key: 'carbonStock', label: 'Est. Carbon Stock', render: (val) => <span className="text-[13px] font-black text-teal-600">{val}</span> },
    { key: 'health', label: 'Biomass Health', render: (val) => <span className="text-teal-500 font-bold">{val}</span> },
    { key: 'status', label: 'MRV Status' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'sustainability':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricTile label="Paddy Carbon" value="105k" unit="tCO2e" color="bg-teal-600" />
                <MetricTile label="Methane Reduction" value="34" unit="%" color="bg-teal-600" />
                <MetricTile label="Water Recirc" value="82" unit="%" color="bg-teal-600" />
                <MetricTile label="Compliance" value="100" unit="%" color="bg-emerald-500" />
             </div>
             <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                   <SimpleCard title="Wetland Biomass" icon={<Globe size={20} />}>
                      <div className="h-[400px] relative">
                         <GeospatialPreview title="Rice Carbon Intel" points={[]} full={true} />
                      </div>
                   </SimpleCard>
                   <SimpleCard title="Sustainability Ledger" icon={<BarChart4 size={20} />}>
                      <WorkerActivityTable data={carbonData} columns={carbonColumns} />
                   </SimpleCard>
                </div>
                <div className="lg:w-1/3 space-y-6">
                   <SimpleCard title="Methane Capture" icon={<Wind size={20} />}>
                      <div className="p-8 text-center bg-teal-50/50 rounded-3xl border border-teal-100">
                         <div className="text-5xl font-black text-teal-600 mb-2">34.2<span className="text-xl">%</span></div>
                         <div className="text-[10px] font-black text-teal-700 uppercase tracking-widest">GHG Reduction Index</div>
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
                <GeospatialPreview title="Rice Paddies Spatial Intel" points={[{ x: '35%', y: '45%', color: '#0D9488', label: 'Active Plot' }]} full={true} />
             </div>
             <div className="lg:w-1/4 flex flex-col gap-6 overflow-y-auto">
                <SimpleCard title="Layer Selector" icon={<Layers size={18} />}>
                   <div className="space-y-2">
                      {[
                        { id: 'satellite', label: 'Satellite View', icon: <Satellite size={14}/> },
                        { id: 'plots', label: 'Paddy Boundaries', icon: <MapIcon size={14}/> },
                        { id: 'flood', label: 'Flood Monitor', icon: <Droplets size={14}/> },
                      ].map(layer => (
                        <button 
                          key={layer.id} 
                          onClick={() => setActiveLayer(layer.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            activeLayer === layer.id ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              {layer.icon}
                              <span className="text-[12px] font-bold">{layer.label}</span>
                           </div>
                           {activeLayer === layer.id && <CheckCircle2 size={14} className="text-teal-600" />}
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
             <FilterBar filters={[{ label: 'Task Category' }, { label: 'Shift' }]} />
             <SimpleCard title="Field Operations Ledger" icon={<Users size={20} />}>
                <WorkerActivityTable data={paddyData} columns={columns} />
             </SimpleCard>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricTile label="Net Yield" value="5.8" unit="t/ha" color="bg-teal-600" />
              <MetricTile label="Head Rice Yield" value="64.2" unit="%" color="bg-teal-600" />
              <MetricTile label="Harvest Moisture" value="21.3" unit="%" color="bg-teal-600" />
              <MetricTile label="Plot Compliance" value="96" unit="%" color="bg-green-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SimpleCard title="Sustainability Index" icon={<Leaf size={20} />}>
                  <div className="text-4xl font-black text-teal-600 mb-4 tracking-tighter">105,400 <span className="text-sm font-bold text-gray-300">tCO2e</span></div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Carbon Sequestered</div>
               </SimpleCard>
               <SimpleCard title="Drying Station" icon={<ThermometerSun size={20} />}>
                  <div className="p-10 text-center border-2 border-dashed border-gray-50 rounded-3xl">
                     <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Live Moisture Sensor Data</p>
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
          <p className="text-[14px] text-gray-500 mt-1 font-medium italic">Rice Intelligence Node · Paddy Management</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default RiceDashboard;
