import { useState, useRef, useEffect } from "react";
import kadLogo from "./assets/kad-logo.jpg";

const TOPICS = [
  "Array", "String", "Linked List", "Tree", "Graph", "DP", "Recursion",
  "Binary Search", "Stack", "Queue", "Heap", "Hashing", "Greedy",
  "Backtracking", "Sorting", "Math", "Two Pointers", "Sliding Window", "Other"
];

let nextId = 1;
function createRow() {
  return {
    id: nextId++,
    title: "",
    topic: "",
    url: "",
    notes: "",
  };
}

export default function App() {
  const [rows, setRows] = useState([createRow()]);
  const [search, setSearch] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [flash, setFlash] = useState(null);
  const bottomRef = useRef(null);
  const addedRef = useRef(false);

  const addRow = () => {
    setRows((prev) => [...prev, createRow()]);
    addedRef.current = true;
  };

  useEffect(() => {
    if (addedRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      addedRef.current = false;
    }
  }, [rows]);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setFlash("Row deleted.");
    setTimeout(() => setFlash(null), 1800);
  };

  const filtered = rows.filter((r) => {
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.topic.toLowerCase().includes(search.toLowerCase());
    const matchTopic = !filterTopic || r.topic === filterTopic;
    return matchSearch && matchTopic;
  });

  const total = rows.length;

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <img src={kadLogo} alt="Kad logo" style={styles.logoImg} />
            <div>
              <h1 style={styles.title}>Kad's Dastal Sheet</h1>
              <p style={styles.subtitle}>Track · Solve · Conquer</p>
            </div>
          </div>
          <div style={styles.statBox}>
            <span style={{ ...styles.statNum, color: "#e0e0e0" }}>{total}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
        </header>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <input
            placeholder="🔍  Search problems…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            style={styles.select}
          >
            <option value="">All Topics</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button onClick={addRow} style={styles.addBtn}>
            + Add a Row
          </button>
        </div>

        {flash && <div style={styles.flash}>{flash}</div>}

        {/* Table */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["#", "Problem Title", "Topic", "URL", "Notes", ""].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={styles.emptyCell}>
                    No problems match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((row, idx) => (
                <tr key={row.id} style={styles.tr}>
                  <td style={{ ...styles.td, ...styles.indexCell }}>{idx + 1}</td>

                  {/* Problem Title */}
                  <td style={styles.td}>
                    <input
                      placeholder="e.g. Two Sum"
                      value={row.title}
                      onChange={(e) => updateRow(row.id, "title", e.target.value)}
                      style={{ ...styles.cellInput, minWidth: 200 }}
                    />
                  </td>

                  {/* Topic */}
                  <td style={styles.td}>
                    <select
                      value={row.topic}
                      onChange={(e) => updateRow(row.id, "topic", e.target.value)}
                      style={{ ...styles.cellInput, minWidth: 140 }}
                    >
                      <option value="">— Topic —</option>
                      {TOPICS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </td>

                  {/* URL */}
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input
                        placeholder="https://…"
                        value={row.url}
                        onChange={(e) => updateRow(row.id, "url", e.target.value)}
                        style={{ ...styles.cellInput, minWidth: 200 }}
                      />
                      {row.url && (
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.urlIcon}
                          title="Open link"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Notes */}
                  <td style={styles.td}>
                    <input
                      placeholder="Optional notes…"
                      value={row.notes}
                      onChange={(e) => updateRow(row.id, "notes", e.target.value)}
                      style={{ ...styles.cellInput, minWidth: 160 }}
                    />
                  </td>

                  {/* Delete */}
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <button
                      onClick={() => deleteRow(row.id)}
                      style={styles.deleteBtn}
                      title="Delete row"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div style={styles.footerRow}>
          <button onClick={addRow} style={styles.addBtnSecondary}>
            + Add a Row
          </button>
          <span style={styles.footerNote}>{total} problems tracked</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0d12",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    color: "#d4d4d8",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed", top: -120, left: -100,
    width: 420, height: 420, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  blob2: {
    position: "fixed", bottom: -100, right: -80,
    width: 360, height: 360, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(120,80,255,0.10) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  container: {
    position: "relative", zIndex: 1,
    maxWidth: 1100, margin: "0 auto",
    padding: "32px 24px 60px",
  },
  header: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24, flexWrap: "wrap", gap: 16,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 18 },
  logoImg: {
    width: 54,
    height: 54,
    borderRadius: 14,
    objectFit: "cover",
    boxShadow: "0 0 24px rgba(0,200,150,0.3)",
    border: "1px solid rgba(0,200,150,0.2)",
  },
  title: {
    margin: 0, fontSize: "1.75rem", fontWeight: 800,
    letterSpacing: "-0.04em",
    background: "linear-gradient(90deg, #00c896 0%, #7850ff 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: {
    margin: "2px 0 0", fontSize: "0.72rem",
    letterSpacing: "0.18em", textTransform: "uppercase", color: "#555",
  },
  statBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10, padding: "8px 24px",
  },
  statNum: { fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 },
  statLabel: {
    fontSize: "0.65rem", color: "#555",
    letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4,
  },
  toolbar: {
    display: "flex", gap: 10, flexWrap: "wrap",
    alignItems: "center", marginBottom: 16,
  },
  searchInput: {
    flex: 1, minWidth: 200,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, padding: "9px 14px",
    color: "#d4d4d8", fontSize: "0.82rem",
    fontFamily: "inherit", outline: "none",
  },
  select: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, padding: "9px 12px",
    color: "#d4d4d8", fontSize: "0.82rem",
    fontFamily: "inherit", outline: "none", cursor: "pointer",
  },
  addBtn: {
    background: "linear-gradient(135deg, #00c896 0%, #00a47c 100%)",
    color: "#0b0d12", border: "none", borderRadius: 8,
    padding: "9px 20px", fontWeight: 700, fontSize: "0.82rem",
    fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.04em",
    boxShadow: "0 0 16px rgba(0,200,150,0.25)", transition: "transform 0.1s",
  },
  flash: {
    background: "rgba(255,70,70,0.12)",
    border: "1px solid rgba(255,70,70,0.3)",
    borderRadius: 8, padding: "8px 16px",
    marginBottom: 10, fontSize: "0.8rem", color: "#ff7070",
  },
  tableWrap: {
    overflowX: "auto", borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(8px)",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" },
  th: {
    padding: "12px 14px", textAlign: "left",
    fontSize: "0.65rem", letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#555",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    whiteSpace: "nowrap", background: "rgba(0,0,0,0.2)",
  },
  tr: {
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "background 0.15s",
  },
  td: { padding: "8px 10px", verticalAlign: "middle" },
  indexCell: {
    color: "#444", fontSize: "0.72rem",
    paddingLeft: 16, userSelect: "none", width: 32,
  },
  emptyCell: {
    textAlign: "center", color: "#444",
    padding: "40px 0", fontStyle: "italic",
  },
  cellInput: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid transparent",
    borderRadius: 6, padding: "6px 10px",
    color: "#d4d4d8", fontSize: "0.82rem",
    fontFamily: "inherit", width: "100%",
    outline: "none", transition: "border-color 0.15s",
  },
  urlIcon: {
    color: "#7850ff", fontSize: "1rem",
    textDecoration: "none", lineHeight: 1, flexShrink: 0,
  },
  deleteBtn: {
    background: "transparent",
    border: "1px solid rgba(255,70,70,0.2)",
    borderRadius: 6, color: "#ff4d6d",
    width: 28, height: 28, cursor: "pointer",
    fontSize: "0.75rem", transition: "all 0.15s",
  },
  footerRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16, flexWrap: "wrap", gap: 10,
  },
  addBtnSecondary: {
    background: "transparent", color: "#00c896",
    border: "1px solid rgba(0,200,150,0.4)",
    borderRadius: 8, padding: "8px 18px",
    fontWeight: 600, fontSize: "0.82rem",
    fontFamily: "inherit", cursor: "pointer",
    letterSpacing: "0.04em", transition: "all 0.15s",
  },
  footerNote: { fontSize: "0.72rem", color: "#444", letterSpacing: "0.08em" },
};