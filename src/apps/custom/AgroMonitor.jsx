import React, { useState, useMemo, useEffect, useRef, createPortal } from 'react';
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
  Users,
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
  ListFilter,
  Columns
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, Polygon, Popup, useMap, Pane } from 'react-leaflet';
import ReactDOM from 'react-dom';

/* ─── Portal-based Info Tooltip ─────────────────────────────────────────── */
const InfoTooltipPortal = ({ title, desc, done, formula }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos]         = useState({ top: 0, left: 0 });
  const iconRef               = useRef(null);

  const show = () => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    // Position above the icon, right-aligned to it
    setPos({
      top:  rect.top  + window.scrollY - 8,   // 8px gap above icon
      left: rect.right + window.scrollX,       // right edge of icon
    });
    setVisible(true);
  };
  const hide = () => setVisible(false);

  const tooltipContent = desc
    ? (
      <>
        <div style={{ fontWeight: 800, color: '#e5e7eb', marginBottom: 4, fontSize: 11 }}>{title}</div>
        <p style={{ color: '#d1d5db', marginBottom: desc && (done || formula) ? 6 : 0 }}>{desc}</p>
        {done && (
          <div style={{ marginBottom: formula ? 6 : 0 }}>
            <span style={{ fontWeight: 900, fontSize: 8, color: 'rgba(52,211,153,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Methodology:</span>
            <span style={{ color: '#d1d5db' }}>{done}</span>
          </div>
        )}
        {formula && (
          <div>
            <span style={{ fontWeight: 900, fontSize: 8, color: 'rgba(52,211,153,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Formula:</span>
            <span style={{ fontFamily: 'monospace', color: '#86efac', fontSize: 9.5, fontWeight: 700, display: 'block', marginTop: 4, background: 'rgba(20,83,45,0.6)', padding: '4px 8px', borderRadius: 4, border: '1px solid rgba(22,101,52,0.3)', wordBreak: 'break-all', whiteSpace: 'normal' }}>{formula}</span>
          </div>
        )}
      </>
    )
    : <span style={{ color: '#d1d5db' }}>{`Info about ${title}.`}</span>;

  return (
    <div
      ref={iconRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      style={{ display: 'inline-block', marginLeft: 6, verticalAlign: 'middle', cursor: 'pointer', position: 'relative' }}
    >
      <Info size={12} style={{ color: '#9ca3af', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#6b7280'}
        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
      />
      {visible && ReactDOM.createPortal(
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            transform: 'translate(-100%, -100%)',
            width: 224,
            padding: '10px 12px',
            background: 'rgba(5,46,22,0.97)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            fontSize: 10,
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(52,211,153,0.15)',
            zIndex: 2147483647,
            lineHeight: 1.55,
            textAlign: 'left',
            fontFamily: 'sans-serif',
            fontWeight: 500,
            textTransform: 'none',
            letterSpacing: 'normal',
            border: '1px solid rgba(52,211,153,0.2)',
            pointerEvents: 'auto',
          }}
        >
          {tooltipContent}
          {/* Arrow pointing down-right toward the icon */}
          <div style={{
            position: 'absolute',
            bottom: -7,
            right: 8,
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '7px solid rgba(5,46,22,0.97)',
          }} />
        </div>,
        document.body
      )}
    </div>
  );
};
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

      {/* Floating Date Badges (At the lower side, square, smaller, and no colors) */}
      {/* Left Badge */}
      <div
        className="absolute bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-1 rounded-sm shadow-md flex flex-col pointer-events-none animate-in fade-in duration-200"
        style={{ left: '12px', bottom: '12px', zIndex: 20000 }}
      >
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Left</span>
        <span className="text-[10px] font-extrabold text-gray-800">{currentTimelineA?.label?.split(',')[0]}</span>
      </div>

      {/* Right Badge */}
      <div
        className="absolute bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-1 rounded-sm shadow-md flex flex-col pointer-events-none text-right animate-in fade-in duration-200"
        style={{ right: '55px', bottom: '12px', zIndex: 20000 }}
      >
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Right</span>
        <span className="text-[10px] font-extrabold text-gray-800">{currentTimelineB?.label?.split(',')[0]}</span>
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

const TOOLTIP_DESCRIPTIONS = {

  // ── Operational Layers ───────────────────────────────────────────────────
  'Farm Boundaries': {
    desc: 'Shows the boundary outline of each registered farm plot, aligned to official cadastral (land registry) coordinates.',
    done: 'Vector polygons co-registered with Sentinel-2 and Landsat spatial grids at 10–30 m resolution.',
    formula: 'GIS Cadastral Vector Overlay'
  },

  // ── Intelligence Layers ──────────────────────────────────────────────────
  'Crop Vegetation Index (CVI)': {
    desc: 'Measures canopy density and crop health by combining red-edge and NIR reflectance. Higher values indicate denser, healthier canopy.',
    done: 'Derived from Sentinel-2 multispectral bands aggregated to 20 m resolution.',
    formula: 'CVI = (B8 ÷ B4) × (B5 ÷ B4)'
  },
  'Canopy Closure (CVI)': {
    desc: 'Estimates how much of the ground is covered by the crop canopy from directly above. Low values signal gaps or sparse growth.',
    done: 'Atmospherically corrected Sentinel-2 Red-Edge (B5) and NIR (B8) band ratio.',
    formula: 'CVI = (B8 ÷ B4) × (B5 ÷ B4)'
  },
  'Leaf Chlorophyll Density (CAR/RECI)': {
    desc: 'Maps leaf-level chlorophyll and nitrogen content. Low values often signal a need for topdressing fertilizer.',
    done: 'Ratio of Sentinel-2 NIR (B8) and Red-Edge-1 (B5) — sensitive to leaf nitrogen without saturation.',
    formula: 'RECI = (B8 ÷ B5) − 1'
  },
  'Early Stress Detection (NDRE)': {
    desc: 'Detects plant stress earlier than NDVI by using the red-edge band, which responds to chlorophyll loss before visible yellowing appears.',
    done: 'Normalized ratio of Sentinel-2 narrow NIR (B8A) and Red-Edge (B5) bands.',
    formula: 'NDRE = (B8A − B5) ÷ (B8A + B5)'
  },
  'Crop Water Stress (WDI)': {
    desc: 'Indicates how stressed the crop is from lack of water. High values mean the plant is closing its stomata and reducing transpiration.',
    done: 'Combines Sentinel-2 SWIR-based moisture index with Landsat thermal surface temperature anomalies.',
    formula: 'WDI = 0.5 × (1 − NDMI) + 0.5 × LST_norm'
  },
  'Radar Canopy Structure (DpRVI)': {
    desc: 'Uses radar signals to measure crop canopy volume and structure — even through clouds. Useful for monitoring canopy loss or thinning.',
    done: 'Sentinel-1 SAR dual-polarization IW GRD product, orthorectified and speckle-filtered.',
    formula: 'DpRVI = 1 − VV ÷ (VV + VH)²'
  },
  'Radar Vegetation Index (RVI)': {
    desc: 'SAR-based crop density index that works through cloud cover and harmattan haze. Tracks canopy volume changes over time.',
    done: 'Sentinel-1 VH and VV polarization backscatter in linear sigma-nought intensity.',
    formula: 'RVI = (4 × VH) ÷ (VV + VH)'
  },
  'SAR Flood Mask': {
    desc: 'Detects flooded or waterlogged areas using radar imagery. The signal drops sharply over open water surfaces.',
    done: 'Compares current Sentinel-1 VV backscatter to a dry-season reference baseline using change detection.',
    formula: 'Flood detected if: ΔdB = VV_current − VV_reference < −3 dB'
  },
  'UAS Spatial Anomaly': {
    desc: 'High-resolution drone anomaly map showing localized stress patches, canopy gaps, or failed seedling zones not visible at satellite scale.',
    done: 'Processed from multispectral UAV orthomosaic using local spatial variance anomaly detection.',
    formula: 'Anomaly Score = Local Spatial Variance Index'
  },
  'EVI (Vegetation Vigor)': {
    desc: 'Enhanced Vegetation Index (EVI) measures crop biomass density and greenness while correcting for atmospheric conditions and soil background signals, making it highly sensitive in dense canopy areas.',
    done: 'Atmospherically corrected Sentinel-2 Red (B4), Near-Infrared (B8), and Blue (B2) band normalization.',
    formula: 'EVI = 2.5 × (B8 − B4) ÷ (B8 + 6 × B4 − 7.5 × B2 + 1)'
  },
  'LSWI (Water Status)': {
    desc: 'Land Surface Water Index (LSWI) monitors canopy moisture content and crop water status by utilizing absorption features in the shortwave infrared spectrum.',
    done: 'Derived from Sentinel-2 Near-Infrared (B8) and Shortwave Infrared (B11) bands.',
    formula: 'LSWI = (B8 − B11) ÷ (B8 + B11)'
  },
  'VHI (Stress)': {
    desc: 'Vegetation Health Index (VHI) combines temperature and moisture indices to evaluate overall crop stress and drought conditions.',
    done: 'Fused index integrating Sentinel-2 NDVI and Landsat-8 thermal land surface temperature (LST) anomalies.',
    formula: 'VHI = 0.5 × VCI + 0.5 × TCI'
  },
  'Growth Stage': {
    desc: 'Maps the current development phase of the crop (tillering, grand growth, maturation, etc.) across different plots.',
    done: 'Compares Sentinel-1 RVI growth curves against accumulated Growing Degree Days (GDD) thermal models.',
    formula: 'Growth Stage = f(Cumulative GDD, RVI trajectory)'
  },

  // ── Crop Health Layers ───────────────────────────────────────────────────
  'Vegetation Health': {
    desc: 'The most widely used crop health index. Measures greenness and photosynthetic activity. Below 0.45 signals crop stress.',
    done: 'Atmospherically corrected Sentinel-2 Red (B4) and Near-Infrared (B8) band normalization.',
    formula: 'NDVI = (B8 − B4) ÷ (B8 + B4)'
  },
  'Chlorophyll VCI': {
    desc: 'Chlorophyll Vegetation Condition Index (VCI) measures active chlorophyll concentration to detect plant physiological stress and nitrogen levels.',
    done: 'Atmospherically corrected Sentinel-2 Red-Edge (B5) and Near-Infrared (B8) bands.',
    formula: 'RECI = (B8 ÷ B5) − 1'
  },
  'Red-Edge NDVI (NDRE)': {
    desc: 'An early-warning stress index that detects nitrogen depletion and cell damage before the crop visibly changes color.',
    done: 'Normalized ratio of Sentinel-2 narrow NIR (B8A) and Red-Edge (B5) — more sensitive than standard NDVI.',
    formula: 'NDRE = (B8A − B5) ÷ (B8A + B5)'
  },
  'Water Stress (NDMI)': {
    desc: 'Normalized Difference Moisture Index (NDMI) measures liquid water molecules in crop canopies to identify water-limiting conditions.',
    done: 'Calculated from Sentinel-2 NIR (B8) and SWIR (B11) bands to indicate plant water stress.',
    formula: 'NDMI = (B8 − B11) ÷ (B8 + B11)'
  },
  'SAR Soil Moisture (SMI)': {
    desc: 'Estimates surface soil moisture (top 5 cm) using radar backscatter. Works best when crop canopy is thin (early growth stage).',
    done: 'Compares current Sentinel-1 VV backscatter against a calibrated dry-season reference image.',
    formula: 'SMI = VV_current (dB) − VV_dry_reference (dB)'
  },
  'Pest Risk (Inundation)': {
    desc: 'Predicts pest and disease vulnerability based on spatial anomalies in canopy density and soil moisture indices.',
    done: 'Spatiotemporal anomaly clustering engine combining rapid NDVI declines with water logging events.',
    formula: 'Risk = f(ΔNDVI/Δt, ΔSMI/Δt, Local Variance)'
  },

  // ── Crop Yield Layers ────────────────────────────────────────────────────
  'Estimated Yield Rate (t/HA)': {
    desc: 'Predicted fresh fruit or crop yield per hectare based on satellite-derived radiation absorption and crop growth models.',
    done: 'Monteith light-use efficiency model using Sentinel-2 fAPAR and accumulated Growing Degree Days (GDD).',
    formula: 'Yield = Σ(fAPAR × PAR × LUE × f(T) × f(W)) × Harvest Index'
  },
  'Estimated Yield': {
    desc: 'Predicted crop yield per hectare based on satellite radiation data and seasonal growth modeling.',
    done: 'Monteith light-use efficiency model using Sentinel-2 fAPAR and accumulated Growing Degree Days (GDD).',
    formula: 'Yield = Σ(fAPAR × PAR × LUE × f(T) × f(W)) × Harvest Index'
  },
  'Dry Biomass Accumulation (kg/m²)': {
    desc: 'Daily rate of dry matter (carbon) being built up in the crop. Higher values mean the plant is growing fast and photosynthesising well.',
    done: 'Computed from daily solar radiation, canopy radiation absorption (fAPAR), and temperature-limited light-use efficiency.',
    formula: 'Biomass = fAPAR × IPAR × LUE_ε'
  },
  'Daily Biomass': {
    desc: 'Daily dry matter production rate — a direct measure of how fast the crop is growing on a given day.',
    done: 'Computed from daily solar radiation, canopy radiation absorption (fAPAR), and temperature-limited light-use efficiency.',
    formula: 'Biomass = fAPAR × IPAR × LUE_ε'
  },
  'Canopy Harvest Readiness (%)': {
    desc: 'Estimates how ready a plot is for harvest based on crop senescence signals — canopy water loss and structural change.',
    done: 'Combines NDWI canopy water decline trends with SAR-derived RVI senescence trajectory.',
    formula: 'Readiness = f(NDWI_senescence, RVI_senescence)'
  },
  'Harvest Readiness': {
    desc: 'Spectral readiness score estimating how close the crop is to optimal harvest window.',
    done: 'Combines NDWI canopy water decline trends with SAR-derived RVI senescence trajectory.',
    formula: 'Readiness = f(NDWI_senescence, RVI_senescence)'
  },
  'Growth Stage Mapping': {
    desc: 'Maps the current growth phase of each plot (establishment, tillering, grand growth, etc.) using satellite and thermal data.',
    done: 'Matches Sentinel-1 RVI growth curve against accumulated Growing Degree Days (GDD) since planting.',
    formula: 'Growth Stage = f(Cumulative GDD, RVI trajectory)'
  },
  'Vegetative Growth Rate': {
    desc: 'Tracks how fast the crop canopy is expanding week-over-week using satellite imagery.',
    done: 'Derived from sequential Sentinel-1 RVI observations cross-referenced with GDD thermal accumulation.',
    formula: 'Growth Rate = f(ΔRVI/Δt, GDD trajectory)'
  },

  // ── Climate & Moisture Layers ────────────────────────────────────────────
  'Precipitation': {
    desc: 'Daily and cumulative rainfall in mm derived from satellite and ground gauge blended data. Used to identify wet and dry spells.',
    done: 'CHIRPS satellite infrared precipitation estimates blended with local rain gauge records.',
    formula: 'Rainfall (mm/day) = CHIRPS_blended_estimate'
  },
  'Soil Moisture': {
    desc: 'Estimates the amount of water held in the top 5 cm of soil using radar backscatter. Important for irrigation scheduling.',
    done: 'Sentinel-1 VV backscatter change detection referenced against a calibrated dry-season baseline.',
    formula: 'SMI = VV_current (dB) − VV_reference (dB)'
  },
  'Soil Temp': {
    desc: 'Root zone soil temperature — directly affects germination, nutrient uptake, and microbial activity. Optimal range is 20–28 °C.',
    done: 'ERA5-Land reanalysis model output blended with local in-situ telemetry readings.',
    formula: 'T_soil = ERA5_RootZone_Temperature (°C)'
  },
  'Surface Temp (LST)': {
    desc: 'Land surface temperature measured from space. High values can indicate drought stress, bare soil, or burning events.',
    done: 'Landsat-8/9 TIRS Band 10 single-channel thermal retrieval using scene emissivity and metadata.',
    formula: 'LST (°C) = Tb ÷ (1 + λ × Tb ÷ ρ × ln(ε)) − 273.15'
  },
  'VPD Stress': {
    desc: 'Vapor Pressure Deficit — measures how "thirsty" the atmosphere is. High VPD forces plants to close stomata and stop growing.',
    done: 'Calculated from air temperature and relative humidity; high VPD (>2 kPa) triggers plant stress responses.',
    formula: 'VPD = es × (1 − RH)   es = 0.6108 × exp(17.27T ÷ (T + 237.3))'
  },

  // ── Land Restoration Layers ──────────────────────────────────────────────
  'Canopy Density': {
    desc: 'Percentage of the restoration zone covered by tree canopy. Target is above 85% for full restoration success.',
    done: 'Sentinel-2 CVI temporal composite normalized to a 0–100% canopy coverage scale.',
    formula: 'Canopy Density (%) = CVI_normalized × 100'
  },
  'Species Diversification': {
    desc: 'Measures how diverse the tree species mix is within a restoration zone using the Shannon entropy index.',
    done: 'Shannon entropy calculated from the distribution of spectral endmembers across high-resolution imagery.',
    formula: 'H′ = −Σ(Pi × ln(Pi))'
  },
  'Seedling Survival': {
    desc: 'Tracks the percentage of planted seedlings still alive. Below 80% survival triggers replanting protocols.',
    done: 'Zonal seedling count from high-resolution multispectral UAV/satellite data verified against baseline planting density.',
    formula: 'Survival Rate (%) = (Surviving Seedlings ÷ Planted Seedlings) × 100'
  },
  'Soil Stabilization': {
    desc: 'Rates the risk of soil erosion based on terrain slope, vegetation cover, and rainfall intensity.',
    done: 'RUSLE empirical soil loss model integrating terrain slope, vegetation cover factor, and CHIRPS rainfall.',
    formula: 'Erosion Risk = R × K × LS × C  (RUSLE model)'
  },
  'Ecological Progress': {
    desc: 'A composite score summarizing overall ecosystem recovery — combining canopy health, soil moisture, and erosion risk.',
    done: 'Weighted multivariate index combining CVI, NDWI, and soil stabilization scores.',
    formula: 'Eco Progress = w₁×CVI + w₂×NDWI + w₃×Stabilization'
  },
  'InSAR Coherence (γ)': {
    desc: 'Radar coherence score that drops sharply when vegetation is disturbed or forest is cleared — used to detect illegal logging.',
    done: 'Phase similarity computed from pairs of Sentinel-1 SLC images acquired 6–12 days apart.',
    formula: 'γ = |E[s₁ × s₂*]| ÷ √(E[|s₁|²] × E[|s₂|²])'
  },
  'GEDI Canopy Height': {
    desc: 'Tree height measurements from NASA\'s space-based LiDAR instrument, used to validate canopy volume in restoration zones.',
    done: 'Waveform metrics extracted from GEDI footprints intersected with estate boundaries.',
    formula: 'Tree Height (m) = rh100 (100% cumulative return height)'
  },
  'NDWI Canopy Water': {
    desc: 'Detects water in plant leaves and on the soil surface. Low values indicate canopy dryness or water stress.',
    done: 'Sentinel-2 NIR (B8) and SWIR (B11) band ratio, sensitive to leaf water content.',
    formula: 'NDWI = (B8 − B11) ÷ (B8 + B11)'
  },
  'SAR AGB Proxy (VH)': {
    desc: 'Estimates above-ground biomass (wood volume and carbon stock) using Sentinel-1 radar cross-polarization signal strength.',
    done: 'Calibrated Sentinel-1 VH backscatter regression against field forest inventory biomass plots.',
    formula: 'AGB Proxy (dB) = σ₀_VH × scaling_factor'
  },
  'LULC Classification': {
    desc: 'Classifies every pixel into a land cover type: tree cover, cropland, shrubland, bare soil, or water.',
    done: 'Ensemble fusion of ESA WorldCover, Google Dynamic World, and a custom SAR+Optical trained classifier.',
    formula: 'Class = argmax(Classifier(VV, VH, B2–B12, NDVI, RVI))'
  },
  'EUDR Deforestation': {
    desc: 'Highlights areas where tree cover has been lost since January 2020 — required for EU Deforestation Regulation compliance.',
    done: 'Bitemporal SAR change magnitude fused with near-real-time optical deforestation alert layers.',
    formula: 'Change Magnitude = √(ΔVV² + ΔVH² + (1−γ)²)'
  },
  'Soil Carbon Offset': {
    desc: 'Estimates soil organic carbon content and sequestered carbon stock in metric tons of CO2 equivalent (tCO2e) inside restoration zones.',
    done: 'Ensemble machine learning model calibrated with local soil samples and satellite multispectral reflectances.',
    formula: 'Carbon Stock (tCO2e) = SOC_density × Soil_Depth × Bulk_Density × 3.67'
  },
  'Biodiversity': {
    desc: 'Assesses species richness and ecological diversification inside restoration zones using high-resolution spectral entropy.',
    done: 'Shannon entropy calculated from the spatial distribution of spectral endmembers across high-resolution imagery.',
    formula: 'H′ = −Σ(Pi × ln(Pi))'
  },
  'SAR AGB Proxy': {
    desc: 'Estimates above-ground biomass (wood volume and carbon stock) using Sentinel-1 radar cross-polarization backscatter signals.',
    done: 'Calibrated Sentinel-1 VH polarization backscatter regression model validated with local forest plots.',
    formula: 'AGB (t/HA) = VH_backscatter (dB) × Scaling_Factor'
  },

  // ── Analytics Charts & Cards ─────────────────────────────────────────────
  'Geospatial Vegetation Vigor & Health Trends': {
    desc: 'Time-series chart showing how NDVI (crop greenness and health) has changed over the season for each plot.',
    done: 'Plot-mean NDVI computed from atmospherically corrected Sentinel-2 pixels within each boundary, per acquisition date.',
    formula: 'NDVI_plot = Σ(NDVI_pixel) ÷ N_pixels'
  },
  'Moisture Retention (NDMI)': {
    desc: 'Tracks canopy moisture content over time. A falling trend can signal water stress or a need for irrigation.',
    done: 'Sentinel-2 NIR (B8) and SWIR (B11) band ratio computed per overpass and averaged per plot.',
    formula: 'NDMI = (B8 − B11) ÷ (B8 + B11)'
  },
  'Land Classification Area': {
    desc: 'Pie-chart breakdown of how land is used within the audit zone — what fraction is tree cover, cropland, bare soil, etc.',
    done: 'Pixel-level LULC classification aggregated into class area percentages using zonal histogram counting.',
    formula: 'Area_Class (%) = (Class_Pixels ÷ Total_Pixels) × 100'
  },
  'Seasonal Trajectory vs GDD Reference Curve': {
    desc: 'Compares the actual radar-measured crop growth curve to what is expected at each thermal stage of the season.',
    done: 'Dual-axis chart overlaying Sentinel-1 RVI time-series with GDD-based phenological reference growth curve.',
    formula: 'Deviation = RVI_observed − RVI_expected(GDD)'
  },
  'Plot-by-Plot Growing Degree Days (GDD) Completion Rate': {
    desc: 'Shows how much accumulated heat each plot has received since planting — determines which growth stage the crop is in.',
    done: 'Sum of daily average temperatures above the base temperature (T_base) from planting date to today.',
    formula: 'GDD = Σ(T_mean − T_base)   T_mean = (T_max + T_min) ÷ 2'
  },
  'FAO-56 Evapotranspiration Model': {
    desc: 'Shows the water demand of the crop (ETc) versus actual water used (ETa) — the gap indicates irrigation deficit.',
    done: 'FAO Penman-Monteith energy balance model using temperature, solar radiation, humidity, and wind speed inputs.',
    formula: 'ETo = f(Rn, G, T, u₂, eₛ−eₐ, Δ, γ)   ETc = Kc × ETo'
  },
  '7-Day Evapotranspiration Historical Log': {
    desc: 'A 7-day log of daily crop water consumption and root zone soil water depletion — useful for irrigation planning.',
    done: 'Daily water balance model tracking soil water depletion, precipitation, irrigation, and crop transpiration.',
    formula: 'Dr,i = Dr,i−1 − (P − RO) − I + ETc + DP'
  },
  'Nutrient Profiling': {
    desc: 'Radar chart profiling nitrogen, phosphorus, potassium, pH, and organic carbon balances.',
    done: 'Zonal aggregation of soil test diagnostics and fertilizer log inputs.',
    formula: 'Nutrient_Score = f(SoilTest, FertilizerApplied)'
  },
  'Detailed Soil Chemistry Diagnostics': {
    desc: 'Detailed macronutrient and chemical recommendation guide based on plot soil testing.',
    done: 'Agronomic diagnostic engine analyzing macronutrient levels and suggesting topdressing rates.',
    formula: 'Recommendation = Target_N_P_K - Soil_N_P_K'
  },
  'Geospatial Mismatch Audits': {
    desc: 'Discrepancy logs matching farm coordinate claims against official forest registers.',
    done: 'Overlap analysis intersecting estate vector boundaries with protected area and official forest reserves databases.',
    formula: 'Mismatch_Area = Intersection(Estate_Boundary, Protected_Forest_Register)'
  },
  'Ingested Overpass Quality Control Ledger': {
    desc: 'Audit log showing pre-processing steps and cloud mask quality check results.',
    done: 'Automated QC pipeline evaluating cloud cover percentages and sensor health flags per overpass.',
    formula: 'Pass_QC = (Cloud_Cover < Cloud_Threshold) && (Sensor_Status == OK)'
  },
  'Deforestation Compliance Ledger': {
    desc: 'Deforestation warning patches mapping post-2020 tree canopy loss for compliance audits.',
    done: 'Tabular log of detected canopy loss events with location, area, and compliance status.',
    formula: 'Compliance = (Forest_Loss_Area < Compliance_Threshold)'
  },
  'Analytical Report Ledger': {
    desc: 'Exportable GIS reports ledger certifying spatial audits and sustainability compliance.',
    done: 'Generated PDF certificates containing maps, timeline trends, and compliance checklists.',
    formula: 'Report_Hash = SHA255(Report_Content)'
  },
  'Operational Telemetry Logs': {
    desc: 'Live system telemetry logs recording Sentinel-2 ingestion pings.',
    done: 'Continuous background workers logging Sentinel API query results.',
    formula: 'Ping_Latency = Ingestion_Time - Acquisition_Time'
  },
  'Help Accordions': {
    desc: 'Answers to frequently asked questions about indices, Sentinel-2 passes, and system integration.',
    done: 'Knowledge base of platform-wide remote sensing methodologies.',
    formula: 'FAQ Search Index'
  },
  'Contact Support Form': {
    desc: 'Direct operational support desk form for GIS specialists and spatial auditors.',
    done: 'Ticketing system interface routing inquiries to agricultural technical support.',
    formula: 'Ticket_ID = UUID()'
  }
};

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

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AgroMonitor = ({ onBack, onSignOut }) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('analytics');
  const [activeTab, setActiveTab] = useState('monitor');

  const renderInfoTooltip = (title) => {
    let lookupKey = title;
    const lowerTitle = title.toLowerCase().trim();

    // Explicit mapping of common variants
    if (lowerTitle.includes('agb')) lookupKey = 'SAR AGB Proxy';
    else if (lowerTitle.includes('lulc') || lowerTitle.includes('land cover')) lookupKey = 'LULC Classification';
    else if (lowerTitle.includes('eudr') || lowerTitle.includes('deforestation')) lookupKey = 'EUDR Deforestation';
    else if (lowerTitle.includes('biodiversity')) lookupKey = 'Biodiversity';
    else if (lowerTitle.includes('diversification')) lookupKey = 'Species Diversification';
    else if (lowerTitle.includes('soil carbon offset')) lookupKey = 'Soil Carbon Offset';
    else if (lowerTitle.includes('carbon') || lowerTitle.includes('stabilization')) lookupKey = 'Soil Stabilization';
    else if (lowerTitle.includes('survival')) lookupKey = 'Seedling Survival';
    else if (lowerTitle.includes('growth')) lookupKey = 'Growth Stage';
    else if (lowerTitle.includes('surface temp') || lowerTitle.includes('lst')) lookupKey = 'Surface Temp (LST)';
    else if (lowerTitle.includes('soil moisture') || lowerTitle.includes('smi')) lookupKey = 'Soil Moisture';
    else if (lowerTitle.includes('water stress (ndmi)')) lookupKey = 'Water Stress (NDMI)';
    else if (lowerTitle.includes('water stress') || lowerTitle.includes('lswi') || lowerTitle.includes('ndmi')) lookupKey = 'LSWI (Water Status)';
    else if (lowerTitle.includes('ndre') || lowerTitle.includes('red-edge')) lookupKey = 'Red-Edge NDVI (NDRE)';
    else if (lowerTitle.includes('vegetation health')) lookupKey = 'Vegetation Health';

    // Fallback search in keys
    let info = TOOLTIP_DESCRIPTIONS[lookupKey];
    if (!info) {
      const foundKey = Object.keys(TOOLTIP_DESCRIPTIONS).find(k =>
        k.toLowerCase().includes(lowerTitle) || lowerTitle.includes(k.toLowerCase())
      );
      if (foundKey) info = TOOLTIP_DESCRIPTIONS[foundKey];
    }

    // Use portal-based tooltip — never clipped by any parent overflow or z-index
    const { desc = null, done = null, formula = null } = info || {};
    return <InfoTooltipPortal title={title} desc={desc} done={done} formula={formula} />;
  };


  // Layout Resizing States
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(240);
  const [activeResizeType, setActiveResizeType] = useState(null); // 'sidebar', 'bottom', or null

  const startSidebarResize = (e) => {
    e.preventDefault();
    setActiveResizeType('sidebar');
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const doDrag = (moveEvent) => {
      const newWidth = Math.max(180, Math.min(360, startWidth + (moveEvent.clientX - startX)));
      setSidebarWidth(newWidth);
    };

    const stopDrag = () => {
      setActiveResizeType(null);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const startBottomPanelResize = (e) => {
    e.preventDefault();
    setActiveResizeType('bottom');
    const startY = e.clientY;
    const startHeight = bottomPanelHeight;

    const doDrag = (moveEvent) => {
      const newHeight = Math.max(120, Math.min(500, startHeight - (moveEvent.clientY - startY)));
      setBottomPanelHeight(newHeight);
    };

    const stopDrag = () => {
      setActiveResizeType(null);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };
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
          className="bg-white border border-gray-200 px-2 py-1.5 rounded-sm shadow-md hover:bg-gray-55 flex items-center gap-1.5 font-bold text-[10px] text-gray-700 transition-all active:scale-95"
        >
          <span className="text-xs">{activeBasemapObj.emoji}</span>
          <span className="truncate max-w-[85px]">{activeBasemapObj.label}</span>
          <ChevronDown size={11} className={`text-gray-400 transition-transform ${showBasemapDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showBasemapDropdown && (
          <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-sm shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-1 space-y-0.5">
              {BASEMAPS.map(src => (
                <button
                  key={src.id}
                  onClick={() => { setSelectedBasemap(src.id); setShowBasemapDropdown(false); }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-left transition-all ${
                    selectedBasemap === src.id ? 'bg-green-50 text-green-700 font-extrabold' : 'hover:bg-gray-55 text-gray-700'
                  }`}
                >
                  <span className="text-xs shrink-0">{src.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold truncate leading-tight">{src.label}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">{src.sub}</div>
                  </div>
                  {selectedBasemap === src.id && <CheckCircle2 size={10} className="text-green-600 shrink-0" />}
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

  // Analytics subpage state
  const [activeAnalyticsSubpage, setActiveAnalyticsSubpage] = useState('overview');

  // Land Restoration new layers states
  const [restoreShowInSar, setRestoreShowInSar] = useState(false);
  const [restoreInSarOpacity, setRestoreInSarOpacity] = useState(70);
  const [restoreShowGedi, setRestoreShowGedi] = useState(false);
  const [restoreGediOpacity, setRestoreGediOpacity] = useState(70);
  const [restoreShowNdwi, setRestoreShowNdwi] = useState(false);
  const [restoreNdwiOpacity, setRestoreNdwiOpacity] = useState(70);
  const [restoreShowLulc, setRestoreShowLulc] = useState(false);
  const [restoreLulcOpacity, setRestoreLulcOpacity] = useState(70);
  const [restoreShowEudr, setRestoreShowEudr] = useState(false);
  const [restoreEudrOpacity, setRestoreEudrOpacity] = useState(70);
  const [restoreLulcExpanded, setRestoreLulcExpanded] = useState(true);
  const [restoreEudrExpanded, setRestoreEudrExpanded] = useState(true);
  const [restoreLulcSource, setRestoreLulcSource] = useState('worldcover');
  const [restoreLulcYear, setRestoreLulcYear] = useState(2020);
  const [restoreShowLulcChange, setRestoreShowLulcChange] = useState(false);


  // Alerts Command Center redesigned states
  const [alertsFilterSeverity, setAlertsFilterSeverity] = useState('All');
  const [alertsFilterPlot, setAlertsFilterPlot] = useState('All');
  const [alertsFilterCategory, setAlertsFilterCategory] = useState('All');
  const [alertsFilterActiveOnly, setAlertsFilterActiveOnly] = useState(true);
  const [selectedAlertPlot, setSelectedAlertPlot] = useState(null); // null = no selection, 'PLOT-BETA' = detail view
  const [alertsSearch, setAlertsSearch] = useState('');

  // Dropdown layout states
  const [showEstateDropdown, setShowEstateDropdown] = useState(false);
  const [showPlotDropdown, setShowPlotDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Intelligence layers new states
  const [intelShowCvi, setIntelShowCvi] = useState(false);
  const [intelCviOpacity, setIntelCviOpacity] = useState(70);
  const [intelShowCar, setIntelShowCar] = useState(false);
  const [intelCarOpacity, setIntelCarOpacity] = useState(70);
  const [intelShowNdre, setIntelShowNdre] = useState(false);
  const [intelNdreOpacity, setIntelNdreOpacity] = useState(70);
  const [intelShowWdi, setIntelShowWdi] = useState(false);
  const [intelWdiOpacity, setIntelWdiOpacity] = useState(70);
  const [intelShowDprvi, setIntelShowDprvi] = useState(false);
  const [intelDprviOpacity, setIntelDprviOpacity] = useState(70);
  const [intelShowRvi, setIntelShowRvi] = useState(false);
  const [intelRviOpacity, setIntelRviOpacity] = useState(70);
  const [intelShowFlood, setIntelShowFlood] = useState(false);
  const [intelFloodOpacity, setIntelFloodOpacity] = useState(70);
  const [intelShowUas, setIntelShowUas] = useState(false);
  const [intelUasOpacity, setIntelUasOpacity] = useState(70);

  // Crop Health missing layers states
  const [healthShowSmi, setHealthShowSmi] = useState(false);
  const [healthSmiOpacity, setHealthSmiOpacity] = useState(80);
  const [healthShowNdre, setHealthShowNdre] = useState(false);
  const [healthNdreOpacity, setHealthNdreOpacity] = useState(80);

  // Climate missing layers states
  const [climateShowFlood, setClimateShowFlood] = useState(false);
  const [climateFloodOpacity, setClimateFloodOpacity] = useState(80);

  // Land Restoration missing layers states
  const [restoreShowAgb, setRestoreShowAgb] = useState(false);
  const [restoreAgbOpacity, setRestoreAgbOpacity] = useState(70);

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
    { id: 'ALT-2026-004', estate: 'West Valley Estate', plot: 'PLOT-ALPHA', category: 'Cloud Cover', severity: 'Info', desc: 'Sentinel-2 imagery shows 12% localized cloud cover. Index computations adjusted.', date: 'May 22, 2026', time: '16:05', status: 'Acknowledged' },
    { id: 'ALT-2026-005', estate: 'East Ridge Estate', plot: 'PLOT-BETA', category: 'Water Stress', severity: 'Critical', desc: 'Evapotranspiration deficit detected. Actual transpiration (ETa) is 45% below demand (ETc).', date: 'May 29, 2026', time: '10:12', status: 'Active' },
    { id: 'ALT-2026-006', estate: 'South Slope Estate', plot: 'PLOT-GAMMA', category: 'Growth Deficit', severity: 'Info', desc: 'Refined Lee speckle filter applied to Sentinel-1 radar pass. Noise cleared successfully.', date: 'May 25, 2026', time: '08:30', status: 'Acknowledged' },
    { id: 'ALT-2026-007', estate: 'West Valley Estate', plot: 'PLOT-ALPHA', category: 'Water Stress', severity: 'Warning', desc: 'WDI thermal-optical crop water stress index exceeds 0.60 warning threshold.', date: 'May 27, 2026', time: '13:50', status: 'Active' },
    { id: 'ALT-2026-008', estate: 'East Ridge Estate', plot: 'PLOT-BETA', category: 'Growth Deficit', severity: 'Warning', desc: 'DpRVI radar canopy index indicates localized canopy structure loss or thinning.', date: 'May 24, 2026', time: '15:10', status: 'Active' },
    { id: 'ALT-2026-009', estate: 'West Valley Estate', plot: 'PLOT-ALPHA', category: 'Pest Infestation', severity: 'Warning', desc: 'Early stress ndre signature indicates possible mild pathogen pressure in Zone-A.', date: 'May 21, 2026', time: '10:00', status: 'Acknowledged' }
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
  const [profileName, setProfileName] = useState('Samuel');
  const [profileEmail, setProfileEmail] = useState('samuel@farmintelytics.io');
  const [profileRole, setProfileRole] = useState('Intelligence Analyst');
  const [brandingMode, setBrandingMode] = useState('AM'); // 'AM' or 'FT'
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const [defaultLat, setDefaultLat] = useState(7.145);
  const [defaultLng, setDefaultLng] = useState(3.355);
  const [defaultMapZoom, setDefaultMapZoom] = useState(14);
  const [glassmorphismEnabled, setGlassmorphismEnabled] = useState(true);
  const [showProfileSaved, setShowProfileSaved] = useState(false);

  // Collapsible sidebar section groups states (collapsed/false by default)
  const [intelOpExpanded, setIntelOpExpanded] = useState(false);
  const [intelBioExpanded, setIntelBioExpanded] = useState(false);
  const [intelMonExpanded, setIntelMonExpanded] = useState(false);

  const [healthOpExpanded, setHealthOpExpanded] = useState(false);
  const [healthBioExpanded, setHealthBioExpanded] = useState(false);
  const [healthMonExpanded, setHealthMonExpanded] = useState(false);

  const [yieldOpExpanded, setYieldOpExpanded] = useState(false);
  const [yieldProdExpanded, setYieldProdExpanded] = useState(false);
  const [yieldStatExpanded, setYieldStatExpanded] = useState(false);

  const [restoreOpExpanded, setRestoreOpExpanded] = useState(false);
  const [restoreEcoExpanded, setRestoreEcoExpanded] = useState(false);

  const [climateOpExpanded, setClimateOpExpanded] = useState(false);
  const [climateBioExpanded, setClimateBioExpanded] = useState(false);
  const [climateAtmExpanded, setClimateAtmExpanded] = useState(false);


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

  const getHealthPlotStyleOutline = () => ({
    color: healthShowBoundaries ? '#000000' : 'transparent',
    weight: healthShowBoundaries ? 2.5 : 0,
    opacity: healthBoundariesOpacity / 100,
    fillColor: 'transparent',
    fillOpacity: 0
  });

  const getHealthPlotStyleFill = (plot, layer) => {
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (layer === 'pest') {
      const risk = plot.pestRisk;
      fillColor = risk === 'High Risk' ? '#ef4444' : risk === 'Moderate Risk' ? '#f97316' : '#16a34a';
      fillOpacity = healthPestOpacity / 100;
    } else if (layer === 'water') {
      fillColor = getIndexFiveClasses(plot.waterStress, 'NDMI').color;
      fillOpacity = healthWaterOpacity / 100;
    } else if (layer === 'chlorophyll') {
      fillColor = getIndexFiveClasses(plot.chlorophyll, 'NDVI').color;
      fillOpacity = healthChlorophyllOpacity / 100;
    } else if (layer === 'ndvi') {
      fillColor = getIndexFiveClasses(plot.ndvi, 'NDVI').color;
      fillOpacity = healthNdviOpacity / 100;
    } else if (layer === 'ndre') {
      fillColor = getIndexFiveClasses(plot.ndvi * 0.85, 'NDVI').color;
      fillOpacity = healthNdreOpacity / 100;
    } else if (layer === 'smi') {
      const dbChange = plot.id === 'PLOT-BETA' ? 6.2 : plot.id === 'PLOT-ALPHA' ? 3.5 : 1.5;
      fillColor = dbChange > 6 ? '#1E3A8A' : dbChange > 3 ? '#2563EB' : dbChange > 1 ? '#60A5FA' : dbChange > -1 ? '#86EFAC' : dbChange > -3 ? '#EAB308' : '#DC2626';
      fillOpacity = healthSmiOpacity / 100;
    }
    
    return {
      color: 'transparent',
      weight: 0,
      opacity: 0,
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

  const getYieldPlotStyleOutline = () => ({
    color: yieldShowBoundaries ? '#000000' : 'transparent',
    weight: yieldShowBoundaries ? 2.5 : 0,
    opacity: yieldBoundariesOpacity / 100,
    fillColor: 'transparent',
    fillOpacity: 0
  });

  const getYieldPlotStyleFill = (plot, layer) => {
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (layer === 'readiness') {
      const val = plot.readiness;
      fillColor = val > 85 ? '#16a34a' : val > 65 ? '#eab308' : '#f97316';
      fillOpacity = yieldReadinessOpacity / 100;
    } else if (layer === 'growth') {
      const val = plot.growth;
      fillColor = val > 0.7 ? '#15803d' : val > 0.55 ? '#22c55e' : val > 0.4 ? '#eab308' : '#ef4444';
      fillOpacity = yieldGrowthOpacity / 100;
    } else if (layer === 'biomass') {
      const val = plot.biomass;
      fillColor = val > 2.0 ? '#15803d' : val > 1.3 ? '#22c55e' : val > 0.8 ? '#eab308' : '#ef4444';
      fillOpacity = yieldBiomassOpacity / 100;
    } else if (layer === 'yield') {
      const val = plot.yieldValue;
      fillColor = val > 18 ? '#15803d' : val > 12 ? '#22c55e' : val > 8 ? '#eab308' : '#ef4444';
      fillOpacity = yieldYieldOpacity / 100;
    }
    
    return {
      color: 'transparent',
      weight: 0,
      opacity: 0,
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

  const getClimatePlotStyleOutline = () => ({
    color: climateShowBoundaries ? '#000000' : 'transparent',
    weight: climateShowBoundaries ? 2.5 : 0,
    opacity: climateBoundariesOpacity / 100,
    fillColor: 'transparent',
    fillOpacity: 0
  });

  const getClimatePlotStyleFill = (plot, layer) => {
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (layer === 'vpd') {
      const val = plot.vpd;
      fillColor = val > 2.2 ? '#ef4444' : val > 1.5 ? '#f97316' : '#10b981';
      fillOpacity = climateVaporDeficitOpacity / 100;
    } else if (layer === 'lst') {
      const val = plot.lst;
      fillColor = val > 36 ? '#b91c1c' : val > 30 ? '#ef4444' : val > 25 ? '#f97316' : '#10b981';
      fillOpacity = climateLstOpacity / 100;
    } else if (layer === 'soilTemp') {
      const val = plot.soilTemp;
      fillColor = val > 29 ? '#ef4444' : val > 25 ? '#f97316' : '#10b981';
      fillOpacity = climateSoilTempOpacity / 100;
    } else if (layer === 'rainfall') {
      const val = plot.rainfall;
      fillColor = val > 25 ? '#1d4ed8' : val > 18 ? '#3b82f6' : '#93c5fd';
      fillOpacity = climateRainfallOpacity / 100;
    } else if (layer === 'flood') {
      fillColor = plot.id === 'PLOT-BETA' ? '#1e3a8a' : 'transparent';
      fillOpacity = climateFloodOpacity / 100;
    }
    
    return {
      color: 'transparent',
      weight: 0,
      opacity: 0,
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

  // Layer independent toggle handlers for each page (allowing concurrent layers)
  const handleIntelToggle = (layer) => {
    if (layer === 'growth') setIntelShowGrowth(!intelShowGrowth);
    if (layer === 'evi') setIntelShowEvi(!intelShowEvi);
    if (layer === 'lswi') setIntelShowLswi(!intelShowLswi);
    if (layer === 'vhi') setIntelShowVhi(!intelShowVhi);
    if (layer === 'suitability') setIntelShowSuitability(!intelShowSuitability);
    if (layer === 'cvi') setIntelShowCvi(!intelShowCvi);
    if (layer === 'car') setIntelShowCar(!intelShowCar);
    if (layer === 'ndre') setIntelShowNdre(!intelShowNdre);
    if (layer === 'wdi') setIntelShowWdi(!intelShowWdi);
    if (layer === 'dprvi') setIntelShowDprvi(!intelShowDprvi);
    if (layer === 'rvi') setIntelShowRvi(!intelShowRvi);
    if (layer === 'flood') setIntelShowFlood(!intelShowFlood);
    if (layer === 'uas') setIntelShowUas(!intelShowUas);
  };

  const handleHealthToggle = (layer) => {
    if (layer === 'ndvi') setHealthShowNdvi(!healthShowNdvi);
    if (layer === 'chlorophyll') setHealthShowChlorophyll(!healthShowChlorophyll);
    if (layer === 'water') setHealthShowWater(!healthShowWater);
    if (layer === 'pest') setHealthShowPest(!healthShowPest);
    if (layer === 'ndre') setHealthShowNdre(!healthShowNdre);
    if (layer === 'smi') setHealthShowSmi(!healthShowSmi);
  };

  const handleYieldToggle = (layer) => {
    if (layer === 'yield') setYieldShowYield(!yieldShowYield);
    if (layer === 'biomass') setYieldShowBiomass(!yieldShowBiomass);
    if (layer === 'readiness') setYieldShowReadiness(!yieldShowReadiness);
    if (layer === 'growth') setYieldShowGrowth(!yieldShowGrowth);
  };

  const handleClimateToggle = (layer) => {
    if (layer === 'rainfall') setClimateShowRainfall(!climateShowRainfall);
    if (layer === 'soilTemp') setClimateShowSoilTemp(!climateShowSoilTemp);
    if (layer === 'lst') setClimateShowLst(!climateShowLst);
    if (layer === 'vpd') setClimateShowVaporDeficit(!climateShowVaporDeficit);
    if (layer === 'flood') setClimateShowFlood(!climateShowFlood);
  };

  const handleRestoreToggle = (layer) => {
    if (layer === 'progress') setRestoreShowProgress(!restoreShowProgress);
    if (layer === 'survival') setRestoreShowSurvival(!restoreShowSurvival);
    if (layer === 'carbon') setRestoreShowCarbon(!restoreShowCarbon);
    if (layer === 'biodiversity') setRestoreShowBiodiversity(!restoreShowBiodiversity);
    if (layer === 'insar') setRestoreShowInSar(!restoreShowInSar);
    if (layer === 'gedi') setRestoreShowGedi(!restoreShowGedi);
    if (layer === 'ndwi') setRestoreShowNdwi(!restoreShowNdwi);
    if (layer === 'lulc') setRestoreShowLulc(!restoreShowLulc);
    if (layer === 'eudr') setRestoreShowEudr(!restoreShowEudr);
  };

  const getRestorePlotStyleOutline = () => ({
    color: restoreShowBoundaries ? '#000000' : 'transparent',
    weight: restoreShowBoundaries ? 2.5 : 0,
    opacity: restoreBoundariesOpacity / 100,
    fillColor: 'transparent',
    fillOpacity: 0
  });

  const getRestorePlotStyleFill = (zone, layer) => {
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (layer === 'biodiversity') {
      const val = zone.id === 'ZONE-ALPHA' ? 92 : zone.id === 'ZONE-BETA' ? 84 : 76;
      fillColor = val > 90 ? '#15803d' : val > 80 ? '#22c55e' : '#eab308';
      fillOpacity = restoreBiodiversityOpacity / 100;
    } else if (layer === 'carbon') {
      const val = zone.carbon;
      fillColor = val > 40 ? '#15803d' : val > 30 ? '#22c55e' : '#eab308';
      fillOpacity = restoreCarbonOpacity / 100;
    } else if (layer === 'survival') {
      const val = zone.survivalNum;
      fillColor = val > 90 ? '#15803d' : val > 85 ? '#22c55e' : '#eab308';
      fillOpacity = restoreSurvivalOpacity / 100;
    } else if (layer === 'progress') {
      const val = zone.progress;
      fillColor = val > 85 ? '#15803d' : val > 70 ? '#22c55e' : val > 55 ? '#eab308' : '#ef4444';
      fillOpacity = restoreProgressOpacity / 100;
    } else if (layer === 'insar') {
      const val = zone.insar;
      fillColor = val > 0.7 ? '#15803d' : val >= 0.4 ? '#eab308' : '#dc2626';
      fillOpacity = restoreInSarOpacity / 100;
    } else if (layer === 'gedi') {
      const val = zone.gedi;
      fillColor = val > 15 ? '#14532d' : val > 10 ? '#15803d' : val > 5 ? '#22c55e' : '#eab308';
      fillOpacity = restoreGediOpacity / 100;
    } else if (layer === 'ndwi') {
      const val = zone.ndwi;
      fillColor = val > 0.3 ? '#1e3a8a' : val > 0.15 ? '#2563eb' : val > 0.0 ? '#60a5fa' : '#ea580c';
      fillOpacity = restoreNdwiOpacity / 100;
    } else if (layer === 'lulc') {
      const val = zone.lulc;
      fillColor = val === 'Forest' ? '#15803d' : val === 'Shrubland' ? '#86efac' : val === 'Cropland' ? '#fde047' : val === 'Bare Soil' ? '#ca8a04' : val === 'Water' ? '#3b82f6' : '#94a3b8';
      fillOpacity = restoreLulcOpacity / 100;
    } else if (layer === 'eudr') {
      const val = zone.eudr;
      fillColor = val === 'Compliant' ? '#16a34a' : val === 'Warning' ? '#eab308' : '#dc2626';
      fillOpacity = restoreEudrOpacity / 100;
    } else if (layer === 'agb') {
      fillColor = zone.id === 'ZONE-ALPHA' ? '#14532D' : zone.id === 'ZONE-BETA' ? '#16A34A' : '#86EFAC';
      fillOpacity = restoreAgbOpacity / 100;
    }
    
    return {
      color: 'transparent',
      weight: 0,
      opacity: 0,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  };

  const getIntelPlotStyleOutline = () => ({
    color: intelShowBoundaries ? '#000000' : 'transparent',
    weight: intelShowBoundaries ? 2.5 : 0,
    opacity: intelBoundariesOpacity / 100,
    fillColor: 'transparent',
    fillOpacity: 0
  });

  const getIntelPlotStyleFill = (plot, layer) => {
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (layer === 'suitability') {
      fillColor = (plot.id === 'PLOT-BETA') ? '#dc2626' : '#16a34a';
      fillOpacity = intelSuitabilityOpacity / 100;
    } else if (layer === 'vhi') {
      fillColor = getIndexFiveClasses(plot.ndvi, 'NDVI').color;
      fillOpacity = intelVhiOpacity / 100;
    } else if (layer === 'lswi') {
      fillColor = getIndexFiveClasses(plot.ndmi, 'LSWI').color;
      fillOpacity = intelLswiOpacity / 100;
    } else if (layer === 'evi') {
      fillColor = getIndexFiveClasses(plot.ndvi * 0.95, 'EVI').color;
      fillOpacity = intelEviOpacity / 100;
    } else if (layer === 'growth') {
      fillColor = (plot.id === 'PLOT-ALPHA') ? '#15803d' : (plot.id === 'PLOT-BETA') ? '#86efac' : '#fbbf24';
      fillOpacity = intelGrowthOpacity / 100;
    } else if (layer === 'cvi') {
      fillColor = getIndexFiveClasses(plot.ndvi * 1.05, 'NDVI').color;
      fillOpacity = intelCviOpacity / 100;
    } else if (layer === 'car') {
      fillColor = getIndexFiveClasses(plot.ndvi * 0.9, 'NDVI').color;
      fillOpacity = intelCarOpacity / 100;
    } else if (layer === 'ndre') {
      fillColor = getIndexFiveClasses(plot.ndvi * 0.85, 'NDVI').color;
      fillOpacity = intelNdreOpacity / 100;
    } else if (layer === 'wdi') {
      fillColor = getIndexFiveClasses(plot.ndmi * 1.1, 'LSWI').color;
      fillOpacity = intelWdiOpacity / 100;
    } else if (layer === 'dprvi') {
      fillColor = (plot.id === 'PLOT-ALPHA') ? '#15803d' : (plot.id === 'PLOT-BETA') ? '#eab308' : '#0284C7';
      fillOpacity = intelDprviOpacity / 100;
    } else if (layer === 'rvi') {
      const val = plot.id === 'PLOT-ALPHA' ? 0.72 : plot.id === 'PLOT-BETA' ? 0.45 : 0.62;
      fillColor = val > 0.70 ? '#14532D' : val > 0.50 ? '#16A34A' : val > 0.30 ? '#86EFAC' : val > 0.15 ? '#EAB308' : '#EF4444';
      fillOpacity = intelRviOpacity / 100;
    } else if (layer === 'flood') {
      fillColor = plot.id === 'PLOT-BETA' ? '#1e3a8a' : 'transparent';
      fillOpacity = intelFloodOpacity / 100;
    } else if (layer === 'uas') {
      fillColor = plot.id === 'PLOT-BETA' ? '#dc2626' : 'transparent';
      fillOpacity = intelUasOpacity / 100;
    }
    
    return {
      color: 'transparent',
      weight: 0,
      opacity: 0,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  };


  // Helper methods to render overlapping active layers
  const renderIntelPolygons = (plots, suffix = '') => {
    const activeLayers = [];
    if (intelShowGrowth) activeLayers.push('growth');
    if (intelShowEvi) activeLayers.push('evi');
    if (intelShowLswi) activeLayers.push('lswi');
    if (intelShowVhi) activeLayers.push('vhi');
    if (intelShowSuitability) activeLayers.push('suitability');
    if (intelShowCvi) activeLayers.push('cvi');
    if (intelShowCar) activeLayers.push('car');
    if (intelShowNdre) activeLayers.push('ndre');
    if (intelShowWdi) activeLayers.push('wdi');
    if (intelShowDprvi) activeLayers.push('dprvi');
    if (intelShowRvi) activeLayers.push('rvi');
    if (intelShowFlood) activeLayers.push('flood');
    if (intelShowUas) activeLayers.push('uas');

    return plots.map(plot => {
      const keyPrefix = `${plot.id}${suffix ? '-' + suffix : ''}`;
      return (
        <React.Fragment key={keyPrefix}>
          {/* Base Boundary outline */}
          {intelShowBoundaries && (
            <Polygon 
              positions={plot.coords}
              pathOptions={getIntelPlotStyleOutline()}
              eventHandlers={{ click: () => setSelectedPlot(plot) }}
            />
          )}
          {/* Active Fill Layers */}
          {activeLayers.map(layer => (
            <Polygon
              key={`${keyPrefix}-${layer}`}
              positions={plot.coords}
              pathOptions={getIntelPlotStyleFill(plot, layer)}
              eventHandlers={{ click: () => setSelectedPlot(plot) }}
            >
                          <Popup>
              <div className="p-3 w-72 max-h-[350px] overflow-y-auto font-sans text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
                    {suffix === 'left' ? 'Intelligence Popup (Left)' : suffix === 'right' ? 'Intelligence Popup (Right)' : 'Intelligence Popup'}
                  </span>
                  <span className="text-[9px] font-black bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md">
                    WGS 84
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-gray-950 leading-tight">{plot.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{plot.id}</p>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl text-white">
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Index Summary</div>
                  <p className="text-[10.5px] font-medium italic leading-relaxed text-slate-100">
                    "{plot.id}: {plot.id === 'PLOT-BETA' ? 'Elevated anomaly score detected in crop water stress index (WDI).' : 'Optimal vigor (CVI) and stable chlorophyll concentration.'}"
                  </p>
                </div>

                <div className="h-24 bg-gray-50 rounded-xl p-1.5">
                  <Line data={{
                    labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                    datasets: [{
                      data: TIMELINE_DATA.map(t =>
                        plot.id === 'PLOT-ALPHA' ? t.ndvi + 0.04 :
                        plot.id === 'PLOT-BETA'  ? t.ndvi - 0.15 : t.ndvi - 0.05),
                      borderColor: '#16A34A', borderWidth: 2, backgroundColor: 'rgba(22,163,74,0.06)',
                      fill: true, tension: 0.3, pointRadius: 2
                    }]
                  }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                </div>

                <div className="border border-green-50 rounded-lg p-2 bg-green-50/20 space-y-1">
                  <div className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Average</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-semibold text-gray-700">
                    <div>CVI Vigor:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.ndvi.toFixed(2)}</div>
                    <div>WDI Deficit:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.ndmi.toFixed(2)}</div>
                    <div>CAR Chlorophyll:</div>
                    <div className="text-right text-gray-950 font-bold">{(plot.ndvi * 0.9).toFixed(2)}</div>
                    <div>UAS Anomaly:</div>
                    <div className="text-right text-red-600 font-bold">{plot.id === 'PLOT-BETA' ? '0.75' : plot.id === 'PLOT-GAMMA' ? '0.45' : '0.15'}</div>
                  </div>
                </div>
              </div>
            </Popup>
            </Polygon>
          ))}
        </React.Fragment>
      );
    });
  };

  const renderHealthPolygons = (plots, suffix = '') => {
    const activeLayers = [];
    if (healthShowNdvi) activeLayers.push('ndvi');
    if (healthShowChlorophyll) activeLayers.push('chlorophyll');
    if (healthShowWater) activeLayers.push('water');
    if (healthShowPest) activeLayers.push('pest');
    if (healthShowNdre) activeLayers.push('ndre');
    if (healthShowSmi) activeLayers.push('smi');

    return plots.map(plot => {
      const keyPrefix = `${plot.id}${suffix ? '-' + suffix : ''}`;
      const activePlotHandler = suffix === 'left' || suffix === 'right' ? setSelectedHealthPlot : setSelectedHealthPlot;
      return (
        <React.Fragment key={keyPrefix}>
          {/* Base Boundary outline */}
          {healthShowBoundaries && (
            <Polygon 
              positions={plot.coords}
              pathOptions={getHealthPlotStyleOutline()}
              eventHandlers={{ click: () => activePlotHandler(plot) }}
            />
          )}
          {/* Active Fill Layers */}
          {activeLayers.map(layer => (
            <Polygon
              key={`${keyPrefix}-${layer}`}
              positions={plot.coords}
              pathOptions={getHealthPlotStyleFill(plot, layer)}
              eventHandlers={{ click: () => activePlotHandler(plot) }}
            >
                          <Popup>
              <div className="p-3 w-72 max-h-[350px] overflow-y-auto font-sans text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
                    {suffix === 'left' ? 'Crop Health Popup (Left)' : suffix === 'right' ? 'Crop Health Popup (Right)' : 'Crop Health Popup'}
                  </span>
                  <span className="text-[9px] font-black bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md">
                    WGS 84
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-gray-950 leading-tight">{plot.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{plot.id}</p>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl text-white">
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Agronomic Health Summary</div>
                  <p className="text-[10.5px] font-medium italic leading-relaxed text-slate-100">
                    "{plot.id} currently displays a '{plot.health}' status with pest risk categorized as {plot.pestRisk}."
                  </p>
                </div>

                <div className="h-24 bg-gray-50 rounded-xl p-1.5">
                  <Line data={{
                    labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                    datasets: [{
                      data: TIMELINE_DATA.map(t =>
                        plot.id === 'PLOT-ALPHA' ? t.ndvi + 0.04 :
                        plot.id === 'PLOT-BETA'  ? t.ndvi - 0.15 : t.ndvi - 0.05),
                      borderColor: '#16A34A', borderWidth: 2, backgroundColor: 'rgba(22,163,74,0.06)',
                      fill: true, tension: 0.3, pointRadius: 2
                    }]
                  }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                </div>

                <div className="border border-green-50 rounded-lg p-2 bg-green-50/20 space-y-1">
                  <div className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Average</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-semibold text-gray-700">
                    <div>NDVI Index:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.ndvi.toFixed(2)}</div>
                    <div>Chlorophyll:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.chlorophyll.toFixed(2)}</div>
                    <div>Water Status:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.waterStress.toFixed(2)}</div>
                    <div>Pest Risk:</div>
                    <div className="text-right font-bold text-gray-950">{plot.pestRisk}</div>
                  </div>
                </div>
              </div>
            </Popup>
            </Polygon>
          ))}
        </React.Fragment>
      );
    });
  };

  const renderYieldPolygons = (plots, suffix = '') => {
    const activeLayers = [];
    if (yieldShowYield) activeLayers.push('yield');
    if (yieldShowBiomass) activeLayers.push('biomass');
    if (yieldShowReadiness) activeLayers.push('readiness');
    if (yieldShowGrowth) activeLayers.push('growth');

    return plots.map(plot => {
      const keyPrefix = `${plot.id}${suffix ? '-' + suffix : ''}`;
      const activePlotHandler = setSelectedYieldPlot;
      return (
        <React.Fragment key={keyPrefix}>
          {/* Base Boundary outline */}
          {yieldShowBoundaries && (
            <Polygon 
              positions={plot.coords}
              pathOptions={getYieldPlotStyleOutline()}
              eventHandlers={{ click: () => activePlotHandler(plot) }}
            />
          )}
          {/* Active Fill Layers */}
          {activeLayers.map(layer => (
            <Polygon
              key={`${keyPrefix}-${layer}`}
              positions={plot.coords}
              pathOptions={getYieldPlotStyleFill(plot, layer)}
              eventHandlers={{ click: () => activePlotHandler(plot) }}
            >
                          <Popup>
              <div className="p-3 w-72 max-h-[350px] overflow-y-auto font-sans text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
                    {suffix === 'left' ? 'Crop Yield Popup (Left)' : suffix === 'right' ? 'Crop Yield Popup (Right)' : 'Crop Yield Popup'}
                  </span>
                  <span className="text-[9px] font-black bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md">
                    WGS 84
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-gray-950 leading-tight">{plot.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{plot.id}</p>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl text-white">
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Yield Prediction Analysis</div>
                  <p className="text-[10.5px] font-medium italic leading-relaxed text-slate-100">
                    "Plot {plot.id} is projected at {plot.predictedYield} Tonnes total yield ({plot.yieldValue} t/HA) with a prediction accuracy of {plot.predAccuracy}. Status: {plot.yieldStatus}."
                  </p>
                </div>

                <div className="h-24 bg-gray-50 rounded-xl p-1.5">
                  <Line data={{
                    labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                    datasets: [{
                      data: TIMELINE_DATA.map(t =>
                        plot.id === 'PLOT-ALPHA' ? t.ndvi * 24.5 :
                        plot.id === 'PLOT-BETA'  ? (t.ndvi - 0.15) * 19.5 : (t.ndvi - 0.05) * 21.5),
                      borderColor: '#16A34A', borderWidth: 2, backgroundColor: 'rgba(22,163,74,0.06)',
                      fill: true, tension: 0.3, pointRadius: 2
                    }]
                  }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                </div>

                <div className="border border-green-50 rounded-lg p-2 bg-green-50/20 space-y-1">
                  <div className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Average</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-semibold text-gray-700">
                    <div>Est. Yield:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.yieldValue} t/HA</div>
                    <div>Biomass:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.biomass} kg/m²</div>
                    <div>Maturity Ratio:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.readiness}%</div>
                    <div>Growth Index:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.growth.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </Popup>
            </Polygon>
          ))}
        </React.Fragment>
      );
    });
  };

  const renderRestorePolygons = (zones, suffix = '') => {
    const activeLayers = [];
    if (restoreShowProgress) activeLayers.push('progress');
    if (restoreShowSurvival) activeLayers.push('survival');
    if (restoreShowCarbon) activeLayers.push('carbon');
    if (restoreShowBiodiversity) activeLayers.push('biodiversity');
    if (restoreShowInSar) activeLayers.push('insar');
    if (restoreShowGedi) activeLayers.push('gedi');
    if (restoreShowNdwi) activeLayers.push('ndwi');
    if (restoreShowLulc) activeLayers.push('lulc');
    if (restoreShowEudr) activeLayers.push('eudr');
    if (restoreShowAgb) activeLayers.push('agb');

    return zones.map(zone => {
      const keyPrefix = `${zone.id}${suffix ? '-' + suffix : ''}`;
      return (
        <React.Fragment key={keyPrefix}>
          {/* Base Boundary outline */}
          {restoreShowBoundaries && (
            <Polygon 
              positions={zone.coords}
              pathOptions={getRestorePlotStyleOutline()}
              eventHandlers={{ click: () => setSelectedRestoreZone(zone) }}
            />
          )}
          {/* Active Fill Layers */}
          {activeLayers.map(layer => (
            <Polygon
              key={`${keyPrefix}-${layer}`}
              positions={zone.coords}
              pathOptions={getRestorePlotStyleFill(zone, layer)}
              eventHandlers={{ click: () => setSelectedRestoreZone(zone) }}
            >
                          <Popup>
              <div className="p-3 w-72 max-h-[350px] overflow-y-auto font-sans text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
                    {suffix === 'left' ? 'Restoration Popup (Left)' : suffix === 'right' ? 'Restoration Popup (Right)' : 'Restoration Popup'}
                  </span>
                  <span className="text-[9px] font-black bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md">
                    WGS 84
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-gray-950 leading-tight">{zone.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{zone.id}</p>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl text-white">
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Progress Summary</div>
                  <p className="text-[10.5px] font-medium italic leading-relaxed text-slate-100">
                    "Managing under supervisor {zone.manager}. Currently showing {zone.status} with {zone.survival} seedling survival. Active carbon sequestered: {zone.carbon} tCO2e."
                  </p>
                </div>

                <div className="h-24 bg-gray-50 rounded-xl p-1.5">
                  <Line data={{
                    labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                    datasets: [{
                      data: TIMELINE_DATA.map(t =>
                        zone.id === 'ZONE-ALPHA' ? Math.min(100, Math.round(t.ndvi * 125)) :
                        zone.id === 'ZONE-BETA'  ? Math.min(100, Math.round((t.ndvi - 0.15) * 115)) : Math.min(100, Math.round((t.ndvi - 0.05) * 105))),
                      borderColor: '#16A34A', borderWidth: 2, backgroundColor: 'rgba(22,163,74,0.06)',
                      fill: true, tension: 0.3, pointRadius: 2
                    }]
                  }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                </div>

                <div className="border border-green-50 rounded-lg p-2 bg-green-50/20 space-y-1">
                  <div className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Average</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-semibold text-gray-700">
                    <div>Canopy Progress:</div>
                    <div className="text-right text-gray-950 font-bold">{zone.progress}%</div>
                    <div>Seedling Survival:</div>
                    <div className="text-right text-gray-950 font-bold">{zone.survival}</div>
                    <div>Carbon Offset:</div>
                    <div className="text-right text-gray-950 font-bold">{zone.carbon}</div>
                    <div>Species Count:</div>
                    <div className="text-right text-gray-950 font-bold">{zone.trees} trees</div>
                    <div>Site Manager:</div>
                    <div className="text-right text-gray-950 font-bold">{zone.manager}</div>
                  </div>
                </div>
              </div>
            </Popup>
            </Polygon>
          ))}
        </React.Fragment>
      );
    });
  };

  const renderClimatePolygons = (plots, suffix = '') => {
    const activeLayers = [];
    if (climateShowRainfall) activeLayers.push('rainfall');
    if (climateShowSoilTemp) activeLayers.push('soilTemp');
    if (climateShowLst) activeLayers.push('lst');
    if (climateShowVaporDeficit) activeLayers.push('vpd');
    if (climateShowFlood) activeLayers.push('flood');

    return plots.map(plot => {
      const keyPrefix = `${plot.id}${suffix ? '-' + suffix : ''}`;
      const activePlotHandler = setSelectedClimatePlot;
      return (
        <React.Fragment key={keyPrefix}>
          {/* Base Boundary outline */}
          {climateShowBoundaries && (
            <Polygon 
              positions={plot.coords}
              pathOptions={getClimatePlotStyleOutline()}
              eventHandlers={{ click: () => activePlotHandler(plot) }}
            />
          )}
          {/* Active Fill Layers */}
          {activeLayers.map(layer => (
            <Polygon
              key={`${keyPrefix}-${layer}`}
              positions={plot.coords}
              pathOptions={getClimatePlotStyleFill(plot, layer)}
              eventHandlers={{ click: () => activePlotHandler(plot) }}
            >
                          <Popup>
              <div className="p-3 w-72 max-h-[350px] overflow-y-auto font-sans text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
                    {suffix === 'left' ? 'Climate Popup (Left)' : suffix === 'right' ? 'Climate Popup (Right)' : 'Climate Popup'}
                  </span>
                  <span className="text-[9px] font-black bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md">
                    WGS 84
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-gray-950 leading-tight">{plot.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{plot.id}</p>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl text-white">
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Microclimate Summary</div>
                  <p className="text-[10.5px] font-medium italic leading-relaxed text-slate-100">
                    "Telemetry feed active from Abeokuta MET station. Sensor node battery status: 94%. Current relative humidity: 68%. VPD transpiration stress level: {plot.vpd} kPa."
                  </p>
                </div>

                <div className="h-24 bg-gray-50 rounded-xl p-1.5">
                  <Line data={{
                    labels: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
                    datasets: [{
                      data: TIMELINE_DATA.map((t, idx) =>
                        plot.id === 'PLOT-ALPHA' ? 12 + idx * 4 :
                        plot.id === 'PLOT-BETA'  ? 10 + idx * 3 : 11 + idx * 4),
                      borderColor: '#1D4ED8', borderWidth: 2, backgroundColor: 'rgba(29,78,216,0.06)',
                      fill: true, tension: 0.3, pointRadius: 2
                    }]
                  }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { size: 8 } } } } }} />
                </div>

                <div className="border border-green-50 rounded-lg p-2 bg-green-50/20 space-y-1">
                  <div className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Average</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-semibold text-gray-700">
                    <div>Precipitation:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.rainfall} mm</div>
                    <div>Soil Temp:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.soilTemp}°C</div>
                    <div>Surface Temp:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.lst}°C</div>
                    <div>VPD Stress:</div>
                    <div className="text-right text-gray-950 font-bold">{plot.vpd} kPa</div>
                  </div>
                </div>
              </div>
            </Popup>
            </Polygon>
          ))}
        </React.Fragment>
      );
    });
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
    if (item === 'analytics') setActiveTab('monitor');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveSidebarItem('analytics');
  };

  const handlePlotFilterChange = (plotId) => {
    setFilterPlot(plotId);
    handlePlotChange(plotId);
  };

  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Acknowledged' } : a));
  };

  const handleAcknowledgeAllPlotAlerts = (plotId) => {
    setAlerts(prev => prev.map(a => a.plot === plotId ? { ...a, status: 'Acknowledged' } : a));
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
      { id: 'ZONE-ALPHA', name: 'Canopy Reforestation', area: '6.4 HA', type: 'Canopy Density', progress: Math.min(100, Math.round(base * 125)), survival: '94%', trees: '1,200', carbon: parseFloat((base * 60).toFixed(1)), status: 'Optimal Growth', color: '#16A34A', coords: RESTORE_ZONE_A_COORDS, manager: 'John Musa', survivalNum: 94, insar: 0.85, gedi: 18, ndwi: 0.35, lulc: 'Forest', eudr: 'Compliant' },
      { id: 'ZONE-BETA',  name: 'Native Species Agroforestry', area: '5.8 HA', type: 'Species Diversification', progress: Math.min(100, Math.round((base - 0.15) * 115)), survival: '89%', trees: '980', carbon: parseFloat(((base - 0.15) * 50).toFixed(1)), status: 'Active Care', color: '#EAB308', coords: RESTORE_ZONE_B_COORDS, manager: 'Alice Peters', survivalNum: 89, insar: 0.62, gedi: 12, ndwi: 0.22, lulc: 'Shrubland', eudr: 'Warning' },
      { id: 'ZONE-GAMMA', name: 'Riparian Buffer Restoration', area: '8.1 HA', type: 'Soil Stabilization', progress: Math.min(100, Math.round((base - 0.05) * 105)), survival: '81%', trees: '1,550', carbon: parseFloat(((base - 0.05) * 35).toFixed(1)), status: 'Initial Phase', color: '#0284C7', coords: RESTORE_ZONE_C_COORDS, manager: 'David Kalu', survivalNum: 81, insar: 0.38, gedi: 4, ndwi: -0.15, lulc: 'Cropland', eudr: 'Deforested' }
    ];
  }, [currentTimelineA]);

  const restorationPlotsDataB = useMemo(() => {
    const base = currentTimelineB.ndvi;
    return [
      { id: 'ZONE-ALPHA', name: 'Canopy Reforestation', area: '6.4 HA', type: 'Canopy Density', progress: Math.min(100, Math.round(base * 125)), survival: '94%', trees: '1,200', carbon: parseFloat((base * 60).toFixed(1)), status: 'Optimal Growth', color: '#16A34A', coords: RESTORE_ZONE_A_COORDS, manager: 'John Musa', survivalNum: 94, insar: 0.85, gedi: 18, ndwi: 0.35, lulc: 'Forest', eudr: 'Compliant' },
      { id: 'ZONE-BETA',  name: 'Native Species Agroforestry', area: '5.8 HA', type: 'Species Diversification', progress: Math.min(100, Math.round((base - 0.15) * 115)), survival: '89%', trees: '980', carbon: parseFloat(((base - 0.15) * 50).toFixed(1)), status: 'Active Care', color: '#EAB308', coords: RESTORE_ZONE_B_COORDS, manager: 'Alice Peters', survivalNum: 89, insar: 0.62, gedi: 12, ndwi: 0.22, lulc: 'Shrubland', eudr: 'Warning' },
      { id: 'ZONE-GAMMA', name: 'Riparian Buffer Restoration', area: '8.1 HA', type: 'Soil Stabilization', progress: Math.min(100, Math.round((base - 0.05) * 105)), survival: '81%', trees: '1,550', carbon: parseFloat(((base - 0.05) * 35).toFixed(1)), status: 'Initial Phase', color: '#0284C7', coords: RESTORE_ZONE_C_COORDS, manager: 'David Kalu', survivalNum: 81, insar: 0.38, gedi: 4, ndwi: -0.15, lulc: 'Cropland', eudr: 'Deforested' }
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
      <div style={{ height: `${bottomPanelHeight}px` }} className="bg-white border-t border-gray-200 shrink-0 flex flex-col relative overflow-hidden">
        {/* Draggable horizontal divider */}
        <div 
          onMouseDown={startBottomPanelResize} 
          className="absolute top-[-4px] left-0 right-0 h-2 cursor-row-resize hover:bg-green-500/55 active:bg-green-500 transition-colors z-50"
        />
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

        <div className="flex divide-x divide-gray-100 bg-gray-50/30 min-h-0 flex-1">
          {/* Mini Calendar (Enlarged) */}
          {!hideCalendarAndSlider && showCalendarTool && (
            <div className="p-4 shrink-0 w-[352px] bg-white flex flex-col justify-between overflow-y-auto">
              <div>


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

  const ndmiTrendsData = useMemo(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const datasets = [];

    const alphaData = [0.38, 0.40, 0.42, 0.44, currentTimeline.ndmi + 0.02, 0.46];
    const betaData = [0.30, 0.32, 0.31, 0.33, currentTimeline.ndmi - 0.10, 0.35];
    const gammaData = [0.35, 0.36, 0.37, 0.38, currentTimeline.ndmi - 0.04, 0.40];
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

  const rviTrendsData = useMemo(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const datasets = [];

    const alphaData = [0.45, 0.52, 0.60, 0.68, 0.72, 0.75];
    const betaData = [0.35, 0.40, 0.42, 0.44, 0.45, 0.48];
    const gammaData = [0.40, 0.45, 0.50, 0.58, 0.62, 0.65];
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
  }, [filterPlot]);

  const soilTempTrendsData = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const expected = [24.5, 25.0, 25.5, 24.8, 25.2, 26.0, 26.5];
    let actual = [24.0, 24.8, 25.2, 24.5, 25.0, 25.8, 26.2];
    if (filterPlot === 'PLOT-ALPHA') {
      actual = [23.8, 24.2, 24.8, 24.2, 24.5, 25.2, 25.5];
    } else if (filterPlot === 'PLOT-BETA') {
      actual = [26.5, 27.2, 28.0, 27.5, 28.2, 29.0, 29.5];
    } else if (filterPlot === 'PLOT-GAMMA') {
      actual = [24.2, 24.9, 25.4, 24.7, 25.1, 25.9, 26.3];
    }
    return {
      labels,
      datasets: [
        { label: 'Optimal Soil Temp Base [°C]', data: expected, borderColor: '#64748B', borderDash: [5, 5], fill: false, tension: 0.1, pointRadius: 0 },
        { label: 'Actual Soil Temp [°C]', data: actual, borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.05)', fill: true, tension: 0.1, pointRadius: 3 }
      ]
    };
  }, [filterPlot]);

  const vpdTrendsData = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const criticalThreshold = [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0];
    let actual = [1.2, 1.4, 1.6, 1.3, 1.5, 1.8, 1.9];
    if (filterPlot === 'PLOT-ALPHA') {
      actual = [1.0, 1.1, 1.3, 1.2, 1.2, 1.4, 1.5];
    } else if (filterPlot === 'PLOT-BETA') {
      actual = [2.1, 2.3, 2.4, 2.2, 2.3, 2.5, 2.6];
    } else if (filterPlot === 'PLOT-GAMMA') {
      actual = [1.3, 1.5, 1.7, 1.4, 1.6, 1.9, 2.0];
    }
    return {
      labels,
      datasets: [
        { label: 'Critical Stress Threshold [kPa]', data: criticalThreshold, borderColor: '#EF4444', borderDash: [4, 4], fill: false, tension: 0, pointRadius: 0 },
        { label: 'Atmospheric VPD [kPa]', data: actual, borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.05)', fill: true, tension: 0.2, pointRadius: 4 }
      ]
    };
  }, [filterPlot]);

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

  const gddReferenceData = useMemo(() => {
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
    const expected = [15, 30, 45, 60, 75, 90, 105, 120];
    const actual = [14, 28, 42, 58, 76, filterPlot === 'PLOT-BETA' ? 82 : 92, filterPlot === 'PLOT-BETA' ? 95 : 110, filterPlot === 'PLOT-BETA' ? 108 : 124];
    return {
      labels,
      datasets: [
        { label: 'Expected GDD Curve', data: expected, borderColor: '#64748B', borderDash: [5, 5], fill: false, tension: 0.1, pointRadius: 0 },
        { label: 'Actual Plot GDD', data: actual, borderColor: '#16A34A', backgroundColor: 'rgba(22, 163, 74, 0.05)', fill: true, tension: 0.1, pointRadius: 3 }
      ]
    };
  }, [filterPlot]);

  const gddCompletionData = useMemo(() => {
    return {
      labels: ['West Valley Plot', 'East Ridge Plot', 'South Slope Plot'],
      datasets: [{
        label: 'GDD Completion %',
        data: [92, filterPlot === 'PLOT-BETA' ? 76 : 85, 89],
        backgroundColor: ['#16A34A', '#EAB308', '#0284C7'],
        borderRadius: 8
      }]
    };
  }, [filterPlot]);

  const etTimeSeriesData = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseETc = [4.2, 4.5, 4.8, 4.6, 4.7, 4.9, 5.0];
    let baseETa = [4.1, 4.3, 4.6, 4.2, 4.0, 4.1, 4.2];
    if (filterPlot === 'PLOT-ALPHA') {
      baseETa = [4.2, 4.4, 4.7, 4.6, 4.6, 4.8, 4.9];
    } else if (filterPlot === 'PLOT-BETA') {
      baseETa = [3.2, 3.1, 3.0, 2.9, 2.8, 2.7, 2.5];
    } else if (filterPlot === 'PLOT-GAMMA') {
      baseETa = [3.9, 4.1, 4.3, 4.1, 3.9, 4.0, 4.1];
    }
    return {
      labels,
      datasets: [
        { label: 'Crop Water Demand (ETc) [mm/day]', data: baseETc, borderColor: '#3B82F6', borderDash: [4, 4], fill: false, tension: 0.2, pointRadius: 3 },
        { label: 'Actual Transpiration (ETa) [mm/day]', data: baseETa, borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.05)', fill: true, tension: 0.2, pointRadius: 4 }
      ]
    };
  }, [filterPlot]);

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
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ring-4 transition-all ${brandingMode === 'AM' ? 'ring-green-50' : 'ring-blue-50'}`} style={{ backgroundColor: brandingMode === 'AM' ? '#16A34A' : '#2563EB' }}>
              <Satellite className="text-white" size={21} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900 leading-none">
                {brandingMode === 'AM' ? 'Agro Monitoring' : 'Farm Tools Harvest'}
              </h1>
              <p className={`text-[11px] font-semibold uppercase tracking-widest mt-1 leading-none ${brandingMode === 'AM' ? 'text-green-600' : 'text-blue-600'}`}>
                {brandingMode === 'AM' ? 'Enterprise Satellite Node' : 'Agricultural Operations Hub'}
              </p>
            </div>
          </div>
        </div>

        {/* ── TOP TABS ── */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'monitor',      label: 'Monitor',      icon: <Activity size={15} /> },
            { id: 'reports',      label: 'Reports',      icon: <FileText size={15} /> },
            { id: 'verification', label: 'Verification', icon: <Shield size={15} /> },
            { id: 'ai-assistant', label: 'AI Scenario Modeler', icon: <Sparkles size={15} /> }
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
          <div className="relative">
            <button 
              onClick={() => { setShowNotifications(n => !n); setShowUserMenu(false); }}
              className={`p-2.5 rounded-xl transition-all border relative ${showNotifications ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white animate-pulse" style={{ backgroundColor: '#EF4444' }}></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[500] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3.5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="text-xs font-black uppercase tracking-wider text-gray-700">Live Alerts Feed</div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${brandingMode === 'AM' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>3 Active</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                  <div className="p-3 hover:bg-gray-50 transition-colors flex gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-ping" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-900">Critical Waterlogging Alert</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Plot Beta (East Ridge Plot) registers high anomaly score.</div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 transition-colors flex gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-900">NDVI Decline Flag</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">West Valley Plot has dropped 8% below baseline average.</div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 transition-colors flex gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-900">New Sentinel Pass Ingested</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Weekly cloud-free composite uploaded successfully.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          {/* Clickable user avatar with sign-out dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => { setShowUserMenu(s => !s); setShowNotifications(false); }}
              className="flex items-center gap-3 hover:opacity-80 transition-all"
            >
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 leading-none">{profileName}</div>
                <div className={`text-[11px] font-semibold tracking-wider mt-1 uppercase ${brandingMode === 'AM' ? 'text-green-600' : 'text-blue-600'}`}>{profileRole}</div>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border hover:ring-2 transition-all ${brandingMode === 'AM' ? 'text-green-700 border-green-200 hover:ring-green-200 bg-green-50' : 'text-blue-700 border-blue-200 hover:ring-blue-200 bg-blue-50'}`}>
                {brandingMode === 'AM' ? 'AM' : 'FT'}
              </div>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2.5 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[500] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 bg-gray-50/50 flex flex-col items-center text-center border-b border-gray-100">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-md mb-2.5" style={{ backgroundColor: brandingMode === 'AM' ? '#16A34A' : '#2563EB' }}>
                    {brandingMode === 'AM' ? 'AM' : 'FT'}
                  </div>
                  <div className="text-sm font-extrabold text-gray-950">{profileName}</div>
                  <div className="text-[11px] font-semibold text-gray-400 mt-0.5">{profileEmail}</div>
                  <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full mt-2 border ${brandingMode === 'AM' ? 'bg-green-50 text-green-700 border-green-150' : 'bg-blue-50 text-blue-700 border-blue-150'}`}>
                    {profileRole}
                  </span>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => { setShowUserMenu(false); setShowSettingsModal(true); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <Settings2 size={15} className="text-gray-400" />
                    Settings Center
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); onSignOut(); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
          <aside style={{ width: `${sidebarWidth}px` }} className="bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm shrink-0 relative">
            {/* Draggable vertical divider */}
            <div 
              onMouseDown={startSidebarResize} 
              className="absolute right-[-4px] top-0 bottom-0 w-2 cursor-col-resize hover:bg-green-500/50 active:bg-green-500 transition-colors z-50"
            />
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">

              {/* MAIN */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Main</div>
                {[
                  { id: 'analytics',           label: 'Analytics Hub',       icon: <LayoutDashboard size={17} /> },
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
                    style={{ backgroundColor: activeSidebarItem === item.id ? (brandingMode === 'AM' ? '#16A34A' : '#2563EB') : undefined }}
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
                  { id: 'slider-tool',   label: 'Time Slider',  icon: <SlidersHorizontal size={17} />, active: showTimeSliderTool, toggle: () => setShowTimeSliderTool(!showTimeSliderTool) },
                  { id: 'compare-tool',  label: 'Split Comparison', icon: <Columns size={17} />, active: isCompareMode, toggle: () => {
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
                  } }
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

                {isCompareMode && (
                  <div className="px-3 py-2.5 bg-blue-50/40 rounded-xl mt-1.5 space-y-2 border border-blue-100/50">
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-widest px-1">Active Date Slot</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setActiveDateSlot('A')}
                        className={`py-2 px-1.5 rounded-lg text-[10px] font-extrabold text-center border transition-all ${
                          activeDateSlot === 'A'
                            ? 'bg-green-600 text-white border-green-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Left
                      </button>
                      <button
                        onClick={() => setActiveDateSlot('B')}
                        className={`py-2 px-1.5 rounded-lg text-[10px] font-extrabold text-center border transition-all ${
                          activeDateSlot === 'B'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Right
                      </button>
                    </div>
                  </div>
                )}
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
                    style={{ backgroundColor: activeSidebarItem === item.id ? (brandingMode === 'AM' ? '#16A34A' : '#2563EB') : undefined }}
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
          {activeSidebarItem === 'analytics' && activeTab === 'monitor' && (() => {
            const ANALYTICS_SUBPAGES = [
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
              { id: 'vigor-health', label: 'Vigor & Phenology', icon: <TrendingUp size={15} /> },
              { id: 'moisture-et', label: 'Moisture & ET', icon: <Droplets size={15} /> },
              { id: 'soil-nutrients', label: 'Soil & Nutrients', icon: <Sun size={15} /> },
            ];
            return (
              <div className="p-10 space-y-10 animate-in fade-in duration-300">
                {/* Page header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Agro Analytics Hub</h2>
                    <p className="text-sm text-gray-500 font-medium mt-2 max-w-lg">
                      Direct analytical metrics derived from Sentinel-2 & Landsat-8 imagery pass dates.
                    </p>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 shrink-0">
                    <CalendarIcon size={16} className="text-green-600" />
                    <span className="text-sm font-bold text-gray-700">
                      Date last update: {currentTimeline.label}
                    </span>
                  </div>
                </div>

                {/* Subtabs Menu */}
                <div className="flex border-b border-gray-200">
                  {ANALYTICS_SUBPAGES.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveAnalyticsSubpage(sub.id)}
                      className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all outline-none ${
                        activeAnalyticsSubpage === sub.id
                          ? 'border-green-600 text-green-600'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {sub.icon}
                      {sub.label}
                    </button>
                  ))}
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
                        onChange={e => handlePlotFilterChange(e.target.value)}
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

                {/* Subpage Contents */}
                {activeAnalyticsSubpage === 'overview' && (
                  <div className="space-y-10 animate-in fade-in duration-200">
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
                                {kpi.label} {renderInfoTooltip(kpi.label)}
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

                    {/* Land Classification Chart (Doughnut) */}
                    <div className="grid grid-cols-1 gap-8">
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Trees size={18} className="text-green-700" />
                            Land Classification Area {renderInfoTooltip("Land Classification Area")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            ESA WorldCover
                          </span>
                        </div>
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
                      
                      {/* LAND USE & COMPLIANCE SECTION */}
                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div 
                          onClick={() => setRestoreLulcExpanded(!restoreLulcExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {restoreLulcExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Land Use & Compliance
                        </div>
                        {restoreLulcExpanded && (
                          <div className="space-y-3">
                            {/* LULC Classification Card */}
                            <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">LULC Classification {renderInfoTooltip("LULC Classification")}</div>
                                  <span className="text-[10px] text-gray-400 font-medium">ESA WorldCover pixel maps</span>
                                </div>
                                <button
                                  onClick={() => handleRestoreToggle('lulc')}
                                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                    restoreShowLulc ? 'bg-green-600' : 'bg-gray-200'
                                  }`}
                                  style={{ backgroundColor: restoreShowLulc ? '#16A34A' : '#E5E7EB' }}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                    restoreShowLulc ? 'translate-x-4' : 'translate-x-0'
                                  }`} />
                                </button>
                              </div>
                              {restoreShowLulc && (
                                <div className="space-y-2.5 pt-1 border-t border-gray-50">
                                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                    <span>Opacity</span>
                                    <span>{restoreLulcOpacity}%</span>
                                  </div>
                                  <input type="range" min="10" max="100" value={restoreLulcOpacity}
                                    onChange={e => setRestoreLulcOpacity(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                                    {[
                                      { label: 'Forest', color: '#15803d' },
                                      { label: 'Shrubland', color: '#86efac' },
                                      { label: 'Cropland', color: '#fde047' },
                                      { label: 'Bare Soil', color: '#ca8a04' },
                                      { label: 'Water', color: '#3b82f6' },
                                      { label: 'Builtup', color: '#94a3b8' }
                                    ].map((item, i) => (
                                      <div key={i} className="flex items-center gap-1.5">
                                        <div className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-[9px] font-semibold text-gray-500 leading-none">{item.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* EUDR Deforestation Card */}
                            <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">EUDR Deforestation {renderInfoTooltip("EUDR Deforestation")}</div>
                                  <span className="text-[10px] text-gray-400 font-medium">EU Deforestation Regulation audit</span>
                                </div>
                                <button
                                  onClick={() => handleRestoreToggle('eudr')}
                                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                    restoreShowEudr ? 'bg-green-600' : 'bg-gray-200'
                                  }`}
                                  style={{ backgroundColor: restoreShowEudr ? '#16A34A' : '#E5E7EB' }}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                    restoreShowEudr ? 'translate-x-4' : 'translate-x-0'
                                  }`} />
                                </button>
                              </div>
                              {restoreShowEudr && (
                                <div className="space-y-2.5 pt-1 border-t border-gray-50">
                                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                    <span>Opacity</span>
                                    <span>{restoreEudrOpacity}%</span>
                                  </div>
                                  <input type="range" min="10" max="100" value={restoreEudrOpacity}
                                    onChange={e => setRestoreEudrOpacity(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                                    {[
                                      { label: 'Compliant (Deforestation-Free)', color: '#16a34a' },
                                      { label: 'EUDR Warning Buffer', color: '#eab308' },
                                      { label: 'Non-Compliant Anomaly', color: '#dc2626' }
                                    ].map((item, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeAnalyticsSubpage === 'vigor-health' && (
                  <div className="space-y-10 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Crop Yield & Health Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <TrendingUp size={18} className="text-green-600" />
                            Geospatial Vegetation Vigor & Health Trends {renderInfoTooltip("Geospatial Vegetation Vigor & Health Trends")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            NDVI Normalized
                          </span>
                        </div>
                        <div className="h-[300px]">
                          <Line
                            data={yieldTrendsData}
                            options={{ ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0.2, max: 1.0 } } }}
                          />
                        </div>
                      </div>

                      {/* GDD Reference Curve */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Activity size={18} className="text-green-600" />
                            Seasonal Trajectory vs GDD Reference Curve {renderInfoTooltip("Seasonal Trajectory vs GDD Reference Curve")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            GDD Model
                          </span>
                        </div>
                        <div className="h-[300px]">
                          <Line
                            data={gddReferenceData}
                            options={CHART_DEFAULTS}
                          />
                        </div>
                      </div>

                      {/* Radar Vegetation Index (RVI) Growth Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <TrendingUp size={18} className="text-green-600" />
                            Radar Vegetation Index (RVI) Growth Trends {renderInfoTooltip("Radar Vegetation Index (RVI)")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            SAR RVI
                          </span>
                        </div>
                        <div className="h-[300px]">
                          <Line
                            data={rviTrendsData}
                            options={{ ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0.0, max: 1.0 } } }}
                          />
                        </div>
                      </div>

                      {/* GDD Completion Rate */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Activity size={18} className="text-green-600" />
                            Plot-by-Plot Growing Degree Days (GDD) Completion Rate {renderInfoTooltip("Plot-by-Plot Growing Degree Days (GDD) Completion Rate")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Thermal Units
                          </span>
                        </div>
                        <div className="h-[300px]">
                          <Bar
                            data={gddCompletionData}
                            options={CHART_DEFAULTS}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeAnalyticsSubpage === 'moisture-et' && (
                  <div className="space-y-10 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* ET Time Series Chart */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Droplets size={18} className="text-blue-600" />
                            FAO-56 Evapotranspiration Model {renderInfoTooltip("FAO-56 Evapotranspiration Model")}</h3>
                          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            ETc vs ETa
                          </span>
                        </div>
                        <div className="h-[300px]">
                          <Line
                            data={etTimeSeriesData}
                            options={CHART_DEFAULTS}
                          />
                        </div>
                      </div>

                      {/* Canopy Moisture Retention (NDMI) Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Droplets size={18} className="text-blue-600" />
                            Canopy Moisture Retention (NDMI) Trends {renderInfoTooltip("Moisture Retention (NDMI)")}</h3>
                          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            NDMI
                          </span>
                        </div>
                        <div className="h-[300px]">
                          <Line
                            data={ndmiTrendsData}
                            options={{ ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0.1, max: 0.7 } } }}
                          />
                        </div>
                      </div>

                      {/* Soil Temperature Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Sun size={18} className="text-amber-500" />
                            Soil Temperature Trends {renderInfoTooltip("Soil Temp")}</h3>
                          <span className="text-xs bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Soil Temp
                          </span>
                        </div>
                        <div className="h-[300px]">
                          <Line
                            data={soilTempTrendsData}
                            options={CHART_DEFAULTS}
                          />
                        </div>
                      </div>

                      {/* VPD Stress Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Activity size={18} className="text-purple-600" />
                            Vapor Pressure Deficit (VPD) Stress Trends {renderInfoTooltip("VPD Stress")}</h3>
                          <span className="text-xs bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            VPD Index
                          </span>
                        </div>
                        <div className="h-[300px]">
                          <Line
                            data={vpdTrendsData}
                            options={CHART_DEFAULTS}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Evapotranspiration Historical Log Table */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <Clock size={18} className="text-gray-600" />
                        7-Day Evapotranspiration Historical Log {renderInfoTooltip("7-Day Evapotranspiration Historical Log")}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-extrabold text-[10px]">
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Ref ETo (mm)</th>
                              <th className="py-3 px-4">Crop Kc</th>
                              <th className="py-3 px-4">Demand ETc (mm)</th>
                              <th className="py-3 px-4">Actual ETa (mm)</th>
                              <th className="py-3 px-4">Deficit (mm)</th>
                              <th className="py-3 px-4">Soil Moisture %</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            {[
                              { date: 'May 30', eto: '4.8', kc: '0.95', etc: '4.56', eta: filterPlot === 'PLOT-BETA' ? '2.50' : '4.40', deficit: filterPlot === 'PLOT-BETA' ? '2.06' : '0.16', sm: filterPlot === 'PLOT-BETA' ? '32%' : '44%' },
                              { date: 'May 29', eto: '5.0', kc: '0.95', etc: '4.75', eta: filterPlot === 'PLOT-BETA' ? '2.40' : '4.60', deficit: filterPlot === 'PLOT-BETA' ? '2.35' : '0.15', sm: filterPlot === 'PLOT-BETA' ? '33%' : '45%' },
                              { date: 'May 28', eto: '4.7', kc: '0.95', etc: '4.46', eta: filterPlot === 'PLOT-BETA' ? '2.30' : '4.35', deficit: filterPlot === 'PLOT-BETA' ? '2.16' : '0.11', sm: filterPlot === 'PLOT-BETA' ? '35%' : '47%' },
                              { date: 'May 27', eto: '4.9', kc: '0.95', etc: '4.65', eta: filterPlot === 'PLOT-BETA' ? '2.50' : '4.55', deficit: filterPlot === 'PLOT-BETA' ? '2.15' : '0.10', sm: filterPlot === 'PLOT-BETA' ? '37%' : '48%' },
                              { date: 'May 26', eto: '4.6', kc: '0.95', etc: '4.37', eta: filterPlot === 'PLOT-BETA' ? '2.60' : '4.25', deficit: filterPlot === 'PLOT-BETA' ? '1.77' : '0.12', sm: filterPlot === 'PLOT-BETA' ? '38%' : '49%' },
                              { date: 'May 25', eto: '4.5', kc: '0.95', etc: '4.27', eta: filterPlot === 'PLOT-BETA' ? '2.70' : '4.20', deficit: filterPlot === 'PLOT-BETA' ? '1.57' : '0.07', sm: filterPlot === 'PLOT-BETA' ? '40%' : '51%' },
                              { date: 'May 24', eto: '4.4', kc: '0.95', etc: '4.18', eta: filterPlot === 'PLOT-BETA' ? '2.80' : '4.10', deficit: filterPlot === 'PLOT-BETA' ? '1.38' : '0.08', sm: filterPlot === 'PLOT-BETA' ? '41%' : '52%' }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                <td className="py-3 px-4 font-bold">{row.date}</td>
                                <td className="py-3 px-4">{row.eto}</td>
                                <td className="py-3 px-4">{row.kc}</td>
                                <td className="py-3 px-4">{row.etc}</td>
                                <td className="py-3 px-4">
                                  <span className={parseFloat(row.deficit) > 1.0 ? 'text-red-650 font-bold' : 'text-green-600'}>
                                    {row.eta}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-semibold text-red-500">{row.deficit}</td>
                                <td className="py-3 px-4">{row.sm}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeAnalyticsSubpage === 'soil-nutrients' && (
                  <div className="space-y-10 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Nutrient Profiling (Radar) */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5 xl:col-span-1">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                          <Sun size={18} className="text-amber-500" />
                          Nutrient Profiling {renderInfoTooltip("Nutrient Profiling")}</h3>
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

                      {/* Detailed Soil Chemistry Diagnostics */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5 xl:col-span-2">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                          <Activity size={18} className="text-green-600" />
                          Detailed Soil Chemistry Diagnostics {renderInfoTooltip("Detailed Soil Chemistry Diagnostics")}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* Parameters Table/List */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Diagnostic Metrics</h4>
                            {[
                              { name: 'Soil pH', value: filterPlot === 'PLOT-BETA' ? '5.4 (Strongly Acidic)' : '6.5 (Optimal)', status: filterPlot === 'PLOT-BETA' ? 'Warning' : 'Good', color: filterPlot === 'PLOT-BETA' ? 'text-yellow-600' : 'text-green-600' },
                              { name: 'Organic Carbon', value: filterPlot === 'PLOT-BETA' ? '1.1% (Low)' : '2.4% (Healthy)', status: filterPlot === 'PLOT-BETA' ? 'Warning' : 'Good', color: filterPlot === 'PLOT-BETA' ? 'text-yellow-600' : 'text-green-600' },
                              { name: 'Total Nitrogen (N)', value: filterPlot === 'PLOT-BETA' ? '0.08% (Deficient)' : '0.18% (Adequate)', status: filterPlot === 'PLOT-BETA' ? 'Critical' : 'Good', color: filterPlot === 'PLOT-BETA' ? 'text-red-600' : 'text-green-600' },
                              { name: 'Available Phosphorus (P)', value: '14 ppm (Moderate)', status: 'Warning', color: 'text-yellow-600' },
                              { name: 'Exchangeable Potassium (K)', value: '185 ppm (High)', status: 'Good', color: 'text-green-600' }
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">{item.name}</span>
                                <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                              </div>
                            ))}
                          </div>

                          {/* Actionable Recommendations */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Agronomic Recommendations</h4>
                            <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl space-y-3">
                              {filterPlot === 'PLOT-BETA' ? (
                                <>
                                  <p className="text-xs text-green-800 leading-relaxed font-semibold">
                                    🔴 <span className="font-bold text-red-700">Acidic soil and low nitrogen detected:</span>
                                  </p>
                                  <ul className="text-xs text-green-700 space-y-2 font-medium list-disc pl-4">
                                    <li>Apply 2.5 tons/ha of calcitic agricultural limestone to buffer pH to 6.2.</li>
                                    <li>Inject urea or ammonium sulfate split doses (+45 kg N/ha) during early vegetative growth.</li>
                                    <li>Establish mucuna cover crop in inter-rows to capture atmospheric nitrogen.</li>
                                  </ul>
                                </>
                              ) : (
                                <>
                                  <p className="text-xs text-green-800 leading-relaxed font-semibold">
                                    🟢 <span className="font-bold text-green-800">Soil profiles are highly stable:</span>
                                  </p>
                                  <ul className="text-xs text-green-700 space-y-2 font-medium list-disc pl-4">
                                    <li>Maintain current cover cropping cycles to preserve organic carbon levels.</li>
                                    <li>Apply routine maintenance doses of nitrogen-phosphorus blends before the rainy season.</li>
                                    <li>Monitor soil pH bi-annually.</li>
                                  </ul>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

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
                          {renderIntelPolygons(plotsDataA, 'left')}
                        </Pane>
                        <Pane name="right-pane-intel" style={{ zIndex: 501 }}>
                          {renderIntelPolygons(plotsDataB, 'right')}
                        </Pane>
                      </>
                    ) : (
                      renderIntelPolygons(plotsData)
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
                  {null}
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

                        <div 
                          onClick={() => setIntelOpExpanded(!intelOpExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {intelOpExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Operational
                        </div>
                        {intelOpExpanded && (
                          <div className="space-y-3">
                            {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Farm Boundaries {renderInfoTooltip("Farm Boundaries")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-4 h-4 rounded-sm bg-[#000000] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Growth Stage Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Growth Stage {renderInfoTooltip("Growth Stage")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Tillering', color: '#86efac' },
                                  { label: 'Grand Growth', color: '#15803d' },
                                  { label: 'Maturation', color: '#fbbf24' },
                                  { label: 'Harvest Ready', color: '#ea580c' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* BIOPHYSICAL SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setIntelBioExpanded(!intelBioExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {intelBioExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Biophysical
                        </div>
                        {intelBioExpanded && (
                          <div className="space-y-3">
                            {/* EVI (Vegetation Vigor) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">EVI (Vegetation Vigor) {renderInfoTooltip("EVI (Vegetation Vigor)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Exceptional (>0.8)', color: '#14532D' },
                                  { label: 'Optimal (0.7–0.8)', color: '#16A34A' },
                                  { label: 'Moderate (0.55–0.7)', color: '#86EFAC' },
                                  { label: 'Transition (0.45–0.55)', color: '#EAB308' },
                                  { label: 'Deficit (<=0.45)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">LSWI (Water Status) {renderInfoTooltip("LSWI (Water Status)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Waterlogged (>0.5)', color: '#1E3A8A' },
                                  { label: 'Adequate (0.42–0.5)', color: '#2563EB' },
                                  { label: 'Moderate (0.35–0.42)', color: '#60A5FA' },
                                  { label: 'Mild Stress (0.28–0.35)', color: '#F59E0B' },
                                  { label: 'Severe Stress (<=0.28)', color: '#DC2626' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Canopy Closure (CVI) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Canopy Closure (CVI) {renderInfoTooltip("Canopy Closure (CVI)")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Foliage coverage density</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('cvi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowCvi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowCvi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowCvi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowCvi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelCviOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelCviOpacity}
                                onChange={e => setIntelCviOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High closure (>85%)', color: '#15803d' },
                                  { label: 'Good (70-85%)', color: '#22c55e' },
                                  { label: 'Low (<70%)', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Leaf Chlorophyll Density (CAR/RECI) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Leaf Chlorophyll Density (CAR/RECI) {renderInfoTooltip("Leaf Chlorophyll Density (CAR/RECI)")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Nitrogen & chlorophyll concentration</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('car')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowCar ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowCar ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowCar ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowCar && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelCarOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelCarOpacity}
                                onChange={e => setIntelCarOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High concentration', color: '#15803d' },
                                  { label: 'Optimal', color: '#22c55e' },
                                  { label: 'Deficient', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Radar Canopy Structure (DpRVI) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Radar Canopy Structure (DpRVI) {renderInfoTooltip("Radar Canopy Structure (DpRVI)")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Volumetric microwave backscatter</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('dprvi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowDprvi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowDprvi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowDprvi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowDprvi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelDprviOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelDprviOpacity}
                                onChange={e => setIntelDprviOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High structural complexity', color: '#15803d' },
                                  { label: 'Moderate', color: '#eab308' },
                                  { label: 'Low vegetation', color: '#0284c7' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Radar Vegetation Index (RVI) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">Radar Vegetation Index (RVI) {renderInfoTooltip("Radar Vegetation Index (RVI)")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Volumetric canopy volume scattering</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('rvi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowRvi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowRvi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowRvi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowRvi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelRviOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelRviOpacity}
                                onChange={e => setIntelRviOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Dense Canopy (>0.70)', color: '#14532D' },
                                  { label: 'Healthy (0.50–0.70)', color: '#16A34A' },
                                  { label: 'Moderate (0.30–0.50)', color: '#86EFAC' },
                                  { label: 'Sparse (0.15–0.30)', color: '#EAB308' },
                                  { label: 'Bare / Very Sparse (<0.15)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* MONITORING SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setIntelMonExpanded(!intelMonExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {intelMonExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Monitoring
                        </div>
                        {intelMonExpanded && (
                          <div className="space-y-3">
                            {/* VHI (Stress) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">VHI (Stress) {renderInfoTooltip("VHI (Stress)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Exceptional (>0.8)', color: '#14532D' },
                                  { label: 'Optimal (0.7–0.8)', color: '#16A34A' },
                                  { label: 'Moderate (0.55–0.7)', color: '#86EFAC' },
                                  { label: 'Transition (0.45–0.55)', color: '#EAB308' },
                                  { label: 'Deficit (<=0.45)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Planting Suitability {renderInfoTooltip("Planting Suitability")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Suitable', color: '#16a34a' },
                                  { label: 'Unsuitable', color: '#dc2626' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Early Stress Detection (NDRE) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Early Stress Detection (NDRE) {renderInfoTooltip("Early Stress Detection (NDRE)")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Red-edge band early stress signature</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('ndre')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowNdre ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowNdre ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowNdre ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowNdre && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelNdreOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelNdreOpacity}
                                onChange={e => setIntelNdreOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Healthy', color: '#15803d' },
                                  { label: 'Mild Stress', color: '#eab308' },
                                  { label: 'Severe stress warning', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Crop Water Stress (WDI) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Crop Water Stress (WDI) {renderInfoTooltip("Crop Water Stress (WDI)")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Thermal-optical water deficit index</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('wdi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowWdi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowWdi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowWdi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowWdi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelWdiOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelWdiOpacity}
                                onChange={e => setIntelWdiOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Waterlogged', color: '#1E3A8A' },
                                  { label: 'Adequate moisture', color: '#2563eb' },
                                  { label: 'Deficit stress', color: '#ea580c' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* SAR Flood Mask Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">SAR Flood Mask {renderInfoTooltip("SAR Flood Mask")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Sentinel-1 radar standing water mapping</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('flood')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowFlood ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowFlood ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowFlood ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowFlood && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelFloodOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelFloodOpacity}
                                onChange={e => setIntelFloodOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Flooded / Waterlogged', color: '#1e3a8a' },
                                  { label: 'Dry Surface', color: 'transparent' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0 border border-gray-200" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* UAS Spatial Anomaly Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">UAS Spatial Anomaly {renderInfoTooltip("UAS Spatial Anomaly")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">UAS high resolution drone stress map</span>
                            </div>
                            <button
                              onClick={() => handleIntelToggle('uas')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                intelShowUas ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: intelShowUas ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                intelShowUas ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {intelShowUas && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{intelUasOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={intelUasOpacity}
                                onChange={e => setIntelUasOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High Anomaly / Stress', color: '#dc2626' },
                                  { label: 'Normal / Healthy', color: 'transparent' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0 border border-gray-200" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
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
                intelShowGrowth ? 'Growth Stage' :
                intelShowCvi ? 'Canopy Closure (CVI)' :
                intelShowCar ? 'Leaf Chlorophyll Density (CAR/RECI)' :
                intelShowNdre ? 'Early Stress Detection (NDRE)' :
                intelShowWdi ? 'Crop Water Stress (WDI)' :
                intelShowDprvi ? 'Radar Canopy Structure (DpRVI)' : 'No Active Layer',
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
                          {renderHealthPolygons(healthPlotsDataA, 'left')}
                        </Pane>
                        <Pane name="right-pane-health" style={{ zIndex: 501 }}>
                          {renderHealthPolygons(healthPlotsDataB, 'right')}
                        </Pane>
                      </>
                    ) : (
                      renderHealthPolygons(healthPlotsData)
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
                  {null}
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

                        <div 
                          onClick={() => setHealthOpExpanded(!healthOpExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {healthOpExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Operational
                        </div>
                        {healthOpExpanded && (
                          <div className="space-y-3">
                            {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Farm Boundaries {renderInfoTooltip("Farm Boundaries")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-4 h-4 rounded-sm bg-[#000000] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* BIOPHYSICAL HEALTH SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setHealthBioExpanded(!healthBioExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {healthBioExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Biophysical Health
                        </div>
                        {healthBioExpanded && (
                          <div className="space-y-3">
                            {/* NDVI Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Vegetation Health {renderInfoTooltip("Vegetation Health")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Exceptional (>0.8)', color: '#14532D' },
                                  { label: 'Optimal (0.7–0.8)', color: '#16A34A' },
                                  { label: 'Moderate (0.55–0.7)', color: '#86EFAC' },
                                  { label: 'Transition (0.45–0.55)', color: '#EAB308' },
                                  { label: 'Deficit (<=0.45)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Chlorophyll VCI {renderInfoTooltip("Chlorophyll VCI")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Exceptional (>0.8)', color: '#14532D' },
                                  { label: 'Optimal (0.7–0.8)', color: '#16A34A' },
                                  { label: 'Moderate (0.55–0.7)', color: '#86EFAC' },
                                  { label: 'Transition (0.45–0.55)', color: '#EAB308' },
                                  { label: 'Deficit (<=0.45)', color: '#EF4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Red-Edge NDVI (NDRE) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">Red-Edge NDVI (NDRE) {renderInfoTooltip("Red-Edge NDVI (NDRE)")}</div>
                              <span className="text-[10px] text-gray-400">Early stress vegetation index</span>
                            </div>
                            <button
                              onClick={() => handleHealthToggle('ndre')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                healthShowNdre ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: healthShowNdre ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                healthShowNdre ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {healthShowNdre && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{healthNdreOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={healthNdreOpacity}
                                onChange={e => setHealthNdreOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Healthy', color: '#15803d' },
                                  { label: 'Mild Stress', color: '#eab308' },
                                  { label: 'Severe Stress Warning', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* MONITORING & RISK SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setHealthMonExpanded(!healthMonExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {healthMonExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Monitoring & Risk
                        </div>
                        {healthMonExpanded && (
                          <div className="space-y-3">
                            {/* Water Stress Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Water Stress (NDMI) {renderInfoTooltip("Water Stress (NDMI)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Waterlogged (>0.5)', color: '#1E3A8A' },
                                  { label: 'Adequate (0.42–0.5)', color: '#2563EB' },
                                  { label: 'Moderate (0.35–0.42)', color: '#60A5FA' },
                                  { label: 'Mild Stress (0.28–0.35)', color: '#F59E0B' },
                                  { label: 'Severe Stress (<=0.28)', color: '#DC2626' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Pest Risk (Inundation) {renderInfoTooltip("Pest Risk (Inundation)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High Risk', color: '#ef4444' },
                                  { label: 'Moderate Risk', color: '#f97316' },
                                  { label: 'Low Risk', color: '#16a34a' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* SAR Soil Moisture (SMI) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">SAR Soil Moisture (SMI) {renderInfoTooltip("SAR Soil Moisture (SMI)")}</div>
                              <span className="text-[10px] text-gray-400">Volumetric soil moisture changes</span>
                            </div>
                            <button
                              onClick={() => handleHealthToggle('smi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                healthShowSmi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: healthShowSmi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                healthShowSmi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {healthShowSmi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{healthSmiOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={healthSmiOpacity}
                                onChange={e => setHealthSmiOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Waterlogged (>+6 dB)', color: '#1E3A8A' },
                                  { label: 'Adequate (+3 to +6 dB)', color: '#2563EB' },
                                  { label: 'Slightly Moist (+1 to +3 dB)', color: '#60A5FA' },
                                  { label: 'Near-Reference (-1 to +1 dB)', color: '#86EFAC' },
                                  { label: 'Drying (-3 to -1 dB)', color: '#EAB308' },
                                  { label: 'Severely Dry (<-3 dB)', color: '#DC2626' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
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
                healthShowNdvi ? 'Vegetation Health' :
                healthShowNdre ? 'Red-Edge NDVI (NDRE)' :
                healthShowSmi ? 'SAR Soil Moisture (SMI)' : 'No Active Layer'
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
                          {renderYieldPolygons(yieldPlotsDataA, 'left')}
                        </Pane>
                        <Pane name="right-pane-yield" style={{ zIndex: 501 }}>
                          {renderYieldPolygons(yieldPlotsDataB, 'right')}
                        </Pane>
                      </>
                    ) : (
                      renderYieldPolygons(yieldPlotsData)
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
                  {null}
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

                        <div 
                          onClick={() => setYieldOpExpanded(!yieldOpExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {yieldOpExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Operational
                        </div>
                        {yieldOpExpanded && (
                          <div className="space-y-3">
                            {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Farm Boundaries {renderInfoTooltip("Farm Boundaries")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-4 h-4 rounded-sm bg-[#000000] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* PRODUCTION SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setYieldProdExpanded(!yieldProdExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {yieldProdExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Production Metrics
                        </div>
                        {yieldProdExpanded && (
                          <div className="space-y-3">
                            {/* Est. Yield Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">Estimated Yield Rate (t/HA) {renderInfoTooltip("Estimated Yield Rate (t/HA)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (18t/HA+)', color: '#15803d' },
                                  { label: 'Mid (12–18t/HA)', color: '#22c55e' },
                                  { label: 'Low (8–12t/HA)', color: '#eab308' },
                                  { label: 'High Stress (<8t/HA)', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">Dry Biomass Accumulation (kg/m²) {renderInfoTooltip("Dry Biomass Accumulation (kg/m²)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (2.0kg+)', color: '#15803d' },
                                  { label: 'Mid (1.3–2.0kg)', color: '#22c55e' },
                                  { label: 'Low (0.8–1.3kg)', color: '#eab308' },
                                  { label: 'Critical (<0.8kg)', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* STATUS SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setYieldStatExpanded(!yieldStatExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {yieldStatExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Status & Conditions
                        </div>
                        {yieldStatExpanded && (
                          <div className="space-y-3">
                            {/* Harvest Readiness Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">Canopy Harvest Readiness (%) {renderInfoTooltip("Canopy Harvest Readiness (%)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Ready (85%+)', color: '#16a34a' },
                                  { label: 'Pending (65–85%)', color: '#eab308' },
                                  { label: 'Unready (<65%)', color: '#f97316' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">Growth Stage Mapping {renderInfoTooltip("Growth Stage Mapping")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (0.7+)', color: '#15803d' },
                                  { label: 'Normal (0.55–0.7)', color: '#22c55e' },
                                  { label: 'Stressed (0.4–0.55)', color: '#eab308' },
                                  { label: 'Deficit (<0.4)', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ══ BOTTOM PANEL ══ */}
              {renderMapBottomPanel(
                yieldShowReadiness ? 'Canopy Harvest Readiness (%)' :
                yieldShowGrowth ? 'Growth Stage Mapping' :
                yieldShowBiomass ? 'Dry Biomass Accumulation (kg/m²)' :
                yieldShowYield ? 'Estimated Yield Rate (t/HA)' : 'No Active Layer'
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
                          {renderRestorePolygons(restorationPlotsDataA, 'left')}
                        </Pane>
                        <Pane name="right-pane-restore" style={{ zIndex: 501 }}>
                          {renderRestorePolygons(restorationPlotsDataB, 'right')}
                        </Pane>
                      </>
                    ) : (
                      renderRestorePolygons(restorationPlotsData)
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
                  {null}
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

                        <div 
                          onClick={() => setRestoreOpExpanded(!restoreOpExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {restoreOpExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Operational
                        </div>
                        {restoreOpExpanded && (
                          <div className="space-y-3">
                            {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Farm Boundaries {renderInfoTooltip("Farm Boundaries")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-4 h-4 rounded-sm bg-[#000000] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* ECOLOGICAL PROGRESS SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setRestoreEcoExpanded(!restoreEcoExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {restoreEcoExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Ecological Progress
                        </div>
                        {restoreEcoExpanded && (
                          <div className="space-y-3">
                            {/* Canopy Density Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Canopy Density {renderInfoTooltip("Canopy Density")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (85%+)', color: '#15803d' },
                                  { label: 'Good (70–85%)', color: '#22c55e' },
                                  { label: 'Mid (55–70%)', color: '#eab308' },
                                  { label: 'Initial (<55%)', color: '#ef4444' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Seedling Survival {renderInfoTooltip("Seedling Survival")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (90%+)', color: '#15803d' },
                                  { label: 'Good (85–90%)', color: '#22c55e' },
                                  { label: 'Low (<85%)', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Soil Carbon Offset {renderInfoTooltip("Soil Carbon Offset")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (40t+)', color: '#15803d' },
                                  { label: 'Mid (30–40t)', color: '#22c55e' },
                                  { label: 'Low (<30t)', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Biodiversity {renderInfoTooltip("Biodiversity")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (90%+)', color: '#15803d' },
                                  { label: 'Good (80–90%)', color: '#22c55e' },
                                  { label: 'Low (<80%)', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* InSAR Coherence (γ) Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">InSAR Coherence (γ) {renderInfoTooltip("InSAR Coherence (\u03b3)")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Radar phase stability index</span>
                            </div>
                            <button
                              onClick={() => handleRestoreToggle('insar')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowInSar ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowInSar ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowInSar ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowInSar && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreInSarOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreInSarOpacity}
                                onChange={e => setRestoreInSarOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Stable (>0.7 coherence)', color: '#15803d' },
                                  { label: 'Minor Change (0.4–0.7)', color: '#eab308' },
                                  { label: 'Deforestation (<0.4)', color: '#dc2626' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* GEDI Canopy Height Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">GEDI Canopy Height {renderInfoTooltip("GEDI Canopy Height")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">NASA LiDAR tree height</span>
                            </div>
                            <button
                              onClick={() => handleRestoreToggle('gedi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowGedi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowGedi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowGedi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowGedi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreGediOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreGediOpacity}
                                onChange={e => setRestoreGediOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Tall Canopy (>15m)', color: '#14532d' },
                                  { label: 'Med Canopy (10–15m)', color: '#15803d' },
                                  { label: 'Shrubland (5–10m)', color: '#22c55e' },
                                  { label: 'Low Veg (<5m)', color: '#eab308' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* NDWI Canopy Water Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">NDWI Canopy Water {renderInfoTooltip("NDWI Canopy Water")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Normalized Difference Water Index</span>
                            </div>
                            <button
                              onClick={() => handleRestoreToggle('ndwi')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowNdwi ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowNdwi ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowNdwi ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowNdwi && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreNdwiOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreNdwiOpacity}
                                onChange={e => setRestoreNdwiOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Open Water (>0.3)', color: '#1e3a8a' },
                                  { label: 'High Moisture (0.15–0.3)', color: '#2563eb' },
                                  { label: 'Moderate (0.0–0.15)', color: '#60a5fa' },
                                  { label: 'Deficit (<0.0)', color: '#ea580c' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* SAR AGB Proxy Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">SAR AGB Proxy {renderInfoTooltip("SAR AGB Proxy")}</div>
                              <span className="text-[10px] text-gray-400 font-medium">Aboveground Biomass estimation</span>
                            </div>
                            <button
                              onClick={() => handleRestoreToggle('agb')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                restoreShowAgb ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: restoreShowAgb ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                restoreShowAgb ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {restoreShowAgb && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{restoreAgbOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={restoreAgbOpacity}
                                onChange={e => setRestoreAgbOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High Biomass (>40 t/ha)', color: '#14532d' },
                                  { label: 'Medium Biomass (20-40 t/ha)', color: '#16a34a' },
                                  { label: 'Low Biomass (<20 t/ha)', color: '#86efac' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* LAND USE LAND COVER (LULC) SECTION */}
                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div 
                          onClick={() => setRestoreLulcExpanded(!restoreLulcExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {restoreLulcExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Land Use Land Cover
                        </div>
                        {restoreLulcExpanded && (
                          <div className="space-y-3">
                            <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">LULC Overlay {renderInfoTooltip("LULC Classification")}</div>
                                  <span className="text-[10px] text-gray-400">Classify land cover type</span>
                                </div>
                                <button
                                  onClick={() => handleRestoreToggle('lulc')}
                                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                    restoreShowLulc ? 'bg-green-600' : 'bg-gray-200'
                                  }`}
                                  style={{ backgroundColor: restoreShowLulc ? '#16A34A' : '#E5E7EB' }}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                    restoreShowLulc ? 'translate-x-4' : 'translate-x-0'
                                  }`} />
                                </button>
                              </div>
                              {restoreShowLulc && (
                                <div className="space-y-3.5 pt-2 border-t border-gray-50">
                                  {/* Opacity */}
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                      <span>Opacity</span>
                                      <span>{restoreLulcOpacity}%</span>
                                    </div>
                                    <input type="range" min="10" max="100" value={restoreLulcOpacity}
                                      onChange={e => setRestoreLulcOpacity(parseInt(e.target.value))}
                                      className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                                  </div>

                                  {/* LULC Source Selection */}
                                  <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">LULC Source</label>
                                    <select
                                      value={restoreLulcSource}
                                      onChange={e => setRestoreLulcSource(e.target.value)}
                                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-semibold text-gray-700 outline-none focus:border-green-500"
                                    >
                                      <option value="worldcover">ESA WorldCover (10m, annual)</option>
                                      <option value="dynamic_world">Dynamic World (10m, near-RT)</option>
                                      <option value="landsat">Landsat Archive (30m, 5-yr)</option>
                                      <option value="custom">Custom SAR+Optical (10m, quarterly)</option>
                                    </select>
                                  </div>

                                  {/* Change Detection Sub-Toggle */}
                                  <div className="flex items-center justify-between pt-1">
                                    <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                                      SAR Change Magnitude {renderInfoTooltip("SAR LULC Change Magnitude")}
                                    </span>
                                    <button
                                      onClick={() => setRestoreShowLulcChange(!restoreShowLulcChange)}
                                      className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                        restoreShowLulcChange ? 'bg-amber-500' : 'bg-gray-200'
                                      }`}
                                    >
                                      <div className={`w-3 h-3 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                        restoreShowLulcChange ? 'translate-x-3' : 'translate-x-0'
                                      }`} />
                                    </button>
                                  </div>

                                  {/* Timeline Slider */}
                                  {(restoreLulcSource === 'worldcover' || restoreLulcSource === 'landsat') && (
                                    <div className="space-y-2 pt-1 border-t border-gray-100">
                                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                        <span>Timeline View</span>
                                        <span className="text-green-600 font-black">{restoreLulcYear}</span>
                                      </div>
                                      <input 
                                        type="range" 
                                        min={restoreLulcSource === 'landsat' ? 1990 : 2020} 
                                        max={restoreLulcSource === 'landsat' ? 2020 : 2025} 
                                        step={restoreLulcSource === 'landsat' ? 5 : 1}
                                        value={restoreLulcYear}
                                        onChange={e => setRestoreLulcYear(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" 
                                      />
                                      <span className="text-[9px] text-gray-400 block italic leading-tight">Drag to observe historical LULC change</span>
                                    </div>
                                  )}

                                  {/* Legend */}
                                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-gray-100">
                                    {[
                                      { label: 'Forest', color: '#15803d' },
                                      { label: 'Shrubland', color: '#86efac' },
                                      { label: 'Cropland', color: '#fde047' },
                                      { label: 'Bare Soil', color: '#ca8a04' },
                                      { label: 'Water', color: '#3b82f6' },
                                      { label: 'Other/Built', color: '#94a3b8' }
                                    ].map((item, i) => (
                                      <div key={i} className="flex items-center gap-1.5">
                                        <div className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-[9px] font-semibold text-gray-500">{item.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* EUDR DEFORESTATION SECTION */}
                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div 
                          onClick={() => setRestoreEudrExpanded(!restoreEudrExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {restoreEudrExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} EUDR Deforestation
                        </div>
                        {restoreEudrExpanded && (
                          <div className="space-y-3">
                            <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">EUDR Compliance {renderInfoTooltip("EUDR Deforestation")}</div>
                                  <span className="text-[10px] text-gray-400">Cut-off date Dec 31, 2020</span>
                                </div>
                                <button
                                  onClick={() => handleRestoreToggle('eudr')}
                                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                    restoreShowEudr ? 'bg-green-600' : 'bg-gray-200'
                                  }`}
                                  style={{ backgroundColor: restoreShowEudr ? '#16A34A' : '#E5E7EB' }}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                    restoreShowEudr ? 'translate-x-4' : 'translate-x-0'
                                  }`} />
                                </button>
                              </div>
                              {restoreShowEudr && (
                                <div className="space-y-2.5 pt-1 border-t border-gray-50">
                                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                    <span>Opacity</span>
                                    <span>{restoreEudrOpacity}%</span>
                                  </div>
                                  <input type="range" min="10" max="100" value={restoreEudrOpacity}
                                    onChange={e => setRestoreEudrOpacity(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                                  
                                  {/* EUDR Info Checklist */}
                                  <div className="bg-slate-900 text-white rounded-xl p-2.5 space-y-1">
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Audit Parameters</div>
                                    <div className="text-[10px] font-medium leading-relaxed">
                                      <div className="flex justify-between border-b border-white/10 pb-1">
                                        <span>Cut-off Date:</span>
                                        <span className="font-bold text-green-400">31 Dec 2020</span>
                                      </div>
                                      <div className="flex justify-between pt-1">
                                        <span>Estate Status:</span>
                                        <span className="font-bold text-green-400">Compliant</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                                    {[
                                      { label: 'Compliant (No forest loss)', color: '#16a34a' },
                                      { label: 'Warning (Near forest loss)', color: '#eab308' },
                                      { label: 'Non-Compliant (Deforestation detected)', color: '#dc2626' }
                                    ].map((item, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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
                restoreShowProgress ? 'Canopy Density' :
                restoreShowInSar ? 'InSAR Coherence (γ)' :
                restoreShowGedi ? 'GEDI Canopy Height' :
                restoreShowNdwi ? 'NDWI Canopy Water' :
                restoreShowLulc ? 'LULC Classification' :
                restoreShowEudr ? 'EUDR Deforestation' : 'No Active Layer'
              )}
            </div>
          )}


          {/* ══════════════════════════════════════════════════════════════
              ALERTS COMMAND CENTER
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'alerts' && (
            <div className="flex flex-col h-full animate-in fade-in duration-300 relative" style={{ minHeight: 0 }}>
              <style>{`
                @keyframes pulseBorderRed {
                  0%, 100% { border-color: rgba(239, 68, 68, 0.3); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.15); }
                  50% { border-color: rgba(239, 68, 68, 0.85); box-shadow: 0 0 14px 4px rgba(239, 68, 68, 0.2); }
                }
                @keyframes pulseBorderAmber {
                  0%, 100% { border-color: rgba(245, 158, 11, 0.3); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.15); }
                  50% { border-color: rgba(245, 158, 11, 0.85); box-shadow: 0 0 14px 4px rgba(245, 158, 11, 0.2); }
                }
                .pulse-critical { animation: pulseBorderRed 2s infinite ease-in-out; border-width: 2px; }
                .pulse-warning  { animation: pulseBorderAmber 2s infinite ease-in-out; border-width: 2px; }
                .alerts-list-scroll::-webkit-scrollbar { width: 4px; }
                .alerts-list-scroll::-webkit-scrollbar-track { background: transparent; }
                .alerts-list-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
                .alerts-detail-scroll::-webkit-scrollbar { width: 4px; }
                .alerts-detail-scroll::-webkit-scrollbar-track { background: transparent; }
                .alerts-detail-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
              `}</style>

              {/* ── TOP HEADER BAR ── */}
              <div className="px-8 pt-7 pb-5 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm animate-pulse" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                    <AlertTriangle size={18} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-none">Alerts Command Center</h2>
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-0.5">Live Anomaly Intelligence · Farmintelytics Agro Node</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Operational Status</span>
                      <span className="text-xs font-bold text-gray-800">{alerts.filter(a => a.status === 'Active').length} Active Anomalies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── MAIN TWO-COLUMN BODY ── */}
              <div className="flex flex-1 min-h-0 overflow-hidden">

                {/* ═══ LEFT COLUMN: Search + Plot Issue List ═══ */}
                <div className="w-[270px] shrink-0 bg-gray-50 border-r border-gray-150 flex flex-col">

                  {/* Search bar */}
                  <div className="p-4 border-b border-gray-150 space-y-3">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        id="alerts-search-input"
                        type="text"
                        value={alertsSearch}
                        onChange={e => setAlertsSearch(e.target.value)}
                        placeholder="Search plots..."
                        className="w-full pl-8 pr-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all placeholder-gray-400"
                      />
                      {alertsSearch && (
                        <button onClick={() => setAlertsSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Severity mini-filters */}
                    <div className="flex items-center gap-1.5">
                      {['All', 'Critical', 'Warning', 'Info'].map(sev => {
                        const activeColor = sev === 'Critical' ? 'bg-red-600 text-white' : sev === 'Warning' ? 'bg-amber-500 text-white' : sev === 'Info' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white';
                        return (
                          <button
                            key={sev}
                            onClick={() => setAlertsFilterSeverity(sev)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${alertsFilterSeverity === sev ? activeColor : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
                          >
                            {sev}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Plots with issues list */}
                  <div className="flex-1 overflow-y-auto alerts-list-scroll p-3 space-y-2">
                    {(() => {
                      const PLOT_DEFS = [
                        { id: 'PLOT-ALPHA', name: 'West Valley Plot', estate: 'West Valley Estate', ndvi: 0.72 },
                        { id: 'PLOT-BETA',  name: 'East Ridge Plot',  estate: 'East Ridge Estate',  ndvi: 0.51 },
                        { id: 'PLOT-GAMMA', name: 'South Slope Plot', estate: 'South Slope Estate', ndvi: 0.68 }
                      ];

                      const searchLower = alertsSearch.toLowerCase();

                      const plotsWithIssues = PLOT_DEFS
                        .map(p => {
                          const rawAlerts = alerts.filter(a => a.plot === p.id);
                          const active = rawAlerts.filter(a => {
                            if (a.status !== 'Active') return false;
                            if (alertsFilterSeverity !== 'All' && a.severity !== alertsFilterSeverity) return false;
                            return true;
                          });
                          const critCount = rawAlerts.filter(a => a.status === 'Active' && a.severity === 'Critical').length;
                          const warnCount = rawAlerts.filter(a => a.status === 'Active' && a.severity === 'Warning').length;
                          const infoCount = rawAlerts.filter(a => a.status === 'Active' && a.severity === 'Info').length;
                          return { ...p, active, critCount, warnCount, infoCount, total: active.length };
                        })
                        // Only show plots that have active issues
                        .filter(p => p.total > 0)
                        // Apply search
                        .filter(p => !searchLower || p.name.toLowerCase().includes(searchLower) || p.id.toLowerCase().includes(searchLower) || p.estate.toLowerCase().includes(searchLower));

                      if (plotsWithIssues.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-3">
                              <CheckCircle2 size={20} className="text-green-600" />
                            </div>
                            <p className="text-xs font-bold text-gray-500">No issues found</p>
                            <p className="text-[10px] text-gray-400 mt-1">All plots are operating normally</p>
                          </div>
                        );
                      }

                      return plotsWithIssues.map(p => {
                        const isCrit = p.critCount > 0;
                        const isWarn = p.warnCount > 0 && !isCrit;
                        const isSelected = selectedAlertPlot === p.id;

                        const dotColor = isCrit ? 'bg-red-500' : isWarn ? 'bg-amber-500' : 'bg-blue-400';
                        const badgeBg = isCrit ? 'bg-red-50 text-red-700 border-red-200' : isWarn ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200';

                        return (
                          <button
                            key={p.id}
                            id={`alert-plot-row-${p.id.toLowerCase()}`}
                            onClick={() => setSelectedAlertPlot(isSelected ? null : p.id)}
                            className={`w-full text-left bg-white rounded-xl border border-gray-200 p-3.5 transition-all hover:shadow-md active:scale-[0.98] ${isSelected ? 'ring-2 ring-gray-900 ring-offset-1 shadow-md' : 'shadow-sm hover:border-gray-300'}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${dotColor} ${isCrit || isWarn ? 'animate-pulse' : ''}`} />
                                <div className="min-w-0">
                                  <div className="text-xs font-extrabold text-gray-900 leading-tight truncate">{p.name}</div>
                                  <div className="text-[10px] text-gray-400 font-bold mt-0.5 truncate">{p.id} · {p.estate}</div>
                                </div>
                              </div>
                              <div className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeBg}`}>
                                {p.total} {p.total === 1 ? 'issue' : 'issues'}
                              </div>
                            </div>

                            {/* Mini severity badges */}
                            <div className="flex items-center gap-1.5 mt-2.5 pl-4.5">
                              {p.critCount > 0 && <span className="text-[9px] font-black bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">{p.critCount} Critical</span>}
                              {p.warnCount > 0 && <span className="text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full">{p.warnCount} Warning</span>}
                              {p.infoCount > 0 && <span className="text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full">{p.infoCount} Info</span>}
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>


                </div>

                {/* ═══ RIGHT COLUMN: Full Detail Report ═══ */}
                <div className="flex-1 min-w-0 overflow-y-auto alerts-detail-scroll bg-white">
                  {selectedAlertPlot === null ? (
                    /* Empty state – no plot selected */
                    <div className="flex flex-col items-center justify-center h-full text-center px-8">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center mb-5 shadow-sm">
                        <AlertTriangle size={32} className="text-gray-300" />
                      </div>
                      <h3 className="text-base font-bold text-gray-700 mb-1.5">Select a plot to view the full incident report</h3>
                      <p className="text-sm text-gray-400 font-medium max-w-sm leading-relaxed">
                        Click any plot row on the left to load its chronological anomaly log, response protocols, and remediation actions.
                      </p>
                    </div>
                  ) : (
                    /* Detail report */
                    (() => {
                      const PLOT_META = {
                        'PLOT-ALPHA': { name: 'West Valley Plot (PLOT-ALPHA)', estate: 'West Valley Estate', ndvi: 0.72 },
                        'PLOT-BETA':  { name: 'East Ridge Plot (PLOT-BETA)',  estate: 'East Ridge Estate',  ndvi: 0.51 },
                        'PLOT-GAMMA': { name: 'South Slope Plot (PLOT-GAMMA)', estate: 'South Slope Estate', ndvi: 0.68 }
                      };
                      const meta = PLOT_META[selectedAlertPlot];
                      const plotAlerts = alerts.filter(a => a.plot === selectedAlertPlot);
                      const activePlotAlerts = plotAlerts.filter(a => a.status === 'Active');
                      const critCount = activePlotAlerts.filter(a => a.severity === 'Critical').length;
                      const warnCount = activePlotAlerts.filter(a => a.severity === 'Warning').length;
                      const ndviColor = meta.ndvi > 0.7 ? '#10B981' : meta.ndvi > 0.5 ? '#F59E0B' : '#EF4444';

                      return (
                        <div className="p-7 space-y-6 animate-in slide-in-from-right duration-300">
                          {/* Detail header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {critCount > 0 ? (
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                                ) : warnCount > 0 ? (
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                ) : (
                                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                                )}
                                <h3 className="text-xl font-extrabold text-gray-950 tracking-tight leading-tight">{meta.name}</h3>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{meta.estate}</span>
                            </div>
                            <button
                              id="alerts-close-detail"
                              onClick={() => setSelectedAlertPlot(null)}
                              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          {/* Stats row */}
                          <div className="grid grid-cols-4 gap-3">
                            {[
                              { label: 'Active Incidents', value: activePlotAlerts.length, color: activePlotAlerts.length > 0 ? 'text-red-600' : 'text-gray-400', bg: activePlotAlerts.length > 0 ? 'bg-red-50/70 border-red-100' : 'bg-gray-50/50 border-gray-150' },
                              { label: 'Critical', value: critCount, color: critCount > 0 ? 'text-red-700' : 'text-gray-400', bg: critCount > 0 ? 'bg-red-50/70 border-red-100' : 'bg-gray-50/50 border-gray-150' },
                              { label: 'Warning', value: warnCount, color: warnCount > 0 ? 'text-amber-700' : 'text-gray-400', bg: warnCount > 0 ? 'bg-amber-50/70 border-amber-100' : 'bg-gray-50/50 border-gray-150' },
                              { label: 'Acknowledged', value: plotAlerts.length - activePlotAlerts.length, color: (plotAlerts.length - activePlotAlerts.length) > 0 ? 'text-green-700' : 'text-gray-400', bg: (plotAlerts.length - activePlotAlerts.length) > 0 ? 'bg-green-50/70 border-green-100' : 'bg-gray-50/50 border-gray-150' }
                            ].map((s, i) => (
                              <div key={i} className={`${s.bg} border rounded-xl p-3 text-center`}>
                                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</div>
                              </div>
                            ))}
                          </div>

                          {/* NDVI bar */}
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-gray-500">Current Crop Vigor (NDVI)</span>
                              <span style={{ color: ndviColor }}>{meta.ndvi}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${meta.ndvi * 100}%`, backgroundColor: ndviColor }} />
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                              <span>0.0 — Poor</span>
                              <span>0.5 — Moderate</span>
                              <span>1.0 — Excellent</span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setActiveSidebarItem('intelligence-layers');
                                setSelectedPlot(selectedAlertPlot);
                              }}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all shadow-sm active:scale-95"
                            >
                              <MapPin size={13} className="text-green-600" /> Locate on Map
                            </button>
                            {activePlotAlerts.length > 0 && (
                              <button
                                onClick={() => {
                                  setAlerts(prev => prev.map(a => a.plot === selectedAlertPlot ? { ...a, status: 'Acknowledged' } : a));
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-xs font-bold text-white transition-all shadow-md shadow-green-600/10 active:scale-95"
                              >
                                <CheckCircle2 size={13} /> Acknowledge All Issues
                              </button>
                            )}
                          </div>

                          {/* Timeline */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <span>Chronological Incident Log</span>
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[9px]">{plotAlerts.length} entries</span>
                            </h4>

                            <div className="relative border-l border-gray-200 pl-6 ml-2 space-y-5">
                              {plotAlerts.map((alert) => {
                                const isActive = alert.status === 'Active';
                                const isCrit = alert.severity === 'Critical';
                                let severityColor = 'bg-blue-50 text-blue-700 border-blue-200';
                                let dotColor = isCrit ? 'bg-red-500' : alert.severity === 'Warning' ? 'bg-amber-500' : 'bg-blue-400';
                                if (isCrit) severityColor = 'bg-red-50 text-red-700 border-red-200';
                                else if (alert.severity === 'Warning') severityColor = 'bg-amber-50 text-amber-700 border-amber-200';

                                return (
                                  <div key={alert.id} className="relative">
                                    {/* Dot */}
                                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-white flex items-center justify-center shadow-sm ring-1 ring-gray-100">
                                      {isActive ? (
                                        <div className={`w-2.5 h-2.5 rounded-full ${dotColor} ${isCrit || alert.severity === 'Warning' ? 'animate-pulse' : ''}`} />
                                      ) : (
                                        <Check size={8} className="text-gray-500 font-bold" />
                                      )}
                                    </div>

                                    <div className={`p-4 rounded-2xl border transition-colors ${isActive ? 'bg-white border-gray-150 hover:bg-gray-50/50' : 'bg-gray-50/30 border-gray-100'}`}>
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-xs font-black text-gray-800 tabular-nums">{alert.id}</span>
                                          <span className="text-[10px] text-gray-300">•</span>
                                          <span className="text-xs text-gray-400 font-semibold">{alert.date} at {alert.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${severityColor}`}>{alert.severity}</span>
                                          <span className="text-[9px] font-extrabold bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full uppercase">{alert.category}</span>
                                          {!isActive && <span className="text-[9px] font-extrabold bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full uppercase">Acked</span>}
                                        </div>
                                      </div>

                                      <p className="text-xs text-gray-700 font-semibold leading-relaxed">{alert.desc}</p>



                                      {isActive && (
                                        <div className="mt-3 flex justify-end">
                                          <button
                                            onClick={() => setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'Acknowledged' } : a))}
                                            className="text-[10px] font-bold text-green-600 hover:text-green-700 border border-green-200 hover:bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                                          >
                                            <Check size={11} /> Mark Acknowledged
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
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
                          {renderClimatePolygons(climatePlotsDataA, 'left')}
                        </Pane>
                        <Pane name="right-pane-climate" style={{ zIndex: 501 }}>
                          {renderClimatePolygons(climatePlotsDataB, 'right')}
                        </Pane>
                      </>
                    ) : (
                      renderClimatePolygons(climatePlotsData)
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
                  {null}
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

                        <div 
                          onClick={() => setClimateOpExpanded(!climateOpExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {climateOpExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Operational
                        </div>
                        {climateOpExpanded && (
                          <div className="space-y-3">
                            {/* Farm Boundaries Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Farm Boundaries {renderInfoTooltip("Farm Boundaries")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-4 h-4 rounded-sm bg-[#000000] shrink-0" />
                                <span className="text-[10px] font-semibold text-gray-500">Block boundary</span>
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* BIOPHYSICAL SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setClimateBioExpanded(!climateBioExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {climateBioExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Biophysical
                        </div>
                        {climateBioExpanded && (
                          <div className="space-y-3">
                            {/* Precipitation Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">Precipitation {renderInfoTooltip("Precipitation")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (25mm+)', color: '#1d4ed8' },
                                  { label: 'Mid (18–25mm)', color: '#3b82f6' },
                                  { label: 'Low (<18mm)', color: '#93c5fd' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Soil Temp {renderInfoTooltip("Soil Temp")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (>29°C)', color: '#ef4444' },
                                  { label: 'Normal (25–29°C)', color: '#f97316' },
                                  { label: 'Cool (<25°C)', color: '#10b981' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* ATMOSPHERE SECTION */}
                      <div className="space-y-3">

                        <div 
                          onClick={() => setClimateAtmExpanded(!climateAtmExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {climateAtmExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Atmosphere
                        </div>
                        {climateAtmExpanded && (
                          <div className="space-y-3">
                            {/* LST Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Surface Temp (LST) {renderInfoTooltip("Surface Temp (LST)")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (>36°C)', color: '#b91c1c' },
                                  { label: 'Moderate (30–36°C)', color: '#ef4444' },
                                  { label: 'Normal (25–30°C)', color: '#f97316' },
                                  { label: 'Cool (<25°C)', color: '#10b981' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
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
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">VPD Stress {renderInfoTooltip("VPD Stress")}</div>
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
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'High (>2.2 kPa)', color: '#ef4444' },
                                  { label: 'Moderate (1.5–2.2 kPa)', color: '#f97316' },
                                  { label: 'Low (<1.5 kPa)', color: '#10b981' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>

                      {/* MONITORING & TELEMETRY SECTION */}
                      <div className="space-y-3">
                        <div 
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest select-none"
                        >
                          Monitoring & Telemetry
                        </div>
                        
                        {/* SAR Flood Mask Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5 font-sans">SAR Flood Mask (Sentinel-1) {renderInfoTooltip("SAR Flood Mask")}</div>
                              <span className="text-[10px] text-gray-400">All-weather standing water detection</span>
                            </div>
                            <button
                              onClick={() => handleClimateToggle('flood')}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                                climateShowFlood ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              style={{ backgroundColor: climateShowFlood ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                climateShowFlood ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                          {climateShowFlood && (
                            <div className="space-y-2.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{climateFloodOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={climateFloodOpacity}
                                onChange={e => setClimateFloodOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                              <div className="grid grid-cols-1 gap-1.5 pt-1">
                                {[
                                  { label: 'Flooded / Waterlogged', color: '#1e3a8a' },
                                  { label: 'Dry Surface', color: 'transparent' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm shrink-0 border border-gray-200" style={{ backgroundColor: item.color }} />
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
                climateShowRainfall ? 'Precipitation' :
                climateShowFlood ? 'SAR Flood Mask' : 'No Active Layer'
              )}
            </div>
          )}

          {activeSidebarItem === 'analytics' && activeTab === 'verification' && (
            <div className="p-10 space-y-10 animate-in fade-in duration-300" />
          )}

          {/* ══════════════════════════════════════════════════════════════
              REPORTS
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'analytics' && activeTab === 'reports' && (
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
                    {renderInfoTooltip("Verified Sustainability & Environmental Reports")}</h3>
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
          {activeSidebarItem === 'analytics' && activeTab === 'ai-assistant' && (
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

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-[640px] h-[480px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <Settings2 className={brandingMode === 'AM' ? 'text-green-600' : 'text-blue-600'} size={19} />
                <span className="text-base font-extrabold text-gray-950">Settings Center</span>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-all"
              >
                <X size={17} />
              </button>
            </div>
            
            {/* Split Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Tabs */}
              <div className="w-[180px] bg-gray-50/50 border-r border-gray-100 p-3 space-y-1">
                {[
                  { id: 'profile', label: 'User Profile', icon: <User size={15} /> },
                  { id: 'branding', label: 'Platform Mode', icon: <Globe size={15} /> },
                  { id: 'map', label: 'Map Configuration', icon: <MapIcon size={15} /> },
                  { id: 'users', label: 'Team Access', icon: <Users size={15} /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                      settingsTab === tab.id
                        ? (brandingMode === 'AM' ? 'bg-green-50 text-green-700 font-extrabold' : 'bg-blue-50 text-blue-700 font-extrabold')
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Right Content Pane */}
              <div className="flex-1 p-6 overflow-y-auto space-y-5">
                {settingsTab === 'profile' && (
                  <div className="space-y-4">
                    <div className="text-xs font-black uppercase tracking-wider text-gray-400">User Profile Settings</div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Full Name</label>
                        <input 
                          type="text" 
                          value={profileName} 
                          onChange={e => setProfileName(e.target.value)} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:bg-white focus:border-green-600 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Active Role</label>
                        <input 
                          type="text" 
                          value={profileRole} 
                          onChange={e => setProfileRole(e.target.value)} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:bg-white focus:border-green-600 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Email Identity</label>
                        <input 
                          type="email" 
                          value={profileEmail} 
                          onChange={e => setProfileEmail(e.target.value)} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:bg-white focus:border-green-600 outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {settingsTab === 'branding' && (
                  <div className="space-y-4">
                    <div className="text-xs font-black uppercase tracking-wider text-gray-400">Platform System Mode</div>
                    <div className="grid grid-cols-1 gap-3">
                      <div 
                        onClick={() => setBrandingMode('AM')}
                        className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-green-500/50 ${
                          brandingMode === 'AM' ? 'border-green-600 bg-green-50/20 shadow-sm' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            AgroMonitor Mode (AM)
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">Satellite analysis, green theme interface, default AM initials.</div>
                        </div>
                        {brandingMode === 'AM' && <CheckCircle2 size={16} className="text-green-600" />}
                      </div>
                      
                      <div 
                        onClick={() => setBrandingMode('FT')}
                        className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-blue-500/50 ${
                          brandingMode === 'FT' ? 'border-blue-600 bg-blue-50/20 shadow-sm' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            Farm Tools Harvest Mode (FT)
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">Operational harvest tools, blue/orange branding, FT initials.</div>
                        </div>
                        {brandingMode === 'FT' && <CheckCircle2 size={16} className="text-blue-600" />}
                      </div>
                    </div>
                  </div>
                )}
                
                {settingsTab === 'map' && (
                  <div className="space-y-4">
                    <div className="text-xs font-black uppercase tracking-wider text-gray-400">Map Default Configuration</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Center Latitude</label>
                        <input 
                          type="number" 
                          step="0.0001" 
                          value={defaultLat} 
                          onChange={e => setDefaultLat(parseFloat(e.target.value))} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:bg-white" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Center Longitude</label>
                        <input 
                          type="number" 
                          step="0.0001" 
                          value={defaultLng} 
                          onChange={e => setDefaultLng(parseFloat(e.target.value))} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:bg-white" 
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Initial Zoom level</label>
                        <input 
                          type="number" 
                          value={defaultMapZoom} 
                          onChange={e => setDefaultMapZoom(parseInt(e.target.value))} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:bg-white" 
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {settingsTab === 'users' && (
                  <div className="space-y-4">
                    <div className="text-xs font-black uppercase tracking-wider text-gray-400">Team Access Management</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {settingsUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-2.5 border border-gray-100 rounded-xl bg-gray-50/30">
                          <div>
                            <div className="text-xs font-bold text-gray-900">{user.name}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{user.email} · {user.role}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span 
                              onClick={() => {
                                setSettingsUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Offline' : 'Active' } : u));
                              }}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${user.status === 'Active' ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-150 text-gray-500 hover:bg-gray-200'}`}
                            >
                              {user.status}
                            </span>
                            <button 
                              onClick={() => setSettingsUsers(prev => prev.filter(u => u.id !== user.id))}
                              className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add User mini-form */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Add Team Member</div>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          id="new-user-name"
                          type="text" 
                          placeholder="Name" 
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold outline-none focus:bg-white" 
                        />
                        <input 
                          id="new-user-email"
                          type="email" 
                          placeholder="Email" 
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold outline-none focus:bg-white" 
                        />
                        <input 
                          id="new-user-role"
                          type="text" 
                          placeholder="Role (e.g. Field Agent)" 
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold outline-none focus:bg-white col-span-2" 
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const nameEl = document.getElementById('new-user-name');
                          const emailEl = document.getElementById('new-user-email');
                          const roleEl = document.getElementById('new-user-role');
                          if (nameEl && emailEl && roleEl && nameEl.value && emailEl.value) {
                            const newUser = {
                              id: `USER-${Date.now()}`,
                              name: nameEl.value,
                              email: emailEl.value,
                              role: roleEl.value || 'Viewer',
                              status: 'Active'
                            };
                            setSettingsUsers(prev => [...prev, newUser]);
                            nameEl.value = '';
                            emailEl.value = '';
                            roleEl.value = '';
                          }
                        }}
                        className={`w-full py-2 rounded-lg text-xs font-bold text-white transition-all ${
                          brandingMode === 'AM' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        Add Member
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-2.5">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="px-4.5 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowProfileSaved(true);
                  setTimeout(() => setShowProfileSaved(false), 2000);
                }}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-102 active:scale-98 ${
                  brandingMode === 'AM' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/10' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resizing and dragging overlay helper */}
      {(activeResizeType || isDraggingSplit) && (
        <div 
          className={`fixed inset-0 z-[999999] bg-transparent select-none ${
            activeResizeType === 'sidebar' || isDraggingSplit ? 'cursor-col-resize' : 'cursor-row-resize'
          }`}
        />
      )}
    </div>
  );
};

export default AgroMonitor;
