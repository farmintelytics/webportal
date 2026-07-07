import os

pages_dir = r"c:\Users\Admin\Desktop\ongoing_tasks\farmintelytics\full app\farmintelytics-webportal\src\farmintelytics-admin\pages"

replacements = [
    # 1. Backgrounds
    ("background: '#0a0a0f'", "background: '#f8fafc'"),
    ("background: '#0d1117'", "background: '#ffffff'"),
    ("background: '#13131a'", "background: '#ffffff'"),
    ("background: '#1a1f2c'", "background: '#ffffff'"),
    ("background: 'rgba(255,255,255,0.02)'", "background: '#ffffff'"),
    ("background: 'rgba(255,255,255,0.03)'", "background: '#ffffff'"),
    ("background: 'rgba(255,255,255,0.04)'", "background: '#ffffff'"),
    ("background: 'rgba(255,255,255,0.05)'", "background: '#ffffff'"),
    ("background: 'rgba(255,255,255,0.06)'", "background: '#ffffff'"),
    ("background: 'rgba(255,255,255,0.08)'", "background: '#ffffff'"),
    ("background: 'rgba(0,0,0,0.2)'", "background: '#f8fafc'"),
    ("background: 'rgba(0,0,0,0.4)'", "background: '#f8fafc'"),
    ("background: 'rgba(255,255,255,0.01)'", "background: '#ffffff'"),
    ("background: 'rgba(255,255,255,0.05)'", "background: '#ffffff'"),
    ("background: '#111827'", "background: '#ffffff'"),
    ("background: '#1f2937'", "background: '#ffffff'"),
    ("background: '#374151'", "background: '#f1f5f9'"),

    # 2. Borders
    ("border: '1px solid rgba(255,255,255,0.05)'", "border: '1px solid #cbd5e1'"),
    ("border: '1px solid rgba(255,255,255,0.06)'", "border: '1px solid #e2e8f0'"),
    ("border: '1px solid rgba(255,255,255,0.07)'", "border: '1px solid #cbd5e1'"),
    ("border: '1px solid rgba(255,255,255,0.08)'", "border: '1px solid #cbd5e1'"),
    ("border: '1px solid rgba(255,255,255,0.1)'", "border: '1px solid #cbd5e1'"),
    ("border: '1px solid rgba(255,255,255,0.12)'", "border: '1px solid #cbd5e1'"),
    ("border: '1px solid rgba(255,255,255,0.15)'", "border: '1px solid #cbd5e1'"),
    ("border: '1px solid rgba(255,255,255,0.2)'", "border: '1px solid #cbd5e1'"),
    ("border: '1px solid #1e293b'", "border: '1px solid #cbd5e1'"),
    ("border: '1px solid #374151'", "border: '1px solid #cbd5e1'"),
    ("borderBottom: '1px solid rgba(255,255,255,0.06)'", "borderBottom: '1px solid #e2e8f0'"),
    ("borderBottom: '1px solid rgba(255,255,255,0.08)'", "borderBottom: '1px solid #e2e8f0'"),
    ("borderTop: '1px solid rgba(255,255,255,0.06)'", "borderTop: '1px solid #e2e8f0'"),
    ("borderTop: '1px solid rgba(255,255,255,0.08)'", "borderTop: '1px solid #e2e8f0'"),
    ("borderRight: '1px solid rgba(255,255,255,0.08)'", "borderRight: '1px solid #e2e8f0'"),

    # 3. Text colors
    ("color: '#fff'", "color: '#0f172a'"),
    ("color: '#ffffff'", "color: '#0f172a'"),
    ("color: '#e5e7eb'", "color: '#1e293b'"),
    ("color: '#9ca3af'", "color: '#334155'"),
    ("color: '#4b5563'", "color: '#64748b'"),
    ("color: '#374151'", "color: '#475569'"),
    ("color: '#1f2937'", "color: '#64748b'"),
    ("color: '#6b7280'", "color: '#475569'"),
    ("color: '#f3f4f6'", "color: '#0f172a'"),
    ("color: '#d1d5db'", "color: '#334155'"),
    ("color: '#9ba3af'", "color: '#475569'"),
    ("color: '#a0aec0'", "color: '#475569'"),
    ("color: '#718096'", "color: '#64748b'"),
]

for filename in os.listdir(pages_dir):
    if filename.endswith(".jsx"):
        path = os.path.join(pages_dir, filename)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        orig = content
        for dark, light in replacements:
            content = content.replace(dark, light)
        
        # Specific fixes for drag & drop zone inside Boundaries.jsx
        if filename == "Boundaries.jsx":
            content = content.replace("background: dragOver ? 'rgba(22,163,74,0.1)' : 'rgba(255,255,255,0.02)'",
                                      "background: dragOver ? 'rgba(22,163,74,0.05)' : '#ffffff'")
            content = content.replace("border: dragOver ? '2px dashed #16a34a' : '2px dashed rgba(255,255,255,0.15)'",
                                      "border: dragOver ? '2px dashed #16a34a' : '2px dashed #cbd5e1'")
        
        # Specific fixes for scheduler card row backgrounds in Scheduler.jsx
        if filename == "Scheduler.jsx":
            content = content.replace("background: 'rgba(255,255,255,0.01)'", "background: '#ffffff'")
            content = content.replace("background: active ? 'rgba(22,163,74,0.12)' : 'rgba(255,255,255,0.03)'",
                                      "background: active ? 'rgba(22,163,74,0.08)' : '#ffffff'")
            content = content.replace("color: active ? '#16a34a' : '#6b7280'", "color: active ? '#16a34a' : '#475569'")

        # Specific fixes for Tasks columns & card row backgrounds in Tasks.jsx
        if filename == "Tasks.jsx":
            content = content.replace("bg: 'rgba(107,114,128,0.08)'", "bg: 'rgba(107,114,128,0.04)'")
            content = content.replace("bg: 'rgba(245,158,11,0.08)'", "bg: 'rgba(245,158,11,0.04)'")
            content = content.replace("bg: 'rgba(59,130,246,0.08)'", "bg: 'rgba(59,130,246,0.04)'")
            content = content.replace("bg: 'rgba(22,163,74,0.08)'", "bg: 'rgba(22,163,74,0.04)'")
            content = content.replace("background: isDraggingOver ? 'rgba(255,255,255,0.02)' : 'transparent'",
                                      "background: isDraggingOver ? '#f1f5f9' : 'transparent'")
            content = content.replace("onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)';",
                                      "onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc';")
            content = content.replace("onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)';",
                                      "onMouseLeave={e => { e.currentTarget.style.background = '#ffffff';")
            # input labels in popup
            content = content.replace("background: 'rgba(0,0,0,0.3)'", "background: '#f8fafc'")

        # Specific fixes for PipelineConfig split layout
        if filename == "PipelineConfig.jsx":
            content = content.replace("background: '#1e1e24'", "background: '#f8fafc'")
            content = content.replace("color: '#cbd5e1'", "color: '#334155'")
            content = content.replace("color: '#808080'", "color: '#64748b'")

        if content != orig:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Re-themed {filename}")
        else:
            print(f"No changes made to {filename}")
