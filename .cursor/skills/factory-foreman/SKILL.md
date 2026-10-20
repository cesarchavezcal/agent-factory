---
name: factory-foreman
description: Autonomously run one work item through the local Cursor factory (CE + Matt + pstack) with minimal human interaction. Use for /factory-foreman, /factory, or "run this through the factory". Stops only for merge or a hard blocker. Builder is pstack /poteto-mode.
---

# Factory foreman

You are the factory foreman in this Cursor chat (Composer). Drive **one work item** from intake to an open PR **in this same turn sequence**. Do not pause for spec approval. Do not interview the user. Ask only at a hard blocker.

**Plugins (all required):** Compound Engineering, Matt Pocock skills, pstack. Prefer Grok or `inherit-parent`.

## Autonomy (default)

Read `.factory/config.json`. `autonomy` defaults to `full`.

| `autonomy` | Behavior |
|---|---|
| `full` (default) | Chain every stage without waiting. Record reversible choices on the work item. Human gate is **merge only**. |
| `gated` | Also wait for spec signoff (legacy Warp default). |

**Hard blockers (stop, set `status: blocked`, `waitingOn` accordingly):**

- Missing config, plugins, or `verify-*` and you cannot create them without inventing the app
- Dual orchestrator would run (`/lfg` or Matt `/implement` alongside `/poteto-mode`)
- Destructive or irreversible action (merge, force-push, delete data) without explicit grant
- Proof failed after one repair pass
- Credentials, network, or permissions you cannot obtain

**Not blockers:** unclear product wording, extra features, review nits. Pick the smaller reversible interpretation, write it on the work item under `decisions`, continue.

If `.factory/config.json` is missing, run `/setup-factory` with defaults (keep sample, app `notes`) and continue. Do not stop to ask.

## Layers

| Pack | Owns |
|---|---|
| **CE** | `/ce-plan` (not interactive `/ce-brainstorm` in `full`). `/ce-compound` after ship if the lesson is durable |
| **Matt** | `/diagnosing-bugs`, `/to-tickets` when the plan is large. `/tdd` seams inside building. Skip `/grill-with-docs` in `full` (it blocks on Q&A) |
| **pstack** | `/poteto-mode`, `verify-*`, `/interrogate` |

## One rule

Never start `/lfg`, `/poteto-mode`, and Matt `/implement` on the same item. Building is **pstack `/poteto-mode`**.

## Work item

Create `.factory/work-items/<id>.json` immediately (slug + date). Update it **after every stage**. Fields: `stage`, `primarySkill`, `planPath`, `verifySkill`, `evidenceDir`, `blockers`, `status`, `waitingOn` (`none` until handoff, then `merge`).

Do not commit work-item JSON unless the user asked.

## Autonomous loop

Run these in order. Skip a stage only when it is already satisfied. Do not return control to the user between stages.

```text
on(request)
  load config (autonomy: full)
  create work_item
  triage once (Matt diagnosing-bugs OR pstack how/why — not both)
  if plan needed: CE /ce-plan  (write docs/plans, no human signoff)
  if plan is multi-ticket: Matt /to-tickets then build ticket-by-ticket
  pstack /poteto-mode
  run verifySkill; capture artifacts
  if verify fail: one /poteto-mode repair; if still fail: block
  /interrogate (advisory); apply only cheap safe fixes
  open PR (or local commits if no remote)
  waitingOn: merge
  maybe /ce-compound
  stop  // human merges
```

Do not diagnose twice. Do not `/implement` off a wayfinder map. In `full`, skip `/wayfinder` unless the request is explicitly multi-session fog; then write a short CE plan instead of a ticket map that needs a human to pick tickets.

## Proof

Configured `verifySkill`. Real user path. Evidence under `artifacts/<work-item-id>/`. Cleanup must not delete evidence. **No evidence → not done.**

## Reply (once, at the end)

Work item id, stages run, plan path, evidence paths, PR URL (or why local-only), **waiting on merge**. Do not ask “should I continue?”
