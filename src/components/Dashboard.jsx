import React from 'react';
import { 
  RefreshCw, 
  ChevronDown, 
  Calendar, 
  RotateCcw,
  LayoutDashboard
} from 'lucide-react';

const KPICard = ({ label, value, unit, subLabel, color }) => (
  <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
    <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">{label}</div>
    <div className="flex items-baseline gap-2">
      <div className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">{value}</div>
      {unit && <div className="text-xl font-bold text-gray-400">{unit}</div>}
    </div>
    <div className="text-[12px] text-gray-500 mt-2 font-medium">{subLabel}</div>
    <div className={`mt-4 h-1.5 w-8 rounded-full ${color}`}></div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">Operations Dashboard</h1>
          <p className="text-[13px] text-gray-500 mt-1 font-medium">Executive insight into estate-wide harvesting and yield performance</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
             <label className="text-[9px] font-bold text-gray-500 uppercase px-1">Estate</label>
             <button className="flex items-center gap-3 bg-white dark:bg-white/5 border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">
                All Farms <ChevronDown size={14} className="text-gray-400" />
             </button>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-[9px] font-bold text-gray-500 uppercase px-1">Operation Focus</label>
             <button className="flex items-center gap-3 bg-white dark:bg-white/5 border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm">
                Full Coverage <ChevronDown size={14} className="text-gray-400" />
             </button>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-[9px] font-bold text-gray-500 uppercase px-1">From</label>
             <div className="relative">
                <input type="text" placeholder="mm/dd/yyyy" className="bg-white dark:bg-white/5 border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm w-36 outline-none" />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-[9px] font-bold text-gray-500 uppercase px-1">To</label>
             <div className="relative">
                <input type="text" placeholder="mm/dd/yyyy" className="bg-white dark:bg-white/5 border border-black/5 px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm w-36 outline-none" />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
             </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
             <button className="flex items-center gap-2 text-[12px] font-bold text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
                <RotateCcw size={14} /> Reset All
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="FFB Bunches (AI)" value="76" subLabel="Harvested bunches captured" color="bg-green-600" />
        <KPICard label="Loose Fruit Weight" value="0" unit="KG" subLabel="Verified collection weight" color="bg-orange-500" />
        <KPICard label="Harvested Plots" value="2" subLabel="Locations with active harvesting" color="bg-emerald-700" />
        <KPICard label="Total Plots" value="1,133" subLabel="Plantation coverage" color="bg-orange-600" />
      </div>

      <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight">Bunches Histogram</h3>
            <p className="text-[12px] text-gray-500 font-medium">Direct timeseries of harvested bunches</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
            <span className="text-[11px] font-bold text-gray-500">Bunches Harvested</span>
          </div>
        </div>

        <div className="h-[400px] relative">
          {/* Simulated chart bars */}
          <div className="absolute inset-0 flex items-end justify-around px-20">
             <div className="flex flex-col items-center gap-3 group">
                <div className="w-4 bg-green-600 rounded-t-sm transition-all duration-500 group-hover:bg-green-500 shadow-lg shadow-green-500/20" style={{ height: '320px' }}></div>
                <span className="text-[11px] font-bold text-gray-400">Apr 23</span>
             </div>
             <div className="flex flex-col items-center gap-3 group">
                <div className="w-4 bg-green-600 rounded-t-sm transition-all duration-500 group-hover:bg-green-500 shadow-lg shadow-green-500/20" style={{ height: '220px' }}></div>
                <span className="text-[11px] font-bold text-gray-400">Apr 24</span>
             </div>
          </div>
          
          {/* Y-Axis labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-bold text-gray-300 pr-4 border-r border-black/5">
             <span>45</span><span>40</span><span>35</span><span>30</span><span>25</span><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
          </div>

          {/* Grid lines */}
          <div className="absolute left-8 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
             {[...Array(10)].map((_, i) => (
               <div key={i} className="w-full border-t border-black/[0.03] dark:border-white/[0.03]"></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
