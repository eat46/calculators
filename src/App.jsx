import { useState } from "react";
import { groups, calculators } from "./calculators/index.js";
import Overview from "./calculators/Overview.jsx";
import useMediaQuery from "./shared/useMediaQuery.js";

export default function App() {
  const [symbol, setSymbol] = useState("群光 2385");
  const [activeId, setActiveId] = useState("overview");
  const [navOpen, setNavOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 行動裝置:選單為滑出式抽屜,選定後自動關閉
  const select = (id) => {
    setActiveId(id);
    if (isMobile) setNavOpen(false);
  };

  return (
    <div style={styles.shell}>
      <header style={styles.topbar}>
        {isMobile ? (
          <button
            type="button"
            aria-label="開啟選單"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
            style={styles.hamburger}
          >
            ☰
          </button>
        ) : null}
        <button type="button" onClick={() => select("overview")} style={styles.brand}>
          Calculators
        </button>
        {!isMobile ? <label style={styles.symbolLabel}>股票</label> : null}
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="股票代號/名稱"
          style={{ ...styles.symbolInput, ...(isMobile ? styles.symbolInputMobile : null) }}
        />
      </header>

      <div style={styles.body}>
        {/* 行動裝置抽屜開啟時的半透明遮罩,點擊關閉 */}
        {isMobile && navOpen ? (
          <div style={styles.backdrop} onClick={() => setNavOpen(false)} />
        ) : null}

        <aside
          style={{
            ...styles.sidebar,
            ...(isMobile ? styles.sidebarMobile : null),
            ...(isMobile && navOpen ? styles.sidebarMobileOpen : null),
          }}
        >
          <nav>
            <button
              onClick={() => select("overview")}
              style={{
                ...styles.navItem,
                ...styles.overviewItem,
                ...(activeId === "overview" ? styles.navItemActive : null),
              }}
            >
              總覽
            </button>
            {groups.map((g) => (
              <div key={g.title} style={styles.group}>
                <div style={styles.groupTitle}>{g.title}</div>
                {g.items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => select(c.id)}
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

        <main style={{ ...styles.main, ...(isMobile ? styles.mainMobile : null) }}>
          <div style={{ display: activeId === "overview" ? "block" : "none" }}>
            <Overview onSelect={select} />
          </div>

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
  hamburger: {
    fontSize: 20,
    lineHeight: 1,
    border: "none",
    background: "transparent",
    padding: 0,
    color: "#1a1a1a",
    cursor: "pointer",
  },
  brand: {
    fontSize: 16,
    fontWeight: 600,
    marginRight: "auto",
    border: "none",
    background: "transparent",
    padding: 0,
    color: "#1a1a1a",
    fontFamily: "inherit",
    cursor: "pointer",
  },
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
  symbolInputMobile: { width: 130, minWidth: 0 },
  body: { display: "flex", minHeight: "calc(100vh - 57px)" },
  sidebar: {
    width: 220,
    flexShrink: 0,
    borderRight: "0.5px solid #e5e7eb",
    padding: 16,
    background: "#fafafa",
  },
  // 行動裝置:抽屜預設收合到畫面左外側
  sidebarMobile: {
    position: "fixed",
    top: 57,
    left: 0,
    bottom: 0,
    width: 260,
    zIndex: 30,
    overflowY: "auto",
    transform: "translateX(-100%)",
    transition: "transform 0.2s ease",
    boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
  },
  sidebarMobileOpen: { transform: "translateX(0)" },
  backdrop: {
    position: "fixed",
    top: 57,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 20,
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
  overviewItem: { marginBottom: 18 },
  main: { flex: 1, padding: 32, minWidth: 0 },
  mainMobile: { padding: "20px 16px" },
};
