import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

// Shared error display used across every admin page — one place to change
// how a failed request reads, instead of a copy of the same div per page.
// Pass onRetry (usually the page's load()/loadAll()) to show a Retry button.
const ErrorBanner = ({ message, onDismiss, onRetry }) => {
  if (!message) return null;
  return (
    <div style={{
      padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
      borderRadius: '10px', color: '#dc2626', fontSize: '13px', display: 'flex', gap: '10px', alignItems: 'center',
    }}>
      <AlertCircle size={15} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(220,38,38,0.08)',
          border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', padding: '5px 10px',
          cursor: 'pointer', color: '#dc2626', fontSize: '11px', fontWeight: 700, flexShrink: 0,
        }}>
          <RefreshCw size={11} /> Retry
        </button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', flexShrink: 0, display: 'flex' }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
