import { useEffect, useMemo, useState } from "react";
import "./App.css";

const MENU_MEMORY = "memory";
const MENU_CALCULATOR = "calculator";

const SHAPES = ["●", "■", "▲", "★", "◆", "♥", "☀", "♣"];

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createMemoryDeck() {
  const pairs = [...SHAPES, ...SHAPES];
  const shuffled = shuffleArray(pairs);

  return shuffled.map((shape, index) => ({
    id: `${shape}-${index}`,
    shape,
    flipped: false,
    matched: false,
  }));
}

function Header() {
  return (
    <header className="site-header">
      <h1>Web programozás-1 Előadás Házi feladat</h1>
      <p className="subtitle">SPA - React mini alkalmazások</p>
    </header>
  );
}

function MainNavigation() {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <a href="../../index.html">Főoldal</a>
        <a href="../../javascript.html">JavaScript CRUD</a>
        <a href="../react-crud/">React CRUD</a>
        <a href="./" className="active">SPA</a>
        <a href="../../fetchapi.html">Fetch API CRUD</a>
        <a href="../axios/">Axios CRUD</a>
        <a href="../../oojs.html">OOJS</a>
      </div>
    </nav>
  );
}

function SpaTabs({ activeMenu, onChange }) {
  return (
    <section className="card">
      <div className="spa-tab-bar">
        <button
          type="button"
          className={`spa-tab-btn ${activeMenu === MENU_MEMORY ? "active" : ""}`}
          onClick={() => onChange(MENU_MEMORY)}
        >
          Memóriajáték
        </button>
        <button
          type="button"
          className={`spa-tab-btn ${activeMenu === MENU_CALCULATOR ? "active" : ""}`}
          onClick={() => onChange(MENU_CALCULATOR)}
        >
          Kalkulátor
        </button>
      </div>
    </section>
  );
}

function PageIntro({ activeMenu }) {
  return (
    <section className="page-intro card">
      {activeMenu === MENU_MEMORY ? (
        <>
          <h2>Memóriajáték</h2>
          <p>
            4x4-es táblán kell megkeresni az egyforma alakzatpárokat. A rendszer
            számolja a próbálkozásokat, és a megtalált párok eltűnnek.
          </p>
        </>
      ) : (
        <>
          <h2>Kalkulátor</h2>
          <p>
            Egy egyszerű React számológép, amely gombokkal kezeli a műveleteket,
            és `useState` segítségével tárolja az aktuális kifejezést és eredményt.
          </p>
        </>
      )}
    </section>
  );
}

function MemoryCard({ card, disabled, onClick }) {
  const hidden = !card.flipped && !card.matched;
  const classes = [
    "memory-card",
    card.flipped ? "flipped" : "",
    card.matched ? "matched" : "",
  ]
    .join(" ")
    .trim();

  return (
    <button
      type="button"
      className={classes}
      onClick={() => onClick(card.id)}
      disabled={disabled || card.flipped || card.matched}
    >
      {hidden ? "?" : card.shape}
    </button>
  );
}

