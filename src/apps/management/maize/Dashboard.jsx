import React, { useState } from 'react';
import { 
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
  Zap,
  LayoutDashboard
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

const MaizeDashboard = ({ activeSection }) => {
  const [activeLayer, setActiveLayer] = useState('plots');

  const maizeData = [
    { id: 'W-092', name: 'Musa John', task: 'Fertilizing', plot: 'P-Maize-01', output: '1.2 HA', status: 'Active', location: { lat: 6.5844, lng: 3.4392 }, evidence: '' },
    { id: 'W-095', name: 'Alice Peters', task: 'Harvesting', plot: 'P-Maize-04', output: '2.4 MT', status: 'Completed', location: { lat: 6.5801, lng: 3.4312 }, evidence: '' },
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

  const renderContent = () => {
    switch (activeSection) {
      case 'geospatial':
        return (
          <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-220px)] animate-in fade-in slide-in-from-bottom-4">
             <div className="lg:w-3/4 h-full relative">
                <GeospatialPreview title="Maize Belt Spatial Intel" points={[{ x: '35%', y: '45%', color: '#EAB308', label: 'Active Block' }]} full={true} />
             </div>
             <div className="lg:w-1/4 flex flex-col gap-6 overflow-y-auto">
                <SimpleCard title="Layer Selector" icon={<Layers size={18} />}>
                   <div className="space-y-2">
                      {[
                        { id: 'satellite', label: 'Satellite View', icon: <Satellite size={14}/> },
                        { id: 'plots', label: 'Field Boundaries', icon: <MapIcon size={14}/> },
                        { id: 'health', label: 'Growth Indices', icon: <Activity size={14}/> },
                      ].map(layer => (
                        <button 
                          key={layer.id} 
                          onClick={() => setActiveLayer(layer.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            activeLayer === layer.id ? 'bg-yellow-50 border-yellow-200 text-yellow-900' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              {layer.icon}
                              <span className="text-[12px] font-bold">{layer.label}</span>
                           </div>
                           {activeLayer === layer.id && <CheckCircle2 size={14} className="text-yellow-600" />}
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
             <FilterBar filters={[{ label: 'Field Crew' }, { label: 'Task Category' }]} />
             <SimpleCard title="Field Operations Ledger" icon={<Users size={20} />}>
                <WorkerActivityTable data={maizeData} columns={columns} />
             </SimpleCard>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricTile label="Avg Yield" value="6.4" unit="MT/Ha" color="bg-yellow-500" />
              <MetricTile label="Moisture Level" value="14.2" unit="%" color="bg-yellow-500" />
              <MetricTile label="Total Harvest" value="842" unit="MT" color="bg-yellow-500" />
              <MetricTile label="Compliance" value="99" unit="%" color="bg-green-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SimpleCard title="Silo Monitoring" icon={<Zap size={20} />}>
                  <div className="p-10 text-center border-2 border-dashed border-gray-50 rounded-3xl">
                     <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Storage Capacity Feed</p>
                  </div>
               </SimpleCard>
               <SimpleCard title="Market Forecast" icon={<TrendingUp size={20} />}>
                  <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                     <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Regional Price Analysis</p>
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
          <p className="text-[14px] text-gray-500 mt-1 font-medium italic">Maize Intelligence Node · Grain Management</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default MaizeDashboard;
