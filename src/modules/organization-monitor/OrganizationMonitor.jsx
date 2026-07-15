import React from 'react';
import CropDashboardLayout from '../monitoring/shared/CropDashboardLayout';

/**
 * Organization-level satellite monitoring.
 *
 * This used to be a 7,384-line copy of CropDashboardLayout that differed in
 * only ~117 lines — so every fix had to be made twice, and the two had already
 * drifted apart. It is now the same component in organization mode:
 *
 *   - generic (scientific) legend classes, built from every index actually
 *     present in the tenant's archive, rather than one crop's profile
 *   - no crop name in the header, no crop_type on tile requests (the tile
 *     server then colours rasters with the same generic classes)
 *
 * Everything else — map, timeline slider, calendar, compare split, charts,
 * alerts, reports, verification, AI assistant — is shared, by construction.
 */
const OrganizationMonitor = ({ onBack, onSignOut }) => (
  <CropDashboardLayout mode="organization" onBack={onBack} onSignOut={onSignOut} />
);

export default OrganizationMonitor;
