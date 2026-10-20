# Create a note

Users save a titled note from the browser or CLI, cancel drafts, and confirm persistence from the list.

## Sub-features

- `create-open` opens a blank editor from toolbar or `n`.
- `create-save` persists title and body.
- `create-cancel` discards an unfinished browser draft.
- `create-cli` creates the same note shape from the terminal.

## How to get to it (user POV)

- Choose `New note` in the toolbar.
- Press `n` while focus is outside an editable field.
- Run `notes create --title <title> --body <body>` in a terminal.

## Driving it with control-notes

Preconditions:

- Notes is healthy at `http://127.0.0.1:4173`.
- No note titled `Release checklist`.
- Doctor reports the expected URL and disposable data directory.

- **Open editor.** `npm run control-notes -- browser click --role button --name "New note"`. Form `Note editor` appears with focus in `Title`.
- **Enter content.** Fill title `Release checklist` and body `Tag and publish`. `Save note` becomes enabled.
- **Save note.** Click `Save note`. Status reads `Note saved` and heading reads `Release checklist`.
- **Confirm persistence.** Click `All notes`, then link `Release checklist`. Editor shows saved values.
- **Cancel draft.** New note, title `Discard me`, click `Cancel`. List has no `Discard me` link.
- **CLI entry.** `npm run control-notes -- cli -- notes create --title "CLI note" --body "Created from terminal" --format json` exits 0 with id and title in stdout.
- **Proof.** Snapshot and screenshot list showing `Release checklist` and `CLI note` under `artifacts/create-note/`.

## Gotchas

- `n` while a textbox is focused types a character instead of opening an editor.
- Titles are trimmed on save; assert rendered title, not draft input.
- Save status alone is insufficient — reopen from the list.
- Cleanup removes `Release checklist` and `CLI note` but keeps artifacts.
