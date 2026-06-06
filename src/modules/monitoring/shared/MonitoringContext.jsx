import React, { createContext, useContext } from 'react';

const MonitoringContext = createContext({
  onBack: () => {},
  onSignOut: () => {}
});

export const MonitoringProvider = ({ children, onBack, onSignOut }) => (
  <MonitoringContext.Provider value={{ onBack, onSignOut }}>
    {children}
  </MonitoringContext.Provider>
);

export const useMonitoring = () => useContext(MonitoringContext);
