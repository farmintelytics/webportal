import React, { useState, Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', background: '#0f172a', color: '#f87171', minHeight: '100vh' }}>
          <h2 style={{ color: '#fca5a5', marginBottom: 16 }}>Render Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{this.state.error?.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#94a3b8', marginTop: 12 }}>{this.state.error?.stack}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 20, padding: '8px 16px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import PortalHub from './pages/PortalHub';
import PortalLayout from './layouts/PortalLayout';

// === FFB Management ===
import FFBDashboard from './modules/management/ffb/Dashboard';

// === Crop Management Portals ===
import CashewDashboard from './modules/management/cashew/Dashboard';
import SugarcaneDashboard from './modules/management/sugarcane/Dashboard';
import RiceDashboard from './modules/management/rice/Dashboard';
import CocoaDashboard from './modules/management/cocoa/Dashboard';
import RubberDashboard from './modules/management/rubber/Dashboard';
import CassavaDashboard from './modules/management/cassava/Dashboard';
import MaizeDashboard from './modules/management/maize/Dashboard';

// === Field Advisory & Agronomy ===
import ClimateIntelligence from './modules/advisor/ClimateIntelligence';
import MonitoringPortal from './modules/monitoring/MonitoringPortal';
import SustainabilityPortal from './modules/sustainability/SustainabilityPortal';
import EstatePortal from './modules/sustainability/estate/EstatePortal';
import GroupsPortal from './modules/sustainability/groups/GroupsPortal';
import ForestryPortal from './modules/sustainability/forestry/ForestryPortal';
import EstimatorPortal from './modules/sustainability/estimator/EstimatorPortal';

// === Specialized Monitoring Apps ===
import RiceMonitoring from './modules/monitoring/rice/Monitoring';
import MaizeMonitoring from './modules/monitoring/maize/Monitoring';
import CocoaMonitoring from './modules/monitoring/cocoa/Monitoring';
import OilPalmMonitoring from './modules/monitoring/oil_palm/Monitoring';
import CassavaMonitoring from './modules/monitoring/cassava/Monitoring';
import SugarcaneMonitoring from './modules/monitoring/sugarcane/Monitoring';

// === Cooperative & Group Management ===
import GroupsDashboard from './modules/cooperative/Dashboard';

// === Finance & Payments ===
import FinanceDashboard from './modules/finance/Dashboard';

import AgroMonitor from './modules/agro-monitor/AgroMonitor';

// === Super Admin Portal ===
import AdminLogin from './farmintelytics-admin/AdminLogin';
import AdminPortal from './farmintelytics-admin/AdminPortal';

import { crops } from './constants/crops.jsx';
import { Zap } from 'lucide-react';

// Placeholder for modules in development
const ComingSoon = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-full p-20 text-center bg-white">
    <div className="w-20 h-20 rounded-[2.5rem] bg-black text-white flex items-center justify-center mx-auto mb-8 shadow-2xl">
      <Zap size={32} className="text-[var(--brand-primary)]" />
    </div>
    <h2 className="text-4xl font-black text-black mb-4 tracking-tighter uppercase">{title}</h2>
    <p className="text-black/60 font-bold max-w-md uppercase text-[11px] tracking-[0.2em]">{description}</p>
  </div>
);

// ─── Module name map ─────────────────────────────────────────────────────────
const MODULE_NAMES = {
  'rs-ffb':               'Oil Palm Monitoring',
  'rs-cashew':            'Cashew Monitoring',
  'rs-sugarcane':         'SugarCane Monitoring',
  'rs-rice':              'Rice Monitoring',
  'rs-cocoa':             'Cocoa Monitoring',
  'rs-rubber':            'Rubber Monitoring',
  'rs-cassava':           'Cassava Monitoring',
  'rs-maize':             'Maize Monitoring',
  'rs-drone':             'Drone Intelligence',
  'finance-hub':          'Central Finance Hub',
  'management-ffb':       'Oil Palm Management',
  'management-cashew':    'Cashew Management',
  'management-sugarcane': 'SugarCane Management',
  'management-rice':      'Rice Management',
  'management-cocoa':     'Cocoa Management',
  'management-rubber':    'Rubber Management',
  'management-cassava':   'Cassava Management',
  'management-maize':     'Maize Management',
  'group-management':     'Groups Management',
  'group-monitoring':     'Group Monitoring',
  'activity-ffb':         'Operations Logs',
  'advisor':              'Farm Advisor',
  'custom-agromonitor':   'Agro Monitoring',
  'custom-agromonitor-olam': 'Olam Agro Monitoring',
  'custom-agromonitor-okomu': 'Okomu Agro Monitoring',
};

// ─── Build-time access restriction ──────────────────────────────────────────
// If VITE_RESTRICT_TO_MODULE is set (e.g. in netlify.toml), the app bypasses
// the hub and locks users into that single module.
const RESTRICTED_MODULE = import.meta.env.VITE_RESTRICT_TO_MODULE || null;

// The URL path used for the restricted module's portal
const AGROMONITOR_PATH = '/farmintelytics-engine/agromonitoring';


// ─── Hub page ────────────────────────────────────────────────────────────────
const HubPage = () => {
  const navigate = useNavigate();

  const handleSelectModule = (moduleId) => {
    sessionStorage.setItem('fi_module', moduleId);
    navigate('/login');
  };

  return <PortalHub onSelectModule={handleSelectModule} />;
};


// ─── Login page ──────────────────────────────────────────────────────────────
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // In restricted mode the module is fixed; otherwise read from sessionStorage
  const moduleId = RESTRICTED_MODULE || sessionStorage.getItem('fi_module');
  const moduleName = MODULE_NAMES[moduleId] || moduleId;

  // Where does the portal land after login?
  const portalPath = (moduleId && moduleId.startsWith('custom-agromonitor'))
    ? AGROMONITOR_PATH
    : '/portal';

  const handleLogin = () => navigate(portalPath);
  const handleBack  = RESTRICTED_MODULE ? null : () => navigate('/');

  let defaultEmail = "";
  let defaultCode = "";
  if (moduleId === 'custom-agromonitor-olam') {
    defaultEmail = "olam@farmintelytics.com";
    defaultCode = "olam123";
  } else if (moduleId === 'custom-agromonitor-okomu') {
    defaultEmail = "okomu@farmintelytics.com";
    defaultCode = "okomu123";
  }

  return (
    <Login
      onLogin={handleLogin}
      moduleName={moduleName}
      onBack={handleBack}
      defaultEmail={defaultEmail}
      defaultCode={defaultCode}
    />
  );
};


