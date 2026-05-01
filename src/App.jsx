import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Identity from './components/Identity';
import Workforce from './components/Workforce';
import Activity from './components/Activity';

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const getSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'identity':
        return <Identity />;
      case 'workforce':
        return <Workforce />;
      case 'activity':
        return <Activity />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
              🚧
            </div>
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Section Under Construction</h2>
            <p className="text-sm">The {activeSection} module is currently being migrated to React.</p>
          </div>
        );
    }
  };

  const getSectionTitle = () => {
    const titles = {
      dashboard: 'Executive Dashboard',
      alerts: 'Smart Alerts',
      identity: 'Biometric Identity',
      workforce: 'Workforce Management',
      activity: 'Farm Activity',
      ffb: 'FFB Counter & Harvest',
      crop: 'Crop & Disease AI',
      geo: 'Geospatial & Geofencing',
      drone: 'Drone Monitoring',
      payments: 'Payments & Finance',
      logistics: 'Logistics & Supply Chain',
    };
    return titles[activeSection] || 'Platform';
  };

  const getSectionSub = () => {
    const subs = {
      dashboard: 'Portfolio overview · Updated 4 min ago',
      alerts: '5 unresolved notifications',
      identity: 'Worker registry and biometric verification',
      workforce: 'Live operational status and task tracking',
      activity: 'Approval queue and farm event log',
      ffb: 'Harvest monitoring and yield counting',
      crop: 'AI-driven disease detection and crop health',
      geo: 'GIS layers and geofence monitoring',
      drone: 'Aerial surveillance and NDVI mapping',
      payments: 'Financial disbursements and payroll',
      logistics: 'Supply chain and fleet management',
    };
    return subs[activeSection] || 'Real-time agricultural intelligence';
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F4F0] dark:bg-[#1C1C1A] overflow-hidden font-sans antialiased">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={getSectionTitle()} subTitle={getSectionSub()} />
        <main className="flex-1 overflow-hidden">
          {getSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
