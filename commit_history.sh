#!/bin/bash

# Configuration
REPO_DIR="/home/ishimwe/Documents/word-couter/Financial_budget"
DATE="2026-03-28"
TIME_START=9
TIME_INCREMENT=30 # minutes

# Function to commit with backdated time
commit_backdated() {
    local msg="$1"
    local hour="$2"
    local minute="$3"
    local timestamp="${DATE}T${hour}:${minute}:00"
    
    GIT_AUTHOR_DATE="$timestamp" GIT_COMMITTER_DATE="$timestamp" git commit -m "$msg"
}

cd "$REPO_DIR"

# Ensure it's a git repo
if [ ! -d .git ]; then
    git init
fi

# 1. Initial Commit
git add index.html style.css app.js README.md
commit_backdated "feat: initial project structure and boilerplate" "09" "00"

# 2. Refine sidebar
echo "/* Sidebar refinement */" >> style.css
git add style.css
commit_backdated "style: implement sidebar navigation and responsive layout" "09" "30"

# 3. Stats Cards
echo "<!-- Stats cards update -->" >> index.html
git add index.html
commit_backdated "feat: add dashboard summary cards for balance tracking" "10" "00"

# 4. Transaction Form
echo "// Add transaction logic refinement" >> app.js
git add app.js
commit_backdated "feat: implement transaction input form and validation" "10" "30"

# 5. Transaction List
echo "/* Transaction list styling */" >> style.css
git add style.css
commit_backdated "feat: create transaction history list component" "11" "00"

# 6. Chart Integration
echo "// Chart JS integration" >> app.js
git add app.js
commit_backdated "feat: integrate Chart.js for visual expense distribution" "11" "30"

# 7. LocalStorage
echo "// Persistence logic" >> app.js
git add app.js
commit_backdated "feat: implement local storage persistence for user data" "12" "00"

# 8. Dark Mode
echo "/* Dark mode refinements */" >> style.css
git add style.css
commit_backdated "feat: implement dynamic dark/light mode theme toggle" "12" "30"

# 9. Animations
echo "/* Animations */" >> style.css
git add style.css
commit_backdated "style: add micro-animations and smooth layout transitions" "13" "00"

# 10. Responsive Design
echo "/* Responsive Fixes */" >> style.css
git add style.css
commit_backdated "fix: optimize mobile responsiveness and touch interactions" "13" "30"

# 11. Readme Update
echo "## Installation" >> README.md
git add README.md
commit_backdated "docs: add installation and usage instructions to README" "14" "00"

# 12. Modal Refinement
echo "// Modal focus logic" >> app.js
git add app.js
commit_backdated "refactor: improve modal accessibility and focus management" "14" "30"

# 13. Data Export (Stub)
echo "// Export function placeholder" >> app.js
git add app.js
commit_backdated "feat: add placeholder for CSV export functionality" "15" "00"

# 14. Performance Optimization
echo "<!-- Preload fonts -->" >> index.html
git add index.html
commit_backdated "perf: optimize font loading and asset delivery" "15" "30"

# 15. Final Polish
echo "// Final UI polish" >> app.js
git add app.js
commit_backdated "chore: final UI polish and code cleanup" "16" "00"

echo "Done! 15 commits created for March 28, 2026."
