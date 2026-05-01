import React from 'react';
import { 
  Sprout, 
  Settings, 
  Users, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  LayoutGrid,
  Globe
} from 'lucide-react';

const PortalCard = ({ title, description, icon, color, active, onSelect }) => (
  <button 
    onClick={onSelect}
    disabled={!active}
    className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col text-left h-[320px] overflow-hidden ${
      active 
        ? 'bg-white hover:bg-[var(--brand-primary)] border-transparent shadow-xl hover:shadow-2xl hover:shadow-[var(--brand-primary)]/20' 
        : 'bg-gray-50 border-gray-100 opacity-60 grayscale cursor-not-allowed'
    }`}
  >
    <div className={`p-4 rounded-2xl w-fit mb-6 transition-all duration-500 ${
      active 
        ? 'bg-gray-50 group-hover:bg-white/10 group-hover:scale-110' 
        : 'bg-gray-200'
    }`}>
      {React.cloneElement(icon, { 
        className: `w-8 h-8 transition-colors duration-500 ${
          active ? 'text-[var(--brand-primary)] group-hover:text-white' : 'text-gray-400'
        }` 
      })}
    </div>
    
    <div className="flex-1">
      <h3 className={`text-2xl font-black tracking-tight mb-2 transition-colors duration-500 ${
        active ? 'text-gray-900 group-hover:text-white' : 'text-gray-500'
      }`}>
        {title}
      </h3>
      <p className={`text-sm font-medium leading-relaxed transition-colors duration-500 ${
        active ? 'text-gray-500 group-hover:text-white/70' : 'text-gray-400'
      }`}>
        {description}
      </p>
    </div>

    <div className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-widest mt-auto transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
      active ? 'text-white' : 'text-gray-400'
    }`}>
      {active ? 'Launch Portal' : 'Access Restricted'}
      <ArrowRight size={14} />
    </div>

    {/* Abstract background decorative elements */}
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-50 rounded-full group-hover:bg-white/5 transition-all duration-700 blur-3xl"></div>
  </button>
);

const PortalHub = ({ onSelectPortal }) => {
  const portals = [
    {
      id: 'ffb',
      title: 'FFB Management',
      description: 'Operations intelligence for oil palm estates. Real-time harvest tracking, AI counting, and mill reconciliation.',
      icon: <Sprout />,
      active: true
    },
    {
      id: 'cashew',
      title: 'Cashew Hub',
      description: 'Supply chain visibility and quality tracking for cashew operations. From field aggregation to warehouse.',
      icon: <LayoutGrid />,
      active: false
    },
    {
      id: 'sugarcane',
      title: 'Cane Intelligence',
      description: 'Logistics and harvest optimization for sugar estates. Integrated geofencing and load monitoring.',
      icon: <Zap />,
      active: false
    },
    {
      id: 'geospatial',
      title: 'Global Monitoring',
      description: 'Sustainability and land-use monitoring across all regions. Sentinel data and change detection.',
      icon: <Globe />,
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center p-8 lg:p-20 overflow-y-auto">
      <div className="max-w-7xl w-full">
        <header className="flex justify-between items-center mb-16 lg:mb-24">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--brand-primary)]/20">
                <ShieldCheck className="text-white w-7 h-7" />
             </div>
             <div>
                <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900 leading-none">FarmIntelytics</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Experience Layer · Multi-Portal Hub</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <div className="text-[12px] font-black uppercase tracking-tight">Admin User</div>
                <div className="text-[10px] font-bold text-gray-400">Global Operations Manager</div>
             </div>
             <button className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                <Settings size={20} className="text-gray-400" />
             </button>
          </div>
        </header>

        <div className="mb-16">
          <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-tight mb-4">
            Welcome back,<br/>
            Select your <span className="text-[var(--brand-primary)]">Intelligence Portal.</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl">
            Access modular operational dashboards tailored to your role. Every portal is connected to your central organization ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {portals.map(portal => (
            <PortalCard 
              key={portal.id} 
              {...portal} 
              onSelect={() => onSelectPortal(portal.id)}
            />
          ))}
        </div>

        <footer className="border-t border-gray-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-8 opacity-40">
              <div className="text-[11px] font-black uppercase tracking-widest">© 2026 FarmIntelytics</div>
              <div className="text-[11px] font-black uppercase tracking-widest">v4.2.0-Production</div>
           </div>
           <div className="flex gap-8">
              <button className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[var(--brand-primary)] transition-colors">Documentation</button>
              <button className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[var(--brand-primary)] transition-colors">Security Audit</button>
              <button className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[var(--brand-primary)] transition-colors">Support Hub</button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default PortalHub;
