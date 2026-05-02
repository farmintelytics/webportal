import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Wheat, 
  TrendingUp, 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowLeft, 
  BarChart3, 
  Layers, 
  UserCheck, 
  Building2, 
  Globe2, 
  FileText, 
  Zap, 
  Package, 
  CheckCircle2,
  LogOut,
  Satellite,
  Activity,
  BarChart4,
  ChevronRight,
  ClipboardList,
  Target
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  SimpleCard, 
  MetricTile, 
  WorkerActivityTable, 
  GeospatialPreview, 
  FilterBar 
} from '../../shared/components/SharedComponents';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const mockFarmers = [
  { id: 'FRM-001', name: 'Adebayo Olatunji', group: 'Ogun Coop Society', crops: ['Cassava', 'Maize'], plots: 3, hectares: 4.2, status: 'Active', lga: 'Abeokuta South', phone: '+234 801 234 5678', email: 'a.olatunji@gmail.com', joined: 'Jan 2024' },
  { id: 'FRM-002', name: 'Amina Bello', group: 'Women Agric Network', crops: ['Rice', 'Maize', 'Cassava'], plots: 5, hectares: 7.8, status: 'Active', lga: 'Minna Central', phone: '+234 802 345 6789', email: 'amina.b@yahoo.com', joined: 'Nov 2023' },
  { id: 'FRM-003', name: 'Chukwuma Eze', group: 'IFAD Smallholder Program', crops: ['Oil Palm', 'Cocoa'], plots: 2, hectares: 12.5, status: 'Pending Review', lga: 'Owerri North', phone: '+234 803 456 7890', email: 'c.eze@outlook.com', joined: 'Mar 2024' },
  { id: 'FRM-004', name: 'Fatima Yusuf', group: 'State ADP Cluster', crops: ['Rice'], plots: 1, hectares: 2.0, status: 'Active', lga: 'Kebbi South', phone: '+234 804 567 8901', email: 'fatima.y@live.com', joined: 'Dec 2023' },
  { id: 'FRM-005', name: 'Emeka Nwankwo', group: 'Ogun Coop Society', crops: ['Cashew', 'Rubber'], plots: 4, hectares: 15.3, status: 'Active', lga: 'Sapele West', phone: '+234 805 678 9012', email: 'emeka.n@gmail.com', joined: 'Feb 2024' },
  { id: 'FRM-007', name: 'Ibrahim Musa', group: 'IFAD Smallholder Program', crops: ['Cocoa', 'Oil Palm', 'Cassava'], plots: 6, hectares: 18.0, status: 'Active', lga: 'Ondo West', phone: '+234 806 789 0123', email: 'i.musa@yahoo.com', joined: 'Jan 2024' },
];

