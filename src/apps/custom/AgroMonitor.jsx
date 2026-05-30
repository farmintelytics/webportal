import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Globe, 
  Layers, 
  Satellite, 
  Map as MapIcon, 
  Activity, 
  Zap, 
  Droplets, 
  Sun, 
  Trees, 
  ArrowLeft,
  LogOut,
  CheckCircle2,
  BarChart4,
  TrendingUp,
  LayoutDashboard,
  Calendar as CalendarIcon,
  Maximize2,
  Search,
  Filter,
  Shield,
  User,
  Bell,
  X,
  Info,
  Navigation,
  RefreshCw,
  FileText,
  History,
  Settings2,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  MapPin,
  LineChart,
  Waves,
  Thermometer,
  CloudRain,
  Leaf,
  MessageSquare,
  Sparkles,
  Send,
  Database,
  CheckSquare,
  Lock,
  Download,
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  UserPlus,
  Plus,
  Check,
  FileSpreadsheet,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Flame,
  Radio,
  Target,
  Gauge,
  ListFilter
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, Polygon, Popup, useMap, Pane } from 'react-leaflet';
const ResizeMap = ({ trigger }) => {
  const map = useMap();
  useEffect(() => {
    const timer1 = setTimeout(() => map.invalidateSize(), 100);
    const timer2 = setTimeout(() => map.invalidateSize(), 200);
    const timer3 = setTimeout(() => map.invalidateSize(), 350);
    const timer4 = setTimeout(() => map.invalidateSize(), 500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [trigger, map]);
  return null;
};

const MapPaneClipSetter = ({ leftPaneName, rightPaneName, splitPosition, isCompareMode }) => {
  const map = useMap();
  useEffect(() => {
    const updateClips = () => {
      const leftPane = map.getPane(leftPaneName);
      const rightPane = map.getPane(rightPaneName);
      
      if (!isCompareMode) {
        if (leftPane) leftPane.style.clipPath = 'none';
        if (rightPane) rightPane.style.clipPath = 'none';
        return;
      }
      
      if (leftPane) {
        leftPane.style.clipPath = `inset(0 ${100 - splitPosition}% 0 0)`;
      }
      if (rightPane) {
        rightPane.style.clipPath = `inset(0 0 0 ${splitPosition}%)`;
      }
    };

    updateClips();
    const t = setTimeout(updateClips, 50);
    return () => clearTimeout(t);
  }, [map, leftPaneName, rightPaneName, splitPosition, isCompareMode]);
  return null;
};

const SwipeSliderOverlay = ({ isCompareMode, splitPosition, currentTimelineA, currentTimelineB, handleSplitDragStart }) => {
  if (!isCompareMode) return null;
  return (
    <>
      {/* Split Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${splitPosition}%`, zIndex: 30000 }}
      />
      
      {/* Drag Handle */}
      <div
        onMouseDown={handleSplitDragStart}
        onTouchStart={handleSplitDragStart}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-green-600 shadow-2xl flex items-center justify-center cursor-ew-resize select-none transition-transform hover:scale-110 active:scale-95"
        style={{ left: `${splitPosition}%`, zIndex: 30001 }}
      >
        <span className="text-green-600 font-extrabold text-lg select-none">↔</span>
      </div>

      {/* Floating Date Badges */}
      {/* Left Badge: Date A (Green) */}
      <div
        className="absolute top-4 bg-white/90 backdrop-blur-sm border-l-4 border-green-600 px-3 py-1.5 rounded-r-xl shadow-lg flex flex-col pointer-events-none animate-in slide-in-from-left duration-205"
        style={{ left: '172px', zIndex: 20000 }}
      >
        <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Date A (Left)</span>
        <span className="text-xs font-extrabold text-gray-800">{currentTimelineA?.label}</span>
      </div>

      {/* Right Badge: Date B (Blue) */}
      <div
        className="absolute top-4 bg-white/90 backdrop-blur-sm border-r-4 border-blue-600 px-3 py-1.5 rounded-l-xl shadow-lg flex flex-col pointer-events-none text-right animate-in slide-in-from-right duration-205"
        style={{ right: '152px', zIndex: 20000 }}
      >
        <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Date B (Right)</span>
        <span className="text-xs font-extrabold text-gray-800">{currentTimelineB?.label}</span>
      </div>
    </>
  );
};
import 'leaflet/dist/leaflet.css';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  ChartLegend,
  Filler
);

// TIMELINE_DATA has been moved inside the AgroMonitor component for dynamic month/year calculations.

// ── Default Farm Plots Coordinates ────────────────────────────────────────
const PLOT_ALPHA_COORDS = [[7.145, 3.355],[7.150, 3.355],[7.150, 3.360],[7.145, 3.360]];
const PLOT_BETA_COORDS  = [[7.145, 3.362],[7.150, 3.362],[7.150, 3.367],[7.145, 3.367]];
const PLOT_GAMMA_COORDS = [[7.138, 3.355],[7.143, 3.355],[7.143, 3.360],[7.138, 3.360]];

// ── Land Restoration Zones Coordinates ─────────────────────────────────────
const RESTORE_ZONE_A_COORDS = [[7.141, 3.350],[7.144, 3.350],[7.144, 3.354],[7.141, 3.354]];
const RESTORE_ZONE_B_COORDS = [[7.141, 3.356],[7.144, 3.356],[7.144, 3.361],[7.141, 3.361]];
const RESTORE_ZONE_C_COORDS = [[7.135, 3.350],[7.139, 3.350],[7.139, 3.355],[7.135, 3.355]];

const RESTORATION_ZONES = [
  { id: 'ZONE-ALPHA', name: 'Canopy Reforestation', area: '6.4 HA', type: 'Canopy Density', progress: 88, survival: '94%', trees: '1,200', carbon: '45.2 tCO2e', status: 'Optimal Growth', color: '#16A34A', coords: RESTORE_ZONE_A_COORDS, manager: 'John Musa' },
  { id: 'ZONE-BETA',  name: 'Agroforestry Zone', area: '5.8 HA', type: 'Species Diversification', progress: 74, survival: '89%', trees: '980',   carbon: '32.8 tCO2e', status: 'Active Care',   color: '#EAB308', coords: RESTORE_ZONE_B_COORDS, manager: 'Alice Peters' },
  { id: 'ZONE-GAMMA', name: 'Riparian Buffer Zone',  area: '8.1 HA', type: 'Soil Stabilization', progress: 62, survival: '81%', trees: '1,550', carbon: '21.5 tCO2e', status: 'Initial Phase', color: '#0284C7', coords: RESTORE_ZONE_C_COORDS, manager: 'David Kalu' }
];

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── Index Classification Helper (5 Classes) ──────────────────────────────
const getIndexFiveClasses = (val, type) => {
  if (type === 'NDVI' || type === 'CVI' || type === 'EVI' || type === 'Chlorophyll') {
    if (val > 0.8)  return { color: '#14532D', label: 'Exceptional (0.8+)' };
    if (val > 0.7)  return { color: '#16A34A', label: 'Optimal (0.7–0.8)' };
    if (val > 0.55) return { color: '#86EFAC', label: 'Moderate (0.55–0.7)' };
    if (val > 0.45) return { color: '#EAB308', label: 'Transition (0.45–0.55)' };
    return { color: '#EF4444', label: 'Deficit (<=0.45)' };
  }
  if (type === 'NDMI' || type === 'LSWI' || type === 'WDI' || type === 'WaterStress' || type === 'Water') {
    if (val > 0.5)  return { color: '#1E3A8A', label: 'Waterlogged (>0.5)' };
    if (val > 0.42) return { color: '#2563EB', label: 'Adequate (0.42–0.5)' };
    if (val > 0.35) return { color: '#60A5FA', label: 'Moderate (0.35–0.42)' };
    if (val > 0.28) return { color: '#F59E0B', label: 'Mild Stress (0.28–0.35)' };
    return { color: '#DC2626', label: 'Severe Stress (<=0.28)' };
  }
  return { color: '#64748B', label: 'N/A' };
};

// ── Shared chart defaults ─────────────────────────────────────────────────
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { size: 11, weight: '600' }, padding: 16, usePointStyle: true }
    }
  },
  scales: {
    y: {
      grid: { color: 'rgba(0,0,0,0.04)', borderDash: [4, 4] },
      ticks: { font: { size: 11 } }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } }
    }
  }
};

const BAR_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      grid: { color: 'rgba(0,0,0,0.04)', borderDash: [4, 4] },
      ticks: { font: { size: 10, weight: '600' }, stepSize: 1 }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10, weight: '600' } }
    }
  }
};

