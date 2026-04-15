<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Jednoduchý editor stránek</title>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f1f5f9;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  overflow: hidden;
}

header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

main {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  padding: 20px;
}

aside {
  border: 1px solid #ddd;
  padding: 10px;
  height: 500px;
  overflow-y: auto;
}

section.editor {
  display: flex;
  flex-direction: column;
}

.toolbar button {
  margin: 3px;
  padding: 6px 10px;
  cursor: pointer;
}

.editor-area {
  border: 1px solid #ddd;
  padding: 10px;
  min-height: 400px;
  margin-top: 10px;
}

.active {
  background: #e0f2fe;
}

button.small {
  font-size: 12px;
  padding: 3px 6px;
}
</style>
</head>

<body>

<div class="container">

<header>
  <h2>Editor stránek</h2>
  <div>
    <button onclick="addSection()">Nová sekce</button>
    <button onclick="exportHTML()">Export</button>
  </div>
</header>

<main>
  <aside>
    <ul id="sectionsList"></ul>
  </aside>

  <section class="editor">
    <div class="toolbar">
      <button onclick="execCmd('bold')"><b>B</b></button>
      <button onclick="execCmd('italic')"><i>I</i></button>
      <button onclick="execCmd('underline')"><u>U</u></button>
      <button onclick="execCmd('formatBlock','h1')">H1</button>
      <button onclick="execCmd('formatBlock','h2')">H2</button>
      <button onclick="execCmd('insertUnorderedList')">• List</button>
      <button onclick="execCmd('insertOrderedList')">1. List</button>
      <button onclick="createLink()">Link</button>
      <button onclick="save()">Uložit</button>
    </div>

    <div id="editor" class="editor-area" contenteditable="true"></div>
  </section>
</main>

</div>

<script>
let sections = JSON.parse(localStorage.getItem("sections")) || [
  { id: Date.now(), title: "Úvod", html: "<p>Váš obsah...</p>" }
];

let activeId = sections[0].id;

function renderSections() {
  const list = document.getElementById("sectionsList");
  list.innerHTML = "";

  sections.forEach(sec => {
    const li = document.createElement("li");
    li.textContent = sec.title;
    li.style.cursor = "pointer";
    li.className = sec.id === activeId ? "active" : "";
    li.onclick = () => {
      activeId = sec.id;
      loadSection();
      renderSections();
    };
    list.appendChild(li);
  });
}

function loadSection() {
  const sec = sections.find(s => s.id === activeId);
  document.getElementById("editor").innerHTML = sec.html;
}

function save() {
  const editor = document.getElementById("editor");
  sections = sections.map(s =>
    s.id === activeId ? { ...s, html: editor.innerHTML } : s
  );
  localStorage.setItem("sections", JSON.stringify(sections));
  alert("Uloženo");
}

function addSection() {
  const title = prompt("Název sekce:");
  if (!title) return;

  const newSec = {
    id: Date.now(),
    title: title,
    html: "<p>Nový obsah</p>"
  };

  sections.unshift(newSec);
  activeId = newSec.id;
  localStorage.setItem("sections", JSON.stringify(sections));
  renderSections();
  loadSection();
}

function execCmd(cmd, value = null) {
  document.execCommand(cmd, false, value);
}

function createLink() {
  const url = prompt("Zadej URL:");
  if (url) execCmd("createLink", url);
}

function exportHTML() {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Export</title>
</head>
<body>
${sections.map(s => `<section><h2>${s.title}</h2>${s.html}</section>`).join("")}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "export.html";
  a.click();
}

renderSections();
loadSection();
</script>

</body>
</html>
