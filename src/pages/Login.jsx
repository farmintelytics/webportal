import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck, Globe, Zap, CreditCard, Landmark, Coins, Plane, Radar, Satellite, Users, Layers, UserCheck, Grid } from 'lucide-react';
import { login, fetchCropMonitoringConfig } from '../services/organizationMonitorApi';

const Login = ({ onLogin, moduleName, onBack, defaultEmail = '', defaultCode = '' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [accessCode, setAccessCode] = useState(defaultCode);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setEmail(defaultEmail);
    setAccessCode(defaultCode);
  }, [defaultEmail, defaultCode]);

  const displayName = moduleName?.toUpperCase() || 'AGRICULTURAL';
  const isFinance = moduleName?.toLowerCase().includes('finance') || moduleName?.toLowerCase().includes('payment');
  const isMonitoring = moduleName?.toLowerCase().includes('monitoring') || moduleName?.toLowerCase().includes('rs');
  const isDrone = moduleName?.toLowerCase().includes('drone');
  const isCooperative = moduleName?.toLowerCase().includes('cooperative') || moduleName?.toLowerCase().includes('ngo') || moduleName?.toLowerCase().includes('government') || moduleName?.toLowerCase().includes('group');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(email, accessCode);
      if (response.status === 'success' && response.token && response.tenant) {
        localStorage.setItem('fi_token', response.token);
        localStorage.setItem('fi_email', response.email);
        localStorage.setItem('fi_tenant', response.tenant);
        localStorage.setItem('fi_role', response.role || 'admin');
        if (response.full_name) localStorage.setItem('fi_full_name', response.full_name);
        else localStorage.removeItem('fi_full_name');
        // Pull the organization's config (display name, licensed modules) so
        // the portal shows exactly what this company's account allows.
        try {
          const config = await fetchCropMonitoringConfig();
          if (config?.display_name) localStorage.setItem('fi_display_name', config.display_name);
          if (Array.isArray(config?.modules)) localStorage.setItem('fi_allowed_modules', JSON.stringify(config.modules));
          if (Array.isArray(config?.allowed_crops)) localStorage.setItem('fi_allowed_crops', JSON.stringify(config.allowed_crops));
          if (Array.isArray(config?.map_center)) localStorage.setItem('fi_map_center', JSON.stringify(config.map_center));
        } catch (_) {
          localStorage.removeItem('fi_display_name');
          localStorage.removeItem('fi_allowed_modules');
          localStorage.removeItem('fi_allowed_crops');
          localStorage.removeItem('fi_map_center');
        }
        onLogin();
      } else {
        setError(response.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Server error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const getBrandingContent = () => {
    if (isFinance) {
      return {
        title: <>Automating <span className="text-[var(--brand-primary)]">Enterprise Liquidity.</span></>,
        desc: 'Direct disbursement, immutable financial reconciliation, and automated payroll systems integrated with your farm ledger.',
        features: [
          { icon: <Landmark size={20} />, text: 'Multi-Bank Settlement Layer' },
          { icon: <ShieldCheck size={20} />, text: 'Immutable Audit Ledger' },
          { icon: <Coins size={20} />, text: 'Automated Worker Disbursement' }
        ],
        btn: 'Continue to Ledger'
      };
    }
    if (isMonitoring || isDrone) {
      return {
        title: <>Advanced <span className="text-[var(--brand-primary)]">Remote Intelligence.</span></>,
        desc: "Fusion of multispectral satellite imagery, radar sensors, and drone flight telemetry for 24/7 high-precision field surveillance.",
        features: [
          { icon: <Satellite size={20} />, text: 'Sentinel-2 Multispectral Fusion' },
          { icon: <Plane size={20} />, text: 'Drone Surveillance Telemetry' },
          { icon: <Radar size={20} />, text: 'SAR Cloud-Penetrating Radar' }
        ],
        btn: 'Login'
      };
    }
    if (isCooperative) {
      return {
        title: <>Empowering <span className="text-[var(--brand-primary)]">Farmer Communities.</span></>,
        desc: 'Profile and manage smallholder farmers across cooperatives, NGOs, and government programs. Track multi-crop portfolios, plot boundaries, and group compliance from a single unified registry.',
        features: [
          { icon: <Users size={20} />, text: 'Farmer Profiling & Registration' },
          { icon: <Layers size={20} />, text: 'Multi-Crop Portfolio Tracking' },
          { icon: <UserCheck size={20} />, text: 'Group Compliance & Audit' }
        ],
        btn: 'Open Registry'
      };
    }
    return {
      title: <>Securing the future of <span className="text-[var(--brand-primary)]">Precision Agriculture.</span></>,
      desc: "Access your enterprise farm ledger, monitor real-time crop performance, and manage your workforce with the world's most advanced agricultural intelligence system.",
      features: [
        { icon: <ShieldCheck size={20} />, text: 'Immutable Ledger Verification' },
        { icon: <Globe size={20} />, text: 'Real-time Remote Sensing' },
        { icon: <Zap size={20} />, text: 'Predictive Yield Analytics' }
      ],
      btn: 'Sign In'
    };
  };

  const content = getBrandingContent();

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side: Brand & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-20 flex-col justify-between relative overflow-hidden border-r border-gray-100">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--brand-primary)]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--brand-primary)]/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-20">
            <img src="/farmintelytics-logo.png" alt="Logo" className="h-16 w-auto" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-black leading-none">FarmIntelytics</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-primary)] mt-1">Intelligence Layer</p>
            </div>
          </div>

          <div className="max-w-md">
            <h3 className="text-5xl font-black text-black tracking-tighter leading-tight mb-8">
              {content.title}
            </h3>
            <p className="text-lg text-black/60 font-medium leading-relaxed mb-12">
              {content.desc}
            </p>

            <div className="space-y-6">
              {content.features.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-black/80 font-bold text-sm">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-[var(--brand-primary)] shadow-sm">
                    {item.icon}
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            © 2026 FarmIntelytics Systems.
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-[420px]">
          {onBack && (
            <button 
              onClick={onBack} 
              className="flex items-center gap-3 bg-gray-50 text-gray-500 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 hover:text-gray-900 transition-all border border-black/5 mb-12 shadow-sm"
            >
              <Grid size={16} /> Back to Hub
            </button>
          )}

          <div className="lg:hidden mb-12 flex justify-center">
            <img src="/farmintelytics-logo.png" alt="Logo" className="h-20 w-auto" />
          </div>

          <div className="mb-12">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Sign In</h1>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--brand-primary)]">{displayName} Access Console</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-650 rounded-2xl text-xs font-bold shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email Identity</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--brand-primary)] transition-colors" />
                <input type="email" required placeholder="admin@farmintelytics.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-black/5 focus:border-[var(--brand-primary)] focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-[14px] font-bold outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Access Code</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--brand-primary)] transition-colors" />
                <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                  value={accessCode} onChange={e => setAccessCode(e.target.value)}
                  className="w-full bg-gray-50 border border-black/5 focus:border-[var(--brand-primary)] focus:bg-white rounded-2xl py-4 pl-12 pr-12 text-[14px] font-bold outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border border-gray-200 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] transition-all" />
                <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Remember device</span>
              </label>
              <button type="button" className="text-[12px] font-bold text-[var(--brand-primary)] hover:underline">Request access link</button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white py-5 rounded-2xl text-[14px] font-black uppercase tracking-widest shadow-xl shadow-[var(--brand-primary)]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                : <><span>{content.btn}</span><ArrowRight size={18} /></>
              }
            </button>
          </form>

          <div className="mt-24 pt-8 border-t border-gray-50 w-full flex flex-col items-center">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Powered by Farmintelytics</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
