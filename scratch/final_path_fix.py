import os
import re

apps_dir = r'c:\Users\Admin\Desktop\ongoing_tasks\farmintelytics\webportal\src\apps'

def fix_imports(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parts = filepath.replace('\\', '/').split('/')
    try:
        src_index = parts.index('src')
        file_index = len(parts) - 1
        depth = file_index - src_index - 1
        
        correct_path = ('../' * depth) + 'shared/components/SharedComponents'
        
        # Match any variation of ../shared/components/SharedComponents
        pattern = r'from\s+[\'"](\.\.?/)+shared/components/SharedComponents[\'"]'
        replacement = f"from '{correct_path}'"
        
        new_content = re.sub(pattern, replacement, content)
        
    except ValueError:
        return

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed imports in {filepath} (Depth: {depth}, Path: {correct_path})")

for root, dirs, files in os.walk(apps_dir):
    for file in files:
        if file.endswith('.jsx'):
            fix_imports(os.path.join(root, file))
