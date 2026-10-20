---
name: setup-factory
description: One-time Cursor factory setup for this repo. Use for /setup-factory, "install the factory", or after copying this template. Checks pstack, writes .factory/config.json, clones verify-app to verify-<app>, optionally ejects the Notes sample. Cursor Composer + Grok only.
disable-model-invocation: true
---

# Setup factory

Configure **this checkout** so `/factory-foreman` can run. Do not implement a feature. Do not open a PR.

Host: **Cursor app**, parent chat **Composer**, models **Grok** (or inherit the parent). Skip Claude Code adapters and Warp.

## 1. Preconditions

- This skill directory and `factory-foreman` exist under `.cursor/skills/`. If `factory-foreman` is missing, stop and tell the user to copy the portable pack (see repo README).
- Read `.cursor/settings.json`. **pstack must be enabled.** If it is not, add it and tell the user to reload plugins. Compound Engineering and Matt plugins are optional; do not require them.

## 2. Interview (only what you cannot observe)

Ask, preferring a blocking question tool:

1. **App name** (slug, e.g. `notes`, `billing`). Default: if `samples/notes` exists, `notes`; else the repo folder name.
2. **Primary surface:** web UI, CLI, API, or mixed.
3. **Notes sample:** keep (sandbox) or eject (this repo is a real product).
4. **Verify skill name:** `verify-<app>` unless one already exists.

If `docs/agents/issue-tracker.md` exists, reuse it. Do not set up GitHub/Linear in v1.

## 3. Write config

`.factory/config.json`:

```json
{
  "app": "<slug>",
  "verifySkill": "verify-<slug>",
  "builder": "poteto-mode",
  "host": "cursor-composer",
  "models": "inherit-parent"
}
```

`models: inherit-parent` means pstack subagents run on the Composer/Grok parent unless the user later runs `/setup-pstack`.

## 4. Verification skill

- If `verify-<app>` already exists and looks complete, leave it. Ask before overwriting.
- Else copy `.cursor/skills/verify-app/` to `.cursor/skills/verify-<app>/`, set frontmatter `name: verify-<app>`, and fill Launch/Doctor/Drive from the codebase.
- Prefer invoking pstack `/create-verification-skill` to replace stubs with a real harness. Do not invent a second generator.
- Sample path: Notes lives in `samples/notes/` and is already covered by `verify-notes`.

## 5. Eject sample (only if asked)

Delete `samples/notes/` and `.cursor/skills/verify-notes/`. Point config at the new verify skill. Do not delete `.factory/` or factory skills.

## 6. AGENTS.md

If `AGENTS.md` has no `## Factory` section, append the block from the template `AGENTS.md` in this repo. Never replace an existing file wholesale.

## 7. Models reminder

Tell the user once: use **Cursor Composer** for factory chats; keep Grok selected (or Auto that resolves to Grok). For pstack role overrides, `/setup-pstack` and choose `inherit-parent` or Grok slugs — do not point factory roles at other families unless they ask.

## 8. Done

Report: config path, verify skill, sample kept or ejected, pstack enabled, next command (`/factory-foreman` with a first work item).
