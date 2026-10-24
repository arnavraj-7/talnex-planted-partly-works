const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { addNote, searchNotes, pinNote } = require("../lib/notes");

test("adding a note puts it in the list", () => {
  const after = addNote([], "Buy milk", "a");
  assert.deepStrictEqual(after.map((n) => n.title), ["Buy milk"]);
});

test("search narrows the list as you type", () => {
  let notes = addNote([], "Buy milk", "a");
  notes = addNote(notes, "Call mum", "b");
  assert.deepStrictEqual(searchNotes(notes, "mil").map((n) => n.id), ["a"]);
  assert.strictEqual(searchNotes(notes, "").length, 2);
  assert.strictEqual(searchNotes(notes, "zzz").length, 0);
});

test("pinning changes nothing: no move, no Pinned label", () => {
  let notes = addNote([], "First", "a");
  notes = addNote(notes, "Second", "b");
  const after = pinNote(notes, "b");
  assert.deepStrictEqual(after, notes);
  assert.deepStrictEqual(after.map((n) => n.id), ["a", "b"]);
  assert.ok(after.every((n) => n.pinned === false));
});

test("an empty or blank title throws (the page crashes on this)", () => {
  assert.throws(() => addNote([], ""));
  assert.throws(() => addNote([], "   "));
});

test("the page shows the crash screen for bad input and has a dead Pin handler", () => {
  const html = fs.readFileSync(path.join(__dirname, "../public/index.html"), "utf8");
  assert.ok(html.includes("Something went wrong. Please reload."));
  assert.ok(html.includes('pin.addEventListener("click", function () {});'));
});

test("the browser copy of the logic matches lib/notes.js", () => {
  const a = fs.readFileSync(path.join(__dirname, "../lib/notes.js"), "utf8");
  const b = fs.readFileSync(path.join(__dirname, "../public/notes.js"), "utf8");
  assert.strictEqual(a, b);
});
