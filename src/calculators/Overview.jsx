import { groups } from "./index.js";

/**
 * 總覽頁 — 預設落地畫面。介紹整個工具集,並以卡片列出每個計算機與「何時使用」。
 * 點卡片即切換到該計算機。
 *
 * @param {Function} onSelect  (id) => void,切換到指定計算機
 */
export default function Overview({ onSelect }) {
  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>投資研究計算機</h1>
      <p style={styles.lead}>
        一組給台股投資研究用的小工具:估算成長率、反推合理買價、試算除權息參考價。
        全部在瀏覽器端計算,選左側任一工具即可開始,右上角輸入的股票代號會共用。
      </p>

      {groups.map((g) => (
        <section key={g.title} style={styles.section}>
          <div style={styles.sectionTitle}>{g.title}</div>
          <div style={styles.cards}>
            {g.items.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                style={styles.card}
              >
                <div style={styles.cardTitle}>{c.title}</div>
                <div style={styles.cardBlurb}>{c.blurb}</div>
                <span style={styles.cardCta}>開啟 →</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 720,
    color: "#1a1a1a",
  },
  title: { fontSize: 26, fontWeight: 600, margin: "0 0 12px" },
  lead: {
    fontSize: 15,
    lineHeight: 1.7,
    color: "#4b5563",
    margin: "0 0 28px",
  },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 12,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
  },
  card: {
    display: "block",
    textAlign: "left",
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    background: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  cardTitle: { fontSize: 15, fontWeight: 500, marginBottom: 6 },
  cardBlurb: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#6b7280",
    marginBottom: 12,
  },
  cardCta: { fontSize: 13, color: "#2563eb", fontWeight: 500 },
};
