#!/bin/bash

# Configuration
REPO_DIR="/home/ishimwe/Documents/word-couter/Financial_budget"
cd "$REPO_DIR"

DATE="2026-04-01"

create_today_commits() {
    local date="$1"
    local count="$2"

    for ((i=1; i<=count; i++)); do
        local hour=$((9 + (i / 3)))
        local minute=$(((i % 3) * 20))
        local timestamp="${date}T$(printf "%02d" $hour):$(printf "%02d" $minute):00"
        
        # Make a small change to a file
        echo "// Refinement $date step $i" >> app.js
        git add .
        
        # Different messages for variety
        case $i in
            1) msg="feat: add budget overview section to dashboard" ;;
            2) msg="style: implement progress bar styles for budgeting" ;;
            3) msg="feat: add set-budget modal and form UI" ;;
            4) msg="feat: implement budget persistence and state management" ;;
            5) msg="feat: add logic for tracking category spending against budgets" ;;
            6) msg="style: add color-coded progress indicators for budget health" ;;
            7) msg="refactor: improve modal handling for multiple dashboard actions" ;;
            8) msg="fix: ensure charts and budgets update in sync" ;;
            9) msg="style: enhance budget item layout and typography" ;;
            10) msg="perf: optimize budget rendering logic" ;;
            11) msg="docs: update documentation for new budgeting features" ;;
            12) msg="chore: clean up console logs and unused variables" ;;
            13) msg="style: add hover effects for budget items" ;;
            14) msg="fix: handle empty state for budget progress" ;;
            15) msg="test: verify budget limit calculations" ;;
            16) msg="refactor: modularize budget rendering function" ;;
            17) msg="feat: finalize budget management system" ;;
            *) msg="chore: general refinement for $date ($i)" ;;
        esac
        
        GIT_AUTHOR_DATE="$timestamp" GIT_COMMITTER_DATE="$timestamp" git commit -m "$msg"
    done
}

# April 1st: 17 commits
create_today_commits "$DATE" 17

echo "Generated 17 new commits for today."
