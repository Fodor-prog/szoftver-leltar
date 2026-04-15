let softwares = [
    { id: 1, nev: "Chrome", kategoria: "böngésző" },
    { id: 2, nev: "VS Code", kategoria: "fejlesztő" }
];

let editingId = null;

const table = document.querySelector("#softwareTable tbody");
const form = document.getElementById("softwareForm");
const nameInput = document.getElementById("softwareName");
const categoryInput = document.getElementById("softwareCategory");
const message = document.getElementById("formMessage");

// 🔹 LISTA RENDER
function render(data = softwares) {
    table.innerHTML = "";

    data.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.nev}</td>
                <td>${s.kategoria}</td>
                <td>
                    <button onclick="editSoftware(${s.id})">✏️</button>
                    <button onclick="deleteSoftware(${s.id})">❌</button>
                </td>
            </tr>
        `;
    });
}

// 🔹 HOZZÁADÁS / UPDATE
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nev = nameInput.value;
    const kategoria = categoryInput.value;

    if (editingId) {
        // UPDATE
        let s = softwares.find(x => x.id === editingId);
        s.nev = nev;
        s.kategoria = kategoria;

        message.innerText = "Szerkesztve!";
        editingId = null;
    } else {
        // CREATE
        softwares.push({
            id: Date.now(),
            nev,
            kategoria
        });

        message.innerText = "Hozzáadva!";
    }

    form.reset();
    render();
});

// 🔹 SZERKESZTÉS
function editSoftware(id) {
    const s = softwares.find(x => x.id === id);

    nameInput.value = s.nev;
    categoryInput.value = s.kategoria;

    editingId = id;
}

// 🔹 TÖRLÉS
function deleteSoftware(id) {
    softwares = softwares.filter(s => s.id !== id);
    render();
}

// 🔹 KERESÉS
document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = softwares.filter(s =>
        s.nev.toLowerCase().includes(value) ||
        s.kategoria.toLowerCase().includes(value)
    );

    render(filtered);
});

// INIT
render();