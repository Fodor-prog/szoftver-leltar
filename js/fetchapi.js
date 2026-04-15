const API_URL = "telepitesek.php";

const form = document.getElementById("installForm");
const tableBody = document.querySelector("#installTable tbody");
const message = document.getElementById("message");

const idInput = document.getElementById("installId");
const gepidInput = document.getElementById("gepid");
const szoftveridInput = document.getElementById("szoftverid");
const verzioInput = document.getElementById("verzio");
const datumInput = document.getElementById("datum");

function loadData() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = "";

            data.forEach(item => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.gepid}</td>
                        <td>${item.szoftverid}</td>
                        <td>${item.verzio || ""}</td>
                        <td>${item.datum || ""}</td>
                        <td>
                            <button onclick="editItem(${item.id}, ${item.gepid}, ${item.szoftverid}, '${item.verzio}', '${item.datum}')">✏️</button>
                            <button onclick="deleteItem(${item.id})">❌</button>
                        </td>
                    </tr>
                `;
            });
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

    if (data.id) {
        fetch(API_URL, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }).then(loadData);
    } else {
        fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }).then(loadData);
    }

    form.reset();
    idInput.value = "";
});

function editItem(id, gepid, szoftverid, verzio, datum) {
    idInput.value = id;
    gepidInput.value = gepid;
    szoftveridInput.value = szoftverid;
    verzioInput.value = verzio;
    datumInput.value = datum;
}

function deleteItem(id) {
    fetch(API_URL + "?id=" + id, {
        method: "DELETE"
    }).then(loadData);
}

loadData();