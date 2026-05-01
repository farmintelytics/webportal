import React from 'react';
import { ChevronDown, RotateCcw, TrendingUp, TrendingDown, Droplets, ThermometerSun, BarChart3, AlertTriangle } from 'lucide-react';

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

const QualityBar = ({ label, pct, color, target }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-[11px] font-black text-gray-600">{label}</span>
      <span className="text-[11px] font-black text-gray-900">{pct}%</span>
    </div>
    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }}></div>
      {target && <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400" style={{ left: `${target}%` }}></div>}
    </div>
    {target && <div className="text-[9px] text-gray-400 font-bold mt-1">Target: {target}%</div>}
  </div>
);

const RiceDashboard = () => (
  <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Rice Intelligence Monitor</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">Paddy yield · Milling quality · Head rice rate · Moisture control</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">All Paddies <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm"><RotateCcw size={14} /> Reset</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Net Yield" value="5.8" unit="t/ha" subLabel="Paddy per hectare" trend={4.3} color="bg-yellow-500" />
      <KPICard label="Head Rice Yield" value="64.2" unit="%" subLabel="Premium grade whole kernels" trend={2.1} color="bg-green-500" />
      <KPICard label="Broken Rice" value="8.4" unit="%" subLabel="Target: <8%" trend={-0.8} color="bg-red-400" />
      <KPICard label="Harvest Moisture" value="21.3" unit="%" subLabel="Optimal: 20–24%" color="bg-blue-400" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Milling Quality Index</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Kernel quality breakdown against benchmark targets</p>
        <div className="space-y-6">
          <QualityBar label="Milled Rice Yield (MRY)" pct={67.4} color="bg-green-500" target={65} />
          <QualityBar label="Head Rice Yield (HRY)" pct={64.2} color="bg-emerald-400" target={60} />
          <QualityBar label="Chalk Content" pct={12.1} color="bg-amber-400" target={15} />
          <QualityBar label="Broken Rice Yield (BKY)" pct={8.4} color="bg-red-400" target={8} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-base font-black text-gray-900 mb-6 tracking-tight">Drying Station Monitor</h3>
          <div className="space-y-4">
            {[
              { station: 'Station A', moisture: '22.4%', target: '14%', status: 'Drying', progress: 60 },
              { station: 'Station B', moisture: '14.2%', target: '14%', status: 'Complete', progress: 100 },
              { station: 'Station C', moisture: '19.8%', target: '14%', status: 'Drying', progress: 42 },
            ].map(s => (
              <div key={s.station} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[12px] font-black">{s.station}</div>
                    <div className="text-[10px] text-gray-400 font-bold">{s.moisture} → {s.target}</div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    s.status === 'Complete' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>{s.status}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.status === 'Complete' ? 'bg-emerald-500' : 'bg-blue-400'}`} style={{ width: `${s.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-6 rounded-2xl text-white shadow-xl">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Premium Price Capture</div>
          <div className="text-5xl font-black mb-2">78<span className="text-2xl opacity-60">%</span></div>
          <div className="text-[12px] font-bold opacity-80">of revenue from premium-grade rice</div>
          <div className="mt-4 text-[11px] opacity-60 font-medium">Verified via head rice quality classification</div>
        </div>
      </div>
    </div>

    <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Seasonal Paddy Harvest Log</h3>
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {['Plot ID', 'Variety', 'Area (ha)', 'Moisture at Harvest', 'Yield (t)', 'MRY', 'Status'].map(h => (
                <th key={h} className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-4 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { plot: 'P-Ibadan-01', variety: 'FARO 44', area: 4.2, moisture: '21.2%', yield: 24.4, mry: '67%', status: 'Milled' },
              { plot: 'P-Ibadan-02', variety: 'FARO 52', area: 3.8, moisture: '22.8%', yield: 21.1, mry: '65%', status: 'Drying' },
              { plot: 'P-Kano-01', variety: 'SIPI', area: 5.1, moisture: '20.4%', yield: 29.6, mry: '68%', status: 'Harvested' },
            ].map(row => (
              <tr key={row.plot} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 pr-6 text-[12px] font-black text-yellow-600">{row.plot}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-600">{row.variety}</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.area}</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.moisture}</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.yield}</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.mry}</td>
                <td className="py-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    row.status === 'Milled' ? 'bg-emerald-50 text-emerald-600' :
                    row.status === 'Drying' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default RiceDashboard;
