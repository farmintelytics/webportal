import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

const TopBar = ({ title, subTitle }) => {
  return (
    <header className="h-14 bg-white dark:bg-[#242420] border-b border-black/5 dark:border-white/5 flex items-center px-6 gap-3 shrink-0">
      <div>
        <h1 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{subTitle}</p>
      </div>
      
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 text-[11.5px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Online · All systems operational
        </div>
        <button className="flex items-center gap-2 bg-[#1A7A4A] hover:bg-[#145C37] text-white text-[12px] font-medium px-4 py-1.5 rounded-md transition-colors shadow-sm">
          <Sparkles size={14} />
          AI Summary
        </button>
      </div>
    </header>
  );
};

export default TopBar;
