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
  Activity,
  Fingerprint,
  Wallet,
  Truck,
  AlertTriangle,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';

const ModuleCard = ({ title, id, description, icon, active, onSelect }) => (
  <button 
    onClick={() => active && onSelect(id)}
    className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-500 flex flex-col text-left h-[280px] overflow-hidden ${
      active 
        ? 'bg-white hover:border-[var(--brand-primary)] shadow-sm hover:shadow-2xl' 
        : 'bg-gray-50/50 border-gray-100 opacity-60 grayscale cursor-not-allowed'
    }`}
  >
    <div className={`p-4 rounded-2xl w-fit mb-6 transition-all duration-500 ${
      active 
        ? 'bg-gray-50 group-hover:bg-[var(--brand-primary)] group-hover:text-white group-hover:scale-110' 
        : 'bg-gray-100 text-gray-400'
    }`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    
    <div className="flex-1">
      <h3 className={`text-xl font-black tracking-tight mb-2 transition-colors duration-500 ${
        active ? 'text-gray-900 group-hover:text-[var(--brand-primary)]' : 'text-gray-500'
      }`}>
        {title}
      </h3>
      <p className="text-[12px] font-medium leading-relaxed text-gray-500 line-clamp-3">
        {description}
      </p>
    </div>

    <div className="mt-6 flex items-center justify-between">
       <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-[var(--brand-primary)]' : 'text-gray-300'}`}>
         {active ? 'Launch Module' : 'In Development'}
       </span>
       {active && <ArrowRight size={16} className="text-[var(--brand-primary)] transform group-hover:translate-x-1 transition-transform" />}
    </div>
  </button>
);

const PortalHub = ({ onSelectModule }) => {
  const sections = [
    {
      title: 'Operational Core',
      modules: [
        { id: 'biometrics', title: 'Biometric Identity', description: 'Eliminate ghost workers with fingerprint and facial registration.', icon: <Fingerprint />, active: true },
        { id: 'workforce', title: 'AI Workforce Management', description: 'Task assignment, attendance, and performance leaderboards.', icon: <Users />, active: true },
        { id: 'operations', title: 'Farm Activity & Logs', description: 'Daily harvesting, planting, and spraying records (geo-referenced).', icon: <ClipboardList />, active: true },
        { id: 'compliance', title: 'Risk & Compliance', description: 'Real-time fraud alerts and immutable activity ledgers.', icon: <ShieldCheck />, active: false },
      ]
    },
    {
      title: 'Intelligence & Sensing',
      modules: [
        { id: 'crop-ai', title: 'Crop & Disease AI', description: 'AI image recognition for pest and nutrient deficiency alerts.', icon: <Sprout />, active: false },
        { id: 'remote-sensing', title: 'Satellite & GeoAI', description: 'NDVI vegetation indices and GeoAI land classification.', icon: <Globe />, active: true },
        { id: 'drones', title: 'Drone Monitoring', description: 'Live drone feed integration and field surveillance.', icon: <Camera />, active: false },
        { id: 'geospatial', title: 'Geofencing Intel', description: 'Farm boundary mapping and breach alerts.', icon: <Zap />, active: true },
      ]
    },
    {
      title: 'Supply Chain & Finance',
      modules: [
        { id: 'payments', title: 'Financial System', description: 'Digital payments, wallets, and automated payroll sync.', icon: <Wallet />, active: false },
        { id: 'logistics', title: 'Logistics & Tracking', description: 'Track produce movement and reduce transit diversion.', icon: <Truck />, active: false },
        { id: 'dashboards', title: 'Executive Portals', description: 'Organisation-wide strategic insights and manager views.', icon: <LayoutDashboard />, active: true },
        { id: 'advisor', title: 'Farm Advisor', description: 'Location-aware weather and pest alerts via SMS/Newsletters.', icon: <MessageSquare />, active: false },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8 lg:p-20 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-24">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-[var(--brand-primary)] rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-[var(--brand-primary)]/30 transform hover:rotate-6 transition-transform">
                <ShieldCheck className="text-white w-8 h-8" />
             </div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">FarmIntelytics</h1>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--brand-secondary)] mt-1.5">Verified · Monitored · Connected</p>
             </div>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="hidden xl:flex gap-12">
                {['Overview', 'Modules', 'Crops', 'Architecture'].map(item => (
                  <button key={item} className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[var(--brand-primary)] transition-colors">{item}</button>
                ))}
             </div>
             <button className="bg-[var(--brand-primary)] text-white px-8 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-[var(--brand-primary)]/20 hover:scale-105 active:scale-95 transition-all">
                Book a Demo
             </button>
          </div>
        </header>

        <div className="mb-24">
           <div className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--brand-primary)] mb-6">The Suite</div>
           <h2 className="text-6xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-8">
             Twelve Modules.<br/>
             One <span className="text-[var(--brand-primary)]">Unified System.</span>
           </h2>
           <p className="text-xl text-gray-500 font-medium max-w-3xl leading-relaxed">
             Each module works standalone, but the real power emerges when they share one identity, one map and one source of truth.
           </p>
        </div>

        <div className="space-y-32">
          {sections.map(section => (
            <div key={section.title} className="space-y-12">
              <div className="flex items-center gap-4">
                <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-400 whitespace-nowrap">{section.title}</h3>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        <footer className="mt-40 pt-16 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-start gap-12 pb-20">
           <div className="max-w-md">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldCheck size={24} className="text-[var(--brand-primary)]" />
                 <span className="text-lg font-black uppercase tracking-tighter">FarmIntelytics</span>
              </div>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                The operating system for agricultural intelligence, combining biometrics, geospatial data, payments and AI into one verified source of truth.
              </p>
              <div className="text-[11px] font-black uppercase tracking-widest text-gray-400">© 2026 FarmIntelytics. All rights reserved.</div>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24">
              <div>
                 <div className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-6">Platform</div>
                 <div className="flex flex-col gap-4">
                    {['Modules', 'Crops', 'Monitoring', 'Architecture'].map(i => (
                      <button key={i} className="text-[12px] font-medium text-gray-500 hover:text-[var(--brand-primary)] text-left transition-colors">{i}</button>
                    ))}
                 </div>
              </div>
              <div>
                 <div className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-6">Support</div>
                 <div className="flex flex-col gap-4">
                    {['Developer API', 'Contact', 'Status'].map(i => (
                      <button key={i} className="text-[12px] font-medium text-gray-500 hover:text-[var(--brand-primary)] text-left transition-colors">{i}</button>
                    ))}
                 </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                 <div className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-6">Get in Touch</div>
                 <button className="text-[14px] font-black text-[var(--brand-primary)] hover:underline mb-2 block">Request a demo</button>
                 <button className="text-[12px] font-bold text-gray-500">hello@farmintelytics.com</button>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
};

const ClipboardList = ({ size, className }) => <Sprout size={size} className={className} />; // Placeholder for Activity icon

export default PortalHub;
