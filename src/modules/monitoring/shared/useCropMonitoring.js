/**
 * useCropMonitoring — shared hook
 * Fetches real backend data for a given crop type.
 * Falls back gracefully if the backend is unavailable.
 *
 * Usage:
 *   const { summary, blocks, loading, error } = useCropMonitoring('ffb');
 */
import { useState, useEffect } from 'react';
import { fetchCropSummary, fetchCropBlocks, fetchCropIndices } from '../../../services/cropMonitoringApi';
import { fetchCropMonitoringConfig } from '../../../services/organizationMonitorApi';

export function useCropMonitoring(cropType = 'ffb') {
  const [summary, setSummary] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [indices, setIndices] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const [sumRes, indRes, confRes] = await Promise.all([
          fetchCropSummary(cropType),
          fetchCropIndices(cropType),
          fetchCropMonitoringConfig().catch(() => null),
        ]);
        if (!active) return;
        setSummary(sumRes);
        setIndices(indRes);
        if (confRes && confRes.map_center) {
          setMapCenter(confRes.map_center);
        }

        // Blocks can be large (623 items) — load separately
        try {
          const blkRes = await fetchCropBlocks(cropType);
          if (active) setBlocks(blkRes);
        } catch {
          // Blocks failed but summary is OK — that's fine
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [cropType]);

  return { summary, blocks, indices, mapCenter, loading, error };
}
