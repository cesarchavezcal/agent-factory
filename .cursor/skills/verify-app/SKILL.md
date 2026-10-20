---
name: verify-app
description: Stub verification skill. Copy to verify-<app> via /setup-factory or /create-verification-skill. Drive the real user surface, capture evidence, clean up without deleting proof.
---

# Verify app (stub)

Replace every placeholder before using this as proof. Read `features/README.md` first.

**App:** `<app>`  
**Surface:** `<web | cli | api>`  
**Harness:** `<playwright | curl | pty>`

## Launch

Exact command that starts a disposable instance, and the ready signal (log line, health URL). Isolated data dir / port. Include teardown.

```bash
# TODO: launch command
```

## Doctor

Read-only check: process up, expected URL or binary, data dir owned by this run.

```bash
# TODO: doctor command
```

## Drive

Stable handles only (ARIA, data attributes, CLI flags). Pair each user action with a command and an observable result. Recipes live in `features/`.

## Evidence

Write `artifacts/<feature-id>/`. Capture the action and the resulting state. UI: ARIA snapshot + screenshot. CLI: stdout, stderr, exit code. Mutations: a second read-only view of stored state.

## Cleanup

Kill only the pid or process this run started. Remove fixture data. **Keep artifacts.**
