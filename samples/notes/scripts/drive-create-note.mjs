#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createNote } from "../lib/store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const url = process.env.NOTES_URL ?? "http://127.0.0.1:4173";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  await page.getByRole("button", { name: "New note" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill("Release checklist");
  await page.getByRole("textbox", { name: "Body" }).fill("Tag and publish");
  await page.getByRole("button", { name: "Save note" }).click();
  await page.getByRole("link", { name: "All notes" }).click();
  await page.getByRole("link", { name: "Release checklist" }).click();

  await page.getByRole("button", { name: "New note" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill("Discard me");
  await page.getByRole("button", { name: "Cancel" }).click();

  await createNote({
    title: "CLI note",
    body: "Created from terminal",
  });

  const artifactDir = path.join(ROOT, "artifacts/create-note");
  await fs.mkdir(artifactDir, { recursive: true });
  await page.reload();
  await page.getByRole("link", { name: "All notes" }).click();
  const aria = await page.locator("body").ariaSnapshot();
  await fs.writeFile(path.join(artifactDir, "list.aria.txt"), aria, "utf8");
  await page.screenshot({
    path: path.join(artifactDir, "list.png"),
    fullPage: true,
  });

  await browser.close();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
