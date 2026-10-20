#!/usr/bin/env node
import { createNote, searchNotes } from "../lib/store.js";

const [, , command, ...rest] = process.argv;

function parseFlag(name) {
  const eq = rest.find((a) => a.startsWith(`${name}=`));
  if (eq) {
    return eq.slice(name.length + 1);
  }
  const idx = rest.indexOf(name);
  if (idx === -1) return undefined;
  const parts = [];
  for (let i = idx + 1; i < rest.length; i += 1) {
    const token = rest[i];
    if (token.startsWith("--")) break;
    parts.push(token);
  }
  return parts.length ? parts.join(" ") : undefined;
}

async function main() {
  if (command === "create") {
    const title = parseFlag("--title");
    const body = parseFlag("--body") ?? "";
    const format = parseFlag("--format") ?? "text";
    if (!title) {
      console.error("usage: notes create --title <title> [--body <body>]");
      process.exit(1);
    }
    const note = await createNote({ title, body });
    if (format === "json") {
      console.log(JSON.stringify(note));
    } else {
      console.log(`${note.id}\t${note.title}`);
    }
    return;
  }

  if (command === "search") {
    const query = rest[0] ?? "";
    const format = parseFlag("--format") ?? "text";
    const matches = await searchNotes(query);
    if (format === "json") {
      console.log(JSON.stringify(matches));
    } else {
      for (const n of matches) {
        console.log(`${n.id}\t${n.title}`);
      }
    }
    return;
  }

  console.error("usage: notes <create|search> ...");
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
