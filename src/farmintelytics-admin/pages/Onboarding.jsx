import React, { useState } from 'react';
import { Building2, Key, Settings, Check, ChevronRight, AlertCircle, X, Copy, Rocket, UploadCloud } from 'lucide-react';
import {
  createOrganization, createCredential, createFarm, uploadBoundary, generateFarmConfig, createSchedulerJob,
} from '../../services/adminApi';
import { slugify, modulesForAccessModel, ACCESS_MODELS, ALL_RS_INDICES } from './Organizations';

const ALL_CROPS = ['ffb', 'maize', 'rice', 'cocoa', 'rubber', 'cassava', 'sugarcane', 'cashew'];
const CROP_LABELS = {
  ffb: 'Oil Palm (FFB)', maize: 'Maize', rice: 'Rice', cocoa: 'Cocoa',
  rubber: 'Rubber', cassava: 'Cassava', sugarcane: 'Sugarcane', cashew: 'Cashew',
};
const ALL_SENSORS = ['sentinel-2', 'sentinel-1', 'landsat-9'];
const ALL_INDICES = ['NDVI', 'EVI', 'NDMI', 'RECI', 'NDWI', 'LSWI', 'LAI', 'NDRE', 'CVI', 'SAVI', 'MSI', 'GNDVI', 'ETC', 'LST', 'SMI_LANDSAT', 'VCI'];

const STEPS = [
  { id: 'organization', label: 'Organization Setup', icon: Building2 },
  { id: 'credentials', label: 'Login Credentials', icon: Key },
  { id: 'pipeline', label: 'Pipeline Config', icon: Settings },
];

const inputStyle = {
  width: '100%', padding: '11px 13px', background: '#ffffff', border: '1px solid #cbd5e1',
  borderRadius: '10px', color: '#0f172a', fontSize: '14px', fontWeight: 500,
  outline: 'none', boxSizing: 'border-box', fontFamily: "'Roboto', sans-serif",
};
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'Roboto', sans-serif" };
const helpTextStyle = { color: '#64748b', fontSize: '13px', margin: '6px 0 0', lineHeight: 1.5, fontFamily: "'Roboto', sans-serif" };
const chip = (active, color = '#16a34a') => ({
  padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
  background: active ? `${color}18` : '#ffffff',
  border: active ? `1px solid ${color}55` : '1px solid #cbd5e1',
  color: active ? color : '#6b7280', transition: 'all 0.15s', fontFamily: "'Roboto', sans-serif",
});
const primaryBtn = (disabled) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 26px',
  background: '#15803d', border: 'none', borderRadius: '12px',
  color: 'white', cursor: disabled ? 'default' : 'pointer', fontWeight: 800, fontSize: '14px',
  opacity: disabled ? 0.5 : 1, fontFamily: "'Roboto', sans-serif",
});
const secondaryBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 22px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#334155', cursor: 'pointer', fontWeight: 700, fontSize: '14px', fontFamily: "'Roboto', sans-serif" };

