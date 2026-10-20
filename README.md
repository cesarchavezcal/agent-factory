# Agent factory (Cursor)

A **GitHub template** for a local agent factory in the **Cursor app**: Composer chat, **Grok** (or inherit-parent), pstack `/poteto-mode` as the builder, and a `verify-*` skill as proof.

It is not Warp Factories and not a Compound Engineering `/lfg` pipeline. One work item, one foreman, one primary skill per stage.

## You need

- [Cursor](https://cursor.com) with **Composer**
- [pstack](https://github.com/cursor/plugins) plugin (`/add-plugin pstack`)
- Grok available on your Cursor account (or Auto that you are happy to inherit)

Compound Engineering and Matt Pocock skills are optional later.

## New project

1. Use this repository as a GitHub template (or clone it).
2. In Cursor, open the folder, enable pstack, start a **Composer** chat on Grok.
3. `/setup-factory` — keep the Notes sample, or eject it and point verify at your app.
4. `/factory-foreman` plus a goal and a check that can pass or fail.

The sample app lives in `samples/notes`. From that directory:

```bash
./scripts/prove-create-note.sh
```

## Existing repo

Copy the portable pack, then `/setup-factory`:

```bash
rsync -a template/.cursor/skills/factory-foreman .cursor/skills/
rsync -a template/.cursor/skills/setup-factory .cursor/skills/
rsync -a template/.cursor/skills/verify-app .cursor/skills/
rsync -a template/.cursor/rules/factory.mdc .cursor/rules/
rsync -a template/.factory .factory
```

Do not overwrite an existing `verify-<app>` without asking. pstack `/create-verification-skill` fills real Launch/Doctor/Drive.

## Layout

```text
.cursor/skills/factory-foreman/   # routing
.cursor/skills/setup-factory/     # one-time setup
.cursor/skills/verify-app/        # stubs
.cursor/skills/verify-notes/      # sample proof
.cursor/rules/factory.mdc
.factory/                         # config + schema + work items
samples/notes/                    # deletable demo
AGENTS.md
```

## Models

Factory chats: **Composer**. pstack roles: **`inherit-parent`** so Grok/Composer in the parent applies. Override later with `/setup-pstack` if you want per-role slugs.

## License

MIT
