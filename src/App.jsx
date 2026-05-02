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
import RubberDashboard from './apps/management/rubber/Dashboard';
import CassavaDashboard from './apps/management/cassava/Dashboard';
import MaizeDashboard from './apps/management/maize/Dashboard';

// === Field Advisory & Agronomy ===
import ClimateIntelligence from './apps/advisor/ClimateIntelligence';
import MonitoringPortal from './apps/monitoring/MonitoringPortal';
import SustainabilityPortal from './apps/sustainability/SustainabilityPortal';

// === Cooperative & Group Management ===
import GroupsDashboard from './apps/cooperative/Dashboard';

// === Finance & Payments ===
import FinanceDashboard from './apps/finance/Dashboard';

import { crops } from './config/crops.jsx';
import { Zap } from 'lucide-react';

// Placeholder for modules in development
const ComingSoon = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-full p-20 text-center bg-white">
    <div className="w-20 h-20 rounded-[2.5rem] bg-black text-white flex items-center justify-center mx-auto mb-8 shadow-2xl">
      <Zap size={32} className="text-[var(--brand-primary)]" />
    </div>
    <h2 className="text-4xl font-black text-black mb-4 tracking-tighter uppercase">{title}</h2>
    <p className="text-black/60 font-bold max-w-md uppercase text-[11px] tracking-[0.2em]">{description}</p>
  </div>
);

