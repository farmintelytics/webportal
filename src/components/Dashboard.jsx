import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wheat, 
  Sprout, 
  Users, 
  CircleDollarSign, 
  AlertTriangle, 
  Truck,
  CheckCircle2,
  Clock
} from 'lucide-react';

const KPICard = ({ icon, label, value, delta, deltaType, valueColor }) => (
  <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 relative">
    <div className="absolute top-3 right-3 text-gray-300 dark:text-white/10">{icon}</div>
    <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</div>
    <div className={`text-2xl font-bold ${valueColor || 'text-gray-900 dark:text-white'}`}>{value}</div>
    <div className={`text-[10.5px] mt-1 font-medium flex items-center gap-1 ${
      deltaType === 'up' ? 'text-green-600' : deltaType === 'down' ? 'text-red-600' : 'text-gray-500'
    }`}>
      {deltaType === 'up' ? <TrendingUp size={12} /> : deltaType === 'down' ? <TrendingDown size={12} /> : null}
      {delta}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard 
          icon={<Wheat size={20} />} 
          label="Total Hectares" 
          value="2,847" 
          delta="↑ 12% vs last season" 
          deltaType="up" 
        />
        <KPICard 
          icon={<Sprout size={20} />} 
          label="FFB Tonnage" 
          value="14,230t" 
          delta="↑ 8.4% vs prior yr" 
          deltaType="up" 
        />
        <KPICard 
          icon={<Users size={20} />} 
          label="Attendance" 
          value="88.6%" 
          delta="↓ 2.1% this week" 
          deltaType="down" 
        />
        <KPICard 
          icon={<CircleDollarSign size={20} />} 
          label="Labour/Tonne" 
          value="₦8,420" 
          delta="↓ 3.2% vs target" 
          deltaType="up" 
        />
        <KPICard 
          icon={<AlertTriangle size={20} />} 
          label="Active Alerts" 
          value="5" 
          delta="2 critical" 
          deltaType="down" 
          valueColor="text-red-600"
        />
        <KPICard 
          icon={<Truck size={20} />} 
          label="Fleet Status" 
          value="6 / 8" 
          delta="active vehicles" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-black/5 dark:border-white/5 min-h-[300px] flex flex-col items-center justify-center text-gray-400">
           <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-black/20 rounded-lg border border-dashed border-gray-300 dark:border-white/10">
              [ Yield Chart: Current vs Prior Seasons ]
           </div>
           <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300 w-full text-left">📈 FFB Yield Analysis</div>
        </div>
        <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-black/5 dark:border-white/5 min-h-[300px] flex flex-col items-center justify-center text-gray-400">
           <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-black/20 rounded-lg border border-dashed border-gray-300 dark:border-white/10">
              [ Labour Cost Breakdown Chart ]
           </div>
           <div className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300 w-full text-left">💸 Labour Cost Breakdown</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-black/5 dark:border-white/5">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            Risk Summary
          </h3>
          <div className="space-y-3">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-3 rounded-lg flex gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-[12.5px] font-bold text-gray-900 dark:text-gray-100">2 ghost worker attempts detected</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Blocks C3 & F1 — requires admin review</div>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-3 rounded-lg flex gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-[12.5px] font-bold text-gray-900 dark:text-gray-100">NDVI drop 14% in Block D2</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Disease pressure rising — satellite confirmed</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
              🏆 Top Blocks This Season
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-black/5 dark:border-white/5">
                    <th className="py-2 px-1">Block</th>
                    <th className="py-2 px-1">Yield (t)</th>
                    <th className="py-2 px-1">₦/t</th>
                    <th className="py-2 px-1">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  <tr>
                    <td className="py-2 px-1 font-bold">F3</td>
                    <td className="py-2 px-1">1,840</td>
                    <td className="py-2 px-1">7,200</td>
                    <td className="py-2 px-1"><span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold">Excellent</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-1 font-bold">C3</td>
                    <td className="py-2 px-1">1,620</td>
                    <td className="py-2 px-1">7,900</td>
                    <td className="py-2 px-1"><span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold">Good</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-black/5 dark:border-white/5">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            💼 Financial Snapshot
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[12px] text-gray-500 dark:text-gray-400">Total payroll vs budget</span>
              <span className="text-[13px] font-bold">₦142M / ₦138M</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[12px] text-gray-500 dark:text-gray-400">Cost / tonne FFB</span>
              <span className="text-[13px] font-bold">₦8,420</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[12px] text-gray-500 dark:text-gray-400">Input spend vs plan</span>
              <span className="text-[13px] font-bold text-green-600">₦24M (−3%)</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
              📅 Meeting Cadence
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-black/10 rounded-lg">
                <Clock size={16} className="text-gray-400" />
                <div className="flex-1">
                  <div className="text-[12px] font-semibold">Sprint Review</div>
                  <div className="text-[10px] text-gray-500">Every 2 weeks</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-black/10 rounded-lg">
                <Users size={16} className="text-gray-400" />
                <div className="flex-1">
                  <div className="text-[12px] font-semibold">Client Success Review</div>
                  <div className="text-[10px] text-gray-500">Monthly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
