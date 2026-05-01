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

// === Monitoring Portals ===
import MonitoringPortal from './apps/monitoring/MonitoringPortal';

// === Groups & Smallholder Management ===
import GroupsDashboard from './apps/cooperative/Dashboard';

import { crops } from './config/crops';

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
      const sensorMap = {
        'rs-sugarcane': 'Sentinel-1 (SAR)',
        'rs-drone': 'UAV High-Res Imagery',
      };
      return <MonitoringPortal cropName={cropMap[selectedModule] || "Crop"} sensor={sensorMap[selectedModule] || 'Sentinel-2 (Optical)'} onBack={handleBackToHub} />;
    }

    // Single-dashboard portals
    const routes = {
      'management-cashew':    <CashewDashboard />,
      'management-sugarcane': <SugarcaneDashboard />,
      'management-rice':      <RiceDashboard />,
      'management-cocoa':     <CocoaDashboard />,
      'management-rubber':    <RubberDashboard />,
      'management-cassava':   <CassavaDashboard />,
      'management-maize':     <MaizeDashboard />,
      
      'drone-ffb':            <ComingSoon title="Drone Inspection" description="Live drone feed and high-resolution field surveillance." />,
      'drone-cashew':         <ComingSoon title="Orchard Survey" description="Tree count, canopy gap analysis and disease spot detection." />,
      'finance-hub':          <ComingSoon title="Central Finance Hub" description="Unified multi-crop financial dashboard. Filter by crop, region, or cooperative for global payroll and disbursement." />,
      'activity-ffb':         <ComingSoon title="Operations Log" description="Geo-referenced daily field logs — harvesting, planting, spraying." />,
      'advisor':              <ComingSoon title="Farm Advisor" description="Location-aware alerts, SMS weather/pest updates and crop-stage reminders." />,

      // Groups & Smallholder Management
      'group-management':     <GroupsDashboard mode="group-management" onBack={handleBackToHub} />,
      'group-monitoring':     <MonitoringPortal cropName="Smallholder" sensor="Satellite Fusion" onBack={handleBackToHub} />,
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

  // If it's a Monitoring Portal, render it standalone (no duplicate sidebars)
  if (selectedModule?.startsWith('rs-') || selectedModule === 'group-monitoring') {
    return React.cloneElement(sectionContent, { onBack: handleBackToHub });
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
    >
      {sectionContent}
    </PortalLayout>
  );
};

export default App;
