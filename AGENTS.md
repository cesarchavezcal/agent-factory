# Agent notes

Cursor app. Factory chats use **Composer**. Prefer **Grok**, or let pstack subagents `inherit-parent`.

## Factory

One work item. One orchestrator (`/factory-foreman`). Config: `.factory/config.json`.

| Stage | Primary skill |
|---|---|
| Intake | Create `.factory/work-items/<id>.json` |
| Triage | pstack `/how`, `/why`; bugs via `/poteto-mode` investigation |
| Planning | Plan in-repo; `/sharpen` or `/architect` when needed |
| Building | **pstack `/poteto-mode`** |
| Reviewing | `/interrogate`, `/blast-radius`, configured `verify-*` |
| Handoff | PR + evidence; human merges |

Do not run `/lfg` and `/poteto-mode` on the same item.

Sample app: `samples/notes`. Proof: `/verify-notes` (from `samples/notes`, `./scripts/prove-create-note.sh`).

Optional later: Compound Engineering (`docs/plans/`, `/ce-compound`), Matt (`CONTEXT.md`, tickets). Not required for this template.
