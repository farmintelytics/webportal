import React from 'react';
import { ChevronDown, RotateCcw, TrendingUp, TrendingDown, Users, Clock, Droplets, TreePine } from 'lucide-react';

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
        {Math.abs(trend)}% vs last cycle
      </div>
    )}
  </div>
);

const RubberDashboard = () => (
  <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Rubber Estate Management</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">Latex collection · Tapping cycles · Worker performance · DRC analytics</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">All Estates <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm"><RotateCcw size={14} /> Reset</button>
      </div>
    </div>

    {/* KPI Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Latex Collected Today" value="2,840" unit="KG" subLabel="Across 14 active blocks" trend={5.3} color="bg-emerald-500" />
      <KPICard label="Dry Rubber Content" value="34.2" unit="%" subLabel="Average DRC this week" trend={1.8} color="bg-teal-500" />
      <KPICard label="Active Tappers" value="86" unit="" subLabel="Out of 112 registered" trend={-3.2} color="bg-amber-500" />
      <KPICard label="Trees in Tapping" value="18,400" unit="" subLabel="Mature panel: 72%" trend={2.1} color="bg-green-600" />
    </div>

    {/* Tapping Schedule + Worker Performance */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Tapping Cycle Schedule</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">D/3 rotation system · Panel management across estate blocks</p>
        <div className="space-y-4">
          {[
            { block: 'Block A — Panel BO-1', trees: '3,200', cycle: 'D/3', status: 'Tapping Today', color: 'bg-emerald-500' },
            { block: 'Block B — Panel BO-1', trees: '2,800', cycle: 'D/3', status: 'Rest Day', color: 'bg-gray-300' },
            { block: 'Block C — Panel BO-2', trees: '4,100', cycle: 'D/3', status: 'Tapping Today', color: 'bg-emerald-500' },
            { block: 'Block D — Panel BI-1', trees: '2,400', cycle: 'D/4', status: 'Rest Day', color: 'bg-gray-300' },
            { block: 'Block E — Panel BO-1', trees: '3,600', cycle: 'D/3', status: 'Rain Delay', color: 'bg-blue-400' },
            { block: 'Block F — New Planting', trees: '2,300', cycle: '—', status: 'Immature', color: 'bg-amber-400' },
          ].map(row => (
            <div key={row.block} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${row.color}`}></div>
                <div>
                  <span className="text-[12px] font-bold block">{row.block}</span>
                  <span className="text-[10px] text-gray-400">{row.trees} trees · {row.cycle}</span>
                </div>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                row.status === 'Tapping Today' ? 'bg-emerald-50 text-emerald-600' :
                row.status === 'Rain Delay' ? 'bg-blue-50 text-blue-600' :
                row.status === 'Immature' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-400'
              }`}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Tapper Performance</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Daily latex yield per worker · Quality adherence</p>
        <div className="space-y-4">
          {[
            { name: 'Adamu Musa', trees: 220, latex: '38.4 KG', drc: '35.1%', quality: 'A' },
            { name: 'Ibrahim Sule', trees: 210, latex: '34.2 KG', drc: '33.8%', quality: 'A' },
            { name: 'Chukwu Emeka', trees: 215, latex: '31.6 KG', drc: '32.4%', quality: 'B' },
            { name: 'Ojo Babatunde', trees: 205, latex: '28.9 KG', drc: '30.2%', quality: 'B' },
            { name: 'Yusuf Garba', trees: 180, latex: '22.1 KG', drc: '28.6%', quality: 'C' },
          ].map(w => (
            <div key={w.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-[10px] font-black">{w.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <span className="text-[12px] font-bold block">{w.name}</span>
                  <span className="text-[10px] text-gray-400">{w.trees} trees assigned</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[12px] font-black">{w.latex}</div>
                  <div className="text-[9px] text-gray-400">DRC {w.drc}</div>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                  w.quality === 'A' ? 'bg-emerald-50 text-emerald-600' :
                  w.quality === 'B' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
                }`}>{w.quality}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Collection Log Table */}
    <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Latex Collection Ledger</h3>
      <p className="text-[12px] text-gray-500 font-medium mb-8">Daily cup lump and field latex intake records</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {['Date', 'Block', 'Tapper', 'Cup Lump (KG)', 'Field Latex (KG)', 'DRC %', 'Status'].map(h => (
                <th key={h} className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-4 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { date: 'May 01', block: 'Block A', tapper: 'Adamu M.', cup: 12.4, field: 26.0, drc: 35.1, status: 'Verified' },
              { date: 'May 01', block: 'Block C', tapper: 'Ibrahim S.', cup: 10.8, field: 23.4, drc: 33.8, status: 'Verified' },
              { date: 'Apr 30', block: 'Block A', tapper: 'Chukwu E.', cup: 9.2, field: 22.4, drc: 32.4, status: 'Pending' },
              { date: 'Apr 30', block: 'Block D', tapper: 'Yusuf G.', cup: 7.6, field: 14.5, drc: 28.6, status: 'Flagged' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-500">{row.date}</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.block}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-600">{row.tapper}</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.cup}</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.field}</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.drc}%</td>
                <td className="py-4 pr-6">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    row.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' :
                    row.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
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

export default RubberDashboard;
