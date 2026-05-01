import React, { useState } from 'react';
import { Globe, Layers, ChevronDown, RotateCcw, TrendingUp, TrendingDown, Satellite, Eye, AlertTriangle, Zap } from 'lucide-react';

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
        {Math.abs(trend)}% vs last pass
      </div>
    )}
  </div>
);

const VegetationBlock = ({ id, ndvi, evi, health }) => {
  const healthColor = health === 'Healthy' ? 'bg-emerald-500' : health === 'Stressed' ? 'bg-amber-500' : 'bg-red-500';
  const blockBg = health === 'Healthy' ? 'bg-emerald-50' : health === 'Stressed' ? 'bg-amber-50' : 'bg-red-50';
  return (
    <div className={`p-4 rounded-2xl ${blockBg} flex items-center justify-between`}>
      <div>
        <div className="text-[12px] font-black text-gray-900">{id}</div>
        <div className="text-[10px] text-gray-500 font-bold">NDVI: {ndvi} · EVI: {evi}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${healthColor}`}></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{health}</span>
      </div>
    </div>
  );
};

const CanopyDashboard = () => {
  const [activeLayer, setActiveLayer] = useState('NDVI');
  const layers = ['NDVI', 'EVI', 'SAR', 'Soil Moisture'];

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Canopy Analysis · Remote Sensing</h1>
          <p className="text-[13px] text-gray-500 mt-1 font-medium">Satellite NDVI/EVI · GeoAI land classification · Canopy health · Change detection</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">All Zones <ChevronDown size={14} className="text-gray-400" /></button>
          <div className="flex items-center gap-1 bg-white border border-black/5 p-1 rounded-xl shadow-sm">
            {layers.map(l => (
              <button key={l} onClick={() => setActiveLayer(l)} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${activeLayer === l ? 'bg-[var(--brand-primary)] text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Mean NDVI" value="0.74" subLabel="Active vegetation index" trend={2.1} color="bg-emerald-500" />
        <KPICard label="Canopy Cover" value="86.3" unit="%" subLabel="Satellite-derived estimate" trend={-1.4} color="bg-green-600" />
        <KPICard label="Stressed Blocks" value="7" subLabel="NDVI < 0.4 (critical threshold)" trend={-30} color="bg-amber-500" />
        <KPICard label="Last Satellite Pass" value="6h" subLabel="ago — Sentinel-2 · 10m res." color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Vegetation Index Map</h3>
            <p className="text-[12px] text-gray-500 font-medium">{activeLayer} · Cashew plantation aerial view</p>
          </div>
          <div className="relative h-[380px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
            {/* Simulated satellite visualization */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-0.5 p-3 opacity-80">
              {[...Array(48)].map((_, i) => {
                const rand = (Math.sin(i * 7.3) + 1) / 2;
                const color = rand > 0.7 ? 'bg-emerald-600' : rand > 0.5 ? 'bg-green-500' : rand > 0.35 ? 'bg-yellow-500' : rand > 0.2 ? 'bg-amber-600' : 'bg-red-700';
                return <div key={i} className={`${color} rounded-sm opacity-90`}></div>;
              })}
            </div>
            <div className="relative z-10 bg-black/40 backdrop-blur-xl rounded-2xl px-6 py-4 text-center border border-white/10">
              <Satellite size={28} className="text-white/70 mx-auto mb-2" />
              <div className="text-white font-black text-sm">{activeLayer} Layer · Sentinel-2</div>
              <div className="text-white/50 text-[10px] font-bold mt-1">10m Resolution · Last updated 6h ago</div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur rounded-xl p-3 flex gap-2 items-center">
              {[['Low', 'bg-red-600'], ['Med', 'bg-amber-500'], ['Good', 'bg-yellow-400'], ['High', 'bg-green-500'], ['Peak', 'bg-emerald-400']].map(([l, c]) => (
                <div key={l} className="flex flex-col items-center gap-1">
                  <div className={`w-4 h-2 rounded ${c}`}></div>
                  <span className="text-[8px] text-white/60 font-bold">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <h3 className="text-base font-black text-gray-900 mb-4 tracking-tight">Block Health Index</h3>
            <div className="space-y-3">
              <VegetationBlock id="Block A1 · Ogba" ndvi="0.82" evi="0.71" health="Healthy" />
              <VegetationBlock id="Block B3 · Irele" ndvi="0.54" evi="0.46" health="Stressed" />
              <VegetationBlock id="Block C2 · Ore" ndvi="0.78" evi="0.68" health="Healthy" />
              <VegetationBlock id="Block D1 · Akure" ndvi="0.31" evi="0.29" health="Critical" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-800 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
            <Eye size={24} className="mb-3 opacity-70" />
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Change Detection Alert</div>
            <div className="text-xl font-black mb-1">3 Encroachments</div>
            <div className="text-[12px] font-bold opacity-70">Detected in last 30 days vs. boundary map</div>
            <button className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all">View Alerts</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanopyDashboard;
