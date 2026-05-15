#!/usr/bin/env bash
set -e

# Usage: ./deploy.sh [patch|minor|major]
# Default bump is patch

BUMP=${1:-patch}

echo "→ Bumping $BUMP version..."
npm version $BUMP

echo "→ Pushing to GitHub..."
git push origin main --follow-tags

echo "→ Publishing to VS Code Marketplace..."
npx vsce publish

echo "→ Packaging for Open VSX..."
VERSION=$(node -e "console.log(require('./package.json').version)")
npx vsce package

echo "→ Publishing to Open VSX..."
npx ovsx publish gossamer-preview-${VERSION}.vsix -p $OVSX_PAT

echo "✓ Published v${VERSION} to GitHub, VS Code Marketplace, and Open VSX"
