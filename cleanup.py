import re
import os

BASE = "/home/shresth/Desktop/Qunitet_"

# Emoji regex (covers most common emojis)
EMOJI_RE = re.compile(
    "["
    "\U0001F600-\U0001F64F"  # emoticons
    "\U0001F300-\U0001F5FF"  # symbols & pictographs
    "\U0001F680-\U0001F6FF"  # transport & map symbols
    "\U0001F1E0-\U0001F1FF"  # flags
    "\U00002702-\U000027B0"
    "\U000024C2-\U0001F251"
    "\U0001f926-\U0001f937"
    "\U00010000-\U0010ffff"
    "\u2640-\u2642"
    "\u2600-\u2B55"
    "\u200d"
    "\u23cf"
    "\u23e9"
    "\u231a"
    "\ufe0f"
    "\u3030"
    "\u2764"
    "\u2122"
    "\u2611"
    "\u26A0"
    "\u2714"
    "\u2716"
    "\u2728"
    "\u2705"
    "\u274C"
    "\u274E"
    "\u2795"
    "\u2796"
    "\u2797"
    "\u27A1"
    "\u27B0"
    "\u2934"
    "\u2935"
    "]+", flags=re.UNICODE
)

def remove_emojis(text):
    return EMOJI_RE.sub("", text)

def clean_python_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    in_docstring = False
    docstring_char = None
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Handle docstrings (triple quotes)
        if not in_docstring:
            if stripped.startswith('"""') or stripped.startswith("'''"):
                docstring_char = stripped[:3]
                # Check if it closes on the same line (e.g., """text""")
                rest = stripped[3:]
                if docstring_char in rest:
                    # Single-line docstring — skip entire line
                    i += 1
                    continue
                else:
                    in_docstring = True
                    i += 1
                    continue
            
            # Remove # comments (but not #! shebang and not inside strings)
            # Also skip lines like `# noqa: F401` — actually remove those too
            if stripped.startswith('#'):
                # Full-line comment — skip
                i += 1
                continue
            
            # Remove inline # comments (simple heuristic: find # not in string)
            # Handle carefully - don't strip # inside strings
            comment_idx = find_comment_start(line)
            if comment_idx is not None:
                line = line[:comment_idx].rstrip() + '\n'
                if line.strip() == '':
                    i += 1
                    continue
            
            # Remove emojis
            line = remove_emojis(line)
            
            new_lines.append(line)
        else:
            # Inside docstring
            if docstring_char in stripped:
                in_docstring = False
            i += 1
            continue
        
        i += 1
    
    # Remove consecutive blank lines (max 2)
    result = []
    blank_count = 0
    for line in new_lines:
        if line.strip() == '':
            blank_count += 1
            if blank_count <= 2:
                result.append(line)
        else:
            blank_count = 0
            result.append(line)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(result)
    print(f"  Cleaned: {filepath}")


def find_comment_start(line):
    """Find the index of a # comment that's NOT inside a string."""
    in_single = False
    in_double = False
    i = 0
    while i < len(line):
        ch = line[i]
        if ch == '\\' and i + 1 < len(line):
            i += 2
            continue
        if ch == '"' and not in_single:
            in_double = not in_double
        elif ch == "'" and not in_double:
            in_single = not in_single
        elif ch == '#' and not in_single and not in_double:
            return i
        i += 1
    return None


def clean_ts_tsx_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    new_lines = []
    in_block_comment = False
    
    for line in lines:
        if in_block_comment:
            # Look for end of block comment
            end_idx = line.find('*/')
            if end_idx != -1:
                in_block_comment = False
                rest = line[end_idx + 2:]
                if rest.strip():
                    new_lines.append(rest)
            continue
        
        stripped = line.strip()
        
        # Skip full-line // comments
        if stripped.startswith('//'):
            # But keep eslint-disable comments
            if 'eslint-disable' in stripped:
                line = remove_emojis(line)
                new_lines.append(line)
            continue
        
        # Handle JSX comments {/* ... */}
        line = re.sub(r'\s*\{/\*.*?\*/\}\s*', '', line)
        
        # Handle /* ... */ block comments on one line  
        line = re.sub(r'/\*.*?\*/', '', line)
        
        # Check if block comment starts on this line (and doesn't end)
        block_start = line.find('/*')
        if block_start != -1 and '*/' not in line[block_start:]:
            line = line[:block_start]
            in_block_comment = True
            if line.strip():
                line = remove_emojis(line)
                new_lines.append(line)
            continue
        
        # Remove inline // comments (simple: not inside strings)
        comment_idx = find_ts_comment_start(line)
        if comment_idx is not None:
            line = line[:comment_idx].rstrip()
            if not line.strip():
                continue
        
        # Remove emojis
        line = remove_emojis(line)
        
        new_lines.append(line)
    
    # Remove excessive blank lines
    result = []
    blank_count = 0
    for line in new_lines:
        if line.strip() == '':
            blank_count += 1
            if blank_count <= 2:
                result.append(line)
        else:
            blank_count = 0
            result.append(line)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(result))
    print(f"  Cleaned: {filepath}")


