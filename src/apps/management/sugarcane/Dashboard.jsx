import React from 'react';
import { ChevronDown, RotateCcw, TrendingUp, TrendingDown, Truck, Clock, Zap, AlertTriangle } from 'lucide-react';

const KPICard = ({ label, value, unit, subLabel, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all">
    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{label}</div>
    <div className="flex items-baseline gap-2 mb-1">
      <div className="text-4xl font-black text-gray-900 tracking-tighter">{value}</div>
      {unit && <div className="text-sm font-bold text-gray-400">{unit}</div>}
    </div>
    <div className="text-[11px] text-gray-500 font-medium">{subLabel}</div>
    <div className={`mt-4 h-1.5 w-8 rounded-full ${color}`}></div>
    {trend !== undefined && (
      <div className={`mt-2 flex items-center gap-1 text-[11px] font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(trend)}% vs last season
      </div>
    )}
  </div>
);

const SugarcaneDashboard = () => (
  <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Cane Intelligence Console</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">Yield · CCS monitoring · Crushing efficiency · Fleet logistics</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">All Estates <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm"><RotateCcw size={14} /> Reset</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Cane Yield" value="78.4" unit="t/ha" subLabel="Season-to-date average" trend={5.2} color="bg-green-500" />
      <KPICard label="CCS Content" value="13.6" unit="%" subLabel="Commercial Cane Sugar %" trend={-1.1} color="bg-amber-500" />
      <KPICard label="Crushing Rate" value="4,840" unit="TCD" subLabel="Tonnes crushed per day" trend={2.8} color="bg-emerald-600" />
      <KPICard label="Extraneous Matter" value="2.4" unit="%" subLabel="Non-cane material (target: <3%)" trend={-0.5} color="bg-red-400" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Fleet & Logistics Status</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Real-time vehicle status · Field-to-factory transport monitoring</p>
        <div className="space-y-3">
          {[
            { id: 'TRK-001', route: 'Block 4A → Mill A', status: 'In Transit', load: '28 t', eta: '14 min', utilization: 92 },
            { id: 'TRK-002', route: 'Block 7B → Mill A', status: 'Loading', load: '22 t', eta: '—', utilization: 71 },
            { id: 'TRK-003', route: 'Block 2C → Mill B', status: 'Unloading', load: '30 t', eta: 'Done', utilization: 100 },
            { id: 'TRK-004', route: 'Mill B → Field', status: 'Returning', load: '0 t', eta: '22 min', utilization: 0 },
            { id: 'TRK-005', route: 'Block 9A → Mill B', status: 'Idle', load: '—', eta: '—', utilization: 0 },
          ].map(v => (
            <div key={v.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Truck size={18} className="text-gray-400" />
                </div>
                <div>
                  <div className="text-[13px] font-black">{v.id}</div>
                  <div className="text-[11px] text-gray-500 font-medium">{v.route}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[11px] font-black">{v.load}</div>
                  <div className="text-[10px] text-gray-400 font-bold">Load</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-black">{v.eta}</div>
                  <div className="text-[10px] text-gray-400 font-bold">ETA</div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                  v.status === 'In Transit' ? 'bg-blue-50 text-blue-600' :
                  v.status === 'Loading' ? 'bg-amber-50 text-amber-600' :
                  v.status === 'Unloading' ? 'bg-emerald-50 text-emerald-600' :
                  v.status === 'Returning' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-400'
                }`}>{v.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-base font-black text-gray-900 mb-6 tracking-tight">Harvesting KPIs</h3>
          <div className="space-y-5">
            {[
              { label: 'Throughput', value: '142 t/hr', icon: <Zap size={16} className="text-amber-500" /> },
              { label: 'Field Capacity', value: '2.8 ha/hr', icon: <Clock size={16} className="text-blue-500" /> },
              { label: 'Machine Downtime', value: '1.4 hrs', icon: <AlertTriangle size={16} className="text-red-400" /> },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                  {item.icon} {item.label}
                </div>
                <div className="text-[14px] font-black text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-2xl text-white shadow-xl">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">CCS Target Status</div>
          <div className="text-5xl font-black mb-2">13.6<span className="text-2xl opacity-60">%</span></div>
          <div className="text-[12px] font-bold opacity-70 mb-6">Optimal harvest window: 12.5–14.5%</div>
          <div className="h-2 bg-white/20 rounded-full">
            <div className="h-full w-[78%] bg-white rounded-full"></div>
          </div>
          <div className="text-[11px] font-black mt-2 opacity-70">78% of harvest target met</div>
        </div>
      </div>
    </div>
  </div>
);

export default SugarcaneDashboard;
