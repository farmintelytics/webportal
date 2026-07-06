import React, { useState, useEffect, useRef } from 'react';
import { Upload, Map, CheckCircle, AlertCircle, X, FileJson, Layers } from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchFarms, uploadBoundary, getBoundaryInfo } from '../../services/adminApi';

const ChangeView = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [bounds, map]);
  return null;
};

const Boundaries = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [boundaryInfo, setBoundaryInfo] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchFarms().then(setFarms).catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selectedFarm) { setBoundaryInfo(null); return; }
    getBoundaryInfo(selectedFarm)
      .then(setBoundaryInfo)
      .catch(() => setBoundaryInfo(null));
  }, [selectedFarm]);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file || !selectedFarm) return;
    setUploading(true); setResult(null); setError('');
    try {
      const res = await uploadBoundary(selectedFarm, file);
      setResult(res);
      setFile(null);
      // Refresh boundary info
      const info = await getBoundaryInfo(selectedFarm);
      setBoundaryInfo(info);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const selectedFarmObj = farms.find(f => f.farm_id === selectedFarm);

  const leafletBounds = boundaryInfo && boundaryInfo.bbox ? [
    [boundaryInfo.bbox.min_lat, boundaryInfo.bbox.min_lng],
    [boundaryInfo.bbox.max_lat, boundaryInfo.bbox.max_lng]
  ] : null;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 800, margin: 0 }}>Boundary Upload</h2>
        <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, margin: '4px 0 0' }}>Upload GeoJSON boundary files for farms → stored in MinIO</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Farm selector */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Select Farm
            </label>
            <select
              value={selectedFarm}
              onChange={e => setSelectedFarm(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#1e293b', fontSize: '13px', fontWeight: 600, outline: 'none', cursor: 'pointer', fontFamily: "'Roboto', sans-serif" }}
            >
              <option value="">Choose a farm…</option>
              {farms.map(f => <option key={f.farm_id} value={f.farm_id}>{f.farm_name} ({f.company_id})</option>)}
            </select>
          </div>

          {/* Current boundary status */}
          {boundaryInfo && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: boundaryInfo.boundary_uploaded ? 'rgba(22,163,74,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${boundaryInfo.boundary_uploaded ? 'rgba(22,163,74,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {boundaryInfo.boundary_uploaded
                  ? <CheckCircle size={14} color="#16a34a" />
                  : <AlertCircle size={14} color="#f59e0b" />}
                <span style={{ fontSize: '12px', fontWeight: 700, color: boundaryInfo.boundary_uploaded ? '#16a34a' : '#f59e0b' }}>
                  {boundaryInfo.boundary_uploaded ? 'Boundary uploaded' : 'No boundary yet'}
                </span>
              </div>
              {boundaryInfo.minio_path && (
                <p style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace', margin: 0, wordBreak: 'break-all' }}>
                  {boundaryInfo.minio_path}
                </p>
              )}
            </div>
          )}

          {/* Dropzone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#16a34a' : file ? 'rgba(22,163,74,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '16px', padding: '40px 20px',
              background: dragOver ? 'rgba(22,163,74,0.05)' : 'rgba(255,255,255,0.02)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', cursor: 'pointer', transition: 'all 0.2s',
              textAlign: 'center',
            }}
          >
            <input ref={inputRef} type="file" accept=".geojson,.json" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
            {file ? (
              <>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileJson size={22} color="#16a34a" />
                </div>
                <div>
                  <p style={{ color: '#1e293b', fontSize: '13px', fontWeight: 700, margin: 0 }}>{file.name}</p>
                  <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0' }}>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setFile(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <X size={12} /> Remove
                </button>
              </>
            ) : (
              <>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={22} color="#4b5563" />
                </div>
                <div>
                  <p style={{ color: '#334155', fontSize: '13px', fontWeight: 600, margin: 0 }}>Drop GeoJSON here or click to browse</p>
                  <p style={{ color: '#475569', fontSize: '11px', margin: '4px 0 0' }}>Accepts .geojson or .json files</p>
                </div>
              </>
            )}
          </div>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!file || !selectedFarm || uploading}
            style={{
              padding: '14px', background: !file || !selectedFarm ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #16a34a, #15803d)',
              border: `1px solid ${!file || !selectedFarm ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
              borderRadius: '12px', color: !file || !selectedFarm ? '#374151' : 'white',
              fontSize: '13px', fontWeight: 800, cursor: !file || !selectedFarm ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {uploading
              ? <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Uploading…</>
              : <><Upload size={16} />Upload to MinIO</>}
          </button>

          {/* Results / errors */}
          {result && (
            <div style={{ padding: '14px 16px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={15} color="#16a34a" />
                <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 700 }}>Upload Successful</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace', margin: 0 }}>{result.minio_path}</p>
              <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0' }}>{(result.size_bytes / 1024).toFixed(1)} KB saved</p>
            </div>
          )}
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertCircle size={14} />{error}
              <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}><X size={13} /></button>
            </div>
          )}
        </div>

        {/* Right: Map and MinIO path guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Boundary Map Card */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden', height: '380px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
              <Map size={16} color="#16a34a" />
              <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 700 }}>Boundary Map</span>
              {boundaryInfo && boundaryInfo.boundary_uploaded ? (
                <span style={{ fontSize: '10px', color: '#16a34a', background: 'rgba(22, 163, 74, 0.1)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, marginLeft: 'auto' }}>Live Geometry</span>
              ) : (
                <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, marginLeft: 'auto' }}>No Geometry</span>
              )}
            </div>

            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <MapContainer 
                center={[6.5244, 3.3792]} 
                zoom={2} 
                style={{ height: '100%', width: '100%' }} 
                zoomControl={false}
              >
                <TileLayer 
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
                  attribution='&copy; ESRI World Imagery'
                />
                <ZoomControl position="bottomleft" />
                
                {leafletBounds && <ChangeView bounds={leafletBounds} />}
                
                {boundaryInfo && boundaryInfo.geojson && (
                  <GeoJSON 
                    key={selectedFarm + JSON.stringify(boundaryInfo.geojson)}
                    data={boundaryInfo.geojson} 
                    style={{
                      color: '#10b981',
                      weight: 3,
                      fillColor: '#10b981',
                      fillOpacity: 0.25,
                    }}
                  />
                )}
              </MapContainer>
              
              {!selectedFarm && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                  <Map size={32} color="#64748b" style={{ marginBottom: '8px' }} />
                  <p style={{ color: '#1e293b', fontSize: '13px', fontWeight: 700, margin: 0 }}>No Farm Selected</p>
                  <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0' }}>Select a farm from the left side to visualize its geographic bounds.</p>
                </div>
              )}
              
              {selectedFarm && boundaryInfo && !boundaryInfo.boundary_uploaded && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                  <Map size={32} color="#f59e0b" style={{ marginBottom: '8px' }} />
                  <p style={{ color: '#1e293b', fontSize: '13px', fontWeight: 700, margin: 0 }}>No Boundary Uploaded</p>
                  <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0' }}>Upload a GeoJSON file to overlay the farm limits on satellite imagery.</p>
                </div>
              )}
            </div>
          </div>

          {/* MinIO Guide & All Farms */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Layers size={16} color="#16a34a" />
              <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 700 }}>MinIO Storage Path</span>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', fontFamily: 'monospace', fontSize: '12px' }}>
              <span style={{ color: '#64748b' }}>farmintelytics-data /</span>
              <br />
              <span style={{ color: '#f59e0b' }}>  {'{company_id}'}</span>
              <span style={{ color: '#64748b' }}>/inputs/</span>
              <br />
              <span style={{ color: '#60a5fa' }}>    {'{farm_id}'}</span>
              <span style={{ color: '#64748b' }}>/</span>
              <br />
              <span style={{ color: '#16a34a' }}>      {'{farm_id}'}</span>
              <span style={{ color: '#64748b' }}>_farm.geojson</span>
            </div>
            {selectedFarmObj && (
              <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(22,163,74,0.06)', borderRadius: '8px' }}>
                <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Selected Farm Path</p>
                <p style={{ color: '#16a34a', fontSize: '11px', fontFamily: 'monospace', wordBreak: 'break-all', margin: 0 }}>
                  {selectedFarmObj.company_id}/inputs/{selectedFarmObj.farm_id}/{selectedFarmObj.farm_id}_farm.geojson
                </p>
              </div>
            )}

            <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>All Farms</p>
              {farms.map(f => (
                <div key={f.farm_id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: f.boundary_uploaded ? '#16a34a' : '#374151', flexShrink: 0 }} />
                  <span style={{ color: '#475569', fontSize: '11px', fontWeight: 600, flex: 1 }}>{f.farm_name}</span>
                  <span style={{ color: '#475569', fontSize: '10px', fontFamily: 'monospace' }}>{f.farm_id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Boundaries;
