import React from 'react';
import { ChevronDown, RotateCcw, TrendingUp, TrendingDown, Users, Truck, Sprout, Scale } from 'lucide-react';

const KPICard = ({ label, value, unit, subLabel, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all">
    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{label}</div>
    <div className="flex items-baseline gap-2 mb-1">
      <div className="text-4xl font-black text-gray-900 tracking-tighter">{value}</div>
      {unit && <div className="text-sm font-bold text-gray-400">{unit}</div>}
    </div>
    <div className="text-[11px] text-gray-500 font-medium">{subLabel}</div>
    <div className={`mt-4 h-1.5 w-8 rounded-full ${color}`}></div>
    {trend && (
      <div className={`mt-2 flex items-center gap-1 text-[11px] font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(trend)}% vs last season
      </div>
    )}
  </div>
);

const CassavaDashboard = () => (
  <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Cassava Operations Hub</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">Harvest logistics · Cooperative groups · Starch content · Smallholder management</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">All Groups <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">Season 2026 <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm"><RotateCcw size={14} /> Reset</button>
      </div>
    </div>

    {/* KPI Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Total Harvest" value="186" unit="MT" subLabel="Season-to-date collection" trend={12.4} color="bg-amber-600" />
      <KPICard label="Starch Content" value="28.6" unit="%" subLabel="Average across deliveries" trend={2.1} color="bg-orange-500" />
      <KPICard label="Active Farmers" value="342" unit="" subLabel="Across 8 cooperative groups" trend={18.0} color="bg-emerald-500" />
      <KPICard label="Pending Deliveries" value="14" unit="" subLabel="Scheduled for this week" trend={-5.2} color="bg-blue-500" />
    </div>

    {/* Cooperative Groups + Harvest Zones */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Cooperative Group Management</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Farmer groups · Lead coordinators · Aggregate production</p>
        <div className="space-y-4">
          {[
            { name: 'Ifo Cassava Growers', lead: 'Mrs. Afolabi', farmers: 62, harvest: '42.8 MT', status: 'Active' },
            { name: 'Owode Agric Cluster', lead: 'Mr. Olawale', farmers: 48, harvest: '36.2 MT', status: 'Active' },
            { name: 'Sagamu Women Coop', lead: 'Mrs. Adeyemi', farmers: 54, harvest: '31.4 MT', status: 'Active' },
            { name: 'Abeokuta Youth Agric', lead: 'Mr. Tunde', farmers: 38, harvest: '24.6 MT', status: 'Harvesting' },
            { name: 'Ilaro Farming Union', lead: 'Mr. Balogun', farmers: 45, harvest: '18.2 MT', status: 'Pre-harvest' },
            { name: 'Otta Progressive Farm', lead: 'Mrs. Nwankwo', farmers: 41, harvest: '14.8 MT', status: 'Pre-harvest' },
            { name: 'Ewekoro Coop Farms', lead: 'Mr. Adeniyi', farmers: 32, harvest: '10.4 MT', status: 'Planting' },
            { name: 'Ikenne Root Crops', lead: 'Mrs. Ogunbiyi', farmers: 22, harvest: '7.6 MT', status: 'Planting' },
          ].map(g => (
            <div key={g.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">
                  <Users size={14} />
                </div>
                <div>
                  <span className="text-[12px] font-bold block">{g.name}</span>
                  <span className="text-[10px] text-gray-400">{g.lead} · {g.farmers} farmers</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[12px] font-black text-right">{g.harvest}</div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                  g.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                  g.status === 'Harvesting' ? 'bg-blue-50 text-blue-600' :
                  g.status === 'Pre-harvest' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-400'
                }`}>{g.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Workforce Allocation</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Labor categories · Seasonal vs permanent workforce</p>
        <div className="space-y-6">
          {[
            { role: 'Field Harvesters', count: 124, type: 'Seasonal', pct: 85 },
            { role: 'Transport / Logistics', count: 18, type: 'Permanent', pct: 92 },
            { role: 'Quality Inspectors', count: 8, type: 'Permanent', pct: 100 },
            { role: 'Group Coordinators', count: 8, type: 'Permanent', pct: 100 },
            { role: 'Processing Plant Staff', count: 32, type: 'Permanent', pct: 78 },
          ].map(w => (
            <div key={w.role}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-[12px] font-bold">{w.role}</span>
                  <span className="text-[10px] text-gray-400 ml-2">· {w.count} workers · {w.type}</span>
                </div>
                <span className="text-[11px] font-black">{w.pct}% Active</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${w.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Delivery Log Table */}
    <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Delivery & Intake Ledger</h3>
      <p className="text-[12px] text-gray-500 font-medium mb-8">Truckload reception · Weight verification · Starch quality checks</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {['Delivery ID', 'Group / Farmer', 'Date', 'Weight (MT)', 'Starch %', 'Variety', 'Status'].map(h => (
                <th key={h} className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-4 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'CV-2026-088', group: 'Ifo Cassava Growers', date: 'May 01', weight: 8.4, starch: 30.2, variety: 'TMS 419', status: 'Accepted' },
              { id: 'CV-2026-087', group: 'Owode Agric Cluster', date: 'May 01', weight: 6.2, starch: 27.8, variety: 'TME 419', status: 'Accepted' },
              { id: 'CV-2026-086', group: 'Sagamu Women Coop', date: 'Apr 30', weight: 7.1, starch: 29.4, variety: 'TMS 30572', status: 'Quality Hold' },
              { id: 'CV-2026-085', group: 'Abeokuta Youth Agric', date: 'Apr 30', weight: 5.8, starch: 24.1, variety: 'NR 8082', status: 'Rejected' },
            ].map(row => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 pr-6 text-[12px] font-black text-amber-600">{row.id}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-600">{row.group}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-500">{row.date}</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.weight}</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.starch}%</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-500">{row.variety}</td>
                <td className="py-4 pr-6">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    row.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' :
                    row.status === 'Quality Hold' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
                  }`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="pt-12 pb-8 border-t border-black/5 text-center">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Powered by Farmintelytics</div>
    </div>
  </div>
);

export default CassavaDashboard;
