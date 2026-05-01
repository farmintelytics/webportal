import React from 'react';
import { 
  Sprout, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  LayoutGrid,
  Globe,
  Activity,
  Users,
  Plane,
  CreditCard,
  ClipboardList,
  MessageSquare
} from 'lucide-react';

const ModuleCard = ({ title, crop, id, icon, active, onSelect }) => (
  <button 
    onClick={() => active && onSelect(id)}
    className={`group relative p-6 rounded-3xl border transition-all duration-500 flex flex-col text-left overflow-hidden ${
      active 
        ? 'bg-white hover:border-[var(--brand-primary)] shadow-sm hover:shadow-xl' 
        : 'bg-gray-50/30 border-gray-100 opacity-60'
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
      modules: [
        { id: 'management-ffb',       title: 'FFB Intelligence',  crop: 'Oil Palm',  icon: <Sprout />,     active: true  },
        { id: 'management-cashew',    title: 'Cashew Hub',        crop: 'Cashew',    icon: <Activity />,   active: true  },
        { id: 'management-sugarcane', title: 'Cane Console',      crop: 'SugarCane', icon: <Zap />,        active: true  },
        { id: 'management-rice',      title: 'Rice Monitor',      crop: 'Rice',      icon: <LayoutGrid />, active: true  },
        { id: 'management-cocoa',     title: 'Cocoa Core',        crop: 'Cocoa',     icon: <Sprout />,     active: true  },
        { id: 'management-rubber',    title: 'Rubber Hub',        crop: 'Rubber',    icon: <Sprout />,     active: false },
        { id: 'management-cassava',   title: 'Cassava Core',      crop: 'Cassava',   icon: <Sprout />,     active: false },
        { id: 'management-maize',     title: 'Maize Hub',         crop: 'Maize',     icon: <LayoutGrid />, active: false },
      ]
    },
    {
      title: 'Remote Sensing & GeoAI',
      modules: [
        { id: 'rs-ffb',       title: 'Yield Prediction',    crop: 'Oil Palm', icon: <Globe />, active: true  },
        { id: 'rs-cashew',    title: 'Canopy Analysis',     crop: 'Cashew',   icon: <Globe />, active: true  },
        { id: 'rs-sugarcane', title: 'Growth Monitoring',   crop: 'SugarCane',icon: <Globe />, active: false },
        { id: 'rs-rice',      title: 'Paddy Field Mapping', crop: 'Rice',     icon: <Globe />, active: false },
      ]
    },
    {
      title: 'Drone Monitoring',
      modules: [
        { id: 'drone-ffb',    title: 'Field Inspection',   crop: 'Oil Palm', icon: <Plane />, active: false },
        { id: 'drone-cashew', title: 'Orchard Survey',     crop: 'Cashew',   icon: <Plane />, active: false },
      ]
    },
    {
      title: 'Payments & Finance',
      modules: [
        { id: 'payments-ffb',   title: 'FFB Payments',      crop: 'Oil Palm',  icon: <CreditCard />, active: false },
        { id: 'payments-multi', title: 'Multi-Crop Finance', crop: 'All Crops', icon: <CreditCard />, active: false },
      ]
    },
    {
      title: 'Field Operations & Advisory',
      modules: [
        { id: 'activity-ffb', title: 'Activity & Logs', crop: 'All Crops', icon: <ClipboardList />, active: false },
        { id: 'advisor',      title: 'Farm Advisor',    crop: 'All Crops', icon: <MessageSquare />, active: false },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8 lg:p-20 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-20">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center shadow-xl shadow-[var(--brand-primary)]/20">
                <ShieldCheck className="text-white w-7 h-7" />
             </div>
             <div>
                <h1 className="text-lg font-black uppercase tracking-tighter text-gray-900 leading-none">FarmIntelytics</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-secondary)] mt-1.5">Verified · Monitored · Connected</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right">
                <div className="text-[11px] font-black uppercase tracking-tight">Experience Layer</div>
                <div className="text-[9px] font-bold text-gray-400">Production v4.2.0</div>
             </div>
             <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
                <Users size={18} />
             </div>
          </div>
        </header>

        <div className="mb-20">
           <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-6">
             Operational <span className="text-[var(--brand-primary)]">Intelligence Hub.</span>
           </h2>
           <p className="text-lg text-gray-500 font-medium max-w-2xl">
             Unified launcher for multi-crop management and remote sensing modules. Connect to your enterprise farm ledger.
           </p>
        </div>

        <div className="space-y-20">
          {sections.map(section => (
            <div key={section.title} className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 whitespace-nowrap">{section.title}</h3>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {section.modules.map(module => (
                  <ModuleCard 
                    key={module.id} 
                    {...module} 
                    onSelect={onSelectModule}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-40 pt-12 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-8 pb-20">
           <div className="flex items-center gap-8 opacity-40">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">© 2026 FarmIntelytics. All rights reserved.</div>
           </div>
           
           <div className="flex gap-12">
              <div className="flex flex-col gap-1 items-end">
                 <div className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-2">Operations Hub</div>
                 <div className="flex gap-6">
                    {['Status', 'Documentation', 'Support'].map(i => (
                      <button key={i} className="text-[11px] font-bold text-gray-400 hover:text-[var(--brand-primary)] transition-colors">{i}</button>
                    ))}
                 </div>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default PortalHub;
