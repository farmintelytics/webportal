import React, { useState, useEffect } from 'react';
import Login from './views/Login';
import PortalHub from './views/PortalHub';
import PortalLayout from './layouts/PortalLayout';
import Dashboard from './apps/ffb/Dashboard';
import Identity from './apps/ffb/Identity';
import Workforce from './apps/ffb/Workforce';
import Activity from './apps/ffb/Activity';
import Geospatial from './apps/ffb/Geospatial';
import WorkerAnalytics from './apps/ffb/WorkerAnalytics';
import { crops } from './config/crops';

const App = () => {
  const [view, setView] = useState('login'); // login, hub, portal
  const [activePortal, setActivePortal] = useState(null); // 'ffb', 'cashew', etc.
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentCrop, setCurrentCrop] = useState(crops[0]);

  const handleLogin = () => setView('hub');
  
  const handleSelectPortal = (portalId) => {
    setActivePortal(portalId);
    setView('portal');
  };

  const handleBackToHub = () => setView('hub');

  const getSectionContent = () => {
    if (activePortal === 'ffb') {
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
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-20 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter capitalize">{activePortal} Intelligence</h2>
        <p className="text-gray-500 font-medium">This module is currently being optimized for your division.</p>
      </div>
    );
  };

  if (view === 'login') return <Login onLogin={handleLogin} />;
  if (view === 'hub') return <PortalHub onSelectPortal={handleSelectPortal} />;

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
