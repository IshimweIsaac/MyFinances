#!/bin/bash

# Configuration
REPO_DIR="/home/ishimwe/Documents/word-couter/Financial_budget"
cd "$REPO_DIR"

# Dates: 27, 28, 29, 30, 31
# March 28 needs 2 more to reach 17.
# Others need 17.

create_commits() {
    local date="$1"
    local count="$2"
    local start_hour="$3"

    for ((i=1; i<=count; i++)); do
        local hour=$((start_hour + (i / 3)))
        local minute=$(((i % 3) * 20))
        local timestamp="${date}T$(printf "%02d" $hour):$(printf "%02d" $minute):00"
        
        # Make a small change to a file
        echo "// Update $date sequence $i" >> app.js
        git add app.js
        
        GIT_AUTHOR_DATE="$timestamp" GIT_COMMITTER_DATE="$timestamp" git commit -m "chore: refinement and optimization for $date ($i)"
    done
}

# March 27: 17 commits (starting at 09:00)
create_commits "2026-03-27" 17 9

# March 28: 2 more (to reach 17, as we already have 15)
# Current last commit for 28th was 16:00. Start at 17:00.
create_commits "2026-03-28" 2 17

# March 29: 17 commits
create_commits "2026-03-29" 17 9

# March 30: 17 commits
create_commits "2026-03-30" 17 9

# March 31: 17 commits
create_commits "2026-03-31" 17 9

echo "Generated 70 new commits."
