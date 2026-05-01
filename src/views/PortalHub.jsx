import React from 'react';
import { 
  Sprout, 
  Settings, 
  Users, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  LayoutGrid,
  Globe,
  Camera,
  Activity
} from 'lucide-react';

const ModuleCard = ({ title, crop, icon, active, onSelect }) => (
  <button 
    onClick={onSelect}
    className={`group relative p-6 rounded-3xl border transition-all duration-500 flex flex-col text-left overflow-hidden ${
      active 
        ? 'bg-white hover:border-[var(--brand-primary)] shadow-sm hover:shadow-xl' 
        : 'bg-gray-50/50 border-gray-100 opacity-80'
    }`}
  >
    <div className={`p-3 rounded-xl w-fit mb-4 transition-all duration-500 ${
      active 
        ? 'bg-gray-50 group-hover:bg-[var(--brand-primary)] group-hover:text-white' 
        : 'bg-gray-100 text-gray-400'
    }`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    
    <div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{crop}</div>
      <h3 className="text-[15px] font-black tracking-tight text-gray-900 leading-tight">
        {title}
      </h3>
    </div>

    <div className="mt-4 flex items-center justify-between">
       <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-[var(--brand-primary)]' : 'text-gray-300'}`}>
         {active ? 'Launch' : 'Coming Soon'}
       </span>
       {active && <ArrowRight size={14} className="text-[var(--brand-primary)] transform group-hover:translate-x-1 transition-transform" />}
    </div>
  </button>
);

const PortalHub = ({ onSelectModule }) => {
  const sections = [
    {
      title: 'Management Solutions',
      icon: <LayoutGrid size={18} />,
      modules: [
        { id: 'management-ffb', title: 'FFB Intelligence', crop: 'Oil Palm', icon: <Sprout />, active: true },
        { id: 'management-cashew', title: 'Cashew Hub', crop: 'Cashew', icon: <Activity />, active: false },
        { id: 'management-sugarcane', title: 'Cane Console', crop: 'SugarCane', icon: <Zap />, active: false },
        { id: 'management-rice', title: 'Rice Monitor', crop: 'Rice', icon: <ShieldCheck />, active: false },
        { id: 'management-cocoa', title: 'Cocoa Core', crop: 'Cocoa', icon: <Sprout />, active: false },
      ]
    },
    {
      title: 'Remote Sensing',
      icon: <Globe size={18} />,
      modules: [
        { id: 'rs-ffb', title: 'Yield Prediction', crop: 'Oil Palm', icon: <Globe />, active: true },
        { id: 'rs-cashew', title: 'Canopy Analysis', crop: 'Cashew', icon: <Globe />, active: false },
      ]
    },
    {
      title: 'Disease Detection',
      icon: <Camera size={18} />,
      modules: [
        { id: 'dd-ffb', title: 'AI Pest Control', crop: 'Oil Palm', icon: <Camera />, active: false },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8 lg:p-20 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--brand-primary)]/20">
                <ShieldCheck className="text-white w-6 h-6" />
             </div>
             <div>
                <h1 className="text-lg font-black uppercase tracking-tighter text-gray-900 leading-none">FarmIntelytics</h1>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Unified Platform Hub</p>
             </div>
          </div>
          <button className="text-[12px] font-black uppercase tracking-widest text-gray-400 hover:text-[var(--brand-primary)] transition-colors">Documentation</button>
        </header>

        <div className="mb-20">
           <h2 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-6">
             The Operating System for <br/>
             <span className="text-[var(--brand-primary)]">Precision Agriculture.</span>
           </h2>
           <p className="text-lg text-gray-500 font-medium max-w-2xl">
             Select a module to connect to your plantation ledger. High-fidelity analytics powered by biometrics and geospatial data.
           </p>
        </div>

        <div className="space-y-16">
          {sections.map(section => (
            <div key={section.title} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="text-[var(--brand-primary)]">{section.icon}</div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">{section.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {section.modules.map(module => (
                  <ModuleCard 
                    key={module.id} 
                    {...module} 
                    onSelect={() => module.active && onSelectModule(module.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalHub;
