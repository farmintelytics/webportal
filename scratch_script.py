import re

filepath = "src/modules/monitoring/shared/CropDashboardLayout.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Inject import
if "import { CROP_RS_CONFIG }" not in code:
    code = "import { CROP_RS_CONFIG } from './CropRsConfig';\n" + code

# 2. Update signature
old_sig = "const CropDashboardLayout = ({ onBack, onSignOut }) => {"
new_sig = "const CropDashboardLayout = ({ cropType, cropSummary, cropBlocks, cropIndices, cropLoading, cropError, mapCenter, onBack, onSignOut }) => {\n  const config = CROP_RS_CONFIG[cropType] || CROP_RS_CONFIG['Rice'];"
code = code.replace(old_sig, new_sig)

# 3. Strip out the useEffect that fetches organization data
use_effect_pattern = re.compile(r"useEffect\(\(\) => \{\n\s+let active = true;\n\s+async function loadBackendData\(\) \{.*?\n\s+\}, \[tenant\]\);", re.DOTALL)
code = use_effect_pattern.sub("// Organization data fetch removed", code)

# 4. Remove state hooks and use props
code = code.replace("const [stats, setStats] = useState(null);", "const stats = cropSummary;")
code = code.replace("const [trends, setTrends] = useState(null);", "const trends = null;")
code = code.replace("const [plots, setPlots] = useState([]);", "const plots = cropBlocks || [];")
code = code.replace("const [restorationZones, setRestorationZones] = useState([]);", "const restorationZones = [];")
code = code.replace("const [alerts, setAlerts] = useState([]);", "const alerts = [];")
code = code.replace("const [loading, setLoading] = useState(true);", "const loading = cropLoading;")

# Also set the map center correctly based on props if it exists
code = code.replace("const defaultMapCenter = tenant === 'olam' ? [7.873, 8.325] : [6.436, 5.273];", "const defaultMapCenter = mapCenter || [6.436, 5.273];")

# 5. Use dynamic config for indices/colors where obvious
# E.g. in the sidebar or legends, but for now we just make the layout use the props.

with open(filepath, "w", encoding="utf-8") as f:
    f.write(code)

print("Script executed successfully")
