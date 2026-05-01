import React, { useState } from 'react';
import Login from './views/Login';
import PortalHub from './views/PortalHub';
import PortalLayout from './layouts/PortalLayout';

// === FFB Management ===
import FFBDashboard from './apps/management/ffb/Dashboard';
import Identity from './apps/management/ffb/Identity';
import Workforce from './apps/management/ffb/Workforce';
import Activity from './apps/management/ffb/Activity';
import Geospatial from './apps/management/ffb/Geospatial';
import WorkerAnalytics from './apps/management/ffb/WorkerAnalytics';

// === Crop Management Portals ===
import CashewDashboard from './apps/management/cashew/Dashboard';
import SugarcaneDashboard from './apps/management/sugarcane/Dashboard';
import RiceDashboard from './apps/management/rice/Dashboard';
import CocoaDashboard from './apps/management/cocoa/Dashboard';

// === Remote Sensing ===
import CashewCanopy from './apps/remote-sensing/cashew/Dashboard';

import { crops } from './config/crops';

// Placeholder for modules in development
const ComingSoon = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-full p-20 text-center">
    <div className="w-16 h-16 rounded-3xl bg-[#1B2A4A]/5 flex items-center justify-center mx-auto mb-6">
      <span className="text-3xl">🚧</span>
    </div>
    <h2 className="text-3xl font-black text-[#1B2A4A] mb-3 tracking-tighter">{title}</h2>
    <p className="text-gray-500 font-medium max-w-md">{description}</p>
  </div>
);

const App = () => {
  const [view, setView] = useState('hub');
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentCrop, setCurrentCrop] = useState(crops[0]);

  const handleSelectModule = (moduleId) => { setSelectedModule(moduleId); setView('login'); };
  const handleLogin = () => setView('portal');
  const handleBackToHub = () => { setView('hub'); setActiveSection('dashboard'); };

  const getSectionContent = () => {
    // FFB sub-navigation (multi-page portal)
    if (selectedModule === 'management-ffb') {
      switch (activeSection) {
        case 'dashboard':  return <FFBDashboard currentCrop={currentCrop} />;
        case 'geospatial': return <Geospatial />;
        case 'workers':    return <WorkerAnalytics />;
        case 'identity':   return <Identity />;
        case 'workforce':  return <Workforce />;
        case 'activity':   return <Activity />;
        default:           return <FFBDashboard currentCrop={currentCrop} />;
      }
    }

    // Single-dashboard portals
    const routes = {
      'management-cashew':    <CashewDashboard />,
      'management-sugarcane': <SugarcaneDashboard />,
      'management-rice':      <RiceDashboard />,
      'management-cocoa':     <CocoaDashboard />,
      'rs-ffb':               <ComingSoon title="FFB Yield Prediction" description="NDVI-driven yield forecasting for Oil Palm estates via Sentinel-2 analysis." />,
      'rs-cashew':            <CashewCanopy />,
      'rs-sugarcane':         <ComingSoon title="Cane Growth Monitoring" description="CCS estimation and harvest readiness prediction from SAR imagery." />,
      'rs-rice':              <ComingSoon title="Paddy Field Mapping" description="Flood irrigation mapping and harvest date prediction via satellite phenology." />,
      'drone-ffb':            <ComingSoon title="Oil Palm Drone Inspection" description="Live drone feed and high-resolution field surveillance." />,
      'drone-cashew':         <ComingSoon title="Cashew Orchard Survey" description="Tree count, canopy gap analysis and disease spot detection." />,
      'payments-ffb':         <ComingSoon title="FFB Payment System" description="Automated payroll from verified work logs. Mobile money & bank integration." />,
      'payments-multi':       <ComingSoon title="Multi-Crop Payment Hub" description="Cross-crop worker payments, farmer disbursement and cooperative programs." />,
      'activity-ffb':         <ComingSoon title="Farm Activity & Operations" description="Geo-referenced daily field logs — harvesting, planting, spraying." />,
      'advisor':              <ComingSoon title="Farm Advisor" description="Location-aware alerts, SMS weather/pest updates and crop-stage reminders." />,
    };

    return routes[selectedModule] || (
      <ComingSoon title={selectedModule?.replace(/-/g, ' ')} description="This module is under active development." />
    );
  };

  if (view === 'hub')   return <PortalHub onSelectModule={handleSelectModule} />;
  if (view === 'login') return <Login onLogin={handleLogin} moduleName={selectedModule} onBack={handleBackToHub} />;

  return (
    <PortalLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      currentCrop={currentCrop}
      setCurrentCrop={setCurrentCrop}
      crops={crops}
      onBackToHub={handleBackToHub}
    >
      {getSectionContent()}
    </PortalLayout>
  );
};

export default App;
