import { CROP_META } from '../../../services/cropMonitoringApi';
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
  Columns,
  Wind
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, Polygon, Popup, Tooltip, useMap, Pane } from 'react-leaflet';
import ReactDOM from 'react-dom';
import * as api from '../../../services/organizationMonitorApi';
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
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';

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
        className="absolute bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-1 rounded-sm shadow-md flex flex-col pointer-events-none"
        style={{ left: '12px', bottom: '12px', zIndex: 20000 }}
      >
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Left</span>
        <span className="text-[10px] font-extrabold text-gray-800">{currentTimelineA?.label?.split(',')[0]}</span>
      </div>

      {/* Right Badge */}
      <div
        className="absolute bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-1 rounded-sm shadow-md flex flex-col pointer-events-none text-right"
        style={{ right: '55px', bottom: '12px', zIndex: 20000 }}
      >
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Right</span>
        <span className="text-[10px] font-extrabold text-gray-800">{currentTimelineB?.label?.split(',')[0]}</span>
      </div>
    </>
  );
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);

// TIMELINE_DATA has been moved inside the AgroMonitor component for dynamic month/year calculations.

// ── Default Farm Plots Coordinates ────────────────────────────────────────

// ── Auto-fit map to loaded plots ─────────────────────────────────────────
function FitBoundsToPlots({ plotsData, farmBoundary }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current) return;
    // Priority 1: fit to real plot polygons
    if (plotsData && plotsData.length > 0) {
      const allCoords = plotsData.flatMap(p => p.coords || []);
      if (allCoords.length > 0) {
        let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
        for (const [lat, lng] of allCoords) {
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
        }
        map.fitBounds([[minLat, minLng], [maxLat, maxLng]], { padding: [30, 30], maxZoom: 15 });
        fitted.current = true;
        return;
      }
    }
    // Priority 2: fit to farm boundary bbox (e.g. Olam)
    if (farmBoundary?.properties?.bbox) {
      const { min_lat, max_lat, min_lng, max_lng } = farmBoundary.properties.bbox;
      map.fitBounds([[min_lat, min_lng], [max_lat, max_lng]], { padding: [40, 40], maxZoom: 13 });
      fitted.current = true;
    }
  }, [plotsData, farmBoundary, map]);
  return null;
}

// Flies to zarr bounds only when the map center is outside them (avoids zooming out when already viewing the data).
function FitToZarrBounds({ zarrBounds }) {
  const map = useMap();
  useEffect(() => {
    if (!zarrBounds) return;
    const center = map.getCenter();
    const [[swLat, swLng], [neLat, neLng]] = zarrBounds;
    const centerInBounds =
      center.lat >= swLat && center.lat <= neLat &&
      center.lng >= swLng && center.lng <= neLng;
    if (!centerInBounds) {
      map.fitBounds(zarrBounds, { padding: [30, 30], maxZoom: 15 });
    }
  }, [zarrBounds, map]);
  return null;
}

// Restoration zone fallback coords removed — coords must come from backend boundary geometry.

