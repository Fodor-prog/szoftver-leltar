const API_URL = "php/telepitesek.php";

const form = document.getElementById("installForm");
const tableBody = document.querySelector("#installTable tbody");
const message = document.getElementById("message");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const idInput = document.getElementById("installId");
const gepidInput = document.getElementById("gepid");
const szoftveridInput = document.getElementById("szoftverid");
const verzioInput = document.getElementById("verzio");
const datumInput = document.getElementById("datum");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "red" : "green";
}

function resetForm() {
    form.reset();
    idInput.value = "";
    showMessage("");
}

function formatDateForInput(dateStr) {
    if (!dateStr) return "";
    return dateStr;
}

function loadData() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = "";

            data.forEach(item => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.gepid}</td>
                    <td>${item.szoftverid}</td>
                    <td>${item.verzio ?? ""}</td>
                    <td>${item.datum ?? ""}</td>
                    <td>
                        <button type="button" class="edit-btn">✏️</button>
                        <button type="button" class="delete-btn">❌</button>
                    </td>
                `;

                tr.querySelector(".edit-btn").addEventListener("click", () => {
                    idInput.value = item.id;
                    gepidInput.value = item.gepid;
                    szoftveridInput.value = item.szoftverid;
                    verzioInput.value = item.verzio ?? "";
                    datumInput.value = formatDateForInput(item.datum);
                    showMessage("Szerkesztés mód.");
                });

                tr.querySelector(".delete-btn").addEventListener("click", () => {
                    deleteItem(item.id);
                });

                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error(error);
            showMessage("Hiba a rekordok betöltésekor.", true);
        });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        id: idInput.value,
        gepid: gepidInput.value,
        szoftverid: szoftveridInput.value,
        verzio: verzioInput.value,
        datum: datumInput.value
    };

    const method = data.id ? "PUT" : "POST";

    fetch(API_URL, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            showMessage(result.message || "Mentés sikeres.");
            loadData();
            resetForm();
        })
        .catch(error => {
            console.error(error);
            showMessage("Hiba mentés közben.", true);
        });
});

cancelEditBtn.addEventListener("click", resetForm);

function deleteItem(id) {
    if (!confirm("Biztosan törlöd ezt a rekordot?")) return;

    fetch(API_URL + "?id=" + id, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(result => {
            showMessage(result.message || "Törlés sikeres.");
            loadData();
        })
        .catch(error => {
            console.error(error);
            showMessage("Hiba törlés közben.", true);
        });
}

loadData();