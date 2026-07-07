import os
import shutil

src_dir = r"c:\Users\Admin\Desktop\ongoing_tasks\farmintelytics\full app\farmintelytics-webportal\src"
old_admin = os.path.join(src_dir, "modules", "admin")
new_admin = os.path.join(src_dir, "farmintelytics-admin")

# 1. Move the folder
if os.path.exists(old_admin):
    if os.path.exists(new_admin):
        shutil.rmtree(new_admin)
    shutil.copytree(old_admin, new_admin)
    shutil.rmtree(old_admin)
    print("Moved admin folder successfully.")
else:
    print("Old admin folder not found or already moved.")

# 2. Update relative imports in the moved files
for dirpath, _, filenames in os.walk(new_admin):
    for f in filenames:
        if f.endswith(".jsx"):
            path = os.path.join(dirpath, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            
            # If it's a page inside pages/ subfolder
            if "pages" in dirpath:
                updated = content.replace("../../../services/", "../../services/")
                updated = updated.replace("../../../components/", "../../components/")
            else:
                # If it's AdminLogin.jsx or AdminPortal.jsx at the root of new_admin
                updated = content.replace("../../services/", "../services/")
                updated = updated.replace("../../components/", "../components/")
                updated = updated.replace("./pages/", "./pages/") # stays same
            
            with open(path, "w", encoding="utf-8") as file:
                file.write(updated)
            print(f"Updated imports in {f}")

# 3. Update App.jsx imports
app_path = os.path.join(src_dir, "App.jsx")
if os.path.exists(app_path):
    with open(app_path, "r", encoding="utf-8") as file:
        app_content = file.read()
    
    updated_app = app_content.replace("./modules/admin/AdminLogin", "./farmintelytics-admin/AdminLogin")
    updated_app = updated_app.replace("./modules/admin/AdminPortal", "./farmintelytics-admin/AdminPortal")
    
    with open(app_path, "w", encoding="utf-8") as file:
        file.write(updated_app)
    print("Updated App.jsx imports.")
