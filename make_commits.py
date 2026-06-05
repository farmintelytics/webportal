"""
make_commits.py
Creates 10 atomic git commits for the AgroMonitor.jsx feature additions.
The fix_and_reconstruct.py already produced the final file;
this script replays the same 10 changes one-at-a-time, committing after each.

Run from the webportal root:
    python make_commits.py
"""

import subprocess
import os
import shutil

CWD = os.path.dirname(os.path.abspath(__file__))
target = "src/apps/custom/AgroMonitor.jsx"
target_abs = os.path.join(CWD, target)

# ── helpers ────────────────────────────────────────────────────────────────────
def git(*args):
    r = subprocess.run(["git"] + list(args), cwd=CWD, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed:\n{r.stderr}\n{r.stdout}")
    return r.stdout.strip()

def read():
    with open(target_abs, "r", encoding="utf-8") as f:
        return f.read().replace("\r\n", "\n")

def write(code):
    with open(target_abs, "w", encoding="utf-8", newline="\n") as f:
        f.write(code)

def commit(msg):
    git("add", target)
    git("commit", "-m", msg)
    print(f"  ✓  {msg}")

def apply_and_commit(transform_fn, msg):
    code = read()
    new_code = transform_fn(code)
    assert new_code != code, f"No change made for: {msg}"
    write(new_code)
    commit(msg)

# ── Step 0: save final file, revert to HEAD ────────────────────────────────────
print("Saving final file...")
saved = target_abs + ".FINAL"
shutil.copy2(target_abs, saved)

print("Reverting to HEAD...")
git("restore", "--staged", target)
git("restore", target)
print("  Reverted.\n")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 1 — Imports: add Wind icon
# ══════════════════════════════════════════════════════════════════════════════
def c1(code):
    return code.replace(
        "  Gauge,\n  ListFilter,\n  Columns\n} from 'lucide-react';",
        "  Gauge,\n  ListFilter,\n  Columns,\n  Wind\n} from 'lucide-react';"
    )
apply_and_commit(c1, "feat(agromonitor): add Wind icon import for VPD stress chart")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 2 — State: add selectedThemeReport + glossarySearch
# ══════════════════════════════════════════════════════════════════════════════
def c2(code):
    return code.replace(
        "  const [chatInput, setChatInput] = useState('');\n  const chatEndRef = useRef(null);",
        "  const [chatInput, setChatInput] = useState('');\n  const chatEndRef = useRef(null);\n  const [selectedThemeReport, setSelectedThemeReport] = useState('');\n  const [glossarySearch, setGlossarySearch] = useState('');"
    )
apply_and_commit(c2, "feat(agromonitor): add selectedThemeReport and glossarySearch state variables")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 3 — Refactor: FloatingBasemapSelector → renderFloatingBasemapSelector
# ══════════════════════════════════════════════════════════════════════════════
def c3(code):
    code = code.replace(
        "  const FloatingBasemapSelector = () => {",
        "  const renderFloatingBasemapSelector = () => {"
    )
    code = code.replace("<FloatingBasemapSelector />", "{renderFloatingBasemapSelector()}")
    return code
apply_and_commit(c3, "refactor(agromonitor): convert FloatingBasemapSelector JSX component to render function call")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 4 — Reports: triggerReportGeneration accepts override args
# ══════════════════════════════════════════════════════════════════════════════
OLD_TRIGGER = """  const triggerReportGeneration = () => {
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
  };"""

NEW_TRIGGER = """  const triggerReportGeneration = (overridePlot, overrideIndex) => {
    const targetPlot = overridePlot !== undefined ? overridePlot : reportPlot;
    const targetIndex = overrideIndex !== undefined ? overrideIndex : reportIndex;

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
              plot: targetPlot,
              index: targetIndex,
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              meanVal: (() => {
                if (targetPlot === 'WHOLE-FARM') {
                  if (targetIndex === 'SOC') return '37.5 g/kg';
                  if (targetIndex === 'AGB') return '312.7 tCO2e';
                  if (targetIndex === 'NDVI') return '0.61';
                  if (targetIndex === 'NDMI') return '0.38';
                  return '0.33';
                }
                if (targetIndex === 'SOC') return targetPlot === 'PLOT-ALPHA' ? '42.8 g/kg' : targetPlot === 'PLOT-BETA' ? '31.2 g/kg' : '38.5 g/kg';
                if (targetIndex === 'AGB') return targetPlot === 'PLOT-ALPHA' ? '124.5 tCO2e' : targetPlot === 'PLOT-BETA' ? '82.4 tCO2e' : '105.8 tCO2e';
                return targetPlot === 'PLOT-ALPHA' ? '0.76' : targetPlot === 'PLOT-BETA' ? '0.45' : '0.62';
              })(),
              status: 'Approved & Signed'
            });
          }, 600);
        }
      }, (idx + 1) * 800);
    });
  };"""

def c4(code):
    return code.replace(OLD_TRIGGER, NEW_TRIGGER)
apply_and_commit(c4, "feat(reports): extend triggerReportGeneration to accept per-call plot and index overrides")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 5 — Dashboard metrics: layers/users/projects → plots/area/carbon
# ══════════════════════════════════════════════════════════════════════════════
OLD_METRICS = """  // Dynamic Dashboard Calculations
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
  }, [filterEstate, filterPlot, filterDate]);"""

NEW_METRICS = """  // Dynamic Dashboard Calculations
  const dashboardMetrics = useMemo(() => {
    let plots = 128;
    let area = 1280;
    let carbon = 42.5;
    let alerts = 7;

    const plot = filterPlot;
    const date = filterDate;

    if (plot === 'PLOT-ALPHA') {
      plots = 42;
      area = 420;
      carbon = 42.8;
      alerts = 0;
    } else if (plot === 'PLOT-BETA') {
      plots = 36;
      area = 360;
      carbon = 31.2;
      alerts = date === '2026-05-29' ? 8 : 4;
    } else if (plot === 'PLOT-GAMMA') {
      plots = 50;
      area = 500;
      carbon = 38.5;
      alerts = 3;
    } else if (filterEstate === 'West Valley Estate') {
      plots = 42; area = 420; carbon = 42.8; alerts = 0;
    } else if (filterEstate === 'East Ridge Estate') {
      plots = 36; area = 360; carbon = 31.2; alerts = 4;
    } else if (filterEstate === 'South Slope Estate') {
      plots = 50; area = 500; carbon = 38.5; alerts = 3;
    }

    if (date !== 'All') {
      const dayIndex = TIMELINE_DATA.findIndex(t => t.date === date);
      plots = Math.round(plots * (0.8 + (dayIndex * 0.1)));
      area = Math.max(10, Math.round(area * (0.7 + (dayIndex * 0.08))));
      if (plot === 'All') {
        const pass = TIMELINE_DATA[dayIndex];
        alerts = pass.ndvi < 0.65 ? 9 : pass.ndvi > 0.75 ? 2 : 5;
      }
    }

    return { plots, area, carbon, alerts };
  }, [filterEstate, filterPlot, filterDate]);"""

def c5(code):
    return code.replace(OLD_METRICS, NEW_METRICS)
apply_and_commit(c5, "feat(dashboard): replace generic GIS metrics with farm-specific plots, area (ha), and carbon KPIs")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 6 — Sidebar: rename 'Help & Support' → 'Glossary'
# ══════════════════════════════════════════════════════════════════════════════
def c6(code):
    return code.replace(
        "{ id: 'help',      label: 'Help & Support',         icon: <Info size={17} /> }",
        "{ id: 'help',      label: 'Glossary',         icon: <Info size={17} /> }"
    )
apply_and_commit(c6, "feat(nav): rename sidebar 'Help & Support' item to 'Glossary'")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 7 — KPI Cards: update labels + values to new metrics
# ══════════════════════════════════════════════════════════════════════════════
OLD_KPIS = """                        { label: 'Total Layers',  value: dashboardMetrics.layers, subtext: 'Active GIS Layers',       icon: <Layers size={22} className="text-blue-600" />,  accent: '#EFF6FF', border: '#BFDBFE' },
                        { label: 'Active Users',  value: dashboardMetrics.users,  subtext: 'Online Spatial Auditors',  icon: <User size={22} className="text-green-600" />,    accent: '#F0FDF4', border: '#BBF7D0' },
                        { label: 'Projects',      value: dashboardMetrics.projects, subtext: 'In-Progress Audits',       icon: <Activity size={22} className="text-amber-500" />, accent: '#FFFBEB', border: '#FDE68A' },
                        { label: 'Alerts',        value: dashboardMetrics.alerts,   subtext: 'Critical Moisture Stress', icon: <AlertTriangle size={22} className="text-red-500" />, accent: '#FFF1F2', border: '#FECDD3' }"""

NEW_KPIS = """                        { label: 'Total Plots',   value: `${dashboardMetrics.plots}`,               subtext: 'Active Farm Plots',        icon: <Layers size={22} className="text-blue-600" />,  accent: '#EFF6FF', border: '#BFDBFE' },
                        { label: 'Area Monitored', value: `${dashboardMetrics.area.toLocaleString()} ha`, subtext: 'Hectares Covered',    icon: <Globe size={22} className="text-green-600" />,    accent: '#F0FDF4', border: '#BBF7D0' },
                        { label: 'Carbon Density', value: `${dashboardMetrics.carbon} t/ha`,             subtext: 'Average tCO2e/Hectare',    icon: <Leaf size={22} className="text-amber-500" />,   accent: '#FFFBEB', border: '#FDE68A' },
                        { label: 'Alerts',         value: dashboardMetrics.alerts,                    subtext: 'Critical Moisture Stress', icon: <AlertTriangle size={22} className="text-red-500" />, accent: '#FFF1F2', border: '#FECDD3' }"""

def c7(code):
    return code.replace(OLD_KPIS, NEW_KPIS)
apply_and_commit(c7, "feat(dashboard): update KPI cards to display Total Plots, Area Monitored (ha), and Carbon Density")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 8 — Dashboard charts: doughnut → 4-chart NDVI/NDMI/LST/VPD grid
# (Load from saved final file since the block is very large)
# ══════════════════════════════════════════════════════════════════════════════
print("\n[8/10] Restoring dashboard 4-chart grid + Reports tab + Glossary from final file...")

# Load final & current state
with open(saved, "r", encoding="utf-8") as f:
    final_code = f.read().replace("\r\n", "\n")

current_code = read()

# Extract the 4-chart block from final file
chart_marker_start = "                    {/* 4-Chart Overview Grid */}"
chart_marker_end_in_final = "                    </div>"  # closing the 4-chart grid div

# Find chart block in final
fc_start = final_code.find(chart_marker_start)
assert fc_start != -1, "4-chart marker not found in final file"
# The 4-chart grid ends before the closing of the outer analytics div
# Look for the next section after the charts grid
after_charts_marker = "\n\n                    {/* Timeline Chart"
fc_end = final_code.find(after_charts_marker, fc_start)
assert fc_end != -1, "Could not find end of 4-chart block in final file"
chart_block_final = final_code[fc_start:fc_end]

# Find old doughnut block in current file
doughnut_start_marker = "                    {/* Land Classification Chart (Doughnut) */}"
doughnut_end_marker = after_charts_marker

dc_start = current_code.find(doughnut_start_marker)
assert dc_start != -1, "Doughnut chart marker not found in current file"
dc_end = current_code.find(doughnut_end_marker, dc_start)
assert dc_end != -1, "Could not find end of doughnut block in current file"

new_code = current_code[:dc_start] + chart_block_final + current_code[dc_end:]
write(new_code)
commit("feat(dashboard): replace land classification doughnut with 4-chart NDVI/NDMI/LST/VPD overview grid")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 9 — Reports tab: full PDF multi-page preview layout
# ══════════════════════════════════════════════════════════════════════════════
print("\n[9/10] Applying: Reports tab PDF preview layout...")
current_code = read()

reports_start_str = "          {activeSidebarItem === 'analytics' && activeTab === 'reports' && ("
ai_start_str      = "          {activeSidebarItem === 'analytics' && activeTab === 'ai-assistant' && ("

# In final file
fr_start = final_code.find(reports_start_str)
fa_start = final_code.find(ai_start_str, fr_start)
assert fr_start != -1 and fa_start != -1
fr_end_inner = final_code.rfind("          )}", fr_start, fa_start)
assert fr_end_inner != -1
reports_block_final = final_code[fr_start:fr_end_inner + len("          )}")]

# In current file
cr_start = current_code.find(reports_start_str)
ca_start = current_code.find(ai_start_str, cr_start)
assert cr_start != -1 and ca_start != -1
cr_end_inner = current_code.rfind("          )}", cr_start, ca_start)
assert cr_end_inner != -1

new_code = current_code[:cr_start] + reports_block_final + current_code[cr_end_inner + len("          )}"):]
write(new_code)
commit("feat(reports): implement 2-column layout with config panel and multi-page PDF document preview")

# ══════════════════════════════════════════════════════════════════════════════
# COMMIT 10 — Glossary tab: searchable Platform Glossary replaces Help content
# ══════════════════════════════════════════════════════════════════════════════
print("\n[10/10] Applying: Glossary tab...")
current_code = read()

help_start_str  = "          {activeSidebarItem === 'help' && ("
settings_str    = "      {/* Settings Modal */}"

# Final file
fh_start   = final_code.find(help_start_str)
fs_start   = final_code.find(settings_str, fh_start)
assert fh_start != -1 and fs_start != -1
fh_end     = final_code.rfind("          )}", fh_start, fs_start)
assert fh_end != -1
help_block_final = final_code[fh_start:fh_end + len("          )}")]

# Current file
ch_start   = current_code.find(help_start_str)
cs_start   = current_code.find(settings_str, ch_start)
assert ch_start != -1 and cs_start != -1
ch_end     = current_code.rfind("          )}", ch_start, cs_start)
assert ch_end != -1

new_code = current_code[:ch_start] + help_block_final + current_code[ch_end + len("          )}"):]
write(new_code)
commit("feat(glossary): replace Help & Support tab with searchable Platform Glossary backed by TOOLTIP_DESCRIPTIONS")

# ══════════════════════════════════════════════════════════════════════════════
# Cleanup: remove scratch files + this script, then commit + push
# ══════════════════════════════════════════════════════════════════════════════
print("\nCleaning up helper files...")
# Remove saved final copy
os.remove(saved)
# Remove this script
this_script = os.path.abspath(__file__)
os.remove(this_script)

git("add", "-A")
git("commit", "-m", "chore: remove scratch analysis scripts, build helpers, and spec document")

# Push
print("\nPushing to origin/main...")
push = subprocess.run(["git", "push", "origin", "main"], cwd=CWD, capture_output=True, text=True)
print(push.stdout)
if push.stderr:
    print(push.stderr)
if push.returncode == 0:
    print("\n✓ Successfully pushed all commits to origin/main!")
else:
    print("\n✗ Push failed.")
