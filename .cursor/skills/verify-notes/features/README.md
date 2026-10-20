# Notes verification map

Read this index before driving Notes. Use the matching feature file as the recipe.

## Baseline preconditions

- Launch at `http://127.0.0.1:4173` with `NOTES_DATA_DIR=/tmp/notes-verify-$RUN_ID`.
- Seed notes `Quarterly plan` and `Grocery list` (automatic on launch).
- Run `npm run control-notes -- doctor` and require the expected URL, data directory, and build revision.
- Never drive an instance not started by this verification run.

## Driving conventions

- Prefer ARIA roles and accessible names.
- Browser actions via `npm run control-notes -- browser ...`
- CLI actions via `npm run control-notes -- cli -- notes ...`
- Keep proof artifacts; restore seeded data after mutations.

## Features

- [Create a note](./create-note.md) — browser and CLI creation, cancel, persistence.
