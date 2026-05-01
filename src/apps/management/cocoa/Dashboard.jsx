import React, { useState } from 'react';
import { ChevronDown, RotateCcw, TrendingUp, TrendingDown, Thermometer, Droplets, Award } from 'lucide-react';

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

const BatchTimeline = ({ batch, stage, pct, temp, ph }) => (
  <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
    <div className="flex items-center justify-between">
      <div className="text-[12px] font-black">{batch}</div>
      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
        pct === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
      }`}>{pct === 100 ? 'Complete' : `Day ${Math.round(pct/14)} of 7`}</span>
    </div>
    <div className="flex gap-6 text-[11px]">
      <div className="flex items-center gap-1.5 font-bold text-gray-600">
        <Thermometer size={12} className="text-red-400" /> {temp}°C
      </div>
      <div className="flex items-center gap-1.5 font-bold text-gray-600">
        <Droplets size={12} className="text-blue-400" /> pH {ph}
      </div>
    </div>
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold text-gray-400">
        <span>{stage}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-amber-600 rounded-full" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  </div>
);

const CocoaDashboard = () => (
  <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Cocoa Intelligence Core</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">Fermentation · Drying · Grading · Traceability</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">All Farms <ChevronDown size={14} className="text-gray-400" /></button>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm"><RotateCcw size={14} /> Reset</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Export Grade Volume" value="18.4" unit="MT" subLabel="Premium export-grade beans" trend={6.2} color="bg-amber-700" />
      <KPICard label="Avg. Fermentation Index" value="87.4" unit="FI" subLabel="Target: FI > 75 (well-fermented)" trend={3.1} color="bg-amber-500" />
      <KPICard label="Moisture (Final)" value="6.4" unit="%" subLabel="Target: 6–7% for storage" color="bg-blue-400" />
      <KPICard label="Defect Rate" value="4.2" unit="%" subLabel="Moldy, insect-damaged beans" trend={-1.8} color="bg-red-400" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Active Fermentation Batches</h3>
        <p className="text-[12px] text-gray-500 font-medium mb-6">Live temperature & pH monitoring per batch (target: 45–50°C peak by Day 3)</p>
        <div className="space-y-4">
          <BatchTimeline batch="Batch CCW-041 · Ondo Farm" stage="Primary Fermentation" pct={57} temp={47.2} ph={4.8} />
          <BatchTimeline batch="Batch CCW-042 · Osun Farm" stage="Secondary Turn" pct={28} temp={42.1} ph={5.2} />
          <BatchTimeline batch="Batch CCW-040 · Cross River" stage="Complete - Moved to Drying" pct={100} temp={36.4} ph={5.1} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-base font-black text-gray-900 mb-6 tracking-tight">Grade Distribution</h3>
          <div className="space-y-4">
            {[
              { grade: 'Export Grade 1', pct: 62.4, color: 'bg-amber-600' },
              { grade: 'Export Grade 2', pct: 24.1, color: 'bg-amber-400' },
              { grade: 'Sub-Standard', pct: 9.3, color: 'bg-gray-400' },
              { grade: 'Reject', pct: 4.2, color: 'bg-red-400' },
            ].map(g => (
              <div key={g.grade} className="flex items-center gap-4">
                <div className="text-[11px] font-bold text-gray-600 w-28">{g.grade}</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${g.color}`} style={{ width: `${g.pct}%` }}></div>
                </div>
                <div className="text-[11px] font-black text-gray-700 w-8 text-right">{g.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-6 rounded-2xl text-white shadow-xl">
          <Award size={24} className="mb-3 opacity-70" />
          <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Traceability Compliance</div>
          <div className="text-5xl font-black mb-2">96<span className="text-2xl opacity-60">%</span></div>
          <div className="text-[12px] font-bold opacity-70">Batch-to-farm tracing. Export-ready documentation.</div>
        </div>
      </div>
    </div>

    <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Batch Traceability Ledger</h3>
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {['Batch ID', 'Source Farm', 'Fermentation (d)', 'Moisture %', 'Grade', 'Defects %', 'Status'].map(h => (
                <th key={h} className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-4 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { batch: 'CCW-038', farm: 'Ondo North', days: 6, moisture: '6.2%', grade: 'Export 1', defects: '2.4%', status: 'Exported' },
              { batch: 'CCW-039', farm: 'Osun Central', days: 7, moisture: '6.8%', grade: 'Export 2', defects: '5.1%', status: 'Packed' },
              { batch: 'CCW-040', farm: 'Cross River', days: 7, moisture: '7.1%', grade: 'Export 1', defects: '3.8%', status: 'Drying' },
            ].map(row => (
              <tr key={row.batch} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-4 pr-6 text-[12px] font-black text-amber-700">{row.batch}</td>
                <td className="py-4 pr-6 text-[12px] font-bold text-gray-600">{row.farm}</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.days} days</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.moisture}</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.grade}</td>
                <td className="py-4 pr-6 text-[12px] font-bold">{row.defects}</td>
                <td className="py-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    row.status === 'Exported' ? 'bg-emerald-50 text-emerald-600' :
                    row.status === 'Packed' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
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

export default CocoaDashboard;
