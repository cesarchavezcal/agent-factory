# Agent notes

Cursor app. Factory chats use **Composer**. Prefer **Grok**, or let pstack subagents `inherit-parent`.

## Factory

One work item. One orchestrator (`/factory-foreman`). Config: `.factory/config.json`. **`autonomy: full`** — the foreman chains every stage in one run and only waits on **merge** (or a hard blocker).

Mix **three plugins** — not three factories:

| Pack | Owns |
|---|---|
| Compound Engineering | `/ce-brainstorm`, `/ce-plan`, `docs/plans/`, `/ce-compound` |
| Matt Pocock skills | `/grill-with-docs`, `CONTEXT.md`, tickets, `/tdd` seams |
| pstack | `/poteto-mode` (builder), `verify-*`, `/interrogate` |

| Stage | Primary skill |
|---|---|
| Intake | Create `.factory/work-items/<id>.json` |
| Triage | Matt `/diagnosing-bugs` or `/triage`; pstack `/how`, `/why` |
| Planning | CE `/ce-plan`; Matt grill/tickets if terms or slices need it |
| Building | **pstack `/poteto-mode`** (Matt `/tdd` inside, not `/implement`) |
| Reviewing | `/interrogate`, `/blast-radius`, configured `verify-*` |
| Handoff | PR + evidence; human merges |
| Memory | CE `/ce-compound` when the lesson is durable |

Do not run `/lfg` and `/poteto-mode` on the same item. Do not run Matt `/implement` as the factory builder.

Sample app: `samples/notes`. Proof: `/verify-notes` (from `samples/notes`, `./scripts/prove-create-note.sh`).
