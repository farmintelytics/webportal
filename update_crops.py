import os

base_dir = r'src/modules/monitoring'
crops = ['cashew', 'cassava', 'cocoa', 'maize', 'oil_palm', 'rubber', 'sugarcane']

for crop in crops:
    filepath = os.path.join(base_dir, crop, 'Monitoring.jsx')
    if not os.path.exists(filepath):
        print(f'{filepath} not found')
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'CropDashboardLayout' in content:
        print(f'Already updated {crop}')
        continue
        
    # Inject import
    content = content.replace("import { useCropMonitoring } from '../shared/useCropMonitoring';",
                              "import { useCropMonitoring } from '../shared/useCropMonitoring';\nimport CropDashboardLayout from '../shared/CropDashboardLayout';")
    
    # Replace RouterProvider
    old_jsx = '<RouterProvider router={router} />'
    new_jsx = f'<CropDashboardLayout onBack={{onBack}} onSignOut={{onSignOut}} cropType="{crop}" cropSummary={{summary}} cropBlocks={{blocks}} />'
    content = content.replace(old_jsx, new_jsx)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Updated {crop}')