def find_ts_comment_start(line):
    """Find // comment not inside a string or URL."""
    in_single = False
    in_double = False
    in_backtick = False
    i = 0
    while i < len(line):
        ch = line[i]
        if ch == '\\' and i + 1 < len(line):
            i += 2
            continue
        if ch == '`' and not in_single and not in_double:
            in_backtick = not in_backtick
        elif ch == '"' and not in_single and not in_backtick:
            in_double = not in_double
        elif ch == "'" and not in_double and not in_backtick:
            in_single = not in_single
        elif ch == '/' and i + 1 < len(line) and line[i+1] == '/' and not in_single and not in_double and not in_backtick:
            # Check if this is part of a URL (http:// or https://)
            if i >= 1 and line[i-1] == ':':
                i += 1
                continue
            return i
        i += 1
    return None


def clean_md_file(filepath):
    """Remove emojis from markdown files."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = remove_emojis(content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  Cleaned: {filepath}")


# ---- Backend Python files ----
print("=== Backend Python files ===")
py_files = [
    "backend/app/main.py",
    "backend/app/database.py",
    "backend/app/core/config.py",
    "backend/app/core/security.py",
    "backend/app/models/user.py",
    "backend/app/models/student.py",
    "backend/app/models/instructor.py",
    "backend/app/models/course.py",
    "backend/app/models/enrollment.py",
    "backend/app/models/university.py",
    "backend/app/models/content.py",
    "backend/app/models/topic.py",
    "backend/app/models/textbook.py",
    "backend/app/models/course_topic.py",
    "backend/app/models/textbook_used.py",
    "backend/app/models/__init__.py",
    "backend/app/schemas/user.py",
    "backend/app/schemas/course.py",
    "backend/app/schemas/enrollment.py",
    "backend/app/routers/admin.py",
    "backend/app/routers/auth.py",
    "backend/app/routers/analyst.py",
    "backend/app/routers/courses.py",
    "backend/app/routers/instructors.py",
    "backend/app/routers/students.py",
    "backend/app/routers/content.py",
    "backend/app/services/auth_service.py",
    "backend/app/services/analyst_service.py",
    "backend/app/services/course_service.py",
    "backend/app/services/enroll_service.py",
    "backend/seed.py",
    "backend/update_content.py",
    "backend/main.py",
    "presentation/create_ppt.py",
]

for f in py_files:
    fp = os.path.join(BASE, f)
    if os.path.exists(fp):
        clean_python_file(fp)

# ---- Frontend TS/TSX files ----
print("\n=== Frontend TS/TSX files ===")
tsx_files = [
    "frontend/lib/api.ts",
    "frontend/lib/auth-context.tsx",
    "frontend/lib/utils.ts",
    "frontend/app/page.tsx",
    "frontend/app/layout.tsx",
    "frontend/app/analyst/dashboard/page.tsx",
    "frontend/app/student/dashboard/page.tsx",
    "frontend/app/student/login/page.tsx",
    "frontend/app/student/signup/page.tsx",
    "frontend/app/admin/dashboard/page.tsx",
    "frontend/app/admin/login/page.tsx",
    "frontend/app/instructor/dashboard/page.tsx",
    "frontend/app/instructor/login/page.tsx",
    "frontend/app/analyst/login/page.tsx",
    "frontend/app/courses/[id]/page.tsx",
    "frontend/components/dashboard-shell.tsx",
    "frontend/components/features-section.tsx",
    "frontend/components/footer.tsx",
    "frontend/components/hero-section.tsx",
    "frontend/components/navbar.tsx",
    "frontend/components/quintet-logo.tsx",
    "frontend/components/role-cards.tsx",
    "frontend/components/theme-provider.tsx",
    "frontend/components/theme-toggle.tsx",
    "frontend/hooks/use-mobile.tsx",
    "frontend/hooks/use-toast.ts",
]

for f in tsx_files:
    fp = os.path.join(BASE, f)
    if os.path.exists(fp):
        clean_ts_tsx_file(fp)

# ---- Markdown files (just remove emojis) ----
print("\n=== Markdown files ===")
md_files = [
    "README.md",
    "frontend/README.md",
    "backend/README.md",
]

for f in md_files:
    fp = os.path.join(BASE, f)
    if os.path.exists(fp):
        clean_md_file(fp)

print("\nDone! All comments and emojis removed.")
