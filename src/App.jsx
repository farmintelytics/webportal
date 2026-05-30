import React, { useState } from 'react';
import Login from './views/Login';
import PortalHub from './views/PortalHub';
import PortalLayout from './layouts/PortalLayout';

// === FFB Management ===
import FFBDashboard from './apps/management/ffb/Dashboard';

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
import EstatePortal from './apps/sustainability/estate/EstatePortal';
import GroupsPortal from './apps/sustainability/groups/GroupsPortal';
import ForestryPortal from './apps/sustainability/forestry/ForestryPortal';
import EstimatorPortal from './apps/sustainability/estimator/EstimatorPortal';

// === Specialized Monitoring Apps ===
import RiceMonitoring from './apps/monitoring/rice/Monitoring';
import MaizeMonitoring from './apps/monitoring/maize/Monitoring';
import CocoaMonitoring from './apps/monitoring/cocoa/Monitoring';
import FFBMonitoring from './apps/monitoring/ffb/Monitoring';
import CassavaMonitoring from './apps/monitoring/cassava/Monitoring';
import SugarcaneMonitoring from './apps/monitoring/sugarcane/Monitoring';

// === Cooperative & Group Management ===
import GroupsDashboard from './apps/cooperative/Dashboard';

// === Finance & Payments ===
import FinanceDashboard from './apps/finance/Dashboard';

import AgroMonitor from './apps/custom/AgroMonitor';

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
    setView('login'); 
  };
  const handleLogin = () => setView('portal');
  const handleSignOut = () => { setView('login'); setActiveSection('dashboard'); };
  const handleBackToHub = () => { setView('hub'); setActiveSection('dashboard'); };

  const getSectionContent = () => {

    // Monitoring Portals (Standard Remote Sensing Web Portal Style)
    if (selectedModule?.startsWith('rs-')) {
      const rsApps = {
        'rs-ffb':               <FFBMonitoring />,
        'rs-sugarcane':         <SugarcaneMonitoring />,
        'rs-rice':              <RiceMonitoring />,
        'rs-cocoa':             <CocoaMonitoring />,
        'rs-cassava':           <CassavaMonitoring />,
        'rs-maize':             <MaizeMonitoring />,
      };

      if (rsApps[selectedModule]) {
        return React.cloneElement(rsApps[selectedModule], {
          onSignOut: handleSignOut,
          onBack: handleBackToHub
        });
      }

      const cropMap = {
        'rs-cashew': 'Cashew',
        'rs-rubber': 'Rubber',
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
      
      'rs-ffb':               <FFBMonitoring onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-cashew':            <MonitoringPortal cropName="Cashew" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-rubber':            <MonitoringPortal cropName="Rubber" onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-sugarcane':         <SugarcaneMonitoring onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-rice':              <RiceMonitoring onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-cocoa':             <CocoaMonitoring onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-cassava':           <CassavaMonitoring onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'rs-maize':             <MaizeMonitoring onSignOut={handleSignOut} onBack={handleBackToHub} />,
      
      'drone-ffb':            <ComingSoon title="Drone Inspection" description="Live drone feed and high-resolution field surveillance." onSignOut={handleSignOut} />,
      'drone-cashew':         <ComingSoon title="Orchard Survey" description="Tree count, canopy gap analysis and disease spot detection." onSignOut={handleSignOut} />,
      
      'carbon-ffb':           <EstatePortal onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'carbon-groups':        <GroupsPortal onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'forestry-intel':       <ForestryPortal onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'carbon-estimator':     <EstimatorPortal onSignOut={handleSignOut} onBack={handleBackToHub} />,

      'finance-hub':          <FinanceDashboard onSignOut={handleSignOut} />,
      'activity-ffb':         <ComingSoon title="Operations Log" description="Geo-referenced daily field logs — harvesting, planting, spraying." />,
      'advisor':              <ClimateIntelligence onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'custom-agromonitor':   <AgroMonitor onSignOut={handleSignOut} onBack={handleBackToHub} />,

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
      'advisor': 'Farm Advisor',
      'custom-agromonitor': 'Agro Monitoring'
    };
    return <Login onLogin={handleLogin} moduleName={cleanNameMap[selectedModule] || selectedModule} onBack={handleBackToHub} />;
  }

  const sectionContent = getSectionContent();

  // If it's a Monitoring Portal or Sustainability/Advisor, render it standalone
  const standaloneModules = ['rs-', 'group-monitoring', 'carbon-', 'forestry-', 'advisor', 'custom-agromonitor'];
  if (standaloneModules.some(m => selectedModule?.startsWith(m) || selectedModule === m)) {
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
