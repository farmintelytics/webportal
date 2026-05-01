import React, { useState } from 'react';
import Login from './views/Login';
import PortalHub from './views/PortalHub';
import PortalLayout from './layouts/PortalLayout';

// === FFB (Oil Palm) Management ===
import FFBDashboard from './apps/management/ffb/Dashboard';
import Identity from './apps/management/ffb/Identity';
import Workforce from './apps/management/ffb/Workforce';
import Activity from './apps/management/ffb/Activity';
import Geospatial from './apps/management/ffb/Geospatial';
import WorkerAnalytics from './apps/management/ffb/WorkerAnalytics';

// === Cashew Management ===
import CashewDashboard from './apps/management/cashew/Dashboard';

// === Sugarcane Management ===
import SugarcaneDashboard from './apps/management/sugarcane/Dashboard';

// === Rice Management ===
import RiceDashboard from './apps/management/rice/Dashboard';

// === Cocoa Management ===
import CocoaDashboard from './apps/management/cocoa/Dashboard';

// === Remote Sensing ===
import CashewCanopy from './apps/remote-sensing/cashew/Dashboard';

import { crops } from './config/crops';

const App = () => {
  const [view, setView] = useState('hub');
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentCrop, setCurrentCrop] = useState(crops[0]);

  const handleSelectModule = (moduleId) => {
    setSelectedModule(moduleId);
    setView('login');
  };

  const handleLogin = () => setView('portal');
  const handleBackToHub = () => { setView('hub'); setActiveSection('dashboard'); };

  const getSectionContent = () => {
    // FFB sub-sections
    if (selectedModule === 'management-ffb') {
      switch (activeSection) {
        case 'dashboard': return <FFBDashboard currentCrop={currentCrop} />;
        case 'geospatial': return <Geospatial />;
        case 'workers': return <WorkerAnalytics />;
        case 'identity': return <Identity />;
        case 'workforce': return <Workforce />;
        case 'activity': return <Activity />;
        default: return <FFBDashboard currentCrop={currentCrop} />;
      }
    }

    switch (selectedModule) {
      case 'management-cashew': return <CashewDashboard />;
      case 'management-sugarcane': return <SugarcaneDashboard />;
      case 'management-rice': return <RiceDashboard />;
      case 'management-cocoa': return <CocoaDashboard />;
      case 'rs-cashew': return <CashewCanopy />;
      case 'rs-ffb': return (
        <div className="flex flex-col items-center justify-center h-full p-20 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">FFB Yield Prediction</h2>
          <p className="text-gray-500 font-medium max-w-md">NDVI-driven yield forecasting models for Oil Palm estates. Sentinel-2 analysis and seasonal prediction.</p>
        </div>
      );
      default: return (
        <div className="flex flex-col items-center justify-center h-full p-20 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter capitalize">{selectedModule?.replace(/-/g, ' ')}</h2>
          <p className="text-gray-500 font-medium">Module coming soon.</p>
        </div>
      );
    }
  };

  if (view === 'hub') return <PortalHub onSelectModule={handleSelectModule} />;
  if (view === 'login') return <Login onLogin={handleLogin} moduleName={selectedModule} />;

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
