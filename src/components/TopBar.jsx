import React from 'react';
import { 
  RefreshCw, 
  User, 
  LogOut, 
  Menu,
  Bell,
  Sun,
  Moon,
  Search
} from 'lucide-react';

const TopBar = ({ title }) => {
  return (
    <header className="h-24 bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 flex items-center px-10 gap-8 shrink-0 z-40">
      <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 lg:hidden hover:bg-gray-100 transition-all">
        <Menu size={22} />
      </button>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
           <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 leading-none mb-1.5">Intelligence Module</h2>
           <div className="text-[16px] font-black text-gray-900 dark:text-white capitalize tracking-tight leading-none">{title}</div>
        </div>
        <div className="h-8 w-px bg-gray-100 dark:bg-white/10 hidden sm:block"></div>
        <div className="relative hidden xl:block w-72 group">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--brand-primary)] transition-colors" />
           <input 
             type="text" 
             placeholder="Search across ledger..." 
             className="w-full bg-gray-50/50 dark:bg-white/5 border border-transparent focus:border-gray-100 dark:focus:border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-[12px] font-bold outline-none transition-all"
           />
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-8">
        <button className="flex items-center gap-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-[12px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-xl shadow-[var(--brand-primary)]/20 active:scale-95 group">
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
          Sync Data
        </button>
        
        <div className="flex items-center gap-6 pl-8 border-l border-gray-100 dark:border-white/10">
           <button className="relative p-2.5 text-gray-400 hover:text-[var(--brand-primary)] transition-colors">
             <Bell size={22} />
             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
           </button>

           <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <div className="text-[12px] font-black text-gray-900 dark:text-white leading-none mb-1">Global Admin</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Operations Hub</div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] p-[2px] shadow-xl group cursor-pointer hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[var(--brand-primary)] overflow-hidden">
                   <User size={26} />
                </div>
             </div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
