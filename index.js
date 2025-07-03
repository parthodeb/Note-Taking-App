let notes = JSON.parse(localStorage.getItem("notes") || "[]");
const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");
const searchInput = document.getElementById("searchInput");
const toggleThemeBtn = document.getElementById("toggleTheme");

function saveNotesToStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotesFromStorage(filter = "") {
  notesContainer.innerHTML = "";

  const pinnedNotes = notes.filter(n => n.pinned);
  const unpinnedNotes = notes.filter(n => !n.pinned);

  [...pinnedNotes, ...unpinnedNotes].forEach((note, index) => {
    if (note.content.toLowerCase().includes(filter.toLowerCase())) {
      createNote(note, index);
    }
  });
}

function createNote(noteData, index) {
  const noteDiv = document.createElement("div");
  noteDiv.className = `note shadow-xl rounded-xl p-4 ${noteData.color || ""}`;

  const header = document.createElement("div");
  header.className = "note-header ";

  const colorSelect = document.createElement("select");
  colorSelect.className = "color-select font-bold text-blue-500";
  ["", "red", "green", "blue"].forEach(color => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color || "Default";
    if (noteData.color === color) option.selected = true;
    colorSelect.appendChild(option);
  });

  colorSelect.addEventListener("change", () => {
    notes[index].color = colorSelect.value;
    saveNotesToStorage();
    loadNotesFromStorage(searchInput.value);
  });

  const pinBtn = document.createElement("button");
  pinBtn.className = "pin-btn";
  pinBtn.innerHTML = noteData.pinned ? "📌" : "📍";
  pinBtn.addEventListener("click", () => {
    notes[index].pinned = !notes[index].pinned;
    saveNotesToStorage();
    loadNotesFromStorage(searchInput.value);
  });

  header.appendChild(colorSelect);
  header.appendChild(pinBtn);

  const textarea = document.createElement("textarea");
  textarea.value = noteData.content;
  textarea.addEventListener("input", () => {
    notes[index].content = textarea.value;
    saveNotesToStorage();
  });

  noteDiv.addEventListener("dblclick", () => {
    if (confirm("Delete this note?")) {
      notes.splice(index, 1);
      saveNotesToStorage();
      loadNotesFromStorage(searchInput.value);
    }
  });

  noteDiv.appendChild(header);
  noteDiv.appendChild(textarea);
  notesContainer.appendChild(noteDiv);
}

addNoteBtn.addEventListener("click", () => {
  notes.push({ content: "", color: "", pinned: false });
  saveNotesToStorage();
  loadNotesFromStorage(searchInput.value);
});

searchInput.addEventListener("input", () => {
  loadNotesFromStorage(searchInput.value);
});

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  loadNotesFromStorage();
});
