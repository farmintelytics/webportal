import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Check, Building2, MapPin, Wheat, AlertCircle, Search } from 'lucide-react';
import { fetchOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../../services/adminApi';

const ALL_CROPS = ['ffb', 'maize', 'rice', 'cocoa', 'rubber', 'cassava', 'sugarcane', 'cashew'];

const CROP_LABELS = {
  ffb: 'Oil Palm (FFB)', maize: 'Maize', rice: 'Rice', cocoa: 'Cocoa',
  rubber: 'Rubber', cassava: 'Cassava', sugarcane: 'Sugarcane', cashew: 'Cashew',
};

const ALL_MODULES = [
  'rs-ffb', 'rs-maize', 'rs-rice', 'rs-cocoa', 'rs-sugarcane', 'rs-cashew', 'rs-rubber', 'rs-cassava', 'rs-drone',
  'management-ffb', 'management-maize', 'management-rice', 'management-cocoa', 'management-sugarcane', 'management-cashew', 'management-rubber', 'management-cassava',
  'group-management', 'group-monitoring', 'carbon-ffb', 'carbon-groups', 'forestry-intel', 'carbon-estimator', 'advisor', 'finance-hub'
];

const MODULE_LABELS = {
  'rs-ffb': 'Oil Palm RS',
  'rs-maize': 'Maize RS',
  'rs-rice': 'Rice RS',
  'rs-cocoa': 'Cocoa RS',
  'rs-sugarcane': 'Sugarcane RS',
  'rs-cashew': 'Cashew RS',
  'rs-rubber': 'Rubber RS',
  'rs-cassava': 'Cassava RS',
  'rs-drone': 'Drone Inspection',
  'management-ffb': 'Oil Palm Mgmt',
  'management-maize': 'Maize Mgmt',
  'management-rice': 'Rice Mgmt',
  'management-cocoa': 'Cocoa Mgmt',
  'management-sugarcane': 'Sugarcane Mgmt',
  'management-cashew': 'Cashew Mgmt',
  'management-rubber': 'Rubber Mgmt',
  'management-cassava': 'Cassava Mgmt',
  'group-management': 'Groups Mgmt',
  'group-monitoring': 'Group Monitoring',
  'carbon-ffb': 'Estate Carbon',
  'carbon-groups': 'Group Carbon',
  'forestry-intel': 'Forestry Intel',
  'carbon-estimator': 'Carbon Est.',
  'advisor': 'Farm Advisor',
  'finance-hub': 'Finance Hub'
};

const emptyForm = () => ({
  company_name: '', schema_name: '', allowed_crops: [], allowed_modules: [], map_center_lat: 6.685, map_center_lon: -1.625,
});

const OrgModal = ({ org, onSave, onClose }) => {
  const [form, setForm] = useState(org ? {
    company_name: org.display_name, schema_name: org.schema_name,
    allowed_crops: org.allowed_crops || [],
    allowed_modules: org.allowed_modules || [],
    map_center_lat: org.map_center_lat, map_center_lon: org.map_center_lon,
  } : emptyForm());
  const [saving, setSaving] = useState(false);

  const toggleCrop = (c) => setForm(f => ({
    ...f, allowed_crops: f.allowed_crops.includes(c) ? f.allowed_crops.filter(x => x !== c) : [...f.allowed_crops, c],
  }));

  const toggleModule = (m) => setForm(f => ({
    ...f, allowed_modules: f.allowed_modules.includes(m) ? f.allowed_modules.filter(x => x !== m) : [...f.allowed_modules, m],
  }));

  const handleSave = async () => {
    if (!form.company_name.trim()) return;
    setSaving(true);
    try { await onSave(org?.id, form); }
    finally { setSaving(false); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#ffffff', border: '1px solid #cbd5e1',
    borderRadius: '10px', color: '#0f172a', fontSize: '13px', fontWeight: 500,
    outline: 'none', boxSizing: 'border-box', fontFamily: "'Roboto', sans-serif",
  };
  const labelStyle = { display: 'block', fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifycontent: 'center', padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(15,23,42,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 800, margin: 0 }}>{org ? 'Edit Organization' : 'New Organization'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Company Name *</label>
            <input style={inputStyle} placeholder="e.g. Okomu Oil Palm Company" value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Schema / Slug ID</label>
            <input style={inputStyle} placeholder="Auto-generated if blank (e.g. okomu)" value={form.schema_name} onChange={e => setForm(f => ({ ...f, schema_name: e.target.value }))} />
            <p style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>Unique identifier used by the pipeline. Leave blank to auto-generate.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Map Center Lat</label>
              <input type="number" step="any" style={inputStyle} value={form.map_center_lat} onChange={e => setForm(f => ({ ...f, map_center_lat: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label style={labelStyle}>Map Center Lon</label>
              <input type="number" step="any" style={inputStyle} value={form.map_center_lon} onChange={e => setForm(f => ({ ...f, map_center_lon: parseFloat(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Allowed Crops</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ALL_CROPS.map(c => {
                const active = form.allowed_crops.includes(c);
                return (
                  <button key={c} onClick={() => toggleCrop(c)} style={{
                    padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                    background: active ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.04)',
                    border: active ? '1px solid rgba(22,163,74,0.3)' : '1px solid rgba(255,255,255,0.07)',
                    color: active ? '#16a34a' : '#6b7280',
                    transition: 'all 0.15s',
                  }}>
                    {CROP_LABELS[c] || c}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Allowed Modules</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '180px', overflowY: 'auto', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              {ALL_MODULES.map(m => {
                const active = form.allowed_modules.includes(m);
                return (
                  <button key={m} onClick={() => toggleModule(m)} style={{
                    padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700,
                    background: active ? 'rgba(59,130,246,0.1)' : '#ffffff',
                    border: active ? '1px solid rgba(59,130,246,0.3)' : '1px solid #cbd5e1',
                    color: active ? '#3b82f6' : '#475569',
                    transition: 'all 0.15s',
                  }}>
                    {MODULE_LABELS[m] || m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#334155', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.company_name.trim()} style={{
            flex: 2, padding: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '12px',
            color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: '13px', opacity: saving ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            {saving ? <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <><Check size={15} />{org ? 'Update' : 'Create'}</>}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

const Organizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    try {
      const data = await fetchOrganizations();
      setOrgs(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (id, form) => {
    try {
      if (id) await updateOrganization(id, form);
      else await createOrganization(form);
      setModal(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this organization and all its data?')) return;
    try { await deleteOrganization(id); await load(); }
    catch (e) { setError(e.message); }
  };

  const filtered = orgs.filter(o =>
    o.display_name.toLowerCase().includes(search.toLowerCase()) ||
    o.schema_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 800, margin: 0 }}>Organizations</h2>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, margin: '4px 0 0' }}>{orgs.length} registered tenants</p>
        </div>
        <button onClick={() => setModal({ org: null })} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
          background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '10px',
          color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(22,163,74,0.2)',
        }}>
          <Plus size={16} />New Organization
        </button>
      </div>

      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input placeholder="Search organizations…" value={search} onChange={e => setSearch(e.target.value)} style={{
          width: '100%', padding: '10px 12px 10px 36px',
          background: '#ffffff', border: '1px solid #cbd5e1',
          borderRadius: '10px', color: '#0f172a', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
        }} />
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#475569' }}>
              No organizations found. Create one to get started.
            </div>
          )}
          {filtered.map(org => (
            <div key={org.id} style={{
              background: '#ffffff', border: '1px solid #cbd5e1',
              borderRadius: '16px', padding: '20px', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={18} color="#16a34a" />
                  </div>
                  <div>
                    <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700, margin: 0 }}>{org.display_name}</p>
                    <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, margin: '2px 0 0', fontFamily: 'monospace' }}>{org.schema_name}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setModal({ org })} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#475569', display: 'flex' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = '#f1f5f9'; }} onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#f8fafc'; }}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(org.id)} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#ef4444', display: 'flex' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <MapPin size={12} color="#64748b" />
                <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
                  {org.map_center_lat.toFixed(4)}, {org.map_center_lon.toFixed(4)}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {(org.allowed_crops || []).map(c => (
                  <span key={c} style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                    background: 'rgba(22,163,74,0.08)', color: '#16a34a',
                    border: '1px solid rgba(22,163,74,0.15)',
                  }}>{CROP_LABELS[c] || c}</span>
                ))}
                {(!org.allowed_crops || org.allowed_crops.length === 0) && (
                  <span style={{ color: '#475569', fontSize: '11px', fontStyle: 'italic' }}>No crops configured</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <OrgModal org={modal.org} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

export default Organizations;
