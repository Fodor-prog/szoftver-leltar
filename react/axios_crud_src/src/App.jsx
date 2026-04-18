import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "/php/";

const emptyForm = {
  id: "",
  gepid: "",
  szoftverid: "",
  verzio: "",
  datum: "",
};

function App() {
  const [telepitesek, setTelepitesek] = useState([]);
  const [gepek, setGepek] = useState([]);
  const [szoftverek, setSzoftverek] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadGepek = async () => {
    try {
      const res = await axios.get(`${API_BASE}get_gepek.php`);
      if (res.data.success) setGepek(res.data.data);
    } catch {
      setMessage("Hiba a gépek betöltésekor.");
    }
  };

  const loadSzoftverek = async () => {
    try {
      const res = await axios.get(`${API_BASE}get_szoftverek.php`);
      if (res.data.success) setSzoftverek(res.data.data);
    } catch {
      setMessage("Hiba a szoftverek betöltésekor.");
    }
  };

  const loadTelepitesek = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}get_telepitesek.php`);
      if (res.data.success) {
        setTelepitesek(res.data.data);
      } else {
        setMessage(res.data.message || "Hiba a telepítések betöltésekor.");
      }
    } catch {
      setMessage("Hiba a telepítések betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGepek();
    loadSzoftverek();
    loadTelepitesek();
  }, []);

  const filteredTelepitesek = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) return telepitesek;

    return telepitesek.filter((item) =>
      String(item.id).includes(term) ||
      String(item.hely || "").toLowerCase().includes(term) ||
      String(item.tipus || "").toLowerCase().includes(term) ||
      String(item.ipcim || "").toLowerCase().includes(term) ||
      String(item.szoftver_nev || "").toLowerCase().includes(term) ||
      String(item.kategoria || "").toLowerCase().includes(term) ||
      String(item.verzio || "").toLowerCase().includes(term) ||
      String(item.datum || "").toLowerCase().includes(term)
    );
  }, [telepitesek, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gepid || !formData.szoftverid) {
      setMessage("A gép és a szoftver kiválasztása kötelező.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}save_telepites.php`, formData);

      if (res.data.success) {
        setMessage(res.data.message);
        resetForm();
        loadTelepitesek();
      } else {
        setMessage(res.data.message || "Mentési hiba.");
      }
    } catch {
      setMessage("Mentési hiba.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      gepid: String(item.gepid),
      szoftverid: String(item.szoftverid),
      verzio: item.verzio || "",
      datum: item.datum || "",
    });
    setIsEditing(true);
    setMessage("Szerkesztés mód.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a telepítést?")) return;

    try {
      const res = await axios.post(`${API_BASE}delete_telepites.php`, { id });

      if (res.data.success) {
        setMessage(res.data.message);
        loadTelepitesek();
      } else {
        setMessage(res.data.message || "Törlési hiba.");
      }
    } catch {
      setMessage("Törlési hiba.");
    }
  };

  return (
    <>
      <header className="site-header">
        <h1>Web programozás-1 Előadás Házi feladat</h1>
        <p className="subtitle">Axios CRUD - Telepítések kezelése</p>
      </header>

      <nav className="main-nav">
        <div className="nav-container">
          <a href="../../index.html">Főoldal</a>
          <a href="../../javascript.html">JavaScript CRUD</a>
          <a href="../react-crud/">React CRUD</a>
          <a href="../spa/">SPA</a>
          <a href="../../fetchapi.html">Fetch API CRUD</a>
          <a href="./" className="active">Axios CRUD</a>
          <a href="../../oojs.html">OOJS</a>
        </div>
      </nav>

      <main className="container">
        <section className="page-intro card">
          <h2>Telepítések kezelése Axios és adatbázis segítségével</h2>
          <p>
            Ezen az oldalon a telepítések nyilvántartása történik React és Axios
            használatával. Az adatok szerveroldali adatbázisban vannak tárolva.
          </p>
        </section>

        <section className="form-section card">
          <h2>{isEditing ? "Telepítés módosítása" : "Új telepítés hozzáadása"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="gepid">Gép</label>
              <select
                id="gepid"
                name="gepid"
                value={formData.gepid}
                onChange={handleChange}
              >
                <option value="">Válassz gépet...</option>
                {gepek.map((gep) => (
                  <option key={gep.id} value={gep.id}>
                    {gep.hely} - {gep.tipus} - {gep.ipcim}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="szoftverid">Szoftver</label>
              <select
                id="szoftverid"
                name="szoftverid"
                value={formData.szoftverid}
                onChange={handleChange}
              >
                <option value="">Válassz szoftvert...</option>
                {szoftverek.map((szoftver) => (
                  <option key={szoftver.id} value={szoftver.id}>
                    {szoftver.nev} - {szoftver.kategoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="verzio">Verzió</label>
              <input
                type="text"
                id="verzio"
                name="verzio"
                value={formData.verzio}
                onChange={handleChange}
                placeholder="Pl. ver5.0.286.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="datum">Dátum</label>
              <input
                type="date"
                id="datum"
                name="datum"
                value={formData.datum}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit">
                {isEditing ? "Módosítás mentése" : "Mentés"}
              </button>
              <button type="button" onClick={resetForm}>
                Mégse
              </button>
            </div>

            {message && <p className="message">{message}</p>}
          </form>
        </section>

        <section className="table-section card">
          <div className="section-header">
            <h2>Telepítések listája</h2>
            <input
              type="text"
              placeholder="Keresés gép, szoftver, verzió vagy dátum alapján..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Betöltés...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Gép</th>
                    <th>Típus</th>
                    <th>IP cím</th>
                    <th>Szoftver</th>
                    <th>Kategória</th>
                    <th>Verzió</th>
                    <th>Dátum</th>
                    <th>Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTelepitesek.length > 0 ? (
                    filteredTelepitesek.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.hely}</td>
                        <td>{item.tipus}</td>
                        <td>{item.ipcim}</td>
                        <td>{item.szoftver_nev}</td>
                        <td>{item.kategoria}</td>
                        <td>{item.verzio || "-"}</td>
                        <td>{item.datum || "-"}</td>
                        <td className="actions-cell">
                          <button
                            type="button"
                            className="small-btn"
                            onClick={() => handleEdit(item)}
                          >
                            Szerkesztés
                          </button>
                          <button
                            type="button"
                            className="small-btn delete-btn"
                            onClick={() => handleDelete(item.id)}
                          >
                            Törlés
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">Nincs megjeleníthető adat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>Készítette: Fodor Árpád - U4BKST |  Farkas Tamás - PLPJEB </p>
      </footer>
    </>
  );
}

export default App;