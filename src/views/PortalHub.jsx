import React, { useState } from 'react';
import {
  Sprout, Globe, Satellite, Plane, CreditCard, BookOpen,
  ClipboardList, Users, Fingerprint, BarChart3, Truck,
  ShieldCheck, Zap, ArrowRight, ChevronRight, Play,
  MessageSquare, MapPin, Bell
} from 'lucide-react';

/* ─── Crop image map (Unsplash CDN) ─── */
const CROP_IMAGES = {
  'oil-palm':   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
  'cashew':     'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80&fit=crop',
  'sugarcane':  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80&fit=crop',
  'rice':       'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&q=80&fit=crop',
  'cocoa':      'https://images.unsplash.com/photo-1606312618951-3be4e63f6c67?w=600&q=80&fit=crop',
  'rubber':     'https://images.unsplash.com/photo-1536147116438-62679a5e01f2?w=600&q=80&fit=crop',
  'cassava':    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80&fit=crop',
  'maize':      'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80&fit=crop',
  'satellite':  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80&fit=crop',
  'drone':      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&q=80&fit=crop',
  'payment':    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&fit=crop',
  'activity':   'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80&fit=crop',
  'advisor':    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80&fit=crop',
};

/* ─── Section header ─── */
const SectionHeader = ({ label, title, description }) => (
  <div className="mb-10">
    <div className="inline-flex items-center gap-2 bg-[#1B2A4A]/5 border border-[#1B2A4A]/10 rounded-full px-4 py-1.5 mb-4">
      <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B2A4A]">{label}</span>
    </div>
    <h2 className="text-3xl font-black text-[#1B2A4A] tracking-tight mb-2">{title}</h2>
    {description && <p className="text-sm text-gray-500 font-medium max-w-2xl">{description}</p>}
  </div>
);

