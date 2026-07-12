import React from 'react';
import { MonitoringProvider } from '../shared/MonitoringContext';
import { useCropMonitoring } from '../shared/useCropMonitoring';
import CropDashboardLayout from '../shared/CropDashboardLayout';
import 'leaflet/dist/leaflet.css';

export default function Monitoring({ onBack, onSignOut }) {
  const { summary, blocks, indices, mapCenter, loading, error } = useCropMonitoring('maize');

  return (
    <div className='monitoring-theme-maize min-h-screen w-full'>
      <MonitoringProvider
        onBack={onBack}
        onSignOut={onSignOut}
        cropType="maize"
        cropSummary={summary}
        cropBlocks={blocks}
        cropIndices={indices}
        cropLoading={loading}
        cropError={error}
        mapCenter={mapCenter}
      >
        <CropDashboardLayout onBack={onBack} onSignOut={onSignOut} cropType="maize" cropSummary={summary} cropBlocks={blocks} cropIndices={indices} cropLoading={loading} cropError={error} mapCenter={mapCenter} />
      </MonitoringProvider>
    </div>
  );
}
