document.addEventListener("DOMContentLoaded", function () {

    function hibaKiiras() {
        document.getElementById("gepDb").textContent = "Szerver nem elérhető";
        document.getElementById("szoftverDb").textContent = "Szerver nem elérhető";
        document.getElementById("telepitesDb").textContent = "Szerver nem elérhető";
    }

    fetch("php/alapadatok.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP hiba");
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                hibaKiiras();
                return;
            }

            document.getElementById("gepDb").textContent = data.gep;
            document.getElementById("szoftverDb").textContent = data.szoftver;
            document.getElementById("telepitesDb").textContent = data.telepites;
        })
        .catch(error => {
            console.error("Hiba:", error);
            hibaKiiras();
        });
});