import React, { useMemo } from 'react';
import { createRouter, RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { MonitoringProvider } from '../shared/MonitoringContext';
import { SidebarProvider } from "@monitoring-shared/ui/sidebar";
import 'leaflet/dist/leaflet.css';
import './styles.css';

export default function Monitoring({ onBack, onSignOut }) {
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
    <SidebarProvider>
      <div className='monitoring-theme-sugarcane min-h-screen w-full text-foreground'>
        <MonitoringProvider onBack={onBack} onSignOut={onSignOut}>
          <RouterProvider router={router} />
        </MonitoringProvider>
      </div>
    </SidebarProvider>
  );
}
