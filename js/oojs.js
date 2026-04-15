class Gep {
    constructor(id, hely, tipus, ipcim) {
        this.id = id;
        this.hely = hely;
        this.tipus = tipus;
        this.ipcim = ipcim;
    }

    getAdatokSzoveg() {
        return `Azonosító: ${this.id}, hely: ${this.hely}, IP: ${this.ipcim}`;
    }

    renderCard() {
        const card = document.createElement("div");
        card.className = "machine-card";

        const cim = document.createElement("h3");
        cim.textContent = "Gép";

        const idP = document.createElement("p");
        idP.textContent = "ID: " + this.id;

        const helyP = document.createElement("p");
        helyP.textContent = "Hely: " + this.hely;

        const tipusP = document.createElement("p");
        tipusP.textContent = "Típus: " + this.tipus;

        const ipP = document.createElement("p");
        ipP.textContent = "IP-cím: " + this.ipcim;

        card.appendChild(cim);
        card.appendChild(idP);
        card.appendChild(helyP);
        card.appendChild(tipusP);
        card.appendChild(ipP);

        return card;
    }
}

class AsztaliGep extends Gep {
    constructor(id, hely, ipcim) {
        super(id, hely, "asztali", ipcim);
    }

    renderCard() {
        const card = super.renderCard();
        card.classList.add("desktop");

        const extra = document.createElement("p");
        extra.textContent = "Kategória: Asztali számítógép";
        card.appendChild(extra);

        return card;
    }
}

class Notebook extends Gep {
    constructor(id, hely, ipcim) {
        super(id, hely, "notebook", ipcim);
    }

    renderCard() {
        const card = super.renderCard();
        card.classList.add("notebook");

        const extra = document.createElement("p");
        extra.textContent = "Kategória: Hordozható gép";
        card.appendChild(extra);

        return card;
    }
}

const gepek = [
    new AsztaliGep(1, "T403", "192.168.2.1"),
    new AsztaliGep(2, "T212", "192.168.2.2"),
    new Notebook(4, "T108", "192.168.1.1"),
    new Notebook(7, "T209", "192.168.4.1"),
    new AsztaliGep(10, "T310", "192.168.2.6"),
    new Notebook(12, "T109", "192.168.1.3")
];

const container = document.getElementById("machineContainer");

gepek.forEach(gep => {
    const kartya = gep.renderCard();
    container.appendChild(kartya);
});

const infoElem = document.createElement("p");
infoElem.style.margin = "20px";
infoElem.style.fontWeight = "bold";
infoElem.textContent = "Összes megjelenített gép: " + gepek.length;

document.body.appendChild(infoElem);