import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--brand-primary)]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[var(--brand-secondary)]/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[480px] z-10">
        <div className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-[var(--brand-primary)] rounded-3xl flex items-center justify-center shadow-2xl shadow-[var(--brand-primary)]/30 mb-8 transform hover:scale-110 transition-transform duration-500">
             <ShieldCheck className="text-white w-10 h-10" />
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1">FarmIntelytics</h1>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Agricultural Intelligence Console</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email Identity</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--brand-primary)] transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@farmintelytics.com"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[var(--brand-primary)]/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-[14px] font-bold outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Access Code</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--brand-primary)] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[var(--brand-primary)]/20 focus:bg-white rounded-2xl py-4 pl-12 pr-12 text-[14px] font-bold outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border-2 border-gray-200 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] transition-all" />
                <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Remember identity</span>
              </label>
              <button type="button" className="text-[12px] font-bold text-[var(--brand-primary)] hover:underline">Forgot code?</button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white py-5 rounded-2xl text-[14px] font-black uppercase tracking-widest shadow-xl shadow-[var(--brand-primary)]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Connect to Ledger
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 w-full flex flex-col items-center gap-4">
             <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                <div className="text-[10px] font-black uppercase tracking-widest">Powered by</div>
                <div className="bg-[var(--brand-primary)] text-white text-[10px] font-black px-2 py-0.5 rounded">INTELYTICS ENGINE</div>
             </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-8 opacity-40">
           <button className="text-[11px] font-black uppercase tracking-widest hover:text-[var(--brand-primary)] transition-colors">Privacy</button>
           <button className="text-[11px] font-black uppercase tracking-widest hover:text-[var(--brand-primary)] transition-colors">Terms</button>
           <button className="text-[11px] font-black uppercase tracking-widest hover:text-[var(--brand-primary)] transition-colors">Audit Ledger</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
