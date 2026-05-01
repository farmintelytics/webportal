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
  MessageSquare
} from 'lucide-react';

const ModuleCard = ({ title, crop, id, icon, active, onSelect }) => (
  <button 
    onClick={() => active && onSelect(id)}
    className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 flex flex-col text-left overflow-hidden ${
      active 
        ? 'bg-white border-black hover:border-[var(--brand-primary)] shadow-md hover:shadow-2xl' 
        : 'bg-white border-gray-100 opacity-40 cursor-not-allowed'
    }`}
  >
    <div className={`p-4 rounded-xl w-fit mb-6 transition-all duration-500 ${
      active 
        ? 'bg-black text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white' 
        : 'bg-gray-100 text-gray-400'
    }`}>
      {React.cloneElement(icon, { size: 28 })}
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
  const managementRef = React.useRef(null);
  const remoteSensingRef = React.useRef(null);
  const paymentsRef = React.useRef(null);
  const fieldOpsRef = React.useRef(null);

  const sections = [
    {
      title: 'Management Solutions',
      ref: managementRef,
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
      ref: remoteSensingRef,
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
      ref: paymentsRef,
      modules: [
        { id: 'payments-ffb',   title: 'FFB Payments',      crop: 'Oil Palm',  icon: <CreditCard />, active: false },
        { id: 'payments-multi', title: 'Multi-Crop Finance', crop: 'All Crops', icon: <CreditCard />, active: false },
      ]
    },
    {
      title: 'Field Operations & Advisory',
      ref: fieldOpsRef,
      modules: [
        { id: 'activity-ffb', title: 'Activity & Logs', crop: 'All Crops', icon: <ClipboardList />, active: false },
        { id: 'advisor',      title: 'Farm Advisor',    crop: 'All Crops', icon: <MessageSquare />, active: false },
      ]
    },
  ];

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8 lg:p-20">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-20">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-[#000] rounded-xl flex items-center justify-center shadow-xl shadow-black/10">
                <ShieldCheck className="text-[var(--brand-primary)] w-7 h-7" />
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
             Unified launcher for multi-crop management and remote sensing modules. Connect to your enterprise farm ledger.
           </p>
        </div>

        {/* Sharp Navigation Bar */}
        <div className="flex flex-wrap items-center gap-12 mb-16 border-b-2 border-black pb-8">
          <button 
            onClick={() => scrollToSection(managementRef)}
            className="text-[14px] font-black uppercase tracking-widest text-black hover:text-[var(--brand-primary)] transition-colors border-b-4 border-transparent hover:border-[var(--brand-primary)] pb-2"
          >
            Management
          </button>
          <button 
            onClick={() => scrollToSection(remoteSensingRef)}
            className="text-[14px] font-black uppercase tracking-widest text-black hover:text-[var(--brand-primary)] transition-colors border-b-4 border-transparent hover:border-[var(--brand-primary)] pb-2"
          >
            Remote Sensing & GeoAI
          </button>
          <button 
            onClick={() => scrollToSection(paymentsRef)}
            className="text-[14px] font-black uppercase tracking-widest text-black hover:text-[var(--brand-primary)] transition-colors border-b-4 border-transparent hover:border-[var(--brand-primary)] pb-2"
          >
            Payments
          </button>
          <button 
            onClick={() => scrollToSection(fieldOpsRef)}
            className="text-[14px] font-black uppercase tracking-widest text-black hover:text-[var(--brand-primary)] transition-colors border-b-4 border-transparent hover:border-[var(--brand-primary)] pb-2"
          >
            Field Advisory
          </button>
        </div>

        <div className="space-y-32">
          {sections.map(section => (
            <div key={section.title} ref={section.ref} className="space-y-12 scroll-mt-20">
              <div className="flex items-center gap-6">
                <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-black whitespace-nowrap">{section.title}</h3>
                <div className="h-0.5 bg-black flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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

        <footer className="mt-48 pt-16 border-t-4 border-black flex flex-col lg:flex-row justify-between items-center gap-12 pb-24">
           <div className="flex items-center gap-12">
              <div className="text-[12px] font-black uppercase tracking-widest text-black leading-none">© 2026 FarmIntelytics. All rights reserved.</div>
           </div>
           
           <div className="flex gap-16">
              <div className="flex flex-col gap-2 items-end">
                 <div className="text-[12px] font-black uppercase tracking-widest text-[var(--brand-primary)] mb-2">Operations Center</div>
                 <div className="flex gap-8">
                    {['Status', 'Docs', 'Support'].map(i => (
                      <button key={i} className="text-[13px] font-black text-black hover:text-[var(--brand-primary)] transition-colors border-b-2 border-transparent hover:border-black pb-1">{i}</button>
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
