/**
 * adminApi.js
 * ─────────────────────────────────────────────────────────────────────────────
 * API client for the FarmIntelytics Super Admin Portal backend.
 * Base path: /farmintelytics-engine/admin
 * Token stored separately from the regular tenant token.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const ADMIN_API_BASE =
  import.meta.env.VITE_ADMIN_API_BASE_URL ??
  'http://127.0.0.1:8000/farmintelytics-engine/admin';

/** Generic fetch helper for the admin API */
async function adminFetch(path, options = {}) {
  const url = `${ADMIN_API_BASE}${path}`;
  const token = localStorage.getItem('fi_admin_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { cache: 'no-store', ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin API ${res.status} – ${path}: ${text}`);
  }
  return res.json();
}

/** Multipart upload helper (for GeoJSON files) */
async function adminUpload(path, formData) {
  const url = `${ADMIN_API_BASE}${path}`;
  const token = localStorage.getItem('fi_admin_token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: formData });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin Upload ${res.status} – ${path}: ${text}`);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function adminLogin(email, accessCode) {
  return adminFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, access_code: accessCode }),
  });
}

// ─── Organizations ────────────────────────────────────────────────────────────

export async function fetchOrganizations() {
  return adminFetch('/organizations');
}

export async function createOrganization(data) {
  return adminFetch('/organizations', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateOrganization(id, data) {
  return adminFetch(`/organizations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteOrganization(id) {
  return adminFetch(`/organizations/${id}`, { method: 'DELETE' });
}

// ─── Farms ────────────────────────────────────────────────────────────────────

export async function fetchFarms(companyId) {
  const qs = companyId ? `?company_id=${companyId}` : '';
  return adminFetch(`/farms${qs}`);
}

export async function createFarm(data) {
  return adminFetch('/farms', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateFarm(farmId, data) {
  return adminFetch(`/farms/${farmId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteFarm(farmId) {
  return adminFetch(`/farms/${farmId}`, { method: 'DELETE' });
}

/**
 * POST /farms/{farm_id}/generate-config
 * Renders a ready-to-run pipeline batch YAML from the farm registry entry and
 * writes it into the shared pipeline configs folder.
 * Returns { status, filename, boundary_expected_at, boundary_uploaded, content }.
 */
export async function generateFarmConfig(farmId) {
  return adminFetch(`/farms/${farmId}/generate-config`, { method: 'POST' });
}

// ─── Boundaries ───────────────────────────────────────────────────────────────

export async function uploadBoundary(farmId, file) {
  const form = new FormData();
  form.append('file', file);
  return adminUpload(`/boundaries/${farmId}`, form);
}

export async function getBoundaryInfo(farmId) {
  return adminFetch(`/boundaries/${farmId}`);
}

// ─── Credentials ──────────────────────────────────────────────────────────────

export async function fetchCredentials(companyId) {
  const qs = companyId ? `?company_id=${companyId}` : '';
  return adminFetch(`/credentials${qs}`);
}

export async function createCredential(data) {
  return adminFetch('/credentials', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteCredential(id) {
  return adminFetch(`/credentials/${id}`, { method: 'DELETE' });
}

// ─── Logs ─────────────────────────────────────────────────────────────────────

export async function fetchLogs({ status, sensor, page = 1, pageSize = 50 } = {}) {
  const p = new URLSearchParams({ page, page_size: pageSize });
  if (status) p.set('status', status);
  if (sensor) p.set('sensor', sensor);
  return adminFetch(`/logs?${p}`);
}

export async function fetchPipelineLogs(companyId, limit = 20) {
  const p = new URLSearchParams({ limit });
  if (companyId) p.set('company_id', companyId);
  return adminFetch(`/logs/pipeline?${p}`);
}

// ─── Scheduler ────────────────────────────────────────────────────────────────

export async function fetchSchedulerJobs() {
  return adminFetch('/scheduler');
}

export async function createSchedulerJob(data) {
  return adminFetch('/scheduler', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateSchedulerJob(name, data) {
  return adminFetch(`/scheduler/${name}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteSchedulerJob(name) {
  return adminFetch(`/scheduler/${name}`, { method: 'DELETE' });
}


// ─── Pipeline Configs ─────────────────────────────────────────────────────────

export async function fetchPipelineConfigs() {
  return adminFetch('/pipeline-configs');
}

export async function fetchPipelineConfigContent(filename) {
  return adminFetch(`/pipeline-configs/${filename}`);
}

export async function savePipelineConfig(data) {
  return adminFetch('/pipeline-configs', { method: 'POST', body: JSON.stringify(data) });
}

export async function deletePipelineConfig(filename) {
  return adminFetch(`/pipeline-configs/${filename}`, { method: 'DELETE' });
}


// ─── MinIO & Postgres Sync ───────────────────────────────────────────────────

export async function fetchMinioInventory(companyId, farmId) {
  const p = new URLSearchParams();
  if (companyId) p.set('company_id', companyId);
  if (farmId) p.set('farm_id', farmId);
  const qs = p.toString() ? `?${p}` : '';
  return adminFetch(`/minio/inventory${qs}`);
}

export async function syncDatabaseWithMinio() {
  return adminFetch('/minio/sync-database', { method: 'POST' });
}

export async function deleteMinioObject(key) {
  return adminFetch('/minio/delete-object', {
    method: 'POST',
    body: JSON.stringify({ key }),
  });
}


// ─── Users / Account Management ───────────────────────────────────────────────

export async function fetchUsers({ accountType, search, page = 1, pageSize = 50 } = {}) {
  const p = new URLSearchParams({ page, page_size: pageSize });
  if (accountType) p.set('account_type', accountType);
  if (search)      p.set('search', search);
  return adminFetch(`/users?${p}`);
}

export async function createUser(data) {
  return adminFetch('/users', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateUser(userId, data) {
  return adminFetch(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function toggleUserActive(userId) {
  return adminFetch(`/users/${userId}/toggle-active`, { method: 'PATCH' });
}

export async function resetUserPassword(userId, password = null) {
  return adminFetch(`/users/${userId}/reset-password`, {
    method: 'POST',
    body: JSON.stringify(password ? { password } : {}),
  });
}

export async function deleteUser(userId) {
  return adminFetch(`/users/${userId}`, { method: 'DELETE' });
}


