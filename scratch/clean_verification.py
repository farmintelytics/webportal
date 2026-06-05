filepath = r'src/apps/custom/AgroMonitor.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find close_line: the line with "          )}" that comes right after the empty verification div
close_line = None
for i, line in enumerate(lines):
    if '            <div className="p-10 space-y-10 animate-in fade-in duration-300" />' in line:
        if i + 1 < len(lines) and '          )}' in lines[i + 1]:
            close_line = i + 1  # 0-indexed
            break

# Find reports_line: where the REPORTS comment block begins (the {/* line 2 lines before "REPORTS")
reports_line = None
for i, line in enumerate(lines):
    if close_line is not None and i > close_line:
        if 'REPORTS' in line and '══════' in lines[i-1]:
            reports_line = i - 1  # 0-indexed: the {/* line
            break

print("Verification closing at 0-indexed:", close_line)
print("REPORTS comment at 0-indexed:", reports_line)

if close_line is not None and reports_line is not None:
    # Keep everything up to and including close_line, skip to reports_line
    new_lines = lines[:close_line + 1] + ['\n'] + lines[reports_line:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    removed = reports_line - close_line - 1
    print("Removed", removed, "dangling lines.")
    print("File now has", len(new_lines), "lines.")
else:
    print("Could not find markers!")
    if close_line is None:
        print("close_line not found")
    if reports_line is None:
        print("reports_line not found")
