import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const NOTES_FILE = "notes.json";

export function dataDir() {
  const dir = process.env.NOTES_DATA_DIR;
  if (!dir) {
    throw new Error("NOTES_DATA_DIR is required");
  }
  return dir;
}

async function notesPath() {
  return path.join(dataDir(), NOTES_FILE);
}

export async function ensureDataDir() {
  const dir = dataDir();
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, NOTES_FILE);
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, "[]", "utf8");
  }
}

export async function readNotes() {
  await ensureDataDir();
  const raw = await fs.readFile(await notesPath(), "utf8");
  return JSON.parse(raw);
}

export async function writeNotes(notes) {
  await ensureDataDir();
  await fs.writeFile(await notesPath(), JSON.stringify(notes, null, 2), "utf8");
}

export async function seedDefaults() {
  const notes = await readNotes();
  if (notes.length > 0) {
    return notes;
  }
  const seeded = [
    {
      id: randomUUID(),
      title: "Quarterly plan",
      body: "Draft budget",
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: "Grocery list",
      body: "Milk and eggs",
      createdAt: new Date().toISOString(),
    },
  ];
  await writeNotes(seeded);
  return seeded;
}

export async function createNote({ title, body }) {
  const trimmed = title.trim();
  const notes = await readNotes();
  const note = {
    id: randomUUID(),
    title: trimmed,
    body,
    createdAt: new Date().toISOString(),
  };
  notes.push(note);
  await writeNotes(notes);
  return note;
}

export async function searchNotes(query) {
  const q = query.trim().toLowerCase();
  const notes = await readNotes();
  if (!q) {
    return notes;
  }
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
  );
}

export async function deleteNoteByTitle(title) {
  const notes = await readNotes();
  const next = notes.filter((n) => n.title !== title);
  if (next.length === notes.length) {
    return false;
  }
  await writeNotes(next);
  return true;
}
