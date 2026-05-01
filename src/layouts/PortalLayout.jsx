import React from 'react';
import Sidebar from '../shared/components/Sidebar';
import TopBar from '../shared/components/TopBar';

const PortalLayout = ({ children, activeSection, setActiveSection, currentCrop, setCurrentCrop, crops, onBackToHub }) => {
  return (
    <div className="flex h-screen w-full bg-[var(--bg)] overflow-hidden font-sans antialiased">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        currentCrop={currentCrop}
        setCurrentCrop={setCurrentCrop}
        crops={crops}
        onBackToHub={onBackToHub}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={activeSection} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
