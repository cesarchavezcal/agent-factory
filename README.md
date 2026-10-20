# Agent factory (Cursor)

A **GitHub template** for a local agent factory in the **Cursor app**. It **mixes three plugins**:

| Plugin | Job |
|---|---|
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | Plan + compound memory |
| [Matt Pocock skills](https://github.com/mattpocock/skills) | Domain, tickets, TDD seams |
| [pstack](https://github.com/cursor/plugins) | `/poteto-mode` builder + `verify-*` proof |

Composer chat, **Grok** (or inherit-parent). One work item, one foreman, one primary skill per stage. `/lfg` and Matt `/implement` are not the factory.

## You need

- [Cursor](https://cursor.com) with **Composer**
- All three plugins:

```text
/add-plugin pstack
/add-plugin compound-engineering
/add-plugin mattpocock-skills
```

- Grok available on your Cursor account (or Auto you are happy to inherit)

## New project

1. Use this repository as a GitHub template (or clone it).
2. Open the folder in Cursor. Enable the three plugins (this repo’s `.cursor/settings.json` already turns them on once installed).
3. Start a **Composer** chat on Grok.
4. `/setup-factory` — keep the Notes sample, or eject it.
5. Optional follow-ups: `/ce-setup`, `/setup-matt-pocock-skills`.
6. `/factory-foreman` plus a goal and a check that can pass or fail.

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
.cursor/skills/factory-foreman/   # routing across CE + Matt + pstack
.cursor/skills/setup-factory/     # one-time setup
.cursor/skills/verify-app/        # stubs
.cursor/skills/verify-notes/      # sample proof
.cursor/rules/factory.mdc
.cursor/settings.json             # enables all three plugins
.factory/                         # config + schema + work items
samples/notes/                    # deletable demo
AGENTS.md
```

## Models

Factory chats: **Composer**. pstack roles: **`inherit-parent`** so Grok/Composer in the parent applies. Override later with `/setup-pstack` if you want per-role slugs.

## License

MIT
