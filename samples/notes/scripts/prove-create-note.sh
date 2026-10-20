#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export RUN_ID="$(date +%s)-$$"
export NOTES_DATA_DIR="/tmp/notes-verify-$RUN_ID"
export PATH="$ROOT/bin:$ROOT/node_modules/.bin:$PATH"

npm install --silent
npm run control-notes -- launch
npm run control-notes -- doctor

node scripts/drive-create-note.mjs

npm run control-notes -- cleanup

test -f artifacts/create-note/list.aria.txt
test -f artifacts/create-note/list.png
grep -q "Release checklist" artifacts/create-note/list.aria.txt
grep -q "CLI note" artifacts/create-note/list.aria.txt
echo "prove-create-note: OK"
