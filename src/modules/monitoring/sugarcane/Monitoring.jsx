import React, { useMemo } from 'react';
import { createRouter, RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { MonitoringProvider } from '../shared/MonitoringContext';
import { useCropMonitoring } from '../shared/useCropMonitoring';
import { SidebarProvider } from "@monitoring-shared/ui/sidebar";
import 'leaflet/dist/leaflet.css';
import './styles.css';

export default function Monitoring({ onBack, onSignOut }) {
  const router = useMemo(() => {
    const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });
    return createRouter({ routeTree, history: memoryHistory, defaultPreload: 'intent' });
  }, []);

  // sugarcane uses NDMI/LSWI/WDI for moisture (user mentioned MDWI ≈ NDMI)
  const { summary, blocks, indices, loading, error } = useCropMonitoring('sugarcane');

  return (
    <SidebarProvider>
      <div className='monitoring-theme-sugarcane min-h-screen w-full text-foreground'>
        <MonitoringProvider
          onBack={onBack}
          onSignOut={onSignOut}
          cropType="sugarcane"
          cropSummary={summary}
          cropBlocks={blocks}
          cropIndices={indices}
          cropLoading={loading}
          cropError={error}
        >
          <RouterProvider router={router} />
        </MonitoringProvider>
      </div>
    </SidebarProvider>
  );
}
