---
name: setup-factory
description: One-time Cursor factory setup for this repo. Enables Compound Engineering, Matt Pocock skills, and pstack; writes .factory/config.json; clones verify-app; optionally ejects the Notes sample. Use for /setup-factory.
disable-model-invocation: true
---

# Setup factory

Configure **this checkout** so `/factory-foreman` can mix **CE + Matt + pstack**. Do not implement a feature. Do not open a PR.

Host: **Cursor app**, parent chat **Composer**, models **Grok** (or inherit the parent).

## 1. Preconditions

- `factory-foreman` exists under `.cursor/skills/`. If missing, stop and tell the user to copy the portable pack (see repo README).
- Read `.cursor/settings.json`. These three plugins **must be enabled**:

```json
{
  "plugins": {
    "pstack": { "enabled": true },
    "compound-engineering": { "enabled": true },
    "mattpocock-skills": { "enabled": true }
  }
}
```

If any key is missing, add it. If a plugin is not installed on this Cursor account, tell the user to run:

- `/add-plugin pstack`
- `/add-plugin compound-engineering`
- `/add-plugin mattpocock-skills`

Then reload plugins. Do not continue as a pstack-only factory.

## 2. Interview (only what you cannot observe)

Under factory `autonomy: full`, **do not block setup on questions.** Use defaults: app from `samples/notes` or the repo folder name; keep the Notes sample; `verify-<app>` if missing. Only ask if two apps are equally plausible.

If `docs/agents/issue-tracker.md` exists (Matt setup), reuse it. Otherwise mention `/setup-matt-pocock-skills` as a follow-up, not a blocker.

Offer `/ce-setup` as a follow-up so CE artifact roots exist. Not a blocker for factory config.

## 3. Write config

`.factory/config.json`:

```json
{
  "app": "<slug>",
  "verifySkill": "verify-<slug>",
  "builder": "poteto-mode",
  "host": "cursor-composer",
  "models": "inherit-parent",
  "autonomy": "full",
  "humanGates": ["merge"],
  "plugins": ["pstack", "compound-engineering", "mattpocock-skills"]
}
```

Default **`autonomy: full`**: `/factory-foreman` does not wait for spec signoff. Only merge (and hard blockers) stop the line. Set `"autonomy": "gated"` if the user wants Warp-style plan approval.

## 4. Verification skill

- If `verify-<app>` already exists and looks complete, leave it. Ask before overwriting.
- Else copy `.cursor/skills/verify-app/` to `.cursor/skills/verify-<app>/` and fill from the codebase.
- Prefer pstack `/create-verification-skill`. Notes sample is `verify-notes` + `samples/notes/`.

## 5. Eject sample (only if asked)

Delete `samples/notes/` and `.cursor/skills/verify-notes/`. Point config at the new verify skill. Keep factory skills.

## 6. AGENTS.md

If `AGENTS.md` has no `## Factory` section, append the template `AGENTS.md` factory block. Never replace the file wholesale.

## 7. Models reminder

Factory chats: **Composer**. Subagents: **Grok** or `inherit-parent`. `/setup-pstack` if they want per-role slugs.

## 8. Done

Report: config path, verify skill, sample kept or ejected, **all three plugins enabled**, next: `/ce-setup` and `/setup-matt-pocock-skills` if not done, then `/factory-foreman`.
