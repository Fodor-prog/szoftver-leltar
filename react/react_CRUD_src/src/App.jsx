import { useMemo, useState } from "react";
import "./App.css";

const kezdoGepek = [
  { id: 1, hely: "T403", tipus: "asztali", ipcim: "192.168.2.1" },
  { id: 2, hely: "T212", tipus: "asztali", ipcim: "192.168.2.2" },
  { id: 3, hely: "T302", tipus: "asztali", ipcim: "192.168.2.3" },
  { id: 4, hely: "T108", tipus: "notebook", ipcim: "192.168.1.1" },
  { id: 5, hely: "T301", tipus: "asztali", ipcim: "192.168.2.4" },
  { id: 6, hely: "T306", tipus: "asztali", ipcim: "192.168.2.5" },
  { id: 7, hely: "T209", tipus: "notebook", ipcim: "192.168.4.1" },
  { id: 8, hely: "T208", tipus: "notebook", ipcim: "192.168.4.2" }
];

const uresForm = {
  id: "",
  hely: "",
  tipus: "asztali",
  ipcim: ""
};

function App() {
  const [gepek, setGepek] = useState(kezdoGepek);
  const [formData, setFormData] = useState(uresForm);
  const [szerkesztesAlatt, setSzerkesztesAlatt] = useState(false);
  const [kereses, setKereses] = useState("");
  const [uzenet, setUzenet] = useState("");

  const szurtGepek = useMemo(() => {
    const keresett = kereses.trim().toLowerCase();

    if (!keresett) return gepek;

    return gepek.filter((gep) =>
      gep.hely.toLowerCase().includes(keresett) ||
      gep.tipus.toLowerCase().includes(keresett) ||
      gep.ipcim.toLowerCase().includes(keresett) ||
      String(gep.id).includes(keresett)
    );
  }, [gepek, kereses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((elozo) => ({
      ...elozo,
      [name]: value
    }));
  };

  const validalas = () => {
    if (
      !formData.id.toString().trim() ||
      !formData.hely.trim() ||
      !formData.tipus.trim() ||
      !formData.ipcim.trim()
    ) {
      setUzenet("Minden mező kitöltése kötelező.");
      return false;
    }

    const idSzam = Number(formData.id);

    if (Number.isNaN(idSzam) || idSzam <= 0) {
      setUzenet("Az ID mezőbe pozitív számot kell írni.");
      return false;
    }

    if (!szerkesztesAlatt) {
      const vanIlyenId = gepek.some((gep) => gep.id === idSzam);
      if (vanIlyenId) {
        setUzenet("Ez az ID már létezik.");
        return false;
      }
    }

    setUzenet("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validalas()) return;

    const ujGep = {
      id: Number(formData.id),
      hely: formData.hely.trim(),
      tipus: formData.tipus.trim(),
      ipcim: formData.ipcim.trim()
    };

    if (szerkesztesAlatt) {
      setGepek((elozo) =>
        elozo.map((gep) => (gep.id === ujGep.id ? ujGep : gep))
      );
      setUzenet("A gép adatai frissítve lettek.");
    } else {
      setGepek((elozo) => [...elozo, ujGep]);
      setUzenet("Új gép sikeresen hozzáadva.");
    }

    resetForm();
  };

  const handleEdit = (gep) => {
    setFormData({
      id: gep.id,
      hely: gep.hely,
      tipus: gep.tipus,
      ipcim: gep.ipcim
    });
    setSzerkesztesAlatt(true);
    setUzenet("Szerkesztés mód.");
  };

  const handleDelete = (id) => {
    const biztos = window.confirm("Biztosan törölni szeretnéd ezt a gépet?");
    if (!biztos) return;

    setGepek((elozo) => elozo.filter((gep) => gep.id !== id));

    if (Number(formData.id) === id) {
      resetForm();
    }

    setUzenet("A gép törölve lett.");
  };

  const resetForm = () => {
    setFormData(uresForm);
    setSzerkesztesAlatt(false);
  };

  return (
    <>
      <header className="site-header">
        <h1>Web programozás-1 Előadás Házi feladat</h1>
        <p className="subtitle">React CRUD - Gépek kezelése</p>
      </header>

      <nav className="main-nav">
        <div className="nav-container">
          <a href="../../index.html">Főoldal</a>
          <a href="../../javascript.html">JavaScript CRUD</a>
          <a href="./" className="active">React CRUD</a>
          <a href="../spa/">SPA</a>
          <a href="../../fetchapi.html">Fetch API CRUD</a>
          <a href="../axios/">Axios CRUD</a>
          <a href="../../oojs.html">OOJS</a>
        </div>
      </nav>

      <main className="container">
        <section className="page-intro card">
          <h2>Gépnyilvántartás React segítségével</h2>
          <p>
            Ezen az oldalon a gépek nyilvántartása történik React használatával.
            Az alkalmazás komponensekre és állapotkezelésre épül, így jól elkülönül
            a sima JavaScript CRUD feladattól.
          </p>
        </section>

        <section className="form-section card">
          <h2>{szerkesztesAlatt ? "Gép módosítása" : "Új gép hozzáadása"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="id">Azonosító</label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Pl. 77"
                disabled={szerkesztesAlatt}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hely">Hely</label>
              <input
                type="text"
                id="hely"
                name="hely"
                value={formData.hely}
                onChange={handleChange}
                placeholder="Pl. T205"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipus">Típus</label>
              <select
                id="tipus"
                name="tipus"
                value={formData.tipus}
                onChange={handleChange}
              >
                <option value="asztali">asztali</option>
                <option value="notebook">notebook</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ipcim">IP cím</label>
              <input
                type="text"
                id="ipcim"
                name="ipcim"
                value={formData.ipcim}
                onChange={handleChange}
                placeholder="Pl. 192.168.2.34"
              />
            </div>

            <div className="form-actions">
              <button type="submit">
                {szerkesztesAlatt ? "Módosítás mentése" : "Mentés"}
              </button>
              <button type="button" onClick={resetForm}>
                Mégse
              </button>
            </div>

            {uzenet && <p className="message">{uzenet}</p>}
          </form>
        </section>

        <section className="table-section card">
          <div className="section-header react-section-header">
            <h2>Géplista</h2>
            <input
              type="text"
              placeholder="Keresés ID, hely, típus vagy IP cím alapján..."
              value={kereses}
              onChange={(e) => setKereses(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hely</th>
                  <th>Típus</th>
                  <th>IP cím</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {szurtGepek.length > 0 ? (
                  szurtGepek.map((gep) => (
                    <tr key={gep.id}>
                      <td>{gep.id}</td>
                      <td>{gep.hely}</td>
                      <td>{gep.tipus}</td>
                      <td>{gep.ipcim}</td>
                      <td className="actions-cell">
                        <button
                          type="button"
                          className="small-btn"
                          onClick={() => handleEdit(gep)}
                        >
                          Szerkesztés
                        </button>
                        <button
                          type="button"
                          className="small-btn delete-btn"
                          onClick={() => handleDelete(gep.id)}
                        >
                          Törlés
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">Nincs találat.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Készítette: Fodor Árpád - U4BKST |  Farkas Tamás - PLPJEB</p>
      </footer>
    </>
  );
}

export default App;