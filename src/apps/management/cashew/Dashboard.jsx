import React, { useState } from 'react';
import { ChevronDown, Calendar, RotateCcw, TrendingUp, TrendingDown, Award, Layers, BarChart3 } from 'lucide-react';

const KPICard = ({ label, value, unit, subLabel, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all group">
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

const GradeBar = ({ grade, pct, color }) => (
  <div className="flex items-center gap-4">
    <div className="text-[11px] font-black text-gray-600 w-12">{grade}</div>
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }}></div>
    </div>
    <div className="text-[11px] font-black text-gray-400 w-10 text-right">{pct}%</div>
  </div>
);

const CashewDashboard = () => (
  <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Cashew Intelligence Hub</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">Farm-to-factory tracking · Kernel yield · Grade analytics</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">All Farms <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm"><RotateCcw size={14} /> Reset</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Kernel Out-Turn Ratio" value="22.4" unit="%" subLabel="Target: 20–25%" trend={3.2} color="bg-amber-500" />
      <KPICard label="Raw Cashew Collected" value="48.6" unit="MT" subLabel="Current season" trend={8.1} color="bg-orange-600" />
      <KPICard label="Traceability Rate" value="94.2" unit="%" subLabel="Farm-to-export verified" trend={1.4} color="bg-emerald-500" />
      <KPICard label="Premium Grade (W180)" value="31.8" unit="%" subLabel="Of total kernel output" trend={-2.1} color="bg-red-400" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Grade Distribution</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Kernel quality breakdown by international grade classification</p>
        <div className="space-y-5">
          <GradeBar grade="W180" pct={31.8} color="bg-amber-500" />
          <GradeBar grade="W240" pct={28.4} color="bg-orange-400" />
          <GradeBar grade="W320" pct={21.1} color="bg-yellow-400" />
          <GradeBar grade="SW" pct={9.3} color="bg-gray-400" />
          <GradeBar grade="Splits" pct={9.4} color="bg-red-300" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Processing Stages</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-8">Current batch status across post-harvest workflow</p>
        <div className="space-y-4">
          {[
            { stage: 'Reception & Weighing', qty: '12.4 MT', status: 'Active', color: 'bg-emerald-500' },
            { stage: 'Steaming', qty: '8.1 MT', status: 'In Progress', color: 'bg-blue-500' },
            { stage: 'Shelling', qty: '6.8 MT', status: 'In Progress', color: 'bg-blue-500' },
            { stage: 'Peeling & Grading', qty: '5.2 MT', status: 'Queued', color: 'bg-amber-500' },
            { stage: 'Roasting & Packing', qty: '3.1 MT', status: 'Queued', color: 'bg-gray-300' },
          ].map(row => (
            <div key={row.stage} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${row.color}`}></div>
                <span className="text-[12px] font-bold">{row.stage}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[12px] font-black text-gray-700">{row.qty}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                  row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                  row.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Farm Traceability Ledger</h3>
      <p className="text-[12px] text-gray-500 font-medium mb-8">End-to-end batch traceability from registered farm plots to export grading</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {['Batch ID', 'Farm / Plot', 'Harvest Date', 'Weight (MT)', 'Grade', 'Status'].map(h => (
                <th key={h} className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-4 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-2">
            {[
              { batch: 'CW-2026-041', farm: 'Ogba North / P-12', date: 'Apr 28', weight: 4.2, grade: 'W180', status: 'Exported' },
              { batch: 'CW-2026-042', farm: 'Ogba South / P-07', date: 'Apr 30', weight: 3.8, grade: 'W240', status: 'Processing' },
              { batch: 'CW-2026-043', farm: 'Okitipupa / P-02', date: 'May 01', weight: 4.6, grade: 'Pending', status: 'Reception' },
            ].map(row => (
              <tr key={row.batch} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 pr-6 text-[12px] font-black text-[#D35400]">{row.batch}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-600">{row.farm}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-500">{row.date}</td>
                <td className="py-4 pr-6 text-[12px] font-black">{row.weight}</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.grade}</td>
                <td className="py-4 pr-6">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    row.status === 'Exported' ? 'bg-emerald-50 text-emerald-600' :
                    row.status === 'Processing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
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

export default CashewDashboard;
