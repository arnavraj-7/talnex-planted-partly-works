// NoteBox logic. Pure functions: they never change the list they are given.
// public/notes.js is an identical copy so the browser can load it (a test checks they match).
(function (root) {
  function addNote(notes, title, id) {
    const clean = String(title == null ? "" : title).trim();
    if (clean === "") throw new Error("Note title is required");
    return [...notes, { id: id || String(Date.now()) + Math.random().toString(16).slice(2, 6), title: clean, pinned: false }];
  }

  function searchNotes(notes, query) {
    const q = String(query || "").trim().toLowerCase();
    if (q === "") return notes.slice();
    return notes.filter((n) => n.title.toLowerCase().includes(q));
  }

  // Pinning is supposed to move the note to the top. It does nothing.
  function pinNote(notes, id) {
    return notes;
  }

  const api = { addNote, searchNotes, pinNote };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NoteBox = api;
})(typeof window !== "undefined" ? window : globalThis);
