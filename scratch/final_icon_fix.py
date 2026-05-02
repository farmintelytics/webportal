import os
import re

root_dir = r'c:\Users\Admin\Desktop\ongoing_tasks\farmintelytics\webportal\src\apps'

icons_to_check = ['Waves', 'Droplets', 'Activity', 'Zap', 'Sun', 'Trees', 'CloudRain', 'Leaf', 'Thermometer', 'TrendingUp', 'Calendar', 'Shield', 'Search', 'Filter', 'LayoutDashboard', 'MapPin', 'BarChart4', 'Globe', 'Layers', 'Satellite', 'ChevronLeft', 'Grid', 'User', 'Lock', 'Mail', 'Eye', 'EyeOff', 'CheckCircle2', 'Box', 'Camera', 'Navigation', 'Clock', 'ArrowRight', 'SlidersHorizontal', 'Download', 'History', 'Settings2', 'Info', 'RefreshCw', 'FileText', 'AlertCircle', 'Wind', 'ArrowLeft', 'Maximize2', 'Bell', 'X']

def fix_missing_icons(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    used_icons = set(re.findall(r'<([A-Z][a-zA-Z0-9]+)\s*\/?>', content))
    match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', content, re.MULTILINE)
    if match:
        imported_block = match.group(1)
        imported_icons = [i.strip() for i in imported_block.split(',')]
        clean_imports = set()
        for i in imported_icons:
            if ' as ' in i:
                clean_imports.add(i.split(' as ')[1].strip())
                clean_imports.add(i.split(' as ')[0].strip())
            else:
                clean_imports.add(i.strip())
        
        missing = [icon for icon in used_icons if icon in icons_to_check and icon not in clean_imports]
        
        if missing:
            new_block = imported_block.strip()
            if not new_block.endswith(','):
                new_block += ','
            new_block += '\n   ' + ',\n   '.join(missing)
            
            new_content = content.replace(imported_block, new_block)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed missing icons in {filepath}: {', '.join(missing)}")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.jsx'):
            fix_missing_icons(os.path.join(root, file))
