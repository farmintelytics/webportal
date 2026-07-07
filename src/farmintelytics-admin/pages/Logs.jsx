import React, { useState, useEffect, useRef } from 'react';
import { Activity, RefreshCw, X, AlertCircle, Filter, ChevronDown } from 'lucide-react';
import { fetchLogs, fetchPipelineLogs } from '../../services/adminApi';

const STATUS_STYLES = {
  pending:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)' },
  processing: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)' },
  completed:  { color: '#16a34a', bg: 'rgba(22,163,74,0.1)',   border: 'rgba(22,163,74,0.2)'  },
  failed:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)'  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span style={{
      fontSize: '10px', fontWeight: 800, padding: '2px 9px',
      borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em',
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
    }}>{status}</span>
  );
};

const Logs = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const autoRefreshRef = useRef(null);

  const loadJobs = async () => {
    try {
      const data = await fetchLogs({ status: statusFilter || undefined, page });
      setJobs(data.items);
      setTotal(data.total);
    } catch (e) { setError(e.message); }
  };

  const loadPipeline = async () => {
    try {
      const data = await fetchPipelineLogs();
      setPipelineLogs(data.logs || []);
    } catch (e) { setError(e.message); }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadJobs(), loadPipeline()]);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, [statusFilter, page]);

  // Auto-refresh every 30s
  useEffect(() => {
    autoRefreshRef.current = setInterval(loadAll, 30000);
    return () => clearInterval(autoRefreshRef.current);
  }, [statusFilter, page]);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 800, margin: 0 }}>Logs</h2>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, margin: '4px 0 0' }}>Pipeline job history and MinIO execution metadata</p>
        </div>
        <button onClick={loadAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#334155', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
          <RefreshCw size={13} />Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
        {['jobs', 'pipeline'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === tab ? 'rgba(22,163,74,0.12)' : 'transparent',
            color: activeTab === tab ? '#16a34a' : '#6b7280',
            fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'capitalize',
            transition: 'all 0.15s',
          }}>
            {tab === 'jobs' ? 'Pipeline Jobs' : 'MinIO Metadata'}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertCircle size={14} />{error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}><X size={14} /></button>
        </div>
      )}

      {activeTab === 'jobs' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#1e293b', fontSize: '13px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
              {total.toLocaleString()} total jobs
            </span>
          </div>

          {/* Table */}
          <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px 100px 140px 100px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#ffffff' }}>
              {['ID', 'Plot', 'Sensor', 'Status', 'Start', 'Completed', 'Error'].map(h => (
                <span key={h} style={{ fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading…</div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>No jobs found</div>
            ) : (
              <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                {jobs.map(job => (
                  <div key={job.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px 100px 140px 100px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>#{job.id}</span>
                    <span style={{ color: '#1e293b', fontSize: '12px' }}>{job.plot_id ? `Plot #${job.plot_id}` : '—'}</span>
                    <span style={{ color: '#334155', fontSize: '11px', fontFamily: 'monospace' }}>{job.sensor || '—'}</span>
                    <StatusBadge status={job.status} />
                    <span style={{ color: '#475569', fontSize: '11px' }}>{job.start_date || '—'}</span>
                    <span style={{ color: '#475569', fontSize: '11px' }}>{job.completed_at ? new Date(job.completed_at).toLocaleString() : '—'}</span>
                    <span style={{ color: '#ef4444', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={job.error}>{job.error ? '✗ Error' : '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: '6px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', cursor: page <= 1 ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 700, opacity: page <= 1 ? 0.5 : 1 }}>← Prev</button>
            <span style={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}>Page {page} of {Math.ceil(total / 50) || 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={jobs.length < 50} style={{ padding: '6px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', cursor: jobs.length < 50 ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 700, opacity: jobs.length < 50 ? 0.5 : 1 }}>Next →</button>
          </div>
        </>
      )}

      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading…</div>
          ) : pipelineLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
              <Activity size={32} color="#1f2937" style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>No pipeline metadata found in MinIO</p>
            </div>
          ) : (
            pipelineLogs.map((log, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#334155', fontSize: '11px', fontFamily: 'monospace' }}>{log._minio_path}</span>
                  {log.status && <StatusBadge status={log.status} />}
                </div>
                <pre style={{ color: '#475569', fontSize: '11px', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '200px', overflowY: 'auto' }}>
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Logs;
