import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import LoadingModal from '../components/LoadingModal';
import { useLoading } from '../hooks/useLoading';

const PortalLayout = ({ children, activeSection, setActiveSection, currentCrop, onSignOut }) => {
  const { loading, progress, message } = useLoading();

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans antialiased text-gray-900">
      <LoadingModal isLoading={loading} progress={progress} message={message} />

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentCrop={currentCrop}
        onSignOut={onSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={activeSection} />
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