const App = () => {
  const [view, setView] = useState('hub');
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentCrop, setCurrentCrop] = useState(crops[0]);

  const handleSelectModule = (moduleId) => { 
    setSelectedModule(moduleId); 
    const crop = crops.find(c => c.id === moduleId);
    if (crop) setCurrentCrop(crop);
    setView('portal'); 
  };
  const handleLogin = () => setView('portal');
  const handleSignOut = () => { setView('login'); setActiveSection('dashboard'); };
  const handleBackToHub = () => { setView('hub'); setActiveSection('dashboard'); };

  const getSectionContent = () => {

    // Monitoring Portals (Standard Remote Sensing Web Portal Style)
    if (selectedModule?.startsWith('rs-')) {
      const cropMap = {
        'rs-ffb': 'Oil Palm',
        'rs-cashew': 'Cashew',
        'rs-sugarcane': 'SugarCane',
        'rs-rice': 'Rice',
        'rs-cocoa': 'Cocoa',
        'rs-rubber': 'Rubber',
        'rs-cassava': 'Cassava',
        'rs-maize': 'Maize',
        'rs-drone': 'Drone Intelligence'
      };
      
      return <MonitoringPortal 
        cropName={cropMap[selectedModule] || "Crop"} 
        onSignOut={handleSignOut}
        onBack={handleBackToHub} 
      />;
    }

    // Single-dashboard portals
    const routes = {
      'management-ffb':       <FFBDashboard activeSection={activeSection} />,
      'management-cashew':    <CashewDashboard activeSection={activeSection} />,
      'management-sugarcane': <SugarcaneDashboard activeSection={activeSection} />,
      'management-rice':      <RiceDashboard activeSection={activeSection} />,
      'management-cocoa':     <CocoaDashboard activeSection={activeSection} />,
      'management-rubber':    <RubberDashboard activeSection={activeSection} />,
      'management-cassava':   <CassavaDashboard activeSection={activeSection} />,
      'management-maize':     <MaizeDashboard activeSection={activeSection} />,
      
      'rs-ffb':               <MonitoringPortal cropName="Oil Palm" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-cashew':            <MonitoringPortal cropName="Cashew" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-rubber':            <MonitoringPortal cropName="Rubber" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-sugarcane':         <MonitoringPortal cropName="SugarCane" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-rice':              <MonitoringPortal cropName="Rice" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-cocoa':             <MonitoringPortal cropName="Cocoa" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-cassava':           <MonitoringPortal cropName="Cassava" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-maize':             <MonitoringPortal cropName="Maize" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      
      'drone-ffb':            <ComingSoon title="Drone Inspection" description="Live drone feed and high-resolution field surveillance." onSignOut={handleSignOut} />,
      'drone-cashew':         <ComingSoon title="Orchard Survey" description="Tree count, canopy gap analysis and disease spot detection." onSignOut={handleSignOut} />,
      
      'carbon-ffb':           <SustainabilityPortal title="Estate Carbon" type="Industrial" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'carbon-groups':        <SustainabilityPortal title="Group Carbon" type="Smallholder" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'forestry-intel':       <SustainabilityPortal title="Forestry Intel" type="High Density" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'carbon-estimator':     <SustainabilityPortal title="Carbon Estimator" type="Analytical" onSignOut={handleSignOut} onBack={handleBackToHub} />,

      'finance-hub':          <FinanceDashboard onSignOut={handleSignOut} />,
      'activity-ffb':         <ComingSoon title="Operations Log" description="Geo-referenced daily field logs — harvesting, planting, spraying." />,
      'advisor':              <ClimateIntelligence onSignOut={handleSignOut} onBack={handleBackToHub} />,

      // Groups & Smallholder Management
      'group-management':     <GroupsDashboard mode="group-management" onSignOut={handleSignOut} />,
      'group-monitoring':     <MonitoringPortal cropName="Smallholder" onSignOut={handleSignOut} onBack={handleBackToHub} />,
    };

    return routes[selectedModule] || (
      <ComingSoon title={selectedModule?.replace(/-/g, ' ')} description="This module is under active development." />
    );
  };

  if (view === 'hub')   return <PortalHub onSelectModule={handleSelectModule} />;
  if (view === 'login') {
    const cleanNameMap = {
      'rs-ffb': 'Oil Palm Monitoring',
      'rs-cashew': 'Cashew Monitoring',
      'rs-sugarcane': 'SugarCane Monitoring',
      'rs-rice': 'Rice Monitoring',
      'rs-cocoa': 'Cocoa Monitoring',
      'rs-rubber': 'Rubber Monitoring',
      'rs-cassava': 'Cassava Monitoring',
      'rs-maize': 'Maize Monitoring',
      'rs-drone': 'Drone Intelligence',
      'finance-hub': 'Central Finance Hub',
      'management-ffb': 'Oil Palm Management',
      'management-cashew': 'Cashew Management',
      'management-sugarcane': 'SugarCane Management',
      'management-rice': 'Rice Management',
      'management-cocoa': 'Cocoa Management',
      'management-rubber': 'Rubber Management',
      'management-cassava': 'Cassava Management',
      'management-maize': 'Maize Management',
      'group-management': 'Groups Management',
      'group-monitoring': 'Group Monitoring',
      'activity-ffb': 'Operations Logs',
      'advisor': 'Farm Advisor'
    };
    return <Login onLogin={handleLogin} moduleName={cleanNameMap[selectedModule] || selectedModule} onBack={handleBackToHub} />;
  }

  const sectionContent = getSectionContent();

  // If it's a Monitoring Portal or Sustainability/Advisor, render it standalone
  const standaloneModules = ['rs-', 'group-monitoring', 'carbon-', 'forestry-', 'advisor'];
  if (standaloneModules.some(m => selectedModule?.startsWith(m))) {
    return React.cloneElement(sectionContent, { 
      onBack: handleBackToHub,
      onSignOut: handleSignOut 
    });
  }

  // If it's a Groups module, render it standalone
  if (selectedModule === 'group-management') {
    return sectionContent;
  }

  return (
    <PortalLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      currentCrop={currentCrop}
      setCurrentCrop={setCurrentCrop}
      crops={crops}
      onBackToHub={handleBackToHub}
      onSignOut={handleSignOut}
    >
      {sectionContent}
    </PortalLayout>
  );
};

export default App;
