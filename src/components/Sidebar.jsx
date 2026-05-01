import React from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Wallet, 
  Zap, 
  ClipboardList,
  LogOut,
  Moon,
  Sun,
  Grid,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, currentCrop, setCurrentCrop, crops, onBackToHub }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'geospatial', label: 'Geospatial Intel', icon: <MapIcon size={18} /> },
    { id: 'workers', label: 'Worker Analytics', icon: <Users size={18} /> },
    { id: 'plots', label: 'Plot Analytics', icon: <BarChart3 size={18} /> },
    { id: 'approvals', label: 'Approval Center', icon: <CheckCircle2 size={18} /> },
    { id: 'payments', label: 'Payment Planner', icon: <Wallet size={18} /> },
    { id: 'yield', label: 'Yield Intelligence', icon: <Zap size={18} /> },
    { id: 'personnel', label: 'Personnel Board', icon: <ClipboardList size={18} /> },
  ].filter(item => currentCrop.modules.includes(item.id));

  return (
    <nav 
      className="w-64 text-white flex flex-col h-screen overflow-y-auto shrink-0 transition-all duration-300 shadow-2xl z-50"
      style={{ backgroundColor: 'var(--brand-primary)' }}
    >
      <div className="p-8 flex flex-col items-center gap-2 shrink-0">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center p-2 backdrop-blur-md border border-white/10 shadow-2xl">
          <ShieldCheck size={40} className="text-white" />
        </div>
        <div className="text-center mt-3">
          <div className="font-black text-[16px] uppercase tracking-tighter leading-none">FarmIntelytics</div>
          <div className="text-[10px] opacity-40 font-black uppercase tracking-[0.2em] mt-1">Intelligence Layer</div>
        </div>
      </div>

      <div className="px-4 mb-8">
        <button 
          onClick={onBackToHub}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-white/5"
        >
          <Grid size={18} className="text-white/60 group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
          <span className="text-[13px] font-black uppercase tracking-widest text-white/80 group-hover:text-white">Portal Hub</span>
        </button>
      </div>

      <div className="flex-1 px-3 space-y-1">
        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-4 mb-2 block">Management</label>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
              activeSection === item.id 
                ? 'bg-white text-[var(--brand-primary)] shadow-2xl' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className="text-[13px] font-black tracking-tight">{item.label}</span>
            {activeSection === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="p-6 border-t border-white/5 space-y-6 shrink-0 bg-black/10">
        <div className="space-y-3">
           <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Active Division</div>
           <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-black/20">
                 <img src={currentCrop.logo} alt="Crop" className="w-full h-auto" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="text-[12px] font-black truncate">{currentCrop.name}</div>
                 <div className="text-[10px] text-white/40 font-bold">FFB Management</div>
              </div>
           </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-widest text-red-300 hover:text-white hover:bg-red-500/20 py-3 rounded-xl transition-all border border-red-500/10">
          <LogOut size={16} />
          Sign Out
        </button>
        
        <div className="text-center">
          <div className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">v4.2.0 · PRODUCTION</div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
