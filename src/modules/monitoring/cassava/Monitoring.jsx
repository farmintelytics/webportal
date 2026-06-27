import React, { useMemo } from 'react';
import { createRouter, RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { MonitoringProvider } from '../shared/MonitoringContext';
import { useCropMonitoring } from '../shared/useCropMonitoring';
import 'leaflet/dist/leaflet.css';
import './styles.css';

export default function Monitoring({ onBack, onSignOut }) {
  const { summary, blocks, indices, loading, error } = useCropMonitoring('cassava');
  const router = useMemo(() => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ['/'],
    });
    return createRouter({
      routeTree,
      history: memoryHistory,
      defaultPreload: 'intent',
    });
  }, []);

  return (
    <div className='monitoring-theme-cassava min-h-screen w-full'>
      <MonitoringProvider onBack={onBack} onSignOut={onSignOut} cropType="cassava" cropSummary={summary} cropBlocks={blocks} cropIndices={indices} cropLoading={loading} cropError={error}>
        <RouterProvider router={router} />
      </MonitoringProvider>
    </div>
  );
}
