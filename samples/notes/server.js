import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createNote,
  readNotes,
  searchNotes,
  seedDefaults,
} from "./lib/store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 4173);
const BUILD_REVISION = process.env.NOTES_BUILD_REVISION ?? "dev";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    url: `http://127.0.0.1:${PORT}`,
    dataDir: process.env.NOTES_DATA_DIR,
    buildRevision: BUILD_REVISION,
  });
});

app.get("/api/notes", async (_req, res) => {
  res.json(await readNotes());
});

app.post("/api/notes", async (req, res) => {
  const { title, body } = req.body ?? {};
  if (typeof title !== "string" || typeof body !== "string") {
    res.status(400).json({ error: "title and body required" });
    return;
  }
  const note = await createNote({ title, body });
  res.status(201).json(note);
});

app.get("/api/notes/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  res.json(await searchNotes(q));
});

app.listen(PORT, "127.0.0.1", async () => {
  await seedDefaults();
  console.log(`Notes ready at http://127.0.0.1:${PORT}`);
});
