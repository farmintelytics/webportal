import React, { useState } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  ShieldCheck, 
  History, 
  PieChart, 
  ChevronDown, 
  Search, 
  Filter, 
  Download,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Landmark,
  FileText,
  UserCheck,
  LogOut
} from 'lucide-react';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FinanceDashboard = ({ onSignOut }) => {
  const stats = [
    { label: 'Total Portfolio Value', value: '₦4.2B', change: '+12.5%', icon: <Landmark className="text-emerald-500" /> },
    { label: 'Worker Disbursements', value: '₦182.4M', change: '852 Paid', icon: <UserCheck size={20} /> },
    { label: 'Settlement Ledger', value: '99.9%', change: 'Verified', icon: <ShieldCheck className="text-blue-500" /> },
    { label: 'Pending Payouts', value: '₦12.8M', change: '14 Batches', icon: <History className="text-amber-500" /> },
  ];

  const barData = {
    labels: ['Oil Palm', 'Cashew', 'Rice', 'Cocoa', 'Maize', 'Rubber'],
    datasets: [{
      label: 'Revenue (Millions ₦)',
      data: [850, 420, 310, 680, 240, 190],
      backgroundColor: '#16A34A',
      borderRadius: 12,
    }]
  };

  const doughnutData = {
    labels: ['Estate Wages', 'Input Costs', 'Logistics', 'Tax/Levy'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#16A34A', '#000', '#F59E0B', '#94A3B8'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
      {/* Premium Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gray-900 rounded-xl">
              <CreditCard size={20} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-black leading-none">Central Finance Hub</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Multi-Crop Settlement Layer</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ledger Synced</span>
          </div>
          <button 
            onClick={onSignOut}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
          >
             <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      <main className="p-8 max-w-[1700px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all group">
              <div className="flex justify-between items-start mb-4">
                 <div className="text-gray-400">
                    {s.icon}
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{s.change}</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</div>
              <div className="text-2xl font-black text-gray-900 tracking-tighter italic">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-900">Revenue Contribution by Crop</h3>
              </div>
              <div className="h-[350px]">
                 <Bar 
                   data={barData} 
                   options={{ 
                     responsive: true, 
                     maintainAspectRatio: false,
                     plugins: { legend: { display: false } },
                     scales: { 
                       y: { display: false },
                       x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } }
                     }
                   }} 
                 />
              </div>
           </div>

           <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-[12px] font-black uppercase tracking-widest mb-10 text-emerald-500">Expense Allocation</h3>
              <div className="h-[250px] relative mb-10">
                 <Doughnut 
                   data={doughnutData} 
                   options={{ 
                     responsive: true, 
                     maintainAspectRatio: false,
                     plugins: { legend: { display: false } },
                     cutout: '80%'
                   }} 
                 />
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-black tracking-tighter leading-none italic">100%</div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Verified</div>
                 </div>
              </div>
              <div className="space-y-4 mt-auto">
                 {[
                   { l: 'Estate Wages', v: '45%', c: 'bg-emerald-500' },
                   { l: 'Input Costs', v: '25%', c: 'bg-white' },
                   { l: 'Logistics', v: '20%', c: 'bg-emerald-700' },
                 ].map(item => (
                   <div key={item.l} className="flex justify-between items-center border-t border-white/5 pt-4">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${item.c}`}></div>
                         <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{item.l}</span>
                      </div>
                      <span className="text-[10px] font-black">{item.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-900">Immutable Settlement Ledger</h3>
              <div className="flex gap-4">
                 <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search Transactions..." className="bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold outline-none w-64" />
                 </div>
                 <button className="p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-all"><Filter size={14} /></button>
                 <button className="p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-all"><Download size={14} /></button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                       {['Transaction ID', 'Payee / Batch', 'Type', 'Amount', 'Status'].map(h => (
                         <th key={h} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {[
                      { id: 'TX-82910', p: 'Cluster B1 Settlement', t: 'Wages', a: '₦12.4M', s: 'Settled' },
                      { id: 'TX-82911', p: 'Adebayo Olatunji', t: 'Bonus', a: '₦45.0k', s: 'Settled' },
                      { id: 'TX-82912', p: 'Fertilizer #4', t: 'Input', a: '₦8.2M', s: 'Pending' },
                    ].map((tx, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-5 text-[11px] font-black text-emerald-600 tracking-widest">{tx.id}</td>
                        <td className="px-8 py-5 text-sm font-black text-gray-900">{tx.p}</td>
                        <td className="px-8 py-5">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-lg text-gray-500">{tx.t}</span>
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-gray-900">{tx.a}</td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${tx.s === 'Settled' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{tx.s}</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </main>

      <footer className="mt-auto py-8 border-t border-gray-100 flex flex-col items-center">
         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-200">Powered by Farmintelytics · Secure Settlement Node</div>
      </footer>
    </div>
  );
};

export default FinanceDashboard;
