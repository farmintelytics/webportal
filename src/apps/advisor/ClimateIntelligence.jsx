import React, { useState } from 'react';
import { 
  CloudRain, 
  Sun, 
  Thermometer, 
  Wind, 
  Droplets, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Trees, 
  Map as MapIcon,
  LogOut,
  ArrowLeft,
  Search,
  Filter,
  BarChart4,
  Zap,
  Info,
  Clock,
  Navigation,
  User,
  Bell,
  Satellite,
  Shield
} from 'lucide-react';
import { 
  SimpleCard, 
  MetricTile, 
  WorkerActivityTable, 
  GeospatialPreview 
} from '../../shared/components/SharedComponents';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ClimateIntelligence = ({ onSignOut, onBack }) => {
  const [activeView, setActiveView] = useState('weather');
  const [userName] = useState('Admin Manager');

  const weatherAdvice = [
    { type: 'Alert', title: 'Rainfall Surge Predicted', detail: '7-day forecast predicts 120mm rain. Delay seed planting in Block 5 to avoid soggy fields.', status: 'Action Required', icon: <CloudRain className="text-blue-500" /> },
    { type: 'Heat', title: 'Prolonged Heatwave', detail: 'Temperatures > 34°C expected. Increase irrigation frequency by 20% to stimulate evaporative cooling.', status: 'Operational Update', icon: <Sun className="text-orange-500" /> },
    { type: 'Harvest', title: 'Optimal Harvest Window', detail: 'Dry spell expected next week. Accelerate harvesting in Block 2 before the next rain cycle.', status: 'Recommendation', icon: <Zap className="text-amber-500" /> },
  ];

  const rsMetrics = [
    { block: 'B-Cocoa-01', area: '4.2 HA', ndre: '0.42', lswi: '0.45', rainfall: '480mm', predicted: '400 kg/ha', class: 'Optimal' },
    { block: 'B-Cocoa-05', area: '2.8 HA', ndre: '0.14', lswi: '0.18', rainfall: '310mm', predicted: '220 kg/ha', class: 'Critical Stress' },
    { block: 'B-Cocoa-02', area: '12.5 HA', ndre: '0.38', lswi: '0.32', rainfall: '450mm', predicted: '380 kg/ha', class: 'Good' },
  ];

  const columns = [
    { key: 'block', label: 'Block ID' },
    { key: 'area', label: 'Area' },
    { key: 'ndre', label: 'NDRE Score', render: (val) => <span className={`font-black ${Number(val) < 0.15 ? 'text-red-500' : 'text-emerald-600'}`}>{val}</span> },
    { key: 'lswi', label: 'LSWI Score', render: (val) => <span className={`font-black ${Number(val) < 0.20 ? 'text-blue-500' : 'text-blue-800'}`}>{val}</span> },
    { key: 'predicted', label: 'Yield Forecast', render: (val) => <span className="text-[13px] font-black text-gray-900 italic">{val}</span> },
    { key: 'class', label: 'Class', render: (val) => <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${val === 'Critical Stress' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{val}</span> },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'climate':
        return (
          <div className="p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full">
             <div className="max-w-4xl">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Long-term Climate Pattern</h2>
                <p className="text-[15px] text-gray-400 font-medium mt-2 leading-relaxed">
                   Regional growing cycle analysis based on 20-year historical data. Predictable patterns of wet spring and dry summer facilitate strategic cultivar selection.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SimpleCard title="Seasonal Rainfall Model" icon={<Calendar size={20} />}>
                   <div className="p-8 text-center bg-blue-50/50 rounded-3xl border border-blue-100">
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Current Cycle Status</div>
                      <div className="text-4xl font-black text-blue-900 italic tracking-tighter">Wet Growing Season</div>
                      <p className="text-[11px] text-blue-600 font-bold mt-2 uppercase tracking-widest leading-none">Optimal for pod development</p>
                   </div>
                </SimpleCard>
                <SimpleCard title="Cultivar Recommendation" icon={<Trees size={20} />}>
                   <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <div className="text-[11px] font-black text-emerald-600 uppercase mb-1">Recommended</div>
                         <div className="text-lg font-black text-gray-900">Hybrid Series-4 Cocoa</div>
                         <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">High drought tolerance · 12-month cycle</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                         <div className="text-[11px] font-black text-gray-400 uppercase mb-1">Alternative</div>
                         <div className="text-lg font-black text-gray-600">Amelonado Selection</div>
                      </div>
                   </div>
                </SimpleCard>
                <SimpleCard title="Socioeconomic Constraints" icon={<Info size={20} />}>
                   <div className="text-[12px] font-bold text-gray-400 leading-relaxed italic uppercase">
                      Local labor availability peaks in dry season. Logistics costs increase by 14% during wet cycle peak (JUL-AUG).
                   </div>
                </SimpleCard>
             </div>

             <SimpleCard title="Historical Vegetation Health (VHI)" icon={<Activity size={20} />}>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-50 rounded-[2.5rem]">
                   <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em]">Historical VHI Composite Chart (2004-2026)</p>
                </div>
             </SimpleCard>
          </div>
        );
      default:
        return (
          <div className="p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
               <div className="max-w-2xl">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Weather Decision Engine</h2>
                  <p className="text-[15px] text-gray-400 font-medium mt-2">Real-time adaptive alerts to protect crops and optimize field operations.</p>
               </div>
               <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-8">
                  <div className="flex items-center gap-3">
                     <Sun className="text-orange-500" size={24} />
                     <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase leading-none">Local Temp</div>
                        <div className="text-xl font-black text-gray-900 leading-none mt-1">31°C</div>
                     </div>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="flex items-center gap-3">
                     <CloudRain className="text-blue-500" size={24} />
                     <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase leading-none">Precip. Prob</div>
                        <div className="text-xl font-black text-gray-900 leading-none mt-1">12%</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {weatherAdvice.map((advice, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                       {React.cloneElement(advice.icon, { size: 80 })}
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2.5 bg-gray-50 rounded-xl">
                          {React.cloneElement(advice.icon, { size: 18 })}
                       </div>
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{advice.status}</div>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight leading-none">{advice.title}</h3>
                    <p className="text-[13px] text-gray-500 font-medium leading-relaxed italic">{advice.detail}</p>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  <SimpleCard title="Remote Sensing Analytics (Kofi Asare et al.)" icon={<Satellite size={20} />}>
                     <WorkerActivityTable data={rsMetrics} columns={columns} />
                  </SimpleCard>
               </div>
               <div className="space-y-6">
                  <SimpleCard title="Stress Thresholds" icon={<AlertTriangle size={20} />}>
                     <div className="space-y-4">
                        {[
                          { l: 'Severe Canopy Stress', v: 'NDRE < 0.15', c: 'text-red-500' },
                          { l: 'Water Deficit', v: 'LSWI < 0.20', c: 'text-blue-500' },
                          { l: 'Combined (VHI)', v: 'VHI < 35', c: 'text-orange-500' },
                        ].map(item => (
                          <div key={item.l} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                             <span className="text-[11px] font-black text-gray-900 uppercase">{item.l}</span>
                             <span className={`text-[12px] font-black ${item.c}`}>{item.v}</span>
                          </div>
                        ))}
                     </div>
                  </SimpleCard>
                  <SimpleCard title="Yield Prediction Map" icon={<MapIcon size={20} />}>
                     <div className="h-48 rounded-2xl overflow-hidden relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                        <GeospatialPreview title="Bags/KG per Ha" points={[]} full={true} />
                     </div>
                  </SimpleCard>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden font-sans antialiased">
      {/* Premium Top Navigation */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-[1100] shadow-sm">
         <div className="flex items-center gap-10">
            <button onClick={onBack} className="flex items-center gap-2 group">
               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                  <ArrowLeft size={18} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Exit to Hub</span>
                  <span className="text-[14px] font-black tracking-tight mt-1">FarmIntelytics</span>
               </div>
            </button>

            <div className="w-px h-8 bg-gray-100"></div>

            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center p-2 shadow-lg ring-4 ring-orange-50">
                  <Thermometer className="text-white" size={20} />
               </div>
               <div>
                  <h1 className="text-lg font-black tracking-tighter leading-none">Farm Advisor <span className="text-gray-400 italic font-medium ml-1">Decision Support</span></h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mt-1">Agronomic Core: Active</p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <div className="text-[11px] font-black text-gray-900 leading-none">{userName}</div>
                  <div className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-1">Agronomist</div>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-orange-50">
                  <User size={20} className="text-gray-400" />
               </div>
            </div>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar Navigation */}
         <aside className="w-80 bg-white border-r border-gray-100 flex flex-col z-[1050] shadow-2xl">
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
               <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-4 mb-4 italic">Advisory Menu</div>
               {[
                 { id: 'weather', label: 'Adaptive Weather', icon: <CloudRain size={18}/> },
                 { id: 'climate', label: 'Long-term Climate', icon: <Globe size={18}/> },
                 { id: 'rs', label: 'Satellite Analytics', icon: <Satellite size={18}/> },
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveView(tab.id)}
                   className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
                     activeView === tab.id ? 'bg-gray-900 text-white shadow-xl translate-x-2' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                   }`}
                 >
                    {React.cloneElement(tab.icon, { size: 18 })}
                    <span className="text-[12px] font-black uppercase tracking-widest italic">{tab.label}</span>
                 </button>
               ))}
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100">
               <button onClick={onSignOut} className="w-full bg-red-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl text-[11px] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-red-100">
                  <LogOut size={16} /> Sign Out
               </button>
            </div>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
            {renderContent()}
         </main>
      </div>
    </div>
  );
};

export default ClimateIntelligence;
