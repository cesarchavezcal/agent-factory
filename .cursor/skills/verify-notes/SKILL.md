---
name: verify-notes
description: Drive the Notes web app and CLI at http://127.0.0.1:4173 with disposable data. Use after UI or storage changes to prove user-visible behavior with artifacts, not self-report.
---

# Verify Notes

Scripted proof for the Notes app in this repo. Read `features/README.md` before driving.

## Launch

From `samples/notes`, with an isolated data directory:

```bash
cd samples/notes
export RUN_ID="${RUN_ID:-$(date +%s)}"
export NOTES_DATA_DIR="/tmp/notes-verify-$RUN_ID"
export PATH="$PWD/bin:$PWD/node_modules/.bin:$PATH"
npm install
npm run control-notes -- launch
```

Ready when `control-notes launch` prints `Notes ready at http://127.0.0.1:4173` and seeded notes exist (`Quarterly plan`, `Grocery list`).

## Doctor

```bash
npm run control-notes -- doctor
```

Require JSON with matching `url`, `dataDir`, and `buildRevision`, and a live pid.

## Drive

Use Playwright via `scripts/control-notes.mjs`:

- Browser: `npm run control-notes -- browser <click|fill|press|snapshot|screenshot> ...`
- CLI: `npm run control-notes -- cli -- notes create ...`

Follow the recipe in `features/create-note.md` for create flows.

## Evidence

Write proof under `artifacts/<feature-id>/`. Each run must include:

- ARIA snapshot and screenshot for UI proof
- CLI stdout and exit code for terminal proof

Artifacts must survive cleanup.

## Cleanup

```bash
npm run control-notes -- cleanup
```

Kills only the pid recorded in `.verify/notes-server.pid`, removes test notes created during the run, and leaves `artifacts/` intact.

## Helpers

All helpers are invoked through `npm run control-notes --` as shown above.