// The "Organization Setup" step covers company + first farm + its boundary —
// too much for one long scroll, so it's split into its own mini flow with
// Back/Next instead of dumping every field on screen at once.
const ORG_SUBSTEPS = [
  { id: 'company', label: 'Company' },
  { id: 'farm', label: 'Farm' },
  { id: 'boundary', label: 'Boundary' },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [orgSubStep, setOrgSubStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // Results carried forward between steps
  const [done, setDone] = useState({ org: null, credential: null, farm: null, boundary: null, config: null });

  // ── Step forms ──
  const [company, setCompany] = useState({ company_name: '', schema_name: '', map_center_lat: 6.43, map_center_lon: 5.27, accessModel: 'both', allowed_crops: [], allowed_indices: [] });
  const [cred, setCred] = useState({ email: '', access_code: '', label: 'Primary', full_name: '', role: 'admin' });
  const [farm, setFarm] = useState({
    farm_name: '', farm_id: '', sensors: ['sentinel-2', 'sentinel-1'],
    indices: ['NDVI', 'EVI', 'NDMI', 'RECI', 'NDWI', 'LSWI'],
    processing_level: 'plot_level', cloud_cover_threshold: 10, start_date: '', end_date: '',
  });
  const [boundaryFile, setBoundaryFile] = useState(null);
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [scheduleCron, setScheduleCron] = useState('0 3 */5 * *');

  const companySlug = company.schema_name.trim() || slugify(company.company_name);
  const toggleIn = (list, v) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];

  const canLeaveCompanyStep = company.company_name.trim() && (company.accessModel === 'organization' || company.allowed_crops.length > 0);
  const canLeaveFarmStep = farm.farm_name.trim() && farm.sensors.length > 0 && farm.indices.length > 0;

  const run = async (fn) => {
    setBusy(true); setError('');
    try { await fn(); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  // ── Step actions ──
  // Company + Farm Registry + Boundary Upload used to be three separate steps.
  // A company almost always onboards with exactly one initial farm, so they're
  // combined into a single "Organization Setup" step — one submit runs all
  // three API calls in sequence rather than requiring three separate screens.
  const submitOrganization = () => run(async () => {
    const allowed_modules = modulesForAccessModel(company.accessModel, company.allowed_crops, companySlug);
    const org = await createOrganization({
      company_name: company.company_name,
      schema_name: companySlug,
      allowed_crops: company.allowed_crops,
      allowed_modules,
      allowed_indices: company.allowed_indices,
      map_center_lat: company.map_center_lat,
      map_center_lon: company.map_center_lon,
    });

    const createdFarm = await createFarm({
      company_name: company.company_name,
      company_id: org.schema_name,
      farm_name: farm.farm_name,
      farm_id: farm.farm_id.trim(),
      parent_farm_id: '',
      parent_farm_name: '',
      sensors: farm.sensors,
      indices: farm.indices,
      processing_level: farm.processing_level,
      cloud_cover_threshold: farm.cloud_cover_threshold,
      start_date: farm.start_date || null,
      end_date: farm.end_date || null,
    });

    const boundary = await uploadBoundary(createdFarm.farm_id, boundaryFile);

    setDone(d => ({ ...d, org, farm: createdFarm, boundary }));
    setStep(1);
  });

  const submitCredential = () => run(async () => {
    const credential = await createCredential({
      company_id: done.org?.schema_name || companySlug,
      email: cred.email,
      access_code: cred.access_code,
      label: cred.label || 'Primary',
      full_name: cred.full_name,
      role: cred.role,
    });
    setDone(d => ({ ...d, credential }));
    setStep(2);
  });

  const submitConfig = () => run(async () => {
    const res = await generateFarmConfig(done.farm.farm_id);
    let scheduler = null;
    if (autoSchedule) {
      try {
        scheduler = await createSchedulerJob({
          name: `${done.farm.farm_id}_scheduled_monitoring`,
          description: `Scheduled pipeline run for ${done.farm.farm_name} (created by onboarding wizard)`,
          cron: scheduleCron,
          config_path: `configs/${res.filename}`,
          is_batch: true,
          enabled: true,
        });
      } catch (e) {
        // Config generated fine — surface the scheduler failure without losing progress
        setError(`Config generated, but scheduler job failed: ${e.message}`);
      }
    }
    setDone(d => ({ ...d, config: res, scheduler }));
    setStep(3);
  });

  const copyText = (text) => navigator.clipboard?.writeText(text);

  // ── Render helpers ──
  const StepHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const state = i < step ? 'done' : i === step ? 'active' : 'pending';
        return (
          <React.Fragment key={s.id}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px',
              background: state === 'active' ? 'rgba(22,163,74,0.1)' : state === 'done' ? 'rgba(22,163,74,0.05)' : '#ffffff',
              border: state === 'active' ? '1px solid rgba(22,163,74,0.4)' : '1px solid #e2e8f0',
            }}>
              {state === 'done'
                ? <Check size={14} color="#16a34a" />
                : <Icon size={14} color={state === 'active' ? '#16a34a' : '#94a3b8'} />}
              <span style={{ fontSize: '12px', fontWeight: 700, color: state === 'active' ? '#15803d' : state === 'done' ? '#16a34a' : '#94a3b8' }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} color="#cbd5e1" />}
          </React.Fragment>
        );
      })}
    </div>
  );

  const card = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px', fontFamily: "'Roboto', sans-serif" };

  // Small "Step 1 of 3" indicator for the Company → Farm → Boundary mini flow.
  const OrgSubStepHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {ORG_SUBSTEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: i === orgSubStep ? '#15803d' : i < orgSubStep ? '#16a34a' : '#94a3b8',
            fontSize: '13px', fontWeight: i === orgSubStep ? 800 : 600,
          }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i <= orgSubStep ? 'rgba(22,163,74,0.12)' : '#f1f5f9', fontSize: '11px', fontWeight: 800,
            }}>{i < orgSubStep ? <Check size={12} /> : i + 1}</span>
            {s.label}
          </div>
          {i < ORG_SUBSTEPS.length - 1 && <div style={{ width: '20px', height: '1px', background: '#e2e8f0' }} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', height: '100%', boxSizing: 'border-box', fontFamily: "'Roboto', sans-serif" }}>
      <div>
        <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Rocket size={20} color="#16a34a" /> Company Onboarding
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, margin: '4px 0 0' }}>
          Set up a new company in three steps: company details, then login credentials, then pipeline config.
        </p>
      </div>

      <StepHeader />

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', maxWidth: '640px' }}>
          <AlertCircle size={15} />{error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><X size={14} /></button>
        </div>
      )}

      {/* ── STEP 1: Company + Farm + Boundary, as its own mini Next-button flow ── */}
      {step === 0 && (
        <div style={card}>
          <OrgSubStepHeader />

          {orgSubStep === 0 && (
            <>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>Tell us the company's name and which crops and satellite data they can see.</p>
              <div>
                <label style={labelStyle}>Company Name *</label>
                <input style={inputStyle} placeholder="Company display name" value={company.company_name} onChange={e => setCompany(c => ({ ...c, company_name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Schema / Slug ID</label>
                <input style={inputStyle} placeholder={companySlug || 'auto-generated from name'} value={company.schema_name} onChange={e => setCompany(c => ({ ...c, schema_name: e.target.value }))} />
                <p style={helpTextStyle}>Leave blank and we'll generate one from the name: <code style={{ color: '#16a34a' }}>{companySlug || '—'}</code></p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Map Center Lat</label>
                  <input type="number" step="any" style={inputStyle} value={company.map_center_lat} onChange={e => setCompany(c => ({ ...c, map_center_lat: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <label style={labelStyle}>Map Center Lon</label>
                  <input type="number" step="any" style={inputStyle} value={company.map_center_lon} onChange={e => setCompany(c => ({ ...c, map_center_lon: parseFloat(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Access Model</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {ACCESS_MODELS.map(m => {
                    const active = company.accessModel === m.id;
                    return (
                      <button key={m.id} onClick={() => setCompany(c => ({ ...c, accessModel: m.id }))} style={{
                        padding: '11px 10px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                        background: active ? 'rgba(22,163,74,0.1)' : '#ffffff',
                        border: active ? '1px solid rgba(22,163,74,0.4)' : '1px solid #cbd5e1',
                      }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: active ? '#15803d' : '#334155' }}>{m.label}</span>
                        <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>{m.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Allowed Crops</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ALL_CROPS.map(c => (
                    <button key={c} onClick={() => setCompany(co => ({ ...co, allowed_crops: toggleIn(co.allowed_crops, c) }))} style={chip(company.allowed_crops.includes(c))}>
                      {CROP_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Allowed Satellite Indices</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '140px', overflowY: 'auto', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  {ALL_RS_INDICES.map(ix => (
                    <button key={ix.id} onClick={() => setCompany(co => ({ ...co, allowed_indices: toggleIn(co.allowed_indices, ix.id) }))} style={chip(company.allowed_indices.includes(ix.id))}>
                      {ix.label}
                    </button>
                  ))}
                </div>
                <p style={helpTextStyle}>These are the only layers this company will see. Leave all unchecked to show everything.</p>
              </div>
              <button onClick={() => setOrgSubStep(1)} disabled={!canLeaveCompanyStep} style={primaryBtn(!canLeaveCompanyStep)}>
                Next: Farm <ChevronRight size={15} />
              </button>
            </>
          )}

          {orgSubStep === 1 && (
            <>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>Now add the first farm or estate for {company.company_name || 'this company'}.</p>
              <div>
                <label style={labelStyle}>Farm / Estate Name *</label>
                <input style={inputStyle} placeholder="Farm or estate name" value={farm.farm_name} onChange={e => setFarm(f => ({ ...f, farm_name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Farm ID</label>
                <input style={inputStyle} placeholder={`Leave blank for auto: ${companySlug}_${slugify(farm.farm_name) || '…'}`} value={farm.farm_id} onChange={e => setFarm(f => ({ ...f, farm_id: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Sensors</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ALL_SENSORS.map(s => (
                    <button key={s} onClick={() => setFarm(f => ({ ...f, sensors: toggleIn(f.sensors, s) }))} style={chip(farm.sensors.includes(s), '#3b82f6')}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Indices to Compute</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ALL_INDICES.map(i => (
                    <button key={i} onClick={() => setFarm(f => ({ ...f, indices: toggleIn(f.indices, i) }))} style={chip(farm.indices.includes(i))}>{i}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Processing Level</label>
                  <select style={inputStyle} value={farm.processing_level} onChange={e => setFarm(f => ({ ...f, processing_level: e.target.value }))}>
                    <option value="plot_level">Plot Level</option>
                    <option value="farm_level">Farm Level</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Max Cloud Cover %</label>
                  <input type="number" min="0" max="100" style={inputStyle} value={farm.cloud_cover_threshold} onChange={e => setFarm(f => ({ ...f, cloud_cover_threshold: parseInt(e.target.value || '0', 10) }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Start Date (optional)</label>
                  <input type="date" style={inputStyle} value={farm.start_date} onChange={e => setFarm(f => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>End Date (optional)</label>
                  <input type="date" style={inputStyle} value={farm.end_date} onChange={e => setFarm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[1, 2, 3, 6].map(months => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => {
                      const end = new Date();
                      const start = new Date();
                      start.setMonth(start.getMonth() - months);
                      const iso = d => d.toISOString().slice(0, 10);
                      setFarm(f => ({ ...f, start_date: iso(start), end_date: iso(end) }));
                    }}
                    style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600, borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#334155', cursor: 'pointer' }}
                  >
                    Backfill {months}mo
                  </button>
                ))}
              </div>
              <p style={helpTextStyle}>
                Leave the dates blank to just start monitoring from today. To also pull older satellite images,
                pick a start date in the past (or use a button above).
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setOrgSubStep(0)} style={secondaryBtn}>Back</button>
                <button onClick={() => setOrgSubStep(2)} disabled={!canLeaveFarmStep} style={{ ...primaryBtn(!canLeaveFarmStep), flex: 1 }}>
                  Next: Boundary <ChevronRight size={15} />
                </button>
              </div>
            </>
          )}

          {orgSubStep === 2 && (
            <>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>Last step — upload the farm's boundary as a GeoJSON file.</p>
              <div>
                <label style={labelStyle}>Boundary GeoJSON *</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '32px',
                  border: '2px dashed #cbd5e1', borderRadius: '14px', cursor: 'pointer', background: '#f8fafc',
                }}>
                  <UploadCloud size={28} color={boundaryFile ? '#16a34a' : '#94a3b8'} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: boundaryFile ? '#16a34a' : '#475569' }}>
                    {boundaryFile ? boundaryFile.name : 'Click to choose a .geojson file'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>A polygon or multi-polygon of the farm's outline</span>
                  <input type="file" accept=".geojson,.json,application/geo+json" style={{ display: 'none' }} onChange={e => setBoundaryFile(e.target.files?.[0] || null)} />
                </label>
                <p style={helpTextStyle}>
                  This is exactly the file the pipeline will read for <strong>{farm.farm_name || 'this farm'}</strong>.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setOrgSubStep(1)} style={secondaryBtn}>Back</button>
                <button
                  onClick={submitOrganization}
                  disabled={busy || !boundaryFile}
                  style={{ ...primaryBtn(busy || !boundaryFile), flex: 1 }}
                >
                  {busy ? 'Creating…' : 'Create Organization + Farm'} <ChevronRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: Credentials ── */}
      {step === 1 && (
        <div style={card}>
          <p style={{ color: '#16a34a', fontSize: '13px', fontWeight: 700, margin: 0 }}>
            ✓ Organization "{done.org?.display_name}" created
          </p>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>Now create a login for this company.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Account Holder Name</label>
              <input style={inputStyle} placeholder="Full name" value={cred.full_name} onChange={e => setCred(c => ({ ...c, full_name: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Account Role</label>
              <select style={inputStyle} value={cred.role} onChange={e => setCred(c => ({ ...c, role: e.target.value }))}>
                <option value="admin">Admin — full organization access</option>
                <option value="analyst">Analyst — monitoring & reports</option>
                <option value="viewer">Viewer — read-only</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Login Email *</label>
            <input style={inputStyle} placeholder="Company login email" value={cred.email} onChange={e => setCred(c => ({ ...c, email: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Access Code (password)</label>
              <input style={inputStyle} placeholder="Blank = auto-generate" value={cred.access_code} onChange={e => setCred(c => ({ ...c, access_code: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Label</label>
              <input style={inputStyle} value={cred.label} onChange={e => setCred(c => ({ ...c, label: e.target.value }))} />
            </div>
          </div>
          <button onClick={submitCredential} disabled={busy || !cred.email.trim()} style={primaryBtn(busy || !cred.email.trim())}>
            {busy ? 'Creating…' : 'Create Credential'} <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ── STEP 3: Pipeline config ── */}
      {step === 2 && (
        <div style={card}>
          <p style={{ color: '#16a34a', fontSize: '13px', fontWeight: 700, margin: 0 }}>✓ Organization, farm and boundary are all set up</p>
          <p style={{ color: '#475569', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
            Last step — create the pipeline's run config for this farm, using the sensors and indices you picked.
          </p>
          <div style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
              <input type="checkbox" checked={autoSchedule} onChange={e => setAutoSchedule(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#16a34a' }} />
              Also schedule it to run automatically
            </label>
            {autoSchedule && (
              <div>
                <label style={labelStyle}>Cron Schedule</label>
                <input style={{ ...inputStyle, fontFamily: 'monospace', maxWidth: '220px' }} value={scheduleCron} onChange={e => setScheduleCron(e.target.value)} />
                <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0' }}>Default runs at 03:00 every 5 days (same cadence as the existing all-farms job).</p>
              </div>
            )}
          </div>
          <button onClick={submitConfig} disabled={busy || (autoSchedule && !scheduleCron.trim())} style={primaryBtn(busy)}>
            {busy ? 'Generating…' : autoSchedule ? 'Generate Config + Schedule Job' : 'Generate Pipeline Config'} <Settings size={15} />
          </button>
        </div>
      )}

      {/* ── DONE ── */}
      {step === 3 && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={22} color="#16a34a" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{done.org?.display_name} onboarded</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Config: <code>{done.config?.filename}</code></p>
            </div>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 18px', color: '#475569', fontSize: '12.5px', lineHeight: 2 }}>
            <li>Organization + access model saved — users see only their licensed modules.</li>
            <li>Login: <strong>{done.credential?.email}</strong> / <code>{done.credential?.access_code}</code></li>
            <li>Boundary in MinIO at <code>{done.boundary?.minio_path}</code></li>
            <li>Pipeline config <code>{done.config?.filename}</code> written to the shared configs folder.</li>
            {done.scheduler
              ? <li>Scheduler job <code>{done.scheduler.name}</code> active (<code>{done.scheduler.cron}</code>) — dashboards fill with real data after the first run.</li>
              : <li>No scheduler job created — add one under Scheduler pointing at the config, or run the pipeline manually.</li>}
          </ul>
          {done.config?.content && (
            <pre style={{ margin: 0, padding: '14px', background: '#0f172a', color: '#86efac', borderRadius: '12px', fontSize: '11px', overflowX: 'auto', maxHeight: '240px' }}>{done.config.content}</pre>
          )}
          <button onClick={() => { setStep(0); setOrgSubStep(0); setDone({ org: null, credential: null, farm: null, boundary: null, config: null }); setCompany({ company_name: '', schema_name: '', map_center_lat: 6.43, map_center_lon: 5.27, accessModel: 'both', allowed_crops: [], allowed_indices: [] }); setCred({ email: '', access_code: '', label: 'Primary', full_name: '', role: 'admin' }); setFarm(f => ({ ...f, farm_name: '', farm_id: '' })); setBoundaryFile(null); }} style={primaryBtn(false)}>
            <Rocket size={15} /> Onboard Another Company
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
