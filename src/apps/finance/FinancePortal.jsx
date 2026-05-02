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
  Activity,
  BarChart4,
  Calendar,
  User,
  LayoutDashboard,
  X,
  ChevronRight,
  Shield,
  ChevronLeft,
  Grid
} from 'lucide-react';

import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { SimpleCard, MetricTile } from '../../shared/components/SharedComponents';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

const FinancePortal = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const stats = [
    { label: 'Portfolio Value', value: '₦4.2B', unit: 'NGN', color: 'bg-emerald-600', icon: <Landmark size={24} /> },
    { label: 'Worker Payouts', value: '₦182.4M', unit: 'NGN', color: 'bg-blue-600', icon: <UserCheck size={24} /> },
    { label: 'Ledger Accuracy', value: '99.9', unit: 'Ratio', color: 'bg-blue-800', icon: <ShieldCheck size={24} /> },
    { label: 'Pending Batches', value: '14', unit: 'UNITS', color: 'bg-amber-600', icon: <History size={24} /> },
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
      backgroundColor: ['#16A34A', '#2563eb', '#F59E0B', '#94A3B8'],
      borderWidth: 0,
    }]
  };

  const transactions = [
    { id: 'TX-82910', p: 'Cluster B1 Settlement', t: 'Wages', a: '₦12.4M', s: 'Settled', date: 'MAY 01' },
    { id: 'TX-82911', p: 'Adebayo Olatunji', t: 'Bonus', a: '₦45.0k', s: 'Settled', date: 'MAY 01' },
    { id: 'TX-82912', p: 'Fertilizer #4 Batch', t: 'Input', a: '₦8.2M', s: 'Pending', date: 'MAY 02' },
    { id: 'TX-82913', p: 'Ogun Cooperatives', t: 'Yield', a: '₦15.2M', s: 'Settled', date: 'APR 28' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'ledger':
        return (
          <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto h-full bg-gray-50/50">
             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                   <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Immutable Settlement Ledger</h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time cryptographic audit trail</p>
                   </div>
                   <div className="flex gap-4">
                      <button className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-gray-400"><Search size={18} /></button>
                      <button className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-gray-400"><Download size={18} /></button>
                   </div>
                </div>
                <div className="divide-y divide-gray-50">
                   {transactions.map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-8 bg-white hover:bg-gray-50 transition-all group">
                         <div className="flex items-center gap-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tx.s === 'Settled' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                               <CreditCard size={28} />
                            </div>
                            <div>
                               <div className="text-[16px] font-bold uppercase text-gray-900 leading-none">{tx.p}</div>
                               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 italic">{tx.id} • {tx.date}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-[20px] font-black italic text-gray-900 leading-none">{tx.a}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${tx.s === 'Settled' ? 'text-emerald-600' : 'text-amber-600'}`}>{tx.s}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {stats.map((s, i) => (
                  <MetricTile key={i} label={s.label} value={s.value} unit={s.unit} color={s.color} icon={s.icon} />
               ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-10">
                  <SimpleCard title="Revenue Stream Optimization" icon={<TrendingUp size={24} />}>
                     <div className="h-[400px] mt-10">
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
                  </SimpleCard>
               </div>
               <div className="space-y-10">
                  <div className="bg-emerald-600 text-white p-10 rounded-[3rem] shadow-xl flex flex-col group relative overflow-hidden">
                     <ShieldCheck className="absolute -right-10 -bottom-10 text-white opacity-10" size={200} />
                     <div className="flex justify-between items-start mb-12">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur shadow-inner"><Wallet size={32} /></div>
                        <div className="text-[10px] font-bold uppercase tracking-widest italic bg-white/20 px-5 py-2 rounded-full">Reserve Node</div>
                     </div>
                     <div className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-2">Available Reserve Balance</div>
                     <div className="text-5xl font-black italic tracking-tighter mb-12 leading-none">₦142M</div>
                     <button className="w-full bg-white text-emerald-600 font-bold uppercase tracking-widest py-5 rounded-2xl text-[12px] shadow-2xl hover:bg-emerald-50 transition-all">Distribute Funds</button>
                  </div>
                  <SimpleCard title="Expense Allocation" icon={<PieChart size={24} />}>
                     <div className="h-[250px] relative mt-10">
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
                           <div className="text-4xl font-black text-gray-900 tracking-tighter">100%</div>
                           <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Audited</div>
                        </div>
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
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 z-[1100] shadow-sm">
         <div className="flex items-center gap-8">
            <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"><ChevronLeft size={24} /></button>
            <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center p-2 shadow-lg ring-4 ring-emerald-50"><CreditCard className="text-white" size={24} /></div>
            <div>
               <h1 className="text-lg font-black tracking-tighter leading-none uppercase text-gray-900">Finance <span className="text-gray-400 font-medium ml-1">Center</span></h1>
               <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600 mt-1">Multi-Crop Settlement & Portfolio Layer</p>
            </div>
         </div>
         <div className="flex items-center gap-10">
            <button className="hidden lg:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm">
               <Download size={14} /> Export
            </button>
            <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
               <Calendar size={14} className="text-gray-300" /> MAY 02, 2026
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <div className="text-[11px] font-bold text-gray-900 leading-none">Admin Manager</div>
                  <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Finance Director</div>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-emerald-50 shadow-sm"><User size={20} className="text-gray-400" /></div>
            </div>
         </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
         <aside className="w-72 bg-white border-r border-gray-100 flex flex-col z-[1050]">
            <div className="flex-1 overflow-y-auto p-6 space-y-1.5">
               <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] px-4 mb-4 italic text-left">Finance Hub</div>
               {[
                 { id: 'overview', label: 'Operational Center', icon: <LayoutDashboard /> },
                 { id: 'ledger', label: 'Settlement Ledger', icon: <FileText /> },
                 { id: 'portfolio', label: 'Portfolio Node', icon: <Landmark /> },
               ].map(tab => (
                 <button key={tab.id} onClick={() => setActiveSection(tab.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${activeSection === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 translate-x-2' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}>{React.cloneElement(tab.icon, { size: 18 })}<span className="text-[12px] font-bold uppercase tracking-widest">{tab.label}</span></button>
               ))}
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-2">
                                 <button onClick={onBack} className="w-full bg-white text-gray-700 border border-gray-200 font-bold uppercase tracking-widest py-4 rounded-2xl text-[11px] flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-sm"><Grid size={16} /> Back to Hub</button>

            </div>
         </aside>
         <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">{renderContent()}</main>
      </div>
    </div>
  );
};

export default FinancePortal;
