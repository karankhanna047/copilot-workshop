#!/bin/bash
#
# COPILOT HOOK EXAMPLE: Pre-commit Lint
#
# This hook runs automatically BEFORE Copilot commits code.
# It ensures all generated code passes linting before being committed.
#
# In VS Code, hooks are configured in .vscode/settings.json:
# {
#   "github.copilot.chat.agent.hooks": {
#     "preCommit": ".github/hooks/pre-commit-lint.sh"
#   }
# }

echo "Running pre-commit lint check..."

# Run ESLint on staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|ts|jsx|tsx)$')

if [ -n "$STAGED_FILES" ]; then
  npx eslint $STAGED_FILES --quiet
  if [ $? -ne 0 ]; then
    echo "Lint errors found. Please fix before committing."
    exit 1
  fi
fi

echo "Lint check passed."
exit 0
