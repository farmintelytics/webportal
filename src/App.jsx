import React, { useState, useEffect } from 'react';
import Login from './views/Login';
import PortalHub from './views/PortalHub';
import PortalLayout from './layouts/PortalLayout';
import Dashboard from './apps/management/ffb/Dashboard';
import Identity from './apps/management/ffb/Identity';
import Workforce from './apps/management/ffb/Workforce';
import Activity from './apps/management/ffb/Activity';
import Geospatial from './apps/management/ffb/Geospatial';
import WorkerAnalytics from './apps/management/ffb/WorkerAnalytics';
import { crops } from './config/crops';

const App = () => {
  const [view, setView] = useState('hub'); // hub, login, portal
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentCrop, setCurrentCrop] = useState(crops[0]);

  const handleSelectModule = (moduleId) => {
    setSelectedModule(moduleId);
    setView('login');
  };

  const handleLogin = () => setView('portal');
  const handleBackToHub = () => setView('hub');

  const getSectionContent = () => {
    // Only management-ffb module implemented for now
    if (selectedModule === 'management-ffb') {
      switch (activeSection) {
        case 'dashboard':
          return <Dashboard currentCrop={currentCrop} />;
        case 'geospatial':
          return <Geospatial />;
        case 'workers':
          return <WorkerAnalytics />;
        case 'identity':
          return <Identity />;
        case 'workforce':
          return <Workforce />;
        case 'activity':
          return <Activity />;
        default:
          return <Dashboard currentCrop={currentCrop} />;
      }
    }
    
    // Remote Sensing - FFB placeholder
    if (selectedModule === 'rs-ffb') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-20 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Yield Prediction (Oil Palm)</h2>
          <p className="text-gray-500 font-medium">Satellite-driven yield forecasting module.</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-20 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter capitalize">{selectedModule?.replace('-', ' ')}</h2>
        <p className="text-gray-500 font-medium">This module is currently being optimized.</p>
      </div>
    );
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