/* ─── Management card with crop photo ─── */
const ManagementCard = ({ id, title, crop, imgKey, bullets, active, onSelect }) => (
  <button
    onClick={() => active && onSelect(id)}
    className={`group text-left rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col h-full ${
      active
        ? 'bg-white border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1'
        : 'bg-gray-50 border-gray-100 grayscale opacity-50 cursor-not-allowed'
    }`}
  >
    {/* Photo */}
    <div className="relative h-48 overflow-hidden shrink-0">
      <img
        src={CROP_IMAGES[imgKey]}
        alt={crop}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="absolute bottom-4 left-4">
        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60 mb-0.5">{crop}</div>
        <div className="text-white font-black text-lg leading-tight">{title}</div>
      </div>
      {active && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={14} className="text-white" />
        </div>
      )}
    </div>
    {/* Body */}
    <div className="p-5 flex-1 flex flex-col">
      <ul className="space-y-2 flex-1">
        {bullets.map(b => (
          <li key={b} className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#2E7D32] mt-2 shrink-0"></div>
            <span className="text-[11px] text-gray-500 font-medium leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
      <div className={`mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-[#2E7D32]' : 'text-gray-300'}`}>
        {active ? <><span>Launch Console</span><ChevronRight size={12} /></> : <span>Coming Soon</span>}
      </div>
    </div>
  </button>
);

/* ─── Wide card for specialty modules ─── */
const WideCard = ({ id, icon, title, description, bullets, imgKey, accentColor, active, onSelect }) => (
  <button
    onClick={() => active && onSelect(id)}
    className={`group text-left rounded-3xl overflow-hidden border transition-all duration-500 ${
      active
        ? 'bg-white border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1'
        : 'bg-gray-50 border-gray-100 grayscale opacity-50 cursor-not-allowed'
    }`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
      <div className="p-8 flex flex-col justify-between">
        <div>
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 ${accentColor}`}>
            {icon}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{description}</div>
          <h3 className="text-2xl font-black text-[#1B2A4A] tracking-tight mb-5">{title}</h3>
          <ul className="space-y-2">
            {bullets.map(b => (
              <li key={b} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#2E7D32] mt-2 shrink-0"></div>
                <span className="text-[11px] text-gray-500 font-medium leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-[#2E7D32]' : 'text-gray-300'}`}>
          {active ? <><span>Launch Module</span><ArrowRight size={12} /></> : <span>In Development</span>}
        </div>
      </div>
      <div className="relative h-56 md:h-auto overflow-hidden">
        <img
          src={CROP_IMAGES[imgKey]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 md:from-transparent to-transparent"></div>
      </div>
    </div>
  </button>
);

/* ─── Main Hub ─── */
const PortalHub = ({ onSelectModule }) => {
  const mgmt = [
    {
      id: 'management-ffb', title: 'FFB Management', crop: 'Oil Palm', imgKey: 'oil-palm', active: true,
      bullets: ['AI bunch counting & weight estimation', 'Harvesting clerk & loading reconciliation', 'Mill dispatch & loose fruit tracking'],
    },
    {
      id: 'management-cashew', title: 'Cashew Hub', crop: 'Cashew', imgKey: 'cashew', active: true,
      bullets: ['Out-Turn Ratio (OTR) tracking', 'W180–W320 kernel grade analytics', 'Farm-to-export traceability ledger'],
    },
    {
      id: 'management-sugarcane', title: 'Cane Console', crop: 'SugarCane', imgKey: 'sugarcane', active: true,
      bullets: ['CCS content & harvest window tracking', 'Fleet logistics & transport cycle time', 'Crushing rate & factory efficiency (TCD)'],
    },
    {
      id: 'management-rice', title: 'Rice Monitor', crop: 'Rice', imgKey: 'rice', active: true,
      bullets: ['Head Rice Yield & milling quality index', 'Moisture monitoring at harvest & drying', 'Paddy variety performance tracking'],
    },
    {
      id: 'management-cocoa', title: 'Cocoa Core', crop: 'Cocoa', imgKey: 'cocoa', active: true,
      bullets: ['Live fermentation temperature & pH', 'Fermentation Index & drying moisture', 'Export grade distribution & defect rates'],
    },
    {
      id: 'management-rubber', title: 'Rubber Hub', crop: 'Rubber', imgKey: 'rubber', active: false,
      bullets: ['Latex yield & tapping schedule management', 'DRC (Dry Rubber Content) tracking', 'Block-level productivity analytics'],
    },
    {
      id: 'management-cassava', title: 'Cassava Core', crop: 'Cassava', imgKey: 'cassava', active: false,
      bullets: ['Starch content & harvest maturity', 'Processing yield tracking', 'Plot-level productivity monitoring'],
    },
    {
      id: 'management-maize', title: 'Maize Hub', crop: 'Maize', imgKey: 'maize', active: false,
      bullets: ['Shelling & milling efficiency tracking', 'Grain moisture & post-harvest drying', 'Seasonal yield comparison analytics'],
    },
  ];

  const remoteSensing = [
    {
      id: 'rs-ffb', title: 'Oil Palm Yield Prediction', description: 'Remote Sensing · Oil Palm',
      imgKey: 'satellite', accentColor: 'bg-blue-50 text-blue-600', active: true,
      icon: <Satellite size={22} />,
      bullets: ['NDVI, EVI & SAR vegetation indices', 'GeoAI models for land classification & change detection', 'Soil moisture estimation, weather tracking', 'Land use, boundary & encroachment monitoring'],
    },
    {
      id: 'rs-cashew', title: 'Cashew Canopy Analysis', description: 'Remote Sensing · Cashew',
      imgKey: 'satellite', accentColor: 'bg-indigo-50 text-indigo-600', active: true,
      icon: <Globe size={22} />,
      bullets: ['Canopy cover density mapping', 'Stress detection via multispectral bands', 'Seasonal canopy change timeline', 'Block-level health index (NDVI threshold alerts)'],
    },
    {
      id: 'rs-sugarcane', title: 'Cane Growth Monitoring', description: 'Remote Sensing · SugarCane',
      imgKey: 'satellite', accentColor: 'bg-green-50 text-green-600', active: false,
      icon: <Satellite size={22} />,
      bullets: ['CCS estimation from SAR imagery', 'Crop growth stage classification', 'Harvest readiness prediction (EVI-based)', 'Field boundary & encroachment alerts'],
    },
    {
      id: 'rs-rice', title: 'Paddy Field Mapping', description: 'Remote Sensing · Rice',
      imgKey: 'satellite', accentColor: 'bg-yellow-50 text-yellow-600', active: false,
      icon: <Globe size={22} />,
      bullets: ['Paddy flood & irrigation mapping (SAR)', 'Crop vigor & stress index tracking', 'Harvest date prediction from satellite phenology', 'Yield forecast ±10% accuracy'],
    },
  ];

  const drones = [
    {
      id: 'drone-ffb', title: 'Oil Palm Drone Inspection', description: 'Drone Monitoring · Oil Palm',
      imgKey: 'drone', accentColor: 'bg-sky-50 text-sky-600', active: false,
      icon: <Plane size={22} />,
      bullets: ['Live drone feed integration', 'Field inspection & surveillance', 'High-resolution crop analysis', 'Precision agriculture support'],
    },
    {
      id: 'drone-cashew', title: 'Cashew Orchard Survey', description: 'Drone Monitoring · Cashew',
      imgKey: 'drone', accentColor: 'bg-cyan-50 text-cyan-600', active: false,
      icon: <Plane size={22} />,
      bullets: ['Tree count & canopy gap analysis', 'Orchard health heatmaps', 'Disease spot detection via RGB/multispectral', 'Damage assessment reporting'],
    },
  ];

  const payments = [
    {
      id: 'payments-ffb', title: 'FFB Payment System', description: 'Payments · Oil Palm',
      imgKey: 'payment', accentColor: 'bg-emerald-50 text-emerald-600', active: false,
      icon: <CreditCard size={22} />,
      bullets: ['Digital payments to harvesters & contractors', 'Payroll auto-generated from verified work logs', 'Wallet + bank & mobile money integration', 'Input financing & deduction tracking'],
    },
    {
      id: 'payments-multi', title: 'Multi-Crop Payment Hub', description: 'Payments · All Crops',
      imgKey: 'payment', accentColor: 'bg-teal-50 text-teal-600', active: false,
      icon: <CreditCard size={22} />,
      bullets: ['Cross-crop worker payment management', 'Farmer purchase price disbursement', 'Cooperative & outgrower payment programs', 'Full audit trail & compliance reports'],
    },
  ];

  const operations = [
    {
      id: 'activity-ffb', title: 'Farm Activity & Operations', description: 'Field Operations · All Crops',
      imgKey: 'activity', accentColor: 'bg-orange-50 text-orange-600', active: false,
      icon: <ClipboardList size={22} />,
      bullets: ['Daily logs: harvesting, planting, spraying', 'Time-stamped, geo-referenced field records', 'Input usage tracking per block', 'Operations history per plot'],
    },
    {
      id: 'advisor', title: 'Farm Advisor', description: 'Farmer Support · Advisory',
      imgKey: 'advisor', accentColor: 'bg-lime-50 text-lime-700', active: false,
      icon: <MessageSquare size={22} />,
      bullets: ['Location-aware newsletters per farmer', 'SMS alerts on weather, pests & programs', 'Crop-stage reminders auto-tuned', 'Activates the moment a farmer is enrolled'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-y-auto">

      {/* ── HERO NAV ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-100 px-8 lg:px-16 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/farmintelytics-logo.png" alt="FarmIntelytics" className="h-10 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-black text-[#1B2A4A] leading-none">Intelligence Platform</div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Production v4.2.0</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1B2A4A]/5 border border-[#1B2A4A]/10 flex items-center justify-center">
            <Users size={18} className="text-[#1B2A4A]" />
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4A] via-[#1B2A4A] to-[#0F4C44] px-8 lg:px-16 py-24 lg:py-36">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
          </div>
        </div>

        <div className="relative max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Verified · Monitored · Connected</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              Operational<br/>
              <span className="text-[#4CAF50]">Intelligence</span><br/>
              Hub.
            </h1>
            <p className="text-lg text-white/60 font-medium leading-relaxed max-w-lg mb-10">
              The unified launcher for precision agriculture. Connect to crop-specific intelligence consoles — from FFB harvest tracking to satellite canopy analysis.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[12px] text-white/40 font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                5 management portals live
              </div>
              <div className="flex items-center gap-2 text-[12px] text-white/40 font-bold">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                2 remote sensing modules live
              </div>
            </div>
          </div>

          {/* Crop image grid decoration */}
          <div className="hidden lg:grid grid-cols-3 gap-3 h-80">
            {['oil-palm', 'satellite', 'cashew', 'drone', 'rice', 'cocoa'].map((key, i) => (
              <div key={key} className={`rounded-2xl overflow-hidden ${i === 1 || i === 4 ? 'row-span-1' : ''}`} style={{ opacity: 0.7 + (i % 3) * 0.1 }}>
                <img src={CROP_IMAGES[key]} alt={key} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-20 space-y-28">

        {/* MANAGEMENT SOLUTIONS */}
        <section>
          <SectionHeader
            label="01 · Management Solutions"
            title="Crop Operations Management"
            description="Full-stack operational dashboards for each commodity. Worker tracking, harvest verification, quality grading, and field-level visibility — all connected to one identity ledger."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mgmt.map(m => <ManagementCard key={m.id} {...m} onSelect={onSelectModule} />)}
          </div>
        </section>

        {/* REMOTE SENSING */}
        <section>
          <SectionHeader
            label="02 · Remote Sensing & GeoAI"
            title="Satellite Intelligence"
            description="NDVI, EVI & SAR vegetation indices via Sentinel-2 and Landsat. GeoAI land classification, soil moisture estimation and encroachment change detection — delivered as interactive dashboards per crop."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {remoteSensing.map(m => <WideCard key={m.id} {...m} onSelect={onSelectModule} />)}
          </div>
        </section>

        {/* DRONE MONITORING */}
        <section>
          <SectionHeader
            label="03 · Drone Monitoring"
            title="Aerial Field Intelligence"
            description="Live drone feed integration and high-resolution precision agriculture. Field inspection, surveillance and crop analysis from the air."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {drones.map(m => <WideCard key={m.id} {...m} onSelect={onSelectModule} />)}
          </div>
        </section>

        {/* PAYMENTS */}
        <section>
          <SectionHeader
            label="04 · Payments & Financial System"
            title="Digital Farm Finance"
            description="Automated payroll tied to verified field logs. Digital wallets, mobile money integration and full audit-ready disbursement records."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {payments.map(m => <WideCard key={m.id} {...m} onSelect={onSelectModule} />)}
          </div>
        </section>

        {/* OPERATIONS & ADVISORY */}
        <section>
          <SectionHeader
            label="05 · Field Operations & Advisory"
            title="Activity Logs & Farmer Support"
            description="Geo-referenced daily field logs and an intelligent advisory layer that pushes alerts, crop reminders and weather advisories to enrolled farmers."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {operations.map(m => <WideCard key={m.id} {...m} onSelect={onSelectModule} />)}
          </div>
        </section>

      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1B2A4A] px-8 lg:px-16 py-12">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src="/farmintelytics-logo.png" alt="FarmIntelytics" className="h-10 w-auto object-contain brightness-0 invert opacity-80" />
          </div>
          <div className="text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
              Unifying People · Land · Intelligence · Value
            </div>
          </div>
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            © 2026 FarmIntelytics · v4.2.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortalHub;