// ─── Portal page (generic modules) ──────────────────────────────────────────
const PortalPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentCrop, setCurrentCrop]     = useState(crops[0]);

  const moduleId = sessionStorage.getItem('fi_module');

  const handleSignOut   = () => { navigate('/login'); setActiveSection('dashboard'); };
  const handleBackToHub = () => { navigate('/');     setActiveSection('dashboard'); };

  if (!moduleId) return <Navigate to="/" replace />;

  // ── resolve the component for this module ──
  const getContent = () => {
    // Remote-sensing monitoring portals
    if (moduleId.startsWith('rs-')) {
      const rsApps = {
        'rs-ffb':      <OilPalmMonitoring />,
        'rs-sugarcane':<SugarcaneMonitoring />,
        'rs-rice':     <RiceMonitoring />,
        'rs-cocoa':    <CocoaMonitoring />,
        'rs-cassava':  <CassavaMonitoring />,
        'rs-maize':    <MaizeMonitoring />,
      };
      if (rsApps[moduleId]) {
        return React.cloneElement(rsApps[moduleId], { onSignOut: handleSignOut, onBack: handleBackToHub });
      }
      const cropMap = { 'rs-cashew': 'Cashew', 'rs-rubber': 'Rubber', 'rs-drone': 'Drone Intelligence' };
      return <MonitoringPortal cropName={cropMap[moduleId] || 'Crop'} onSignOut={handleSignOut} onBack={handleBackToHub} />;
    }

    const routeMap = {
      'management-ffb':       <FFBDashboard activeSection={activeSection} />,
      'management-cashew':    <CashewDashboard activeSection={activeSection} />,
      'management-sugarcane': <SugarcaneDashboard activeSection={activeSection} />,
      'management-rice':      <RiceDashboard activeSection={activeSection} />,
      'management-cocoa':     <CocoaDashboard activeSection={activeSection} />,
      'management-rubber':    <RubberDashboard activeSection={activeSection} />,
      'management-cassava':   <CassavaDashboard activeSection={activeSection} />,
      'management-maize':     <MaizeDashboard activeSection={activeSection} />,

      'drone-ffb':    <ComingSoon title="Drone Inspection" description="Live drone feed and high-resolution field surveillance." />,
      'drone-cashew': <ComingSoon title="Orchard Survey" description="Tree count, canopy gap analysis and disease spot detection." />,

      'carbon-ffb':       <EstatePortal onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'carbon-groups':    <GroupsPortal onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'forestry-intel':   <ForestryPortal onSignOut={handleSignOut} onBack={handleBackToHub} />,
      'carbon-estimator': <EstimatorPortal onSignOut={handleSignOut} onBack={handleBackToHub} />,

      'finance-hub':  <FinanceDashboard onSignOut={handleSignOut} />,
      'activity-ffb': <ComingSoon title="Operations Log" description="Geo-referenced daily field logs — harvesting, planting, spraying." />,
      'advisor':      <ClimateIntelligence onSignOut={handleSignOut} onBack={handleBackToHub} />,

      'group-management': <GroupsDashboard mode="group-management" onSignOut={handleSignOut} />,
      'group-monitoring': <MonitoringPortal cropName="Smallholder" onSignOut={handleSignOut} onBack={handleBackToHub} />,
    };

    return routeMap[moduleId] || (
      <ComingSoon title={moduleId.replace(/-/g, ' ')} description="This module is under active development." />
    );
  };

  const content = getContent();

  // Standalone modules (full-screen, no PortalLayout sidebar)
  const standaloneModules = ['rs-', 'group-monitoring', 'carbon-', 'forestry-', 'advisor'];
  const isStandalone = standaloneModules.some(m => moduleId.startsWith(m) || moduleId === m);

  if (isStandalone || moduleId === 'group-management') {
    // Pass back/signout handlers if the component accepts them (RS portals already have them)
    try {
      return React.cloneElement(content, { onBack: handleBackToHub, onSignOut: handleSignOut });
    } catch {
      return content;
    }
  }

  return (
    <PortalLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      currentCrop={currentCrop}
      setCurrentCrop={setCurrentCrop}
      crops={crops}
      onBackToHub={handleBackToHub}
      onSignOut={handleSignOut}
    >
      {content}
    </PortalLayout>
  );
};


// ─── Agro Monitor page (dedicated URL) ──────────────────────────────────────
const AgroMonitorPage = () => {
  const navigate = useNavigate();

  // In restricted mode there is no hub to go back to
  const handleSignOut   = () => navigate('/login');
  const handleBackToHub = RESTRICTED_MODULE ? null : () => navigate('/');

  return <ErrorBoundary><AgroMonitor onSignOut={handleSignOut} onBack={handleBackToHub} /></ErrorBoundary>;
};


// ─── Root App ────────────────────────────────────────────────────────────────
const App = () => {
  // In restricted mode, always start at /login regardless of entered URL
  if (RESTRICTED_MODULE) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path={AGROMONITOR_PATH} element={<AgroMonitorPage />} />
        {/* Redirect everything else to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/"                       element={<HubPage />} />
      <Route path="/login"                  element={<LoginPage />} />
      <Route path="/portal"                 element={<PortalPage />} />
      <Route path={AGROMONITOR_PATH}        element={<AgroMonitorPage />} />
      <Route path="/admin/login"            element={<AdminLogin />} />
      <Route path="/admin/*"               element={<AdminPortal />} />
      {/* Catch-all: back to hub */}
      <Route path="*"                       element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
