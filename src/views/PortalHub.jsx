import React from 'react';
import { 
  Sprout, 
  ArrowRight, 
  Zap, 
  Globe, 
  Activity, 
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
  Satellite,
  ChevronDown,
  Trees
} from 'lucide-react';

const ModuleCard = ({ title, crop, id, icon, active, onSelect }) => (
  <button 
    onClick={() => active && onSelect(id)}
    className={`group relative p-8 rounded-2xl transition-all duration-300 flex flex-col text-left border border-gray-100 ${
      active 
        ? 'bg-white hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1' 
        : 'bg-white opacity-40 cursor-not-allowed'
    }`}
  >
    <div className={`p-4 rounded-xl w-fit mb-6 bg-gray-50 transition-colors ${
      active ? 'text-green-600 group-hover:bg-green-600 group-hover:text-white' : 'text-gray-400'
    }`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    
    <div className="flex-1">
      <div className={`text-[11px] font-black uppercase tracking-[0.2em] mb-2 ${active ? 'text-green-600' : 'text-gray-400'}`}>
        {crop}
      </div>
      <h3 className={`text-xl font-black tracking-tight leading-tight ${active ? 'text-gray-900' : 'text-gray-400'}`}>
        {title}
      </h3>
    </div>

    <div className="mt-8 flex items-center justify-between">
       <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-gray-900' : 'text-gray-300'}`}>
         {active ? 'Launch Portal' : 'Locked'}
       </span>
       {active && <ArrowRight size={18} className="text-gray-300 group-hover:text-green-600 transform group-hover:translate-x-2 transition-all" />}
    </div>
  </button>
);

const PortalHub = ({ onSelectModule }) => {
  const [activeTab, setActiveTab] = React.useState('management');

  const sections = [
    {
      id: 'management',
      title: 'Management Solutions',
      description: 'Workforce logistics, biometrics, and smallholder group planning for large-scale estate and cooperative operations.',
      modules: [
        { id: 'management-ffb',       title: 'FFB Intelligence',  crop: 'Oil Palm',  icon: <Sprout />,     active: true  },
        { id: 'management-cashew',    title: 'Cashew Hub',        crop: 'Cashew',    icon: <Activity />,   active: true  },
        { id: 'management-sugarcane', title: 'Cane Console',      crop: 'SugarCane', icon: <Zap />,        active: true  },
        { id: 'management-rice',      title: 'Rice Monitor',      crop: 'Rice',      icon: <Leaf />,       active: true  },
        { id: 'management-cocoa',     title: 'Cocoa Core',        crop: 'Cocoa',     icon: <Coffee />,     active: true  },
        { id: 'management-rubber',    title: 'Rubber Hub',        crop: 'Rubber',    icon: <Droplets />,   active: true  },
        { id: 'management-cassava',   title: 'Cassava Core',      crop: 'Cassava',   icon: <Container />,  active: true  },
        { id: 'management-maize',     title: 'Maize Hub',         crop: 'Maize',     icon: <Wheat />,      active: true  },
        { id: 'group-management',     title: 'Groups Hub',        crop: 'Smallholder', icon: <Users />,    active: true  },
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring & RS',
      description: 'Multispectral satellite imagery and drone-level field surveillance for high-precision monitoring.',
      modules: [
        { id: 'rs-ffb',       title: 'Oil Palm',    crop: 'Satellite', icon: <Globe />, active: true  },
        { id: 'rs-cashew',    title: 'Cashew',      crop: 'Satellite', icon: <Globe />, active: true  },
        { id: 'rs-rubber',    title: 'Rubber',      crop: 'Satellite', icon: <Globe />, active: true  },
        { id: 'rs-sugarcane', title: 'SugarCane',   crop: 'Satellite', icon: <Globe />, active: true  },
        { id: 'rs-rice',      title: 'Rice Monitor', crop: 'Satellite', icon: <Globe />, active: true  },
        { id: 'rs-cocoa',     title: 'Cocoa Core',  crop: 'Satellite', icon: <Globe />, active: true  },
        { id: 'rs-cassava',   title: 'Cassava',     crop: 'Satellite', icon: <Globe />, active: true  },
        { id: 'rs-maize',     title: 'Maize Hub',    crop: 'Satellite', icon: <Globe />, active: true  },
        { id: 'rs-drone',     title: 'Drone Intel',  crop: 'Aerial',    icon: <Plane />, active: true  },
        { id: 'group-monitoring', title: 'Smallholder', crop: 'Fusion',    icon: <Satellite />, active: true  },
      ]
    },
    {
      id: 'sustainability',
      title: 'Sustainability & Carbon',
      description: 'Carbon sequestration monitoring, forestry biomass estimation, and smallholder group carbon verification.',
      modules: [
        { id: 'carbon-ffb',       title: 'Estate Carbon', crop: 'Industrial', icon: <Leaf />, active: true  },
        { id: 'carbon-groups',    title: 'Group Carbon',  crop: 'Smallholder', icon: <Globe />, active: true  },
        { id: 'forestry-intel',   title: 'Forestry Intel', crop: 'High Density', icon: <Trees />, active: true  },
        { id: 'carbon-estimator', title: 'Carbon Est.',   crop: 'Analytical', icon: <Activity />, active: true  },
      ]
    },
    {
      id: 'payments',
      title: 'Finance & Ledger',
      description: 'Immutable farm ledgers and secure multi-crop disbursement systems.',
      modules: [
        { id: 'finance-hub', title: 'Central Ledger', crop: 'Multi-Crop', icon: <CreditCard />, active: true  },
      ]
    },
    {
      id: 'field-advisory',
      title: 'Field Advisory',
      description: 'Geo-referenced field logs and location-aware agronomic insights.',
      modules: [
        { id: 'activity-ffb', title: 'Field Logs',    crop: 'Operations', icon: <ClipboardList />, active: true  },
        { id: 'advisor',      title: 'Farm Advisor',    crop: 'Agronomy',   icon: <MessageSquare />, active: true  },
      ]
    },
  ];

  const currentSection = sections.find(s => s.id === activeTab) || sections[0];

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-20 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-20">
          <div className="flex items-center gap-5">
             <div className="h-20 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <img src="/farmintelytics-logo.png" alt="Logo" className="h-full w-auto object-contain" />
             </div>
             <div>
                <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900 leading-none">FarmIntelytics</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 mt-1.5">Verified · Monitored · Connected</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                <ChevronDown size={18} className="animate-bounce" />
             </div>
          </div>
        </header>

        <div className="mb-24">
           <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-8">
             Operational <br />
             <span className="text-green-600">Intelligence Hub.</span>
           </h2>
           <p className="text-lg text-gray-500 font-medium max-w-3xl leading-relaxed">
             A unified enterprise gateway for large-scale agricultural management. Orchestrate your entire multi-crop operation from real-time monitoring to automated logistics.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-12 mb-10 border-b border-gray-100">
          {[
            { id: 'management', label: 'Management' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'sustainability', label: 'Sustainability' },
            { id: 'payments', label: 'Payments' },
            { id: 'field-advisory', label: 'Advisory' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[14px] font-black uppercase tracking-widest transition-all pb-4 border-b-4 ${
                activeTab === tab.id 
                  ? 'text-green-600 border-green-600' 
                  : 'text-gray-400 border-transparent hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          <div className="max-w-2xl">
            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-900 mb-4">{currentSection.title}</h3>
            <p className="text-[13px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
              {currentSection.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {currentSection.modules.map(module => (
              <ModuleCard 
                key={module.id} 
                {...module} 
                onSelect={onSelectModule}
              />
            ))}
          </div>
        </div>

        <footer className="mt-48 pt-12 flex flex-col lg:flex-row justify-between items-center gap-12 pb-12 border-t border-gray-100">
            <div className="flex items-center gap-12">
               <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400">© 2026 FarmIntelytics.</div>
               <div className="flex gap-8">
                  {['Docs', 'Status', 'Support'].map(i => (
                    <button key={i} className="text-[11px] font-black text-gray-400 hover:text-green-600 transition-colors uppercase tracking-widest">{i}</button>
                  ))}
               </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Intelligence Layer v1.0</div>
        </footer>
      </div>
    </div>
  );
};

export default PortalHub;
