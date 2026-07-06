import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2, Map, Key, Activity, LayoutDashboard, LogOut,
  ChevronRight, Shield, KanbanSquare, Menu, X, Layers,
  Clock, Settings, Database,
} from 'lucide-react';

import Organizations from './pages/Organizations';
import Farms from './pages/Farms';
import Boundaries from './pages/Boundaries';
import Credentials from './pages/Credentials';
import Logs from './pages/Logs';
import Tasks from './pages/Tasks';
import Scheduler from './pages/Scheduler';
import PipelineConfig from './pages/PipelineConfig';
import Inventory from './pages/Inventory';

const NAV_ITEMS = [
  { id: 'organizations', label: 'Organizations', icon: Building2, path: '/admin/organizations' },
  { id: 'farms',         label: 'Farm Registry',  icon: Layers,    path: '/admin/farms' },
  { id: 'boundaries',   label: 'Boundaries',      icon: Map,       path: '/admin/boundaries' },
  { id: 'inventory',    label: 'Data Sync & MinIO', icon: Database, path: '/admin/inventory' },
  { id: 'credentials',  label: 'Credentials',     icon: Key,       path: '/admin/credentials' },
  { id: 'scheduler',    label: 'Scheduler',       icon: Clock,     path: '/admin/scheduler' },
  { id: 'configs',      label: 'Configs Builder',  icon: Settings,  path: '/admin/configs' },
  { id: 'tasks',        label: 'Task Board',       icon: KanbanSquare, path: '/admin/tasks' },
  { id: 'logs',         label: 'Logs',             icon: Activity,  path: '/admin/logs' },
];

const AdminPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('fi_admin_token');
    if (!token) { navigate('/admin/login'); return; }
    setAdminEmail(localStorage.getItem('fi_admin_email') || 'superadmin');
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('fi_admin_token');
    localStorage.removeItem('fi_admin_email');
    navigate('/admin/login');
  };

  const activeId = NAV_ITEMS.find(n => location.pathname.startsWith(n.path))?.id || 'organizations';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: "'Roboto', sans-serif", overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarOpen ? '240px' : '64px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0, overflow: 'hidden',
        position: 'relative', zIndex: 20,
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? '20px 16px' : '20px 8px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', gap: '10px',
          overflow: 'hidden',
        }}>
          <img src="/farmintelytics-logo.png" alt="Logo" style={{ height: '36px', width: 'auto', flexShrink: 0 }} />
          {sidebarOpen && (
            <div>
              <div style={{ color: '#0f172a', fontSize: '13px', fontWeight: 900, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>FarmIntelytics</div>
              <div style={{ color: '#16a34a', fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin Console</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(item => {
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: sidebarOpen ? '10px 12px' : '10px',
                  borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(22,163,74,0.1)' : 'transparent',
                  color: active ? '#16a34a' : '#475569',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = active ? 'rgba(22,163,74,0.1)' : 'transparent'; e.currentTarget.style.color = active ? '#16a34a' : '#475569'; }}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={17} style={{ flexShrink: 0 }} />
                {sidebarOpen && (
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                )}
                {sidebarOpen && active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </nav>

        {/* User / Sign-out */}
        <div style={{
          padding: '12px 8px',
          borderTop: '1px solid #e2e8f0',
        }}>
          {sidebarOpen && (
            <div style={{
              padding: '10px 12px', marginBottom: '4px',
              borderRadius: '10px', background: '#f8fafc',
            }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Logged in as</div>
              <div style={{ fontSize: '12px', color: '#334155', fontWeight: 600, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminEmail}</div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: sidebarOpen ? '10px 12px' : '10px',
              borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'transparent', color: '#ef4444',
              width: '100%', transition: 'all 0.15s',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={17} />
            {sidebarOpen && <span style={{ fontSize: '13px', fontWeight: 600 }}>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute', top: '24px', right: '-12px',
            width: '24px', height: '24px', borderRadius: '50%',
            background: '#ffffff', border: '1px solid #cbd5e1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748b', zIndex: 30,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = '#16a34a'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#ffffff'; }}
        >
          {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          height: '56px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {NAV_ITEMS.find(n => n.id === activeId) && (() => {
              const item = NAV_ITEMS.find(n => n.id === activeId);
              return (
                <>
                  <item.icon size={15} color="#16a34a" />
                  <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700 }}>{item.label}</span>
                </>
              );
            })()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#16a34a', boxShadow: '0 0 8px rgba(22,163,74,0.4)',
            }} />
            <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              System Online
            </span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto', background: '#f8fafc' }}>
          <Routes>
            <Route index element={<Navigate to="organizations" replace />} />
            <Route path="organizations" element={<Organizations />} />
            <Route path="farms"         element={<Farms />} />
            <Route path="boundaries"    element={<Boundaries />} />
            <Route path="inventory"     element={<Inventory />} />
            <Route path="credentials"   element={<Credentials />} />
            <Route path="scheduler"     element={<Scheduler />} />
            <Route path="configs"       element={<PipelineConfig />} />
            <Route path="tasks"         element={<Tasks />} />
            <Route path="logs"          element={<Logs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
