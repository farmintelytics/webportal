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
  Sun
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, currentCrop, setCurrentCrop, crops }) => {
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
      style={{ backgroundColor: currentCrop.primaryColor }}
    >
      <div className="p-6 flex flex-col items-center gap-2 shrink-0">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
          <img src={currentCrop.logo} alt="Logo" className="w-full h-auto object-contain" />
        </div>
        <div className="text-center mt-2">
          <div className="font-black text-[15px] uppercase tracking-tighter">{currentCrop.branding}</div>
          <div className="text-[10px] opacity-60 font-medium uppercase tracking-widest">{currentCrop.name} Division</div>
        </div>
      </div>

      <div className="px-4 py-2">
        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-1 mb-2 block">Crop Management</label>
        <select 
          value={currentCrop.id}
          onChange={(e) => setCurrentCrop(crops.find(c => c.id === e.target.value))}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] font-bold outline-none cursor-pointer hover:bg-black/30 transition-colors"
        >
          {crops.map(crop => (
            <option key={crop.id} value={crop.id} className="bg-[#145C37]">{crop.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeSection === item.id 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`transition-transform duration-200 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
            {activeSection === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-4 shrink-0">
        <div className="bg-black/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Theme</span>
            <div className="flex bg-black/40 p-1 rounded-lg">
              <button className="p-1.5 rounded-md bg-white/10 text-white"><Sun size={12}/></button>
              <button className="p-1.5 rounded-md text-white/40 hover:text-white transition-colors"><Moon size={12}/></button>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 text-[12px] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2 rounded-lg transition-all">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-white/30 font-medium">v2.5.0 · Okomu Analytics</div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