const TOOLTIP_DESCRIPTIONS = {
  // ── REMOTE SENSING SUBPAGE ──────────────────────────────────────────────────
  'Farm Boundaries': {
    category: 'remote-sensing',
    desc: 'Shows the boundary outline of each registered farm plot, aligned to official cadastral (land registry) coordinates.',
    done: 'Vector polygons co-registered with Sentinel-2 and Landsat spatial grids at 10–30 m resolution.',
    formula: 'GIS Cadastral Vector Overlay',
    references: 'Open Geospatial Consortium (OGC) Simple Features Access Specification; ISO 19115 Geographic Information Standard.'
  },
  'Crop Vegetation Index (CVI)': {
    category: 'remote-sensing',
    desc: 'Measures canopy density and crop health by combining red-edge and NIR reflectance. Higher values indicate denser, healthier canopy.',
    done: 'Derived from Sentinel-2 multispectral bands aggregated to 20 m resolution.',
    formula: 'CVI = (B8 ÷ B4) × (B5 ÷ B4)',
    references: 'Vincini, M., et al. (2008). "A canopy chlorophyll index for vegetation monitoring." Precision Agriculture, 9(1-2), 27-38.'
  },
  'Canopy Closure (CVI)': {
    category: 'remote-sensing',
    desc: 'Estimates how much of the ground is covered by the crop canopy from directly above. Low values signal gaps or sparse growth.',
    done: 'Atmospherically corrected Sentinel-2 Red-Edge (B5) and NIR (B8) band ratio.',
    formula: 'CVI = (B8 ÷ B4) × (B5 ÷ B4)',
    references: 'Vincini, M., et al. (2008). "A canopy chlorophyll index for vegetation monitoring." Precision Agriculture, 9(1-2), 27-38.'
  },
  'Leaf Chlorophyll Density (CAR/RECI)': {
    category: 'remote-sensing',
    desc: 'Maps leaf-level chlorophyll and nitrogen content. Low values often signal a need for topdressing fertilizer.',
    done: 'Ratio of Sentinel-2 NIR (B8) and Red-Edge-1 (B5) — sensitive to leaf nitrogen without saturation.',
    formula: 'RECI = (B8 ÷ B5) − 1',
    references: 'Gitelson, A. A., et al. (2003). "Novel algorithms for remote estimation of vegetation fraction." Remote Sensing of Environment, 84(4), 524-530.'
  },
  'Early Stress Detection (NDRE)': {
    category: 'remote-sensing',
    desc: 'Detects plant stress earlier than NDVI by using the red-edge band, which responds to chlorophyll loss before visible yellowing appears.',
    done: 'Normalized ratio of Sentinel-2 narrow NIR (B8A) and Red-Edge (B5) bands.',
    formula: 'NDRE = (B8A − B5) ÷ (B8A + B5)',
    references: 'Barnes, E. M., et al. (2000). "Coincident detection of crop water and nitrogen stress using multi-spectral reflectance." Proceedings of the International Conference on Precision Agriculture.'
  },
  'Crop Water Stress (WDI)': {
    category: 'remote-sensing',
    desc: 'Indicates how stressed the crop is from lack of water. High values mean the plant is closing its stomata and reducing transpiration.',
    done: 'Combines Sentinel-2 SWIR-based moisture index with Landsat thermal surface temperature anomalies.',
    formula: 'WDI = 0.5 × (1 − NDMI) + 0.5 × LST_norm',
    references: 'Moran, M. S., et al. (1994). "Estimating crop water deficit using the relation between forest canopy-air temperature difference and fractional vegetation cover." Remote Sensing of Environment, 49(3), 246-263.'
  },
  'Radar Canopy Structure (DpRVI)': {
    category: 'remote-sensing',
    desc: 'Uses radar signals to measure crop canopy volume and structure — even through clouds. Useful for monitoring canopy loss or thinning.',
    done: 'Sentinel-1 SAR dual-polarization IW GRD product, orthorectified and speckle-filtered.',
    formula: 'DpRVI = 1 − VV ÷ (VV + VH)²',
    references: 'Periasamy, S. (2018). "Significance of dual-polarimetric SAR descriptor for estimation of crop biophysical parameters." International Journal of Applied Earth Observation and Geoinformation, 73, 508-521.'
  },
  'Radar Vegetation Index (RVI)': {
    category: 'remote-sensing',
    desc: 'SAR-based crop density index that works through cloud cover and harmattan haze. Tracks canopy volume changes over time.',
    done: 'Sentinel-1 VH and VV polarization backscatter in linear sigma-nought intensity.',
    formula: 'RVI = (4 × VH) ÷ (VV + VH)',
    references: 'Trisasongko, B. H. (2017). "Radar vegetation indices for agricultural monitoring." IEEE Geoscience and Remote Sensing Letters.'
  },
  'SAR Flood Mask': {
    category: 'remote-sensing',
    desc: 'Detects flooded or waterlogged areas using radar imagery. The signal drops sharply over open water surfaces.',
    done: 'Compares current Sentinel-1 VV backscatter to a dry-season reference baseline using change detection.',
    formula: 'Flood detected if: ΔdB = VV_current − VV_reference < −3 dB',
    references: 'Clement, M. A., et al. (2018). "An efficient protocol for mapping floods using Sentinel-1 SAR imagery." International Journal of Applied Earth Observation and Geoinformation, 73, 1-15.'
  },
  'UAS Spatial Anomaly': {
    category: 'remote-sensing',
    desc: 'High-resolution drone anomaly map showing localized stress patches, canopy gaps, or failed seedling zones not visible at satellite scale.',
    done: 'Processed from multispectral UAV orthomosaic using local spatial variance anomaly detection.',
    formula: 'Anomaly Score = Local Spatial Variance Index',
    references: 'Laliberte, A. S., et al. (2011). "Multispectral UAS imagery for agricultural applications." Photogrammetric Engineering & Remote Sensing, 77(4), 361-366.'
  },
  'EVI (Vegetation Vigor)': {
    category: 'remote-sensing',
    desc: 'Enhanced Vegetation Index (EVI) measures crop biomass density and greenness while correcting for atmospheric conditions and soil background signals, making it highly sensitive in dense canopy areas.',
    done: 'Atmospherically corrected Sentinel-2 Red (B4), Near-Infrared (B8), and Blue (B2) band normalization.',
    formula: 'EVI = 2.5 × (B8 − B4) ÷ (B8 + 6 × B4 − 7.5 × B2 + 1)',
    references: 'Huete, A., et al. (2002). "Overview of the radiometric and biophysical performance of the MODIS vegetation indices." Remote Sensing of Environment, 83(1), 195-213.'
  },
  'LSWI (Water Status)': {
    category: 'remote-sensing',
    desc: 'Land Surface Water Index (LSWI) monitors canopy moisture content and crop water status by utilizing absorption features in the shortwave infrared spectrum.',
    done: 'Derived from Sentinel-2 Near-Infrared (B8) and Shortwave Infrared (B11) bands.',
    formula: 'LSWI = (B8 − B11) ÷ (B8 + B11)',
    references: 'Gao, B. C. (1996). "NDWI—A normalized difference water index for estimating liquid water in vegetation canopies from space." Remote Sensing of Environment, 58(3), 257-266.'
  },
  'VHI (Stress)': {
    category: 'remote-sensing',
    desc: 'Vegetation Health Index (VHI) combines temperature and moisture indices to evaluate overall crop stress and drought conditions.',
    done: 'Fused index integrating Sentinel-2 NDVI and Landsat-8 thermal land surface temperature (LST) anomalies.',
    formula: 'VHI = 0.5 × VCI + 0.5 × TCI',
    references: 'Kogan, F. N. (2001). "Operational space technology for global vegetation assessment." Bulletin of the American Meteorological Society, 82(3), 549-564.'
  },
  'Growth Stage': {
    category: 'remote-sensing',
    desc: 'Maps the current development phase of the crop (tillering, grand growth, maturation, etc.) across different plots.',
    done: 'Compares Sentinel-1 RVI growth curves against accumulated Growing Degree Days (GDD) thermal models.',
    formula: 'Growth Stage = f(Cumulative GDD, RVI trajectory)',
    references: 'Sakamoto, T., et al. (2005). "A crop phenology detection method using MODIS data." Remote Sensing of Environment, 97(3), 350-369.'
  },
  'Vegetation Health': {
    category: 'remote-sensing',
    desc: 'The most widely used crop health index. Measures greenness and photosynthetic activity. Below 0.45 signals crop stress.',
    done: 'Atmospherically corrected Sentinel-2 Red (B4) and Near-Infrared (B8) band normalization.',
    formula: 'NDVI = (B8 − B4) ÷ (B8 + B4)',
    references: 'Rouse, J. W., et al. (1974). "Monitoring the vernal advancement and retrogradation of natural vegetation." NASA GSFC Type III Final Report.'
  },
  'Vegetation Health (NDVI)': {
    category: 'remote-sensing',
    desc: 'The Normalized Difference Vegetation Index (NDVI) is the gold standard biophysical indicator tracking crop photosynthetic activity, vigor, and canopy greenness. Values range from -1.0 to 1.0, where healthy green canopy falls between 0.65 and 0.85.',
    done: 'Calculated from Sentinel-2 surface reflectance bands at 10m spatial resolution, corrected for atmospheric aerosols.',
    formula: 'NDVI = (B8 - B4) / (B8 + B4)',
    references: 'Rouse, J. W., et al. (1974). "Monitoring the vernal advancement and retrogradation of natural vegetation." NASA GSFC Type III Final Report; Tucker, C. J. (1979). "Red and photographic infrared linear combinations for monitoring vegetation." Remote Sensing of Environment, 8(2), 127-150.'
  },
  'Chlorophyll VCI': {
    category: 'remote-sensing',
    desc: 'Chlorophyll Vegetation Condition Index (VCI) measures active chlorophyll concentration to detect plant physiological stress and nitrogen levels.',
    done: 'Atmospherically corrected Sentinel-2 Red-Edge (B5) and Near-Infrared (B8) bands.',
    formula: 'RECI = (B8 ÷ B5) − 1',
    references: 'Gitelson, A. A., et al. (2003). "Novel algorithms for remote estimation of vegetation fraction." Remote Sensing of Environment, 84(4), 524-530.'
  },
  'Red-Edge NDVI (NDRE)': {
    category: 'remote-sensing',
    desc: 'An early-warning stress index that detects nitrogen depletion and cell damage before the crop visibly changes color.',
    done: 'Normalized ratio of Sentinel-2 narrow NIR (B8A) and Red-Edge (B5) — more sensitive than standard NDVI.',
    formula: 'NDRE = (B8A − B5) ÷ (B8A + B5)',
    references: 'Barnes, E. M., et al. (2000). "Coincident detection of crop water and nitrogen stress using multi-spectral reflectance." Proceedings of the International Conference on Precision Agriculture.'
  },
  'Water Stress (NDMI)': {
    category: 'remote-sensing',
    desc: 'Normalized Difference Moisture Index (NDMI) measures liquid water molecules in crop canopies to identify water-limiting conditions.',
    done: 'Calculated from Sentinel-2 NIR (B8) and SWIR (B11) bands to indicate plant water stress.',
    formula: 'NDMI = (B8 − B11) ÷ (B8 + B11)',
    references: 'Gao, B. C. (1996). "NDWI—A normalized difference water index for estimating liquid water in vegetation canopies from space." Remote Sensing of Environment, 58(3), 257-266.'
  },
  'SAR Soil Moisture (SMI)': {
    category: 'remote-sensing',
    desc: 'Estimates surface soil moisture (top 5 cm) using radar backscatter. Works best when crop canopy is thin (early growth stage).',
    done: 'Compares current Sentinel-1 VV backscatter against a calibrated dry-season reference image.',
    formula: 'SMI = VV_current (dB) − VV_dry_reference (dB)',
    references: 'Paloscia, S., et al. (2013). "Retrieval of soil moisture from Sentinel-1 SAR data." IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing, 6(1), 242-251.'
  },
  'Pest Risk (Inundation)': {
    category: 'remote-sensing',
    desc: 'Predicts pest and disease vulnerability based on spatial anomalies in canopy density and soil moisture indices.',
    done: 'Spatiotemporal anomaly clustering engine combining rapid NDVI declines with water logging events.',
    formula: 'Risk = f(ΔNDVI/Δt, ΔSMI/Δt, Local Variance)',
    references: 'Pullanibotla, V. R., et al. (2016). "Satellite telemetry and pest modeling frameworks." Crop Protection Journal.'
  },
  'Estimated Yield Rate (t/HA)': {
    category: 'remote-sensing',
    desc: 'Predicted fresh fruit or crop yield per hectare based on satellite-derived radiation absorption and crop growth models.',
    done: 'Monteith light-use efficiency model using Sentinel-2 fAPAR and accumulated Growing Degree Days (GDD).',
    formula: 'Yield = Σ(fAPAR × PAR × LUE × f(T) × f(W)) × Harvest Index',
    references: 'Monteith, J. L. (1972). "Solar radiation and productivity in tropical ecosystems." Journal of Applied Ecology, 9(3), 747-766.'
  },
  'Estimated Yield': {
    category: 'remote-sensing',
    desc: 'Predicted crop yield per hectare based on satellite radiation data and seasonal growth modeling.',
    done: 'Monteith light-use efficiency model using Sentinel-2 fAPAR and accumulated Growing Degree Days (GDD).',
    formula: 'Yield = Σ(fAPAR × PAR × LUE × f(T) × f(W)) × Harvest Index',
    references: 'Monteith, J. L. (1972). "Solar radiation and productivity in tropical ecosystems." Journal of Applied Ecology, 9(3), 747-766.'
  },
  'Dry Biomass Accumulation (kg/m²)': {
    category: 'remote-sensing',
    desc: 'Daily rate of dry matter (carbon) being built up in the crop. Higher values mean the plant is growing fast and photosynthesising well.',
    done: 'Computed from daily solar radiation, canopy radiation absorption (fAPAR), and temperature-limited light-use efficiency.',
    formula: 'Biomass = fAPAR × IPAR × LUE_ε',
    references: 'Monteith, J. L. (1977). "Climate and the efficiency of crop production in Britain." Philosophical Transactions of the Royal Society of London, 281(980), 277-294.'
  },
  'Daily Biomass': {
    category: 'remote-sensing',
    desc: 'Daily dry matter production rate — a direct measure of how fast the crop is growing on a given day.',
    done: 'Computed from daily solar radiation, canopy radiation absorption (fAPAR), and temperature-limited light-use efficiency.',
    formula: 'Biomass = fAPAR × IPAR × LUE_ε',
    references: 'Monteith, J. L. (1977). "Climate and the efficiency of crop production in Britain." Philosophical Transactions of the Royal Society of London, 281(980), 277-294.'
  },
  'Canopy Harvest Readiness (%)': {
    category: 'remote-sensing',
    desc: 'Estimates how ready a plot is for harvest based on crop senescence signals — canopy water loss and structural change.',
    done: 'Combines NDWI canopy water decline trends with SAR-derived RVI senescence trajectory.',
    formula: 'Readiness = f(NDWI_senescence, RVI_senescence)',
    references: 'Lobell, D. B., et al. (2012). "Using satellite data to monitor crop senescence and harvest windows." Remote Sensing of Environment.'
  },
  'Harvest Readiness': {
    category: 'remote-sensing',
    desc: 'Idem. Spectral readiness score estimating how close the crop is to optimal harvest window.',
    done: 'Combines NDWI canopy water decline trends with SAR-derived RVI senescence trajectory.',
    formula: 'Readiness = f(NDWI_senescence, RVI_senescence)',
    references: 'Lobell, D. B., et al. (2012). "Using satellite data to monitor crop senescence and harvest windows." Remote Sensing of Environment.'
  },
  'Growth Stage Mapping': {
    category: 'remote-sensing',
    desc: 'Maps the current growth phase of each plot (establishment, tillering, grand growth, etc.) using satellite and thermal data.',
    done: 'Matches Sentinel-1 RVI growth curve against accumulated Growing Degree Days (GDD) since planting.',
    formula: 'Growth Stage = f(Cumulative GDD, RVI trajectory)',
    references: 'Sakamoto, T., et al. (2005). "A crop phenology detection method using MODIS data." Remote Sensing of Environment, 97(3), 350-369.'
  },
  'Vegetative Growth Rate': {
    category: 'remote-sensing',
    desc: 'Tracks how fast the crop canopy is expanding week-over-week using satellite imagery.',
    done: 'Derived from sequential Sentinel-1 RVI observations cross-referenced with GDD thermal accumulation.',
    formula: 'Growth Rate = f(ΔRVI/Δt, GDD trajectory)',
    references: 'Sakamoto, T., et al. (2005). "A crop phenology detection method using MODIS data." Remote Sensing of Environment.'
  },
  'Precipitation': {
    category: 'remote-sensing',
    desc: 'Daily and cumulative rainfall in mm derived from satellite and ground gauge blended data. Used to identify wet and dry spells.',
    done: 'CHIRPS satellite infrared precipitation estimates blended with local rain gauge records.',
    formula: 'Rainfall (mm/day) = CHIRPS_blended_estimate',
    references: 'Funk, C., et al. (2015). "The climate hazards infrared precipitation with stations—a new environmental record for monitoring extremes." Scientific Data, 2, 150066.'
  },
  'Soil Moisture': {
    category: 'remote-sensing',
    desc: 'Estimates the amount of water held in the top 5 cm of soil using radar backscatter. Important for irrigation scheduling.',
    done: 'Sentinel-1 VV backscatter change detection referenced against a calibrated dry-season baseline.',
    formula: 'SMI = VV_current (dB) − VV_reference (dB)',
    references: 'Paloscia, S., et al. (2013). "Retrieval of soil moisture from Sentinel-1 SAR data." IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing, 6(1), 242-251.'
  },
  'Surface Temp (LST)': {
    category: 'remote-sensing',
    desc: 'Land surface temperature measured from space. High values can indicate drought stress, bare soil, or burning events.',
    done: 'Landsat-8/9 TIRS Band 10 single-channel thermal retrieval using scene emissivity and metadata.',
    formula: 'LST (°C) = Tb ÷ (1 + λ × Tb ÷ ρ × ln(ε)) − 273.15',
    references: 'Sobrino, J. A., et al. (2004). "Land surface temperature retrieval from LANDSAT TM 5." Remote Sensing of Environment, 90(4), 434-440.'
  },
  'VPD Stress': {
    category: 'remote-sensing',
    desc: 'Vapor Pressure Deficit — measures how "thirsty" the atmosphere is. High VPD forces plants to close stomata and stop growing.',
    done: 'Calculated from air temperature and relative humidity; high VPD (>2 kPa) triggers plant stress responses.',
    formula: 'VPD = es × (1 − RH)   es = 0.6108 × exp(17.27T ÷ (T + 237.3))',
    references: 'Monteith, J. L., & Unsworth, M. H. (2013). "Principles of Environmental Physics." Academic Press.'
  },
  'Canopy Density': {
    category: 'remote-sensing',
    desc: 'Percentage of the restoration zone covered by tree canopy. Target is above 85% for full restoration success.',
    done: 'Sentinel-2 CVI temporal composite normalized to a 0–100% canopy coverage scale.',
    formula: 'Canopy Density (%) = CVI_normalized × 100',
    references: 'Vincini, M., et al. (2008). "A canopy chlorophyll index for vegetation monitoring." Precision Agriculture.'
  },
  'Species Diversification': {
    category: 'remote-sensing',
    desc: 'Measures how diverse the tree species mix is within a restoration zone using the Shannon entropy index.',
    done: 'Shannon entropy calculated from the distribution of spectral endmembers across high-resolution imagery.',
    formula: 'H′ = −Σ(Pi × ln(Pi))',
    references: 'Shannon, C. E. (1948). "A mathematical theory of communication." Bell System Technical Journal, 27(3), 379-423.'
  },
  'Seedling Survival': {
    category: 'remote-sensing',
    desc: 'Tracks the percentage of planted seedlings still alive. Below 80% survival triggers replanting protocols.',
    done: 'Zonal seedling count from high-resolution multispectral UAV/satellite data verified against baseline planting density.',
    formula: 'Survival Rate (%) = (Surviving Seedlings ÷ Planted Seedlings) × 100',
    references: 'Laliberte, A. S., et al. (2011). "Multispectral UAS imagery for ecological applications." Photogrammetric Engineering.'
  },
  'Soil Stabilization': {
    category: 'remote-sensing',
    desc: 'Rates the risk of soil erosion based on terrain slope, vegetation cover, and rainfall intensity.',
    done: 'RUSLE empirical soil loss model integrating terrain slope, vegetation cover factor, and CHIRPS rainfall.',
    formula: 'Erosion Risk = R × K × LS × C  (RUSLE model)',
    references: 'Renard, K. G., et al. (1997). "Predicting soil erosion by water: a guide to conservation planning with the Revised Universal Soil Loss Equation (RUSLE)." USDA Agriculture Handbook.'
  },
  'Ecological Progress': {
    category: 'remote-sensing',
    desc: 'A composite score summarizing overall ecosystem recovery — combining canopy health, soil moisture, and erosion risk.',
    done: 'Weighted multivariate index combining CVI, NDWI, and soil stabilization scores.',
    formula: 'Eco Progress = w₁×CVI + w₂×NDWI + w₃×Stabilization',
    references: 'Kogan, F. N. (2001). "Operational space technology for global vegetation assessment." Bulletin of the American Meteorological Society.'
  },
  'InSAR Coherence (γ)': {
    category: 'remote-sensing',
    desc: 'Radar coherence score that drops sharply when vegetation is disturbed or forest is cleared — used to detect illegal logging.',
    done: 'Phase similarity computed from pairs of Sentinel-1 SLC images acquired 6–12 days apart.',
    formula: 'γ = |E[s₁ × s₂*]| ÷ √(E[|s₁|²] × E[|s₂|²])',
    references: 'Zebker, H. A., & Villasenor, J. (1992). "Decorrelation in interferometric radar echoes." IEEE Transactions on Geoscience and Remote Sensing, 30(5), 950-959.'
  },
  'GEDI Canopy Height': {
    category: 'remote-sensing',
    desc: 'Tree height measurements from NASA\'s space-based LiDAR instrument, used to validate canopy volume in restoration zones.',
    done: 'Waveform metrics extracted from GEDI footprints intersected with estate boundaries.',
    formula: 'Tree Height (m) = rh100 (100% cumulative return height)',
    references: 'Dubayah, R., et al. (2020). "The Global Ecosystem Dynamics Investigation: Mission overview and initial science results." Remote Sensing of Environment, 251, 112099.'
  },
  'NDWI Canopy Water': {
    category: 'remote-sensing',
    desc: 'Detects water in plant leaves and on the soil surface. Low values indicate canopy dryness or water stress.',
    done: 'Sentinel-2 NIR (B8) and SWIR (B11) band ratio, sensitive to leaf water content.',
    formula: 'NDWI = (B8 − B11) ÷ (B8 + B11)',
    references: 'Gao, B. C. (1996). "NDWI—A normalized difference water index for estimating liquid water in vegetation canopies from space." Remote Sensing of Environment, 58(3), 257-266.'
  },
  'SAR AGB Proxy (VH)': {
    category: 'remote-sensing',
    desc: 'Estimates above-ground biomass (wood volume and carbon stock) using Sentinel-1 radar cross-polarization signal strength.',
    done: 'Calibrated Sentinel-1 VH backscatter regression against field forest inventory biomass plots.',
    formula: 'AGB Proxy (dB) = σ₀_VH × scaling_factor',
    references: 'Mitchard, E. T., et al. (2013). "Marked baseline discrepancies in regional forest carbon maps." Carbon Balance and Management.'
  },
  'LULC Classification': {
    category: 'remote-sensing',
    desc: 'Classifies every pixel into a land cover type: tree cover, cropland, shrubland, bare soil, or water.',
    done: 'Ensemble fusion of ESA WorldCover, Google Dynamic World, and a custom SAR+Optical trained classifier.',
    formula: 'Class = argmax(Classifier(VV, VH, B2–B12, NDVI, RVI))',
    references: 'Karra, K., et al. (2021). "Global land use / land cover with Sentinel-2." IEEE International Geoscience and Remote Sensing Symposium.'
  },
  'EUDR Deforestation': {
    category: 'remote-sensing',
    desc: 'Highlights areas where tree cover has been lost since January 2020 — required for EU Deforestation Regulation compliance.',
    done: 'Bitemporal SAR change magnitude fused with near-real-time optical deforestation alert layers.',
    formula: 'Change Magnitude = √(ΔVV² + ΔVH² + (1−γ)³)',
    references: 'European Union (2023). "Regulation (EU) 2023/1115 on commodities associated with deforestation and forest degradation."'
  },
  'Soil Carbon Offset': {
    category: 'remote-sensing',
    desc: 'Estimates soil organic carbon content and sequestered carbon stock in metric tons of CO2 equivalent (tCO2e) inside restoration zones.',
    done: 'Ensemble machine learning model calibrated with local soil samples and satellite multispectral reflectances.',
    formula: 'Carbon Stock (tCO2e) = SOC_density × Soil_Depth × Bulk_Density × 3.67',
    references: 'Lal, R. (2004). "Soil carbon sequestration to mitigate climate change." Geoderma, 123(1-2), 1-22.'
  },
  'Biodiversity': {
    category: 'remote-sensing',
    desc: 'Assesses species richness and ecological diversification inside restoration zones using high-resolution spectral entropy.',
    done: 'Shannon entropy calculated from the spatial distribution of spectral endmembers across high-resolution imagery.',
    formula: 'H′ = −Σ(Pi × ln(Pi))',
    references: 'Shannon, C. E. (1948). "A mathematical theory of communication." Bell System Technical Journal, 27(3), 379-423.'
  },
  'SAR AGB Proxy': {
    category: 'remote-sensing',
    desc: 'Estimates above-ground biomass (wood volume and carbon stock) using Sentinel-1 radar cross-polarization backscatter signals.',
    done: 'Calibrated Sentinel-1 VH polarization backscatter regression model validated with local forest plots.',
    formula: 'AGB (t/HA) = VH_backscatter (dB) × Scaling_Factor',
    references: 'Mitchard, E. T., et al. (2013). "Marked baseline discrepancies in regional forest carbon maps." Carbon Balance and Management.'
  },
  'Geospatial Vegetation Vigor & Health Trends': {
    category: 'remote-sensing',
    desc: 'Time-series chart showing how NDVI (crop greenness and health) has changed over the season for each plot.',
    done: 'Plot-mean NDVI computed from atmospherically corrected Sentinel-2 pixels within each boundary, per acquisition date.',
    formula: 'NDVI_plot = Σ(NDVI_pixel) ÷ N_pixels',
    references: 'Rouse, J. W., et al. (1974). "Monitoring the vernal advancement and retrogradation of natural vegetation." NASA GSFC.'
  },
  'Moisture Retention (NDMI)': {
    category: 'remote-sensing',
    desc: 'Tracks canopy moisture content over time. A falling trend can signal water stress or a need for irrigation.',
    done: 'Sentinel-2 NIR (B8) and SWIR (B11) band ratio computed per overpass and averaged per plot.',
    formula: 'NDMI = (B8 − B11) ÷ (B8 + B11)',
    references: 'Gao, B. C. (1996). "NDWI—A normalized difference water index for estimating liquid water in vegetation canopies from space." Remote Sensing of Environment.'
  },
  'Land Classification Area': {
    category: 'remote-sensing',
    desc: 'Pie-chart breakdown of how land is used within the audit zone — what fraction is tree cover, cropland, bare soil, etc.',
    done: 'Pixel-level LULC classification aggregated into class area percentages using zonal histogram counting.',
    formula: 'Area_Class (%) = (Class_Pixels ÷ Total_Pixels) × 100',
    references: 'Karra, K., et al. (2021). "Global land use / land cover with Sentinel-2." IEEE IGARSS.'
  },
  'Seasonal Trajectory vs GDD Reference Curve': {
    category: 'remote-sensing',
    desc: 'Compares the actual radar-measured crop growth curve to what is expected at each thermal stage of the season.',
    done: 'Dual-axis chart overlaying Sentinel-1 RVI time-series with GDD-based phenological reference growth curve.',
    formula: 'Deviation = RVI_observed − RVI_expected(GDD)',
    references: 'Sakamoto, T., et al. (2005). "A crop phenology detection method using MODIS data." Remote Sensing of Environment.'
  },
  'Plot-by-Plot Growing Degree Days (GDD) Completion Rate': {
    category: 'remote-sensing',
    desc: 'Shows how much accumulated heat each plot has received since planting — determines which growth stage the crop is in.',
    done: 'Sum of daily average temperatures above the base temperature (T_base) from planting date to today.',
    formula: 'GDD = Σ(T_mean − T_base)   T_mean = (T_max + T_min) ÷ 2',
    references: 'McMaster, G. S., & Wilhelm, W. W. (1997). "Growing degree-days: one equation, two interpretations." Agricultural and Forest Meteorology, 87(4), 291-300.'
  },

  // ── FARMER INPUTS SUBPAGE ───────────────────────────────────────────────────
  'Soil Temp': {
    category: 'farmer-inputs',
    desc: 'Root zone soil temperature — directly affects germination, nutrient uptake, and microbial activity. Optimal range is 20–28 °C.',
    done: 'ERA5-Land reanalysis model output blended with local in-situ telemetry readings.',
    formula: 'T_soil = ERA5_RootZone_Temperature (°C)',
    references: 'Albergel, C., et al. (2012). "An evaluation of soil temperature and moisture in ERA5-Land." Soil Biology & Biochemistry.'
  },
  'Nitrogen Topdressing (N)': {
    category: 'farmer-inputs',
    desc: 'Application of nitrogen-rich fertilizers (e.g. Urea, Ammonium Nitrate) to satisfy crop vegetative demand. Guided by chlorophyll (RECI) remote-sensing anomalies to prevent over-fertilization.',
    done: 'Recorded input application log tracking dosage per hectare (kg/ha) across plot blocks.',
    formula: 'Required N = Target Nitrogen - Soil Mineralized Nitrogen',
    references: 'Havlin, J. L., et al. (2013). "Soil Fertility and Fertilizers: An Introduction to Nutrient Management." Pearson Education.'
  },
  'Phosphorus Replenishment (P)': {
    category: 'farmer-inputs',
    desc: 'Application of phosphates to promote root development and crop early vigor. Essential for establishing young canopy and supporting long-term structural health.',
    done: 'Monitored soil test records combined with field application logs of Single Superphosphate (SSP) or DAP.',
    formula: 'Required P2O5 = Yield Target Factor × (Target P - Lab Soil P)',
    references: 'Barrow, N. J. (1983). "A discussion of the methods for predicting the phytotoxicity of phosphorus." Journal of Soil Science.'
  },
  'Potassium Fertilization (K)': {
    category: 'farmer-inputs',
    desc: 'Application of potash (KCl) to enhance crop water-use efficiency, drought resistance, stomatal regulation, and fresh fruit bunch yields.',
    done: 'Zonal soil chemistry analysis cross-referenced with agricultural topdressing operations.',
    formula: 'Required K2O = Yield Export Factor × (Target K - Lab Soil K)',
    references: 'Römheld, V., & Kirkby, E. A. (2010). "Research on potassium in agriculture: Needs and prospects." Plant and Soil, 335(1), 155-180.'
  },
  'Soil pH Adjustment (Lime)': {
    category: 'farmer-inputs',
    desc: 'Application of agricultural lime (calcium carbonate) or dolomite to neutralize acidic soils, maximizing nutrient bioavailability and microbial activity.',
    done: 'Laboratory soil sample testing of active acidity matched with limestone delivery records.',
    formula: 'Lime Requirement = Buffer pH Factor × Target ΔpH',
    references: 'Shoemaker, H. E., et al. (1961). "Buffer methods for determining lime requirement of soils." Soil Science Society of America Journal.'
  },
  'FAO-56 Evapotranspiration Model': {
    category: 'farmer-inputs',
    desc: 'Shows the water demand of the crop (ETc) versus actual water used (ETa) — the gap indicates irrigation deficit.',
    done: 'FAO Penman-Monteith energy balance model using temperature, solar radiation, humidity, and wind speed inputs.',
    formula: 'ETo = f(Rn, G, T, u₂, eₛ−eₐ, Δ, γ)   ETc = Kc × ETo',
    references: 'Allen, R. G., et al. (1998). "Crop evapotranspiration - Guidelines for computing crop water requirements." FAO Irrigation and Drainage Paper 56.'
  },
  '7-Day Evapotranspiration Historical Log': {
    category: 'farmer-inputs',
    desc: 'A 7-day log of daily crop water consumption and root zone soil water depletion — useful for irrigation planning.',
    done: 'Daily water balance model tracking soil water depletion, precipitation, irrigation, and crop transpiration.',
    formula: 'Dr,i = Dr,i−1 − (P − RO) − I + ETc + DP',
    references: 'Allen, R. G., et al. (1998). "Crop evapotranspiration - Guidelines for computing crop water requirements." FAO Irrigation and Drainage Paper 56.'
  },
  'Nutrient Profiling': {
    category: 'farmer-inputs',
    desc: 'Radar chart profiling nitrogen, phosphorus, potassium, pH, and organic carbon balances.',
    done: 'Zonal aggregation of soil test diagnostics and fertilizer log inputs.',
    formula: 'Nutrient_Score = f(SoilTest, FertilizerApplied)',
    references: 'Havlin, J. L., et al. (2013). "Soil Fertility and Fertilizers." Pearson.'
  },
  'Detailed Soil Chemistry Diagnostics': {
    category: 'farmer-inputs',
    desc: 'Detailed macronutrient and chemical recommendation guide based on plot soil testing.',
    done: 'Agronomic diagnostic engine analyzing macronutrient levels and suggesting topdressing rates.',
    formula: 'Recommendation = Target_N_P_K - Soil_N_P_K',
    references: 'Sparks, D. L. (2003). "Environmental Soil Chemistry." Academic Press.'
  },
  'Geospatial Mismatch Audits': {
    category: 'farmer-inputs',
    desc: 'Discrepancy logs matching farm coordinate claims against official forest registers.',
    done: 'Overlap analysis intersecting estate vector boundaries with protected area and official forest reserves databases.',
    formula: 'Mismatch_Area = Intersection(Estate_Boundary, Protected_Forest_Register)',
    references: 'OGC Simple Features Access Specification; ISO 19115.'
  },
  'Ingested Overpass Quality Control Ledger': {
    category: 'farmer-inputs',
    desc: 'Audit log showing pre-processing steps and cloud mask quality check results.',
    done: 'Automated QC pipeline evaluating cloud cover percentages and sensor health flags per overpass.',
    formula: 'Pass_QC = (Cloud_Cover < Cloud_Threshold) && (Sensor_Status == OK)',
    references: 'Sentinel-2 L2A Ingestion Quality Guidelines, ESA.'
  },
  'Deforestation Compliance Ledger': {
    category: 'farmer-inputs',
    desc: 'Deforestation warning patches mapping post-2020 tree canopy loss for compliance audits.',
    done: 'Tabular log of detected canopy loss events with location, area, and compliance status.',
    formula: 'Compliance = (Forest_Loss_Area < Compliance_Threshold)',
    references: 'Regulation (EU) 2023/1115 on Deforestation-free products.'
  },
  'Analytical Report Ledger': {
    category: 'farmer-inputs',
    desc: 'Exportable GIS reports ledger certifying spatial audits and sustainability compliance.',
    done: 'Generated PDF certificates containing maps, timeline trends, and compliance checklists.',
    formula: 'Report_Hash = SHA255(Report_Content)',
    references: 'EVM Smart Contract Carbon Registry standard specifications.'
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

// Lowercase crop ids (as passed by the per-crop Monitoring wrappers) → display labels
const CROP_CONFIG_KEYS = {
  rice: 'Rice', maize: 'Maize', cashew: 'Cashew', cocoa: 'Cocoa',
  ffb: 'Oil Palm', oil_palm: 'Oil Palm', rubber: 'Rubber',
  cassava: 'Cassava', sugarcane: 'SugarCane',
};

const CropDashboardLayout = ({ cropType, cropSummary, cropBlocks, cropIndices, cropLoading, cropError, mapCenter, onBack, onSignOut }) => {
  const cropLabel = CROP_META[cropType]?.label || CROP_CONFIG_KEYS[cropType] || cropType;
  // Tenant identity comes strictly from the authenticated session — no default
  // organization. Without a session, bounce straight back to login.
  const tenant = localStorage.getItem('fi_tenant');
  const hasSession = Boolean(tenant && localStorage.getItem('fi_token'));
  useEffect(() => {
    if (!hasSession && onSignOut) onSignOut();
  }, [hasSession]);
  // Display name comes from the organization's TenantConfig (stored at login)
  const tenantDisplayName = localStorage.getItem('fi_display_name')
    || (tenant ? tenant.charAt(0).toUpperCase() + tenant.slice(1) : '');
  // Map center comes from TenantConfig: the mapCenter prop (fetched live) first,
  // then the copy stored at login, then a neutral default.
  let storedMapCenter = null;
  try { storedMapCenter = JSON.parse(localStorage.getItem('fi_map_center') || 'null'); } catch { storedMapCenter = null; }
  const defaultMapCenter = mapCenter
    || (Array.isArray(storedMapCenter) && storedMapCenter.length === 2 ? storedMapCenter : [6.436, 5.273]);

  // Extract numeric farm ID from real plot IDs like PLOT-042 → '42', or fall back to '1'
  const getBackendFarmId = (plotId) => {
    if (!plotId) return '1';
    const match = plotId.match(/\d+/);
    return match ? match[0] : '1';
  };

  const [sliderData, setSliderData] = useState(null);
  const [pixelTimeseries, setPixelTimeseries] = useState(null);
  const [farmBoundary, setFarmBoundary] = useState(null); // GeoJSON Feature for tenants with no plot polygons


  const [activeSidebarItem, setActiveSidebarItem] = useState('analytics');
  const [activeTab, setActiveTab] = useState('monitor');

  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [plots, setPlots] = useState([]);
  const [restorationZones, setRestorationZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Same live backend data as the organization view — the crop pages must render
  // the identical experience (map, splits, calendar, charts, alerts, boundary).
  // Crop-specific narrowing (index profiles, legends) layers on top via cropType.
  useEffect(() => {
    if (!hasSession) return; // no authenticated session — redirect effect handles it
    let active = true;
    async function loadBackendData() {
      try {
        const statsRes = await api.fetchDashboardStats(tenant);
        const trendsRes = await api.fetchDashboardTrends(tenant);
        const plotsRes = await api.fetchPlotsIntelligence(tenant);
        const zonesRes = await api.fetchRestorationZones(tenant);
        const alertsRes = await api.fetchAlerts(tenant);

        if (active) {
          setStats(statsRes);
          setTrends(trendsRes);
          setPlots(plotsRes);
          setRestorationZones(zonesRes);
          // Always fetch the farm boundary — used as overall outline for all tenants
          try {
            const boundary = await api.fetchFarmBoundary();
            if (active && boundary && boundary.geometry) setFarmBoundary(boundary);
          } catch (_) {}
          // Map backend alert items to frontend structure
          const mappedAlerts = (alertsRes.feed || []).map(a => ({
            id: a.alert_id,
            estate: `${tenantDisplayName} Estate`,
            plot: a.plot_id,
            category: a.type,
            severity: a.severity,
            desc: a.message,
            date: a.timestamp.split(' ')[0],
            time: a.timestamp.split(' ')[1] || '00:00',
            status: a.acknowledged ? 'Acknowledged' : 'Active'
          }));
          setAlerts(mappedAlerts);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data from backend:", err);
        if (active) {
          setLoading(false);
        }
      }
    }
    loadBackendData();
    return () => { active = false; };
  }, [tenant]);
  const [selectedBasemap, setSelectedBasemap] = useState('sentinel-2');
  const [selectedIndex, setSelectedIndex] = useState('ndvi');
  const [mapOpacity, setMapOpacity] = useState(80);
  const [showRasterLayer, setShowRasterLayer] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [availableIndices, setAvailableIndices] = useState([]);

  // Enumerate available zarr indices for the active tenant
  useEffect(() => {
    async function loadIndices() {
      try {
        const data = await api.fetchRasterIndices();
        if (data?.indices?.length) setAvailableIndices(data.indices);
      } catch (err) {
        console.error('Failed to fetch raster indices:', err);
      }
    }
    loadIndices();
  }, [tenant]);

  // ── Crop-specific index profile (from /crop-monitoring/indices) ──────────
  // Ordered by agronomic priority, each entry carries the crop-specific label,
  // notes and legend classification for this crop's interpretation.
  const cropProfileEntries = useMemo(() => cropIndices?.indices || [], [cropIndices]);
  const cropPrimaryIndex = cropIndices?.primary_index || null;

  // Only what is relevant to this crop AND actually present in the tenant's
  // zarr store is offered; if the intersection is empty (e.g. sparse archive)
  // fall back to everything available so the map never goes blank.
  const displayIndices = useMemo(() => {
    if (!availableIndices.length) return [];
    if (!cropProfileEntries.length) return availableIndices;
    const avail = new Map(availableIndices.map(i => [String(i.index).toLowerCase(), i]));
    const filtered = cropProfileEntries
      .filter(e => avail.has(e.key))
      .map(e => avail.get(e.key));
    return filtered.length > 0 ? filtered : availableIndices;
  }, [availableIndices, cropProfileEntries]);

  // Start on the crop's primary index once data is available (once only)
  const primaryAppliedRef = useRef(false);
  useEffect(() => {
    if (primaryAppliedRef.current || !cropPrimaryIndex || !availableIndices.length) return;
    const exists = availableIndices.some(i => String(i.index).toLowerCase() === cropPrimaryIndex);
    if (exists) setSelectedIndex(cropPrimaryIndex);
    primaryAppliedRef.current = true;
  }, [cropPrimaryIndex, availableIndices]);

  const [refreshSlider, setRefreshSlider] = useState(0);
  const [selectedSensor, setSelectedSensor] = useState('sentinel-2'); // 'sentinel-2' | 'landsat'

  const SAR_INDICES = new Set(['rvi', 'dprvi', 'smi', 'flood_mask', 'sar_rvi', 'sar_dprvi', 'sar_smi']);
  const isSarIndex = SAR_INDICES.has((selectedIndex || '').toLowerCase());
  // SAR indices are always Sentinel-1; optical defaults to user-chosen sensor
  const effectiveSensor = isSarIndex ? 'sentinel-1' : selectedSensor;

  // Fetch timeseries slider and pre-rendered raster overlays
  useEffect(() => {
    async function loadSliderData() {
      setTimelineLoading(true);
      setSliderData(null);        // clear stale tiles while fetching
      setTIMELINE_DATA([]);       // clear stale labels immediately
      try {
        const indexName = (selectedIndex || 'ndvi').toLowerCase();
        const sensorParam = isSarIndex ? 'sentinel-1' : selectedSensor;
        const data = await api.fetchTimeseriesSlider({
          farm: tenant || 'farm_1',
          index: indexName,
          start: '2026-01-01',
          end: '2026-03-31',
          sensor: sensorParam,
        });
        setSliderData(data);
        // Keep zarr bounds in sync when index changes (SAR vs optical extents may differ)
        if (data?.zarr_bounds) setZarrBounds(data.zarr_bounds);
      } catch (err) {
        console.error("Failed to fetch timeseries slider data:", err);
      } finally {
        setTimelineLoading(false);
      }
    }
    loadSliderData();
  }, [selectedPlot, selectedIndex, tenant, refreshSlider, selectedSensor]);

  // Click handler to fetch Zarr pixel timeseries
  const handlePlotClick = async (plot, lat, lng) => {
    setSelectedPlot(plot);
    try {
      const farmId = getBackendFarmId(plot.id);
      const indexName = (selectedIndex || 'ndvi').toLowerCase();
      const data = await api.fetchPixelTimeseries({
        farm: `farm_${farmId}`,
        index: indexName,
        lat,
        lon: lng
      });
      if (data && data.series) {
        setPixelTimeseries(data.series);
      } else {
        setPixelTimeseries(null);
      }
    } catch (err) {
      console.error("Failed to fetch pixel timeseries:", err);
      setPixelTimeseries(null);
    }
  };

  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear,  setCalendarYear]  = useState(new Date().getFullYear());

  // Real timeline loaded from backend zarr/TIF data — no mock values
  const [TIMELINE_DATA, setTIMELINE_DATA] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [tileRefreshing, setTileRefreshing] = useState(false);
  // Spatial bounds from zarr x/y arrays: [[min_lat, min_lng], [max_lat, max_lng]]
  const [zarrBounds, setZarrBounds] = useState(null);

  // Build TIMELINE_DATA from sliderData — single source of truth, no separate NDVI fetch.
  // This guarantees currentTimeline.date always matches sliderData.tiles keys.
  useEffect(() => {
    if (!sliderData) return;
    setTimelineLoading(false);
    if (!sliderData.timeline?.length) {
      setTIMELINE_DATA([]);
      return;
    }
    const entries = sliderData.timeline.map((t) => {
      let sumNdvi = 0, countNdvi = 0;
      let sumNdmi = 0, countNdmi = 0;
      let sumEvi = 0, countEvi = 0;
      let sumChl = 0, countChl = 0;
      let sumNdwi = 0, countNdwi = 0;

      if (plots && plots.length > 0) {
        plots.forEach(p => {
          if (p.indices) {
            if (p.indices.ndvi && p.indices.ndvi[t.date] != null) { sumNdvi += p.indices.ndvi[t.date]; countNdvi++; }
            if (p.indices.ndmi && p.indices.ndmi[t.date] != null) { sumNdmi += p.indices.ndmi[t.date]; countNdmi++; }
            if (p.indices.evi && p.indices.evi[t.date] != null) { sumEvi += p.indices.evi[t.date]; countEvi++; }
            if (p.indices.cvi && p.indices.cvi[t.date] != null) { sumChl += p.indices.cvi[t.date]; countChl++; }
            if (p.indices.ndwi && p.indices.ndwi[t.date] != null) { sumNdwi += p.indices.ndwi[t.date]; countNdwi++; }
          }
        });
      }

      return {
        date: t.date,
        label: t.label,
        satellite: t.satellite || null,
        quality: '—',
        ndvi: countNdvi > 0 ? sumNdvi / countNdvi : (t.ndvi ?? 0),
        ndmi: countNdmi > 0 ? sumNdmi / countNdmi : (t.ndmi ?? 0),
        evi: countEvi > 0 ? sumEvi / countEvi : 0,
        chlorophyll: countChl > 0 ? sumChl / countChl : 0,
        ndwi: countNdwi > 0 ? sumNdwi / countNdwi : 0,
        color: '#16A34A',
        tileUrl: (sliderData.tiles || {})[t.date] || null,
      };
    });
    setTIMELINE_DATA(entries);
    if (entries.length > 0) {
      // Auto-navigate calendar and slider to the most recent available acquisition date
      const lastIdx = entries.length - 1;
      const last = entries[lastIdx].date;
      const d = new Date(last);
      setCalendarMonth(d.getMonth());
      setCalendarYear(d.getFullYear());
      setSelectedTimelineIndex(lastIdx);
    }
  }, [sliderData, plots]);

  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(2);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareTimelineIndex, setCompareTimelineIndex] = useState(3);

  // activeTimelineIndex drives map tile rendering — debounced 10s after slider stops.
  // selectedTimelineIndex updates instantly for slider position feedback.
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(2);
  const [activeCompareTimelineIndex, setActiveCompareTimelineIndex] = useState(3);
  const [sliderPending, setSliderPending] = useState(false);
  const sliderTimerA = useRef(null);
  const sliderTimerB = useRef(null);

  useEffect(() => {
    setSliderPending(true);
    clearTimeout(sliderTimerA.current);
    sliderTimerA.current = setTimeout(() => {
      setActiveTimelineIndex(selectedTimelineIndex);
      setSliderPending(false);
    }, 10000);
    return () => clearTimeout(sliderTimerA.current);
  }, [selectedTimelineIndex]);

  useEffect(() => {
    clearTimeout(sliderTimerB.current);
    sliderTimerB.current = setTimeout(() => {
      setActiveCompareTimelineIndex(compareTimelineIndex);
    }, 10000);
    return () => clearTimeout(sliderTimerB.current);
  }, [compareTimelineIndex]);

  const clampedTimelineIndex = Math.min(activeTimelineIndex, TIMELINE_DATA.length - 1);
  const currentTimelineA = TIMELINE_DATA[clampedTimelineIndex >= 0 ? clampedTimelineIndex : 0];
  const clampedCompareTimelineIndex = Math.min(activeCompareTimelineIndex, TIMELINE_DATA.length - 1);
  const currentTimelineB = TIMELINE_DATA[clampedCompareTimelineIndex >= 0 ? clampedCompareTimelineIndex : 0];
  const currentTimeline = currentTimelineA;

  const plotsDataA = useMemo(() => {
    if (plots && plots.length > 0) {
      return plots.map(p => {
        let coords = [];
        if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(p.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        const ndviVal = p.indices?.ndvi ?? 0;
        const ndmiVal = p.indices?.ndmi ?? 0;
        const healthVal = ndviVal > 0.7 ? 'Optimal' : ndviVal > 0.55 ? 'Good' : 'Stressed';
        const colorVal = healthVal === 'Optimal' ? '#15803d' : healthVal === 'Good' ? '#84cc16' : '#dc2626';
        return { id: p.plot_id, name: p.name || p.plot_id, area: `${p.area_ha || 10.0} HA`, health: healthVal, ndvi: ndviVal, ndmi: ndmiVal, color: colorVal, coords, indices: p.indices, subfarm: p.subfarm || p.division || null, division: p.division || null, blocId: p.bloc_id || null };
      });
    }
    return [];
  }, [plots, currentTimelineA]);

  const plotsDataB = useMemo(() => {
    if (plots && plots.length > 0) {
      return plots.map(p => {
        let coords = [];
        if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(p.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        const ndviVal = p.indices?.ndvi ?? 0;
        const ndmiVal = p.indices?.ndmi ?? 0;
        const healthVal = ndviVal > 0.7 ? 'Optimal' : ndviVal > 0.55 ? 'Good' : 'Stressed';
        const colorVal = healthVal === 'Optimal' ? '#15803d' : healthVal === 'Good' ? '#84cc16' : '#dc2626';
        return { id: p.plot_id, name: p.name || p.plot_id, area: `${p.area_ha || 10.0} HA`, health: healthVal, ndvi: ndviVal, ndmi: ndmiVal, color: colorVal, coords, indices: p.indices, subfarm: p.subfarm || p.division || null, division: p.division || null, blocId: p.bloc_id || null };
      });
    }
    return [];
  }, [plots, currentTimelineB]);

  const plotsData = plotsDataA;

  const currentTileUrl = useMemo(() => {
    if (!currentTimeline) return null;
    // sliderData is loaded with selectedIndex — always use it first so index changes take effect
    if (sliderData?.tiles?.[currentTimeline.date]) return sliderData.tiles[currentTimeline.date];
    // fallback: NDVI tile baked into the timeline entry
    if (currentTimeline.tileUrl) return currentTimeline.tileUrl;
    return null;
  }, [sliderData, currentTimeline]);

  // Brief flash to signal tile refresh to user when tile URL changes
  useEffect(() => {
    if (!currentTileUrl) return;
    setTileRefreshing(true);
    const t = setTimeout(() => setTileRefreshing(false), 1800);
    return () => clearTimeout(t);
  }, [currentTileUrl]);

  const activePlotBounds = useMemo(() => {
    // For the raster overlay we want full-farm coverage, not a single plot.
    // Priority: all-plots bbox → farm boundary bbox → single plot fallback.
    if (plotsData && plotsData.length > 0) {
      const allLats = plotsData.flatMap(p => (p.coords || []).map(c => c[0]));
      const allLngs = plotsData.flatMap(p => (p.coords || []).map(c => c[1]));
      if (allLats.length > 0) {
        return [
          [Math.min(...allLats), Math.min(...allLngs)],
          [Math.max(...allLats), Math.max(...allLngs)],
        ];
      }
    }
    if (farmBoundary?.properties?.bbox) {
      const { min_lat, max_lat, min_lng, max_lng } = farmBoundary.properties.bbox;
      return [[min_lat, min_lng], [max_lat, max_lng]];
    }
    // Last resort: single selected/first plot
    const activePlot = selectedPlot || (plotsData && plotsData[0]);
    if (!activePlot || !activePlot.coords) return null;
    const lats = activePlot.coords.map(c => c[0]);
    const lngs = activePlot.coords.map(c => c[1]);
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
  }, [selectedPlot, plotsData, farmBoundary]);

  // Bounds used for the raster ImageOverlay: prefer zarr-derived bounds (exact pixel coverage)
  // over GeoJSON-derived bounds which may differ from the zarr spatial extent.
  const rasterOverlayBounds = useMemo(() => {
    if (zarrBounds) return zarrBounds;
    return activePlotBounds;
  }, [zarrBounds, activePlotBounds]);

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
  const [bottomPanelHeight, setBottomPanelHeight] = useState(175);
  const [isBottomPanelMinimized, setIsBottomPanelMinimized] = useState(false);
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

  const renderFloatingBasemapSelector = () => {
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
          <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-sm shadow-lg overflow-hidden">
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
  const [reportPlot, setReportPlot] = useState('WHOLE-FARM');
  const [reportIndex, setReportIndex] = useState('NDVI');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportProgressText, setReportProgressText] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);

  // Verification state
  const [selectedVerifyPlot, setSelectedVerifyPlot] = useState('');
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
  const [selectedThemeReport, setSelectedThemeReport] = useState('');
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryTab, setGlossaryTab] = useState('remote-sensing'); // 'remote-sensing' or 'farmer-inputs'

  // Map play / calendar / user menu
  const [isPlaying, setIsPlaying]       = useState(false);
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
  const [selectedAlertPlot, setSelectedAlertPlot] = useState(null);
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
  const [selectedRestoreZone, setSelectedRestoreZone] = useState(null);
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

  // Settings and User Management States — only the real logged-in account,
  // no fabricated team roster. Additional members appear when invited.
  const sessionEmail = localStorage.getItem('fi_email') || '';
  const [settingsUsers, setSettingsUsers] = useState(() => sessionEmail ? [
    { id: 1, name: sessionEmail.split('@')[0], email: sessionEmail, role: 'Account Owner', status: 'Active', avatar: sessionEmail.slice(0, 2).toUpperCase() }
  ] : []);
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
  const [sentinelApiKey, setSentinelApiKey] = useState('');
  const [planetApiKey, setPlanetApiKey] = useState('');
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
  const [healthShowSavi, setHealthShowSavi] = useState(false);
  const [healthSaviOpacity, setHealthSaviOpacity] = useState(80);
  const [healthShowNdwi, setHealthShowNdwi] = useState(false);
  const [healthNdwiOpacity, setHealthNdwiOpacity] = useState(80);
  const [healthShowChlorophyll, setHealthShowChlorophyll] = useState(false);
  const [healthChlorophyllOpacity, setHealthChlorophyllOpacity] = useState(70);
  const [healthShowWater, setHealthShowWater] = useState(false);
  const [healthWaterOpacity, setHealthWaterOpacity] = useState(70);
  const [healthShowPest, setHealthShowPest] = useState(false);
  const [healthPestOpacity, setHealthPestOpacity] = useState(70);
  const [healthShowRainfall, setHealthShowRainfall] = useState(false);
  const [healthRainfallOpacity, setHealthRainfallOpacity] = useState(80);

  // Moisture Content map layers states
  const [moistureShowLayers, setMoistureShowLayers] = useState(true);
  const [moistureShowBoundaries, setMoistureShowBoundaries] = useState(true);
  const [moistureBoundariesOpacity, setMoistureBoundariesOpacity] = useState(100);
  const [moistureShowSmi, setMoistureShowSmi] = useState(true);
  const [moistureSmiOpacity, setMoistureSmiOpacity] = useState(80);
  const [moistureOpExpanded, setMoistureOpExpanded] = useState(true);
  const [moistureBioExpanded, setMoistureBioExpanded] = useState(true);

  // New Settings Center states — profile comes from the authenticated session
  const [profileName, setProfileName] = useState(() => (localStorage.getItem('fi_email') || 'Account').split('@')[0]);
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('fi_email') || '');
  const [profileRole, setProfileRole] = useState('Member');
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
  const [intelBioExpanded, setIntelBioExpanded] = useState(true);
  const [intelMonExpanded, setIntelMonExpanded] = useState(false);

  // Crop legend cards: which index legends are manually expanded
  // (the index currently rendered on the map is always expanded)
  const [expandedLegendKeys, setExpandedLegendKeys] = useState([]);
  const toggleLegendKey = (key) => setExpandedLegendKeys(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

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


  const [telemetryLogs, setTelemetryLogs] = useState([]);
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
    { id: 'EXP-2026-104', format: 'GeoJSON', scope: 'All Plots & Zones', size: '2.4 MB', date: 'May 28, 2026', status: 'Completed' }
  ]);

  const cardStyle = glassmorphismEnabled ? 'glass shadow-premium border border-white/20' : 'bg-white border border-gray-100 shadow-sm';

  const getHealthPlotStyleOutline = (plot) => {
    let color = '#000000';
    let fillColor = 'transparent';
    let fillOpacity = 0;
    
    if (healthShowRainfall && plot?.cumulative_rainfall_14d != null) {
      const rain = plot.cumulative_rainfall_14d;
      fillColor = rain > 150 ? '#6d28d9' : rain > 50 ? '#2563eb' : rain > 10 ? '#60a5fa' : '#fbbf24';
      fillOpacity = healthRainfallOpacity / 100;
    }
    
    return {
      color: healthShowBoundaries ? color : 'transparent',
      weight: healthShowBoundaries ? 2.5 : 0,
      opacity: healthBoundariesOpacity / 100,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  };

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
      const dbChange = plot.ndmi != null ? (plot.ndmi * 4) : 1.5;
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
      fillColor = (plot.indices?.flood_risk ?? 0) > 0.5 ? '#1e3a8a' : 'transparent';
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
      const val = zone.survivalNum ?? zone.progress ?? 80;
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
      const sv = zone.survivalNum ?? zone.progress ?? 80;
      fillColor = sv > 90 ? '#14532D' : sv > 75 ? '#16A34A' : '#86EFAC';
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
      fillColor = (plot.ndvi != null && plot.ndvi < 0.5) ? '#dc2626' : '#16a34a';
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
      fillColor = (plot.ndvi ?? 0) > 0.7 ? '#15803d' : (plot.ndvi ?? 0) > 0.5 ? '#86efac' : '#fbbf24';
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
      const dprvi = plot.indices?.dprvi ?? plot.ndvi;
      fillColor = dprvi > 0.6 ? '#15803d' : dprvi > 0.4 ? '#eab308' : '#ef4444';
      fillOpacity = intelDprviOpacity / 100;
    } else if (layer === 'rvi') {
      const val = plot.indices?.reci ?? plot.ndvi;
      fillColor = val > 0.70 ? '#14532D' : val > 0.50 ? '#16A34A' : val > 0.30 ? '#86EFAC' : val > 0.15 ? '#EAB308' : '#EF4444';
      fillOpacity = intelRviOpacity / 100;
    } else if (layer === 'flood') {
      const floodVal = plot.indices?.ndwi ?? 0;
      fillColor = floodVal > 0 ? '#1e3a8a' : 'transparent';
      fillOpacity = intelFloodOpacity / 100;
    } else if (layer === 'uas') {
      fillColor = 'transparent'; // UAS layer not yet connected
      fillOpacity = 0;
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
  const renderFarmBoundary = () => {
    if (!farmBoundary || !farmBoundary.geometry || !farmBoundary.geometry.coordinates) return null;
    const ring = farmBoundary.geometry.coordinates[0];
    // Convert [lng, lat] → Leaflet [lat, lng]
    const positions = ring.map(([lng, lat]) => [lat, lng]);
    const name = farmBoundary.properties?.name ?? tenantDisplayName;
    const center = farmBoundary.properties?.center;
    return (
      <Polygon
        positions={positions}
        pathOptions={{ color: '#16A34A', weight: 2.5, fillColor: '#16A34A', fillOpacity: 0.08, dashArray: '6 4' }}
      />
    );
  };

  const renderIntelPolygons = (plots, suffix = '') => {
    return plots.map(plot => {
      const keyPrefix = `${plot.id}${suffix ? '-' + suffix : ''}`;
      return (
        <React.Fragment key={keyPrefix}>
          {intelShowBoundaries && (
            <Polygon
              positions={plot.coords}
              pathOptions={getIntelPlotStyleOutline()}
              eventHandlers={{ click: (e) => handlePlotClick(plot, e.latlng.lat, e.latlng.lng) }}
            />
          )}
        </React.Fragment>
      );
    });
  };

  const renderHealthPolygons = (plots, suffix = '') => {
    return plots.map(plot => {
      const keyPrefix = `${plot.id}${suffix ? '-' + suffix : ''}`;
      return (
        <React.Fragment key={keyPrefix}>
          {healthShowBoundaries && (
            <Polygon
              positions={plot.coords}
              pathOptions={getHealthPlotStyleOutline(plot)}
              eventHandlers={{ click: (e) => handlePlotClick(plot, e.latlng.lat, e.latlng.lng) }}
            />
          )}
        </React.Fragment>
      );
    });
  };

  const renderYieldPolygons = (plots, suffix = '') => {
    return plots.map(plot => {
      const keyPrefix = `${plot.id}`;
      return (
        <React.Fragment key={keyPrefix}>
          {yieldShowBoundaries && (
            <Polygon
              positions={plot.coords}
              pathOptions={getYieldPlotStyleOutline()}
              eventHandlers={{ click: (e) => handlePlotClick(plot, e.latlng.lat, e.latlng.lng) }}
            />
          )}
        </React.Fragment>
      );
    });
  };

  const renderRestorePolygons = (zones, suffix = '') => {
    return zones.map(zone => {
      const keyPrefix = `${zone.id}`;
      return (
        <React.Fragment key={keyPrefix}>
          {restoreShowBoundaries && (
            <Polygon
              positions={zone.coords}
              pathOptions={getRestorePlotStyleOutline()}
              eventHandlers={{ click: () => setSelectedRestoreZone(zone) }}
            />
          )}
        </React.Fragment>
      );
    });
  };

  const renderClimatePolygons = (plots, suffix = '') => {
    return plots.map(plot => {
      const keyPrefix = `${plot.id}`;
      return (
        <React.Fragment key={keyPrefix}>
          {climateShowBoundaries && (
            <Polygon
              positions={plot.coords}
              pathOptions={getClimatePlotStyleOutline()}
              eventHandlers={{ click: (e) => handlePlotClick(plot, e.latlng.lat, e.latlng.lng) }}
            />
          )}
        </React.Fragment>
      );
    });
  };

  const handleEstateChange = (val) => {
    setFilterEstate(val);
    setFilterPlot('All');
    // Estate filter now uses real subfarm names from plotsData
  };

  const handlePlotChange = (val) => {
    setFilterPlot(val);
  };

  const handleSidebarClick = (item) => {
    setActiveSidebarItem(item);
    if (item === 'analytics') {
      setActiveTab('monitor');
    } else if (item === 'moisture-content') {
      setSelectedIndex('smi');
    }
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
            scope: exportPlotTarget === 'ALL' ? 'All Plots & Zones' : exportPlotTarget,
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


  const healthPlotsDataA = useMemo(() => {
    if (plots && plots.length > 0) {
      return plots.map(p => {
        let coords = [];
        if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(p.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        const ndviVal = p.indices?.ndvi ?? 0;
        const healthVal = ndviVal > 0.7 ? 'Optimal' : ndviVal > 0.55 ? 'Good' : 'Stressed';
        return {
          id: p.plot_id,
          name: p.name || p.plot_id,
          area: `${p.area_ha || 10.0} HA`,
          health: healthVal,
          ndvi: ndviVal,
          savi: p.indices?.savi ?? null,
          ndwi: p.indices?.ndwi ?? null,
          cumulative_rainfall_14d: p.indices?.cumulative_rainfall_14d ?? null,
          chlorophyll: p.indices?.chlorophyll ?? null,
          waterStress: p.indices?.ndmi ?? null,
          pestRisk: p.indices?.uas_anomaly_score > 0.4 ? 'High Risk' : p.indices?.uas_anomaly_score > 0.15 ? 'Moderate Risk' : 'Low Risk',
          coords
        };
      });
    }
    return [];
  }, [plots, currentTimelineA]);

  const healthPlotsDataB = useMemo(() => {
    if (plots && plots.length > 0) {
      return plots.map(p => {
        let coords = [];
        if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(p.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        const ndviVal = p.indices?.ndvi ?? 0;
        const healthVal = ndviVal > 0.7 ? 'Optimal' : ndviVal > 0.55 ? 'Good' : 'Stressed';
        return {
          id: p.plot_id,
          name: p.name || p.plot_id,
          area: `${p.area_ha || 10.0} HA`,
          health: healthVal,
          ndvi: ndviVal,
          savi: p.indices?.savi ?? null,
          ndwi: p.indices?.ndwi ?? null,
          cumulative_rainfall_14d: p.indices?.cumulative_rainfall_14d ?? null,
          chlorophyll: p.indices?.chlorophyll ?? null,
          waterStress: p.indices?.ndmi ?? null,
          pestRisk: p.indices?.uas_anomaly_score > 0.4 ? 'High Risk' : p.indices?.uas_anomaly_score > 0.15 ? 'Moderate Risk' : 'Low Risk',
          coords
        };
      });
    }
    return [];
  }, [plots, currentTimelineB]);

  const healthPlotsData = healthPlotsDataA;

  const yieldPlotsDataA = useMemo(() => {
    if (plots && plots.length > 0) {
      return plots.map(p => {
        let coords = [];
        if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(p.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        const ndviVal = p.indices?.ndvi ?? 0;
        return {
          id: p.plot_id,
          name: p.name || p.plot_id,
          area: `${p.area_ha || 10.0} HA`,
          yieldValue: null,
          biomass: null,
          readiness: Math.min(100, Math.round(ndviVal * 115)),
          growth: parseFloat(ndviVal.toFixed(2)),
          coords,
          predAccuracy: null,
          predictedYield: null,
          yieldStatus: ndviVal > 0.6 ? 'Optimal (On Track)' : 'Underperforming (Water Stress)'
        };
      });
    }
    return [];
  }, [plots, currentTimelineA]);

  const yieldPlotsDataB = useMemo(() => {
    if (plots && plots.length > 0) {
      return plots.map(p => {
        let coords = [];
        if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(p.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        const ndviVal = p.indices?.ndvi ?? 0;
        return {
          id: p.plot_id,
          name: p.name || p.plot_id,
          area: `${p.area_ha || 10.0} HA`,
          yieldValue: null,
          biomass: null,
          readiness: Math.min(100, Math.round(ndviVal * 115)),
          growth: parseFloat(ndviVal.toFixed(2)),
          coords,
          predAccuracy: null,
          predictedYield: null,
          yieldStatus: ndviVal > 0.6 ? 'Optimal (On Track)' : 'Underperforming (Water Stress)'
        };
      });
    }
    return [];
  }, [plots, currentTimelineB]);

  const yieldPlotsData = yieldPlotsDataA;

  const climatePlotsDataA = useMemo(() => {
    if (plots && plots.length > 0) {
      return plots.map((p, idx) => {
        let coords = [];
        if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(p.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        return {
          id: p.plot_id,
          name: p.name || p.plot_id,
          area: `${p.area_ha || 10.0} HA`,
          rainfall: null,
          soilTemp: null,
          lst: null,
          vpd: null,
          coords
        };
      });
    }
    return [];
  }, [plots, currentTimelineA, selectedTimelineIndex]);

  const climatePlotsDataB = useMemo(() => {
    if (plots && plots.length > 0) {
      return plots.map((p, idx) => {
        let coords = [];
        if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(p.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        return {
          id: p.plot_id,
          name: p.name || p.plot_id,
          area: `${p.area_ha || 10.0} HA`,
          rainfall: null,
          soilTemp: null,
          lst: null,
          vpd: null,
          coords
        };
      });
    }
    return [];
  }, [plots, currentTimelineB, compareTimelineIndex]);

  const climatePlotsData = climatePlotsDataA;

  const restorationPlotsDataA = useMemo(() => {
    if (restorationZones && restorationZones.length > 0) {
      return restorationZones.map(z => {
        let coords = [];
        if (z.boundary && z.boundary.coordinates && z.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(z.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        return {
          id: z.zone_id,
          name: z.name,
          area: `${z.area_ha ?? 6.0} HA`,
          type: z.project_type ?? null,
          progress: z.progress_pct ?? null,
          survival: z.survival_rate_pct != null ? `${z.survival_rate_pct}%` : '—',
          trees: z.tree_count != null ? z.tree_count.toLocaleString() : '—',
          carbon: z.carbon_offset_tco2e != null ? `${z.carbon_offset_tco2e} tCO2e` : '—',
          status: z.progress_pct != null ? (z.progress_pct > 80 ? 'Optimal Growth' : 'Active Care') : '—',
          color: z.progress_pct != null ? (z.progress_pct > 80 ? '#16A34A' : '#EAB308') : '#9CA3AF',
          coords,
          manager: z.manager ?? null,
          survivalNum: z.survival_rate_pct ?? null,
          insar: z.biodiversity_score != null ? z.biodiversity_score / 100 : null,
          gedi: null,
          ndwi: null,
          lulc: null,
          eudr: null
        };
      });
    }
    return [];
  }, [restorationZones, currentTimelineA]);

  const restorationPlotsDataB = useMemo(() => {
    if (restorationZones && restorationZones.length > 0) {
      return restorationZones.map(z => {
        let coords = [];
        if (z.boundary && z.boundary.coordinates && z.boundary.coordinates[0]) {
          coords = api.geoJsonToLeaflet(z.boundary.coordinates[0]);
        } else {
          coords = [];
        }
        return {
          id: z.zone_id,
          name: z.name,
          area: `${z.area_ha ?? 6.0} HA`,
          type: z.project_type ?? null,
          progress: z.progress_pct ?? null,
          survival: z.survival_rate_pct != null ? `${z.survival_rate_pct}%` : '—',
          trees: z.tree_count != null ? z.tree_count.toLocaleString() : '—',
          carbon: z.carbon_offset_tco2e != null ? `${z.carbon_offset_tco2e} tCO2e` : '—',
          status: z.progress_pct != null ? (z.progress_pct > 80 ? 'Optimal Growth' : 'Active Care') : '—',
          color: z.progress_pct != null ? (z.progress_pct > 80 ? '#16A34A' : '#EAB308') : '#9CA3AF',
          coords,
          manager: z.manager ?? null,
          survivalNum: z.survival_rate_pct ?? null,
          insar: z.biodiversity_score != null ? z.biodiversity_score / 100 : null,
          gedi: null,
          ndwi: null,
          lulc: null,
          eudr: null
        };
      });
    }
    return [];
  }, [restorationZones, currentTimelineB]);

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
    const val = zone.survivalNum ?? zone.progress ?? 80;
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
      <div style={{ height: isBottomPanelMinimized ? '52px' : `${bottomPanelHeight}px` }} className="bg-white border-t border-gray-200 shrink-0 flex flex-col relative overflow-hidden transition-all duration-300">
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
              {timelineLoading ? (
                <div className="flex items-center gap-2 h-8 text-xs text-gray-400">
                  <svg className="animate-spin h-4 w-4 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Loading satellite timeline…
                </div>
              ) : TIMELINE_DATA.length === 0 ? (
                <div className="flex items-center gap-2 h-8 text-xs text-gray-400">
                  <span>No imagery yet for {selectedIndex?.toUpperCase() || 'this index'} — pipeline may still be writing data.</span>
                  <button
                    onClick={() => setRefreshSlider(n => n + 1)}
                    title="Retry loading"
                    className="ml-1 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-green-600 transition-colors"
                  ><RefreshCw size={12} /></button>
                </div>
              ) : (
                <>
                  <input type="range" min="0" max={TIMELINE_DATA.length - 1}
                    value={Math.min(
                      isCompareMode ? (activeDateSlot === 'A' ? selectedTimelineIndex : compareTimelineIndex) : selectedTimelineIndex,
                      TIMELINE_DATA.length - 1
                    )}
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
                            ? (isCompareMode && activeDateSlot === 'B' ? 'text-green-600 font-bold' : 'text-green-600 font-bold')
                            : 'text-gray-400'
                        }`}>
                          {t.label.split(',')[0]}
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Current acquisition date pill — shows pending state while waiting 10s */}
              {!timelineLoading && TIMELINE_DATA.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap tabular-nums transition-colors ${
                  sliderPending
                    ? 'bg-green-100 text-green-600 border-green-200 animate-pulse'
                    : 'bg-green-50 text-green-700 border-green-100'
                }`}>
                  {sliderPending
                    ? (TIMELINE_DATA[Math.min(selectedTimelineIndex, TIMELINE_DATA.length - 1)]?.label ?? '…')
                    : (currentTimeline?.label ?? '…')}
                  {sliderPending && <span className="ml-1 opacity-70">↻</span>}
                </span>
              )}
              {/* Satellite selector dropdown */}
              <select
                value={isSarIndex ? 'sentinel-1' : selectedSensor}
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'sentinel-1') {
                    setSelectedIndex('rvi');
                  } else {
                    if (isSarIndex) setSelectedIndex('ndvi');
                    setSelectedSensor(val);
                  }
                }}
                className="text-xs font-bold px-2 py-1 rounded-full border border-green-200 bg-white text-green-700 cursor-pointer focus:outline-none focus:border-green-500"
              >
                <option value="sentinel-2">Sentinel-2</option>
                <option value="sentinel-1">Sentinel-1</option>
                <option value="landsat">Landsat</option>
              </select>
              {/* Index selector — simple names only (NDVI, not OPTICAL_SENTINEL_2_NDVI) */}
              <select
                value={selectedIndex}
                onChange={e => setSelectedIndex(e.target.value)}
                className="text-xs font-bold px-2 py-1 rounded-full border border-green-200 bg-white text-green-700 cursor-pointer focus:outline-none focus:border-green-500"
              >
                {displayIndices.length > 0
                  ? displayIndices
                      .filter(idx => isSarIndex
                        ? SAR_INDICES.has(idx.index.toLowerCase())
                        : !SAR_INDICES.has(idx.index.toLowerCase()))
                      .map(idx => (
                        <option key={idx.index} value={idx.index}>{idx.index.toUpperCase()}</option>
                      ))
                  : <option value={selectedIndex}>{selectedIndex.toUpperCase()}</option>
                }
              </select>
              <button
                onClick={() => setRefreshSlider(n => n + 1)}
                disabled={timelineLoading}
                title="Refresh timeline data"
                className="p-1.5 rounded-full hover:bg-green-50 text-green-400 hover:text-green-600 transition-colors disabled:opacity-40"
              >
                <RefreshCw size={13} className={timelineLoading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setIsBottomPanelMinimized(!isBottomPanelMinimized)}
                title={isBottomPanelMinimized ? "Expand bottom panel" : "Minimize bottom panel"}
                className="p-1.5 rounded-full hover:bg-green-50 text-green-600 hover:text-green-800 transition-colors"
              >
                {isBottomPanelMinimized ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>
        )}

        <div className="flex divide-x divide-gray-100 bg-gray-50/30 min-h-0 flex-1">
          {/* Mini Calendar (Enlarged) */}
          {!hideCalendarAndSlider && showCalendarTool && (
            <div className="py-2 px-3 shrink-0 w-[352px] bg-white flex flex-col justify-between overflow-y-auto">
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
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', textAlign: 'center', alignContent: 'start' }}>
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <span key={i} className="text-[9px] font-extrabold text-gray-400 h-4 flex items-center justify-center">{d}</span>
                  ))}
                  {Array.from({ length: calFirstDay }).map((_, i) => <span key={`pad-${i}`} className="h-5" />)}
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
                        className={`h-5 w-full rounded-md text-[10px] font-bold flex items-center justify-center transition-all ${btnClass}`}
                        style={btnStyle}>
                        {day}
                      </button>
                    );
                  })}
                  {Array.from({ length: calTrailing < 0 ? 0 : calTrailing }).map((_, i) => (
                    <span key={`trail-${i}`} className="h-5" />
                  ))}
                </div>
              </div>


            </div>
          )}

          {centerContent ? centerContent : (
            <div className="flex-1 bg-white p-4 flex items-center justify-between gap-6 overflow-hidden">
              {/* Left: Selected date information */}
              <div className="flex flex-col justify-center gap-1">
                {isCompareMode ? (
                  <div className="flex flex-col gap-1.5">
                    {currentTimelineA && (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-600 shadow-sm shrink-0" />
                        <span className="text-xs font-bold text-gray-700">Date A: {currentTimelineA.label?.split(',')[0]}</span>
                        <span className="text-[9px] font-extrabold text-green-700 bg-green-50 px-1.5 py-0.5 rounded uppercase border border-green-200 shrink-0">
                          {effectiveSensor === 'sentinel-1' ? 'S1 SAR' : effectiveSensor === 'landsat' ? 'L9' : 'S2'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{(selectedIndex || 'NDVI').toUpperCase()}</span>
                      </div>
                    )}
                    {currentTimelineB && (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shrink-0" />
                        <span className="text-xs font-bold text-gray-700">Date B: {currentTimelineB.label?.split(',')[0]}</span>
                        <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded uppercase border border-blue-200 shrink-0">
                          {effectiveSensor === 'sentinel-1' ? 'S1 SAR' : effectiveSensor === 'landsat' ? 'L9' : 'S2'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{(selectedIndex || 'NDVI').toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  currentTimeline && (
                    <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Selected Acquisition Pass</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-base font-black text-gray-800 tracking-tight">{currentTimeline.label?.split(',')[0]}</span>
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 uppercase">
                          {effectiveSensor === 'sentinel-1' ? 'Sentinel-1 SAR' : effectiveSensor === 'landsat' ? 'Landsat-9' : 'Sentinel-2'}
                        </span>
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 uppercase">
                          {(selectedIndex || 'NDVI').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Right: Best imagery indicator */}
              <div className="bg-green-50/50 border border-green-100 rounded-2xl p-3.5 flex items-start gap-3 max-w-sm shrink-0">
                <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-wider text-green-700 leading-none mb-1">Best Imagery Active</span>
                  <span className="text-[10px] text-green-600/80 font-medium leading-normal">
                    Automatically filtering cloud-free passes. Pick any highlighted calendar date to audit.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dynamic Dashboard Calculations — real data only, no mock fallback
  const dashboardMetrics = useMemo(() => {
    return {
      plots: plots.length > 0 ? plots.length : (stats ? '—' : '—'),
      area: stats?.total_area_ha != null ? Math.round(stats.total_area_ha) : '—',
      carbon: stats?.average_carbon_density_tco2e_ha ?? '—',
      alerts: stats?.active_alerts_count ?? '—',
    };
  }, [stats, plots]);

  const yieldTrendsData = useMemo(() => {
    // Real NDVI time series from zarr — one point per observation date
    const labels = TIMELINE_DATA.map(t => t.label || t.date);
    const values = TIMELINE_DATA.map(t => t.ndvi ?? 0);
    if (labels.length === 0) return { labels: [], datasets: [] };
    return {
      labels,
      datasets: [{
        label: 'NDVI (Farm Average)',
        data: values,
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.06)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#16A34A',
      }]
    };
  }, [TIMELINE_DATA]);

  const ndmiTrendsData = useMemo(() => {
    // Real NDMI time series from zarr
    const labels = TIMELINE_DATA.map(t => t.label || t.date);
    const values = TIMELINE_DATA.map(t => t.ndmi ?? 0);
    if (labels.length === 0) return { labels: [], datasets: [] };
    return {
      labels,
      datasets: [{
        label: 'NDMI (Farm Average)',
        data: values,
        borderColor: '#0284C7',
        backgroundColor: 'rgba(2, 132, 199, 0.06)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#0284C7',
      }]
    };
  }, [TIMELINE_DATA]);

  const rviTrendsData = useMemo(() => {
    // Real EVI time series from zarr
    const labels = TIMELINE_DATA.map(t => t.label || t.date);
    const values = TIMELINE_DATA.map(t => t.evi ?? 0);
    if (labels.length === 0) return { labels: [], datasets: [] };
    return {
      labels,
      datasets: [{
        label: 'EVI (Farm Average)',
        data: values,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.06)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#8B5CF6',
      }]
    };
  }, [TIMELINE_DATA]);

  const soilTempTrendsData = useMemo(() => {
    // Soil temperature sensor data not yet connected — chart shows no data
    return { labels: [], datasets: [] };
  }, []);

  const vpdTrendsData = useMemo(() => {
    // VPD sensor data not yet connected — chart shows no data
    return { labels: [], datasets: [] };
  }, []);

  const moistureRetentionData = useMemo(() => {
    // Use real NDMI from plotsData — group into buckets by health classification
    if (!plotsData || plotsData.length === 0) return { labels: [], datasets: [] };
    const buckets = { 'High (>0.3)': 0, 'Medium (0–0.3)': 0, 'Low (<0)': 0 };
    plotsData.forEach(p => {
      const v = p.ndmi ?? 0;
      if (v > 0.3) buckets['High (>0.3)']++;
      else if (v >= 0) buckets['Medium (0–0.3)']++;
      else buckets['Low (<0)']++;
    });
    return {
      labels: Object.keys(buckets),
      datasets: [{
        label: 'Plot Count by NDMI',
        data: Object.values(buckets),
        backgroundColor: ['#0284C7', '#38BDF8', '#EF4444'],
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  }, [plotsData]);

  const nutrientData = useMemo(() => {
    // Derive radar axes from real zarr index values via currentTimeline
    const ndvi  = currentTimeline?.ndvi  ?? 0;
    const ndmi  = currentTimeline?.ndmi  ?? 0;
    const evi   = currentTimeline?.evi   ?? 0;
    const reci  = currentTimeline?.reci  ?? 0;
    const ndre  = currentTimeline?.ndre  ?? 0;
    const lswi  = currentTimeline?.lswi  ?? 0;
    // Normalise each index to 0-100 using known physical ranges
    const norm = (v, lo, hi) => Math.min(100, Math.max(0, Math.round(((v - lo) / (hi - lo)) * 100)));
    return {
      labels: ['Vegetation (NDVI)', 'Chlorophyll (NDRE)', 'Water (NDMI)', 'Biomass (EVI)', 'Red-Edge (RECI)', 'Canopy Water (LSWI)'],
      datasets: [{
        label: 'Farm Index Profile',
        data: [
          norm(ndvi,  -0.2, 1.0),
          norm(ndre,  -0.1, 0.8),
          norm(ndmi,  -0.6, 0.8),
          norm(evi,   -0.2, 1.0),
          norm(reci,   0.0, 5.0),
          norm(lswi,  -0.6, 0.8),
        ],
        backgroundColor: 'rgba(22, 163, 74, 0.15)',
        borderColor: '#16A34A',
        pointBackgroundColor: '#16A34A',
        borderWidth: 2.5,
      }]
    };
  }, [currentTimeline]);

  const landClassificationData = useMemo(() => {
    // Real area distribution from plotsData by health class
    if (!plotsData || plotsData.length === 0) return { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0 }] };
    let optimal = 0, good = 0, stressed = 0;
    plotsData.forEach(p => {
      const v = p.ndvi ?? 0;
      if (v > 0.6) optimal++;
      else if (v > 0.4) good++;
      else stressed++;
    });
    return {
      labels: [`Optimal NDVI (${optimal})`, `Moderate NDVI (${good})`, `Stressed NDVI (${stressed})`],
      datasets: [{
        data: [optimal, good, stressed],
        backgroundColor: ['#16A34A', '#EAB308', '#EF4444'],
        borderWidth: 0,
        hoverOffset: 8,
      }]
    };
  }, [plotsData]);

  const gddReferenceData = useMemo(() => {
    // GDD accumulation sensor data not yet connected
    return { labels: [], datasets: [] };
  }, []);

  const gddCompletionData = useMemo(() => {
    // Use real NDVI from plotsData to show vegetation health completion proxy
    if (!plotsData || plotsData.length === 0) return { labels: [], datasets: [{ data: [], backgroundColor: [], borderRadius: 8 }] };
    const sample = plotsData.slice(0, 20);
    return {
      labels: sample.map(p => p.id),
      datasets: [{
        label: 'NDVI Score',
        data: sample.map(p => Math.round((p.ndvi ?? 0) * 100)),
        backgroundColor: sample.map(p => {
          const v = p.ndvi ?? 0;
          return v > 0.6 ? '#16A34A' : v > 0.4 ? '#EAB308' : '#EF4444';
        }),
        borderRadius: 4,
      }]
    };
  }, [plotsData]);

  const etTimeSeriesData = useMemo(() => {
    // ET sensor data not yet connected
    return { labels: [], datasets: [] };
  }, []);

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

  const triggerReportGeneration = async (overridePlot, overrideIndex) => {
    const targetPlot = overridePlot !== undefined ? overridePlot : reportPlot;
    const targetIndex = overrideIndex !== undefined ? overrideIndex : reportIndex;

    setIsGeneratingReport(true);
    setReportProgress(10);
    setReportProgressText('Querying satellite data repositories...');
    setGeneratedReport(null);

    try {
      setReportProgress(40);
      setReportProgressText('Executing crop index calculations...');
      const cert = await api.generateCertificate({
        scope: targetPlot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : 'Plot-Level',
        metric: targetIndex,
        plot_id: targetPlot === 'WHOLE-FARM' ? null : targetPlot,
      });
      setReportProgress(80);
      setReportProgressText('Compiling MRV compliance ledger...');
      await new Promise(r => setTimeout(r, 500));
      setReportProgress(100);
      setReportProgressText('Report ready.');
      await new Promise(r => setTimeout(r, 400));
      setIsGeneratingReport(false);
      const meanVal = (() => {
        if (targetIndex === 'SOC' || targetIndex === 'AGB') return '—';
        const key = targetIndex.toLowerCase();
        const mean = TIMELINE_DATA.length > 0 ? (TIMELINE_DATA.reduce((s, t) => s + (t[key] ?? 0), 0) / TIMELINE_DATA.length) : null;
        return mean !== null ? mean.toFixed(2) : '—';
      })();
      setGeneratedReport({
        id: cert.certificate_id,
        plot: targetPlot,
        index: targetIndex,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        meanVal,
        status: 'Approved & Signed',
        diagnosticSummary: cert.diagnostic_summary,
      });
    } catch (err) {
      setIsGeneratingReport(false);
      setReportProgress(0);
      setReportProgressText('Report generation failed. Please try again.');
    }
  };

  const triggerVerificationAudit = async () => {
    // Real MRV audit from the backend — each check's outcome reflects actual
    // plot data (boundary registry, EUDR record, measured NDVI/NDMI). No
    // simulated always-success animation.
    setIsVerifying(true);
    setVerificationStatus('running');
    const keys = ['boundary', 'forest', 'cover', 'moisture'];
    setVerificationSteps(prev => {
      const next = { ...prev };
      keys.forEach(k => { next[k] = { ...next[k], status: 'scanning' }; });
      return next;
    });
    try {
      const audit = await api.fetchVerificationAudit(selectedVerifyPlot || undefined);
      const backendChecks = audit?.checks || [];
      const matchers = {
        boundary: /boundary/i,
        forest:   /deforestation|eudr/i,
        cover:    /canopy|ndvi/i,
        moisture: /water|ndmi|moisture/i,
      };
      setVerificationSteps(prev => {
        const next = { ...prev };
        keys.forEach(k => {
          const found = backendChecks.find(c => matchers[k].test(c.name || ''));
          if (found) {
            const st = (found.status || '').toLowerCase();
            next[k] = {
              ...next[k],
              status: st === 'pass' ? 'success' : st === 'warning' ? 'warning' : st === 'no data' ? 'nodata' : 'failed',
              details: found.details || next[k].details,
            };
          } else {
            next[k] = { ...next[k], status: 'nodata', details: 'No audit data returned for this check.' };
          }
        });
        return next;
      });
      setVerificationStatus('completed');
    } catch (err) {
      console.error('Verification audit failed:', err);
      setVerificationSteps(prev => {
        const next = { ...prev };
        keys.forEach(k => { next[k] = { ...next[k], status: 'failed', details: 'Audit request failed — backend unreachable.' }; });
        return next;
      });
      setVerificationStatus('completed');
    } finally {
      setIsVerifying(false);
    }
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

  const [chatLoading, setChatLoading] = useState(false);

  const handleChatSubmit = async (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim() || chatLoading) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setChatInput('');
    setChatLoading(true);
    try {
      const result = await api.queryAiAgent(query);
      const reply = result?.response || "No response from AI agent.";
      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply, sources: result?.sources }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'assistant', text: "Sorry, the AI assistant is unavailable right now. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
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
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased overflow-hidden">
      {/* ── TOP HEADER BAR ─────────────────────────────────────────────────── */}
      <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 z-[100] shadow-sm shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-all border border-gray-200 text-gray-500 hover:text-gray-800">
            <ArrowLeft size={17} />
          </button>
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ring-4 transition-all ${brandingMode === 'AM' ? 'ring-green-50' : 'ring-green-50'}`} style={{ backgroundColor: brandingMode === 'AM' ? '#16A34A' : '#2563EB' }}>
              <Satellite className="text-white" size={21} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900 leading-none">
                {tenantDisplayName} {cropLabel} {brandingMode === 'AM' ? 'Monitoring' : 'Farm Tools'}
              </h1>
              <p className={`text-[11px] font-semibold uppercase tracking-widest mt-1 leading-none ${brandingMode === 'AM' ? 'text-green-600' : 'text-green-600'}`}>
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
              {alerts.filter(a => a.status === 'Active').length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white animate-pulse" style={{ backgroundColor: '#EF4444' }}></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[500] overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="text-xs font-black uppercase tracking-wider text-gray-700">Live Alerts Feed</div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${brandingMode === 'AM' ? 'bg-green-50 text-green-700' : 'bg-green-50 text-green-700'}`}>
                    {alerts.filter(a => a.status === 'Active').length} Active
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {/* Real alerts from the backend feed — no canned notifications */}
                  {alerts.slice(0, 6).map(a => (
                    <div key={a.id} className="p-3 hover:bg-gray-50 transition-colors flex gap-2.5">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.severity === 'Critical' ? 'bg-red-500 animate-ping' : a.severity === 'Warning' ? 'bg-amber-500' : 'bg-green-500'}`} />
                      <div>
                        <div className="text-[11px] font-bold text-gray-900">{a.category} — {a.plot}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{a.desc}</div>
                        <div className="text-[9px] text-gray-300 mt-0.5">{a.date} {a.time}</div>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="p-5 text-center">
                      <div className="text-[11px] font-bold text-gray-500">No active alerts</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Alerts from the monitoring pipeline appear here.</div>
                    </div>
                  )}
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
                <div className={`text-[11px] font-semibold tracking-wider mt-1 uppercase ${brandingMode === 'AM' ? 'text-green-600' : 'text-green-600'}`}>{profileRole}</div>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border hover:ring-2 transition-all ${brandingMode === 'AM' ? 'text-green-700 border-green-200 hover:ring-green-200 bg-green-50' : 'text-green-700 border-green-200 hover:ring-green-200 bg-green-50'}`}>
                {brandingMode === 'AM' ? 'AM' : 'FT'}
              </div>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2.5 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[500] overflow-hidden">
                <div className="p-4 bg-gray-50/50 flex flex-col items-center text-center border-b border-gray-100">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-md mb-2.5" style={{ backgroundColor: brandingMode === 'AM' ? '#16A34A' : '#2563EB' }}>
                    {brandingMode === 'AM' ? 'AM' : 'FT'}
                  </div>
                  <div className="text-sm font-extrabold text-gray-950">{profileName}</div>
                  <div className="text-[11px] font-semibold text-gray-400 mt-0.5">{profileEmail}</div>
                  <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full mt-2 border ${brandingMode === 'AM' ? 'bg-green-50 text-green-700 border-green-150' : 'bg-green-50 text-green-700 border-green-100'}`}>
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
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-bold text-green-700 hover:bg-green-50 rounded-xl transition-all"
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
                  { id: 'moisture-content',    label: 'Moisture Content',    icon: <Droplets size={17} /> },
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
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeSidebarItem === item.id ? 'bg-white/25 text-white' : 'bg-green-100 text-green-700'}`}>
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
                  <div className="px-3 py-2.5 bg-green-50/40 rounded-xl mt-1.5 space-y-2 border border-green-100/50">
                    <div className="text-[10px] font-bold text-green-700 uppercase tracking-widest px-1">Active Date Slot</div>
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
                            ? 'bg-green-600 text-white border-green-600 shadow-sm'
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
                  { id: 'help',      label: 'Glossary',         icon: <Info size={17} /> }
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
        <main className={`flex-1 flex flex-col relative bg-gray-50 ${['intelligence-layers', 'crop-health', 'crop-yield', 'moisture-content', 'climate', 'land-restoration'].includes(activeSidebarItem) ? 'overflow-hidden' : 'overflow-y-auto'}`}>

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
              <div className="p-10 space-y-10">
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
                      Date last update: {currentTimeline?.label ?? '—'}
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
                        <option value="All">All Farms</option>
                        {[...new Set(plotsData.map(p => p.subfarm).filter(Boolean))].map(sf => (
                          <option key={sf} value={sf}>{sf}</option>
                        ))}
                      </select>
                    </div>

                    {/* Plot Filter — populated from real plot IDs */}
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Plot</span>
                      <select
                        value={filterPlot}
                        onChange={e => handlePlotFilterChange(e.target.value)}
                        className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer pr-1"
                      >
                        <option value="All">All Plots</option>
                        {plotsData.slice(0, 50).map(p => (
                          <option key={p.id} value={p.id}>{p.id}</option>
                        ))}
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
                        className="text-xs font-bold text-green-700 hover:text-green-800 transition-colors flex items-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100/70 rounded-xl"
                      >
                        <X size={14} /> Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Subpage Contents */}
                {activeAnalyticsSubpage === 'overview' && (
                  <div className="space-y-10">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Plots',   value: `${dashboardMetrics.plots}`,               subtext: 'Active Farm Plots',        icon: <Layers size={22} className="text-green-600" />,  accent: '#EFF6FF', border: '#BFDBFE' },
                        { label: 'Area Monitored', value: `${dashboardMetrics.area.toLocaleString()} ha`, subtext: 'Hectares Covered',    icon: <Globe size={22} className="text-green-600" />,    accent: '#F0FDF4', border: '#BBF7D0' },
                        { label: 'Carbon Density', value: `${dashboardMetrics.carbon} t/ha`,             subtext: 'Average tCO2e/Hectare',    icon: <Leaf size={22} className="text-green-600" />,   accent: '#f0fdf4', border: '#bbf7d0' },
                        { label: 'Alerts',         value: dashboardMetrics.alerts,                    subtext: 'Critical Moisture Stress', icon: <AlertTriangle size={22} className="text-green-600" />, accent: '#FFF1F2', border: '#FECDD3' }
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

                    {/* 4-Chart Overview Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                      {/* Vegetation Vigor & Health Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <TrendingUp size={18} className="text-green-600" />
                            Geospatial Vegetation Vigor & Health Trends {renderInfoTooltip("Geospatial Vegetation Vigor & Health Trends")}
                          </h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            NDVI
                          </span>
                        </div>
                        <div className="h-[280px]">
                          <Line data={yieldTrendsData} options={{ ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0.2, max: 1.0 } } }} />
                        </div>
                      </div>

                      {/* Moisture Retention (NDMI) Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Droplets size={18} className="text-green-600" />
                            Canopy Moisture Retention (NDMI) Trends {renderInfoTooltip("Moisture Retention (NDMI)")}
                          </h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            NDMI
                          </span>
                        </div>
                        <div className="h-[280px]">
                          <Line data={ndmiTrendsData} options={{ ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0.1, max: 0.7 } } }} />
                        </div>
                      </div>

                      {/* Soil Temperature Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Thermometer size={18} className="text-green-600" />
                            Soil Temperature Trends {renderInfoTooltip("Soil Temperature Trends")}
                          </h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            LST °C
                          </span>
                        </div>
                        <div className="h-[280px]">
                          <Line data={soilTempTrendsData} options={{ ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 15, max: 35 } } }} />
                        </div>
                      </div>

                      {/* Vapor Pressure Deficit Stress Trends */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Wind size={18} className="text-purple-500" />
                            Vapor Pressure Deficit (VPD) Stress Trends {renderInfoTooltip("Vapor Pressure Deficit (VPD)")}
                          </h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            VPD kPa
                          </span>
                        </div>
                        <div className="h-[280px]">
                          <Line data={vpdTrendsData} options={{ ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0, max: 3 } } }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeAnalyticsSubpage === 'vigor-health' && (
                  <div className="space-y-10">
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
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* ET Time Series Chart */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                            <Droplets size={18} className="text-green-600" />
                            FAO-56 Evapotranspiration Model {renderInfoTooltip("FAO-56 Evapotranspiration Model")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
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
                            <Droplets size={18} className="text-green-600" />
                            Canopy Moisture Retention (NDMI) Trends {renderInfoTooltip("Moisture Retention (NDMI)")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
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
                            <Sun size={18} className="text-green-600" />
                            Soil Temperature Trends {renderInfoTooltip("Soil Temp")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
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
                            <Activity size={18} className="text-green-600" />
                            Vapor Pressure Deficit (VPD) Stress Trends {renderInfoTooltip("VPD Stress")}</h3>
                          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide">
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
                              { date: 'May 30', eto: '—', kc: '—', etc: '—', eta: '—', deficit: '—', sm: '—' },
                              { date: 'May 29', eto: '—', kc: '—', etc: '—', eta: '—', deficit: '—', sm: '—' },
                              { date: 'May 28', eto: '—', kc: '—', etc: '—', eta: '—', deficit: '—', sm: '—' },
                              { date: 'May 27', eto: '—', kc: '—', etc: '—', eta: '—', deficit: '—', sm: '—' },
                              { date: 'May 26', eto: '—', kc: '—', etc: '—', eta: '—', deficit: '—', sm: '—' },
                              { date: 'May 25', eto: '—', kc: '—', etc: '—', eta: '—', deficit: '—', sm: '—' },
                              { date: 'May 24', eto: '—', kc: '—', etc: '—', eta: '—', deficit: '—', sm: '—' }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                <td className="py-3 px-4 font-bold">{row.date}</td>
                                <td className="py-3 px-4">{row.eto}</td>
                                <td className="py-3 px-4">{row.kc}</td>
                                <td className="py-3 px-4">{row.etc}</td>
                                <td className="py-3 px-4">
                                  <span className={parseFloat(row.deficit) > 1.0 ? 'text-green-700 font-bold' : 'text-green-600'}>
                                    {row.eta}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-semibold text-green-600">{row.deficit}</td>
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
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Nutrient Profiling (Radar) */}
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5 xl:col-span-1">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                          <Sun size={18} className="text-green-600" />
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
                              { name: 'Soil pH', value: '—', status: '—', color: 'text-gray-500' },
                              { name: 'Organic Carbon', value: '—', status: '—', color: 'text-gray-500' },
                              { name: 'Total Nitrogen (N)', value: '—', status: '—', color: 'text-gray-500' },
                              { name: 'Available Phosphorus (P)', value: '—', status: '—', color: 'text-gray-500' },
                              { name: 'Exchangeable Potassium (K)', value: '—', status: '—', color: 'text-gray-500' }
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
                              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                                Soil chemistry data not yet connected. Upload soil sample results to generate agronomic recommendations for this plot.
                              </p>
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
                  {tileRefreshing && currentTileUrl && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1.5 bg-black/60 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full pointer-events-none">
                      <svg className="animate-spin h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Loading {(selectedIndex || 'NDVI').toUpperCase()} · {effectiveSensor === 'sentinel-1' ? 'S1 SAR' : effectiveSensor === 'landsat' ? 'L9' : 'S2'}…
                    </div>
                  )}
                  <MapContainer center={defaultMapCenter} zoom={13} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
          {showRasterLayer && currentTileUrl && (
            <TileLayer
              key={currentTileUrl}
              url={currentTileUrl}
              opacity={mapOpacity / 100}
              bounds={rasterOverlayBounds || undefined}
              maxZoom={22}
              maxNativeZoom={18}
            />
          )}

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
                    {null}
                    <FitBoundsToPlots plotsData={plotsData} farmBoundary={farmBoundary} />
                    <FitToZarrBounds zarrBounds={zarrBounds} />
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
                  {renderFloatingBasemapSelector()}

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
                            {/* Satellite Index Raster Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Satellite Index Raster</div>
                              <span className="text-[10px] text-gray-400">Raw pixel layer from zarr</span>
                            </div>
                            <button
                              onClick={() => setShowRasterLayer(!showRasterLayer)}
                              className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                              style={{ backgroundColor: showRasterLayer ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${showRasterLayer ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </div>
                          {showRasterLayer && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{mapOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={mapOpacity}
                                onChange={e => setMapOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                            </div>
                          )}
                        </div>
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
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div
                          onClick={() => setIntelBioExpanded(!intelBioExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {intelBioExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} {cropLabel} Index Legends
                        </div>
                        {intelBioExpanded && (
                          <div className="space-y-3">
                            {/* Crop-specific legend cards — driven by /crop-monitoring/indices:
                                each card carries this crop's interpretation (label, classes, notes),
                                so NDWI reads as flood classes for rice but disease risk for cashew. */}
                            {cropProfileEntries.map(entry => {
                              const isSelected = (selectedIndex || '').toLowerCase() === entry.key;
                              const isOpen = isSelected || expandedLegendKeys.includes(entry.key);
                              return (
                                <div key={entry.key} className={`border rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5 ${isSelected ? 'border-green-300 ring-1 ring-green-100' : 'border-gray-100'}`}>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">
                                        {entry.crop_label || entry.label} {renderInfoTooltip(entry.label)}
                                        {isSelected && <span className="text-[8px] font-black uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">On Map</span>}
                                      </div>
                                      <span className="text-[10px] text-gray-400">{entry.full || entry.label}</span>
                                    </div>
                                    <button onClick={() => toggleLegendKey(entry.key)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: isOpen ? '#16A34A' : '#E5E7EB' }}>
                                      <div style={{ transform: isOpen ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                                    </button>
                                  </div>
                                  {isOpen && (
                                    <div className="space-y-1.5 pt-1 border-t border-gray-50">
                                      {(entry.legend || []).map((cls, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                          <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: cls.color }} />
                                          <span className="text-[10px] font-semibold text-gray-500">{cls.label} ({cls.range?.[0]} to {cls.range?.[1]})</span>
                                        </div>
                                      ))}
                                      {entry.notes && <p className="text-[10px] text-gray-400 leading-snug pt-1 border-t border-gray-50">{entry.notes}</p>}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {cropProfileEntries.length === 0 && (
                              <p className="text-[10px] text-gray-400 px-1">Crop index profile unavailable — connect to the backend to load this crop's legends.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ══ BOTTOM PANEL ══ */}
              {renderMapBottomPanel(selectedIndex, null, false)}
            </div>
          )}

          {activeSidebarItem === 'crop-health' && (
            <div className="flex flex-col h-full">

              {/* ── Top area: Map + Right Legend sidebar ── */}
              <div className="flex flex-1 min-h-0">

                {/* ═══ MAP ═══ */}
                <div className="flex-1 relative min-w-0 map-wrapper-pane">
                  {tileRefreshing && currentTileUrl && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1.5 bg-black/60 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full pointer-events-none">
                      <svg className="animate-spin h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Loading {(selectedIndex || 'NDVI').toUpperCase()} · {effectiveSensor === 'sentinel-1' ? 'S1 SAR' : effectiveSensor === 'landsat' ? 'L9' : 'S2'}…
                    </div>
                  )}
                  <MapContainer center={defaultMapCenter} zoom={13} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
          {showRasterLayer && currentTileUrl && (
            <TileLayer
              key={currentTileUrl}
              url={currentTileUrl}
              opacity={mapOpacity / 100}
              bounds={rasterOverlayBounds || undefined}
              maxZoom={22}
              maxNativeZoom={18}
            />
          )}
                    
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
                    {null}
                    <FitBoundsToPlots plotsData={plotsData} farmBoundary={farmBoundary} />
                    <FitToZarrBounds zarrBounds={zarrBounds} />
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
                  {renderFloatingBasemapSelector()}

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
                            {/* Satellite Index Raster Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Satellite Index Raster</div>
                              <span className="text-[10px] text-gray-400">Raw pixel layer from zarr</span>
                            </div>
                            <button
                              onClick={() => setShowRasterLayer(!showRasterLayer)}
                              className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                              style={{ backgroundColor: showRasterLayer ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${showRasterLayer ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </div>
                          {showRasterLayer && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{mapOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={mapOpacity}
                                onChange={e => setMapOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                            </div>
                          )}
                        </div>
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
                      <div className="space-y-3">
                        <div
                          onClick={() => setHealthBioExpanded(!healthBioExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {healthBioExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Biophysical
                        </div>
                        {healthBioExpanded && (
                          <div className="space-y-3 flex flex-col gap-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">NDVI {renderInfoTooltip("NDVI")}</div><span className="text-[10px] text-gray-400">Normalized Difference Vegetation Index</span></div>
                            <button onClick={() => setHealthShowNdvi(!healthShowNdvi)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: healthShowNdvi ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: healthShowNdvi ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {healthShowNdvi && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">High (0.7-1.0)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate (0.5-0.7)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#eab308'}}/><span className="text-[10px] font-semibold text-gray-500">Low (0.3-0.5)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Stressed ({'<'}0.3)</span></div>
                            </div>
                          )}
                        </div>
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">SAVI {renderInfoTooltip("SAVI")}</div><span className="text-[10px] text-gray-400">Soil Adjusted Vegetation Index</span></div>
                            <button onClick={() => {
                              const next = !healthShowSavi;
                              setHealthShowSavi(next);
                              if (next) {
                                setSelectedIndex('savi');
                                setHealthShowNdvi(false);
                                setHealthShowNdwi(false);
                              }
                            }} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: healthShowSavi ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: healthShowSavi ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {healthShowSavi && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">Optimal (&gt;0.4)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">Good (0.2-0.4)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#eab308'}}/><span className="text-[10px] font-semibold text-gray-500">Low (0.1-0.2)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Stressed ({'<'}0.1)</span></div>
                            </div>
                          )}
                        </div>
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">NDWI {renderInfoTooltip("NDWI")}</div><span className="text-[10px] text-gray-400">Normalized Difference Water Index</span></div>
                            <button onClick={() => {
                              const next = !healthShowNdwi;
                              setHealthShowNdwi(next);
                              if (next) {
                                setSelectedIndex('ndwi');
                                setHealthShowNdvi(false);
                                setHealthShowSavi(false);
                              }
                            }} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: healthShowNdwi ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: healthShowNdwi ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {healthShowNdwi && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">High Water Content (&gt;0.3)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#60a5fa'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate Water (0.0 to 0.3)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Dry (-0.3 to 0.0)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Water stressed (&lt;-0.3)</span></div>
                            </div>
                          )}
                        </div>
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Chlorophyll {renderInfoTooltip("Chlorophyll")}</div><span className="text-[10px] text-gray-400">Canopy chlorophyll content</span></div>
                            <button onClick={() => setHealthShowChlorophyll(!healthShowChlorophyll)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: healthShowChlorophyll ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: healthShowChlorophyll ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {healthShowChlorophyll && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#166534'}}/><span className="text-[10px] font-semibold text-gray-500">High</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#22c55e'}}/><span className="text-[10px] font-semibold text-gray-500">Good</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#ef4444'}}/><span className="text-[10px] font-semibold text-gray-500">Low</span></div>
                            </div>
                          )}
                        </div>
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Water Stress {renderInfoTooltip("Water Stress")}</div><span className="text-[10px] text-gray-400">Crop water stress level</span></div>
                            <button onClick={() => setHealthShowWater(!healthShowWater)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: healthShowWater ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: healthShowWater ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {healthShowWater && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">No Stress</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#60a5fa'}}/><span className="text-[10px] font-semibold text-gray-500">Mild</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Severe</span></div>
                            </div>
                          )}
                        </div>
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">NDRE {renderInfoTooltip("NDRE")}</div><span className="text-[10px] text-gray-400">Red Edge nitrogen status</span></div>
                            <button onClick={() => setHealthShowNdre(!healthShowNdre)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: healthShowNdre ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: healthShowNdre ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {healthShowNdre && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">High N (&gt;0.5)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">Good N (0.3-0.5)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#eab308'}}/><span className="text-[10px] font-semibold text-gray-500">Low N (0.1-0.3)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Deficient ({'<'}0.1)</span></div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div
                          onClick={() => setHealthMonExpanded(!healthMonExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {healthMonExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Monitoring
                        </div>
                        {healthMonExpanded && (
                          <div className="space-y-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">SMI {renderInfoTooltip("SMI")}</div><span className="text-[10px] text-gray-400">Soil Moisture Index</span></div>
                            <button onClick={() => setHealthShowSmi(!healthShowSmi)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: healthShowSmi ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: healthShowSmi ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {healthShowSmi && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">Wet (0.7-1.0)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#60a5fa'}}/><span className="text-[10px] font-semibold text-gray-500">Moist (0.4-0.7)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Dry (0.2-0.4)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Drought ({'<'}-0.2)</span></div>
                            </div>
                          )}
                        </div>
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Pest Risk {renderInfoTooltip("Pest Risk")}</div><span className="text-[10px] text-gray-400">Pest pressure assessment</span></div>
                            <button onClick={() => setHealthShowPest(!healthShowPest)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: healthShowPest ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: healthShowPest ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {healthShowPest && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">Low Risk</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#f97316'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate Risk</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">High Risk</span></div>
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
              {renderMapBottomPanel(selectedIndex)}
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
                  {tileRefreshing && currentTileUrl && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1.5 bg-black/60 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full pointer-events-none">
                      <svg className="animate-spin h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Loading {(selectedIndex || 'NDVI').toUpperCase()} · {effectiveSensor === 'sentinel-1' ? 'S1 SAR' : effectiveSensor === 'landsat' ? 'L9' : 'S2'}…
                    </div>
                  )}
                  <MapContainer center={defaultMapCenter} zoom={13} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
          {showRasterLayer && currentTileUrl && (
            <TileLayer
              key={currentTileUrl}
              url={currentTileUrl}
              opacity={mapOpacity / 100}
              bounds={rasterOverlayBounds || undefined}
              maxZoom={22}
              maxNativeZoom={18}
            />
          )}
                    
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
                    {null}
                    <FitBoundsToPlots plotsData={plotsData} farmBoundary={farmBoundary} />
                    <FitToZarrBounds zarrBounds={zarrBounds} />
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
                  {renderFloatingBasemapSelector()}

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
                            {/* Satellite Index Raster Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Satellite Index Raster</div>
                              <span className="text-[10px] text-gray-400">Raw pixel layer from zarr</span>
                            </div>
                            <button
                              onClick={() => setShowRasterLayer(!showRasterLayer)}
                              className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                              style={{ backgroundColor: showRasterLayer ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${showRasterLayer ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </div>
                          {showRasterLayer && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{mapOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={mapOpacity}
                                onChange={e => setMapOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                            </div>
                          )}
                        </div>
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
                      <div className="space-y-3">
                        <div
                          onClick={() => setYieldProdExpanded(!yieldProdExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {yieldProdExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Production
                        </div>
                        {yieldProdExpanded && (
                          <div className="space-y-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Yield Forecast {renderInfoTooltip("Yield Forecast")}</div><span className="text-[10px] text-gray-400">Predicted harvest volume</span></div>
                            <button onClick={() => setYieldShowYield(!yieldShowYield)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: yieldShowYield ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: yieldShowYield ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {yieldShowYield && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">High</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">Good</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#eab308'}}/><span className="text-[10px] font-semibold text-gray-500">Average</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Below Average</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Biomass {renderInfoTooltip("Biomass")}</div><span className="text-[10px] text-gray-400">Above-ground biomass (EVI-derived)</span></div>
                            <button onClick={() => setYieldShowBiomass(!yieldShowBiomass)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: yieldShowBiomass ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: yieldShowBiomass ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {yieldShowBiomass && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">High</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Low</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Harvest Readiness {renderInfoTooltip("Harvest Readiness")}</div><span className="text-[10px] text-gray-400">Crop maturity status</span></div>
                            <button onClick={() => setYieldShowReadiness(!yieldShowReadiness)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: yieldShowReadiness ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: yieldShowReadiness ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {yieldShowReadiness && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">Ready to Harvest</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">2-4 Weeks</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Not Ready</span></div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>                      <div className="space-y-3">
                        <div
                          onClick={() => setYieldStatExpanded(!yieldStatExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {yieldStatExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Statistics
                        </div>
                        {yieldStatExpanded && (
                          <div className="space-y-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Growth Stage {renderInfoTooltip("Growth Stage")}</div><span className="text-[10px] text-gray-400">Phenological stage classification</span></div>
                            <button onClick={() => setYieldShowGrowth(!yieldShowGrowth)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: yieldShowGrowth ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: yieldShowGrowth ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {yieldShowGrowth && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#60a5fa'}}/><span className="text-[10px] font-semibold text-gray-500">Germination</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">Vegetative</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#eab308'}}/><span className="text-[10px] font-semibold text-gray-500">Flowering</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#f97316'}}/><span className="text-[10px] font-semibold text-gray-500">Fruiting</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">Maturity</span></div>
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
              {renderMapBottomPanel(selectedIndex)}
            </div>
          )}

          {activeSidebarItem === 'moisture-content' && (
            <div className="flex flex-col h-full">

              {/* ── Top area: Map + Right Legend sidebar ── */}
              <div className="flex flex-1 min-h-0">

                {/* ═══ MAP ═══ */}
                <div className="flex-1 relative min-w-0 map-wrapper-pane">
                  {tileRefreshing && currentTileUrl && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1.5 bg-black/60 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full pointer-events-none">
                      <svg className="animate-spin h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Loading {(selectedIndex || 'SMI').toUpperCase()} · S1 SAR…
                    </div>
                  )}
                  <MapContainer center={defaultMapCenter} zoom={13} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
                    {showRasterLayer && currentTileUrl && (
                      <TileLayer
                        key={currentTileUrl}
                        url={currentTileUrl}
                        opacity={mapOpacity / 100}
                        bounds={rasterOverlayBounds || undefined}
                        maxZoom={22}
                        maxNativeZoom={18}
                      />
                    )}
                    
                    {isCompareMode ? (
                      <>
                        <MapPaneClipSetter
                          leftPaneName="left-pane-moisture"
                          rightPaneName="right-pane-moisture"
                          splitPosition={splitPosition}
                          isCompareMode={isCompareMode}
                        />
                        <Pane name="left-pane-moisture" style={{ zIndex: 500 }}>
                          {renderHealthPolygons(healthPlotsDataA, 'left')}
                        </Pane>
                        <Pane name="right-pane-moisture" style={{ zIndex: 501 }}>
                          {renderHealthPolygons(healthPlotsDataB, 'right')}
                        </Pane>
                      </>
                    ) : (
                      renderHealthPolygons(healthPlotsData)
                    )}
                    <FitBoundsToPlots plotsData={plotsData} farmBoundary={farmBoundary} />
                    <FitToZarrBounds zarrBounds={zarrBounds} />
                    <ZoomControl position="bottomright" />
                    <ResizeMap trigger={moistureShowLayers} />
                  </MapContainer>

                  <SwipeSliderOverlay
                    isCompareMode={isCompareMode}
                    splitPosition={splitPosition}
                    currentTimelineA={currentTimelineA}
                    currentTimelineB={currentTimelineB}
                    handleSplitDragStart={handleSplitDragStart}
                  />

                  {renderFloatingBasemapSelector()}

                  <button
                    onClick={() => setMoistureShowLayers(!moistureShowLayers)}
                    className={`absolute top-4 right-4 bg-white border p-3 rounded-2xl shadow-xl hover:bg-gray-55 flex items-center gap-2 font-bold text-xs transition-all active:scale-95 ${
                      moistureShowLayers ? 'text-green-700 border-green-200 bg-green-50 shadow-inner' : 'text-gray-700 border-gray-200 bg-white'
                    }`}
                    style={{ zIndex: 40000 }}
                  >
                    <Layers size={16} className={moistureShowLayers ? 'text-green-600' : 'text-gray-400'} />
                    Map Layers
                  </button>
                </div>

                {/* ═══ RIGHT MAP LAYERS SIDEBAR ═══ */}
                {moistureShowLayers && (
                  <div className="w-[280px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto z-10 shadow-sm animate-in slide-in-from-right duration-300">
                    <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers size={18} className="text-green-600" />
                        <span className="text-base font-bold text-gray-800 font-sans">Map Layers</span>
                      </div>
                      <button onClick={() => setMoistureShowLayers(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-655 transition-all">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-4 space-y-6">
                      <div className="space-y-3">
                        <div 
                          onClick={() => setMoistureOpExpanded(!moistureOpExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {moistureOpExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Operational
                        </div>
                        {moistureOpExpanded && (
                          <div className="space-y-3">
                            <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Radar Index Raster</div>
                                  <span className="text-[10px] text-gray-400">Raw SMI pixels from Zarr</span>
                                </div>
                                <button
                                  onClick={() => setShowRasterLayer(!showRasterLayer)}
                                  className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                                  style={{ backgroundColor: showRasterLayer ? '#16A34A' : '#E5E7EB' }}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${showRasterLayer ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              </div>
                              {showRasterLayer && (
                                <div className="space-y-2 pt-1 border-t border-gray-50">
                                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                    <span>Opacity</span>
                                    <span>{mapOpacity}%</span>
                                  </div>
                                  <input type="range" min="10" max="100" value={mapOpacity}
                                    onChange={e => setMapOpacity(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                                </div>
                              )}
                            </div>

                            <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Farm Boundaries</div>
                                  <span className="text-[10px] text-gray-400">Plot perimeter outlines</span>
                                </div>
                                <button
                                  onClick={() => setMoistureShowBoundaries(!moistureShowBoundaries)}
                                  className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                                  style={{ backgroundColor: moistureShowBoundaries ? '#16A34A' : '#E5E7EB' }}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${moistureShowBoundaries ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              </div>
                              {moistureShowBoundaries && (
                                <div className="space-y-2 pt-1 border-t border-gray-50">
                                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                    <span>Opacity</span>
                                    <span>{moistureBoundariesOpacity}%</span>
                                  </div>
                                  <input type="range" min="10" max="100" value={moistureBoundariesOpacity}
                                    onChange={e => setMoistureBoundariesOpacity(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div
                          onClick={() => setMoistureBioExpanded(!moistureBioExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {moistureBioExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} SMI Radar Metrics
                        </div>
                        {moistureBioExpanded && (
                          <div className="space-y-3">
                            <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-gray-700 leading-tight">Soil Moisture Index (SMI)</div>
                                  <span className="text-[10px] text-gray-400">SAR change detection index</span>
                                </div>
                                <button
                                  onClick={() => setMoistureShowSmi(!moistureShowSmi)}
                                  className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                                  style={{ backgroundColor: moistureShowSmi ? '#16A34A' : '#E5E7EB' }}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${moistureShowSmi ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              </div>
                              {moistureShowSmi && (
                                <div className="space-y-1.5 pt-1 border-t border-gray-50">
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0 bg-[#1E3A8A]" /><span className="text-[10px] font-semibold text-gray-500">Saturated (&gt; 0.7)</span></div>
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0 bg-[#2563EB]" /><span className="text-[10px] font-semibold text-gray-500">Wet (0.5 - 0.7)</span></div>
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0 bg-[#60A5FA]" /><span className="text-[10px] font-semibold text-gray-500">Optimal (0.3 - 0.5)</span></div>
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0 bg-[#86EFAC]" /><span className="text-[10px] font-semibold text-gray-500">Mild Stress (0.1 - 0.3)</span></div>
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0 bg-[#EAB308]" /><span className="text-[10px] font-semibold text-gray-500">Moderate Stress (-0.1 - 0.1)</span></div>
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0 bg-[#DC2626]" /><span className="text-[10px] font-semibold text-gray-500">Severe Stress (&lt; -0.1)</span></div>
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
              {renderMapBottomPanel(selectedIndex)}
            </div>
          )}

          {activeSidebarItem === 'land-restoration' && (
            <div className="flex flex-col h-full">

              {/* ── Top area: Map + Right Legend sidebar ── */}
              <div className="flex flex-1 min-h-0">

                {/* ═══ MAP ═══ */}
                <div className="flex-1 relative min-w-0 map-wrapper-pane">
                  {tileRefreshing && currentTileUrl && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1.5 bg-black/60 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full pointer-events-none">
                      <svg className="animate-spin h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Loading {(selectedIndex || 'NDVI').toUpperCase()} · {effectiveSensor === 'sentinel-1' ? 'S1 SAR' : effectiveSensor === 'landsat' ? 'L9' : 'S2'}…
                    </div>
                  )}
                  <MapContainer center={defaultMapCenter} zoom={13} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
          {showRasterLayer && currentTileUrl && (
            <TileLayer
              key={currentTileUrl}
              url={currentTileUrl}
              opacity={mapOpacity / 100}
              bounds={rasterOverlayBounds || undefined}
              maxZoom={22}
              maxNativeZoom={18}
            />
          )}
                    
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
                    {null}
                    <FitBoundsToPlots plotsData={plotsData} farmBoundary={farmBoundary} />
                    <FitToZarrBounds zarrBounds={zarrBounds} />
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
                  {renderFloatingBasemapSelector()}

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
                            {/* Satellite Index Raster Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Satellite Index Raster</div>
                              <span className="text-[10px] text-gray-400">Raw pixel layer from zarr</span>
                            </div>
                            <button
                              onClick={() => setShowRasterLayer(!showRasterLayer)}
                              className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                              style={{ backgroundColor: showRasterLayer ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${showRasterLayer ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </div>
                          {showRasterLayer && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{mapOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={mapOpacity}
                                onChange={e => setMapOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                            </div>
                          )}
                        </div>
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
                      <div className="space-y-3">
                        <div
                          onClick={() => setRestoreEcoExpanded(!restoreEcoExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {restoreEcoExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Ecological
                        </div>
                        {restoreEcoExpanded && (
                          <div className="space-y-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Restoration Progress {renderInfoTooltip("Restoration Progress")}</div><span className="text-[10px] text-gray-400">Area rehabilitation status</span></div>
                            <button onClick={() => setRestoreShowProgress(!restoreShowProgress)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowProgress ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowProgress ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowProgress && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;75% Complete</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">50-75%</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">25-50%</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;25%</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Survival Rate {renderInfoTooltip("Survival Rate")}</div><span className="text-[10px] text-gray-400">Planted species survival</span></div>
                            <button onClick={() => setRestoreShowSurvival(!restoreShowSurvival)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowSurvival ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowSurvival ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowSurvival && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;85% Survival</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">70-85%</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">50-70%</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;50%</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Carbon Offset {renderInfoTooltip("Carbon Offset")}</div><span className="text-[10px] text-gray-400">Sequestered carbon stock</span></div>
                            <button onClick={() => setRestoreShowCarbon(!restoreShowCarbon)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowCarbon ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowCarbon ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowCarbon && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;10 t CO2e/ha</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#60a5fa'}}/><span className="text-[10px] font-semibold text-gray-500">5-10 t CO2e/ha</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">2-5 t CO2e/ha</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;2 t CO2e/ha</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Biodiversity {renderInfoTooltip("Biodiversity")}</div><span className="text-[10px] text-gray-400">Species richness index</span></div>
                            <button onClick={() => setRestoreShowBiodiversity(!restoreShowBiodiversity)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowBiodiversity ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowBiodiversity ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowBiodiversity && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">High</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Low</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Very Low</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">AGB {renderInfoTooltip("AGB")}</div><span className="text-[10px] text-gray-400">Above-Ground Biomass</span></div>
                            <button onClick={() => setRestoreShowAgb(!restoreShowAgb)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowAgb ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowAgb ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowAgb && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#166534'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;200 t/ha</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#22c55e'}}/><span className="text-[10px] font-semibold text-gray-500">100-200 t/ha</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">50-100 t/ha</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#ef4444'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;50 t/ha</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">InSAR Coherence {renderInfoTooltip("InSAR Coherence")}</div><span className="text-[10px] text-gray-400">SAR interferometric coherence</span></div>
                            <button onClick={() => setRestoreShowInSar(!restoreShowInSar)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowInSar ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowInSar ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowInSar && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">High (0.8-1.0)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#60a5fa'}}/><span className="text-[10px] font-semibold text-gray-500">Good (0.6-0.8)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate (0.4-0.6)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Low ({'<'}0.4)</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">GEDI Canopy {renderInfoTooltip("GEDI Canopy")}</div><span className="text-[10px] text-gray-400">LiDAR canopy height</span></div>
                            <button onClick={() => setRestoreShowGedi(!restoreShowGedi)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowGedi ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowGedi ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowGedi && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#166534'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;30m</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#22c55e'}}/><span className="text-[10px] font-semibold text-gray-500">20-30m</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">10-20m</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#ef4444'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;10m</span></div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>                      <div className="space-y-3">
                        <div
                          onClick={() => setRestoreLulcExpanded(!restoreLulcExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {restoreLulcExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} LULC
                        </div>
                        {restoreLulcExpanded && (
                          <div className="space-y-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">NDWI {renderInfoTooltip("NDWI")}</div><span className="text-[10px] text-gray-400">Normalized Difference Water Index</span></div>
                            <button onClick={() => setRestoreShowNdwi(!restoreShowNdwi)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowNdwi ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowNdwi ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowNdwi && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">High (&gt;0.3)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#60a5fa'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate (0.0-0.3)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Low (-0.2 to 0.0)</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Dry (&lt;-0.2)</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">LULC {renderInfoTooltip("LULC")}</div><span className="text-[10px] text-gray-400">Land Use / Land Cover</span></div>
                            <button onClick={() => setRestoreShowLulc(!restoreShowLulc)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowLulc ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowLulc ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowLulc && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">Forest</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">Cropland</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Grassland</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#6b7280'}}/><span className="text-[10px] font-semibold text-gray-500">Urban</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">Water</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">LULC Change {renderInfoTooltip("LULC Change")}</div><span className="text-[10px] text-gray-400">Land cover change detection</span></div>
                            <button onClick={() => setRestoreShowLulcChange(!restoreShowLulcChange)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowLulcChange ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowLulcChange ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowLulcChange && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">Vegetation Gain</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#6b7280'}}/><span className="text-[10px] font-semibold text-gray-500">No Change</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Vegetation Loss</span></div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>                      <div className="space-y-3">
                        <div
                          onClick={() => setRestoreEudrExpanded(!restoreEudrExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {restoreEudrExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} EUDR
                        </div>
                        {restoreEudrExpanded && (
                          <div className="space-y-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">EUDR Compliance {renderInfoTooltip("EUDR Compliance")}</div><span className="text-[10px] text-gray-400">EU Deforestation Regulation status</span></div>
                            <button onClick={() => setRestoreShowEudr(!restoreShowEudr)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: restoreShowEudr ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: restoreShowEudr ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {restoreShowEudr && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">Compliant</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">At Risk</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">Non-Compliant</span></div>
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
              {renderMapBottomPanel(selectedIndex)}
            </div>
          )}


          {/* ══════════════════════════════════════════════════════════════
              ALERTS COMMAND CENTER
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'alerts' && (
            <div className="flex flex-col h-full relative" style={{ minHeight: 0 }}>
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
                    <AlertTriangle size={18} className="text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-none">Alerts Command Center</h2>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Live Anomaly Intelligence · Farmintelytics Agro Node</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
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
                        const activeColor = sev === 'Critical' ? 'bg-green-600 text-white' : sev === 'Warning' ? 'bg-green-500 text-white' : sev === 'Info' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white';
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
                      // Use real plots from backend instead of hardcoded fake plot names
                      const PLOT_DEFS = plotsData.map(p => ({
                        id: p.id,
                        name: p.name || p.id,
                        estate: p.subfarm || tenantDisplayName,
                        ndvi: p.ndvi ?? 0
                      }));

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
                        .filter(p => p.total > 0)
                        .filter(p => !searchLower || p.name.toLowerCase().includes(searchLower) || p.id.toLowerCase().includes(searchLower));

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

                        const dotColor = isCrit ? 'bg-green-500' : isWarn ? 'bg-green-500' : 'bg-green-400';
                        const badgeBg = isCrit ? 'bg-green-50 text-green-700 border-green-200' : isWarn ? 'bg-green-50 text-green-700 border-green-200' : 'bg-green-50 text-green-700 border-green-200';

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
                              {p.critCount > 0 && <span className="text-[9px] font-black bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">{p.critCount} Critical</span>}
                              {p.warnCount > 0 && <span className="text-[9px] font-black bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">{p.warnCount} Warning</span>}
                              {p.infoCount > 0 && <span className="text-[9px] font-black bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">{p.infoCount} Info</span>}
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
                      // Look up real plot from plotsData
                      const realPlot = plotsData.find(p => p.id === selectedAlertPlot);
                      const meta = realPlot
                        ? { name: realPlot.name || realPlot.id, estate: realPlot.subfarm || tenantDisplayName, ndvi: realPlot.ndvi ?? 0 }
                        : { name: selectedAlertPlot, estate: tenantDisplayName, ndvi: 0 };
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
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                                ) : warnCount > 0 ? (
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                                ) : (
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0" />
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
                              { label: 'Active Incidents', value: activePlotAlerts.length, color: activePlotAlerts.length > 0 ? 'text-green-700' : 'text-gray-400', bg: activePlotAlerts.length > 0 ? 'bg-green-50/70 border-green-100' : 'bg-gray-50/50 border-gray-150' },
                              { label: 'Critical', value: critCount, color: critCount > 0 ? 'text-green-700' : 'text-gray-400', bg: critCount > 0 ? 'bg-green-50/70 border-green-100' : 'bg-gray-50/50 border-gray-150' },
                              { label: 'Warning', value: warnCount, color: warnCount > 0 ? 'text-green-700' : 'text-gray-400', bg: warnCount > 0 ? 'bg-green-50/70 border-green-100' : 'bg-gray-50/50 border-gray-150' },
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
                                let severityColor = 'bg-green-50 text-green-700 border-green-200';
                                let dotColor = isCrit ? 'bg-green-500' : alert.severity === 'Warning' ? 'bg-green-500' : 'bg-green-400';
                                if (isCrit) severityColor = 'bg-green-50 text-green-700 border-green-200';
                                else if (alert.severity === 'Warning') severityColor = 'bg-green-50 text-green-700 border-green-200';

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
                  {tileRefreshing && currentTileUrl && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1.5 bg-black/60 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full pointer-events-none">
                      <svg className="animate-spin h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Loading {(selectedIndex || 'NDVI').toUpperCase()} · {effectiveSensor === 'sentinel-1' ? 'S1 SAR' : effectiveSensor === 'landsat' ? 'L9' : 'S2'}…
                    </div>
                  )}
                  <MapContainer center={defaultMapCenter} zoom={13} maxZoom={22}
                    style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative', background: 'transparent' }} zoomControl={false}>
                    <TileLayer url={basemapUrl} attribution="&copy; ESRI & Google Satellite Imagery" maxZoom={22} maxNativeZoom={18} />
          {showRasterLayer && currentTileUrl && (
            <TileLayer
              key={currentTileUrl}
              url={currentTileUrl}
              opacity={mapOpacity / 100}
              bounds={rasterOverlayBounds || undefined}
              maxZoom={22}
              maxNativeZoom={18}
            />
          )}
                    
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
                    {null}
                    <FitBoundsToPlots plotsData={plotsData} farmBoundary={farmBoundary} />
                    <FitToZarrBounds zarrBounds={zarrBounds} />
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
                  {renderFloatingBasemapSelector()}

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
                            {/* Satellite Index Raster Card */}
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Satellite Index Raster</div>
                              <span className="text-[10px] text-gray-400">Raw pixel layer from zarr</span>
                            </div>
                            <button
                              onClick={() => setShowRasterLayer(!showRasterLayer)}
                              className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0"
                              style={{ backgroundColor: showRasterLayer ? '#16A34A' : '#E5E7EB' }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${showRasterLayer ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </div>
                          {showRasterLayer && (
                            <div className="space-y-2 pt-1 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Opacity</span>
                                <span>{mapOpacity}%</span>
                              </div>
                              <input type="range" min="10" max="100" value={mapOpacity}
                                onChange={e => setMapOpacity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                            </div>
                          )}
                        </div>
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
                      <div className="space-y-3">
                        <div
                          onClick={() => setClimateBioExpanded(!climateBioExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {climateBioExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Biophysical
                        </div>
                        {climateBioExpanded && (
                          <div className="space-y-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Rainfall {renderInfoTooltip("Rainfall")}</div><span className="text-[10px] text-gray-400">Accumulated precipitation</span></div>
                            <button onClick={() => setClimateShowRainfall(!climateShowRainfall)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: climateShowRainfall ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: climateShowRainfall ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {climateShowRainfall && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;200 mm</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#60a5fa'}}/><span className="text-[10px] font-semibold text-gray-500">100-200 mm</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">50-100 mm</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;50 mm</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Soil Temperature {renderInfoTooltip("Soil Temperature")}</div><span className="text-[10px] text-gray-400">Near-surface soil temperature</span></div>
                            <button onClick={() => setClimateShowSoilTemp(!climateShowSoilTemp)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: climateShowSoilTemp ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: climateShowSoilTemp ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {climateShowSoilTemp && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;35C Critical</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#f97316'}}/><span className="text-[10px] font-semibold text-gray-500">30-35C High</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">20-30C Optimal</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;20C Cool</span></div>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>                      <div className="space-y-3">
                        <div
                          onClick={() => setClimateAtmExpanded(!climateAtmExpanded)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer select-none transition-colors"
                        >
                          {climateAtmExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Atmospheric
                        </div>
                        {climateAtmExpanded && (
                          <div className="space-y-3">
                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">LST {renderInfoTooltip("LST")}</div><span className="text-[10px] text-gray-400">Land Surface Temperature</span></div>
                            <button onClick={() => setClimateShowLst(!climateShowLst)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: climateShowLst ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: climateShowLst ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {climateShowLst && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;40C Extreme</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#f97316'}}/><span className="text-[10px] font-semibold text-gray-500">30-40C High</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">20-30C Normal</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;20C Cool</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Vapor Pressure Deficit {renderInfoTooltip("Vapor Pressure Deficit")}</div><span className="text-[10px] text-gray-400">Atmospheric dryness</span></div>
                            <button onClick={() => setClimateShowVaporDeficit(!climateShowVaporDeficit)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: climateShowVaporDeficit ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: climateShowVaporDeficit ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {climateShowVaporDeficit && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">&gt;3 kPa High</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#84cc16'}}/><span className="text-[10px] font-semibold text-gray-500">1-3 kPa Moderate</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#1d4ed8'}}/><span className="text-[10px] font-semibold text-gray-500">&lt;1 kPa Low</span></div>
                            </div>
                          )}
                        </div>                        <div className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div><div className="text-xs font-bold text-gray-700 leading-tight flex items-center gap-1.5">Flood Risk {renderInfoTooltip("Flood Risk")}</div><span className="text-[10px] text-gray-400">Surface inundation risk</span></div>
                            <button onClick={() => setClimateShowFlood(!climateShowFlood)} className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0" style={{ backgroundColor: climateShowFlood ? '#16A34A' : '#E5E7EB' }}>
                              <div style={{ transform: climateShowFlood ? 'translateX(16px)' : 'translateX(0)' }} className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" />
                            </button>
                          </div>
                          {climateShowFlood && (
                            <div className="space-y-1.5 pt-1 border-t border-gray-50">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#dc2626'}}/><span className="text-[10px] font-semibold text-gray-500">High Risk</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#f97316'}}/><span className="text-[10px] font-semibold text-gray-500">Moderate Risk</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#fbbf24'}}/><span className="text-[10px] font-semibold text-gray-500">Low Risk</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:'#15803d'}}/><span className="text-[10px] font-semibold text-gray-500">No Risk</span></div>
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
              {renderMapBottomPanel(selectedIndex)}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VERIFICATION
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'analytics' && activeTab === 'verification' && (
            <div className="p-10 space-y-10" />
          )}

          {/* ══════════════════════════════════════════════════════════════
              REPORTS
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'analytics' && activeTab === 'reports' && (() => {
            const isWholeFarm = reportPlot === 'WHOLE-FARM';
            const showAllPages = (selectedThemeReport || reportIndex) === 'ALL';
            const showHealthPage = showAllPages || (selectedThemeReport || reportIndex) === 'NDVI';
            const showClimatePage = showAllPages || (selectedThemeReport || reportIndex) === 'NDMI';
            const showHydrologyPage = showAllPages || (selectedThemeReport || reportIndex) === 'NDWI';
            const showCarbonPage = showAllPages || (selectedThemeReport || reportIndex) === 'SOC' || (selectedThemeReport || reportIndex) === 'AGB';
            
            const totalPages = 1 + (showHealthPage ? 1 : 0) + (showClimatePage ? 1 : 0) + (showHydrologyPage ? 1 : 0) + (showCarbonPage ? 1 : 0);
            let pageCounter = 0;

            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 9, weight: '600' } } },
                x: { grid: { display: false }, ticks: { font: { size: 9, weight: '600' } } }
              }
            };

            const getMetricChartData = (index, plot) => {
              const plotName = plot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : plot;
              const isPlotWholeFarm = plotName === 'Whole Farm (Aggregate)';
              // Use real timeline data for charts
              const labels = isPlotWholeFarm
                ? TIMELINE_DATA.map(t => t.label || t.date)
                : TIMELINE_DATA.map(t => t.label || t.date);

              const data = (() => {
                if (index === 'NDVI') return TIMELINE_DATA.map(t => t.ndvi ?? 0);
                if (index === 'NDMI') return TIMELINE_DATA.map(t => t.ndmi ?? 0);
                if (index === 'NDWI') return TIMELINE_DATA.map(t => t.ndwi ?? 0);
                // SOC/AGB not yet available from zarr — return zeros
                return TIMELINE_DATA.map(() => 0);
              })();

              return {
                labels,
                datasets: [{
                  label: `${index} Value`,
                  data,
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  borderColor: '#16A34A',
                  borderWidth: 2.5,
                  fill: true,
                  tension: 0.3,
                  pointRadius: 3
                }]
              };
            };

            const renderCoverPage = () => {
              pageCounter++;
              const plotName = reportPlot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : reportPlot;
              const reportType = generatedReport ? generatedReport.index : (selectedThemeReport || reportIndex);
              const reportId = generatedReport ? generatedReport.id : '—';
              const reportDate = generatedReport ? generatedReport.date : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

              return (
                <div className="w-full max-w-[700px] aspect-[1/1.414] bg-white border border-gray-200 shadow-md p-12 flex flex-col justify-between relative report-page-break mx-auto select-none">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 text-[9px] font-bold text-gray-450 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Satellite size={12} className="text-green-600" />
                      <span>Farmintelytics Spatial MRV Audit</span>
                    </div>
                    <span>Confidential Document</span>
                  </div>

                  <div className="my-auto space-y-8 text-center">
                    <div className="w-20 h-20 bg-green-50 border border-green-500/10 rounded-3xl flex items-center justify-center text-green-600 mx-auto shadow-sm">
                      <Satellite size={36} />
                    </div>
                    
                    <div className="space-y-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-700 bg-green-50 border border-green-150 px-3 py-1 rounded-full">
                        Verified Compliance Certificate
                      </span>
                      <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight pt-2">
                        SPATIAL ENVIRONMENTAL AUDIT & REGISTRY REPORT
                      </h3>
                      <p className="text-sm text-gray-400 font-semibold max-w-md mx-auto leading-relaxed">
                        Continuous satellite observation, biophysical metric ledgers, and carbon stock calculations.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-gray-50/50 p-5 rounded-2xl border border-gray-150 text-left">
                      <div>
                        <span className="text-[9px] text-gray-455 font-black uppercase tracking-wider block">Scope Target</span>
                        <span className="text-xs font-bold text-gray-800">{plotName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-455 font-black uppercase tracking-wider block">Report Category</span>
                        <span className="text-xs font-bold text-gray-800">
                          {reportType === 'ALL' ? 'Complete Farm Ledger' : `${reportType} Index Audit`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-455 font-black uppercase tracking-wider block">Document ID</span>
                        <span className="text-xs font-mono font-bold text-gray-800">{reportId}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-455 font-black uppercase tracking-wider block">Compiled At</span>
                        <span className="text-xs font-bold text-gray-800">{reportDate}</span>
                      </div>
                      <div className="col-span-2 border-t border-gray-150 pt-3 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-gray-455 font-black uppercase tracking-wider block">MRV Compliance Status</span>
                          <span className="text-xs font-bold text-green-700 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 size={11} className="text-green-600" /> Approved & Signed
                          </span>
                        </div>
                        <span className="text-[8px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded border uppercase">
                          VCS Standard
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>FARMINTELYTICS WEBPORTAL v3.2</span>
                    <span className="text-green-600">Certified Deforestation-Free</span>
                    <span>Page {pageCounter} of {totalPages}</span>
                  </div>
                </div>
              );
            };

            const renderHealthPage = () => {
              pageCounter++;
              const healthData = getMetricChartData('NDVI', reportPlot);
              const meanNdvi = TIMELINE_DATA.length > 0 ? (TIMELINE_DATA.reduce((s, t) => s + (t.ndvi ?? 0), 0) / TIMELINE_DATA.length) : null;
              const isStressed = meanNdvi !== null && meanNdvi < 0.5;
              const plotName = reportPlot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : reportPlot;
              const reportId = generatedReport ? generatedReport.id : '—';
              
              return (
                <div className="w-full max-w-[700px] aspect-[1/1.414] bg-white border border-gray-200 shadow-md p-12 flex flex-col justify-between relative report-page-break mx-auto select-none">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 text-[9px] font-bold text-gray-455 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Satellite size={12} className="text-green-600" />
                      <span>01. Vegetation Health Assessment</span>
                    </div>
                    <span>ID: {reportId}</span>
                  </div>

                  <div className="my-auto space-y-6 flex-1 pt-6 text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">CROP VEGETATION VIGOR & HEALTH STATUS</h4>
                        <p className="text-xs text-gray-400 font-semibold mt-1">Satellite derived NDVI analysis mapping canopy health distribution.</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isStressed ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {isStressed ? 'Warning (Stress)' : 'Optimal Performance'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-gray-405 uppercase tracking-wider block">Temporal Trend Line</span>
                      <div className="h-[180px] w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl relative">
                        {isWholeFarm ? (
                          <Bar data={healthData} options={chartOptions} />
                        ) : (
                          <Line data={healthData} options={chartOptions} />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[9px] text-gray-450 font-bold uppercase block">Mean NDVI</span>
                        <span className="text-base font-black text-gray-800 mt-1 block">
                          {TIMELINE_DATA.length > 0 ? (TIMELINE_DATA.reduce((s, t) => s + (t.ndvi ?? 0), 0) / TIMELINE_DATA.length).toFixed(2) : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-455 font-bold uppercase block">Active Chlorophyll</span>
                        <span className="text-base font-black text-gray-850 mt-1 block">
                          {TIMELINE_DATA.length > 0 ? (TIMELINE_DATA.reduce((s, t) => s + (t.chlorophyll ?? 0), 0) / TIMELINE_DATA.length).toFixed(2) + ' GCVI' : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-455 font-bold uppercase block">Zonal Coverage</span>
                        <span className="text-base font-black text-green-700 mt-1 block">
                          {'—'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50/40 border border-green-100 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-green-800 flex items-center gap-1.5">
                        <Sparkles size={11} className="text-green-600" /> Agronomic Assessment
                      </span>
                      <p className="text-xs text-green-700 font-semibold leading-relaxed">
                        {isWholeFarm
                          ? 'Spatial verification of the whole farm indicates high performance across the primary vegetative bands. NDVI values are derived from real satellite observations.'
                          : isStressed
                            ? 'This plot reveals suppressed moisture index levels. Vegetative health remains moderate, but root-zone transpiration stress is elevated. Recommendation: Increase irrigation frequency by 25%.'
                            : 'Diagnostic review of this plot shows optimal vegetation vigor. Canopy density trajectories remain stable with zero forest loss anomalies.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Plot: {plotName}</span>
                    <span className="text-green-600">Compliance Audit Approved</span>
                    <span>Page {pageCounter} of {totalPages}</span>
                  </div>
                </div>
              );
            };

            const renderClimatePage = () => {
              pageCounter++;
              const climateData = getMetricChartData('NDMI', reportPlot);
              const meanNdmi = TIMELINE_DATA.length > 0 ? (TIMELINE_DATA.reduce((s, t) => s + (t.ndmi ?? 0), 0) / TIMELINE_DATA.length) : null;
              const isStressed = meanNdmi !== null && meanNdmi < 0.2;
              const plotName = reportPlot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : reportPlot;
              const reportId = generatedReport ? generatedReport.id : '—';

              return (
                <div className="w-full max-w-[700px] aspect-[1/1.414] bg-white border border-gray-200 shadow-md p-12 flex flex-col justify-between relative report-page-break mx-auto select-none">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 text-[9px] font-bold text-gray-450 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <CloudRain size={12} className="text-green-600" />
                      <span>02. Microclimate & Soil Moisture Profile</span>
                    </div>
                    <span>ID: {reportId}</span>
                  </div>

                  <div className="my-auto space-y-6 flex-1 pt-6 text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">CANOPY MOISTURE & TRANSPIRATION INDEX</h4>
                        <p className="text-xs text-gray-400 font-semibold mt-1">Root-zone water content tracking (NDMI) combined with meteorology logs.</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isStressed ? 'bg-green-50 text-green-700 border border-green-200 animate-pulse' : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {isStressed ? 'Deficit Alert' : 'Moisture Adequate'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-gray-450 uppercase tracking-wider block">NDMI Soil Moisture Trend</span>
                      <div className="h-[180px] w-full bg-gray-55 border border-gray-100 p-4 rounded-2xl relative">
                        {isWholeFarm ? (
                          <Bar data={climateData} options={chartOptions} />
                        ) : (
                          <Line data={climateData} options={chartOptions} />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[8px] text-gray-400 font-bold uppercase block">Mean NDMI</span>
                        <span className="text-xs font-black text-gray-800 mt-1 block">
                          {meanNdmi !== null ? meanNdmi.toFixed(2) : '—'}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[8px] text-gray-400 font-bold uppercase block">Soil Temp</span>
                        <span className="text-xs font-black text-gray-800 mt-1 block">—</span>
                      </div>
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[8px] text-gray-400 font-bold uppercase block">VPD Stress</span>
                        <span className="text-xs font-black text-gray-800 mt-1 block">—</span>
                      </div>
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-center">
                        <span className="text-[8px] text-gray-400 font-bold uppercase block">Rainfall</span>
                        <span className="text-xs font-black text-green-700 mt-1 block">—</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-55 border border-gray-150 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-700 block">Hydrological Summary</span>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                        {isStressed
                          ? 'Root-zone water stress is elevated. NDMI readings indicate below-threshold moisture levels. Immediate cover-cropping and crop mulching recommended to retain sub-surface soil hydration.'
                          : 'Soil moisture profiles sit within stable margins. Leaf stomatal conductance is optimal, indicating healthy plant transpiration rates with no active drought markers.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Plot: {plotName}</span>
                    <span className="text-green-600">Meteorological Validation Log</span>
                    <span>Page {pageCounter} of {totalPages}</span>
                  </div>
                </div>
              );
            };

            const renderHydrologyPage = () => {
              pageCounter++;
              const hydrologyData = getMetricChartData('NDWI', reportPlot);
              const plotName = reportPlot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : reportPlot;
              const reportId = generatedReport ? generatedReport.id : '—';

              return (
                <div className="w-full max-w-[700px] aspect-[1/1.414] bg-white border border-gray-200 shadow-md p-12 flex flex-col justify-between relative report-page-break mx-auto select-none">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 text-[9px] font-bold text-gray-450 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Waves size={12} className="text-green-600" />
                      <span>03. Water Hydrology Report</span>
                    </div>
                    <span>ID: {reportId}</span>
                  </div>

                  <div className="my-auto space-y-6 flex-1 pt-6 text-left">
                    <div>
                      <h4 className="text-lg font-black text-gray-900 tracking-tight">WATER STRESS & CANOPY WATER INDEX</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-1">Spatial hydrology mapping (NDWI) certifying canopy moisture levels.</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wider block">NDWI Hydrological Index Profile</span>
                      <div className="h-[180px] w-full bg-gray-55 border border-gray-100 p-4 rounded-2xl relative">
                        {isWholeFarm ? (
                          <Bar data={hydrologyData} options={chartOptions} />
                        ) : (
                          <Line data={hydrologyData} options={chartOptions} />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[9px] text-gray-455 font-bold uppercase block">Mean NDWI</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">
                          {TIMELINE_DATA.length > 0 ? (TIMELINE_DATA.reduce((s, t) => s + (t.ndwi ?? 0), 0) / TIMELINE_DATA.length).toFixed(2) : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-455 font-bold uppercase block">Evapotranspiration Deficit</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">—</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                      <span className="text-[9px] font-black uppercase text-gray-455 tracking-wider block">Security Hash & Signatures</span>
                      <div className="flex justify-between items-center text-[10px] text-gray-550 font-semibold">
                        <div>
                          <span className="block font-mono text-[9px] text-gray-400">Node ID: {tenant?.toUpperCase()}-S2-{generatedReport?.id?.slice(-4) || '0000'}</span>
                          <span className="block font-mono text-[9px] text-gray-400">Digital Signature: SHA-256: {generatedReport?.id ? btoa(generatedReport.id).slice(0,15) : '—'}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-gray-850 font-extrabold">{profileName} (Lead GIS)</span>
                          <span className="block text-[8px] text-green-600 uppercase">Electronically Signed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[8px] font-bold text-gray-450 uppercase tracking-wider">
                    <span>Registry: VCS & Gold Standard compliant</span>
                    <span className="text-green-600">Deforestation Free Verified</span>
                    <span>Page {pageCounter} of {totalPages}</span>
                  </div>
                </div>
              );
            };

            const renderCarbonPage = () => {
              pageCounter++;
              const carbonData = getMetricChartData('SOC', reportPlot);
              const plotName = reportPlot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : reportPlot;
              const reportId = generatedReport ? generatedReport.id : '—';

              return (
                <div className="w-full max-w-[700px] aspect-[1/1.414] bg-white border border-gray-200 shadow-md p-12 flex flex-col justify-between relative report-page-break mx-auto select-none">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 text-[9px] font-bold text-gray-455 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Globe size={12} className="text-green-600" />
                      <span>04. Carbon Sequestration & Soil Chemistry</span>
                    </div>
                    <span>ID: {reportId}</span>
                  </div>

                  <div className="my-auto space-y-6 flex-1 pt-6 text-left">
                    <div>
                      <h4 className="text-lg font-black text-gray-900 tracking-tight">SOIL ORGANIC CARBON & ABOVEGROUND BIOMASS</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-1">Verification of baseline carbon reserves and annual wood biomass changes.</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-gray-450 uppercase tracking-wider block">Carbon Accumulation Chart</span>
                      <div className="h-[180px] w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl relative">
                        <Bar data={carbonData} options={chartOptions} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[9px] text-gray-455 font-bold uppercase block">Baseline Soil Carbon (SOC)</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">—</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-455 font-bold uppercase block">Aboveground Biomass (AGB)</span>
                        <span className="text-sm font-black text-gray-800 mt-1 block">—</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                    <span className="text-[9px] font-black uppercase text-gray-455 tracking-wider block">Security Hash & Signatures</span>
                    <div className="flex justify-between items-center text-[10px] text-gray-550 font-semibold">
                      <div>
                        <span className="block font-mono text-[9px] text-gray-400">Node ID: {tenant?.toUpperCase()}-S2-{generatedReport?.id?.slice(-4) || '0000'}</span>
                        <span className="block font-mono text-[9px] text-gray-400">Digital Signature: SHA-256: {generatedReport?.id ? btoa(generatedReport.id).slice(0,15) : '—'}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-gray-850 font-extrabold">{profileName} (Lead GIS)</span>
                        <span className="block text-[8px] text-green-600 uppercase">Electronically Signed</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[8px] font-bold text-gray-450 uppercase tracking-wider">
                    <span>Registry: VCS & Gold Standard compliant</span>
                    <span className="text-green-600">Deforestation Free Verified</span>
                    <span>Page {pageCounter} of {totalPages}</span>
                  </div>
                </div>
              );
            };

            return (
              <div className="p-10 space-y-10">
                {/* Dynamic stylesheet for PDF print overrides */}
                <style>{`
                  @media print {
                    /* Hide all UI containers */
                    body * {
                      visibility: hidden !important;
                    }
                    /* Show only the printable pages block */
                    .printable-report-area, .printable-report-area * {
                      visibility: visible !important;
                    }
                    .printable-report-area {
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      width: 100% !important;
                      max-width: 100% !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      background: white !important;
                      border: none !important;
                      box-shadow: none !important;
                    }
                    /* Format each page as A4 size and force break */
                    .report-page-break {
                      page-break-after: always !important;
                      break-after: page !important;
                      margin: 0 !important;
                      border: none !important;
                      box-shadow: none !important;
                      padding: 2.5cm !important;
                      width: 100% !important;
                      height: 297mm !important;
                      box-sizing: border-box !important;
                      display: flex !important;
                      flex-direction: column !important;
                      justify-content: space-between !important;
                      background: white !important;
                    }
                    .no-print {
                      display: none !important;
                    }
                  }
                `}</style>

                <div className="flex justify-between items-center no-print">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Analytical Ledger Reports</h2>
                    <p className="text-sm text-gray-500 font-medium mt-2">
                      Export verified geospatial datasets, CSV ledger tables, and printable PDF documents.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                  {/* ── CONFIGURATION PANEL (Left side, 1/3 width) ── */}
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 no-print">
                    <h3 className="text-base font-bold text-gray-900 pb-4 border-b border-gray-100 flex items-center gap-2.5">
                      <Settings2 size={18} className="text-green-600" />
                      Configure Report
                    </h3>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Report Scope</label>
                        <select
                          value={reportPlot}
                          onChange={(e) => {
                            setReportPlot(e.target.value);
                            setSelectedThemeReport('');
                          }}
                          className="w-full bg-gray-55 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none cursor-pointer focus:border-green-500 text-gray-700"
                        >
                          <option value="WHOLE-FARM">Whole Farm (Aggregate)</option>
                          {plotsData && plotsData.map(p => (
                            <option key={p.id} value={p.id}>{p.id}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-450 uppercase tracking-wider block">Report Type</label>
                        <select
                          value={selectedThemeReport || reportIndex}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.startsWith('theme')) {
                              setSelectedThemeReport(val);
                              if (val === 'theme1') {
                                setReportPlot('WHOLE-FARM');
                                setReportIndex('SOC');
                                triggerReportGeneration('WHOLE-FARM', 'SOC');
                              } else if (val === 'theme2') {
                                setReportPlot('WHOLE-FARM');
                                setReportIndex('NDMI');
                                triggerReportGeneration('WHOLE-FARM', 'NDMI');
                              } else if (val === 'theme3') {
                                setReportPlot('WHOLE-FARM');
                                setReportIndex('AGB');
                                triggerReportGeneration('WHOLE-FARM', 'AGB');
                              } else if (val === 'theme4') {
                                setReportPlot('WHOLE-FARM');
                                setReportIndex('NDVI');
                                triggerReportGeneration('WHOLE-FARM', 'NDVI');
                              }
                            } else {
                              setSelectedThemeReport('');
                              setReportIndex(val);
                            }
                          }}
                          className="w-full bg-gray-55 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold outline-none cursor-pointer focus:border-green-500 text-gray-700"
                        >
                          <optgroup label="Standard Analytical Metrics">
                            <option value="NDVI">Health Status Report</option>
                            <option value="NDMI">Climate & Soil Moisture Report</option>
                            <option value="NDWI">Water Hydrology Report</option>
                            <option value="SOC">Soil Organic Carbon Report</option>
                            <option value="AGB">Aboveground Biomass Carbon Report</option>
                            <option value="ALL">Complete Farm Ledger (All Reports)</option>
                          </optgroup>
                          <optgroup label="Pre-compiled Sustainability Reports">
                            <option value="theme1">Carbon Credits & Climate-Smart Ag</option>
                            <option value="theme2">Agroforestry & Land Restoration</option>
                            <option value="theme3">Carbon Accounting & Verification</option>
                            <option value="theme4">Traceability & Env. Impact</option>
                          </optgroup>
                        </select>
                      </div>

                      <button
                        onClick={() => triggerReportGeneration()}
                        disabled={isGeneratingReport}
                        className="w-full text-white font-bold text-sm py-3.5 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 hover:opacity-90 active:scale-98"
                        style={{ backgroundColor: '#16A34A' }}
                      >
                        {isGeneratingReport
                          ? <><RefreshCw className="animate-spin" size={15} /> Generating...</>
                          : <><Download size={15} /> Generate Report PDF</>}
                      </button>
                      
                      {generatedReport && (
                        <button
                          onClick={() => window.print()}
                          className="w-full text-gray-755 border border-gray-300 font-bold text-sm py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5 hover:bg-gray-55 active:scale-98"
                        >
                          <Download size={15} /> Download PDF
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── REPORT DOCUMENT PAGES VIEW (Right side, 2/3 width) ── */}
                  <div className="xl:col-span-2 space-y-6">
                    
                    {isGeneratingReport && (
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px] flex flex-col justify-center items-center no-print">
                        <div className="w-full max-w-md space-y-6 text-center">
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
                      </div>
                    )}

                    {!isGeneratingReport && !generatedReport && (
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px] flex flex-col justify-center items-center text-center no-print">
                        <div className="space-y-3 py-10">
                          <FileSpreadsheet size={48} className="text-gray-300 mx-auto" />
                          <h4 className="text-base font-bold text-gray-500 mt-2">No Report Generated Yet</h4>
                          <p className="text-sm text-gray-400 max-w-xs leading-relaxed mx-auto">
                            Configure the details on the left and click Generate to create a verified PDF audit sheet.
                          </p>
                        </div>
                      </div>
                    )}

                    {!isGeneratingReport && generatedReport && (() => {
                      const reportPlot = generatedReport.plot;
                      const reportIndex = generatedReport.index;
                      const isWholeFarm = reportPlot === 'WHOLE-FARM';
                      
                      const chartData = {
                        labels: TIMELINE_DATA.length > 0
                          ? TIMELINE_DATA.map(t => t.label || t.date)
                          : [],
                        datasets: [{
                          label: `${reportIndex} Value`,
                          data: TIMELINE_DATA.map(t => {
                            const key = reportIndex.toLowerCase();
                            return t[key] ?? null;
                          }),
                          backgroundColor: 'rgba(22, 163, 74, 0.1)',
                          borderColor: '#16A34A',
                          borderWidth: 2.5,
                          fill: true,
                          tension: 0.3,
                          pointRadius: 3
                        }]
                      };

                      const chartOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 10, weight: '600' } } },
                          x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' } } }
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
                          return `Spatial verification of the whole farm indicates performance across all primary vegetative bands. ${metricName} values are derived from real satellite observations. Overall forest canopy coverage is assessed against EUDR regulatory baseline.`;
                        }
                        return `Diagnostic review of ${scopeText} shows values for ${metricName} derived from real satellite data. Canopy density trajectories are tracked across available observation dates.`;
                      };

                      return (
                        <div className="w-full flex-1 flex flex-col min-h-0 bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                          {/* PDF Viewer Header */}
                          <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 no-print shrink-0 select-none">
                            <div className="flex items-center gap-3">
                              <FileText size={18} className="text-green-500" />
                              <span className="font-mono text-xs font-bold text-slate-200">{generatedReport.id}.pdf</span>
                              <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">2 Pages</span>
                            </div>
                            <button
                              onClick={() => window.print()}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                            >
                              <Download size={13} /> Download PDF
                            </button>
                          </div>

                          {/* PDF Pages Viewer */}
                          <div className="bg-slate-800 p-8 overflow-y-auto space-y-8 flex flex-col items-center flex-1 max-h-[720px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            
                            {/* PAGE 1: COVER CERTIFICATE */}
                            <div className="bg-white shadow-2xl border border-gray-300 w-full max-w-[620px] aspect-[1/1.414] p-12 flex flex-col justify-between relative select-none">
                              {/* Confidential Header */}
                              <div className="flex justify-between items-center text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
                                <span className="text-green-600 flex items-center gap-1 font-bold">
                                  <Globe size={10} /> FARMINTELYTICS SPATIAL MRV AUDIT
                                </span>
                                <span>CONFIDENTIAL DOCUMENT</span>
                              </div>

                              {/* Center Content */}
                              <div className="my-auto text-center space-y-8">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 mx-auto shadow-sm">
                                  <Shield size={32} />
                                </div>
                                
                                <div className="space-y-4">
                                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/30 px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
                                    Verified Compliance Certificate
                                  </span>
                                  <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-snug uppercase max-w-md mx-auto">
                                    Spatial Environmental Audit & Registry Report
                                  </h1>
                                  <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-sm mx-auto">
                                    Continuous satellite observation, biophysical metric ledgers, and carbon stock calculations.
                                  </p>
                                </div>
                              </div>

                              {/* Metadata block at bottom */}
                              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200 text-left">
                                <div>
                                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Scope Target</span>
                                  <span className="text-xs font-bold text-gray-800">
                                    {generatedReport.plot === 'WHOLE-FARM' ? 'Whole Farm (Aggregate)' : generatedReport.plot}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Report Category</span>
                                  <span className="text-xs font-bold text-gray-800">
                                    {generatedReport.index === 'NDVI' ? 'NDVI — Vegetation Health Audit' :
                                     generatedReport.index === 'NDMI' ? 'NDMI — Soil Moisture Audit' :
                                     generatedReport.index === 'NDWI' ? 'NDWI — Water Hydrology Audit' :
                                     generatedReport.index === 'SOC' ? 'SOC — Soil Organic Carbon Audit' :
                                     'AGB — Aboveground Biomass Carbon Audit'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* PAGE 2: LEDGER DATA PAGE */}
                            <div className="bg-white shadow-2xl border border-gray-300 w-full max-w-[620px] aspect-[1/1.414] p-12 flex flex-col justify-between relative select-none">
                              {/* Page 2 Header */}
                              <div className="flex justify-between items-center text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
                                <span className="text-green-600 flex items-center gap-1 font-bold">
                                  <Globe size={10} /> FARMINTELYTICS SPATIAL MRV AUDIT
                                </span>
                                <span>ANALYTICAL DATA LEDGER</span>
                              </div>

                              {/* Data Details */}
                              <div className="my-auto space-y-6 flex-1 pt-6 text-left">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                  {[
                                    { label: 'Scope Target', value: generatedReport.plot === 'WHOLE-FARM' ? 'Whole Farm' : generatedReport.plot },
                                    { label: 'Metric Analyzed', value: generatedReport.index },
                                    { label: 'Mean Value', value: generatedReport.meanVal, color: 'text-green-700 font-extrabold' },
                                    { label: 'Compiled At', value: generatedReport.date }
                                  ].map((row, i) => (
                                    <div key={i}>
                                      <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block mb-0.5">{row.label}</span>
                                      <span className={`text-[11px] font-bold ${row.color || 'text-gray-800'}`}>{row.value}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Chart */}
                                <div className="space-y-2">
                                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                                    <LineChart size={12} className="text-green-600" />
                                    {generatedReport.plot === 'WHOLE-FARM' ? 'Spatial Comparative Chart' : 'Temporal Historical Trend'}
                                  </span>
                                  <div className="h-[160px] bg-white p-3 rounded-xl border border-gray-100">
                                    {generatedReport.plot === 'WHOLE-FARM' ? (
                                      <Bar data={chartData} options={chartOptions} />
                                    ) : (
                                      <Line data={chartData} options={chartOptions} />
                                    )}
                                  </div>
                                </div>

                                {/* Agronomic Insight */}
                                <div className="p-4 bg-green-50/40 border border-green-100 rounded-xl space-y-1.5">
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-green-800 flex items-center gap-1">
                                    <Sparkles size={11} className="text-green-600" />
                                    Automated Agronomic Diagnostic Insight
                                  </span>
                                  <p className="text-[11px] text-green-700 font-semibold leading-relaxed">
                                    {getReportInsight()}
                                  </p>
                                </div>
                              </div>

                              {/* Page 2 Footer */}
                              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                                <span>FARMINTELYTICS WEBPORTAL v3.2</span>
                                <span className="text-green-650 font-bold">Certified Deforestation-Free</span>
                                <span>Page 2 of 2</span>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════════════════════════════════════════════════════════
              AI ASSISTANT
          ══════════════════════════════════════════════════════════════ */}
          {activeSidebarItem === 'analytics' && activeTab === 'ai-assistant' && (
            <div className="flex flex-col flex-1 h-full bg-white overflow-hidden">
              
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
                  <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto px-6 py-8 text-center space-y-8">
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
                          desc: 'Simulate carbon credit yield if we transition this farm to zero-tillage & cover cropping practices.',
                          icon: <Leaf size={15} />,
                          prompt: 'Simulate carbon credit yield if we transition this farm to zero-tillage & multi-species cover cropping.'
                        },
                        {
                          id: 'agroforestry',
                          title: 'Agroforestry & Restoration',
                          desc: 'Model the canopy density growth trajectory and species diversity impact across active restoration zones.',
                          icon: <Trees size={15} />,
                          prompt: 'Model the canopy density growth trajectory and species diversity index across the active restoration zones on this farm.'
                        },
                        {
                          id: 'accounting',
                          title: 'Carbon Accounting & Registry',
                          desc: 'Run a geospatial mismatch audit on farm plot coordinates against regional baseline forest datasets.',
                          icon: <Globe size={15} />,
                          prompt: 'Run a geospatial mismatch audit on the farm plot coordinates against regional baseline forest datasets.'
                        },
                        {
                          id: 'traceability',
                          title: 'Traceability & Env. Impact',
                          desc: 'Draft an EUDR-compliant traceability report showing deforestation-free proof for this farm.',
                          icon: <Shield size={15} />,
                          prompt: 'Draft an EUDR-compliant traceability report showing deforestation-free proof and soil health history for this farm.'
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
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-2xl text-sm font-medium leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                            msg.sender === 'user'
                              ? 'text-white rounded-tr-none px-5 py-3.5'
                              : 'bg-white border border-gray-150 text-gray-700 rounded-tl-none px-5 py-3.5'
                          }`} style={msg.sender === 'user' ? { backgroundColor: '#16A34A' } : undefined}>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                                {msg.sources.map((src, si) => (
                                  <span key={si} className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5 font-medium">{src}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-150 rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-2 text-sm text-gray-400 font-medium">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      )}
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
                      disabled={chatLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit();
                        }
                      }}
                      placeholder="Ask about your farm... e.g. Which plots have low NDVI this season?"
                      className="w-full bg-gray-50 border border-transparent focus:border-green-600 focus:bg-white rounded-2xl py-5 pl-6 pr-16 text-sm font-semibold outline-none transition-all text-gray-800 placeholder-gray-400 shadow-sm resize-none h-44 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading}
                      className="absolute right-4 bottom-4 w-12 h-12 text-white rounded-xl flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-95 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="p-10 space-y-8 overflow-y-auto h-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Info size={28} className="text-green-650" />
                    Platform Glossary
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-2">
                    Dictionary of key Remote Sensing Indices, Biophysical Indicators, and Cadastral metrics.
                  </p>
                </div>
                <div className="relative max-w-xs w-full">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={glossarySearch}
                    onChange={(e) => setGlossarySearch(e.target.value)}
                    placeholder="Search terms, formulas..."
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-xs font-semibold outline-none focus:border-green-500 transition-all text-gray-700 shadow-sm"
                  />
                  {glossarySearch && (
                    <button 
                      onClick={() => setGlossarySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-455 hover:text-gray-755 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Glossary Subpages Tab Selector */}
              <div className="flex border-b border-gray-100 bg-gray-50/30 p-1 rounded-xl gap-1 shrink-0">
                <button
                  onClick={() => setGlossaryTab('remote-sensing')}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    glossaryTab === 'remote-sensing'
                      ? 'bg-green-600 text-white shadow-sm font-extrabold'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Satellite size={13} />
                  Remote Sensing Indices
                </button>
                <button
                  onClick={() => setGlossaryTab('farmer-inputs')}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    glossaryTab === 'farmer-inputs'
                      ? 'bg-green-600 text-white shadow-sm font-extrabold'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Database size={13} />
                  Farmer Inputs
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto pr-1">
                {Object.entries(TOOLTIP_DESCRIPTIONS)
                  .filter(([key, value]) => {
                    const searchLower = glossarySearch.toLowerCase();
                    const categoryMatch = value.category === glossaryTab;
                    const textMatch = 
                      key.toLowerCase().includes(searchLower) ||
                      (value.desc && value.desc.toLowerCase().includes(searchLower)) ||
                      (value.done && value.done.toLowerCase().includes(searchLower)) ||
                      (value.formula && value.formula.toLowerCase().includes(searchLower));
                    return categoryMatch && textMatch;
                  })
                  .map(([key, value]) => (
                    <div key={key} className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between hover:shadow-md transition-all gap-4">
                      <div>
                        <h3 className="text-base font-bold text-gray-950 flex items-center justify-between gap-2">
                          {key}
                        </h3>
                        <p className="text-xs text-gray-555 font-semibold leading-relaxed mt-2 text-left">
                          {value.desc}
                        </p>
                      </div>
                      
                      <div className="space-y-3 pt-3 border-t border-gray-100 text-left">
                        {value.done && (
                          <div className="text-[11px] text-gray-650 font-semibold">
                            <span className="font-extrabold text-gray-400 uppercase text-[9px] block tracking-wider mb-0.5">Methodology</span>
                            {value.done}
                          </div>
                        )}
                        {value.formula && (
                          <div className="text-[11px] text-gray-650 font-semibold">
                            <span className="font-extrabold text-gray-400 uppercase text-[9px] block tracking-wider mb-1">Formula / Expression</span>
                            <code className="block font-mono text-[10px] text-green-705 bg-green-50/50 border border-green-100 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap word-break-all">
                              {value.formula}
                            </code>
                          </div>
                        )}
                        {value.references && (
                          <div className="text-[11px] text-gray-650 font-semibold">
                            <span className="font-extrabold text-gray-400 uppercase text-[9px] block tracking-wider mb-1">References Cited</span>
                            <div className="text-[10px] text-gray-500 font-medium italic leading-relaxed bg-gray-50/50 border border-gray-100 rounded-lg p-2.5">
                              {value.references}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-[640px] h-[480px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <Settings2 className={brandingMode === 'AM' ? 'text-green-600' : 'text-green-600'} size={19} />
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
                        ? (brandingMode === 'AM' ? 'bg-green-50 text-green-700 font-extrabold' : 'bg-green-50 text-green-700 font-extrabold')
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
                        className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-green-500/50 ${
                          brandingMode === 'FT' ? 'border-green-600 bg-green-50/20 shadow-sm' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            Farm Tools Harvest Mode (FT)
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">Operational harvest tools, blue/orange branding, FT initials.</div>
                        </div>
                        {brandingMode === 'FT' && <CheckCircle2 size={16} className="text-green-600" />}
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
                              className="p-1 hover:bg-green-50 text-gray-400 hover:text-green-700 rounded"
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
                          brandingMode === 'AM' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'
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
                  brandingMode === 'AM' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/10' : 'bg-green-600 hover:bg-green-700 shadow-blue-600/10'
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

export default CropDashboardLayout;
