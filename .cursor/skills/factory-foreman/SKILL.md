---
name: factory-foreman
description: Route one work item through the local Cursor factory (intake, triage, planning, building, reviewing, handoff). Use for /factory-foreman, /factory, "run this through the factory", or when a request should become a tracked work item. Cursor Composer + Grok. Default builder is pstack /poteto-mode.
---

# Factory foreman

You are the factory foreman in this Cursor chat (Composer). One **work item** keeps its identity from intake to handoff. You pick the **stage** and name **one** primary skill. Nested skills are tools inside that station, not competing pipelines.

**This template is Cursor-app first.** The parent chat is Composer. Prefer Grok (or `inherit-parent`) for pstack subagents so they stay on the same model family. Do not assume Claude Code, Warp, or other hosts.

## One rule

Never start `/lfg`, `/poteto-mode`, and Matt `/implement` on the same work item. Building in this factory is **pstack `/poteto-mode`**. `/lfg` is a Compound Engineering bypass of the factory, not a stage inside it.

If `.factory/config.json` is missing, run `/setup-factory` first and stop.

## Work item

Create or load `.factory/work-items/<id>.json` from `.factory/work-item.schema.json`. Use a short slug plus date (`create-note-2026-10-20`). Record `stage`, `primarySkill`, `planPath`, `verifySkill` (from config), `evidenceDir`, `blockers`, `status`.

Do not commit work-item JSON unless the user asks.

## Stages (shortest path)

Skip a stage when it is already satisfied. Start partway. Send work back on revision.

| Stage | Primary move in Cursor | Skip when |
|---|---|---|
| Intake | Create the work item from this chat, an issue, or a pasted brief | Already has an id |
| Triage | Reproduce or scope. Prefer pstack `/how` + `/why`. Hard bugs: `/poteto-mode` investigation or bug-fix steps 1–2, once | Problem and change are already named |
| Planning | Write or point at a plan the user can sign off. pstack `/sharpen` if the goal is underspecified; `/architect` if types/module shape must settle first | Small, well-understood change |
| Building | `/poteto-mode` with the matching playbook (feature, bug-fix, refactoring, …). Proof via the configured `verify-*` skill | — |
| Reviewing | pstack `/interrogate` + `/blast-radius`. Keep `verify-*` green | Tiny mechanical diff: skip panels, keep verify |
| Handoff | Open a PR or present the branch + evidence. **You do not merge** | Local-only, no remote |
| Complete | `status: complete` only after merge or explicit user confirmation | Cancelled |

Human gates: **spec signoff** before Building when a plan exists; **ask** when requirements or review findings are ambiguous; **merge** is the user's call.

## Routing

```text
on(work_item)
  if dual_orchestrator: refuse
  if terms_or_scope_unclear: plan in this chat, wait(spec_gate)
  else if named_feature: plan unless skip_planning, wait(spec_gate)
  else if hard_bug: triage once → poteto-mode bug-fix
  /poteto-mode
  verify-* then /interrogate
  open_pr
  wait(human_merge)
```

Compound Engineering and Matt skills are **optional later**. If they are installed, CE owns `docs/plans/` and `/ce-compound`; Matt owns `CONTEXT.md` and tickets. They still must not become a second factory.

## Proof

Read `.factory/config.json` for `verifySkill`. Drive the real user path. Artifacts under `artifacts/<work-item-id>/`. Cleanup must not delete evidence.

## Reply

End with: work item id, current stage, primary skill used, evidence paths, what is waiting on the human.
