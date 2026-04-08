#!/bin/bash
#
# PR REVIEW DEMO - Setup Script
# Run this BEFORE the workshop to prepare the PR review demo.
#
# What it does:
# 1. Creates an initial commit on main
# 2. Creates a branch 'feature/user-search' with the buggy file
# 3. Pushes both to your GitHub repo
# 4. Creates a draft PR (but does NOT add Copilot as reviewer yet -- you do that live)
#
# Prerequisites:
# - gh CLI installed and authenticated
# - A GitHub repo created for this workshop
#
# Usage:
#   cd copilot-workshop
#   chmod +x exercises/pr_review_demo/SETUP_PR_DEMO.sh
#   ./exercises/pr_review_demo/SETUP_PR_DEMO.sh

set -e

echo "=== PR Review Demo Setup ==="

# Step 1: Make sure we're on main with an initial commit
git checkout main 2>/dev/null || git checkout -b main

# Commit the base project if not already committed
git add -A
git commit -m "Initial project setup" --allow-empty 2>/dev/null || true

# Step 2: Create the buggy feature branch
git checkout -b feature/user-search

# Copy the buggy file into the actual src directory
cp exercises/pr_review_demo/buggy_search_service.js src/services/searchService.js

git add src/services/searchService.js
git commit -m "Add user search service

Implements search functionality for user profiles with external data fetching."

echo ""
echo "=== Local setup complete ==="
echo ""
echo "Next steps (do these only if you have a GitHub repo):"
echo "  git push -u origin main"
echo "  git push -u origin feature/user-search"
echo "  gh pr create --title 'Add user search service' --body 'Implements search for user profiles' --draft"
echo ""
echo "Then during the workshop:"
echo "  gh pr edit <PR_NUMBER> --add-reviewer copilot"
echo ""
echo "Or switch back to main to reset:"
echo "  git checkout main"
echo "  git branch -D feature/user-search"
