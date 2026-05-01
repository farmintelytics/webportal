import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Eye, EyeOff, ChevronLeft } from 'lucide-react';

const MODULE_LABELS = {
  'management-ffb':      'FFB Management Console',
  'management-cashew':   'Cashew Hub Console',
  'management-sugarcane':'Cane Intelligence Console',
  'management-rice':     'Rice Monitor Console',
  'management-cocoa':    'Cocoa Core Console',
  'management-rubber':   'Rubber Hub Console',
  'management-cassava':  'Cassava Core Console',
  'management-maize':    'Maize Hub Console',
  'rs-ffb':              'Oil Palm · Remote Sensing',
  'rs-cashew':           'Cashew · Canopy Analysis',
  'rs-sugarcane':        'Cane · Growth Monitoring',
  'rs-rice':             'Paddy · Field Mapping',
  'drone-ffb':           'Oil Palm · Drone Monitoring',
  'drone-cashew':        'Cashew · Orchard Survey',
  'payments-ffb':        'FFB Payment System',
  'payments-multi':      'Multi-Crop Payment Hub',
  'activity-ffb':        'Farm Activity & Operations',
  'advisor':             'Farm Advisor Console',
};

const Login = ({ onLogin, moduleName, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const displayLabel = MODULE_LABELS[moduleName] || 'Intelligence Console';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { onLogin(); setLoading(false); }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#1B2A4A]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#2E7D32]/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[440px] z-10">
        {/* Back button */}
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1B2A4A] transition-colors mb-8 group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </button>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-[#1B2A4A]/5 border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/farmintelytics-logo.png" alt="FarmIntelytics" className="h-20 w-auto object-contain" />
          </div>

          <div className="text-center mb-8">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2E7D32] mb-2">Connecting to</div>
            <h1 className="text-[18px] font-black text-[#1B2A4A] tracking-tight">{displayLabel}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email Identity</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" />
                <input type="email" required placeholder="you@farmintelytics.com"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#2E7D32]/20 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-bold outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Access Code</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" />
                <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#2E7D32]/20 focus:bg-white rounded-2xl py-3.5 pl-11 pr-12 text-[13px] font-bold outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-200" />
                <span className="text-[11px] font-bold text-gray-500">Remember me</span>
              </label>
              <button type="button" className="text-[11px] font-black text-[#2E7D32] hover:underline">Forgot code?</button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#1B2A4A] hover:bg-[#0F1D36] text-white py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-[#1B2A4A]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 mt-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                : <><span>Connect to Ledger</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Unifying People · Land · Intelligence · Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
