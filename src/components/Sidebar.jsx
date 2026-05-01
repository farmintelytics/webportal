import React from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  Fingerprint, 
  Users, 
  ClipboardList, 
  Sprout, 
  Microscope, 
  Map as MapIcon, 
  Copter, 
  CreditCard, 
  Truck,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard size={18} />, section: 'Overview' },
    { id: 'alerts', label: 'Smart Alerts', icon: <Bell size={18} />, section: 'Overview', badge: 5 },
    
    { id: 'identity', label: 'Biometric Identity', icon: <Fingerprint size={18} />, section: 'Core Operations' },
    { id: 'workforce', label: 'Workforce Management', icon: <Users size={18} />, section: 'Core Operations' },
    { id: 'activity', label: 'Farm Activity', icon: <ClipboardList size={18} />, section: 'Core Operations' },
    { id: 'ffb', label: 'FFB Counter & Harvest', icon: <Sprout size={18} />, section: 'Core Operations' },
    
    { id: 'crop', label: 'Crop & Disease AI', icon: <Microscope size={18} />, section: 'Intelligence' },
    { id: 'geo', label: 'Geospatial & Geofencing', icon: <MapIcon size={18} />, section: 'Intelligence' },
    { id: 'drone', label: 'Drone Monitoring', icon: <Copter size={18} />, section: 'Intelligence' },
    
    { id: 'payments', label: 'Payments & Finance', icon: <CreditCard size={18} />, section: 'Finance & Supply' },
    { id: 'logistics', label: 'Logistics & Supply Chain', icon: <Truck size={18} />, section: 'Finance & Supply' },
  ];

  const sections = [...new Set(navItems.map(item => item.section))];

  return (
    <nav className="w-64 bg-[#145C37] text-white flex flex-col h-screen overflow-y-auto shrink-0">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 bg-[#D4A017] rounded-lg flex items-center justify-center font-extrabold text-white text-lg">
          FI
        </div>
        <div className="leading-tight">
          <div className="font-bold text-sm">FarmIntelytics</div>
          <div className="text-[10px] text-white/50">Agricultural Intelligence</div>
        </div>
      </div>

      <div className="px-5 py-3 text-[11px] text-white/40 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        47 workers active · Estate Manager
      </div>

      <div className="flex-1">
        {sections.map(section => (
          <div key={section} className="py-2">
            <div className="px-5 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {section}
            </div>
            {navItems.filter(item => item.section === section).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-[13px] ${
                  activeSection === item.id 
                    ? 'bg-white/15 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="opacity-80">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#C0392B] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="p-5 border-t border-white/10 shrink-0 text-[10px] text-white/30">
        <div className="font-semibold text-white/50">FarmIntelytics v2.0</div>
        <div className="mt-1">April 2026 · Confidential</div>
        <div className="mt-3 flex items-center gap-2 bg-white/5 p-2 rounded-lg">
          <ShieldCheck size={14} className="text-white/40" />
          <span>Secure Session</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