function MemoryGame() {
  const [started, setStarted] = useState(false);
  const [cards, setCards] = useState(createMemoryDeck());
  const [selectedIds, setSelectedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const matchedCount = useMemo(
    () => cards.filter((card) => card.matched).length,
    [cards]
  );

  const gameFinished = started && matchedCount === cards.length;

  const startGame = () => {
    setCards(createMemoryDeck());
    setSelectedIds([]);
    setMoves(0);
    setLocked(false);
    setStarted(true);
  };

  const restartGame = () => {
    setCards(createMemoryDeck());
    setSelectedIds([]);
    setMoves(0);
    setLocked(false);
    setStarted(true);
  };

  const handleCardClick = (cardId) => {
    if (!started || locked) return;

    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) return;
    if (selectedIds.length === 2) return;

    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, flipped: true } : card
    );

    const newSelected = [...selectedIds, cardId];
    setCards(updatedCards);
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      setLocked(true);
    }
  };

  useEffect(() => {
    if (selectedIds.length !== 2) return;

    const [firstId, secondId] = selectedIds;
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    if (!firstCard || !secondCard) {
      setSelectedIds([]);
      setLocked(false);
      return;
    }

    const timeout = setTimeout(() => {
      if (firstCard.shape === secondCard.shape) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, matched: true }
              : card
          )
        );
      } else {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, flipped: false }
              : card
          )
        );
      }

      setSelectedIds([]);
      setLocked(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [selectedIds, cards]);

  return (
    <section className="card">
      <div className="game-toolbar">
        <div className="memory-stats">
          <span><strong>Lépések:</strong> {moves}</span>
          <span><strong>Párok:</strong> {matchedCount / 2} / 8</span>
        </div>

        <div className="memory-actions">
          <button type="button" onClick={startGame}>
            Start
          </button>
          <button type="button" onClick={restartGame}>
            Újra
          </button>
        </div>
      </div>

      {!started ? (
        <p className="info-message">
          A játék indításához kattints a <strong>Start</strong> gombra.
        </p>
      ) : gameFinished ? (
        <p className="success-message">
          Gratulálok, megtaláltad az összes párt {moves} lépésből.
        </p>
      ) : (
        <p className="info-message">
          Fordíts fel két kártyát, és találd meg az egyforma alakzatokat.
        </p>
      )}

      <div className="memory-grid">
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            disabled={!started || locked}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </section>
  );
}

function CalculatorButton({ value, onClick, extraClass = "" }) {
  return (
    <button
      type="button"
      className={`calc-btn ${extraClass}`.trim()}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
}

function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");

  const appendValue = (value) => {
    setExpression((prev) => prev + value);
  };

  const clearAll = () => {
    setExpression("");
    setResult("0");
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const calculateResult = () => {
    if (!expression.trim()) return;

    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/");
      const calcValue = Function(`"use strict"; return (${sanitized})`)();
      setResult(String(calcValue));
    } catch {
      setResult("Hiba");
    }
  };

  return (
    <section className="card">
      <div className="calculator-screen">
        <div className="calculator-expression">
          {expression || "0"}
        </div>
        <div className="calculator-result">
          = {result}
        </div>
      </div>

      <div className="calculator-grid">
        <CalculatorButton value="C" onClick={clearAll} extraClass="special" />
        <CalculatorButton value="⌫" onClick={backspace} extraClass="special" />
        <CalculatorButton value="(" onClick={appendValue} />
        <CalculatorButton value=")" onClick={appendValue} />

        <CalculatorButton value="7" onClick={appendValue} />
        <CalculatorButton value="8" onClick={appendValue} />
        <CalculatorButton value="9" onClick={appendValue} />
        <CalculatorButton value="÷" onClick={appendValue} extraClass="operator" />

        <CalculatorButton value="4" onClick={appendValue} />
        <CalculatorButton value="5" onClick={appendValue} />
        <CalculatorButton value="6" onClick={appendValue} />
        <CalculatorButton value="×" onClick={appendValue} extraClass="operator" />

        <CalculatorButton value="1" onClick={appendValue} />
        <CalculatorButton value="2" onClick={appendValue} />
        <CalculatorButton value="3" onClick={appendValue} />
        <CalculatorButton value="-" onClick={appendValue} extraClass="operator" />

        <CalculatorButton value="0" onClick={appendValue} />
        <CalculatorButton value="." onClick={appendValue} />
        <CalculatorButton value="=" onClick={calculateResult} extraClass="equal" />
        <CalculatorButton value="+" onClick={appendValue} extraClass="operator" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>Készítette: Fodor Árpád - U4BKST |  Farkas Tamás - PLPJEB</p>
    </footer>
  );
}

function App() {
  const [activeMenu, setActiveMenu] = useState(MENU_MEMORY);

  return (
    <>
      <Header />
      <MainNavigation />

      <main className="container">
        <SpaTabs activeMenu={activeMenu} onChange={setActiveMenu} />
        <PageIntro activeMenu={activeMenu} />

        {activeMenu === MENU_MEMORY ? <MemoryGame /> : <Calculator />}
      </main>

      <Footer />
    </>
  );
}

export default App;