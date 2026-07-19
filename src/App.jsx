import { useState } from "react";
import { groups, calculators } from "./calculators/index.js";

export default function App() {
  const [symbol, setSymbol] = useState("群光 2385");
  const [activeId, setActiveId] = useState(calculators[0]?.id ?? null);

  return (
    <div style={styles.shell}>
      <header style={styles.topbar}>
        <span style={styles.brand}>Calculators</span>
        <label style={styles.symbolLabel}>股票</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="股票代號/名稱"
          style={styles.symbolInput}
        />
      </header>

      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <nav>
            {groups.map((g) => (
              <div key={g.title} style={styles.group}>
                <div style={styles.groupTitle}>{g.title}</div>
                {g.items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    style={{
                      ...styles.navItem,
                      ...(c.id === activeId ? styles.navItemActive : null),
                    }}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main style={styles.main}>
          {/* 全部掛載、僅顯示當前一個 — 切換時各計算機的輸入與結果都會保留 */}
          {calculators.map((c) => (
            <div
              key={c.id}
              style={{ display: c.id === activeId ? "block" : "none" }}
            >
              <c.Component symbol={symbol} {...(c.props ?? {})} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#1a1a1a",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 20px",
    borderBottom: "0.5px solid #e5e7eb",
    background: "#fafafa",
  },
  brand: { fontSize: 16, fontWeight: 600, marginRight: "auto" },
  symbolLabel: { fontSize: 13, color: "#6b7280" },
  symbolInput: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1a1a1a",
    fontFamily: "inherit",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    padding: "6px 10px",
    width: 180,
  },
  body: { display: "flex", minHeight: "calc(100vh - 57px)" },
  sidebar: {
    width: 220,
    flexShrink: 0,
    borderRight: "0.5px solid #e5e7eb",
    padding: 16,
    background: "#fafafa",
  },
  group: { marginBottom: 18 },
  groupTitle: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "#9ca3af",
    padding: "0 10px",
    marginBottom: 6,
  },
  navItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "9px 10px",
    marginBottom: 4,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    fontSize: 14,
    color: "#374151",
    cursor: "pointer",
  },
  navItemActive: { background: "#e5e7eb", fontWeight: 500 },
  main: { flex: 1, padding: 32 },
};