const AgroMonitor = ({ onBack, onSignOut }) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('monitor');
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(2);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareTimelineIndex, setCompareTimelineIndex] = useState(3);
  const [activeDateSlot, setActiveDateSlot] = useState('A');
  const [splitPosition, setSplitPosition] = useState(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  // Handle Split Dragging
  const handleSplitDragStart = (e) => {
    e.preventDefault();
    setIsDraggingSplit(true);
  };

  useEffect(() => {
    if (!isDraggingSplit) return;

    const handleMove = (e) => {
      const mapContainer = document.querySelector('.map-wrapper-pane');
      if (!mapContainer) return;

      const rect = mapContainer.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const relativeX = clientX - rect.left;
      let percentage = (relativeX / rect.width) * 100;
      
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      
      setSplitPosition(percentage);
    };

    const handleDragEnd = () => {
      setIsDraggingSplit(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDraggingSplit]);

  const [selectedBasemap, setSelectedBasemap] = useState('sentinel-2');
  const [selectedIndex, setSelectedIndex] = useState('CVI');
  const [mapOpacity, setMapOpacity] = useState(80);
  const [selectedPlot, setSelectedPlot] = useState(null);

  const [showBasemapDropdown, setShowBasemapDropdown] = useState(false);
  const basemapDropdownRef = useRef(null);

  // Close basemap dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (basemapDropdownRef.current && !basemapDropdownRef.current.contains(e.target)) {
        setShowBasemapDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const FloatingBasemapSelector = () => {
    const BASEMAPS = [
      { id: 'sentinel-2',    label: 'Sentinel-2',      sub: '10m Optical · ESA',  emoji: '🛰️' },
      { id: 'landsat-8',     label: 'Landsat-8',       sub: '30m Thermal · USGS', emoji: '🌍' },
      { id: 'google-hybrid', label: 'Google Satellite', sub: 'High-Res Basemap',   emoji: '🗺️' }
    ];
    const activeBasemapObj = BASEMAPS.find(b => b.id === selectedBasemap) || BASEMAPS[0];

    return (
      <div className="absolute top-4 left-4" style={{ zIndex: 40000 }} ref={basemapDropdownRef}>
        <button
          onClick={() => setShowBasemapDropdown(!showBasemapDropdown)}
          className="bg-white border border-gray-200 px-3.5 py-2.5 rounded-2xl shadow-xl hover:bg-gray-50 flex items-center gap-2.5 font-bold text-xs text-gray-705 transition-all active:scale-95"
        >
          <span className="text-sm">{activeBasemapObj.emoji}</span>
          <span className="truncate max-w-[100px]">{activeBasemapObj.label}</span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${showBasemapDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showBasemapDropdown && (
          <div className="absolute left-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-1.5 space-y-1">
              {BASEMAPS.map(src => (
                <button
                  key={src.id}
                  onClick={() => { setSelectedBasemap(src.id); setShowBasemapDropdown(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                    selectedBasemap === src.id ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-sm shrink-0">{src.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate leading-tight">{src.label}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">{src.sub}</div>
                  </div>
                  {selectedBasemap === src.id && <CheckCircle2 size={11} className="text-green-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Reports state
  const [reportPlot, setReportPlot] = useState('PLOT-ALPHA');
  const [reportIndex, setReportIndex] = useState('NDVI');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportProgressText, setReportProgressText] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);

  // Verification state
  const [selectedVerifyPlot, setSelectedVerifyPlot] = useState('PLOT-ALPHA');
  const [verificationSteps, setVerificationSteps] = useState({
    boundary: { label: 'Boundary Integrity Check', status: 'idle', details: 'Verifying polygon shape match with cadastral registry' },
    forest:   { label: 'Deforestation Compliance Check', status: 'idle', details: 'Scanning for canopy loss anomalies' },
    cover:    { label: 'Canopy Density Standard', status: 'idle', details: 'Measuring active photosynthetic activity coverage' },
    moisture: { label: 'Soil Water Index Target', status: 'idle', details: 'Assessing root-zone moisture anomalies' }
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle');

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: "Hello! I am your Agro Monitoring Assistant. Ask me anything about crop indices, spatial variations, or time-series moisture anomalies." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Map play / calendar / user menu
  const [isPlaying, setIsPlaying]       = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(4); // May
  const [calendarYear,  setCalendarYear]  = useState(2026);
  const [showUserMenu,  setShowUserMenu]  = useState(false);
  const userMenuRef = useRef(null);

  // Dashboard filter states
  const [filterEstate, setFilterEstate] = useState('All');
  const [filterPlot, setFilterPlot] = useState('All');
  const [filterDate, setFilterDate] = useState('All');

  // Land Restoration states
  const [selectedRestoreZone, setSelectedRestoreZone] = useState(RESTORATION_ZONES[0]);
  const [restoreIndex, setRestoreIndex] = useState('progress');
  const [restoreMapOpacity, setRestoreMapOpacity] = useState(85);

  // Crop Yield states
  const [selectedYieldIndex, setSelectedYieldIndex] = useState('Yield');
  const [yieldMapOpacity, setYieldMapOpacity] = useState(80);
  const [selectedYieldPlot, setSelectedYieldPlot] = useState(null);

  // Crop Health states
  const [selectedHealthIndex, setSelectedHealthIndex] = useState('NDVI');
  const [healthMapOpacity, setHealthMapOpacity] = useState(80);
  const [selectedHealthPlot, setSelectedHealthPlot] = useState(null);

  // Climate map states
  const [selectedClimateIndex, setSelectedClimateIndex] = useState('Rainfall');
  const [climateMapOpacity, setClimateMapOpacity] = useState(80);
  const [selectedClimatePlot, setSelectedClimatePlot] = useState(null);

  // Intelligence Layers map layers states
  const [intelShowLayers, setIntelShowLayers] = useState(true);
  const [intelShowBoundaries, setIntelShowBoundaries] = useState(true);
  const [intelBoundariesOpacity, setIntelBoundariesOpacity] = useState(100);
  const [intelShowGrowth, setIntelShowGrowth] = useState(true);
  const [intelGrowthOpacity, setIntelGrowthOpacity] = useState(70);
  const [intelShowEvi, setIntelShowEvi] = useState(false);
  const [intelEviOpacity, setIntelEviOpacity] = useState(60);
  const [intelShowLswi, setIntelShowLswi] = useState(false);
  const [intelLswiOpacity, setIntelLswiOpacity] = useState(60);
  const [intelShowVhi, setIntelShowVhi] = useState(false);
  const [intelVhiOpacity, setIntelVhiOpacity] = useState(60);
  const [intelShowSuitability, setIntelShowSuitability] = useState(false);
  const [intelSuitabilityOpacity, setIntelSuitabilityOpacity] = useState(60);

  // Left sidebar Tools states
  const [showCalendarTool, setShowCalendarTool] = useState(true);
  const [showTimeSliderTool, setShowTimeSliderTool] = useState(true);

  // Alerts data state
  const [alerts, setAlerts] = useState([
    { id: 'ALT-2026-001', estate: 'East Ridge Estate', plot: 'PLOT-BETA', category: 'Water Stress', severity: 'Critical', desc: 'LSWI moisture index dropped below 0.30 target. Root-zone dry spell requires immediate +30% irrigation flow.', date: 'May 29, 2026', time: '14:22', status: 'Active' },
    { id: 'ALT-2026-002', estate: 'East Ridge Estate', plot: 'PLOT-BETA', category: 'Pest Infestation', severity: 'Critical', desc: 'Stem borer outbreak warning near East Ridge boundary. Recommended insecticide spray buffer zone of 150m.', date: 'May 28, 2026', time: '09:45', status: 'Active' },
    { id: 'ALT-2026-003', estate: 'South Slope Estate', plot: 'PLOT-GAMMA', category: 'Growth Deficit', severity: 'Warning', desc: 'NDVI vegetation vigor index showing abnormal 3-week plateau during Grand Growth phase.', date: 'May 26, 2026', time: '11:15', status: 'Active' },
    { id: 'ALT-2026-004', estate: 'West Valley Estate', plot: 'PLOT-ALPHA', category: 'Cloud Cover', severity: 'Info', desc: 'Sentinel-2 imagery shows 12% localized cloud cover. Index computations adjusted.', date: 'May 22, 2026', time: '16:05', status: 'Acknowledged' }
  ]);

  // Settings and User Management States
  const [settingsUsers, setSettingsUsers] = useState([
    { id: 1, name: 'AM Manager', email: 'am.manager@farmintelytics.io', role: 'Spatial Auditor', status: 'Active', avatar: 'AM' },
    { id: 2, name: 'Dr. Sarah Jenkins', email: 's.jenkins@farmintelytics.io', role: 'GIS Specialist', status: 'Active', avatar: 'SJ' },
    { id: 3, name: 'Kabiru Bello', email: 'k.bello@farmintelytics.io', role: 'Field Operations', status: 'Active', avatar: 'KB' },
    { id: 4, name: 'Carlos Gomez', email: 'c.gomez@farmintelytics.io', role: 'Surveyor Team Lead', status: 'Offline', avatar: 'CG' }
  ]);
  const [ndviThreshold, setNdviThreshold] = useState(0.50);
  const [ndmiThreshold, setNdmiThreshold] = useState(0.35);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [showConfigSaved, setShowConfigSaved] = useState(false);
  const [showSupportSubmitted, setShowSupportSubmitted] = useState(false);

  // User Management Invite Form States
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('GIS Specialist');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Configuration API Keys States
  const [sentinelApiKey, setSentinelApiKey] = useState('s2_live_aud_851k3d99xl1a');
  const [planetApiKey, setPlanetApiKey] = useState('pl_key_prod_9022xkd8317a');
  const [showSentinelKey, setShowSentinelKey] = useState(false);
  const [showPlanetKey, setShowPlanetKey] = useState(false);

  // Help Topics States
  const [activeHelpTopic, setActiveHelpTopic] = useState(null);
  const [ticketCategory, setTicketCategory] = useState('General Query');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [filterAlertSeverity, setFilterAlertSeverity] = useState('All');
  const [filterAlertStatus, setFilterAlertStatus] = useState('Active');

  // Crop Health map layers states
  const [healthShowLayers, setHealthShowLayers] = useState(true);
  const [healthShowBoundaries, setHealthShowBoundaries] = useState(true);
  const [healthBoundariesOpacity, setHealthBoundariesOpacity] = useState(100);
  const [healthShowNdvi, setHealthShowNdvi] = useState(true);
  const [healthNdviOpacity, setHealthNdviOpacity] = useState(80);
  const [healthShowChlorophyll, setHealthShowChlorophyll] = useState(false);
  const [healthChlorophyllOpacity, setHealthChlorophyllOpacity] = useState(70);
  const [healthShowWater, setHealthShowWater] = useState(false);
  const [healthWaterOpacity, setHealthWaterOpacity] = useState(70);
  const [healthShowPest, setHealthShowPest] = useState(false);
  const [healthPestOpacity, setHealthPestOpacity] = useState(70);

  // New Settings Center states
  const [profileName, setProfileName] = useState('AM Manager');
  const [profileEmail, setProfileEmail] = useState('am.manager@farmintelytics.io');
  const [profileRole, setProfileRole] = useState('Spatial Auditor');
  const [defaultLat, setDefaultLat] = useState(7.145);
  const [defaultLng, setDefaultLng] = useState(3.355);
  const [defaultMapZoom, setDefaultMapZoom] = useState(14);
  const [glassmorphismEnabled, setGlassmorphismEnabled] = useState(true);
  const [showProfileSaved, setShowProfileSaved] = useState(false);

  const [telemetryLogs, setTelemetryLogs] = useState([
    '[SUCCESS] GIS Engine initialized at 2026-05-30T16:00:00Z',
    '[SUCCESS] Sentinel-2 API connected. RTT: 124ms',
    '[SUCCESS] Planet Labs RTT check: 89ms',
    '[SUCCESS] Local tiles cache pre-warmed. 14.8 MB cached'
  ]);
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [isCheckingSystem, setIsCheckingSystem] = useState(false);

  const [exportFormat, setExportFormat] = useState('GeoJSON');
  const [exportPlotTarget, setExportPlotTarget] = useState('ALL');
  const [exportIncludeBoundaries, setExportIncludeBoundaries] = useState(true);
  const [exportIncludeIndices, setExportIncludeIndices] = useState(true);
  const [isExportingData, setIsExportingData] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportProgressText, setExportProgressText] = useState('');
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    { id: 'EXP-2026-104', format: 'GeoJSON', scope: 'All Plots & Zones', size: '2.4 MB', date: 'May 28, 2026', status: 'Completed' },
    { id: 'EXP-2026-103', format: 'CSV', scope: 'West Valley Plot (PLOT-ALPHA)', size: '480 KB', date: 'May 26, 2026', status: 'Completed' }
  ]);

  const cardStyle = glassmorphismEnabled ? 'glass shadow-premium border border-white/20' : 'bg-white border border-gray-100 shadow-sm';

  const getHealthPlotStyle = (plot) => {
    const showStroke = healthShowBoundaries;
    const strokeColor = '#15803d';
    const strokeOpacity = healthBoundariesOpacity / 100;
    
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (healthShowPest) {
      const risk = plot.pestRisk;
      fillColor = risk === 'High Risk' ? '#ef4444' : risk === 'Moderate Risk' ? '#f97316' : '#16a34a';
      fillOpacity = healthPestOpacity / 100;
    } else if (healthShowWater) {
      fillColor = getIndexFiveClasses(plot.waterStress, 'NDMI').color;
      fillOpacity = healthWaterOpacity / 100;
    } else if (healthShowChlorophyll) {
      fillColor = getIndexFiveClasses(plot.chlorophyll, 'NDVI').color;
      fillOpacity = healthChlorophyllOpacity / 100;
    } else if (healthShowNdvi) {
      fillColor = getIndexFiveClasses(plot.ndvi, 'NDVI').color;
      fillOpacity = healthNdviOpacity / 100;
    }
    
    return {
      color: showStroke ? strokeColor : 'transparent',
      weight: showStroke ? 2.5 : 0,
      opacity: strokeOpacity,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  };

  // Crop Yield map layers states
  const [yieldShowLayers, setYieldShowLayers] = useState(true);
  const [yieldShowBoundaries, setYieldShowBoundaries] = useState(true);
  const [yieldBoundariesOpacity, setYieldBoundariesOpacity] = useState(100);
  const [yieldShowYield, setYieldShowYield] = useState(true);
  const [yieldYieldOpacity, setYieldYieldOpacity] = useState(80);
  const [yieldShowBiomass, setYieldShowBiomass] = useState(false);
  const [yieldBiomassOpacity, setYieldBiomassOpacity] = useState(70);
  const [yieldShowReadiness, setYieldShowReadiness] = useState(false);
  const [yieldReadinessOpacity, setYieldReadinessOpacity] = useState(70);
  const [yieldShowGrowth, setYieldShowGrowth] = useState(false);
  const [yieldGrowthOpacity, setYieldGrowthOpacity] = useState(70);

  const getYieldPlotStyle = (plot) => {
    const showStroke = yieldShowBoundaries;
    const strokeColor = '#15803d';
    const strokeOpacity = yieldBoundariesOpacity / 100;
    
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (yieldShowReadiness) {
      const val = plot.readiness;
      fillColor = val > 85 ? '#16a34a' : val > 65 ? '#eab308' : '#f97316';
      fillOpacity = yieldReadinessOpacity / 100;
    } else if (yieldShowGrowth) {
      const val = plot.growth;
      fillColor = val > 0.7 ? '#15803d' : val > 0.55 ? '#22c55e' : val > 0.4 ? '#eab308' : '#ef4444';
      fillOpacity = yieldGrowthOpacity / 100;
    } else if (yieldShowBiomass) {
      const val = plot.biomass;
      fillColor = val > 2.0 ? '#15803d' : val > 1.3 ? '#22c55e' : val > 0.8 ? '#eab308' : '#ef4444';
      fillOpacity = yieldBiomassOpacity / 100;
    } else if (yieldShowYield) {
      const val = plot.yieldValue;
      fillColor = val > 18 ? '#15803d' : val > 12 ? '#22c55e' : val > 8 ? '#eab308' : '#ef4444';
      fillOpacity = yieldYieldOpacity / 100;
    }
    
    return {
      color: showStroke ? strokeColor : 'transparent',
      weight: showStroke ? 2.5 : 0,
      opacity: strokeOpacity,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  };

  // Climate map layers states
  const [climateShowLayers, setClimateShowLayers] = useState(true);
  const [climateShowBoundaries, setClimateShowBoundaries] = useState(true);
  const [climateBoundariesOpacity, setClimateBoundariesOpacity] = useState(100);
  const [climateShowRainfall, setClimateShowRainfall] = useState(true);
  const [climateRainfallOpacity, setClimateRainfallOpacity] = useState(80);
  const [climateShowSoilTemp, setClimateShowSoilTemp] = useState(false);
  const [climateSoilTempOpacity, setClimateSoilTempOpacity] = useState(70);
  const [climateShowLst, setClimateShowLst] = useState(false);
  const [climateLstOpacity, setClimateLstOpacity] = useState(70);
  const [climateShowVaporDeficit, setClimateShowVaporDeficit] = useState(false);
  const [climateVaporDeficitOpacity, setClimateVaporDeficitOpacity] = useState(70);

  const getClimatePlotStyle = (plot) => {
    const showStroke = climateShowBoundaries;
    const strokeColor = '#15803d';
    const strokeOpacity = climateBoundariesOpacity / 100;
    
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (climateShowVaporDeficit) {
      const val = plot.vpd;
      fillColor = val > 2.2 ? '#ef4444' : val > 1.5 ? '#f97316' : '#10b981';
      fillOpacity = climateVaporDeficitOpacity / 100;
    } else if (climateShowLst) {
      const val = plot.lst;
      fillColor = val > 36 ? '#b91c1c' : val > 30 ? '#ef4444' : val > 25 ? '#f97316' : '#10b981';
      fillOpacity = climateLstOpacity / 100;
    } else if (climateShowSoilTemp) {
      const val = plot.soilTemp;
      fillColor = val > 29 ? '#ef4444' : val > 25 ? '#f97316' : '#10b981';
      fillOpacity = climateSoilTempOpacity / 100;
    } else if (climateShowRainfall) {
      const val = plot.rainfall;
      fillColor = val > 25 ? '#1d4ed8' : val > 18 ? '#3b82f6' : '#93c5fd';
      fillOpacity = climateRainfallOpacity / 100;
    }
    
    return {
      color: showStroke ? strokeColor : 'transparent',
      weight: showStroke ? 2.5 : 0,
      opacity: strokeOpacity,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  };

  // Land Restoration map layers states
  const [restoreShowLayers, setRestoreShowLayers] = useState(true);
  const [restoreShowBoundaries, setRestoreShowBoundaries] = useState(true);
  const [restoreBoundariesOpacity, setRestoreBoundariesOpacity] = useState(100);
  const [restoreShowProgress, setRestoreShowProgress] = useState(true);
  const [restoreProgressOpacity, setRestoreProgressOpacity] = useState(85);
  const [restoreShowSurvival, setRestoreShowSurvival] = useState(false);
  const [restoreSurvivalOpacity, setRestoreSurvivalOpacity] = useState(70);
  const [restoreShowCarbon, setRestoreShowCarbon] = useState(false);
  const [restoreCarbonOpacity, setRestoreCarbonOpacity] = useState(70);
  const [restoreShowBiodiversity, setRestoreShowBiodiversity] = useState(false);
  const [restoreBiodiversityOpacity, setRestoreBiodiversityOpacity] = useState(70);

  // Layer mutual exclusivity helpers for each page
  const handleIntelToggle = (layer) => {
    setIntelShowGrowth(layer === 'growth' ? !intelShowGrowth : false);
    setIntelShowEvi(layer === 'evi' ? !intelShowEvi : false);
    setIntelShowLswi(layer === 'lswi' ? !intelShowLswi : false);
    setIntelShowVhi(layer === 'vhi' ? !intelShowVhi : false);
    setIntelShowSuitability(layer === 'suitability' ? !intelShowSuitability : false);
  };

  const handleHealthToggle = (layer) => {
    setHealthShowNdvi(layer === 'ndvi' ? !healthShowNdvi : false);
    setHealthShowChlorophyll(layer === 'chlorophyll' ? !healthShowChlorophyll : false);
    setHealthShowWater(layer === 'water' ? !healthShowWater : false);
    setHealthShowPest(layer === 'pest' ? !healthShowPest : false);
  };

  const handleYieldToggle = (layer) => {
    setYieldShowYield(layer === 'yield' ? !yieldShowYield : false);
    setYieldShowBiomass(layer === 'biomass' ? !yieldShowBiomass : false);
    setYieldShowReadiness(layer === 'readiness' ? !yieldShowReadiness : false);
    setYieldShowGrowth(layer === 'growth' ? !yieldShowGrowth : false);
  };

  const handleClimateToggle = (layer) => {
    setClimateShowRainfall(layer === 'rainfall' ? !climateShowRainfall : false);
    setClimateShowSoilTemp(layer === 'soilTemp' ? !climateShowSoilTemp : false);
    setClimateShowLst(layer === 'lst' ? !climateShowLst : false);
    setClimateShowVaporDeficit(layer === 'vpd' ? !climateShowVaporDeficit : false);
  };

  const handleRestoreToggle = (layer) => {
    setRestoreShowProgress(layer === 'progress' ? !restoreShowProgress : false);
    setRestoreShowSurvival(layer === 'survival' ? !restoreShowSurvival : false);
    setRestoreShowCarbon(layer === 'carbon' ? !restoreShowCarbon : false);
    setRestoreShowBiodiversity(layer === 'biodiversity' ? !restoreShowBiodiversity : false);
  };

  const getRestorePlotStyle = (zone) => {
    const showStroke = restoreShowBoundaries;
    const strokeColor = '#15803d';
    const strokeOpacity = restoreBoundariesOpacity / 100;
    
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (restoreShowBiodiversity) {
      const val = zone.id === 'ZONE-ALPHA' ? 92 : zone.id === 'ZONE-BETA' ? 84 : 76;
      fillColor = val > 90 ? '#15803d' : val > 80 ? '#22c55e' : '#eab308';
      fillOpacity = restoreBiodiversityOpacity / 100;
    } else if (restoreShowCarbon) {
      const val = zone.carbon;
      fillColor = val > 40 ? '#15803d' : val > 30 ? '#22c55e' : '#eab308';
      fillOpacity = restoreCarbonOpacity / 100;
    } else if (restoreShowSurvival) {
      const val = zone.survivalNum;
      fillColor = val > 90 ? '#15803d' : val > 85 ? '#22c55e' : '#eab308';
      fillOpacity = restoreSurvivalOpacity / 100;
    } else if (restoreShowProgress) {
      const val = zone.progress;
      fillColor = val > 85 ? '#15803d' : val > 70 ? '#22c55e' : val > 55 ? '#eab308' : '#ef4444';
      fillOpacity = restoreProgressOpacity / 100;
    }
    
    return {
      color: showStroke ? strokeColor : 'transparent',
      weight: showStroke ? 2.5 : 0,
      opacity: strokeOpacity,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  };

  const getIntelPlotStyle = (plot) => {
    const showStroke = intelShowBoundaries;
    const strokeColor = '#15803d'; // block boundary color matching key
    const strokeOpacity = intelBoundariesOpacity / 100;
    
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (intelShowSuitability) {
      fillColor = (plot.id === 'PLOT-BETA') ? '#dc2626' : '#16a34a';
      fillOpacity = intelSuitabilityOpacity / 100;
    } else if (intelShowVhi) {
      fillColor = getIndexFiveClasses(plot.ndvi, 'NDVI').color;
      fillOpacity = intelVhiOpacity / 100;
    } else if (intelShowLswi) {
      fillColor = getIndexFiveClasses(plot.ndmi, 'LSWI').color;
      fillOpacity = intelLswiOpacity / 100;
    } else if (intelShowEvi) {
      fillColor = getIndexFiveClasses(plot.ndvi * 0.95, 'EVI').color;
      fillOpacity = intelEviOpacity / 100;
    } else if (intelShowGrowth) {
      fillColor = (plot.id === 'PLOT-ALPHA') ? '#15803d' : (plot.id === 'PLOT-BETA') ? '#86efac' : '#fbbf24';
      fillOpacity = intelGrowthOpacity / 100;
    }
    
    return {
      color: showStroke ? strokeColor : 'transparent',
      weight: showStroke ? 2.5 : 0,
      opacity: strokeOpacity,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  };

  const handleEstateChange = (val) => {
    setFilterEstate(val);
    if (val === 'West Valley Estate' && filterPlot !== 'PLOT-ALPHA') setFilterPlot('PLOT-ALPHA');
    else if (val === 'East Ridge Estate' && filterPlot !== 'PLOT-BETA') setFilterPlot('PLOT-BETA');
    else if (val === 'South Slope Estate' && filterPlot !== 'PLOT-GAMMA') setFilterPlot('PLOT-GAMMA');
    else if (val === 'All') setFilterPlot('All');
  };

  const handlePlotChange = (val) => {
    setFilterPlot(val);
    if (val === 'PLOT-ALPHA') setFilterEstate('West Valley Estate');
    else if (val === 'PLOT-BETA') setFilterEstate('East Ridge Estate');
    else if (val === 'PLOT-GAMMA') setFilterEstate('South Slope Estate');
    else if (val === 'All') setFilterEstate('All');
  };

  const handleSidebarClick = (item) => {
    setActiveSidebarItem(item);
    if (item === 'dashboard') setActiveTab('monitor');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveSidebarItem('dashboard');
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setShowProfileSaved(true);
    setTimeout(() => setShowProfileSaved(false), 3000);
  };

  const handleFlushCache = () => {
    setIsFlushingCache(true);
    setTelemetryLogs(prev => [...prev, '[WARN] Flushing local GIS cache tiles...', '[SUCCESS] GIS cache flushed. 0 bytes remaining.']);
    setTimeout(() => {
      setIsFlushingCache(false);
    }, 1500);
  };

  const handleSystemCheck = () => {
    setIsCheckingSystem(true);
    setTelemetryLogs(prev => [...prev, '[INFO] Initiating telemetry ping to Sentinel-2...', '[INFO] Querying Planet Labs APIs...', '[SUCCESS] Connection secure. All services operational.']);
    setTimeout(() => {
      setIsCheckingSystem(false);
    }, 2000);
  };

  const handleExportData = () => {
    setIsExportingData(true);
    setExportProgress(0);
    setExportProgressText('Preparing vector coordinates...');
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setExportProgress(currentProgress);
      if (currentProgress === 40) {
        setExportProgressText('Retrieving historical indices...');
      } else if (currentProgress === 80) {
        setExportProgressText('Packaging into zip archive...');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setIsExportingData(false);
        setShowExportSuccess(true);
        const newExportId = `EXP-2026-${Math.floor(Math.random() * 900) + 100}`;
        setExportHistory(prev => [
          {
            id: newExportId,
            format: exportFormat,
            scope: exportPlotTarget === 'ALL' ? 'All Plots & Zones' : `${exportPlotTarget === 'PLOT-ALPHA' ? 'West Valley Plot' : exportPlotTarget === 'PLOT-BETA' ? 'East Ridge Plot' : 'South Slope Plot'} (${exportPlotTarget})`,
            size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Completed'
          },
          ...prev
        ]);
        setTimeout(() => setShowExportSuccess(false), 4000);
      }
    }, 600);
  };

  const TIMELINE_DATA = useMemo(() => {
    const year = calendarYear;
    const month = calendarMonth;
    const passes = [];
    const days = [1, 8, 15, 22, 29];
    
    days.forEach((day, idx) => {
      const date = new Date(year, month, day);
      if (date.getMonth() === month) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const label = `${MONTH_NAMES[month]} ${day}, ${year}`;
        const satellite = idx % 2 === 0 ? 'Sentinel-2' : 'Landsat-8';
        const quality = idx === 2 ? '100% Cloud Free' : `${99 - idx * 3}% Cloud Free`;
        
        // Dynamic simulated vegetative and moisture indices
        const baseNdvi = 0.62 + Math.sin((month + idx) * 0.45) * 0.12;
        const baseNdmi = 0.40 + Math.cos((month + idx) * 0.45) * 0.08;
        
        passes.push({
          date: dateStr,
          label,
          satellite,
          quality,
          ndvi: parseFloat(baseNdvi.toFixed(2)),
          ndmi: parseFloat(baseNdmi.toFixed(2)),
          color: idx === 2 ? '#14532D' : '#16A34A',
          plotsHealth: {
            alpha: baseNdvi > 0.7 ? '#15803d' : '#22c55e',
            beta: baseNdvi < 0.6 ? '#ef4444' : '#eab308',
            gamma: '#eab308'
          }
        });
      }
    });
    
    return passes;
  }, [calendarMonth, calendarYear]);

  const clampedTimelineIndex = Math.min(selectedTimelineIndex, TIMELINE_DATA.length - 1);
  const currentTimelineA = TIMELINE_DATA[clampedTimelineIndex >= 0 ? clampedTimelineIndex : 0];

  const clampedCompareTimelineIndex = Math.min(compareTimelineIndex, TIMELINE_DATA.length - 1);
  const currentTimelineB = TIMELINE_DATA[clampedCompareTimelineIndex >= 0 ? clampedCompareTimelineIndex : 0];

  const currentTimeline = currentTimelineA;

  const plotsDataA = useMemo(() => {
    const health = currentTimelineA.plotsHealth;
    return [
      { id: 'PLOT-ALPHA', name: 'West Valley Plot',   area: '12.5 HA', health: 'Optimal',  ndvi: currentTimelineA.ndvi + 0.04, ndmi: currentTimelineA.ndmi + 0.02, color: health.alpha, coords: PLOT_ALPHA_COORDS },
      { id: 'PLOT-BETA',  name: 'East Ridge Plot',   area: '8.2 HA',  health: currentTimelineA.ndvi < 0.65 ? 'Stressed' : 'Good', ndvi: currentTimelineA.ndvi - 0.15, ndmi: currentTimelineA.ndmi - 0.10, color: health.beta, coords: PLOT_BETA_COORDS },
      { id: 'PLOT-GAMMA', name: 'South Slope Plot', area: '15.0 HA', health: 'Moderate', ndvi: currentTimelineA.ndvi - 0.05, ndmi: currentTimelineA.ndmi - 0.04, color: health.gamma, coords: PLOT_GAMMA_COORDS }
    ];
  }, [currentTimelineA]);

  const plotsDataB = useMemo(() => {
    const health = currentTimelineB.plotsHealth;
    return [
      { id: 'PLOT-ALPHA', name: 'West Valley Plot',   area: '12.5 HA', health: 'Optimal',  ndvi: currentTimelineB.ndvi + 0.04, ndmi: currentTimelineB.ndmi + 0.02, color: health.alpha, coords: PLOT_ALPHA_COORDS },
      { id: 'PLOT-BETA',  name: 'East Ridge Plot',   area: '8.2 HA',  health: currentTimelineB.ndvi < 0.65 ? 'Stressed' : 'Good', ndvi: currentTimelineB.ndvi - 0.15, ndmi: currentTimelineB.ndmi - 0.10, color: health.beta, coords: PLOT_BETA_COORDS },
      { id: 'PLOT-GAMMA', name: 'South Slope Plot', area: '15.0 HA', health: 'Moderate', ndvi: currentTimelineB.ndvi - 0.05, ndmi: currentTimelineB.ndmi - 0.04, color: health.gamma, coords: PLOT_GAMMA_COORDS }
    ];
  }, [currentTimelineB]);

  const plotsData = plotsDataA;

  const healthPlotsDataA = useMemo(() => {
    const baseNdvi = currentTimelineA.ndvi;
    const baseNdmi = currentTimelineA.ndmi;
    return [
      { id: 'PLOT-ALPHA', name: 'West Valley Plot',   area: '12.5 HA', health: 'Optimal',  ndvi: baseNdvi + 0.04, chlorophyll: parseFloat((baseNdvi * 0.95).toFixed(2)), waterStress: parseFloat((baseNdmi + 0.02).toFixed(2)), pestRisk: 'Low Risk', coords: PLOT_ALPHA_COORDS },
      { id: 'PLOT-BETA',  name: 'East Ridge Plot',   area: '8.2 HA',  health: baseNdvi < 0.65 ? 'Stressed' : 'Good', ndvi: baseNdvi - 0.15, chlorophyll: parseFloat(((baseNdvi - 0.15) * 0.9).toFixed(2)), waterStress: parseFloat(((baseNdmi - 0.10)).toFixed(2)), pestRisk: 'High Risk', coords: PLOT_BETA_COORDS },
      { id: 'PLOT-GAMMA', name: 'South Slope Plot', area: '15.0 HA', health: 'Moderate', ndvi: baseNdvi - 0.05, chlorophyll: parseFloat(((baseNdvi - 0.05) * 0.92).toFixed(2)), waterStress: parseFloat(((baseNdmi - 0.04)).toFixed(2)), pestRisk: 'Moderate Risk', coords: PLOT_GAMMA_COORDS }
    ];
  }, [currentTimelineA]);

  const healthPlotsDataB = useMemo(() => {
    const baseNdvi = currentTimelineB.ndvi;
    const baseNdmi = currentTimelineB.ndmi;
    return [
      { id: 'PLOT-ALPHA', name: 'West Valley Plot',   area: '12.5 HA', health: 'Optimal',  ndvi: baseNdvi + 0.04, chlorophyll: parseFloat((baseNdvi * 0.95).toFixed(2)), waterStress: parseFloat((baseNdmi + 0.02).toFixed(2)), pestRisk: 'Low Risk', coords: PLOT_ALPHA_COORDS },
      { id: 'PLOT-BETA',  name: 'East Ridge Plot',   area: '8.2 HA',  health: baseNdvi < 0.65 ? 'Stressed' : 'Good', ndvi: baseNdvi - 0.15, chlorophyll: parseFloat(((baseNdvi - 0.15) * 0.9).toFixed(2)), waterStress: parseFloat(((baseNdmi - 0.10)).toFixed(2)), pestRisk: 'High Risk', coords: PLOT_BETA_COORDS },
      { id: 'PLOT-GAMMA', name: 'South Slope Plot', area: '15.0 HA', health: 'Moderate', ndvi: baseNdvi - 0.05, chlorophyll: parseFloat(((baseNdvi - 0.05) * 0.92).toFixed(2)), waterStress: parseFloat(((baseNdmi - 0.04)).toFixed(2)), pestRisk: 'Moderate Risk', coords: PLOT_GAMMA_COORDS }
    ];
  }, [currentTimelineB]);

  const healthPlotsData = healthPlotsDataA;

  const yieldPlotsDataA = useMemo(() => {
    const base = currentTimelineA.ndvi;
    return [
      { id: 'PLOT-ALPHA', name: 'West Valley Plot', area: '12.5 HA', yieldValue: parseFloat((base * 25).toFixed(1)), biomass: parseFloat((base * 2.8).toFixed(2)), readiness: Math.min(100, Math.round(base * 120)), growth: parseFloat(base.toFixed(2)), coords: PLOT_ALPHA_COORDS, predAccuracy: '95.4%', predictedYield: parseFloat((base * 25 * 12.5).toFixed(1)), yieldStatus: 'Optimal (On Track)' },
      { id: 'PLOT-BETA',  name: 'East Ridge Plot', area: '8.2 HA', yieldValue: parseFloat(((base - 0.15) * 20).toFixed(1)), biomass: parseFloat(((base - 0.15) * 2.2).toFixed(2)), readiness: Math.min(100, Math.round((base - 0.1) * 100)), growth: parseFloat((base - 0.15).toFixed(2)), coords: PLOT_BETA_COORDS, predAccuracy: '89.2%', predictedYield: parseFloat(((base - 0.15) * 20 * 8.2).toFixed(1)), yieldStatus: 'Underperforming (Water Stress)' },
      { id: 'PLOT-GAMMA', name: 'South Slope Plot', area: '15.0 HA', yieldValue: parseFloat(((base - 0.05) * 22).toFixed(1)), biomass: parseFloat(((base - 0.05) * 2.4).toFixed(2)), readiness: Math.min(100, Math.round((base - 0.05) * 110)), growth: parseFloat((base - 0.05).toFixed(2)), coords: PLOT_GAMMA_COORDS, predAccuracy: '92.1%', predictedYield: parseFloat(((base - 0.05) * 22 * 15.0).toFixed(1)), yieldStatus: 'Moderate (Minor Anomaly)' }
    ];
  }, [currentTimelineA]);

  const yieldPlotsDataB = useMemo(() => {
    const base = currentTimelineB.ndvi;
    return [
      { id: 'PLOT-ALPHA', name: 'West Valley Plot', area: '12.5 HA', yieldValue: parseFloat((base * 25).toFixed(1)), biomass: parseFloat((base * 2.8).toFixed(2)), readiness: Math.min(100, Math.round(base * 120)), growth: parseFloat(base.toFixed(2)), coords: PLOT_ALPHA_COORDS, predAccuracy: '95.4%', predictedYield: parseFloat((base * 25 * 12.5).toFixed(1)), yieldStatus: 'Optimal (On Track)' },
      { id: 'PLOT-BETA',  name: 'East Ridge Plot', area: '8.2 HA', yieldValue: parseFloat(((base - 0.15) * 20).toFixed(1)), biomass: parseFloat(((base - 0.15) * 2.2).toFixed(2)), readiness: Math.min(100, Math.round((base - 0.1) * 100)), growth: parseFloat((base - 0.15).toFixed(2)), coords: PLOT_BETA_COORDS, predAccuracy: '89.2%', predictedYield: parseFloat(((base - 0.15) * 20 * 8.2).toFixed(1)), yieldStatus: 'Underperforming (Water Stress)' },
      { id: 'PLOT-GAMMA', name: 'South Slope Plot', area: '15.0 HA', yieldValue: parseFloat(((base - 0.05) * 22).toFixed(1)), biomass: parseFloat(((base - 0.05) * 2.4).toFixed(2)), readiness: Math.min(100, Math.round((base - 0.05) * 110)), growth: parseFloat((base - 0.05).toFixed(2)), coords: PLOT_GAMMA_COORDS, predAccuracy: '92.1%', predictedYield: parseFloat(((base - 0.05) * 22 * 15.0).toFixed(1)), yieldStatus: 'Moderate (Minor Anomaly)' }
    ];
  }, [currentTimelineB]);

  const yieldPlotsData = yieldPlotsDataA;

  const climatePlotsDataA = useMemo(() => {
    return [
      { id: 'PLOT-ALPHA', name: 'West Valley Plot',   area: '12.5 HA', rainfall: 12 + selectedTimelineIndex * 4, soilTemp: 24 + (5 - selectedTimelineIndex), lst: 26 + (5 - selectedTimelineIndex), vpd: parseFloat((1.2 + selectedTimelineIndex * 0.2).toFixed(1)), coords: PLOT_ALPHA_COORDS },
      { id: 'PLOT-BETA',  name: 'East Ridge Plot',   area: '8.2 HA',  rainfall: 10 + selectedTimelineIndex * 3, soilTemp: 28 + (5 - selectedTimelineIndex), lst: 32 + (5 - selectedTimelineIndex), vpd: parseFloat((2.5 - selectedTimelineIndex * 0.1).toFixed(1)), coords: PLOT_BETA_COORDS },
      { id: 'PLOT-GAMMA', name: 'South Slope Plot', area: '15.0 HA', rainfall: 11 + selectedTimelineIndex * 4, soilTemp: 26 + (5 - selectedTimelineIndex), lst: 28 + (5 - selectedTimelineIndex), vpd: parseFloat((1.6 + selectedTimelineIndex * 0.15).toFixed(1)), coords: PLOT_GAMMA_COORDS }
    ];
  }, [currentTimelineA, selectedTimelineIndex]);

  const climatePlotsDataB = useMemo(() => {
    return [
      { id: 'PLOT-ALPHA', name: 'West Valley Plot',   area: '12.5 HA', rainfall: 12 + compareTimelineIndex * 4, soilTemp: 24 + (5 - compareTimelineIndex), lst: 26 + (5 - compareTimelineIndex), vpd: parseFloat((1.2 + compareTimelineIndex * 0.2).toFixed(1)), coords: PLOT_ALPHA_COORDS },
      { id: 'PLOT-BETA',  name: 'East Ridge Plot',   area: '8.2 HA',  rainfall: 10 + compareTimelineIndex * 3, soilTemp: 28 + (5 - compareTimelineIndex), lst: 32 + (5 - compareTimelineIndex), vpd: parseFloat((2.5 - compareTimelineIndex * 0.1).toFixed(1)), coords: PLOT_BETA_COORDS },
      { id: 'PLOT-GAMMA', name: 'South Slope Plot', area: '15.0 HA', rainfall: 11 + compareTimelineIndex * 4, soilTemp: 26 + (5 - compareTimelineIndex), lst: 28 + (5 - compareTimelineIndex), vpd: parseFloat((1.6 + compareTimelineIndex * 0.15).toFixed(1)), coords: PLOT_GAMMA_COORDS }
    ];
  }, [currentTimelineB, compareTimelineIndex]);

  const climatePlotsData = climatePlotsDataA;

  const restorationPlotsDataA = useMemo(() => {
    const base = currentTimelineA.ndvi;
    return [
      { id: 'ZONE-ALPHA', name: 'Canopy Reforestation', area: '6.4 HA', type: 'Canopy Density', progress: Math.min(100, Math.round(base * 125)), survival: '94%', trees: '1,200', carbon: parseFloat((base * 60).toFixed(1)), status: 'Optimal Growth', color: '#16A34A', coords: RESTORE_ZONE_A_COORDS, manager: 'John Musa', survivalNum: 94, biodiversity: '92%' },
      { id: 'ZONE-BETA',  name: 'Native Species Agroforestry', area: '5.8 HA', type: 'Species Diversification', progress: Math.min(100, Math.round((base - 0.15) * 115)), survival: '89%', trees: '980', carbon: parseFloat(((base - 0.15) * 50).toFixed(1)), status: 'Active Care', color: '#EAB308', coords: RESTORE_ZONE_B_COORDS, manager: 'Alice Peters', survivalNum: 89, biodiversity: '84%' },
      { id: 'ZONE-GAMMA', name: 'Riparian Buffer Restoration', area: '8.1 HA', type: 'Soil Stabilization', progress: Math.min(100, Math.round((base - 0.05) * 105)), survival: '81%', trees: '1,550', carbon: parseFloat(((base - 0.05) * 35).toFixed(1)), status: 'Initial Phase', color: '#0284C7', coords: RESTORE_ZONE_C_COORDS, manager: 'David Kalu', survivalNum: 81, biodiversity: '76%' }
    ];
  }, [currentTimelineA]);

  const restorationPlotsDataB = useMemo(() => {
    const base = currentTimelineB.ndvi;
    return [
      { id: 'ZONE-ALPHA', name: 'Canopy Reforestation', area: '6.4 HA', type: 'Canopy Density', progress: Math.min(100, Math.round(base * 125)), survival: '94%', trees: '1,200', carbon: parseFloat((base * 60).toFixed(1)), status: 'Optimal Growth', color: '#16A34A', coords: RESTORE_ZONE_A_COORDS, manager: 'John Musa', survivalNum: 94, biodiversity: '92%' },
      { id: 'ZONE-BETA',  name: 'Native Species Agroforestry', area: '5.8 HA', type: 'Species Diversification', progress: Math.min(100, Math.round((base - 0.15) * 115)), survival: '89%', trees: '980', carbon: parseFloat(((base - 0.15) * 50).toFixed(1)), status: 'Active Care', color: '#EAB308', coords: RESTORE_ZONE_B_COORDS, manager: 'Alice Peters', survivalNum: 89, biodiversity: '84%' },
      { id: 'ZONE-GAMMA', name: 'Riparian Buffer Restoration', area: '8.1 HA', type: 'Soil Stabilization', progress: Math.min(100, Math.round((base - 0.05) * 105)), survival: '81%', trees: '1,550', carbon: parseFloat(((base - 0.05) * 35).toFixed(1)), status: 'Initial Phase', color: '#0284C7', coords: RESTORE_ZONE_C_COORDS, manager: 'David Kalu', survivalNum: 81, biodiversity: '76%' }
    ];
  }, [currentTimelineB]);

  const restorationPlotsData = restorationPlotsDataA;

  const getRestorePolygonColor = (zone, indexName) => {
    if (indexName === 'progress') {
      const val = zone.progress;
      if (val > 85) return '#15803d';
      if (val > 70) return '#22c55e';
      if (val > 55) return '#eab308';
      return '#ef4444';
    }
    if (indexName === 'survival') {
      const val = zone.survivalNum;
      if (val > 90) return '#15803d';
      if (val > 85) return '#22c55e';
      return '#eab308';
    }
    if (indexName === 'carbon') {
      const val = zone.carbon;
      if (val > 40) return '#15803d';
      if (val > 30) return '#22c55e';
      return '#eab308';
    }
    const val = zone.id === 'ZONE-ALPHA' ? 92 : zone.id === 'ZONE-BETA' ? 84 : 76;
    if (val > 90) return '#15803d';
    if (val > 80) return '#22c55e';
    return '#eab308';
  };

  const getYieldPolygonColor = (plot, indexName) => {
    if (indexName === 'Yield') {
      const val = plot.yieldValue;
      if (val > 18) return '#15803d';
      if (val > 12) return '#22c55e';
      if (val > 8)  return '#eab308';
      return '#ef4444';
    }
    if (indexName === 'Biomass') {
      const val = plot.biomass;
      if (val > 2.0) return '#15803d';
      if (val > 1.3) return '#22c55e';
      if (val > 0.8) return '#eab308';
      return '#ef4444';
    }
    if (indexName === 'Readiness') {
      const val = plot.readiness;
      if (val > 85) return '#16a34a';
      if (val > 65) return '#eab308';
      return '#f97316';
    }
    const val = plot.growth;
    if (val > 0.7)  return '#15803d';
    if (val > 0.55) return '#22c55e';
    if (val > 0.4)  return '#eab308';
    return '#ef4444';
  };

  const getClimatePolygonColor = (plot, indexName) => {
    if (indexName === 'Rainfall') {
      const val = plot.rainfall;
      if (val > 25) return '#1d4ed8';
      if (val > 18) return '#3b82f6';
      return '#93c5fd';
    }
    if (indexName === 'SoilTemp') {
      const val = plot.soilTemp;
      if (val > 29) return '#ef4444';
      if (val > 25) return '#f97316';
      return '#10b981';
    }
    if (indexName === 'LST') {
      const val = plot.lst;
      if (val > 36) return '#b91c1c';
      if (val > 30) return '#ef4444';
      if (val > 25) return '#f97316';
      return '#10b981';
    }
    const val = plot.vpd;
    if (val > 2.2) return '#ef4444';
    if (val > 1.5) return '#f97316';
    return '#10b981';
  };

  const renderMapBottomPanel = (indexValue, centerContent = null, hideCalendarAndSlider = false) => {
    if (!showTimeSliderTool && !showCalendarTool) {
      return null;
    }
    return (
      <div className="bg-white border-t border-gray-200 shrink-0">
        {/* Slider + Play row */}
        {!hideCalendarAndSlider && showTimeSliderTool && (
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-4">
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: isCompareMode ? (activeDateSlot === 'A' ? '#16A34A' : '#2563EB') : '#16A34A' }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={15} />}
            </button>
            <div className="flex-1 relative">
              <input type="range" min="0" max={TIMELINE_DATA.length - 1}
                value={isCompareMode ? (activeDateSlot === 'A' ? selectedTimelineIndex : compareTimelineIndex) : selectedTimelineIndex}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if (isCompareMode) {
                    if (activeDateSlot === 'A') setSelectedTimelineIndex(val);
                    else setCompareTimelineIndex(val);
                  } else {
                    setSelectedTimelineIndex(val);
                  }
                }}
                className={`w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer ${
                  isCompareMode && activeDateSlot === 'B' ? 'accent-blue-600' : 'accent-green-600'
                }`} />
              <div className="flex justify-between px-0.5 mt-1">
                {TIMELINE_DATA.map((t, i) => {
                  const isActive = isCompareMode 
                    ? (activeDateSlot === 'A' ? i === selectedTimelineIndex : i === compareTimelineIndex)
                    : i === selectedTimelineIndex;
                  return (
                    <span key={i} className={`text-[9px] font-semibold transition-colors ${
                      isActive 
                        ? (isCompareMode && activeDateSlot === 'B' ? 'text-blue-600 font-bold' : 'text-green-600 font-bold') 
                        : 'text-gray-400'
                    }`}>
                      {t.label.split(',')[0]}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-gray-500">
                {isCompareMode 
                  ? (activeDateSlot === 'A' ? currentTimelineA?.satellite : currentTimelineB?.satellite) 
                  : currentTimeline.satellite}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                isCompareMode && activeDateSlot === 'B' 
                  ? 'bg-blue-50 text-blue-700 border-blue-100' 
                  : 'bg-green-50 text-green-700 border-green-100'
              }`}>
                {indexValue}
              </span>
            </div>
          </div>
        )}

        <div className="flex divide-x divide-gray-100 bg-gray-50/30" style={{ maxHeight: '360px' }}>
          {/* Mini Calendar (Enlarged) */}
          {!hideCalendarAndSlider && showCalendarTool && (
            <div className="p-4 shrink-0 w-[440px] bg-white flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Compare Mode Toggle Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-700">Split Comparison Mode</span>
                  <button
                    onClick={() => {
                      const nextVal = !isCompareMode;
                      setIsCompareMode(nextVal);
                      if (nextVal) {
                        if (compareTimelineIndex === selectedTimelineIndex) {
                          setCompareTimelineIndex((selectedTimelineIndex + 1) % TIMELINE_DATA.length);
                        }
                        setActiveDateSlot('B');
                      } else {
                        setActiveDateSlot('A');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                      isCompareMode
                        ? 'bg-green-55 text-green-700 border-green-200 shadow-sm font-extrabold'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isCompareMode ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>

                {/* Date Slots Selection inside Calendar */}
                {isCompareMode && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => setActiveDateSlot('A')}
                      className={`flex flex-col p-1.5 rounded-lg border text-left transition-all ${
                        activeDateSlot === 'A'
                          ? 'border-green-600 bg-green-50/30 shadow-sm'
                          : 'border-gray-150 bg-gray-50 hover:bg-gray-100/50'
                      }`}
                    >
                      <span className="text-[8px] font-bold text-green-700 uppercase tracking-wide">Date A (Left Pane)</span>
                      <span className="text-xs font-extrabold text-gray-800 truncate">
                        {currentTimelineA ? currentTimelineA.label.split(',')[0] : 'Not Selected'}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveDateSlot('B')}
                      className={`flex flex-col p-1.5 rounded-lg border text-left transition-all ${
                        activeDateSlot === 'B'
                          ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                          : 'border-gray-150 bg-gray-50 hover:bg-gray-100/50'
                      }`}
                    >
                      <span className="text-[8px] font-bold text-blue-700 uppercase tracking-wide">Date B (Right Pane)</span>
                      <span className="text-xs font-extrabold text-gray-800 truncate">
                        {currentTimelineB ? currentTimelineB.label.split(',')[0] : 'Not Selected'}
                      </span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <button onClick={prevCalMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-all text-gray-500 hover:text-gray-900 border border-gray-100 shadow-sm">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-gray-800 tracking-wide">
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </span>
                  <button onClick={nextCalMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-all text-gray-500 hover:text-gray-900 border border-gray-100 shadow-sm">
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', alignContent: 'start' }}>
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <span key={i} className="text-[10px] font-bold text-gray-400 h-6 flex items-center justify-center">{d}</span>
                  ))}
                  {Array.from({ length: calFirstDay }).map((_, i) => <span key={`pad-${i}`} className="h-7" />)}
                  {Array.from({ length: calDaysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const matchIdx = TIMELINE_DATA.findIndex(t => t.date === dateStr);
                    const isHL = matchIdx !== -1;
                    const isSelA = matchIdx === selectedTimelineIndex;
                    const isSelB = isCompareMode && (matchIdx === compareTimelineIndex);
                    
                    let btnStyle = {};
                    let btnClass = '';
                    
                    if (isSelA && isSelB) {
                      btnStyle = { background: 'linear-gradient(135deg, #16A34A 50%, #2563EB 50%)', color: '#FFFFFF' };
                    } else if (isSelA) {
                      btnStyle = { backgroundColor: '#16A34A', color: '#FFFFFF' };
                    } else if (isSelB) {
                      btnStyle = { backgroundColor: '#2563EB', color: '#FFFFFF' };
                    } else if (isHL) {
                      btnClass = 'text-green-700 bg-green-50 hover:bg-green-100 font-bold border border-green-100';
                    } else {
                      btnClass = 'text-gray-300 cursor-default';
                    }

                    return (
                      <button key={i} disabled={!isHL}
                        onClick={() => {
                          if (isHL) {
                            if (isCompareMode) {
                              if (activeDateSlot === 'A') setSelectedTimelineIndex(matchIdx);
                              else setCompareTimelineIndex(matchIdx);
                            } else {
                              setSelectedTimelineIndex(matchIdx);
                            }
                          }
                        }}
                        className={`h-7 w-full rounded-lg text-xs font-bold flex items-center justify-center transition-all ${btnClass}`}
                        style={btnStyle}>
                        {day}
                      </button>
                    );
                  })}
                  {Array.from({ length: calTrailing < 0 ? 0 : calTrailing }).map((_, i) => (
                    <span key={`trail-${i}`} className="h-7" />
                  ))}
                </div>
              </div>

              {/* Selected Pass Status Bar */}
              {isCompareMode ? (
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2 text-[10px] font-semibold text-gray-600 animate-in fade-in duration-200">
                  {currentTimelineA && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        <span className="font-bold text-green-700">Date A:</span>
                        <span className="text-gray-700">{currentTimelineA.label.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded uppercase border border-green-150">
                          {currentTimelineA.satellite}
                        </span>
                        <span className="text-gray-450 text-[9px]">{currentTimelineA.quality}</span>
                      </div>
                    </div>
                  )}
                  {currentTimelineB && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span className="font-bold text-blue-700">Date B:</span>
                        <span className="text-gray-700">{currentTimelineB.label.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded uppercase border border-blue-150">
                          {currentTimelineB.satellite}
                        </span>
                        <span className="text-gray-450 text-[9px]">{currentTimelineB.quality}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                currentTimeline && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 uppercase">
                        {currentTimeline.satellite}
                      </span>
                      <span className="text-gray-450 font-semibold text-[10px]">{currentTimeline.quality}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {centerContent ? centerContent : (
            <div className="flex-1 bg-white p-6 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-green-655 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 size={13} className="text-green-600" /> Best Imagery Active
              </span>
              <p className="text-xs text-gray-400 font-semibold max-w-xs leading-relaxed">
                The portal automatically filters cloud-free passes. Select any highlighted date on the calendar to audit historical indices.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dynamic Dashboard Calculations
  const dashboardMetrics = useMemo(() => {
    let layers = 128;
    let users = 24;
    let projects = 18;
    let alerts = 7;

    const plot = filterPlot;
    const date = filterDate;

    if (plot === 'PLOT-ALPHA') {
      layers = 42;
      users = 8;
      projects = 6;
      alerts = 0;
    } else if (plot === 'PLOT-BETA') {
      layers = 36;
      users = 9;
      projects = 5;
      alerts = date === '2026-05-29' ? 8 : 4;
    } else if (plot === 'PLOT-GAMMA') {
      layers = 50;
      users = 7;
      projects = 7;
      alerts = 3;
    } else if (filterEstate === 'West Valley Estate') {
      layers = 42; users = 8; projects = 6; alerts = 0;
    } else if (filterEstate === 'East Ridge Estate') {
      layers = 36; users = 9; projects = 5; alerts = 4;
    } else if (filterEstate === 'South Slope Estate') {
      layers = 50; users = 7; projects = 7; alerts = 3;
    }

    if (date !== 'All') {
      const dayIndex = TIMELINE_DATA.findIndex(t => t.date === date);
      layers = Math.round(layers * (0.8 + (dayIndex * 0.1)));
      users = Math.max(1, Math.round(users * (0.7 + (dayIndex * 0.08))));
      if (plot === 'All') {
        const pass = TIMELINE_DATA[dayIndex];
        alerts = pass.ndvi < 0.65 ? 9 : pass.ndvi > 0.75 ? 2 : 5;
      }
    }

    return { layers, users, projects, alerts };
  }, [filterEstate, filterPlot, filterDate]);

  const yieldTrendsData = useMemo(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const datasets = [];

    const alphaData = [0.55, 0.58, 0.64, 0.72, currentTimeline.ndvi + 0.04, 0.78];
    const betaData = [0.48, 0.52, 0.50, 0.53, currentTimeline.ndvi - 0.15, 0.55];
    const gammaData = [0.60, 0.62, 0.61, 0.65, currentTimeline.ndvi - 0.05, 0.68];
    const avgData = labels.map((_, i) => parseFloat(((alphaData[i] + betaData[i] + gammaData[i]) / 3).toFixed(2)));

    const showAlpha = filterPlot === 'All' || filterPlot === 'PLOT-ALPHA';
    const showBeta = filterPlot === 'All' || filterPlot === 'PLOT-BETA';
    const showGamma = filterPlot === 'All' || filterPlot === 'PLOT-GAMMA';

    if (showAlpha) {
      datasets.push({ label: 'West Valley Plot', data: alphaData, borderColor: '#16A34A', tension: 0.4, fill: true, backgroundColor: 'rgba(22, 163, 74, 0.03)', pointRadius: 4, pointBackgroundColor: '#16A34A' });
    }
    if (showBeta) {
      datasets.push({ label: 'East Ridge Plot', data: betaData, borderColor: '#EAB308', tension: 0.4, fill: true, backgroundColor: 'rgba(234, 179, 8, 0.03)', pointRadius: 4, pointBackgroundColor: '#EAB308' });
    }
    if (showGamma) {
      datasets.push({ label: 'South Slope Plot', data: gammaData, borderColor: '#0284C7', tension: 0.4, fill: true, backgroundColor: 'rgba(2, 132, 199, 0.03)', pointRadius: 4, pointBackgroundColor: '#0284C7' });
    }

    if (filterPlot !== 'All') {
      datasets.push({ label: 'System Average', data: avgData, borderColor: '#64748B', borderDash: [6, 4], tension: 0.4, fill: false, pointRadius: 0 });
    }

    return { labels, datasets };
  }, [filterPlot, currentTimeline]);

  const moistureRetentionData = useMemo(() => {
    const allPlots = [
      { id: 'PLOT-ALPHA', label: 'Plot Alpha', value: parseFloat((currentTimeline.ndmi + 0.02).toFixed(2)), color: '#16A34A' },
      { id: 'PLOT-BETA',  label: 'Plot Beta',  value: parseFloat((currentTimeline.ndmi - 0.10).toFixed(2)), color: '#EAB308' },
      { id: 'PLOT-GAMMA', label: 'Plot Gamma', value: parseFloat((currentTimeline.ndmi - 0.04).toFixed(2)), color: '#0284C7' }
    ];

    const filtered = allPlots.filter(p => filterPlot === 'All' || filterPlot === p.id);
    const labels = filtered.map(p => p.label);
    const data = filtered.map(p => p.value);
    const bgColors = filtered.map(p => p.color);

    if (filterPlot !== 'All') {
      labels.push('Standard Target');
      data.push(0.45);
      bgColors.push('#64748B');
    }

    return {
      labels,
      datasets: [{
        label: 'Soil/Canopy NDMI',
        data,
        backgroundColor: bgColors,
        borderRadius: 8,
        borderSkipped: false
      }]
    };
  }, [filterPlot, currentTimeline]);

  const nutrientData = useMemo(() => {
    let ndviVal = currentTimeline.ndvi;
    let ndmiVal = currentTimeline.ndmi;
    let nitrogenFactor = 1.0;
    let coverFactor = 1.0;

    if (filterPlot === 'PLOT-ALPHA') {
      ndviVal += 0.04;
      ndmiVal += 0.02;
      nitrogenFactor = 1.15;
      coverFactor = 1.1;
    } else if (filterPlot === 'PLOT-BETA') {
      ndviVal -= 0.15;
      ndmiVal -= 0.10;
      nitrogenFactor = 0.75;
      coverFactor = 0.8;
    } else if (filterPlot === 'PLOT-GAMMA') {
      ndviVal -= 0.05;
      ndmiVal -= 0.04;
      nitrogenFactor = 0.95;
      coverFactor = 0.95;
    }

    return {
      labels: ['Nitrogen (GCVI)', 'Chlorophyll (NDRE)', 'Water (NDWI)', 'Biomass (EVI)', 'Soil Temp', 'Canopy Cover'],
      datasets: [{
        label: filterPlot === 'All' ? 'System Average' : `${filterPlot} Metric`,
        data: [
          Math.min(100, Math.max(0, parseInt((ndviVal * 100 * nitrogenFactor).toFixed(0)))),
          Math.min(100, Math.max(0, parseInt((ndviVal * 90).toFixed(0)))),
          Math.min(100, Math.max(0, parseInt((ndmiVal * 120).toFixed(0)))),
          Math.min(100, Math.max(0, parseInt((ndviVal * 110).toFixed(0)))),
          filterPlot === 'PLOT-BETA' ? 88 : 82,
          Math.min(100, Math.max(0, parseInt((75 * coverFactor).toFixed(0))))
        ],
        backgroundColor: 'rgba(22, 163, 74, 0.15)',
        borderColor: '#16A34A',
        pointBackgroundColor: '#16A34A',
        borderWidth: 2.5
      }]
    };
  }, [filterPlot, currentTimeline]);

  const landClassificationData = useMemo(() => {
    let labels = ['West Valley Plot', 'East Ridge Plot', 'South Slope Plot', 'Conservation Zone'];
    let data = [35, 23, 27, 15];
    let colors = ['#16A34A', '#EAB308', '#0284C7', '#0F172A'];

    if (filterPlot === 'PLOT-ALPHA') {
      labels = ['West Valley Plot'];
      data = [100];
      colors = ['#16A34A'];
    } else if (filterPlot === 'PLOT-BETA') {
      labels = ['East Ridge Plot'];
      data = [100];
      colors = ['#EAB308'];
    } else if (filterPlot === 'PLOT-GAMMA') {
      labels = ['South Slope Plot'];
      data = [100];
      colors = ['#0284C7'];
    } else if (filterEstate === 'West Valley Estate') {
      labels = ['West Valley Plot', 'Conservation Zone'];
      data = [80, 20];
      colors = ['#16A34A', '#0F172A'];
    } else if (filterEstate === 'East Ridge Estate') {
      labels = ['East Ridge Plot', 'Conservation Zone'];
      data = [85, 15];
      colors = ['#EAB308', '#0F172A'];
    } else if (filterEstate === 'South Slope Estate') {
      labels = ['South Slope Plot', 'Conservation Zone'];
      data = [75, 25];
      colors = ['#0284C7', '#0F172A'];
    }

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 8
      }]
    };
  }, [filterPlot, filterEstate]);

  const alertsByCategoryData = useMemo(() => {
    const categories = ['Water Stress', 'Pest Infestation', 'Growth Deficit', 'Cloud Cover'];
    const counts = categories.map(cat => alerts.filter(a => a.category === cat).length);
    return {
      labels: categories,
      datasets: [{
        label: 'Alerts',
        data: counts,
        backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'],
        borderWidth: 0,
        borderRadius: 6
      }]
    };
  }, [alerts]);

  const getPolygonColor = (plot, indexName) => {
    let val = 0.5;
    if (indexName === 'NDVI') val = plot.ndvi;
    else if (indexName === 'NDMI') val = plot.ndmi;
    else if (indexName === 'NDWI') val = plot.ndmi - 0.05;
    else if (indexName === 'EVI') val = plot.ndvi * 0.95;

    return getIndexFiveClasses(val, indexName).color;
  };

  const basemapUrl = useMemo(() => {
    if (selectedBasemap === 'google-hybrid') return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    if (selectedBasemap === 'landsat-8') return 'https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}';
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  }, [selectedBasemap]);

  const triggerReportGeneration = () => {
    setIsGeneratingReport(true);
    setReportProgress(0);
    setGeneratedReport(null);
    const steps = [
      { progress: 20,  text: 'Querying Sentinel-2 & Landsat-8 band repositories...' },
      { progress: 50,  text: 'Executing calculation algorithms for crop indices (NDVI/NDMI)...' },
      { progress: 80,  text: 'Compiling MRV spatial compliance check ledger...' },
      { progress: 100, text: 'Assembling final PDF documentation bundle...' }
    ];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setReportProgress(step.progress);
        setReportProgressText(step.text);
        if (step.progress === 100) {
          setTimeout(() => {
            setIsGeneratingReport(false);
            setGeneratedReport({
              id: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              plot: reportPlot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : reportPlot,
              index: reportIndex,
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              meanVal: (() => {
                if (reportPlot === 'WHOLE-FARM') {
                  if (reportIndex === 'SOC') return '37.5 g/kg';
                  if (reportIndex === 'AGB') return '312.7 tCO2e';
                  if (reportIndex === 'NDVI') return '0.61';
                  if (reportIndex === 'NDMI') return '0.38';
                  return '0.33';
                }
                if (reportIndex === 'SOC') return reportPlot === 'PLOT-ALPHA' ? '42.8 g/kg' : reportPlot === 'PLOT-BETA' ? '31.2 g/kg' : '38.5 g/kg';
                if (reportIndex === 'AGB') return reportPlot === 'PLOT-ALPHA' ? '124.5 tCO2e' : reportPlot === 'PLOT-BETA' ? '82.4 tCO2e' : '105.8 tCO2e';
                return reportPlot === 'PLOT-ALPHA' ? '0.76' : reportPlot === 'PLOT-BETA' ? '0.45' : '0.62';
              })(),
              status: 'Approved & Signed'
            });
          }, 600);
        }
      }, (idx + 1) * 800);
    });
  };

  const triggerVerificationAudit = () => {
    setIsVerifying(true);
    setVerificationStatus('running');
    const keys = ['boundary', 'forest', 'cover', 'moisture'];
    keys.forEach((key, idx) => {
      setTimeout(() => {
        setVerificationSteps(prev => ({ ...prev, [key]: { ...prev[key], status: 'scanning' } }));
      }, idx * 950);
      setTimeout(() => {
        let finalStatus = 'success';
        if (selectedVerifyPlot === 'PLOT-BETA' && key === 'moisture') finalStatus = 'warning';
        setVerificationSteps(prev => ({ ...prev, [key]: { ...prev[key], status: finalStatus } }));
        if (idx === keys.length - 1) { setVerificationStatus('completed'); setIsVerifying(false); }
      }, (idx * 950) + 700);
    });
  };

  useEffect(() => {
    setVerificationSteps({
      boundary: { label: 'Boundary Integrity Check', status: 'idle', details: 'Verifying polygon shape match with cadastral registry' },
      forest:   { label: 'Deforestation Compliance Check', status: 'idle', details: 'Scanning for canopy loss anomalies' },
      cover:    { label: 'Canopy Density Standard', status: 'idle', details: 'Measuring active photosynthetic activity coverage' },
      moisture: { label: 'Soil Water Index Target', status: 'idle', details: 'Assessing root-zone moisture anomalies' }
    });
    setVerificationStatus('idle');
  }, [selectedVerifyPlot]);

  // Reset timeline selection to middle index when changing month/year
  useEffect(() => {
    setSelectedTimelineIndex(2);
  }, [calendarMonth, calendarYear]);

  const handleChatSubmit = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setChatInput('');
    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = "I've analyzed the current spatial ledger. Is there a specific index (NDVI/NDMI) or target plot block you'd like me to report on?";
      
      if (lower.includes('carbon project') || lower.includes('zero-tillage') || lower.includes('cover crop') || lower.includes('climate-smart')) {
        reply = "Climate-Smart Agriculture Analysis: Transitioning Plot-Alpha (West Valley Plot) to zero-tillage and cover cropping is projected to sequester 3.2 tCO2e/HA/year in soil organic carbon. Baseline soil moisture (NDMI) is estimated to rise by 12% due to improved organic matter water retention. Action: Initiate multi-species cover crop seeding post-harvest.";
      } else if (lower.includes('agroforestry') || lower.includes('land restoration') || lower.includes('canopy restoration') || lower.includes('reforestation')) {
        reply = "Agroforestry Restoration Modeling: Integrating native nitrogen-fixing trees in Zone-Beta at 80 trees/HA is projected to achieve a 22% canopy density improvement in 3 years. This sequestering model yields approx 45.2 tCO2e carbon offset while decreasing local surface LST temperatures by 1.8°C.";
      } else if (lower.includes('geospatial') || lower.includes('carbon accounting') || lower.includes('registry') || lower.includes('mismatch') || lower.includes('coordinates')) {
        reply = "Geospatial Carbon Accounting Audit: Boundary verification for Plot-Gamma confirms coordinates are 100% within legal agricultural corridors with 0% overlap mismatch against protected forests. Sentinel-2 baselines show no canopy clearing since Dec 2020, complying with global voluntary carbon registry standards.";
      } else if (lower.includes('traceability') || lower.includes('environmental impact') || lower.includes('eudr') || lower.includes('deforestation-free') || lower.includes('supply chain')) {
        reply = "EUDR Traceability & Impact Review: Blockchain ledger maps Plot-Alpha harvest batches directly to legal farm coordinates. Spatial verification registers zero canopy degradation (Deforestation-free score: 1.0) and an A+ Environmental Impact Rating (92/100 Biodiversity Index, 18% water footprint reduction).";
      } else if (lower.includes('drought') || (lower.includes('rainfall') && lower.includes('deficit'))) {
        reply = "Drought Scenario Simulation: Under a 6-week CHIRPS -60% rainfall deficit, East Ridge Plot (Block Beta) faces extreme moisture stress due to lower baseline soil retention. Vegetation index (CVI) is projected to decrease by 24%. Recommended Action: Increase irrigation rate by 40% immediately and spray anti-transpirants to conserve root-zone water.";
      } else if (lower.includes('irrigation') || lower.includes('water status')) {
        reply = "Irrigation Increase Analysis: Increasing irrigation by 30% on rainfed blocks will raise LSWI (Water Status) index scores to 'Adequate' range within 12 days. Yield Outlook: Anticipated yield recovery of +1.8 t/HA (8.5% increase) for Block Beta, with stable yield projections across West Valley and South Slope plots.";
      } else if (lower.includes('pest') || lower.includes('containment')) {
        reply = "Pest Outbreak Spread Risk: A stem borer outbreak has been detected near Block 6. Standard NDVI and VHI indices indicate high canopy density which accelerates pest migration. Recommended Action: Establish a 150m chemical containment buffer on the eastern edge of Block 6 to protect adjacent vegetation fields.";
      } else if (lower.includes('harvest') || lower.includes('reschedule')) {
        reply = "Harvest Scheduling Optimization: A 3-week delay in the harvest window shifts the yield curves. Recommended revised harvest sequence: 1. West Valley Plot (optimal maturity reached), 2. South Slope Plot, 3. East Ridge Plot (allow additional vegetative grand growth time).";
      } else if (lower.includes('ndvi') || lower.includes('health')) {
        reply = `The current satellite composite (${currentTimeline.label} via ${currentTimeline.satellite}) records a mean NDVI of ${currentTimeline.ndvi}. Plot ALPHA performs best at ${(currentTimeline.ndvi + 0.04).toFixed(2)}, while PLOT-BETA shows stress at ${(currentTimeline.ndvi - 0.15).toFixed(2)}.`;
      } else if (lower.includes('moisture') || lower.includes('ndmi') || lower.includes('water')) {
        reply = `For ${currentTimeline.label}, NDMI averages ${currentTimeline.ndmi}. This maps to a vegetation water demand of 64%. No critical drought zones are detected outside of East Ridge Plot.`;
      } else if (lower.includes('plot') || lower.includes('alpha') || lower.includes('beta')) {
        reply = `PLOT-ALPHA covers 12.5 HA of West Valley Plot and has a verification integrity of 98.4%. Soil nitrogen content is optimal at 0.52 GCVI index points.`;
      } else if (lower.includes('climate') || lower.includes('weather') || lower.includes('rain')) {
        reply = `A brief 4 mm precipitation event is expected within 48 hours. Relative humidity sits at 68% with mean temperature of 29.4°C — typical for this growth phase.`;
      }
      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (selectedPlot) {
      const updated = plotsData.find(p => p.id === selectedPlot.id);
      if (updated) setSelectedPlot(updated);
    }
  }, [plotsData]);

  // Play auto-advance
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (isCompareMode) {
        if (activeDateSlot === 'A') {
          setSelectedTimelineIndex(prev => {
            if (prev >= TIMELINE_DATA.length - 1) { setIsPlaying(false); return prev; }
            return prev + 1;
          });
        } else {
          setCompareTimelineIndex(prev => {
            if (prev >= TIMELINE_DATA.length - 1) { setIsPlaying(false); return prev; }
            return prev + 1;
          });
        }
      } else {
        setSelectedTimelineIndex(prev => {
          if (prev >= TIMELINE_DATA.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }
    }, 1400);
    return () => clearInterval(id);
  }, [isPlaying, isCompareMode, activeDateSlot, TIMELINE_DATA.length]);

  // Stop playing when leaving map view
  useEffect(() => {
    if (!['crop-health', 'crop-yield', 'climate', 'land-restoration'].includes(activeSidebarItem)) {
      setIsPlaying(false);
    }
  }, [activeSidebarItem]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const togglePlay = () => setIsPlaying(p => !p);

  const toggleUserStatus = (userId) => {
    setSettingsUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Offline' : 'Active' } : u));
  };

  const deleteUser = (userId) => {
    setSettingsUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const initials = inviteName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    const newUser = {
      id: Date.now(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Active',
      avatar: initials
    };
    setSettingsUsers(prev => [...prev, newUser]);
    setInviteName('');
    setInviteEmail('');
    setInviteSuccess(true);
    setTimeout(() => setInviteSuccess(false), 3000);
  };

  const handleConfigSave = () => {
    setShowConfigSaved(true);
    setTimeout(() => setShowConfigSaved(false), 3500);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setShowSupportSubmitted(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setShowSupportSubmitted(false), 3500);
  };

  const prevCalMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else setCalendarMonth(m => m - 1);
  };
  const nextCalMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else setCalendarMonth(m => m + 1);
  };

  // Calendar computed values
  const calFirstDay    = new Date(calendarYear, calendarMonth, 1).getDay();
  const calDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const calTrailing    = 42 - calFirstDay - calDaysInMonth;

  // ─── Health badge helper ────────────────────────────────────────────────
  const HealthBadge = ({ health }) => {
    const cfg = {
      Optimal:  { bg: '#DCFCE7', color: '#15803D' },
      Good:     { bg: '#DCFCE7', color: '#15803D' },
      Moderate: { bg: '#FEF9C3', color: '#A16207' },
      Stressed: { bg: '#FEE2E2', color: '#B91C1C' }
    }[health] || { bg: '#F3F4F6', color: '#6B7280' };
    return (
      <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
        {health}
      </span>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased animate-in fade-in duration-300 overflow-hidden">

      {/* ── TOP HEADER BAR ─────────────────────────────────────────────────── */}
      <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 z-[100] shadow-sm shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-all border border-gray-200 text-gray-500 hover:text-gray-800">
            <ArrowLeft size={17} />
          </button>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md ring-4 ring-green-50" style={{ backgroundColor: '#16A34A' }}>
              <Satellite className="text-white" size={21} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900 leading-none">Agro Monitoring</h1>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-green-600 mt-1 leading-none">Enterprise Satellite Node</p>
            </div>
          </div>
        </div>

        {/* ── TOP TABS ── */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'monitor',      label: 'Monitor',      icon: <Activity size={15} /> },
            { id: 'reports',      label: 'Reports',      icon: <FileText size={15} /> },
            { id: 'verification', label: 'Verification', icon: <Shield size={15} /> },
            { id: 'ai-assistant', label: 'AI Assistant', icon: <Sparkles size={15} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* User area */}
        <div className="flex items-center gap-4">
          <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-gray-200 text-gray-400 hover:text-gray-800 relative">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ backgroundColor: '#EF4444' }}></span>
          </button>
          <div className="w-px h-8 bg-gray-200"></div>
          {/* Clickable user avatar with sign-out dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(s => !s)}
              className="flex items-center gap-3 hover:opacity-80 transition-all"
            >
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 leading-none">AM Manager</div>
                <div className="text-[11px] font-semibold text-green-600 tracking-wider mt-1 uppercase">Spatial Auditor</div>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-green-700 text-sm shadow-sm border border-green-200 hover:ring-2 hover:ring-green-200 transition-all" style={{ backgroundColor: '#DCFCE7' }}>
                AM
              </div>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[500] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3.5 border-b border-gray-100">
                  <div className="text-sm font-bold text-gray-900">AM Manager</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">am.manager@farmintelytics.io</div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setShowUserMenu(false); onSignOut(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT SIDEBAR ── */}
        {activeTab === 'monitor' && (
          <aside className="w-[240px] bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm shrink-0">
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">

              {/* MAIN */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Main</div>
                {[
                  { id: 'dashboard',           label: 'Dashboard',           icon: <LayoutDashboard size={17} /> },
                  { id: 'intelligence-layers', label: 'Intelligence Layers', icon: <MapIcon size={17} /> },
                  { id: 'crop-health',         label: 'Crop Health',         icon: <Activity size={17} /> },
                  { id: 'crop-yield',          label: 'Crop Yield',          icon: <TrendingUp size={17} /> },
                  { id: 'climate',             label: 'Climate',             icon: <CloudRain size={17} /> },
                  { id: 'land-restoration',    label: 'Land Restoration',    icon: <Leaf size={17} /> },
                  { id: 'alerts',              label: 'Alerts',              icon: <AlertTriangle size={17} />, badge: alerts.filter(a => a.status === 'Active').length }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSidebarClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeSidebarItem === item.id
                        ? 'text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={{ backgroundColor: activeSidebarItem === item.id ? '#16A34A' : undefined }}
                  >
                    <span className={activeSidebarItem === item.id ? 'text-white' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge > 0 && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeSidebarItem === item.id ? 'bg-white/25 text-white' : 'bg-red-100 text-red-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* TOOLS */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Tools</div>
                {[
                  { id: 'calendar-tool', label: 'Calendar',     icon: <CalendarIcon size={17} />, active: showCalendarTool, toggle: () => setShowCalendarTool(!showCalendarTool) },
                  { id: 'slider-tool',   label: 'Time Slider',  icon: <SlidersHorizontal size={17} />, active: showTimeSliderTool, toggle: () => setShowTimeSliderTool(!showTimeSliderTool) }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={item.toggle}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      item.active
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={item.active ? 'text-green-600' : 'text-gray-400'}>
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                    {item.active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* SETTINGS */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Settings</div>
                {[
                  { id: 'help',      label: 'Help & Support',         icon: <Info size={17} /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSidebarClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeSidebarItem === item.id
                        ? 'text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={{ backgroundColor: activeSidebarItem === item.id ? '#16A34A' : undefined }}
                  >
                    <span className={activeSidebarItem === item.id ? 'text-white' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </aside>
        )}

        {/* ── WORKSPACE CONTENT ── */}
        <main className={`flex-1 flex flex-col relative bg-gray-50 ${['intelligence-layers', 'crop-health', 'crop-yield', 'climate', 'land-restoration'].includes(activeSidebarItem) ? 'overflow-hidden' : 'overflow-y-auto'}`}>

          {/* ══════════════════════════════════════════════════════════════
              DASHBOARD — MONITOR
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'dashboard' && activeTab === 'monitor' && (
            <div className="p-10 space-y-10 animate-in fade-in duration-300">

              {/* Page header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Agro Analytics Dashboard</h2>
                  <p className="text-sm text-gray-500 font-medium mt-2 max-w-lg">
                    Direct analytical metrics derived from Sentinel-2 & Landsat-8 imagery pass dates.
                  </p>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 shrink-0">
                  <CalendarIcon size={16} className="text-green-600" />
                  <span className="text-sm font-bold text-gray-700">
                    {currentTimeline.label} · {currentTimeline.satellite}
                  </span>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search blocks, parameters, anomalies..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-green-500 focus:bg-white transition-all text-gray-700"
                  />
                </div>
                
                {/* Active Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  {/* Estate Filter */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Estate</span>
                    <select
                      value={filterEstate}
                      onChange={e => handleEstateChange(e.target.value)}
                      className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer pr-1"
                    >
                      <option value="All">All Estates</option>
                      <option value="West Valley Estate">West Valley Estate</option>
                      <option value="East Ridge Estate">East Ridge Estate</option>
                      <option value="South Slope Estate">South Slope Estate</option>
                    </select>
                  </div>

                  {/* Plot Filter */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Plot</span>
                    <select
                      value={filterPlot}
                      onChange={e => handlePlotChange(e.target.value)}
                      className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer pr-1"
                    >
                      <option value="All">All Plots</option>
                      <option value="PLOT-ALPHA">West Valley Plot (PLOT-ALPHA)</option>
                      <option value="PLOT-BETA">East Ridge Plot (PLOT-BETA)</option>
                      <option value="PLOT-GAMMA">South Slope Plot (PLOT-GAMMA)</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Date</span>
                    <select
                      value={filterDate}
                      onChange={e => setFilterDate(e.target.value)}
                      className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer pr-1"
                    >
                      <option value="All">All Pass Dates</option>
                      {TIMELINE_DATA.map(t => (
                        <option key={t.date} value={t.date}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Button */}
                  {(filterEstate !== 'All' || filterPlot !== 'All' || filterDate !== 'All') && (
                    <button
                      onClick={() => { setFilterEstate('All'); setFilterPlot('All'); setFilterDate('All'); }}
                      className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100/70 rounded-xl"
                    >
                      <X size={14} /> Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Layers',  value: dashboardMetrics.layers, subtext: 'Active GIS Layers',       icon: <Layers size={22} className="text-blue-600" />,  accent: '#EFF6FF', border: '#BFDBFE' },
                  { label: 'Active Users',  value: dashboardMetrics.users,  subtext: 'Online Spatial Auditors',  icon: <User size={22} className="text-green-600" />,    accent: '#F0FDF4', border: '#BBF7D0' },
                  { label: 'Projects',      value: dashboardMetrics.projects, subtext: 'In-Progress Audits',       icon: <Activity size={22} className="text-amber-500" />, accent: '#FFFBEB', border: '#FDE68A' },
                  { label: 'Alerts',        value: dashboardMetrics.alerts,   subtext: 'Critical Moisture Stress', icon: <AlertTriangle size={22} className="text-red-500" />, accent: '#FFF1F2', border: '#FECDD3' }
                ].map((kpi, i) => (
                  <div key={i}
                    className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-default"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                          {kpi.label}
                        </span>
                        <span className="text-4xl font-bold tracking-tight text-gray-900 block mb-2">
                          {kpi.value}
                        </span>
                        <span className="text-xs text-gray-400 font-medium block uppercase tracking-wide">
                          {kpi.subtext}
                        </span>
                      </div>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-all"
                        style={{ backgroundColor: kpi.accent, borderColor: kpi.border }}
                      >
                        {kpi.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Crop Yield & Health Trends */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                      <TrendingUp size={18} className="text-green-600" />
                      Geospatial Vegetation Vigor & Health Trends
                    </h3>
                    <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      NDVI Normalized
                    </span>
                  </div>
                  <div className="h-[320px]">
                    <Line
                      data={yieldTrendsData}
                      options={{ ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0.2, max: 1.0 } } }}
                    />
                  </div>
                </div>

                {/* Soil Moisture NDMI */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                      <Droplets size={18} className="text-blue-600" />
                      Moisture Retention (NDMI)
                    </h3>
                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Active Sat Pass
                    </span>
                  </div>
                  <div className="h-[320px]">
                    <Bar
                      data={moistureRetentionData}
                      options={{ ...CHART_DEFAULTS, plugins: { legend: { display: filterPlot !== 'All' } }, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0.0, max: 0.8 } } }}
                    />
                  </div>
                </div>

                {/* Nutrient Radar */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                    <Sun size={18} className="text-amber-500" />
                    Nutrient Profiling
                  </h3>
                  <div className="h-[320px] flex items-center justify-center">
                    <Radar
                      data={nutrientData}
                      options={{
                        scales: { r: { angleLines: { display: false }, suggestedMin: 0, suggestedMax: 100, ticks: { display: false }, pointLabels: { font: { size: 11, weight: '600' } } } },
                        plugins: { legend: { display: false } }
                      }}
                    />
                  </div>
                </div>

                {/* Land Classification */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                    <Trees size={18} className="text-green-700" />
                    Land Classification Area
                  </h3>
                  <div className="h-[320px] flex items-center justify-center">
                    <div className="w-[280px] h-[280px]">
                      <Doughnut
                        data={landClassificationData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { position: 'bottom', labels: { font: { size: 12, weight: '600' }, padding: 16, usePointStyle: true } } }
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              MAP ANALYTICS
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'intelligence-layers' && (
            <div className="flex flex-col h-full">

              {/* ── Top area: Map + Right Legend sidebar ── */}
              <div className="flex flex-1 min-h-0">

                {/* ═══ MAP ═══ */}
                <div className="flex-1 relative min-w-0 map-wrapper-pane">
                  <MapContainer center={[7.145, 3.361]} zoom={14} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
                    
                    {isCompareMode ? (
                      <>
                        <MapPaneClipSetter
                          leftPaneName="left-pane-intel"
                          rightPaneName="right-pane-intel"
                          splitPosition={splitPosition}
                          isCompareMode={isCompareMode}
                        />
                        <Pane name="left-pane-intel" style={{ zIndex: 500 }}>
                          {plotsDataA.map(plot => (
                            <Polygon key={`${plot.id}-left`} positions={plot.coords}
                              pathOptions={getIntelPlotStyle(plot)}
                              eventHandlers={{ click: () => setSelectedPlot(plot) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">INTELLIGENCE LAYER (Left/Date A)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>CVI Vigor</span><span className="text-green-600 font-bold">{plot.ndvi.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>WDI Deficit</span><span className="text-blue-600 font-bold">{plot.ndmi.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>CAR Chlorophyll</span><span className="text-emerald-600 font-bold">{(plot.ndvi * 0.9).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>UAS Anomaly</span><span className={`${plot.id === 'PLOT-BETA' ? 'text-red-600' : 'text-green-600'} font-bold`}>{plot.id === 'PLOT-BETA' ? '0.75' : plot.id === 'PLOT-GAMMA' ? '0.45' : '0.15'}</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                        <Pane name="right-pane-intel" style={{ zIndex: 501 }}>
                          {plotsDataB.map(plot => (
                            <Polygon key={`${plot.id}-right`} positions={plot.coords}
                              pathOptions={getIntelPlotStyle(plot)}
                              eventHandlers={{ click: () => setSelectedPlot(plot) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">INTELLIGENCE LAYER (Right/Date B)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>CVI Vigor</span><span className="text-green-600 font-bold">{plot.ndvi.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>WDI Deficit</span><span className="text-blue-600 font-bold">{plot.ndmi.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>CAR Chlorophyll</span><span className="text-emerald-600 font-bold">{(plot.ndvi * 0.9).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>UAS Anomaly</span><span className={`${plot.id === 'PLOT-BETA' ? 'text-red-600' : 'text-green-600'} font-bold`}>{plot.id === 'PLOT-BETA' ? '0.75' : plot.id === 'PLOT-GAMMA' ? '0.45' : '0.15'}</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                      </>
                    ) : (
                      plotsData.map(plot => (
                        <Polygon key={plot.id} positions={plot.coords}
                          pathOptions={getIntelPlotStyle(plot)}
                          eventHandlers={{ click: () => setSelectedPlot(plot) }}>
                          <Popup>
                            <div className="p-2 w-52 space-y-2 font-sans">
                              <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">INTELLIGENCE LAYER Composite</div>
                              <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                              <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                              <div className="w-full h-px bg-gray-100" />
                              <div className="flex justify-between text-xs font-semibold">
                                <span>CVI Vigor</span><span className="text-green-600 font-bold">{plot.ndvi.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>WDI Deficit</span><span className="text-blue-600 font-bold">{plot.ndmi.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>CAR Chlorophyll</span><span className="text-emerald-600 font-bold">{(plot.ndvi * 0.9).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>UAS Anomaly</span><span className={`${plot.id === 'PLOT-BETA' ? 'text-red-600' : 'text-green-600'} font-bold`}>{plot.id === 'PLOT-BETA' ? '0.75' : plot.id === 'PLOT-GAMMA' ? '0.45' : '0.15'}</span>
                              </div>
                            </div>
                          </Popup>
                        </Polygon>
                      ))
                    )}
                    <ZoomControl position="bottomright" />
                    <ResizeMap trigger={intelShowLayers} />
                  </MapContainer>

                  <SwipeSliderOverlay
                    isCompareMode={isCompareMode}
                    splitPosition={splitPosition}
                    currentTimelineA={currentTimelineA}
                    currentTimelineB={currentTimelineB}
                    handleSplitDragStart={handleSplitDragStart}
                  />

                  {/* Floating Basemap Selector (Top-Left) */}
                  <FloatingBasemapSelector />

                  {/* Floating map layers trigger */}
                  <button
                    onClick={() => setIntelShowLayers(!intelShowLayers)}
                    className={`absolute top-4 right-4 bg-white border p-3 rounded-2xl shadow-xl hover:bg-gray-50 flex items-center gap-2 font-bold text-xs transition-all active:scale-95 ${
                      intelShowLayers ? 'text-green-700 border-green-200 bg-green-50 shadow-inner' : 'text-gray-700 border-gray-200 bg-white'
                    }`}
                    style={{ zIndex: 40000 }}
                  >
                    <Layers size={16} className={intelShowLayers ? 'text-green-600' : 'text-gray-400'} />
                    Map Layers
                  </button>

                  {/* Plot detail panel (over map) */}
                  {selectedPlot && (
                    <div className="absolute top-[76px] right-4 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 flex flex-col gap-4 pointer-events-auto animate-in slide-in-from-right-6 duration-300" style={{ zIndex: 10000 }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">Intelligence Ledger</div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedPlot.id}</h3>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">{selectedPlot.name}</p>
                        </div>
                        <button onClick={() => setSelectedPlot(null)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700">
                          <X size={15} />
                        </button>
                      </div>
                      <div className="bg-slate-900 p-3.5 rounded-xl text-white">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Index Summary</div>
                        <p className="text-xs font-medium italic leading-relaxed text-slate-100">
                          "{selectedPlot.id}: {selectedPlot.id === 'PLOT-BETA' ? 'Elevated anomaly score detected in crop water stress index (WDI).' : 'Optimal vigor (CVI) and stable chlorophyll concentration.'}"
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="h-24 bg-gray-50 rounded-xl p-2">
                          <Line data={{
                            labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                            datasets: [{
                              data: TIMELINE_DATA.map(t =>
                                selectedPlot.id === 'PLOT-ALPHA' ? t.ndvi + 0.04 :
                                selectedPlot.id === 'PLOT-BETA'  ? t.ndvi - 0.15 : t.ndvi - 0.05),
                              borderColor: '#16A34A', borderWidth: 2, backgroundColor: 'rgba(22,163,74,0.06)',
                              fill: true, tension: 0.3, pointRadius: 2
                            }]
                          }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                        </div>
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          {[
                            { label: 'CVI Vigor Index',   value: selectedPlot.ndvi.toFixed(2), color: 'text-green-600' },
                            { label: 'WDI Water Deficit',  value: selectedPlot.ndmi.toFixed(2), color: 'text-blue-600' },
                            { label: 'CAR Chlorophyll',    value: (selectedPlot.ndvi * 0.9).toFixed(2), color: 'text-emerald-600' },
                            { label: 'UAS Anomaly Score',  value: selectedPlot.id === 'PLOT-BETA' ? '0.75' : selectedPlot.id === 'PLOT-GAMMA' ? '0.45' : '0.15', color: selectedPlot.id === 'PLOT-BETA' ? 'text-red-500' : 'text-green-600' },
                            { label: 'Area Extent',        value: selectedPlot.area,            color: 'text-gray-800' }
                          ].map((r, i) => (
                            <div key={i} className="flex justify-between text-xs font-semibold text-gray-600">
                              <span>{r.label}</span><span className={`font-bold ${r.color}`}>{r.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ═══ RIGHT MAP LAYERS SIDEBAR ═══ */}
                {intelShowLayers && (
                  <div className="w-[280px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto z-10 shadow-sm">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers size={18} className="text-green-600" />
                        <span className="text-base font-bold text-gray-800 font-sans">Map Layers</span>
                      </div>
                      <button onClick={() => setIntelShowLayers(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-650 transition-all">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* OPERATIONAL SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Operational
                        </div>
                        
                        {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Farm Boundaries</div>
                              <span className="text-[10px] text-gray-400">Plot perimeter outlines</span>
                            </div>
                            <button
                              onClick={() => setIntelShowBoundaries(!intelShowBoundaries)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowBoundaries ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowBoundaries ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowBoundaries ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowBoundaries && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelBoundariesOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelBoundariesOpacity}
                                onChange={e => setIntelBoundariesOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Growth Stage Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Growth Stage</div>
                              <span className="text-[10px] text-gray-400">Crop development cycle</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('growth')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowGrowth ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowGrowth ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowGrowth ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowGrowth && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelGrowthOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelGrowthOpacity}
                                onChange={e => setIntelGrowthOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Tillering', color: '#86efac' },
                                  { label: 'Grand Growth', color: '#15803d' },
                                  { label: 'Maturation', color: '#fbbf24' },
                                  { label: 'Harvest Ready', color: '#ea580c' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BIOPHYSICAL SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Biophysical
                        </div>
                        
                        {/* EVI (Vegetation Vigor) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight font-sans">EVI (Vegetation Vigor)</div>
                              <span className="text-[10px] text-gray-400">Crop biomass density</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('evi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowEvi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowEvi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowEvi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowEvi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelEviOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelEviOpacity}
                                onChange={e => setIntelEviOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Exceptional (>0.8)', color: '#14532D' },
                                  { label: 'Optimal (0.7–0.8)', color: '#16A34A' },
                                  { label: 'Moderate (0.55–0.7)', color: '#86EFAC' },
                                  { label: 'Transition (0.45–0.55)', color: '#EAB308' },
                                  { label: 'Deficit (<=0.45)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* LSWI (Water Status) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">LSWI (Water Status)</div>
                              <span className="text-[10px] text-gray-400">Canopy moisture index</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('lswi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowLswi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowLswi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowLswi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowLswi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelLswiOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelLswiOpacity}
                                onChange={e => setIntelLswiOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Waterlogged (>0.5)', color: '#1E3A8A' },
                                  { label: 'Adequate (0.42–0.5)', color: '#2563EB' },
                                  { label: 'Moderate (0.35–0.42)', color: '#60A5FA' },
                                  { label: 'Mild Stress (0.28–0.35)', color: '#F59E0B' },
                                  { label: 'Severe Stress (<=0.28)', color: '#DC2626' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* MONITORING SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Monitoring
                        </div>
                        
                        {/* VHI (Stress) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">VHI (Stress)</div>
                              <span className="text-[10px] text-gray-400">Vegetation Health Index</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('vhi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowVhi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowVhi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowVhi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowVhi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelVhiOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelVhiOpacity}
                                onChange={e => setIntelVhiOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Exceptional (>0.8)', color: '#14532D' },
                                  { label: 'Optimal (0.7–0.8)', color: '#16A34A' },
                                  { label: 'Moderate (0.55–0.7)', color: '#86EFAC' },
                                  { label: 'Transition (0.45–0.55)', color: '#EAB308' },
                                  { label: 'Deficit (<=0.45)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Planting Suitability Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Planting Suitability</div>
                              <span className="text-[10px] text-gray-400">Optimal cultivation conditions</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('suitability')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowSuitability ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowSuitability ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowSuitability ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowSuitability && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelSuitabilityOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelSuitabilityOpacity}
                                onChange={e => setIntelSuitabilityOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Suitable', color: '#16a34a' },
                                  { label: 'Unsuitable', color: '#dc2626' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ══ BOTTOM PANEL ══ */}
              {renderMapBottomPanel(
                intelShowSuitability ? 'Planting Suitability' :
                intelShowVhi ? 'VHI (Stress)' :
                intelShowLswi ? 'LSWI (Water Status)' :
                intelShowEvi ? 'EVI (Vegetation Vigor)' :
                intelShowGrowth ? 'Growth Stage' : 'No Active Layer',
                null,
                true
              )}
            </div>
          )}

          {activeSidebarItem === 'crop-health' && (
            <div className="flex flex-col h-full">

              {/* ── Top area: Map + Right Legend sidebar ── */}
              <div className="flex flex-1 min-h-0">

                {/* ═══ MAP ═══ */}
                <div className="flex-1 relative min-w-0 map-wrapper-pane">
                  <MapContainer center={[7.145, 3.361]} zoom={14} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
                    
                    {isCompareMode ? (
                      <>
                        <MapPaneClipSetter
                          leftPaneName="left-pane-health"
                          rightPaneName="right-pane-health"
                          splitPosition={splitPosition}
                          isCompareMode={isCompareMode}
                        />
                        <Pane name="left-pane-health" style={{ zIndex: 500 }}>
                          {healthPlotsDataA.map(plot => (
                            <Polygon key={`${plot.id}-left`} positions={plot.coords}
                              pathOptions={getHealthPlotStyle(plot)}
                              eventHandlers={{ click: () => setSelectedHealthPlot(plot) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">HEALTH INDEX (Left/Date A)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>NDVI</span><span className="text-green-600 font-bold">{plot.ndvi.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Chlorophyll</span><span className="text-emerald-600 font-bold">{plot.chlorophyll.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Water Stress</span><span className="text-blue-600 font-bold">{plot.waterStress.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Pest Risk</span><span className={`${plot.pestRisk === 'High Risk' ? 'text-red-600 font-bold' : plot.pestRisk === 'Moderate Risk' ? 'text-amber-500 font-bold' : 'text-green-600 font-bold'}`}>{plot.pestRisk}</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                        <Pane name="right-pane-health" style={{ zIndex: 501 }}>
                          {healthPlotsDataB.map(plot => (
                            <Polygon key={`${plot.id}-right`} positions={plot.coords}
                              pathOptions={getHealthPlotStyle(plot)}
                              eventHandlers={{ click: () => setSelectedHealthPlot(plot) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">HEALTH INDEX (Right/Date B)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>NDVI</span><span className="text-green-600 font-bold">{plot.ndvi.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Chlorophyll</span><span className="text-emerald-600 font-bold">{plot.chlorophyll.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Water Stress</span><span className="text-blue-600 font-bold">{plot.waterStress.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Pest Risk</span><span className={`${plot.pestRisk === 'High Risk' ? 'text-red-600 font-bold' : plot.pestRisk === 'Moderate Risk' ? 'text-amber-500 font-bold' : 'text-green-600 font-bold'}`}>{plot.pestRisk}</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                      </>
                    ) : (
                      healthPlotsData.map(plot => (
                        <Polygon key={plot.id} positions={plot.coords}
                          pathOptions={getHealthPlotStyle(plot)}
                          eventHandlers={{ click: () => setSelectedHealthPlot(plot) }}>
                          <Popup>
                            <div className="p-2 w-52 space-y-2 font-sans">
                              <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">HEALTH INDEX</div>
                              <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                              <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                              <div className="w-full h-px bg-gray-100" />
                              <div className="flex justify-between text-xs font-semibold">
                                <span>NDVI</span><span className="text-green-600 font-bold">{plot.ndvi.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Chlorophyll</span><span className="text-emerald-600 font-bold">{plot.chlorophyll.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Water Stress</span><span className="text-blue-600 font-bold">{plot.waterStress.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Pest Risk</span><span className={`${plot.pestRisk === 'High Risk' ? 'text-red-600 font-bold' : plot.pestRisk === 'Moderate Risk' ? 'text-amber-500 font-bold' : 'text-green-600 font-bold'}`}>{plot.pestRisk}</span>
                              </div>
                            </div>
                          </Popup>
                        </Polygon>
                      ))
                    )}
                    <ZoomControl position="bottomright" />
                    <ResizeMap trigger={healthShowLayers} />
                  </MapContainer>

                  <SwipeSliderOverlay
                    isCompareMode={isCompareMode}
                    splitPosition={splitPosition}
                    currentTimelineA={currentTimelineA}
                    currentTimelineB={currentTimelineB}
                    handleSplitDragStart={handleSplitDragStart}
                  />

                  {/* Floating Basemap Selector (Top-Left) */}
                  <FloatingBasemapSelector />

                  {/* Floating map layers trigger */}
                  <button
                    onClick={() => setHealthShowLayers(!healthShowLayers)}
                    className={`absolute top-4 right-4 bg-white border p-3 rounded-2xl shadow-xl hover:bg-gray-50 flex items-center gap-2 font-bold text-xs transition-all active:scale-95 ${
                      healthShowLayers ? 'text-green-700 border-green-200 bg-green-50 shadow-inner' : 'text-gray-700 border-gray-200 bg-white'
                    }`}
                    style={{ zIndex: 40000 }}
                  >
                    <Layers size={16} className={healthShowLayers ? 'text-green-600' : 'text-gray-400'} />
                    Map Layers
                  </button>

                  {/* Plot detail panel (over map) */}
                  {selectedHealthPlot && (
                    <div className="absolute top-[76px] right-4 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 flex flex-col gap-4 pointer-events-auto animate-in slide-in-from-right-6 duration-300" style={{ zIndex: 10000 }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">Block Health Ledger</div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedHealthPlot.id}</h3>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">{selectedHealthPlot.name}</p>
                        </div>
                        <button onClick={() => setSelectedHealthPlot(null)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700">
                          <X size={15} />
                        </button>
                      </div>
                      <div className="bg-slate-900 p-3.5 rounded-xl text-white">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Agronomic Health Summary</div>
                        <p className="text-xs font-medium italic leading-relaxed text-slate-100">
                          "{selectedHealthPlot.id} currently displays a '{selectedHealthPlot.health}' status with pest risk categorized as {selectedHealthPlot.pestRisk}."
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="h-24 bg-gray-50 rounded-xl p-2">
                          <Line data={{
                            labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                            datasets: [{
                              data: TIMELINE_DATA.map(t =>
                                selectedHealthPlot.id === 'PLOT-ALPHA' ? t.ndvi + 0.04 :
                                selectedHealthPlot.id === 'PLOT-BETA'  ? t.ndvi - 0.15 : t.ndvi - 0.05),
                              borderColor: '#16A34A', borderWidth: 2, backgroundColor: 'rgba(22,163,74,0.06)',
                              fill: true, tension: 0.3, pointRadius: 2
                            }]
                          }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                        </div>
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          {[
                            { label: 'NDVI Value',        value: selectedHealthPlot.ndvi.toFixed(2), color: 'text-green-600' },
                            { label: 'Chlorophyll (NDRE)',value: selectedHealthPlot.chlorophyll.toFixed(2), color: 'text-emerald-700' },
                            { label: 'Water Stress (NDMI)',value: selectedHealthPlot.waterStress.toFixed(2), color: 'text-blue-600' },
                            { label: 'Pest Vulnerability',value: selectedHealthPlot.pestRisk, color: selectedHealthPlot.pestRisk === 'High Risk' ? 'text-red-500' : selectedHealthPlot.pestRisk === 'Moderate Risk' ? 'text-amber-500' : 'text-green-600' },
                            { label: 'Area Extent',        value: selectedHealthPlot.area,            color: 'text-gray-800' }
                          ].map((r, i) => (
                            <div key={i} className="flex justify-between text-xs font-semibold text-gray-600">
                              <span>{r.label}</span><span className={`font-bold ${r.color}`}>{r.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ═══ RIGHT MAP LAYERS SIDEBAR ═══ */}
                {healthShowLayers && (
                  <div className="w-[280px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto z-10 shadow-sm animate-in slide-in-from-right duration-300">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers size={18} className="text-green-600" />
                        <span className="text-base font-bold text-gray-800 font-sans">Map Layers</span>
                      </div>
                      <button onClick={() => setHealthShowLayers(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-655 transition-all">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* OPERATIONAL SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Operational
                        </div>
                        
                        {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Farm Boundaries</div>
                              <span className="text-[10px] text-gray-400">Plot perimeter outlines</span>
                            </div>
                            <button
                              onClick={() => setHealthShowBoundaries(!healthShowBoundaries)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                healthShowBoundaries ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: healthShowBoundaries ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                healthShowBoundaries ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {healthShowBoundaries && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{healthBoundariesOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={healthBoundariesOpacity}
                                onChange={e => setHealthBoundariesOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BIOPHYSICAL HEALTH SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Biophysical Health
                        </div>
                        
                        {/* NDVI Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">NDVI (Vegetation Health)</div>
                              <span className="text-[10px] text-gray-400">Chlorophyll absorption density</span>
                            </div>
                            <button
                              onClick={() => handleHealthToggle('ndvi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                healthShowNdvi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: healthShowNdvi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                healthShowNdvi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {healthShowNdvi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{healthNdviOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={healthNdviOpacity}
                                onChange={e => setHealthNdviOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Exceptional (>0.8)', color: '#14532D' },
                                  { label: 'Optimal (0.7–0.8)', color: '#16A34A' },
                                  { label: 'Moderate (0.55–0.7)', color: '#86EFAC' },
                                  { label: 'Transition (0.45–0.55)', color: '#EAB308' },
                                  { label: 'Deficit (<=0.45)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Chlorophyll Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Chlorophyll VCI</div>
                              <span className="text-[10px] text-gray-400">Leaf nitrogen index</span>
                            </div>
                            <button
                              onClick={() => handleHealthToggle('chlorophyll')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                healthShowChlorophyll ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: healthShowChlorophyll ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                healthShowChlorophyll ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {healthShowChlorophyll && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{healthChlorophyllOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={healthChlorophyllOpacity}
                                onChange={e => setHealthChlorophyllOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Exceptional (>0.8)', color: '#14532D' },
                                  { label: 'Optimal (0.7–0.8)', color: '#16A34A' },
                                  { label: 'Moderate (0.55–0.7)', color: '#86EFAC' },
                                  { label: 'Transition (0.45–0.55)', color: '#EAB308' },
                                  { label: 'Deficit (<=0.45)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* MONITORING & RISK SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Monitoring & Risk
                        </div>
                        
                        {/* Water Stress Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Water Stress (NDMI)</div>
                              <span className="text-[10px] text-gray-400">Canopy water content</span>
                            </div>
                            <button
                              onClick={() => handleHealthToggle('water')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                healthShowWater ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: healthShowWater ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                healthShowWater ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {healthShowWater && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{healthWaterOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={healthWaterOpacity}
                                onChange={e => setHealthWaterOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Waterlogged (>0.5)', color: '#1E3A8A' },
                                  { label: 'Adequate (0.42–0.5)', color: '#2563EB' },
                                  { label: 'Moderate (0.35–0.42)', color: '#60A5FA' },
                                  { label: 'Mild Stress (0.28–0.35)', color: '#F59E0B' },
                                  { label: 'Severe Stress (<=0.28)', color: '#DC2626' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pest Risk Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Pest Risk (Inundation)</div>
                              <span className="text-[10px] text-gray-400">Vulnerability warning</span>
                            </div>
                            <button
                              onClick={() => handleHealthToggle('pest')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                healthShowPest ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: healthShowPest ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                healthShowPest ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {healthShowPest && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{healthPestOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={healthPestOpacity}
                                onChange={e => setHealthPestOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High Risk', color: '#ef4444' },
                                  { label: 'Moderate Risk', color: '#f97316' },
                                  { label: 'Low Risk', color: '#16a34a' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ══ BOTTOM PANEL ══ */}
              {renderMapBottomPanel(
                healthShowPest ? 'Pest Risk' :
                healthShowWater ? 'Water Stress' :
                healthShowChlorophyll ? 'Chlorophyll' :
                healthShowNdvi ? 'NDVI' : 'No Active Layer'
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              CROP YIELD MAP VIEW
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'crop-yield' && (
            <div className="flex flex-col h-full">

              {/* ── Top area: Map + Right Legend sidebar ── */}
              <div className="flex flex-1 min-h-0">

                {/* ═══ MAP ═══ */}
                <div className="flex-1 relative min-w-0 map-wrapper-pane">
                  <MapContainer center={[7.145, 3.361]} zoom={14} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
                    
                    {isCompareMode ? (
                      <>
                        <MapPaneClipSetter
                          leftPaneName="left-pane-yield"
                          rightPaneName="right-pane-yield"
                          splitPosition={splitPosition}
                          isCompareMode={isCompareMode}
                        />
                        <Pane name="left-pane-yield" style={{ zIndex: 500 }}>
                          {yieldPlotsDataA.map(plot => (
                            <Polygon key={`${plot.id}-left`} positions={plot.coords}
                              pathOptions={getYieldPlotStyle(plot)}
                              eventHandlers={{ click: () => setSelectedYieldPlot(plot) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">YIELD PREDICTION (Left/Date A)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Est. Yield Rate</span><span className="text-green-700 font-bold">{plot.yieldValue} t/HA</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Projected Season</span><span className="text-emerald-700 font-bold">{plot.predictedYield} t</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Confidence Acc.</span><span className="text-blue-600 font-bold">{plot.predAccuracy}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Readiness</span><span className="text-orange-600 font-bold">{plot.readiness}%</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                        <Pane name="right-pane-yield" style={{ zIndex: 501 }}>
                          {yieldPlotsDataB.map(plot => (
                            <Polygon key={`${plot.id}-right`} positions={plot.coords}
                              pathOptions={getYieldPlotStyle(plot)}
                              eventHandlers={{ click: () => setSelectedYieldPlot(plot) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">YIELD PREDICTION (Right/Date B)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Est. Yield Rate</span><span className="text-green-700 font-bold">{plot.yieldValue} t/HA</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Projected Season</span><span className="text-emerald-700 font-bold">{plot.predictedYield} t</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Confidence Acc.</span><span className="text-blue-600 font-bold">{plot.predAccuracy}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Readiness</span><span className="text-orange-600 font-bold">{plot.readiness}%</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                      </>
                    ) : (
                      yieldPlotsData.map(plot => (
                        <Polygon key={plot.id} positions={plot.coords}
                          pathOptions={getYieldPlotStyle(plot)}
                          eventHandlers={{ click: () => setSelectedYieldPlot(plot) }}>
                          <Popup>
                            <div className="p-2 w-52 space-y-2 font-sans">
                              <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">YIELD PREDICTION COMPONENT</div>
                              <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                              <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                              <div className="w-full h-px bg-gray-100" />
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Est. Yield Rate</span><span className="text-green-700 font-bold">{plot.yieldValue} t/HA</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Projected Season</span><span className="text-emerald-700 font-bold">{plot.predictedYield} t</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Confidence Acc.</span><span className="text-blue-600 font-bold">{plot.predAccuracy}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Readiness</span><span className="text-orange-600 font-bold">{plot.readiness}%</span>
                              </div>
                            </div>
                          </Popup>
                        </Polygon>
                      ))
                    )}
                    <ZoomControl position="bottomright" />
                    <ResizeMap trigger={yieldShowLayers} />
                  </MapContainer>

                  <SwipeSliderOverlay
                    isCompareMode={isCompareMode}
                    splitPosition={splitPosition}
                    currentTimelineA={currentTimelineA}
                    currentTimelineB={currentTimelineB}
                    handleSplitDragStart={handleSplitDragStart}
                  />

                  {/* Floating Basemap Selector (Top-Left) */}
                  <FloatingBasemapSelector />

                  {/* Floating map layers trigger */}
                  <button
                    onClick={() => setYieldShowLayers(!yieldShowLayers)}
                    className={`absolute top-4 right-4 bg-white border p-3 rounded-2xl shadow-xl hover:bg-gray-50 flex items-center gap-2 font-bold text-xs transition-all active:scale-95 ${
                      yieldShowLayers ? 'text-green-700 border-green-200 bg-green-50 shadow-inner' : 'text-gray-700 border-gray-200 bg-white'
                    }`}
                    style={{ zIndex: 40000 }}
                  >
                    <Layers size={16} className={yieldShowLayers ? 'text-green-600' : 'text-gray-400'} />
                    Map Layers
                  </button>

                  {/* Plot detail panel (over map) */}
                  {selectedYieldPlot && (
                    <div className="absolute top-[76px] right-4 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 flex flex-col gap-4 pointer-events-auto animate-in slide-in-from-right-6 duration-300" style={{ zIndex: 10000 }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">Block Yield Projections</div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedYieldPlot.id}</h3>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">{selectedYieldPlot.name}</p>
                        </div>
                        <button onClick={() => setSelectedYieldPlot(null)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700">
                          <X size={15} />
                        </button>
                      </div>
                      <div className="bg-slate-900 p-3.5 rounded-xl text-white">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Yield Prediction Analysis</div>
                        <p className="text-xs font-medium italic leading-relaxed text-slate-100">
                          "Plot {selectedYieldPlot.id} is projected at {selectedYieldPlot.predictedYield} Tonnes total yield ({selectedYieldPlot.yieldValue} t/HA) with a prediction accuracy of {selectedYieldPlot.predAccuracy}. Status: {selectedYieldPlot.yieldStatus}."
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="h-24 bg-gray-50 rounded-xl p-2">
                          <Line data={{
                            labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                            datasets: [{
                              data: TIMELINE_DATA.map(t =>
                                selectedYieldPlot.id === 'PLOT-ALPHA' ? t.ndvi * 24.5 :
                                selectedYieldPlot.id === 'PLOT-BETA'  ? (t.ndvi - 0.15) * 19.5 : (t.ndvi - 0.05) * 21.5),
                              borderColor: '#16A34A', borderWidth: 2, backgroundColor: 'rgba(22,163,74,0.06)',
                              fill: true, tension: 0.3, pointRadius: 2
                            }]
                          }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                        </div>
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          {[
                            { label: 'Est. Yield Value',       value: `${selectedYieldPlot.yieldValue} t/HA`, color: 'text-green-600' },
                            { label: 'Projected Total Yield',  value: `${selectedYieldPlot.predictedYield} Tonnes`, color: 'text-emerald-700' },
                            { label: 'Prediction Accuracy',    value: selectedYieldPlot.predAccuracy, color: 'text-blue-600' },
                            { label: 'Biomass Output Index',   value: `${selectedYieldPlot.biomass} kg/m²`, color: 'text-gray-800' },
                            { label: 'Growth VCI',             value: selectedYieldPlot.growth,            color: 'text-gray-800' },
                            { label: 'Harvest Readiness',      value: `${selectedYieldPlot.readiness}%`,   color: 'text-orange-600' }
                          ].map((r, i) => (
                            <div key={i} className="flex justify-between text-xs font-semibold text-gray-600">
                              <span>{r.label}</span><span className={`font-bold ${r.color}`}>{r.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ═══ RIGHT MAP LAYERS SIDEBAR ═══ */}
                {yieldShowLayers && (
                  <div className="w-[280px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto z-10 shadow-sm animate-in slide-in-from-right duration-300">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers size={18} className="text-green-600" />
                        <span className="text-base font-bold text-gray-800 font-sans">Map Layers</span>
                      </div>
                      <button onClick={() => setYieldShowLayers(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-650 transition-all">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* OPERATIONAL SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Operational
                        </div>
                        
                        {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Farm Boundaries</div>
                              <span className="text-[10px] text-gray-400">Plot perimeter outlines</span>
                            </div>
                            <button
                              onClick={() => setYieldShowBoundaries(!yieldShowBoundaries)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                yieldShowBoundaries ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: yieldShowBoundaries ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                yieldShowBoundaries ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {yieldShowBoundaries && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{yieldBoundariesOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={yieldBoundariesOpacity}
                                onChange={e => setYieldBoundariesOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PRODUCTION SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Production Metrics
                        </div>
                        
                        {/* Est. Yield Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Estimated Yield</div>
                              <span className="text-[10px] text-gray-400">Yield in Tonnes/HA</span>
                            </div>
                            <button
                              onClick={() => handleYieldToggle('yield')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                yieldShowYield ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: yieldShowYield ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                yieldShowYield ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {yieldShowYield && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{yieldYieldOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={yieldYieldOpacity}
                                onChange={e => setYieldYieldOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (18t/HA+)', color: '#15803d' },
                                  { label: 'Mid (12–18t/HA)', color: '#22c55e' },
                                  { label: 'Low (8–12t/HA)', color: '#eab308' },
                                  { label: 'High Stress (<8t/HA)', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Biomass Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Biomass Output</div>
                              <span className="text-[10px] text-gray-400">Vegetation density mass</span>
                            </div>
                            <button
                              onClick={() => handleYieldToggle('biomass')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                yieldShowBiomass ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: yieldShowBiomass ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                yieldShowBiomass ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {yieldShowBiomass && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{yieldBiomassOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={yieldBiomassOpacity}
                                onChange={e => setYieldBiomassOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (2.0kg+)', color: '#15803d' },
                                  { label: 'Mid (1.3–2.0kg)', color: '#22c55e' },
                                  { label: 'Low (0.8–1.3kg)', color: '#eab308' },
                                  { label: 'Critical (<0.8kg)', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* STATUS SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Status & Conditions
                        </div>
                        
                        {/* Harvest Readiness Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Harvest Status</div>
                              <span className="text-[10px] text-gray-400">Maturity readiness ratio</span>
                            </div>
                            <button
                              onClick={() => handleYieldToggle('readiness')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                yieldShowReadiness ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: yieldShowReadiness ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                yieldShowReadiness ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {yieldShowReadiness && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{yieldReadinessOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={yieldReadinessOpacity}
                                onChange={e => setYieldReadinessOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Ready (85%+)', color: '#16a34a' },
                                  { label: 'Pending (65–85%)', color: '#eab308' },
                                  { label: 'Unready (<65%)', color: '#f97316' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Growth Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Growth Index</div>
                              <span className="text-[10px] text-gray-400">VCI condition score</span>
                            </div>
                            <button
                              onClick={() => handleYieldToggle('growth')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                yieldShowGrowth ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: yieldShowGrowth ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                yieldShowGrowth ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {yieldShowGrowth && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{yieldGrowthOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={yieldGrowthOpacity}
                                onChange={e => setYieldGrowthOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (0.7+)', color: '#15803d' },
                                  { label: 'Normal (0.55–0.7)', color: '#22c55e' },
                                  { label: 'Stressed (0.4–0.55)', color: '#eab308' },
                                  { label: 'Deficit (<0.4)', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ══ BOTTOM PANEL ══ */}
              {renderMapBottomPanel(
                yieldShowReadiness ? 'Harvest Status' :
                yieldShowGrowth ? 'Growth Index' :
                yieldShowBiomass ? 'Biomass Output' :
                yieldShowYield ? 'Est. Yield' : 'No Active Layer'
              )}
            </div>
          )}

          {activeSidebarItem === 'land-restoration' && (
            <div className="flex flex-col h-full">

              {/* ── Top area: Map + Right Legend sidebar ── */}
              <div className="flex flex-1 min-h-0">

                {/* ═══ MAP ═══ */}
                <div className="flex-1 relative min-w-0 map-wrapper-pane">
                  <MapContainer center={[7.138, 3.356]} zoom={15} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
                    
                    {isCompareMode ? (
                      <>
                        <MapPaneClipSetter
                          leftPaneName="left-pane-restore"
                          rightPaneName="right-pane-restore"
                          splitPosition={splitPosition}
                          isCompareMode={isCompareMode}
                        />
                        <Pane name="left-pane-restore" style={{ zIndex: 500 }}>
                          {restorationPlotsDataA.map(zone => (
                            <Polygon key={`${zone.id}-left`} positions={zone.coords}
                              pathOptions={getRestorePlotStyle(zone)}
                              eventHandlers={{ click: () => setSelectedRestoreZone(zone) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">RESTORATION (Left/Date A)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{zone.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {zone.area} · {zone.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Canopy Progress</span><span className="text-green-700 font-bold">{zone.progress}%</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Survival Rate</span><span className="text-emerald-700 font-bold">{zone.survival}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Carbon Offset</span><span className="text-yellow-700 font-bold">{zone.carbon} t</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Biodiversity</span><span className="text-blue-600 font-bold">{zone.biodiversity}</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                        <Pane name="right-pane-restore" style={{ zIndex: 501 }}>
                          {restorationPlotsDataB.map(zone => (
                            <Polygon key={`${zone.id}-right`} positions={zone.coords}
                              pathOptions={getRestorePlotStyle(zone)}
                              eventHandlers={{ click: () => setSelectedRestoreZone(zone) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">RESTORATION (Right/Date B)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{zone.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {zone.area} · {zone.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Canopy Progress</span><span className="text-green-700 font-bold">{zone.progress}%</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Survival Rate</span><span className="text-emerald-700 font-bold">{zone.survival}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Carbon Offset</span><span className="text-yellow-700 font-bold">{zone.carbon} t</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Biodiversity</span><span className="text-blue-600 font-bold">{zone.biodiversity}</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                      </>
                    ) : (
                      restorationPlotsData.map(zone => (
                        <Polygon key={zone.id} positions={zone.coords}
                          pathOptions={getRestorePlotStyle(zone)}
                          eventHandlers={{ click: () => setSelectedRestoreZone(zone) }}>
                          <Popup>
                            <div className="p-2 w-52 space-y-2 font-sans">
                              <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">RESTORATION TARGET LAYER</div>
                              <h4 className="text-sm font-bold text-gray-900">{zone.name}</h4>
                              <div className="text-xs text-gray-400">Area: {zone.area} · {zone.id}</div>
                              <div className="w-full h-px bg-gray-100" />
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Canopy Progress</span><span className="text-green-700 font-bold">{zone.progress}%</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Survival Rate</span><span className="text-emerald-700 font-bold">{zone.survival}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Carbon Offset</span><span className="text-yellow-700 font-bold">{zone.carbon} t</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Biodiversity</span><span className="text-blue-600 font-bold">{zone.biodiversity}</span>
                              </div>
                            </div>
                          </Popup>
                        </Polygon>
                      ))
                    )}
                    <ZoomControl position="bottomright" />
                    <ResizeMap trigger={restoreShowLayers} />
                  </MapContainer>

                  <SwipeSliderOverlay
                    isCompareMode={isCompareMode}
                    splitPosition={splitPosition}
                    currentTimelineA={currentTimelineA}
                    currentTimelineB={currentTimelineB}
                    handleSplitDragStart={handleSplitDragStart}
                  />

                  {/* Floating Basemap Selector (Top-Left) */}
                  <FloatingBasemapSelector />

                  {/* Floating map layers trigger */}
                  <button
                    onClick={() => setRestoreShowLayers(!restoreShowLayers)}
                    className={`absolute top-4 right-4 bg-white border p-3 rounded-2xl shadow-xl hover:bg-gray-50 flex items-center gap-2 font-bold text-xs transition-all active:scale-95 ${
                      restoreShowLayers ? 'text-green-700 border-green-200 bg-green-50 shadow-inner' : 'text-gray-700 border-gray-200 bg-white'
                    }`}
                    style={{ zIndex: 40000 }}
                  >
                    <Layers size={16} className={restoreShowLayers ? 'text-green-600' : 'text-gray-400'} />
                    Map Layers
                  </button>

                  {/* Plot detail panel (over map) */}
                  {selectedRestoreZone && (
                    <div className="absolute top-[76px] right-4 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 flex flex-col gap-4 pointer-events-auto animate-in slide-in-from-right-6 duration-300" style={{ zIndex: 10000 }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">Zone Restoration Ledger</div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedRestoreZone.id}</h3>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">{selectedRestoreZone.name}</p>
                        </div>
                        <button onClick={() => setSelectedRestoreZone(null)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700">
                          <X size={15} />
                        </button>
                      </div>
                      <div className="bg-slate-900 p-3.5 rounded-xl text-white">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Progress Summary</div>
                        <p className="text-xs font-medium italic leading-relaxed text-slate-100">
                          "Managing under supervisor {selectedRestoreZone.manager}. Currently showing {selectedRestoreZone.status} with {selectedRestoreZone.survival} seedling survival. Active carbon sequestered: {selectedRestoreZone.carbon} tCO2e."
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="h-24 bg-gray-50 rounded-xl p-2">
                          <Line data={{
                            labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                            datasets: [{
                              data: TIMELINE_DATA.map(t =>
                                selectedRestoreZone.id === 'ZONE-ALPHA' ? Math.min(100, Math.round(t.ndvi * 125)) :
                                selectedRestoreZone.id === 'ZONE-BETA'  ? Math.min(100, Math.round((t.ndvi - 0.15) * 115)) : Math.min(100, Math.round((t.ndvi - 0.05) * 105))),
                              borderColor: '#16A34A', borderWidth: 2, backgroundColor: 'rgba(22,163,74,0.06)',
                              fill: true, tension: 0.3, pointRadius: 2
                            }]
                          }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                        </div>
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          {[
                            { label: 'Canopy Density',      value: `${selectedRestoreZone.progress}%`, color: 'text-green-600' },
                            { label: 'Soil Carbon Stock',   value: `${selectedRestoreZone.carbon} tCO2e`, color: 'text-emerald-700' },
                            { label: 'Seedling Survival',   value: selectedRestoreZone.survival, color: 'text-blue-600' },
                            { label: 'Active Trees',        value: selectedRestoreZone.trees, color: 'text-gray-800' },
                            { label: 'Manager Assigned',    value: selectedRestoreZone.manager,            color: 'text-gray-800' },
                            { label: 'Growth Status',       value: selectedRestoreZone.status,   color: 'text-orange-600' }
                          ].map((r, i) => (
                            <div key={i} className="flex justify-between text-xs font-semibold text-gray-600">
                              <span>{r.label}</span><span className={`font-bold ${r.color}`}>{r.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ═══ RIGHT MAP LAYERS SIDEBAR ═══ */}
                {restoreShowLayers && (
                  <div className="w-[280px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto z-10 shadow-sm animate-in slide-in-from-right duration-300">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers size={18} className="text-green-600" />
                        <span className="text-base font-bold text-gray-800 font-sans">Map Layers</span>
                      </div>
                      <button onClick={() => setRestoreShowLayers(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-655 transition-all">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* OPERATIONAL SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Operational
                        </div>
                        
                        {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Farm Boundaries</div>
                              <span className="text-[10px] text-gray-400">Plot perimeter outlines</span>
                            </div>
                            <button
                              onClick={() => setRestoreShowBoundaries(!restoreShowBoundaries)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowBoundaries ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowBoundaries ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowBoundaries ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowBoundaries && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreBoundariesOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreBoundariesOpacity}
                                onChange={e => setRestoreBoundariesOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ECOLOGICAL PROGRESS SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Ecological Progress
                        </div>
                        
                        {/* Canopy Density Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Canopy Density</div>
                              <span className="text-[10px] text-gray-400">Reforestation Growth %</span>
                            </div>
                            <button
                              onClick={() => handleRestoreToggle('progress')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowProgress ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowProgress ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowProgress ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowProgress && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreProgressOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreProgressOpacity}
                                onChange={e => setRestoreProgressOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (85%+)', color: '#15803d' },
                                  { label: 'Good (70–85%)', color: '#22c55e' },
                                  { label: 'Mid (55–70%)', color: '#eab308' },
                                  { label: 'Initial (<55%)', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Seedling Survival Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Seedling Survival</div>
                              <span className="text-[10px] text-gray-400">Survival rate percentage</span>
                            </div>
                            <button
                              onClick={() => handleRestoreToggle('survival')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowSurvival ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowSurvival ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowSurvival ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowSurvival && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreSurvivalOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreSurvivalOpacity}
                                onChange={e => setRestoreSurvivalOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (90%+)', color: '#15803d' },
                                  { label: 'Good (85–90%)', color: '#22c55e' },
                                  { label: 'Low (<85%)', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Soil Carbon Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Soil Carbon Offset</div>
                              <span className="text-[10px] text-gray-400">Carbon stock (tCO2e)</span>
                            </div>
                            <button
                              onClick={() => handleRestoreToggle('carbon')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowCarbon ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowCarbon ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowCarbon ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowCarbon && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreCarbonOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreCarbonOpacity}
                                onChange={e => setRestoreCarbonOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (40t+)', color: '#15803d' },
                                  { label: 'Mid (30–40t)', color: '#22c55e' },
                                  { label: 'Low (<30t)', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Biodiversity Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Biodiversity</div>
                              <span className="text-[10px] text-gray-400">Species richness score</span>
                            </div>
                            <button
                              onClick={() => handleRestoreToggle('biodiversity')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowBiodiversity ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowBiodiversity ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowBiodiversity ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowBiodiversity && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreBiodiversityOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreBiodiversityOpacity}
                                onChange={e => setRestoreBiodiversityOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (90%+)', color: '#15803d' },
                                  { label: 'Good (80–90%)', color: '#22c55e' },
                                  { label: 'Low (<80%)', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ══ BOTTOM PANEL ══ */}
              {renderMapBottomPanel(
                restoreShowBiodiversity ? 'Biodiversity' :
                restoreShowCarbon ? 'Soil Carbon' :
                restoreShowSurvival ? 'Seedling Survival' :
                restoreShowProgress ? 'Canopy Density' : 'No Active Layer'
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              ALERTS COMMAND CENTER
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'alerts' && (
            <div className="p-10 space-y-8 animate-in fade-in duration-300">

              {/* ── PAGE HEADER ── */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                      <AlertTriangle size={20} className="text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-none">Alerts Command Center</h2>
                      <p className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">Live Anomaly Intelligence · Farmintelytics Agro Node</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                    Full real-time breakdown of all detected crop stress events, environmental anomalies, and satellite-flagged incidents — at a single glance.
                  </p>
                </div>

                {/* Live Status Banner */}
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">System Status</span>
                      <span className="text-sm font-bold text-gray-900">{alerts.filter(a => a.status === 'Active').length} Active · {alerts.filter(a => a.status === 'Acknowledged').length} Acknowledged</span>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-100 px-5 py-2.5 rounded-2xl flex items-center gap-2.5">
                    <Flame size={14} className="text-red-500" />
                    <span className="text-xs font-bold text-red-700">{alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length} Critical alerts require immediate action</span>
                  </div>
                </div>
              </div>

              {/* ── KPI STRIP ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Incidents',
                    value: alerts.length,
                    subtext: 'Historical & Active',
                    icon: <Database size={22} className="text-blue-600" />,
                    accent: '#EFF6FF', border: '#BFDBFE',
                    percent: 100, progressColor: '#3B82F6'
                  },
                  {
                    label: 'Critical Anomalies',
                    value: alerts.filter(a => a.status === 'Active' && a.severity === 'Critical').length,
                    subtext: 'Immediate Action',
                    icon: <AlertTriangle size={22} className="text-red-600" />,
                    accent: '#FEF2F2', border: '#FCA5A5',
                    percent: alerts.length ? Math.round((alerts.filter(a => a.status === 'Active' && a.severity === 'Critical').length / alerts.length) * 100) : 0,
                    progressColor: '#EF4444'
                  },
                  {
                    label: 'Active Warnings',
                    value: alerts.filter(a => a.status === 'Active' && a.severity === 'Warning').length,
                    subtext: 'Under Investigation',
                    icon: <Activity size={22} className="text-amber-500" />,
                    accent: '#FFFBEB', border: '#FDE68A',
                    percent: alerts.length ? Math.round((alerts.filter(a => a.status === 'Active' && a.severity === 'Warning').length / alerts.length) * 100) : 0,
                    progressColor: '#F59E0B'
                  },
                  {
                    label: 'Acknowledged',
                    value: alerts.filter(a => a.status === 'Acknowledged').length,
                    subtext: 'Addressed & Logged',
                    icon: <CheckCircle2 size={22} className="text-green-600" />,
                    accent: '#F0FDF4', border: '#BBF7D0',
                    percent: alerts.length ? Math.round((alerts.filter(a => a.status === 'Acknowledged').length / alerts.length) * 100) : 0,
                    progressColor: '#10B981'
                  }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[148px] group cursor-default">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{kpi.label}</span>
                        <span className="text-4xl font-extrabold text-gray-900 block tabular-nums">{kpi.value}</span>
                      </div>
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: kpi.accent, border: `1px solid ${kpi.border}` }}>
                        {kpi.icon}
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                        <span>{kpi.subtext}</span>
                        <span style={{ color: kpi.progressColor }}>{kpi.percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${kpi.percent}%`, backgroundColor: kpi.progressColor }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── PLOT ALERT MATRIX + CATEGORY BREAKDOWN ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Per-Plot Alert Matrix */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Target size={16} className="text-green-600" />
                      Plot-Level Alert Matrix
                    </h3>
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">Live Composite</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        plot: 'PLOT-ALPHA', name: 'West Valley Plot', estate: 'West Valley Estate',
                        alertCount: alerts.filter(a => a.plot === 'PLOT-ALPHA').length,
                        critical: alerts.filter(a => a.plot === 'PLOT-ALPHA' && a.severity === 'Critical').length,
                        warning: alerts.filter(a => a.plot === 'PLOT-ALPHA' && a.severity === 'Warning').length,
                        info: alerts.filter(a => a.plot === 'PLOT-ALPHA' && a.severity === 'Info').length,
                        status: alerts.filter(a => a.plot === 'PLOT-ALPHA' && a.status === 'Active').length === 0 ? 'Clear' : 'Active',
                        ndvi: (currentTimeline.ndvi + 0.04).toFixed(2),
                        color: '#16A34A'
                      },
                      {
                        plot: 'PLOT-BETA', name: 'East Ridge Plot', estate: 'East Ridge Estate',
                        alertCount: alerts.filter(a => a.plot === 'PLOT-BETA').length,
                        critical: alerts.filter(a => a.plot === 'PLOT-BETA' && a.severity === 'Critical').length,
                        warning: alerts.filter(a => a.plot === 'PLOT-BETA' && a.severity === 'Warning').length,
                        info: alerts.filter(a => a.plot === 'PLOT-BETA' && a.severity === 'Info').length,
                        status: alerts.filter(a => a.plot === 'PLOT-BETA' && a.status === 'Active').length === 0 ? 'Clear' : 'Active',
                        ndvi: (currentTimeline.ndvi - 0.15).toFixed(2),
                        color: '#EAB308'
                      },
                      {
                        plot: 'PLOT-GAMMA', name: 'South Slope Plot', estate: 'South Slope Estate',
                        alertCount: alerts.filter(a => a.plot === 'PLOT-GAMMA').length,
                        critical: alerts.filter(a => a.plot === 'PLOT-GAMMA' && a.severity === 'Critical').length,
                        warning: alerts.filter(a => a.plot === 'PLOT-GAMMA' && a.severity === 'Warning').length,
                        info: alerts.filter(a => a.plot === 'PLOT-GAMMA' && a.severity === 'Info').length,
                        status: alerts.filter(a => a.plot === 'PLOT-GAMMA' && a.status === 'Active').length === 0 ? 'Clear' : 'Active',
                        ndvi: (currentTimeline.ndvi - 0.05).toFixed(2),
                        color: '#0284C7'
                      }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                        {/* Plot dot */}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0" style={{ backgroundColor: row.color }}>
                          {i === 0 ? 'α' : i === 1 ? 'β' : 'γ'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-900">{row.plot}</span>
                            <span className="text-[10px] font-semibold text-gray-400">·</span>
                            <span className="text-[10px] font-semibold text-gray-500">{row.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-semibold">{row.estate}</span>
                            <span className="text-[10px] text-gray-300">·</span>
                            <span className="text-[10px] font-bold text-green-600">NDVI {row.ndvi}</span>
                          </div>
                        </div>
                        {/* Alert chips */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {row.critical > 0 && (
                            <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full">{row.critical} Critical</span>
                          )}
                          {row.warning > 0 && (
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">{row.warning} Warning</span>
                          )}
                          {row.info > 0 && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">{row.info} Info</span>
                          )}
                          {row.alertCount === 0 && (
                            <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">All Clear</span>
                          )}
                        </div>
                        {/* Status dot */}
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${row.status === 'Clear' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                      </div>
                    ))}
                  </div>

                  {/* Mini NDVI Health bar per plot */}
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
                    {[
                      { label: 'W. Valley', ndvi: currentTimeline.ndvi + 0.04, color: '#16A34A' },
                      { label: 'E. Ridge', ndvi: currentTimeline.ndvi - 0.15, color: '#EAB308' },
                      { label: 'S. Slope', ndvi: currentTimeline.ndvi - 0.05, color: '#0284C7' }
                    ].map((p, i) => (
                      <div key={i} className="text-center space-y-1.5">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">{p.label}</span>
                        <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, p.ndvi * 120)).toFixed(0)}%`, backgroundColor: p.color }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: p.color }}>NDVI {p.ndvi.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Heatmap */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Gauge size={16} className="text-green-600" />
                    Category Breakdown
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: 'Water Stress',
                        count: alerts.filter(a => a.category === 'Water Stress').length,
                        icon: <Droplets size={14} className="text-blue-600" />,
                        bg: '#EFF6FF', barColor: '#3B82F6', textColor: 'text-blue-700'
                      },
                      {
                        label: 'Pest Infestation',
                        count: alerts.filter(a => a.category === 'Pest Infestation').length,
                        icon: <Shield size={14} className="text-red-600" />,
                        bg: '#FEF2F2', barColor: '#EF4444', textColor: 'text-red-700'
                      },
                      {
                        label: 'Growth Deficit',
                        count: alerts.filter(a => a.category === 'Growth Deficit').length,
                        icon: <TrendingDown size={14} className="text-amber-600" />,
                        bg: '#FFFBEB', barColor: '#F59E0B', textColor: 'text-amber-700'
                      },
                      {
                        label: 'Cloud Cover',
                        count: alerts.filter(a => a.category === 'Cloud Cover').length,
                        icon: <CloudRain size={14} className="text-slate-600" />,
                        bg: '#F8FAFC', barColor: '#64748B', textColor: 'text-slate-600'
                      }
                    ].map((cat, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-gray-100 space-y-2 hover:shadow-sm transition-all" style={{ backgroundColor: cat.bg }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {cat.icon}
                            <span className={`text-xs font-bold ${cat.textColor}`}>{cat.label}</span>
                          </div>
                          <span className={`text-base font-extrabold ${cat.textColor} tabular-nums`}>{cat.count}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${alerts.length ? (cat.count / alerts.length) * 100 : 0}%`, backgroundColor: cat.barColor }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trend mini-chart */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">28-Day Incident Trend</span>
                    <div className="h-[80px]">
                      <Line
                        data={{
                          labels: ['May 02','May 08','May 14','May 20','May 26','May 30'],
                          datasets: [{
                            data: [2, 5, 3, 7, 6, 4],
                            borderColor: '#EF4444',
                            backgroundColor: 'rgba(239,68,68,0.07)',
                            fill: true, tension: 0.45,
                            borderWidth: 1.5, pointRadius: 2,
                            pointBackgroundColor: '#EF4444'
                          }]
                        }}
                        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── TIMELINE FEED + CHARTS ROW ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Live Incident Timeline */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Radio size={15} className="text-red-500 animate-pulse" />
                      Incident Timeline Feed
                    </h3>
                    <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Live</span>
                  </div>

                  <div className="space-y-0 relative">
                    {/* Vertical line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-100" />

                    {[...alerts].sort((a, b) => new Date(b.date) - new Date(a.date)).map((alert, i) => {
                      const dotColor = alert.severity === 'Critical' ? '#EF4444' : alert.severity === 'Warning' ? '#F59E0B' : '#3B82F6';
                      let catIcon = <AlertTriangle size={10} />;
                      if (alert.category === 'Water Stress') catIcon = <Droplets size={10} />;
                      else if (alert.category === 'Pest Infestation') catIcon = <Shield size={10} />;
                      else if (alert.category === 'Growth Deficit') catIcon = <TrendingDown size={10} />;
                      else if (alert.category === 'Cloud Cover') catIcon = <CloudRain size={10} />;

                      return (
                        <div key={alert.id} className="flex gap-4 py-3.5 group">
                          {/* Dot */}
                          <div className="relative z-10 w-10 h-10 shrink-0 flex items-center justify-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${alert.status === 'Active' ? 'animate-none' : 'opacity-50'}`}
                              style={{ backgroundColor: dotColor }}
                            >
                              {catIcon}
                            </div>
                          </div>
                          {/* Content */}
                          <div className="flex-1 min-w-0 pt-1.5">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-bold text-gray-900">{alert.category}</span>
                              <span
                                className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: alert.severity === 'Critical' ? '#FEF2F2' : alert.severity === 'Warning' ? '#FFFBEB' : '#EFF6FF', color: dotColor }}
                              >
                                {alert.severity}
                              </span>
                              {alert.status === 'Acknowledged' && (
                                <span className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full uppercase">✓ Acknowledged</span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed line-clamp-2">{alert.desc.substring(0, 90)}...</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-gray-400 font-semibold">{alert.plot} · {alert.date} at {alert.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Chart + Frequency Trend stacked */}
                <div className="space-y-5">
                  {/* Bar Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <BarChart4 size={15} className="text-green-600" />
                      Anomalies by Category
                    </h3>
                    <div className="h-[160px]">
                      <Bar data={alertsByCategoryData} options={BAR_CHART_OPTIONS} />
                    </div>
                  </div>

                  {/* Frequency Trend */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <LineChart size={15} className="text-green-600" />
                      Incident Frequency (28 days)
                    </h3>
                    <div className="h-[140px]">
                      <Line
                        data={{
                          labels: ['May 02', 'May 06', 'May 10', 'May 14', 'May 18', 'May 22', 'May 26', 'May 30'],
                          datasets: [{
                            label: 'Total Incidents',
                            data: [2, 5, 3, 8, 4, 6, 9, 4],
                            borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.05)',
                            fill: true, tension: 0.4, borderWidth: 2,
                            pointBackgroundColor: '#10B981', pointBorderColor: '#fff', pointHoverRadius: 5
                          }]
                        }}
                        options={{ ...CHART_DEFAULTS, plugins: { legend: { display: false } } }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── FULL ALERT LEDGER ── */}
              <div className="space-y-5">
                {/* Ledger Header + Filters */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <ListFilter size={16} className="text-green-600" />
                    <span className="text-sm font-bold text-gray-800">Full Incident Ledger</span>
                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">{alerts.length} total</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Severity */}
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Severity</span>
                      <select
                        value={filterAlertSeverity}
                        onChange={e => setFilterAlertSeverity(e.target.value)}
                        className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer pr-1"
                      >
                        <option value="All">All Severities</option>
                        <option value="Critical">Critical</option>
                        <option value="Warning">Warning</option>
                        <option value="Info">Info</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Status</span>
                      <select
                        value={filterAlertStatus}
                        onChange={e => setFilterAlertStatus(e.target.value)}
                        className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer pr-1"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Acknowledged">Acknowledged</option>
                      </select>
                    </div>

                    {(filterAlertSeverity !== 'All' || filterAlertStatus !== 'Active') && (
                      <button
                        onClick={() => { setFilterAlertSeverity('All'); setFilterAlertStatus('All'); }}
                        className="text-xs font-bold text-red-600 hover:text-red-800 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <X size={12} /> Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Alert Cards */}
                <div className="space-y-4">
                  {alerts.filter(alert => {
                    const matchSeverity = filterAlertSeverity === 'All' || alert.severity === filterAlertSeverity;
                    const matchStatus = filterAlertStatus === 'All' || alert.status === filterAlertStatus;
                    return matchSeverity && matchStatus;
                  }).length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-14 text-center flex flex-col items-center gap-4">
                      <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={28} className="text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900">All Clear!</h4>
                        <p className="text-xs text-gray-400 font-medium mt-1">No alerts match your current filter criteria.</p>
                      </div>
                    </div>
                  ) : (
                    alerts.filter(alert => {
                      const matchSeverity = filterAlertSeverity === 'All' || alert.severity === filterAlertSeverity;
                      const matchStatus = filterAlertStatus === 'All' || alert.status === filterAlertStatus;
                      return matchSeverity && matchStatus;
                    }).map((alert, alertIdx) => {
                      let catIcon = <AlertTriangle size={18} />;
                      if (alert.category === 'Water Stress') catIcon = <Droplets size={18} />;
                      else if (alert.category === 'Pest Infestation') catIcon = <Shield size={18} />;
                      else if (alert.category === 'Growth Deficit') catIcon = <TrendingDown size={18} />;
                      else if (alert.category === 'Cloud Cover') catIcon = <CloudRain size={18} />;

                      const severityColors = {
                        Critical: { bg: '#FEF2F2', border: '#FCA5A5', text: '#B91C1C', bar: '#EF4444', leftBorder: '#EF4444' },
                        Warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', bar: '#F59E0B', leftBorder: '#F59E0B' },
                        Info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', bar: '#3B82F6', leftBorder: '#3B82F6' }
                      }[alert.severity] || {};

                      const actionLabels = {
                        'Water Stress': 'Increase irrigation by 30% immediately.',
                        'Pest Infestation': 'Establish 150m chemical buffer zone.',
                        'Growth Deficit': 'Ground truth inspection within 48h.',
                        'Cloud Cover': 'Interpolation from adjacent pass dates.'
                      };

                      return (
                        <div
                          key={alert.id}
                          className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                            alert.status === 'Acknowledged' ? 'opacity-75' : ''
                          }`}
                          style={{
                            borderLeft: alert.status === 'Active' ? `4px solid ${severityColors.leftBorder}` : '1px solid #F3F4F6',
                            borderColor: alert.status === 'Active' ? undefined : '#F3F4F6'
                          }}
                        >
                          {/* Top colored stripe for critical */}
                          {alert.severity === 'Critical' && alert.status === 'Active' && (
                            <div className="h-0.5 w-full" style={{ backgroundColor: '#EF4444', opacity: 0.3 }} />
                          )}

                          <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-5">
                              {/* Icon Column */}
                              <div className="shrink-0">
                                <div
                                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                                  style={{ backgroundColor: severityColors.bg, border: `1px solid ${severityColors.border}` }}
                                >
                                  <span style={{ color: severityColors.bar }}>{catIcon}</span>
                                </div>
                              </div>

                              {/* Main Content */}
                              <div className="flex-1 min-w-0">
                                {/* Row 1: ID, severity, status */}
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="text-xs font-bold text-gray-400 font-mono">{alert.id}</span>
                                  <span
                                    className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border"
                                    style={{ backgroundColor: severityColors.bg, borderColor: severityColors.border, color: severityColors.bar }}
                                  >
                                    {alert.severity}
                                  </span>
                                  {alert.status === 'Active' ? (
                                    <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                      <CheckCircle2 size={9} />
                                      Acknowledged
                                    </span>
                                  )}
                                </div>

                                {/* Row 2: Category + Title */}
                                <h4 className="text-base font-bold text-gray-900 mb-1">{alert.category} — {alert.estate}</h4>

                                {/* Row 3: Plot, date/time */}
                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-semibold mb-3">
                                  <span className="flex items-center gap-1">
                                    <MapPin size={11} className="text-green-600" />
                                    <span className="font-bold text-green-700">{alert.plot}</span>
                                  </span>
                                  <span className="w-px h-3.5 bg-gray-200" />
                                  <span className="flex items-center gap-1">
                                    <Clock size={11} />
                                    {alert.date} at {alert.time}
                                  </span>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-500 leading-relaxed font-medium bg-gray-50/60 rounded-xl px-4 py-3 border border-gray-100 mb-3">
                                  {alert.desc}
                                </p>

                                {/* Recommended Action */}
                                <div className="flex items-start gap-2.5 bg-amber-50/60 border border-amber-100 rounded-xl px-4 py-2.5">
                                  <Zap size={12} className="text-amber-600 mt-0.5 shrink-0" />
                                  <span className="text-[11px] font-bold text-amber-800">
                                    Recommended: {actionLabels[alert.category] || 'Ground truth inspection required.'}
                                  </span>
                                </div>
                              </div>

                              {/* Actions Column */}
                              <div className="flex flex-col gap-2 shrink-0 justify-center">
                                <button
                                  onClick={() => {
                                    setActiveSidebarItem('crop-health');
                                    const matchingPlot = healthPlotsData.find(p => p.id === alert.plot);
                                    if (matchingPlot) setSelectedHealthPlot(matchingPlot);
                                  }}
                                  className="flex items-center gap-2 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-700 border border-gray-200 hover:border-green-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm whitespace-nowrap"
                                >
                                  <Navigation size={12} />
                                  Map View
                                </button>

                                <button
                                  onClick={() => {
                                    setAlerts(prev => prev.map(a =>
                                      a.id === alert.id
                                        ? { ...a, status: a.status === 'Active' ? 'Acknowledged' : 'Active' }
                                        : a
                                    ));
                                  }}
                                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm border whitespace-nowrap ${
                                    alert.status === 'Acknowledged'
                                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                                  }`}
                                >
                                  <CheckSquare size={12} />
                                  {alert.status === 'Active' ? 'Acknowledge' : 'Re-Activate'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Agronomic Footer Banner */}
                <div className="p-6 rounded-2xl border bg-gradient-to-br from-green-50/60 to-emerald-50/30 border-green-100/80 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield size={16} className="text-green-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-green-800 mb-1">Agronomic Response Protocol</h4>
                    <p className="text-xs text-green-700 leading-relaxed font-medium">
                      All anomalies are auto-detected using daily Sentinel-2 L2A composites benchmarked against 6-month NDVI/NDMI baselines.
                      <span className="font-bold"> Critical alerts mandate ground truth or irrigation response within 24 hours</span> to avoid yield loss.
                      Acknowledged incidents are archived in the MRV compliance ledger for audit.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              CLIMATE
          ══════════════════════════════════════════════════════════════ */}
          {/* ══════════════════════════════════════════════════════════════
              CLIMATE MAP VIEW
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'climate' && (
            <div className="flex flex-col h-full">

              {/* ── Top area: Map + Right Legend sidebar ── */}
              <div className="flex flex-1 min-h-0">

                {/* ═══ MAP ═══ */}
                <div className="flex-1 relative min-w-0 map-wrapper-pane">
                  <MapContainer center={[7.145, 3.361]} zoom={14} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
                    
                    {isCompareMode ? (
                      <>
                        <MapPaneClipSetter
                          leftPaneName="left-pane-climate"
                          rightPaneName="right-pane-climate"
                          splitPosition={splitPosition}
                          isCompareMode={isCompareMode}
                        />
                        <Pane name="left-pane-climate" style={{ zIndex: 500 }}>
                          {climatePlotsDataA.map(plot => (
                            <Polygon key={`${plot.id}-left`} positions={plot.coords}
                              pathOptions={getClimatePlotStyle(plot)}
                              eventHandlers={{ click: () => setSelectedClimatePlot(plot) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">CLIMATE (Left/Date A)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Rainfall</span><span className="text-blue-600 font-bold">{plot.rainfall} mm</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Soil Temperature</span><span className="text-orange-600 font-bold">{plot.soilTemp} °C</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Surface Temp (LST)</span><span className="text-red-500 font-bold">{plot.lst} °C</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                        <Pane name="right-pane-climate" style={{ zIndex: 501 }}>
                          {climatePlotsDataB.map(plot => (
                            <Polygon key={`${plot.id}-right`} positions={plot.coords}
                              pathOptions={getClimatePlotStyle(plot)}
                              eventHandlers={{ click: () => setSelectedClimatePlot(plot) }}>
                              <Popup>
                                <div className="p-2 w-52 space-y-2 font-sans">
                                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">CLIMATE (Right/Date B)</div>
                                  <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                                  <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                                  <div className="w-full h-px bg-gray-100" />
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Rainfall</span><span className="text-blue-600 font-bold">{plot.rainfall} mm</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Soil Temperature</span><span className="text-orange-600 font-bold">{plot.soilTemp} °C</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>Surface Temp (LST)</span><span className="text-red-500 font-bold">{plot.lst} °C</span>
                                  </div>
                                </div>
                              </Popup>
                            </Polygon>
                          ))}
                        </Pane>
                      </>
                    ) : (
                      climatePlotsData.map(plot => (
                        <Polygon key={plot.id} positions={plot.coords}
                          pathOptions={getClimatePlotStyle(plot)}
                          eventHandlers={{ click: () => setSelectedClimatePlot(plot) }}>
                          <Popup>
                            <div className="p-2 w-52 space-y-2 font-sans">
                              <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">SENSOR TELEMETRY LEDGER</div>
                              <h4 className="text-sm font-bold text-gray-900">{plot.name}</h4>
                              <div className="text-xs text-gray-400">Area: {plot.area} · {plot.id}</div>
                              <div className="w-full h-px bg-gray-100" />
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Rainfall</span><span className="text-blue-600 font-bold">{plot.rainfall} mm</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Soil Temperature</span><span className="text-orange-600 font-bold">{plot.soilTemp} °C</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold">
                                <span>Surface Temp (LST)</span><span className="text-red-500 font-bold">{plot.lst} °C</span>
                              </div>
                            </div>
                          </Popup>
                        </Polygon>
                      ))
                    )}
                    <ZoomControl position="bottomright" />
                    <ResizeMap trigger={climateShowLayers} />
                  </MapContainer>

                  <SwipeSliderOverlay
                    isCompareMode={isCompareMode}
                    splitPosition={splitPosition}
                    currentTimelineA={currentTimelineA}
                    currentTimelineB={currentTimelineB}
                    handleSplitDragStart={handleSplitDragStart}
                  />

                  {/* Floating Basemap Selector (Top-Left) */}
                  <FloatingBasemapSelector />

                  {/* Floating map layers trigger */}
                  <button
                    onClick={() => setClimateShowLayers(!climateShowLayers)}
                    className={`absolute top-4 right-4 bg-white border p-3 rounded-2xl shadow-xl hover:bg-gray-55 flex items-center gap-2 font-bold text-xs transition-all active:scale-95 ${
                      climateShowLayers ? 'text-green-700 border-green-200 bg-green-50 shadow-inner' : 'text-gray-700 border-gray-200 bg-white'
                    }`}
                    style={{ zIndex: 40000 }}
                  >
                    <Layers size={16} className={climateShowLayers ? 'text-green-600' : 'text-gray-400'} />
                    Map Layers
                  </button>

                  {/* Plot detail panel (over map) */}
                  {selectedClimatePlot && (
                    <div className="absolute top-[76px] right-4 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 flex flex-col gap-4 pointer-events-auto animate-in slide-in-from-right-6 duration-300" style={{ zIndex: 10000 }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">Climate & Sensors</div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedClimatePlot.id}</h3>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">{selectedClimatePlot.name}</p>
                        </div>
                        <button onClick={() => setSelectedClimatePlot(null)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700">
                          <X size={15} />
                        </button>
                      </div>
                      <div className="bg-slate-900 p-3.5 rounded-xl text-white">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Station Feed</div>
                        <p className="text-xs font-medium italic leading-relaxed text-slate-100">
                          "Telemetry feed active from Abeokuta MET station. Sensor node battery status: 94%. Current relative humidity: 68%. VPD transpiration stress level: {selectedClimatePlot.vpd} kPa."
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="h-24 bg-gray-50 rounded-xl p-2">
                          <Line data={{
                            labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                            datasets: [{
                              data: TIMELINE_DATA.map((t, idx) =>
                                selectedClimatePlot.id === 'PLOT-ALPHA' ? 12 + idx * 4 :
                                selectedClimatePlot.id === 'PLOT-BETA'  ? 10 + idx * 3 : 11 + idx * 4),
                              borderColor: '#1D4ED8', borderWidth: 2, backgroundColor: 'rgba(29,78,216,0.06)',
                              fill: true, tension: 0.3, pointRadius: 2
                            }]
                          }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                        </div>
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          {[
                            { label: 'Rainfall (mm)',     value: `${selectedClimatePlot.rainfall} mm`, color: 'text-blue-600' },
                            { label: 'Soil Temp (°C)',    value: `${selectedClimatePlot.soilTemp} °C`, color: 'text-orange-600' },
                            { label: 'Surface LST (°C)',  value: `${selectedClimatePlot.lst} °C`,      color: 'text-red-500' },
                            { label: 'VPD Transpiration', value: `${selectedClimatePlot.vpd} kPa`,     color: 'text-gray-800' }
                          ].map((r, i) => (
                            <div key={i} className="flex justify-between text-xs font-semibold text-gray-600">
                              <span>{r.label}</span><span className={`font-bold ${r.color}`}>{r.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ═══ RIGHT MAP LAYERS SIDEBAR ═══ */}
                {climateShowLayers && (
                  <div className="w-[280px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto z-10 shadow-sm animate-in slide-in-from-right duration-300">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers size={18} className="text-green-600" />
                        <span className="text-base font-bold text-gray-800 font-sans">Map Layers</span>
                      </div>
                      <button onClick={() => setClimateShowLayers(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-655 transition-all">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* OPERATIONAL SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Operational
                        </div>
                        
                        {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Farm Boundaries</div>
                              <span className="text-[10px] text-gray-400">Plot perimeter outlines</span>
                            </div>
                            <button
                              onClick={() => setClimateShowBoundaries(!climateShowBoundaries)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                climateShowBoundaries ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: climateShowBoundaries ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                climateShowBoundaries ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {climateShowBoundaries && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{climateBoundariesOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={climateBoundariesOpacity}
                                onChange={e => setClimateBoundariesOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BIOPHYSICAL SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Biophysical
                        </div>
                        
                        {/* Precipitation Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight font-sans">Precipitation</div>
                              <span className="text-[10px] text-gray-400">Rainfall volume mm</span>
                            </div>
                            <button
                              onClick={() => handleClimateToggle('rainfall')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                climateShowRainfall ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: climateShowRainfall ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                climateShowRainfall ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {climateShowRainfall && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{climateRainfallOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={climateRainfallOpacity}
                                onChange={e => setClimateRainfallOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (25mm+)', color: '#1d4ed8' },
                                  { label: 'Mid (18–25mm)', color: '#3b82f6' },
                                  { label: 'Low (<18mm)', color: '#93c5fd' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Soil Temp Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Soil Temp</div>
                              <span className="text-[10px] text-gray-400">Root zone sensor temp</span>
                            </div>
                            <button
                              onClick={() => handleClimateToggle('soilTemp')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                climateShowSoilTemp ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: climateShowSoilTemp ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                climateShowSoilTemp ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {climateShowSoilTemp && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{climateSoilTempOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={climateSoilTempOpacity}
                                onChange={e => setClimateSoilTempOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (>29°C)', color: '#ef4444' },
                                  { label: 'Normal (25–29°C)', color: '#f97316' },
                                  { label: 'Cool (<25°C)', color: '#10b981' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ATMOSPHERE SECTION */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <ChevronDown size={12} /> Atmosphere
                        </div>
                        
                        {/* LST Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">Surface Temp (LST)</div>
                              <span className="text-[10px] text-gray-400">Land surface temperature</span>
                            </div>
                            <button
                              onClick={() => handleClimateToggle('lst')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                climateShowLst ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: climateShowLst ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                climateShowLst ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {climateShowLst && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{climateLstOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={climateLstOpacity}
                                onChange={e => setClimateLstOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (>36°C)', color: '#b91c1c' },
                                  { label: 'Moderate (30–36°C)', color: '#ef4444' },
                                  { label: 'Normal (25–30°C)', color: '#f97316' },
                                  { label: 'Cool (<25°C)', color: '#10b981' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* VPD Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight">VPD Stress</div>
                              <span className="text-[10px] text-gray-400">Vapor Pressure Deficit</span>
                            </div>
                            <button
                              onClick={() => handleClimateToggle('vpd')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                climateShowVaporDeficit ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: climateShowVaporDeficit ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                climateShowVaporDeficit ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {climateShowVaporDeficit && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{climateVaporDeficitOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={climateVaporDeficitOpacity}
                                onChange={e => setClimateVaporDeficitOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (>2.2 kPa)', color: '#ef4444' },
                                  { label: 'Moderate (1.5–2.2 kPa)', color: '#f97316' },
                                  { label: 'Low (<1.5 kPa)', color: '#10b981' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ══ BOTTOM PANEL ══ */}
              {renderMapBottomPanel(
                climateShowVaporDeficit ? 'VPD Stress' :
                climateShowLst ? 'Surface Temp' :
                climateShowSoilTemp ? 'Soil Temp' :
                climateShowRainfall ? 'Precipitation' : 'No Active Layer'
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VERIFICATION
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'dashboard' && activeTab === 'verification' && (
            <div className="p-10 space-y-10 animate-in fade-in duration-300">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Verification & MRV Audit Ledger</h2>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  Measurement, Reporting, and Verification logs for smallholder groups and industrial certification.
                </p>
              </div>

              {/* Plot selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plotsData.map(plot => (
                  <button
                    key={plot.id}
                    onClick={() => setSelectedVerifyPlot(plot.id)}
                    className={`bg-white p-7 rounded-2xl border text-left shadow-sm flex flex-col gap-5 transition-all hover:shadow-md ${
                      selectedVerifyPlot === plot.id ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-base font-bold text-gray-900 block">{plot.id}</span>
                        <span className="text-sm text-gray-500 font-medium block mt-1">{plot.name}</span>
                      </div>
                      <HealthBadge health={plot.health} />
                    </div>
                    <div className="w-full pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-400 font-medium block mb-0.5">NDVI</span>
                        <span className="text-sm font-bold text-green-700">{plot.ndvi.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 font-medium block mb-0.5">NDMI</span>
                        <span className="text-sm font-bold text-blue-700">{plot.ndmi.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 font-medium block mb-0.5">Area</span>
                        <span className="text-sm font-bold text-gray-700">{plot.area}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Verification checklist */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                      <Shield size={18} className="text-green-600" />
                      Verification Checklist — <span className="text-green-600">{selectedVerifyPlot}</span>
                    </h3>
                    <p className="text-sm text-gray-400 font-medium mt-1.5">Run interactive validation scans against satellite and cadastral data.</p>
                  </div>
                  <button
                    disabled={isVerifying}
                    onClick={triggerVerificationAudit}
                    className="text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 hover:opacity-90 shrink-0"
                    style={{ backgroundColor: '#16A34A' }}
                  >
                    {isVerifying
                      ? <><RefreshCw className="animate-spin" size={15} /> Auditing...</>
                      : <><Activity size={15} /> Run Validation Check</>}
                  </button>
                </div>

                <div className="space-y-4">
                  {Object.entries(verificationSteps).map(([key, step], idx) => (
                    <div key={key} className="flex gap-5 items-start p-5 rounded-2xl bg-gray-50/60 border border-gray-100">
                      {/* Status icon */}
                      <div className="shrink-0 mt-0.5">
                        {step.status === 'idle' && (
                          <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-400 bg-white font-bold">
                            {idx + 1}
                          </div>
                        )}
                        {step.status === 'scanning' && (
                          <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-50">
                            <RefreshCw className="animate-spin text-green-600" size={14} />
                          </div>
                        )}
                        {step.status === 'success' && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#16A34A' }}>
                            <CheckCircle2 size={15} />
                          </div>
                        )}
                        {step.status === 'warning' && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#EF4444' }}>
                            <AlertTriangle size={15} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">{step.label}</span>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shrink-0 ${
                            step.status === 'success'  ? 'bg-green-50 text-green-700' :
                            step.status === 'warning'  ? 'bg-red-50 text-red-700' :
                            step.status === 'scanning' ? 'bg-blue-50 text-blue-700 animate-pulse' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {step.status === 'success' ? 'Passed' : step.status === 'warning' ? 'Alert' : step.status === 'scanning' ? 'Scanning' : 'Queued'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mt-1.5 leading-normal">{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {verificationStatus === 'completed' && (
                  <div className="bg-green-50 border border-green-200 p-5 rounded-2xl flex items-start gap-4 animate-in fade-in duration-300">
                    <Shield className="text-green-600 shrink-0 mt-0.5" size={22} />
                    <div>
                      <span className="text-sm font-bold text-green-800 block mb-1">Verification Complete</span>
                      <span className="text-sm text-green-700 leading-relaxed">
                        {selectedVerifyPlot === 'PLOT-BETA'
                          ? 'Deforestation check passed, but moisture deficit triggers an alert. Soil health review is recommended.'
                          : 'Plot boundaries and vegetative health indices match standard guidelines. MRV registry record has been generated.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── CARBON ACCOUNTING & GEOSPATIAL REGISTRY PANEL ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                      <Globe size={18} className="text-green-600" />
                      Carbon Accounting & Geospatial Registry
                    </h3>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 uppercase">
                      VCS Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    Continuous monitoring of carbon sequestration indices, baseline soil organic carbon (SOC), and canopy density mapping.
                  </p>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Trees size={16} className="text-green-600" />
                        <div>
                          <span className="text-xs font-bold text-gray-700 block">Est. Sequestration</span>
                          <span className="text-[10px] text-gray-400">Canopy accumulation rate</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-green-700">
                        {selectedVerifyPlot === 'PLOT-ALPHA' ? '3.42 tCO2e/HA/yr' : selectedVerifyPlot === 'PLOT-BETA' ? '1.85 tCO2e/HA/yr' : '2.94 tCO2e/HA/yr'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Database size={16} className="text-green-600" />
                        <div>
                          <span className="text-xs font-bold text-gray-700 block">Baseline Soil Carbon (SOC)</span>
                          <span className="text-[10px] text-gray-400">Calculated via Sentinel-2 SWIR</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {selectedVerifyPlot === 'PLOT-ALPHA' ? '42.8 g/kg' : selectedVerifyPlot === 'PLOT-BETA' ? '31.2 g/kg' : '38.5 g/kg'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <div>
                          <span className="text-xs font-bold text-gray-700 block">Registry Submission</span>
                          <span className="text-[10px] text-gray-400">VCS/Gold Standard overlap</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        selectedVerifyPlot === 'PLOT-BETA' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {selectedVerifyPlot === 'PLOT-BETA' ? 'Pending Review' : '100% Compliant'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── TRACEABILITY & ENVIRONMENTAL IMPACT MONITORING CHAIN ── */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                      <Shield size={18} className="text-green-600" />
                      Traceability & Environmental Impact
                    </h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 uppercase">
                      Deforestation Free
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    End-to-end supply chain validation tracking biomass origin from coordinates to certification.
                  </p>

                  <div className="relative pl-6 border-l border-gray-200 ml-3 space-y-5 pt-2">
                    <div className="relative">
                      <div className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-green-500 border border-green-600 flex items-center justify-center shadow-sm">
                        <Check size={8} className="text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">GPS Boundary Validation</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">Plot perimeter overlap verified within Cadastral registry with zero spatial buffer conflicts.</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full bg-green-500 border border-green-600 flex items-center justify-center shadow-sm">
                        <Check size={8} className="text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">EUDR Compliance Scan</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">Deforestation compliance verified. Continuous canopy monitoring registers no forest-clearing events.</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[30px] top-0.5 w-4 h-4 rounded-full border border-white flex items-center justify-center shadow-sm ${
                        selectedVerifyPlot === 'PLOT-BETA' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'
                      }`}>
                        <Check size={8} className="text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Climate-Smart Practices Audit</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {selectedVerifyPlot === 'PLOT-BETA' 
                            ? 'Moisture stress anomaly detected in canopy index. Review of sub-surface cover status recommended.'
                            : 'Optimal intercropping and canopy coverage ratios match required VCS climate-smart guidelines.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              REPORTS
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'dashboard' && activeTab === 'reports' && (
            <div className="p-10 space-y-10 animate-in fade-in duration-300">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Analytical Ledger Reports</h2>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  Export verified geospatial datasets, CSV ledger tables, and printable PDF documents.
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Config card */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-base font-bold text-gray-900 pb-4 border-b border-gray-100 flex items-center gap-2.5">
                    <Settings2 size={18} className="text-green-600" />
                    Configure Report
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Report Scope</label>
                      <select
                        value={reportPlot}
                        onChange={(e) => setReportPlot(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none cursor-pointer focus:border-green-500 text-gray-700"
                      >
                        <option value="WHOLE-FARM">Whole Farm (Aggregate)</option>
                        <option value="PLOT-ALPHA">PLOT-ALPHA — West Valley Plot</option>
                        <option value="PLOT-BETA">PLOT-BETA — East Ridge Plot</option>
                        <option value="PLOT-GAMMA">PLOT-GAMMA — South Slope Plot</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Analytical Metric</label>
                      <select
                        value={reportIndex}
                        onChange={(e) => setReportIndex(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none cursor-pointer focus:border-green-500 text-gray-700"
                      >
                        <option value="NDVI">NDVI — Vegetation Health</option>
                        <option value="NDMI">NDMI — Soil Moisture</option>
                        <option value="NDWI">NDWI — Water Hydrology</option>
                        <option value="SOC">SOC — Soil Organic Carbon</option>
                        <option value="AGB">AGB — Aboveground Biomass Carbon</option>
                      </select>
                    </div>
                    <button
                      onClick={triggerReportGeneration}
                      disabled={isGeneratingReport}
                      className="w-full text-white font-bold text-sm py-3.5 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 hover:opacity-90"
                      style={{ backgroundColor: '#16A34A' }}
                    >
                      {isGeneratingReport
                        ? <><RefreshCw className="animate-spin" size={15} /> Generating...</>
                        : <><Download size={15} /> Generate Report PDF</>}
                    </button>
                  </div>
                </div>

                {/* Result card */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm xl:col-span-2 min-h-[360px] flex flex-col justify-center items-center">
                  {isGeneratingReport && (
                    <div className="w-full max-w-md space-y-6 animate-in fade-in duration-200 text-center">
                      <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto">
                        <RefreshCw className="animate-spin" size={24} />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-base font-bold text-gray-800">Processing Spatial Report</h4>
                        <p className="text-sm text-gray-400">{reportProgressText}</p>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${reportProgress}%`, backgroundColor: '#16A34A' }}></div>
                      </div>
                      <span className="text-sm font-bold text-green-700">{reportProgress}% complete</span>
                    </div>
                  )}
                  {!isGeneratingReport && !generatedReport && (
                    <div className="text-center space-y-3 py-10">
                      <FileSpreadsheet size={48} className="text-gray-300 mx-auto" />
                      <h4 className="text-base font-bold text-gray-500 mt-2">No Report Generated Yet</h4>
                      <p className="text-sm text-gray-400 max-w-xs leading-relaxed mx-auto">
                        Configure the details on the left and click Generate to create a verified PDF audit sheet.
                      </p>
                    </div>
                  )}
                  {!isGeneratingReport && generatedReport && (() => {
                    const isWholeFarm = reportPlot === 'WHOLE-FARM';
                    
                    const chartData = {
                      labels: isWholeFarm 
                        ? ['West Valley (Plot Alpha)', 'East Ridge (Plot Beta)', 'South Slope (Plot Gamma)']
                        : ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                      datasets: [{
                        label: `${reportIndex} Value`,
                        data: isWholeFarm 
                          ? (() => {
                              if (reportIndex === 'SOC') return [42.8, 31.2, 38.5];
                              if (reportIndex === 'AGB') return [124.5, 82.4, 105.8];
                              if (reportIndex === 'NDVI') return [0.76, 0.45, 0.62];
                              if (reportIndex === 'NDMI') return [0.42, 0.30, 0.36];
                              return [0.38, 0.25, 0.32];
                            })()
                          : TIMELINE_DATA.map((t, idx) => {
                              const baseVal = reportIndex === 'SOC' ? (reportPlot === 'PLOT-ALPHA' ? 42.8 : reportPlot === 'PLOT-BETA' ? 31.2 : 38.5)
                                             : reportIndex === 'AGB' ? (reportPlot === 'PLOT-ALPHA' ? 124.5 : reportPlot === 'PLOT-BETA' ? 82.4 : 105.8)
                                             : reportIndex === 'NDVI' ? t.ndvi
                                             : t.ndmi;
                              if (reportIndex === 'SOC' || reportIndex === 'AGB') {
                                return parseFloat((baseVal * (0.95 + idx * 0.025)).toFixed(1));
                              }
                              const offset = reportPlot === 'PLOT-ALPHA' ? 0.04 : reportPlot === 'PLOT-BETA' ? -0.15 : -0.05;
                              return parseFloat((baseVal + offset).toFixed(2));
                            }),
                        backgroundColor: isWholeFarm 
                          ? ['rgba(22, 163, 74, 0.85)', 'rgba(234, 179, 8, 0.85)', 'rgba(2, 132, 199, 0.85)']
                          : 'rgba(22, 163, 74, 0.1)',
                        borderColor: isWholeFarm ? '#ffffff' : '#16A34A',
                        borderWidth: isWholeFarm ? 0 : 2.5,
                        fill: !isWholeFarm,
                        tension: 0.3,
                        pointRadius: 3
                      }]
                    };

                    const chartOptions = {
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 10, weight: '605' } } },
                        x: { grid: { display: false }, ticks: { font: { size: 10, weight: '605' } } }
                      }
                    };

                    const getReportInsight = () => {
                      const scopeText = isWholeFarm ? 'the Whole Farm aggregate' : `Plot ${reportPlot}`;
                      const metricName = {
                        NDVI: 'Vegetation Vigor (NDVI)',
                        NDMI: 'Soil Canopy Moisture (NDMI)',
                        NDWI: 'Water Hydrology (NDWI)',
                        SOC: 'Soil Organic Carbon (SOC)',
                        AGB: 'Aboveground Biomass (AGB)'
                      }[reportIndex] || reportIndex;
                      
                      if (isWholeFarm) {
                        return `Spatial verification of the Whole Farm indicates high performance across the primary vegetative bands. West Valley (Plot Alpha) leads with optimal carbon density. East Ridge (Plot Beta) continues to register minor moisture stress anomalies. Overall forest canopy coverage complies with the EUDR regulatory baseline, confirming 100% deforestation-free integrity.`;
                      }
                      if (reportPlot === 'PLOT-BETA') {
                        return `Spatial audit of Plot Beta (East Ridge) reveals suppressed moisture index levels. Vegetative health remains moderate, but root-zone transpiration stress is elevated. Recommendation: Increase irrigation frequency by 25% and introduce multi-species cover crop systems to prevent further degradation.`;
                      }
                      return `Diagnostic review of ${scopeText} shows optimal values for ${metricName}. Canopy density trajectories remain stable with zero forest loss anomalies. The plot is verified compliant with carbon registry baselines and is recommended for VCS credit issuance.`;
                    };

                    return (
                      <div className="w-full space-y-8 animate-in fade-in duration-300">
                        {/* Premium Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-gray-100 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                              <FileText size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900">Farmintelytics Spatial MRV Certificate</h4>
                              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Voluntary Carbon & Forest Registry Document</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 self-start sm:self-auto">
                            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Verified Compliance
                            </span>
                            <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                              {generatedReport.id}
                            </span>
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                          {[
                            { label: 'Scope Target', value: isWholeFarm ? 'Whole Farm Aggregate' : generatedReport.plot },
                            { label: 'Metric Analyzed', value: generatedReport.index },
                            { label: 'Mean Value', value: generatedReport.meanVal, color: 'text-green-700 font-extrabold' },
                            { label: 'Generated At', value: generatedReport.date }
                          ].map((row, i) => (
                            <div key={i}>
                              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">{row.label}</span>
                              <span className={`text-xs font-bold ${row.color || 'text-gray-800'}`}>{row.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Graph Section */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                            <LineChart size={14} className="text-green-600" />
                            {isWholeFarm ? 'Spatial Comparative Chart' : 'Temporal Historical Trend'}
                          </h5>
                          <div className="h-[180px] bg-white p-4 rounded-2xl border border-gray-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
                            {isWholeFarm ? (
                              <Bar data={chartData} options={chartOptions} />
                            ) : (
                              <Line data={chartData} options={chartOptions} />
                            )}
                          </div>
                        </div>

                        {/* Dynamic Insights Block */}
                        <div className="p-5 bg-green-50/40 border border-green-100 rounded-2xl space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-800 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-green-600 animate-pulse" />
                            Automated Agronomic Diagnostic Insight
                          </span>
                          <p className="text-xs text-green-700 font-semibold leading-relaxed">
                            {getReportInsight()}
                          </p>
                        </div>

                        {/* PDF Registry footer bar */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-5 border-t border-gray-100 gap-4">
                          <div>
                            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Registry Compliance Status</span>
                            <span className="text-xs font-bold text-green-800 flex items-center gap-1.5 mt-0.5">
                              <CheckCircle2 size={12} className="text-green-600" /> Approved, VCS Compliant & Digitally Signed
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs px-5 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors shadow-sm active:scale-98">
                              Export CSV Data
                            </button>
                            <button className="flex items-center gap-2 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-sm hover:opacity-90 active:scale-98" style={{ backgroundColor: '#16A34A' }}>
                              <Download size={13} /> Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* ── PRE-COMPILED THEMATIC REPORTS SHOWCASE ── */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                    <FileText size={18} className="text-green-600" />
                    Verified Sustainability & Environmental Reports
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mt-1.5">
                    Pre-compiled carbon offsets, land restoration metrics, and environmental compliance logs verified by remote sensing nodes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* Theme 1 Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all h-[240px]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-green-50 text-green-700 rounded-xl">
                          <Leaf size={16} />
                        </div>
                        <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 uppercase">
                          Climate-Smart
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-snug">Carbon Credits & Climate-Smart Ag</h4>
                        <p className="text-[11px] text-gray-400 leading-normal mt-1">Verified carbon offsets, tillage performance, and nitrogen efficiency metrics.</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-gray-50">
                      <div className="flex justify-between text-xs font-semibold text-gray-500">
                        <span>Total Sequestration</span>
                        <span className="text-green-600 font-bold">124.5 tCO2e</span>
                      </div>
                      <button 
                        onClick={() => {
                          setReportPlot('PLOT-ALPHA');
                          setReportIndex('SOC');
                          triggerReportGeneration();
                        }}
                        className="w-full text-center py-2 bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-600 text-xs font-bold rounded-xl border border-gray-200 hover:border-green-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Download size={12} /> Compile PDF
                      </button>
                    </div>
                  </div>

                  {/* Theme 2 Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all h-[240px]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-yellow-50 text-yellow-700 rounded-xl">
                          <Trees size={16} />
                        </div>
                        <span className="text-[9px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200 uppercase">
                          Restoration
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-snug">Agroforestry & Land Restoration</h4>
                        <p className="text-[11px] text-gray-400 leading-normal mt-1">Canopy density improvement trajectories and native tree counts by zone.</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-gray-50">
                      <div className="flex justify-between text-xs font-semibold text-gray-500">
                        <span>Canopy Progress</span>
                        <span className="text-yellow-600 font-bold">+14.2% YoY</span>
                      </div>
                      <button 
                        onClick={() => {
                          setReportPlot('PLOT-ALPHA');
                          setReportIndex('NDMI');
                          triggerReportGeneration();
                        }}
                        className="w-full text-center py-2 bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-600 text-xs font-bold rounded-xl border border-gray-200 hover:border-green-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Download size={12} /> Compile PDF
                      </button>
                    </div>
                  </div>

                  {/* Theme 3 Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all h-[240px]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                          <Globe size={16} />
                        </div>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 uppercase">
                          Voluntary Carbon
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-snug">Carbon Accounting & Verification</h4>
                        <p className="text-[11px] text-gray-400 leading-normal mt-1">Geospatial coordinate boundary validation and registry alignment audits.</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-gray-50">
                      <div className="flex justify-between text-xs font-semibold text-gray-500">
                        <span>Confidence Index</span>
                        <span className="text-blue-600 font-bold">99.4% Verified</span>
                      </div>
                      <button 
                        onClick={() => {
                          setReportPlot('PLOT-GAMMA');
                          setReportIndex('AGB');
                          triggerReportGeneration();
                        }}
                        className="w-full text-center py-2 bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-600 text-xs font-bold rounded-xl border border-gray-200 hover:border-green-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Download size={12} /> Compile PDF
                      </button>
                    </div>
                  </div>

                  {/* Theme 4 Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all h-[240px]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                          <Shield size={16} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200 uppercase">
                          EUDR Traceable
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-snug">Traceability & Env. Impact</h4>
                        <p className="text-[11px] text-gray-400 leading-normal mt-1">Chain of custody coordinates tracking and deforestation-free compliance certificates.</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-gray-50">
                      <div className="flex justify-between text-xs font-semibold text-gray-500">
                        <span>Deforestation Score</span>
                        <span className="text-slate-800 font-bold">0.0 Anomaly</span>
                      </div>
                      <button 
                        onClick={() => {
                          setReportPlot('PLOT-ALPHA');
                          setReportIndex('NDVI');
                          triggerReportGeneration();
                        }}
                        className="w-full text-center py-2 bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-600 text-xs font-bold rounded-xl border border-gray-200 hover:border-green-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Download size={12} /> Compile PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              AI ASSISTANT
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'dashboard' && activeTab === 'ai-assistant' && (
            <div className="flex flex-col flex-1 h-full bg-white overflow-hidden animate-in fade-in duration-300">
              
              {/* Header (Only shown if chat has started) */}
              {chatMessages.length > 1 && (
                <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="text-green-600 animate-pulse" size={16} />
                    <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Scenario Modeling Assistant</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto flex flex-col min-h-0 bg-gray-50/20">
                {chatMessages.length === 1 ? (
                  /* Landing Empty State (Plot layout) */
                  <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto px-6 py-8 text-center space-y-8 animate-in fade-in duration-300">
                    <div className="space-y-3">
                      <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Scenario Modeling Assistant</h3>
                      <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
                        Ask what-if questions about your vegetation plots. The assistant reasons over live remote-sensing indices to forecast health impact and recommend agronomic actions.
                      </p>
                    </div>

                    {/* Grid of 2x2 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
                      {[
                        {
                          id: 'carbon',
                          title: 'Carbon & Climate-Smart Ag',
                          desc: 'Simulate carbon credit yield if we transition Plot-Alpha to zero-tillage & cover cropping.',
                          icon: <Leaf size={15} />,
                          prompt: 'Simulate carbon credit yield if we transition Plot-Alpha to zero-tillage & multi-species cover cropping.'
                        },
                        {
                          id: 'agroforestry',
                          title: 'Agroforestry & Restoration',
                          desc: 'Model the canopy density growth trajectory and species diversity impact in restoration Zone-Beta.',
                          icon: <Trees size={15} />,
                          prompt: 'Model the canopy density growth trajectory and species diversity index in restoration Zone-Beta.'
                        },
                        {
                          id: 'accounting',
                          title: 'Carbon Accounting & Registry',
                          desc: 'Run a geospatial mismatch audit on Plot-Gamma coordinates against regional baseline forest datasets.',
                          icon: <Globe size={15} />,
                          prompt: 'Run a geospatial mismatch audit on Plot-Gamma coordinates against regional baseline forest datasets.'
                        },
                        {
                          id: 'traceability',
                          title: 'Traceability & Env. Impact',
                          desc: 'Draft an EUDR-compliant traceability report showing deforestation-free proof for Plot-Alpha.',
                          icon: <Shield size={15} />,
                          prompt: 'Draft an EUDR-compliant traceability report showing deforestation-free proof and soil health history for Plot-Alpha.'
                        }
                      ].map(card => (
                        <button
                          key={card.id}
                          onClick={() => handleChatSubmit(card.prompt)}
                          className="p-5 bg-white border border-gray-150 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#16A34A]/40 hover:shadow-sm transition-all text-left flex flex-col group"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-[#DCFCE7] text-[#16A34A] rounded-lg flex items-center justify-center shrink-0">
                              {card.icon}
                            </div>
                            <span className="text-sm font-bold text-gray-800 group-hover:text-[#16A34A] transition-colors">
                              {card.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            {card.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Active Message History */
                  <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-3xl mx-auto space-y-6">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
                          <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                            msg.sender === 'user'
                              ? 'text-white rounded-tr-none'
                              : 'bg-white border border-gray-150 text-gray-700 rounded-tl-none'
                          }`} style={msg.sender === 'user' ? { backgroundColor: '#16A34A' } : undefined}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Input Area */}
              <div className="bg-white px-6 py-6 shrink-0">
                <div className="max-w-3xl mx-auto">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleChatSubmit(); }}
                    className="relative flex flex-col"
                  >
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit();
                        }
                      }}
                      placeholder="Ask about a scenario... e.g. What if rainfall drops 40% next month?"
                      className="w-full bg-gray-50 border border-transparent focus:border-green-600 focus:bg-white rounded-2xl py-5 pl-6 pr-16 text-sm font-semibold outline-none transition-all text-gray-800 placeholder-gray-400 shadow-sm resize-none h-44 animate-in fade-in duration-150"
                    />
                    <button
                      type="submit"
                      className="absolute right-4 bottom-4 w-12 h-12 text-white rounded-xl flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-95 hover:opacity-90"
                      style={{ backgroundColor: '#16A34A' }}
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {activeSidebarItem === 'help' && (
            <div className="p-10 space-y-10 animate-in fade-in duration-300">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  <Info size={28} className="text-green-600" />
                  Help & Remote Sensing Support
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  Access remote sensing guides, index explanations, or contact our spatial helpdesk.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Accordion FAQ Guide */}
                <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 lg:col-span-2 space-y-4">
                  <h3 className="text-base font-bold text-gray-900 pb-4 border-b border-gray-100 flex items-center gap-2.5">
                    <Globe size={18} className="text-green-600" />
                    Spatial Knowledge Base
                  </h3>
                  <div className="space-y-3 pt-2">
                    {[
                      {
                        q: 'What is NDVI and how is it calculated?',
                        a: 'NDVI (Normalized Difference Vegetation Index) measures crop vigor by comparing near-infrared reflectance (which vegetation reflects strongly) and red light reflectance (which vegetation absorbs). Calculation: (NIR - Red) / (NIR + Red). In the portal, values above 0.65 represent optimal crop growth.'
                      },
                      {
                        q: 'What is LSWI / NDMI and why does it track moisture?',
                        a: 'LSWI (Land Surface Water Index) and NDMI (Normalized Difference Moisture Index) use Shortwave Infrared (SWIR) bands to monitor liquid water content in crop canopies and soil surfaces. It drops sharply during root-zone dry spells, triggering moisture warning logs on the Alerts Desk.'
                      },
                      {
                        q: 'How often does Sentinel-2 capture new composite images?',
                        a: 'Sentinel-2 satellites orbit the earth constantly, providing a repeat frequency of 5 days at the equator. Cloud cover filters are automatically applied to compile cloud-free composites. If clouds exceed 20%, historical data interpolation is activated.'
                      },
                      {
                        q: 'How do I download or export analytical PDF ledgers?',
                        a: 'Go to the "Reports" tab at the top header, select your target plot and index (NDVI/NDWI/NDMI), then click "Generate Report PDF". Once completed, click "Download PDF" to save the verified spatial MRV document.'
                      }
                    ].map((faq, idx) => {
                      const isOpen = activeHelpTopic === idx;
                      return (
                        <div key={idx} className="border border-gray-150 rounded-xl overflow-hidden bg-gray-50/50">
                          <button
                            onClick={() => setActiveHelpTopic(isOpen ? null : idx)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm text-gray-800 hover:bg-gray-100/50 transition-colors"
                          >
                            <span>{faq.q}</span>
                            {isOpen ? <ChevronUp size={16} className="text-green-600" /> : <ChevronDown size={16} className="text-gray-400" />}
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-xs text-gray-500 font-semibold leading-relaxed border-t border-gray-150 bg-white animate-in slide-in-from-top-2 duration-200">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Support ticket submission form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-gray-900 pb-4 border-b border-gray-100 flex items-center gap-2.5">
                    <MessageSquare size={18} className="text-green-600" />
                    Submit Technical Ticket
                  </h3>
                  {showSupportSubmitted && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                      Ticket Submitted Successfully!
                    </div>
                  )}
                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Incident Category</label>
                      <select
                        value={ticketCategory}
                        onChange={e => setTicketCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none cursor-pointer focus:border-green-500 focus:bg-white text-gray-700 transition-all"
                      >
                        <option value="General Query">General Query</option>
                        <option value="Anomaly Diagnostic">Anomaly Diagnostic</option>
                        <option value="API Integration">API Integration</option>
                        <option value="Billing & Plans">Billing & Plans</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Subject</label>
                      <input
                        type="text"
                        value={ticketSubject}
                        onChange={e => setTicketSubject(e.target.value)}
                        placeholder="Subject..."
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none focus:border-green-500 focus:bg-white text-gray-700 placeholder-gray-450 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Message Details</label>
                      <textarea
                        value={ticketMessage}
                        onChange={e => setTicketMessage(e.target.value)}
                        placeholder="Describe your issue or query..."
                        required
                        rows="4"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none focus:border-green-500 focus:bg-white text-gray-700 placeholder-gray-450 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white font-bold text-sm py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-98"
                      style={{ backgroundColor: '#16A34A' }}
                    >
                      <Send size={15} /> Submit Support Ticket
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AgroMonitor;
