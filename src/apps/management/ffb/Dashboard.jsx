import React, { useState } from 'react';
import { 
  Package, 
  Users, 
  Map as MapIcon, 
  Zap, 
  Activity,
  BarChart4,
  Layers,
  Box,
  Droplets,
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

const FFBDashboard = ({ activeSection }) => {
  const [activeLayer, setActiveLayer] = useState('plots');

  const carbonData = [
    { id: 'FOR-FFB-01', area: 'Palm Reserve South', type: 'Primary Forest', carbonStock: '312,400 tCO2e', health: '99%', status: 'Verified' },
    { id: 'EST-FFB-09', area: 'Sector A-Block 1', type: 'Industrial Oil Palm', carbonStock: '242,800 tCO2e', health: '95%', status: 'Active' },
  ];

  const harvesterData = [
    { id: 'H-201', name: 'John Musa', plot: 'Block A-1', manualCount: '124', aiCount: '128', variance: '+4', status: 'Verified', location: { lat: 6.5444, lng: 3.3992 }, evidence: '' },
    { id: 'H-188', name: 'Alice Peters', plot: 'Block A-7', manualCount: '86', aiCount: '85', variance: '-1', status: 'Verified', location: { lat: 6.5401, lng: 3.3912 }, evidence: '' },
  ];

  const columns = [
    { key: 'evidence', label: 'Field Evidence', render: (val) => <EvidenceThumbnail src={val} /> },
    { key: 'id', label: 'Harvester ID' },
    { key: 'name', label: 'Name' },
    { key: 'plot', label: 'Plot' },
    { key: 'manualCount', label: 'Manual Count' },
    { key: 'aiCount', label: 'AI Detection', render: (val) => <span className="text-green-600 font-bold">{val}</span> },
    { key: 'location', label: 'GPS Coordinates', render: (val) => <LocationBadge lat={val.lat} lng={val.lng} /> },
    { key: 'status', label: 'Status' },
  ];

  const carbonColumns = [
    { key: 'area', label: 'Carbon Project Area' },
    { key: 'type', label: 'Classification' },
    { key: 'carbonStock', label: 'Est. Carbon Stock', render: (val) => <span className="text-[13px] font-black text-green-600">{val}</span> },
    { key: 'health', label: 'Biomass Health', render: (val) => <span className="text-green-500 font-bold">{val}</span> },
    { key: 'status', label: 'MRV Status' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'sustainability':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricTile label="Total Sequestered" value="555k" unit="tCO2e" color="bg-green-600" />
                <MetricTile label="High-Carbon Stocks" value="312" unit="kT" color="bg-green-600" />
                <MetricTile label="POME Capture" value="98" unit="%" color="bg-green-600" />
                <MetricTile label="RSPO Compliance" value="100" unit="%" color="bg-emerald-500" />
             </div>
             <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                   <SimpleCard title="Conservation Monitoring" icon={<Globe size={20} />}>
                      <div className="h-[400px] relative">
                         <GeospatialPreview title="Oil Palm Biomass Intel" points={[]} full={true} />
                      </div>
                   </SimpleCard>
                   <SimpleCard title="Carbon Inventory" icon={<BarChart4 size={20} />}>
                      <WorkerActivityTable data={carbonData} columns={carbonColumns} />
                   </SimpleCard>
                </div>
                <div className="lg:w-1/3 space-y-6">
                   <SimpleCard title="Effluent Management" icon={<Wind size={20} />}>
                      <div className="p-8 text-center bg-emerald-50/50 rounded-3xl border border-emerald-100">
                         <div className="text-5xl font-black text-emerald-600 mb-2">98.2<span className="text-xl">%</span></div>
                         <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Biogas Capture Efficiency</div>
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
                <GeospatialPreview title="Oil Palm Geospatial Intel" points={[{ x: '40%', y: '50%', color: '#16A34A', label: 'High Density Block' }]} full={true} />
             </div>
             <div className="lg:w-1/4 flex flex-col gap-6 overflow-y-auto">
                <SimpleCard title="Layer Selector" icon={<Layers size={18} />}>
                   <div className="space-y-2">
                      {[
                        { id: 'satellite', label: 'Satellite View', icon: <Satellite size={14}/> },
                        { id: 'plots', label: 'Block Map', icon: <MapIcon size={14}/> },
                        { id: 'maturity', label: 'Bunch Maturity', icon: <Zap size={14}/> },
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
             <FilterBar filters={[{ label: 'Harvester Group' }, { label: 'Variance Type' }]} />
             <SimpleCard title="Harvester Activity & Presence" icon={<Users size={20} />}>
                <WorkerActivityTable data={harvesterData} columns={columns} />
             </SimpleCard>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricTile label="Total Bunches (AI)" value="1,248" unit="BUNCH" color="bg-green-600" />
              <MetricTile label="AI Confidence" value="99.2" unit="%" color="bg-green-600" />
              <MetricTile label="Loose Fruit" value="424" unit="KG" color="bg-orange-500" />
              <MetricTile label="Mill Extraction" value="21.4" unit="%" color="bg-green-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SimpleCard title="Conservation Status" icon={<Leaf size={20} />}>
                  <div className="text-4xl font-black text-green-600 mb-4 tracking-tighter">555,200 <span className="text-sm font-bold text-gray-300">tCO2e</span></div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Carbon Sequestered</div>
               </SimpleCard>
               <SimpleCard title="Detection Trends" icon={<Activity size={20} />}>
                  <div className="p-10 text-center border-2 border-dashed border-gray-50 rounded-3xl">
                     <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Computer Vision Insights</p>
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
          <p className="text-[14px] text-gray-500 mt-1 font-medium italic">FFB Intelligence Console · Oil Palm Management</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default FFBDashboard;
