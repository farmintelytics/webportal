import React, { useState } from 'react';
import { Users, MapPin, Wheat, TrendingUp, Search, Filter, ChevronDown, ArrowLeft, BarChart3, Layers, UserCheck, Building2, Globe2, FileText } from 'lucide-react';

const mockFarmers = [
  { id: 'FRM-001', name: 'Adebayo Olatunji', group: 'Ogun Coop Society', crops: ['Cassava', 'Maize'], plots: 3, hectares: 4.2, status: 'Active', lga: 'Abeokuta South' },
  { id: 'FRM-002', name: 'Amina Bello', group: 'Women Agric Network', crops: ['Rice', 'Maize', 'Cassava'], plots: 5, hectares: 7.8, status: 'Active', lga: 'Minna Central' },
  { id: 'FRM-003', name: 'Chukwuma Eze', group: 'IFAD Smallholder Program', crops: ['Oil Palm', 'Cocoa'], plots: 2, hectares: 12.5, status: 'Pending Review', lga: 'Owerri North' },
  { id: 'FRM-004', name: 'Fatima Yusuf', group: 'State ADP Cluster', crops: ['Rice'], plots: 1, hectares: 2.0, status: 'Active', lga: 'Kebbi South' },
  { id: 'FRM-005', name: 'Emeka Nwankwo', group: 'Ogun Coop Society', crops: ['Cashew', 'Rubber'], plots: 4, hectares: 15.3, status: 'Active', lga: 'Sapele West' },
  { id: 'FRM-006', name: 'Grace Afolabi', group: 'Women Agric Network', crops: ['Maize', 'SugarCane'], plots: 2, hectares: 3.6, status: 'Inactive', lga: 'Ilorin East' },
  { id: 'FRM-007', name: 'Ibrahim Musa', group: 'IFAD Smallholder Program', crops: ['Cocoa', 'Oil Palm', 'Cassava'], plots: 6, hectares: 18.0, status: 'Active', lga: 'Ondo West' },
  { id: 'FRM-008', name: 'Blessing Okonkwo', group: 'State ADP Cluster', crops: ['Rice', 'Maize'], plots: 2, hectares: 4.5, status: 'Active', lga: 'Enugu North' },
];

const mockGroups = [
  { name: 'Ogun Coop Society', type: 'Cooperative', members: 342, hectares: 1240, crops: 6, status: 'Active' },
  { name: 'Women Agric Network', type: 'NGO', members: 187, hectares: 680, crops: 4, status: 'Active' },
  { name: 'IFAD Smallholder Program', type: 'International', members: 523, hectares: 2100, crops: 8, status: 'Active' },
  { name: 'State ADP Cluster', type: 'Government', members: 891, hectares: 3400, crops: 5, status: 'Active' },
];

const statusColor = (s) => {
  if (s === 'Active') return 'text-green-600 bg-green-50';
  if (s === 'Pending Review') return 'text-amber-600 bg-amber-50';
  return 'text-gray-400 bg-gray-50';
};

const typeColor = (t) => {
  if (t === 'Cooperative') return 'text-blue-600 bg-blue-50';
  if (t === 'NGO') return 'text-purple-600 bg-purple-50';
  if (t === 'Government') return 'text-amber-600 bg-amber-50';
  return 'text-teal-600 bg-teal-50';
};

