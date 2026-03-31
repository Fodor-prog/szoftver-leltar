import { useState } from "react";
import "./App.css";

function App() {
  const [gepek, setGepek] = useState([
    { id: 1, hely: "T403", tipus: "asztali", ipcim: "192.168.2.1" },
    { id: 2, hely: "T108", tipus: "notebook", ipcim: "192.168.1.1" }
  ]);

  const [ujGep, setUjGep] = useState({
    hely: "",
    tipus: "",
    ipcim: ""
  });

  const [uzenet, setUzenet] = useState("");

  const handleChange = (e) => {
    setUjGep({
      ...ujGep,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ujGep.hely || !ujGep.tipus || !ujGep.ipcim) {
      setUzenet("Minden mező kitöltése kötelező.");
      return;
    }

    const ujElem = {
      id: Date.now(),
      ...ujGep
    };

    setGepek([...gepek, ujElem]);
    setUjGep({
      hely: "",
      tipus: "",
      ipcim: ""
    });
    setUzenet("Az új gép sikeresen hozzáadva.");
  };

  const handleDelete = (id) => {
    setGepek(gepek.filter((gep) => gep.id !== id));
    setUzenet("A rekord törölve lett.");
  };

  return (
    <div className="page">
      <header className="site-header">
        <h1>Web programozás-1 Előadás Házi feladat</h1>
        <p className="subtitle">React CRUD - Gépek kezelése</p>
      </header>

      <nav className="main-nav">
        <a href="../../index.html">Főoldal</a>
        <a href="../../javascript.html">JavaScript CRUD</a>
        <a href="/react/nje-crud/" className="active">React CRUD</a>
        <a href="../spa/">SPA</a>
        <a href="../../fetchapi.html">Fetch API CRUD</a>
        <a href="../axios/">Axios CRUD</a>
        <a href="../../oojs.html">OOJS</a>
      </nav>

      <main className="container">
        <section className="card">
          <h2>Gépek nyilvántartása React segítségével</h2>
          <p>
            Ezen az oldalon a gépek kezelése React alkalmazással történik.
            Az adatok ebben a részben kliens oldalon, state-ben vannak tárolva.
          </p>
        </section>

        <section className="card">
          <h2>Új gép felvétele</h2>

          <form className="crud-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="hely">Hely</label>
              <input
                id="hely"
                name="hely"
                type="text"
                placeholder="Pl. T403"
                value={ujGep.hely}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipus">Típus</label>
              <input
                id="tipus"
                name="tipus"
                type="text"
                placeholder="Pl. asztali vagy notebook"
                value={ujGep.tipus}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ipcim">IP cím</label>
              <input
                id="ipcim"
                name="ipcim"
                type="text"
                placeholder="Pl. 192.168.2.1"
                value={ujGep.ipcim}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit">Mentés</button>
            </div>

            {uzenet && <p className="message">{uzenet}</p>}
          </form>
        </section>

        <section className="card">
          <h2>Géplisták</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hely</th>
                  <th>Típus</th>
                  <th>IP cím</th>
                  <th>Művelet</th>
                </tr>
              </thead>
              <tbody>
                {gepek.map((gep) => (
                  <tr key={gep.id}>
                    <td>{gep.id}</td>
                    <td>{gep.hely}</td>
                    <td>{gep.tipus}</td>
                    <td>{gep.ipcim}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(gep.id)}
                      >
                        Törlés
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Készítette: Név1 - ABC123 | Név2 - XYZ987</p>
      </footer>
    </div>
  );
}

export default App;