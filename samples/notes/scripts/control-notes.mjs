#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { deleteNoteByTitle, ensureDataDir, seedDefaults } from "../lib/store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_URL = "http://127.0.0.1:4173";
const PID_FILE = path.join(ROOT, ".verify", "notes-server.pid");

function usage() {
  console.error(`usage:
  control-notes doctor
  control-notes launch
  control-notes cleanup
  control-notes browser <click|fill|press|snapshot|screenshot> ...
  control-notes cli -- <notes args...>`);
}

async function readPid() {
  try {
    const raw = await fs.readFile(PID_FILE, "utf8");
    return Number(raw.trim());
  } catch {
    return null;
  }
}

function isAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function doctor() {
  const url = process.env.NOTES_URL ?? DEFAULT_URL;
  const dataDir = process.env.NOTES_DATA_DIR;
  if (!dataDir) {
    console.error("NOTES_DATA_DIR missing");
    process.exit(1);
  }
  const pid = await readPid();
  if (!isAlive(pid)) {
    console.error("notes server not running (run control-notes launch)");
    process.exit(1);
  }
  const res = await fetch(`${url}/api/health`);
  if (!res.ok) {
    console.error("health check failed");
    process.exit(1);
  }
  const health = await res.json();
  console.log(
    JSON.stringify(
      {
        ok: true,
        url: health.url,
        dataDir: health.dataDir,
        buildRevision: health.buildRevision,
        pid,
      },
      null,
      2,
    ),
  );
}

async function launch() {
  const dataDir = process.env.NOTES_DATA_DIR;
  if (!dataDir) {
    console.error("NOTES_DATA_DIR missing");
    process.exit(1);
  }
  await fs.mkdir(path.dirname(PID_FILE), { recursive: true });
  const existing = await readPid();
  if (isAlive(existing)) {
    process.kill(existing, "SIGTERM");
    await new Promise((r) => setTimeout(r, 300));
  }
  await ensureDataDir();
  await seedDefaults();
  const child = spawn("node", ["server.js"], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: "4173",
      NOTES_BUILD_REVISION: process.env.NOTES_BUILD_REVISION ?? "verify",
    },
    detached: true,
    stdio: "ignore",
  });
  child.unref();
  await fs.writeFile(PID_FILE, String(child.pid), "utf8");
  const url = process.env.NOTES_URL ?? DEFAULT_URL;
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const res = await fetch(`${url}/api/health`);
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!ready) {
    throw new Error("server start timeout");
  }
  console.log("Notes ready at http://127.0.0.1:4173");
}

async function cleanup() {
  const pid = await readPid();
  if (isAlive(pid)) {
    process.kill(pid, "SIGTERM");
  }
  try {
    await fs.unlink(PID_FILE);
  } catch {
    /* ignore */
  }
  for (const title of ["Release checklist", "CLI note"]) {
    await deleteNoteByTitle(title);
  }
  console.log("cleanup complete");
}

let browser;
let page;

async function getPage() {
  if (!page) {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    await page.goto(process.env.NOTES_URL ?? DEFAULT_URL);
  }
  return page;
}

async function browserCmd(args) {
  const [action, ...rest] = args;
  try {
    const p = await getPage();
    if (action === "click") {
      const role = flag(rest, "--role");
      const name = flag(rest, "--name");
      await p.getByRole(role, { name }).click();
      return;
    }
    if (action === "fill") {
      const role = flag(rest, "--role");
      const name = flag(rest, "--name");
      const value = flag(rest, "--value");
      await p.getByRole(role, { name }).fill(value);
      return;
    }
    if (action === "press") {
      const key = flag(rest, "--key");
      await p.keyboard.press(key);
      return;
    }
    if (action === "snapshot") {
      const out = flag(rest, "--path");
      const aria = rest.includes("--aria");
      const content = aria
        ? await p.locator("body").ariaSnapshot()
        : await p.content();
      await fs.mkdir(path.dirname(out), { recursive: true });
      await fs.writeFile(out, content, "utf8");
      console.log(out);
      return;
    }
    if (action === "screenshot") {
      const out = flag(rest, "--path");
      await fs.mkdir(path.dirname(out), { recursive: true });
      await p.screenshot({ path: out, fullPage: true });
      console.log(out);
      return;
    }
    throw new Error(`unknown browser action: ${action}`);
  } finally {
    if (browser) {
      await browser.close();
      browser = undefined;
      page = undefined;
    }
  }
}

function flag(args, name) {
  const eq = args.find((a) => a.startsWith(`${name}=`));
  if (eq) {
    return eq.slice(name.length + 1);
  }
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  const parts = [];
  for (let i = idx + 1; i < args.length; i += 1) {
    const token = args[i];
    if (token.startsWith("--")) break;
    parts.push(token);
  }
  return parts.length ? parts.join(" ") : undefined;
}

async function cliCmd(args) {
  let cliArgs = args;
  if (cliArgs[0] === "notes") {
    cliArgs = cliArgs.slice(1);
  }
  const notesBin = path.join(ROOT, "bin/notes.js");
  const result = spawnSync("node", [notesBin, ...cliArgs], {
    cwd: ROOT,
    env: process.env,
    encoding: "utf8",
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

async function main() {
  const [, , cmd, ...rest] = process.argv;
  try {
    if (cmd === "doctor") {
      await doctor();
      return;
    }
    if (cmd === "launch") {
      await launch();
      return;
    }
    if (cmd === "cleanup") {
      if (browser) await browser.close();
      await cleanup();
      return;
    }
    if (cmd === "browser") {
      await browserCmd(rest);
      return;
    }
    if (cmd === "cli") {
      const sep = rest.indexOf("--");
      const args = sep === -1 ? rest : rest.slice(sep + 1);
      await cliCmd(args);
      return;
    }
    usage();
    process.exit(1);
  } finally {
    if (cmd === "browser" && rest[0] === "screenshot") {
      /* keep browser for multi-step flows */
    }
  }
}

main().catch(async (err) => {
  console.error(err.message);
  if (browser) await browser.close();
  process.exit(1);
});