const GroupsDashboard = ({ mode, onBack }) => {
  const [activeView, setActiveView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const modeConfig = {
    'group-management': { 
      title: 'Groups Management', 
      subtitle: 'Large-scale smallholder group administration, input planning, and land area management.' 
    },
  };

  const config = modeConfig[mode] || modeConfig['group-management'];

  const filteredFarmers = mockFarmers.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.crops.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {onBack && (
            <button onClick={onBack} className="text-gray-400 hover:text-[var(--brand-primary)] transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-4">
            <img src="/farmintelytics-logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-black leading-none">{config.title}</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">{config.subtitle}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Active Session</div>
            <div className="text-sm font-bold text-black">admin@farmintelytics.com</div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-white border-b border-gray-100 px-8">
        <div className="flex items-center gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
            { id: 'farmers', label: 'Farmer Registry', icon: <Users size={16} /> },
            { id: 'inputs', label: 'Input Planning', icon: <Zap size={16} /> },
            { id: 'plots', label: 'Land Area Mapping', icon: <MapPin size={16} /> },
            { id: 'crops', label: 'Crop Portfolio', icon: <Layers size={16} /> },
            { id: 'compliance', label: 'Compliance Audit', icon: <FileText size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 py-4 text-[12px] font-black uppercase tracking-widest border-b-3 transition-all ${
                activeView === tab.id
                  ? 'text-[var(--brand-primary)] border-[var(--brand-primary)]'
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
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Farmers', value: '42,108', sub: 'Across 1,200 clusters' },
            { label: 'Input Allocation', value: '85.2%', sub: 'Seed & Fertilizer tracked' },
            { label: 'Planned Area', value: '124.5k Ha', sub: 'Verified via Satellite' },
            { label: 'Total Clusters', value: '1,240', sub: 'Zone 1-4 Administration' },
            { label: 'Smallholder Crop Portfolio', value: '12 Crops', sub: 'Active mixed cultivation' },
            { label: 'Scale Capacity', value: '10M+', sub: 'Enterprise infrastructure' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">{kpi.label}</div>
              <div className="text-2xl font-black text-black tracking-tight">{kpi.value}</div>
              <div className="text-[11px] font-bold text-[var(--brand-primary)] mt-1">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Farmer ID, Cluster Name, or Input Batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm font-bold outline-none focus:border-[var(--brand-primary)] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all">
            <Filter size={14} />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all">
            <ChevronDown size={14} />
            Export
          </button>
        </div>

        {/* Groups Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { name: 'Northern Grain Cluster', type: 'Smallholder Group', members: 12400, hectares: 45000, crops: 4, status: 'Active' },
            { name: 'Delta Oil Palm Zone', type: 'Outgrower Scheme', members: 8500, hectares: 32000, crops: 2, status: 'Active' },
            { name: 'Southwestern Cocoa Hub', type: 'Cooperative Union', members: 15200, hectares: 68000, crops: 3, status: 'Active' },
            { name: 'Beltway Maize Network', type: 'Smallholder Group', members: 21000, hectares: 94000, crops: 2, status: 'Active' },
          ].map((group, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[var(--brand-primary)]/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${typeColor(group.type)}`}>
                  {group.type}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600">{group.status}</span>
              </div>
              <h3 className="text-base font-black text-black tracking-tight mb-4">{group.name}</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Farmers</div>
                  <div className="text-lg font-black text-black">{(group.members/1000).toFixed(1)}k</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Area (Ha)</div>
                  <div className="text-lg font-black text-black">{(group.hectares/1000).toFixed(1)}k</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Crops</div>
                  <div className="text-lg font-black text-black">{group.crops}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Farmer Registry Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-black">Group Farmer Registry</h3>
            <span className="text-[11px] font-bold text-gray-400">{filteredFarmers.length} active records shown</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  {['Farmer ID', 'Name', 'Cluster / Group', 'Planned Crops', 'Area (Ha)', 'Input Status', 'LGA', 'Audit'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer, i) => (
                  <tr key={farmer.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-[12px] font-black text-[var(--brand-primary)] tracking-wider">{farmer.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-black">{farmer.name}</td>
                    <td className="px-6 py-4 text-[12px] font-bold text-gray-600">{farmer.group}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {farmer.crops.map(c => (
                          <span key={c} className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-black">{farmer.hectares}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-[var(--brand-primary)]" style={{ width: farmer.plots > 3 ? '100%' : '60%' }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{farmer.plots > 3 ? 'Distributed' : 'Partial'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[12px] font-bold text-gray-500">{farmer.lga}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${statusColor(farmer.status)}`}>
                        {farmer.status === 'Active' ? 'Verified' : farmer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-center">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Powered by Farmintelytics</div>
      </footer>
    </div>
  );
};

export default GroupsDashboard;
