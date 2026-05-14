#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-}"
if [ -z "$NAME" ]; then
  echo "Usage: bash scripts/setup-study.sh <name>"
  echo "Example: bash scripts/setup-study.sh bekzat"
  exit 1
fi

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

need_cmd git
need_cmd node
need_cmd npm
need_cmd claude

echo "Git:    $(git --version)"
echo "Node:   $(node --version)"
echo "npm:    $(npm --version)"
echo "Claude: $(claude --version || true)"

echo "Installing project dependencies..."
npm install

BRANCH="study/${NAME}"
CURRENT_BRANCH="$(git branch --show-current || true)"
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
    git checkout "$BRANCH"
  else
    git checkout -b "$BRANCH"
  fi
fi

mkdir -p .claude
if [ ! -f .claude/settings.local.json ]; then
  cat > .claude/settings.local.json <<'JSON'
{
  "env": {
    "AWS_BEARER_TOKEN_BEDROCK": "PASTE_YOUR_BEDROCK_KEY_HERE"
  }
}
JSON
fi

echo ""
echo "Setup complete."
echo "Branch: $BRANCH"
echo "Next steps:"
echo "1. Open .claude/settings.local.json and paste your Bedrock key into AWS_BEARER_TOKEN_BEDROCK."
echo "2. Run 'claude' in the terminal, or open this folder in VSCode and use the Claude Code extension."
