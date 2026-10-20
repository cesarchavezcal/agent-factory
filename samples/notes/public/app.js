const listView = document.getElementById("list-view");
const noteList = document.getElementById("note-list");
const editor = document.getElementById("editor");
const editorHeading = document.getElementById("editor-heading");
const status = document.getElementById("status");
const searchDialog = document.getElementById("search-dialog");
const searchResults = document.getElementById("search-results");
const searchEmpty = document.getElementById("search-empty");
const searchInput = document.querySelector("#search-form input[name=query]");
const titleField = editor.querySelector('[name="title"]');
const bodyField = editor.querySelector('[name="body"]');
const saveButton = editor.querySelector("#save-note");

let notes = [];

function isEditableFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

function showList() {
  editor.hidden = true;
  listView.hidden = false;
  status.textContent = "";
}

function showEditor(note) {
  listView.hidden = true;
  editor.hidden = false;
  editorHeading.textContent = note?.title ?? "New note";
  titleField.value = note?.title ?? "";
  bodyField.value = note?.body ?? "";
  saveButton.disabled = !titleField.value.trim();
  titleField.focus();
}

function renderList() {
  noteList.innerHTML = "";
  for (const note of notes) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.role = "link";
    link.textContent = note.title;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showEditor(note);
    });
    li.appendChild(link);
    noteList.appendChild(li);
  }
}

async function loadNotes() {
  const res = await fetch("/api/notes");
  notes = await res.json();
  renderList();
}

document.getElementById("new-note").addEventListener("click", () => {
  showEditor(null);
});

document.getElementById("all-notes").addEventListener("click", (e) => {
  e.preventDefault();
  showList();
  loadNotes();
});

titleField.addEventListener("input", () => {
  saveButton.disabled = !titleField.value.trim();
});

editor.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleField.value;
  const body = bodyField.value;
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  if (!res.ok) return;
  const saved = await res.json();
  status.textContent = "Note saved";
  editorHeading.textContent = saved.title;
  await loadNotes();
});

document.getElementById("cancel-note").addEventListener("click", () => {
  showList();
});

document.getElementById("search-open").addEventListener("click", () => {
  openSearch();
});

function openSearch() {
  searchDialog.showModal();
  searchInput.value = "";
  searchResults.innerHTML = "";
  searchEmpty.hidden = true;
  searchInput.focus();
}

async function runSearch(query) {
  const res = await fetch(`/api/notes/search?q=${encodeURIComponent(query)}`);
  const matches = await res.json();
  searchResults.innerHTML = "";
  searchEmpty.hidden = matches.length > 0;
  for (const note of matches) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = note.title;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      searchDialog.close();
      showEditor(note);
    });
    li.appendChild(link);
    searchResults.appendChild(li);
  }
}

searchInput.addEventListener("input", () => {
  runSearch(searchInput.value);
});

document.addEventListener("keydown", (e) => {
  if (isEditableFocused()) return;
  if (e.key === "n") {
    e.preventDefault();
    showEditor(null);
  }
  if (e.key === "/") {
    e.preventDefault();
    openSearch();
  }
});

loadNotes();
