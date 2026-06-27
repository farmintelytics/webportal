import React, { createContext, useContext } from 'react';

const MonitoringContext = createContext({
  onBack: () => {},
  onSignOut: () => {},
  cropType: 'ffb',
  cropSummary: null,
  cropBlocks: [],
  cropIndices: null,
  cropLoading: false,
  cropError: null,
});

export const MonitoringProvider = ({ children, onBack, onSignOut, cropType, cropSummary, cropBlocks, cropIndices, cropLoading, cropError }) => (
  <MonitoringContext.Provider value={{ onBack, onSignOut, cropType: cropType ?? 'ffb', cropSummary, cropBlocks: cropBlocks ?? [], cropIndices, cropLoading: cropLoading ?? false, cropError: cropError ?? null }}>
    {children}
  </MonitoringContext.Provider>
);

export const useMonitoring = () => useContext(MonitoringContext);
