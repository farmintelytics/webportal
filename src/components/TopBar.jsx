import React from 'react';
import { 
  RefreshCw, 
  User, 
  LogOut, 
  Menu,
  Bell,
  Sun,
  Moon
} from 'lucide-react';

const TopBar = ({ title }) => {
  return (
    <header className="h-20 bg-white dark:bg-[#1C1C1A] border-b border-black/5 flex items-center px-8 gap-6 shrink-0 z-40">
      <button className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-black/5 hover:bg-gray-100 transition-all lg:hidden">
        <Menu size={20} />
      </button>
      
      <div className="flex items-center gap-4">
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400">Operations Analytics</h2>
        <div className="h-4 w-px bg-gray-200"></div>
        <button className="flex items-center gap-2 bg-[#1A7A4A] hover:bg-[#145C37] text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-green-500/20 active:scale-95">
          <RefreshCw size={14} className="animate-spin-slow" />
          Refresh
        </button>
      </div>
      
      <div className="ml-auto flex items-center gap-6">
        <div className="hidden md:flex bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-black/5">
          <button className="p-2 rounded-lg bg-white dark:bg-white/10 shadow-sm text-[#1A7A4A]"><Sun size={16}/></button>
          <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><Moon size={16}/></button>
        </div>

        <button className="relative p-2.5 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-black/5">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-gray-100">Admin</div>
            <div className="text-[10px] font-bold text-gray-400">Field Supervisor</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#1A7A4A]/10 border-2 border-[#1A7A4A]/20 flex items-center justify-center text-[#1A7A4A] overflow-hidden group cursor-pointer hover:border-[#1A7A4A]/50 transition-all">
             <User size={22} className="group-hover:scale-110 transition-transform" />
          </div>
          <button className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-100 transition-all active:scale-95">
             <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