const GroupsDashboard = ({ mode, onSignOut }) => {
  const [activeView, setActiveView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [activeLayer, setActiveLayer] = useState('plots');

  const clusterData = {
    labels: ['North', 'South', 'East', 'West', 'Central'],
    datasets: [{
      label: 'Hectares (k)',
      data: [45, 32, 28, 54, 18],
      backgroundColor: '#16A34A',
      borderRadius: 12,
    }]
  };

  const inputProgressData = {
    labels: ['Distributed', 'In Transit', 'Pending'],
    datasets: [{
      data: [65, 20, 15],
      backgroundColor: ['#16A34A', '#F59E0B', '#94A3B8'],
      borderWidth: 0,
    }]
  };

  const filteredFarmers = mockFarmers.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.crops.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const FarmerProfile = ({ farmer }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
       <button onClick={() => setSelectedFarmer(null)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6">
          <ArrowLeft size={14} /> Back to Registry
       </button>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <SimpleCard title="Farmer Intelligence Profile" subtitle={farmer.id} icon={<UserCheck size={18} />}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
                   <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</div>
                      <div className="text-sm font-black text-gray-900">{farmer.name}</div>
                   </div>
                   <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Cooperative</div>
                      <div className="text-sm font-black text-gray-900">{farmer.group}</div>
                   </div>
                   <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Primary Crops</div>
                      <div className="text-sm font-black text-emerald-600">{farmer.crops.join(', ')}</div>
                   </div>
                   <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Area</div>
                      <div className="text-sm font-black text-gray-900">{farmer.hectares} Ha</div>
                   </div>
                </div>
                <div className="mt-8 border-t border-gray-50 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-[10px] font-black text-gray-400 uppercase mb-2">Location (LGA)</div>
                      <div className="text-sm font-bold">{farmer.lga}</div>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-[10px] font-black text-gray-400 uppercase mb-2">Registration Date</div>
                      <div className="text-sm font-bold">{farmer.joined}</div>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-[10px] font-black text-gray-400 uppercase mb-2">Mobile Contact</div>
                      <div className="text-sm font-bold">{farmer.phone}</div>
                   </div>
                </div>
             </SimpleCard>

             <SimpleCard title="Verified Land Plots" icon={<MapPin size={18} />}>
                <div className="space-y-4">
                   {[1, 2, 3].slice(0, farmer.plots).map(i => (
                     <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                              <MapPin size={18} className="text-emerald-600" />
                           </div>
                           <div>
                              <div className="text-[12px] font-black text-gray-900">Plot ID: P-{farmer.id.split('-')[1]}-{i}</div>
                              <div className="text-[10px] text-gray-400 font-bold uppercase">1.4 Ha · Satellite Verified</div>
                           </div>
                        </div>
                        <button className="text-[10px] font-black uppercase text-emerald-600 hover:underline">View Map</button>
                     </div>
                   ))}
                </div>
             </SimpleCard>
          </div>

          <div className="space-y-8">
             <SimpleCard title="Yield History" icon={<TrendingUp size={18} />}>
                <div className="h-48 flex items-end gap-2 px-4">
                   {[60, 45, 90, 70, 85].map((h, i) => (
                     <div key={i} className="flex-1 bg-emerald-100 rounded-t-lg relative group">
                        <div className="absolute inset-0 bg-emerald-500 rounded-t-lg transition-all" style={{ height: `${h}%` }}></div>
                     </div>
                   ))}
                </div>
                <p className="text-[10px] text-center text-gray-400 font-bold mt-4 uppercase">Seasonal Performance</p>
             </SimpleCard>

             <SimpleCard title="Disbursement" icon={<Package size={18} />}>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-gray-400 uppercase">Input Coverage</span>
                      <span className="text-emerald-600">85%</span>
                   </div>
                   <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                   </div>
                   <div className="pt-4 space-y-3">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Batches</div>
                      <div className="text-[11px] font-bold text-gray-800">· NPK Fertilizer (B-829)</div>
                      <div className="text-[11px] font-bold text-gray-800">· Improved Maize Seed</div>
                   </div>
                </div>
             </SimpleCard>
          </div>
       </div>
    </div>
  );

  const renderContent = () => {
    if (selectedFarmer) return <FarmerProfile farmer={selectedFarmer} />;

    switch (activeView) {
      case 'farmers':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <FilterBar onSearch={setSearchQuery} filters={[{ label: 'LGA' }, { label: 'Crop Type' }]} />
             <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                         {['Farmer ID', 'Full Name', 'Cooperative', 'Hectares', 'Status', ''].map(h => (
                           <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-r border-gray-100 last:border-r-0">{h}</th>
                         ))}
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {filteredFarmers.map(farmer => (
                        <tr key={farmer.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedFarmer(farmer)}>
                           <td className="px-6 py-4 text-[12px] font-black text-emerald-600 border-r border-gray-50">{farmer.id}</td>
                           <td className="px-6 py-4 border-r border-gray-50">
                              <div className="text-[13px] font-bold text-gray-900">{farmer.name}</div>
                              <div className="text-[10px] text-gray-400 font-medium">{farmer.lga}</div>
                           </td>
                           <td className="px-6 py-4 text-[12px] font-bold text-gray-500 border-r border-gray-50">{farmer.group}</td>
                           <td className="px-6 py-4 text-sm font-black text-gray-900 border-r border-gray-50">{farmer.hectares}</td>
                           <td className="px-6 py-4 border-r border-gray-50">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${farmer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                 {farmer.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors inline" />
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );
      case 'plots':
        return (
          <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-250px)] animate-in fade-in slide-in-from-bottom-4">
             <div className="lg:w-3/4 h-full relative">
                <GeospatialPreview title="Enterprise Smallholder Plot Map" points={[]} full={true} />
             </div>
             <div className="lg:w-1/4 flex flex-col gap-6 overflow-y-auto">
                <SimpleCard title="Intelligence Layers" icon={<Layers size={18} />}>
                   <div className="space-y-2">
                      {[
                        { id: 'satellite', label: 'VHR Satellite Fusion', icon: <Satellite size={14}/> },
                        { id: 'plots', label: 'Farmer Plot Boundaries', icon: <MapPin size={14}/> },
                        { id: 'health', label: 'Vegetation Indices', icon: <Activity size={14}/> },
                        { id: 'water', label: 'Flood Risk Layers', icon: <Globe2 size={14}/> },
                      ].map(layer => (
                        <button 
                          key={layer.id} 
                          onClick={() => setActiveLayer(layer.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            activeLayer === layer.id ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              {layer.icon}
                              <span className="text-[12px] font-bold">{layer.label}</span>
                           </div>
                           {activeLayer === layer.id && <CheckCircle2 size={14} className="text-emerald-600" />}
                        </button>
                      ))}
                   </div>
                </SimpleCard>
                <SimpleCard title="Mapping Stats" icon={<Activity size={18} />}>
                   <div className="space-y-4">
                      <MetricTile label="Mapped Plots" value="12,482" color="bg-emerald-600" />
                      <MetricTile label="Satellite Verified" value="94.2" unit="%" color="bg-emerald-600" />
                   </div>
                </SimpleCard>
             </div>
          </div>
        );
      case 'inputs':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
             <FilterBar filters={[{ label: 'Resource Type' }, { label: 'Disbursement Hub' }]} />
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                   <SimpleCard title="Input Disbursement Ledger" icon={<Package size={20} />}>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                           <thead>
                              <tr className="bg-gray-50/50">
                                 {['Batch ID', 'Resource', 'Quantity', 'Status'].map(h => (
                                   <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 border-r border-gray-100 last:border-r-0">{h}</th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {[
                                { id: 'B-829', r: 'NPK 15-15-15', q: '12,000 Bags', s: 'In Transit' },
                                { id: 'B-830', r: 'Cassava Stems', q: '45,000 Bundles', s: 'Completed' },
                                { id: 'B-831', r: 'Urea Fertilizer', q: '8,400 Bags', s: 'Active' },
                              ].map((row, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-b-0">
                                   <td className="px-4 py-4 text-[12px] font-black text-emerald-600 border-r border-gray-50">{row.id}</td>
                                   <td className="px-4 py-4 text-sm font-bold border-r border-gray-50">{row.r}</td>
                                   <td className="px-4 py-4 text-sm font-black border-r border-gray-50">{row.q}</td>
                                   <td className="px-4 py-4">
                                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${row.s === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{row.s}</span>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                   </SimpleCard>
                </div>
                <div className="flex flex-col gap-8">
                   <SimpleCard title="Distribution Mix" icon={<Doughnut size={18} />}>
                      <div className="h-48 relative">
                         <Doughnut data={inputProgressData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '75%' }} />
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-3xl font-black">65%</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Sync</div>
                         </div>
                      </div>
                   </SimpleCard>
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Farmers', value: '42,108', sub: 'Verified' },
                { label: 'Total Clusters', value: '1,240', sub: 'Active' },
                { label: 'Planned Area', value: '124.5k Ha', sub: '+12% vs last' },
                { label: 'Input Coverage', value: '85.2%', sub: 'Target 100%' },
                { label: 'Verified Plots', value: '94%', sub: 'Satellite proof' },
                { label: 'Data Latency', value: '0.8s', sub: 'Enterprise sync' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                   <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">{kpi.label}</div>
                   <div className="text-2xl font-black text-black tracking-tight">{kpi.value}</div>
                   <div className="text-[10px] font-bold text-emerald-600 mt-1">{kpi.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                  <SimpleCard title="Land Area Distribution by Region" icon={<BarChart3 size={18} />}>
                     <div className="h-64">
                        <Bar data={clusterData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: false } } }} />
                     </div>
                  </SimpleCard>
               </div>
               <div className="flex flex-col gap-8">
                  <div className="bg-black text-white p-8 rounded-[2rem] shadow-xl h-full flex flex-col justify-between">
                     <div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-6 italic">Enterprise Core</h3>
                        <div className="space-y-6">
                           <div>
                              <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                                 <span>System Compute</span>
                                 <span>14%</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full">
                                 <div className="h-full w-[14%] bg-emerald-500 rounded-full"></div>
                              </div>
                           </div>
                           <div>
                              <div className="text-4xl font-black tracking-tighter leading-none mb-1 italic">10.0M+</div>
                              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Registration Capacity</div>
                           </div>
                        </div>
                     </div>
                     <div className="pt-8 border-t border-white/5">
                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Smallholder Infrastructure V4.2</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-gray-100">
               <img src="/farmintelytics-logo.png" alt="Logo" className="w-full h-auto" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-black leading-none">Groups Management</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">Enterprise Smallholder Infrastructure</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden lg:flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Syncing 42k farmer records</span>
           </div>
           <button 
             onClick={onSignOut}
             className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-red-100"
           >
              <LogOut size={14} /> Sign Out
           </button>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-white border-b border-gray-100 px-8 sticky top-[81px] z-40">
        <div className="flex items-center gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
            { id: 'farmers', label: 'Farmer Registry', icon: <Users size={16} /> },
            { id: 'inputs', label: 'Input Planning', icon: <Package size={16} /> },
            { id: 'plots', label: 'Land Area Mapping', icon: <MapPin size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveView(tab.id); setSelectedFarmer(null); }}
              className={`flex items-center gap-2 py-4 text-[12px] font-black uppercase tracking-widest border-b-3 transition-all ${
                activeView === tab.id
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-gray-400 border-transparent hover:text-black'
              }`}
              style={{ borderBottomWidth: '3px' }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8">
         {renderContent()}
      </main>

      <footer className="px-8 py-8 border-t border-gray-100 bg-white flex flex-col items-center">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Powered by Farmintelytics · Enterprise Smallholder Infrastructure</div>
      </footer>
    </div>
  );
};

export default GroupsDashboard;
