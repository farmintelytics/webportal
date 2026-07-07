import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Check, ChevronRight, Layers, AlertCircle, Search, Edit3 } from 'lucide-react';
import { fetchFarms, createFarm, deleteFarm, fetchOrganizations } from '../../services/adminApi';

const SENSORS = ['sentinel-2', 'sentinel-1', 'landsat-9'];
const INDICES = ['NDVI', 'EVI', 'NDMI', 'RECI', 'NDWI', 'LSWI', 'NDRE', 'NBR'];

const FarmModal = ({ orgs, farms, onSave, onClose }) => {
  const [form, setForm] = useState({
    company_name: '', company_id: '', farm_name: '', farm_id: '',
    parent_farm_id: '', parent_farm_name: '',
    sensors: ['sentinel-2'], indices: ['NDVI', 'NDMI'],
    processing_level: 'plot_level', cloud_cover_threshold: 10,
    start_date: '', end_date: '',
  });
  const [saving, setSaving] = useState(false);

  const selectedOrg = orgs.find(o => o.schema_name === form.company_id);
  const parentFarms = farms.filter(f => f.company_id === form.company_id && !f.parent_farm_id);

  const toggleSensor = (s) => setForm(f => ({ ...f, sensors: f.sensors.includes(s) ? f.sensors.filter(x => x !== s) : [...f.sensors, s] }));
  const toggleIndex  = (i) => setForm(f => ({ ...f, indices:  f.indices.includes(i)  ? f.indices.filter(x => x !== i)  : [...f.indices, i] }));

  const handleOrgChange = (schema_name) => {
    const org = orgs.find(o => o.schema_name === schema_name);
    setForm(f => ({ ...f, company_id: schema_name, company_name: org?.display_name || '' }));
  };

  const handleParentChange = (parent_farm_id) => {
    const parent = farms.find(f => f.farm_id === parent_farm_id);
    setForm(f => ({ ...f, parent_farm_id, parent_farm_name: parent?.farm_name || '' }));
  };

  const handleSave = async () => {
    if (!form.farm_name.trim() || !form.company_id) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#0f172a', fontSize: '13px', fontWeight: 500, outline: 'none', boxSizing: 'border-box', fontFamily: "'Roboto', sans-serif" };
  const labelStyle = { display: 'block', fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(15,23,42,0.1)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 800, margin: 0 }}>Register New Farm</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Organization *</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.company_id} onChange={e => handleOrgChange(e.target.value)}>
                <option value="">Select organization…</option>
                {orgs.map(o => <option key={o.schema_name} value={o.schema_name}>{o.display_name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Parent Farm (optional)</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.parent_farm_id} onChange={e => handleParentChange(e.target.value)}>
                <option value="">No parent</option>
                {parentFarms.map(f => <option key={f.farm_id} value={f.farm_id}>{f.farm_name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Farm Name *</label>
              <input style={inputStyle} placeholder="e.g. Okomu Main Estate" value={form.farm_name} onChange={e => setForm(f => ({ ...f, farm_name: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Farm ID (slug)</label>
              <input style={inputStyle} placeholder="Auto-generated if blank" value={form.farm_id} onChange={e => setForm(f => ({ ...f, farm_id: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Sensors</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SENSORS.map(s => {
                const active = form.sensors.includes(s);
                return <button key={s} onClick={() => toggleSensor(s)} style={{ padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, background: active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)', border: active ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.07)', color: active ? '#60a5fa' : '#6b7280', transition: 'all 0.15s' }}>{s}</button>;
              })}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Indices</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {INDICES.map(i => {
                const active = form.indices.includes(i);
                return <button key={i} onClick={() => toggleIndex(i)} style={{ padding: '4px 10px', borderRadius: '7px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, background: active ? 'rgba(22,163,74,0.12)' : 'rgba(255,255,255,0.04)', border: active ? '1px solid rgba(22,163,74,0.25)' : '1px solid rgba(255,255,255,0.07)', color: active ? '#16a34a' : '#6b7280', transition: 'all 0.15s' }}>{i}</button>;
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Processing Level</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.processing_level} onChange={e => setForm(f => ({ ...f, processing_level: e.target.value }))}>
                <option value="plot_level">Plot Level</option>
                <option value="farm_level">Farm Level</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Cloud Cover % (max)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="range" min="0" max="100" value={form.cloud_cover_threshold} onChange={e => setForm(f => ({ ...f, cloud_cover_threshold: parseInt(e.target.value) }))} style={{ flex: 1, accentColor: '#16a34a' }} />
                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 700, minWidth: '36px' }}>{form.cloud_cover_threshold}%</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={labelStyle}>Start Date</label><input type="date" style={inputStyle} value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
            <div><label style={labelStyle}>End Date</label><input type="date" style={inputStyle} value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} /></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#334155', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.farm_name.trim() || !form.company_id} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: '13px', opacity: saving ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {saving ? <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <><Check size={15} />Register Farm</>}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedOrgs, setExpandedOrgs] = useState({});

  const load = async () => {
    try {
      const [f, o] = await Promise.all([fetchFarms(), fetchOrganizations()]);
      setFarms(f); setOrgs(o);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    try { await createFarm(form); setModalOpen(false); await load(); }
    catch (e) { setError(e.message); }
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm(`Delete farm "${farmId}"?`)) return;
    try { await deleteFarm(farmId); await load(); }
    catch (e) { setError(e.message); }
  };

  // Group by company_id
  const grouped = farms.reduce((acc, f) => {
    if (!acc[f.company_id]) acc[f.company_id] = { parent: [], children: {} };
    if (!f.parent_farm_id) acc[f.company_id].parent.push(f);
    else {
      if (!acc[f.company_id].children[f.parent_farm_id]) acc[f.company_id].children[f.parent_farm_id] = [];
      acc[f.company_id].children[f.parent_farm_id].push(f);
    }
    return acc;
  }, {});

  const searchFilter = (f) => !search || f.farm_name.toLowerCase().includes(search.toLowerCase()) || f.farm_id.toLowerCase().includes(search.toLowerCase());

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 800, margin: 0 }}>Farm Registry</h2>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, margin: '4px 0 0' }}>{farms.length} farms registered</p>
        </div>
        <button onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,163,74,0.2)' }}>
          <Plus size={16} />Register Farm
        </button>
      </div>

      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input placeholder="Search farms…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#0f172a', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertCircle size={15} />{error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}><X size={14} /></button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.keys(grouped).length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>No farms registered. Click "Register Farm" to add one.</div>
          )}
          {Object.entries(grouped).map(([companyId, { parent, children }]) => {
            const org = orgs.find(o => o.schema_name === companyId);
            const expanded = expandedOrgs[companyId] !== false;
            return (
              <div key={companyId} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden' }}>
                <button onClick={() => setExpandedOrgs(e => ({ ...e, [companyId]: !expanded }))}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <Layers size={16} color="#16a34a" />
                  <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700 }}>{org?.display_name || companyId}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>({parent.length} farms)</span>
                  <ChevronRight size={14} color="#64748b" style={{ marginLeft: 'auto', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {expanded && (
                  <div style={{ padding: '0 16px 16px' }}>
                    {parent.filter(searchFilter).map(farm => (
                      <div key={farm.farm_id}>
                        {/* Parent farm row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '4px' }}>
                          <div>
                            <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 700, margin: 0 }}>{farm.farm_name}</p>
                            <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, margin: '2px 0 0', fontFamily: 'monospace' }}>{farm.farm_id}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: farm.boundary_uploaded ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.08)', color: farm.boundary_uploaded ? '#16a34a' : '#ef4444', border: `1px solid ${farm.boundary_uploaded ? 'rgba(22,163,74,0.2)' : 'rgba(239,68,68,0.15)'}` }}>
                              {farm.boundary_uploaded ? '✓ Boundary' : '✗ No Boundary'}
                            </span>
                            <button onClick={() => handleDelete(farm.farm_id)} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '7px', padding: '5px', cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        {/* Sub-farms */}
                        {(children[farm.farm_id] || []).filter(searchFilter).map(sub => (
                          <div key={sub.farm_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 8px 32px', borderRadius: '8px', marginBottom: '3px' }}>
                            <div>
                              <p style={{ color: '#334155', fontSize: '12px', fontWeight: 600, margin: 0 }}>↳ {sub.farm_name}</p>
                              <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 600, margin: '1px 0 0', fontFamily: 'monospace' }}>{sub.farm_id}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '5px', background: sub.boundary_uploaded ? 'rgba(22,163,74,0.08)' : '#f1f5f9', color: sub.boundary_uploaded ? '#16a34a' : '#64748b', border: `1px solid ${sub.boundary_uploaded ? 'rgba(22,163,74,0.15)' : '#cbd5e1'}` }}>
                                {sub.boundary_uploaded ? '✓' : '✗'}
                              </span>
                              <button onClick={() => handleDelete(sub.farm_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', padding: '4px' }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && <FarmModal orgs={orgs} farms={farms} onSave={handleSave} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Farms;
