import React from 'react';
import { 
  Sprout, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  LayoutGrid,
  Globe,
  Activity,
  ChevronDown,
  Plane,
  CreditCard,
  ClipboardList,
  MessageSquare,
  Wheat,
  Droplets,
  Coffee,
  Leaf,
  Container,
  Users,
  Building2,
  Landmark,
  Satellite
} from 'lucide-react';

const ModuleCard = ({ title, crop, id, icon, active, onSelect }) => (
  <button 
    onClick={() => active && onSelect(id)}
    className={`group relative p-8 rounded-2xl transition-all duration-500 flex flex-col text-left overflow-hidden ${
      active 
        ? 'bg-white hover:bg-gray-50 border border-black/5' 
        : 'bg-white opacity-40 cursor-not-allowed border border-black/5'
    }`}
  >
    <div className={`p-4 rounded-xl w-fit mb-6 transition-all duration-500 ${
      active 
        ? 'text-[var(--brand-primary)] group-hover:text-[var(--brand-primary-dark)]' 
        : 'text-gray-400'
    }`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    
    <div className="flex-1">
      <div className={`text-[11px] font-black uppercase tracking-[0.2em] mb-2 ${active ? 'text-[var(--brand-primary)]' : 'text-gray-400'}`}>
        {crop}
      </div>
      <h3 className={`text-xl font-black tracking-tight leading-tight ${active ? 'text-black' : 'text-gray-400'}`}>
        {title}
      </h3>
    </div>

    <div className="mt-8 flex items-center justify-between">
       <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-black group-hover:text-[var(--brand-primary)]' : 'text-gray-300'}`}>
         {active ? 'Launch Console' : 'Locked'}
       </span>
       {active && <ArrowRight size={18} className="text-black group-hover:text-[var(--brand-primary)] transform group-hover:translate-x-2 transition-transform" />}
    </div>
  </button>
);

const PortalHub = ({ onSelectModule }) => {
  const [activeTab, setActiveTab] = React.useState('management');

  const sections = [
    {
      id: 'management',
      title: 'Management Solutions',
      description: 'A combination of workforce logistics, biometric identity, and smallholder group planning for large-scale estate and cooperative operations.',
      modules: [
        { id: 'management-ffb',       title: 'FFB Intelligence',  crop: 'Oil Palm',  icon: <Sprout />,     active: true  },
        { id: 'management-cashew',    title: 'Cashew Hub',        crop: 'Cashew',    icon: <Activity />,   active: true  },
        { id: 'management-sugarcane', title: 'Cane Console',      crop: 'SugarCane', icon: <Zap />,        active: true  },
        { id: 'management-rice',      title: 'Rice Monitor',      crop: 'Rice',      icon: <Leaf />,       active: true  },
        { id: 'management-cocoa',     title: 'Cocoa Core',        crop: 'Cocoa',     icon: <Coffee />,     active: true  },
        { id: 'management-rubber',    title: 'Rubber Hub',        crop: 'Rubber',    icon: <Droplets />,   active: true  },
        { id: 'management-cassava',   title: 'Cassava Core',      crop: 'Cassava',   icon: <Container />,  active: true  },
        { id: 'management-maize',     title: 'Maize Hub',         crop: 'Maize',     icon: <Wheat />,      active: true  },
        { id: 'group-management',     title: 'Groups Management', crop: 'Smallholder', icon: <Users />,    active: true  },
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      description: 'A combination of multispectral satellite imagery, radar sensor fusion, and group-level field surveillance for high-precision operational monitoring.',
      modules: [
        { id: 'rs-ffb',       title: 'Oil Palm',    crop: 'Monitoring', icon: <Globe />, active: true  },
        { id: 'rs-cashew',    title: 'Cashew',      crop: 'Monitoring', icon: <Globe />, active: true  },
        { id: 'rs-sugarcane', title: 'SugarCane',    crop: 'Monitoring', icon: <Globe />, active: true  },
        { id: 'rs-rice',      title: 'Rice',         crop: 'Monitoring', icon: <Globe />, active: true  },
        { id: 'rs-cocoa',     title: 'Cocoa',        crop: 'Monitoring', icon: <Globe />, active: true  },
        { id: 'rs-rubber',    title: 'Rubber',       crop: 'Monitoring', icon: <Globe />, active: true  },
        { id: 'rs-cassava',   title: 'Cassava',      crop: 'Monitoring', icon: <Globe />, active: true  },
        { id: 'rs-maize',     title: 'Maize',        crop: 'Monitoring', icon: <Globe />, active: true  },
        { id: 'rs-drone',     title: 'Drone Intel',  crop: 'Monitoring', icon: <Plane />, active: true  },
        { id: 'group-monitoring', title: 'Group Monitoring', crop: 'Smallholder', icon: <Satellite />, active: true  },
      ]
    },
    {
      id: 'payments',
      title: 'Finance & Payments',
      description: 'A combination of immutable farm ledgers and secure multi-crop disbursement systems for automated financial reconciliation.',
      modules: [
        { id: 'finance-hub', title: 'Central Finance Hub', crop: 'Multi-Crop', icon: <CreditCard />, active: true  },
      ]
    },
    {
      id: 'field-advisory',
      title: 'Field Operations & Advisory',
      description: 'A combination of geo-referenced field logs and location-aware agronomic insights for data-driven operational decision making.',
      modules: [
        { id: 'activity-ffb', title: 'Activity & Logs', crop: 'All Crops', icon: <ClipboardList />, active: true  },
        { id: 'advisor',      title: 'Farm Advisor',    crop: 'All Crops', icon: <MessageSquare />, active: true  },
      ]
    },
  ];

  const currentSection = sections.find(s => s.id === activeTab) || sections[0];

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8 lg:p-20">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-20">
          <div className="flex items-center gap-5">
             <div className="h-28 overflow-hidden">
                <img src="/farmintelytics-logo.png" alt="Logo" className="h-full w-auto object-contain" />
             </div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">FarmIntelytics</h1>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--brand-primary)] mt-1.5">Verified · Monitored · Connected</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
                <ChevronDown size={18} className="animate-bounce" />
             </div>
          </div>
        </header>

        <div className="mb-24 relative">
           <h2 className="text-6xl lg:text-8xl font-black text-black tracking-tighter leading-none mb-8">
             Operational <span className="text-[var(--brand-primary)]">Intelligence Hub.</span>
           </h2>
           <p className="text-xl text-black/70 font-bold max-w-3xl leading-relaxed">
             A unified enterprise gateway for large-scale agricultural management and precision remote sensing. Orchestrate your entire multi-crop operation, from real-time satellite monitoring and climate intelligence to automated workforce logistics and secure financial disbursement—all synced to your central farm ledger.
           </p>
        </div>

        {/* Sharp Tab Navigation Bar - Borders Removed */}
        <div className="flex flex-wrap items-center gap-12 mb-10">
          {[
            { id: 'management', label: 'Management' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'payments', label: 'Payments' },
            { id: 'field-advisory', label: 'Field Advisory' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[15px] font-black uppercase tracking-widest transition-all pb-2 border-b-4 ${
                activeTab === tab.id 
                  ? 'text-[var(--brand-primary)] border-[var(--brand-primary)]' 
                  : 'text-black border-transparent hover:text-[var(--brand-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          <div className="max-w-2xl">
            <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-black whitespace-nowrap mb-4">{currentSection.title}</h3>
            <p className="text-[13px] text-black/50 font-bold leading-relaxed uppercase tracking-wider">
              {currentSection.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentSection.modules.map(module => (
              <ModuleCard 
                key={module.id} 
                {...module} 
                onSelect={onSelectModule}
              />
            ))}
          </div>
        </div>

        <footer className="mt-48 pt-16 flex flex-col lg:flex-row justify-between items-center gap-12 pb-24 border-t-2 border-gray-50">
            <div className="flex items-center gap-12">
               <div className="text-[12px] font-black uppercase tracking-widest text-black leading-none">© 2026 FarmIntelytics. All rights reserved.</div>
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Powered by Farmintelytics</div>
            </div>
           
           <div className="flex gap-16">
              <div className="flex flex-col gap-2 items-end">
                 <div className="text-[12px] font-black uppercase tracking-widest text-[var(--brand-primary)] mb-2">Operations Center</div>
                 <div className="flex gap-8">
                    {['Status', 'Docs', 'Support'].map(i => (
                      <button key={i} className="text-[13px] font-black text-black hover:text-[var(--brand-primary)] transition-colors pb-1">{i}</button>
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
