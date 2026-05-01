import React from 'react';
import { ChevronDown, RotateCcw, TrendingUp, TrendingDown, Users, Truck, Sun, Droplets } from 'lucide-react';

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

const MaizeDashboard = () => (
  <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Maize Operations Hub</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">Seasonal labor · Grain moisture · Silo inventory · Cooperative management</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">All Zones <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">Main Season <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm"><RotateCcw size={14} /> Reset</button>
      </div>
    </div>

    {/* KPI Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Total Grain Collected" value="412" unit="MT" subLabel="Main season 2026" trend={8.6} color="bg-yellow-500" />
      <KPICard label="Grain Moisture" value="14.2" unit="%" subLabel="Target: ≤ 13% for storage" trend={-1.4} color="bg-blue-500" />
      <KPICard label="Active Laborers" value="218" unit="" subLabel="Harvest burst workforce" trend={22.0} color="bg-emerald-500" />
      <KPICard label="Silo Capacity Used" value="68" unit="%" subLabel="3 of 5 silos operational" trend={15.3} color="bg-orange-500" />
    </div>

    {/* Labor Allocation + Silo Management */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Seasonal Labor Allocation</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Burst workforce deployment · Task-based assignment for planting and harvest windows</p>
        <div className="space-y-4">
          {[
            { task: 'Land Preparation', workers: 42, period: 'Feb — Mar', status: 'Completed', color: 'bg-gray-300' },
            { task: 'Seeding & Planting', workers: 68, period: 'Mar — Apr', status: 'Completed', color: 'bg-gray-300' },
            { task: 'Weeding / Fertilizer', workers: 36, period: 'Apr — May', status: 'Active', color: 'bg-emerald-500' },
            { task: 'Pest Scouting', workers: 12, period: 'Ongoing', status: 'Active', color: 'bg-emerald-500' },
            { task: 'Harvesting Crew', workers: 86, period: 'Jul — Aug', status: 'Scheduled', color: 'bg-amber-400' },
            { task: 'Drying & Shelling', workers: 24, period: 'Jul — Sep', status: 'Scheduled', color: 'bg-amber-400' },
            { task: 'Transport & Silo', workers: 18, period: 'Year-round', status: 'Standby', color: 'bg-blue-400' },
          ].map(row => (
            <div key={row.task} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${row.color}`}></div>
                <div>
                  <span className="text-[12px] font-bold block">{row.task}</span>
                  <span className="text-[10px] text-gray-400">{row.workers} workers · {row.period}</span>
                </div>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                row.status === 'Completed' ? 'bg-gray-100 text-gray-400' :
                row.status === 'Scheduled' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Silo & Storage Inventory</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Grain moisture, capacity, and condition monitoring</p>
        <div className="space-y-5">
          {[
            { name: 'Silo A — Kaduna', capacity: 200, stored: 182, moisture: 12.8, temp: 28 },
            { name: 'Silo B — Kaduna', capacity: 200, stored: 124, moisture: 13.4, temp: 29 },
            { name: 'Silo C — Kano', capacity: 150, stored: 98, moisture: 14.1, temp: 31 },
            { name: 'Silo D — Kano', capacity: 150, stored: 8, moisture: 15.2, temp: 32 },
            { name: 'Silo E — Zaria', capacity: 100, stored: 0, moisture: 0, temp: 0 },
          ].map(s => {
            const pct = Math.round((s.stored / s.capacity) * 100);
            const moistureOk = s.moisture > 0 && s.moisture <= 13;
            return (
              <div key={s.name} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[12px] font-bold">{s.name}</span>
                  <span className="text-[11px] font-black">{s.stored} / {s.capacity} MT</span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div className={`h-full rounded-full transition-all duration-1000 ${pct > 85 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : pct > 0 ? 'bg-emerald-500' : 'bg-gray-300'}`} style={{ width: `${pct}%` }}></div>
                </div>
                <div className="flex gap-6 text-[10px]">
                  {s.stored > 0 ? (
                    <>
                      <span className={`font-black ${moistureOk ? 'text-emerald-600' : 'text-amber-600'}`}>Moisture: {s.moisture}%</span>
                      <span className="font-bold text-gray-400">Temp: {s.temp}°C</span>
                      <span className="font-bold text-gray-400">{pct}% Full</span>
                    </>
                  ) : (
                    <span className="font-black text-gray-300 uppercase tracking-widest">Offline / Empty</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Farmer Groups */}
    <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Farmer Groups & Outgrower Schemes</h3>
      <p className="text-[12px] text-gray-500 font-medium mb-8">Cooperative clusters · Registered outgrowers · Aggregate production tracking</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {['Group Name', 'Coordinator', 'Farmers', 'Hectares', 'Est. Yield (MT)', 'Season Stage', 'Status'].map(h => (
                <th key={h} className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-4 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Kaduna Grain Coop', lead: 'Alhaji Shehu', farmers: 84, ha: 320, est: 128, stage: 'Vegetative', status: 'On Track' },
              { name: 'Zaria Agric Union', lead: 'Mr. Danladi', farmers: 62, ha: 240, est: 96, stage: 'Vegetative', status: 'On Track' },
              { name: 'Kano Youth Farmers', lead: 'Mallam Yusuf', farmers: 48, ha: 180, est: 72, stage: 'Tasseling', status: 'Watch' },
              { name: 'Plateau Grain Assoc', lead: 'Mrs. Nanle', farmers: 36, ha: 140, est: 56, stage: 'Planting', status: 'Delayed' },
              { name: 'Niger State Outgrowers', lead: 'Mr. Abdullahi', farmers: 28, ha: 100, est: 40, stage: 'Land Prep', status: 'New' },
            ].map(row => (
              <tr key={row.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 pr-6 text-[12px] font-black text-yellow-700">{row.name}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-600">{row.lead}</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.farmers}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-500">{row.ha} ha</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.est}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-500">{row.stage}</td>
                <td className="py-4 pr-6">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    row.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' :
                    row.status === 'Watch' ? 'bg-amber-50 text-amber-600' :
                    row.status === 'Delayed' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'
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

export default MaizeDashboard;
