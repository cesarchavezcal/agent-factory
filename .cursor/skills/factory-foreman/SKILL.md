---
name: factory-foreman
description: Route one work item through the local Cursor factory mixing Compound Engineering, Matt Pocock skills, and pstack. Use for /factory-foreman, /factory, or "run this through the factory". Cursor Composer + Grok. Default builder is pstack /poteto-mode.
---

# Factory foreman

You are the factory foreman in this Cursor chat (Composer). One **work item** keeps its identity from intake to handoff. You pick the **stage** and name **one** primary skill. Nested skills are tools inside that station, not competing pipelines.

**Plugins (all required):** Compound Engineering, Matt Pocock skills, pstack. Parent chat is Composer. Prefer Grok or `inherit-parent` for subagents.

## Layers

| Pack | Owns |
|---|---|
| **CE** | Product intent and memory: `/ce-brainstorm`, `/ce-plan`, `docs/plans/`, `/ce-compound` |
| **Matt** | Domain and tickets: `/grill-with-docs`, `CONTEXT.md`, ADRs, `/to-spec`, `/to-tickets`, `/tdd` seams |
| **pstack** | Building and proof: `/poteto-mode`, `verify-*`, `/interrogate`, `/blast-radius` |

## One rule

Never start `/lfg`, `/poteto-mode`, and Matt `/implement` on the same work item. Building is **pstack `/poteto-mode`**. `/lfg` is a CE-only bypass of the factory. Matt `/implement` is Matt’s builder; this factory does not use it.

If `.factory/config.json` is missing, run `/setup-factory` first and stop.

## Work item

Create or load `.factory/work-items/<id>.json` from `.factory/work-item.schema.json`. Use a short slug plus date (`create-note-2026-10-20`). Record `stage`, `primarySkill`, `planPath`, `verifySkill` (from config), `evidenceDir`, `blockers`, `status`.

Do not commit work-item JSON unless the user asks.

## Stages (shortest path)

Skip a stage when it is already satisfied. Start partway. Send work back on revision.

| Stage | Primary skill | Support (same stage) | Skip when |
|---|---|---|---|
| Intake | Create the work item | Matt `/triage` for incoming bugs/requests you did not write. CE `/ce-sweep` for leftover repo work | Already has an id |
| Triage | Matt `/diagnosing-bugs` if broken; pstack `/how` + `/why` if “how/why is this code” | Matt `/research`. pstack `/in-your-own-words` | Problem and change are already named |
| Planning | CE `/ce-brainstorm` then `/ce-plan` | Matt `/grill-with-docs` / `/domain-modeling` if terms are fuzzy. Matt `/to-spec` + `/to-tickets` for tracer-bullet tickets. Matt `/wayfinder` only when bigger than one session (decisions, not code). pstack `/sharpen`, `/architect` | Small, well-understood change |
| Building | **pstack `/poteto-mode`** | Matt `/tdd` as seam discipline inside the playbook. Configured `verify-*` | — |
| Reviewing | pstack `/interrogate` + `/blast-radius` | Matt `/code-review` (Standards + Spec) when a ticket/spec exists. Keep `verify-*` green | Tiny mechanical diff: skip panels, keep verify |
| Handoff | CE `/ce-commit-push-pr` or pstack Opening a PR | Matt `/handoff` if the thread must fork. **You do not merge** | Local-only, no remote |
| Complete | Merge or explicit user confirmation | CE `/ce-compound` if the lesson is durable | Cancelled |

Human gates: **spec signoff** before Building when a plan exists; **ask** when requirements or review findings are ambiguous; **merge** is the user's call.

## Routing

```text
on(work_item)
  if dual_orchestrator: refuse
  if foggy_multi_session: Matt /wayfinder → CE /ce-plan
  else if incoming_pile: Matt /triage
  else if terms_unclear: Matt /grill-with-docs → CE /ce-plan
  else if named_feature: CE /ce-plan
  else if hard_bug: diagnose once → pstack bug-fix
  wait(spec_gate) unless skip_planning
  pstack /poteto-mode
  verify-* + /interrogate
  open_pr
  wait(human_merge)
  maybe CE /ce-compound
```

Do not diagnose twice. Do not `/implement` off a wayfinder map — collapse to `/ce-plan` first.

## Proof

Read `.factory/config.json` for `verifySkill`. Drive the real user path. Artifacts under `artifacts/<work-item-id>/`. Cleanup must not delete evidence.

## Reply

End with: work item id, current stage, primary skill used, evidence paths, what is waiting on the human.
