import { useMemo, useState } from "react";

// 成本低於此值視為「未持有」,避免誤輸入 0.1 之類的極小值算出離譜殖利率
const MIN_COST = 1;

/**
 * 領息股殖利率反推買價計算機
 *
 * 邏輯:對領息股而言,買進價格決定殖利率,殖利率決定投資成敗。
 * 進場前先設「最低可接受殖利率」門檻,用「股利 ÷ 門檻殖利率」反推最高買價。
 *
 * 三條分層買價:
 *   - 地板價 (floor):保守股利 ÷ 門檻殖利率 → 股利掉回歷史低點也還安全的價位
 *   - 常態線 (normal):股利區間中值 ÷ 門檻殖利率 → 日常掛單參考位
 *   - 樂觀價 (optimistic):樂觀股利 ÷ 門檻殖利率 → 用預估股利反推
 *
 * @param {string}  symbol           股票代號/名稱,顯示用
 * @param {number}  price            現價
 * @param {number}  cost             你的持有成本 (0 表示未持有)
 * @param {number}  lowDividend      保守股利 (建議用近五年最低)
 * @param {number}  highDividend     樂觀股利 (預估或近期)
 * @param {number}  targetYield      目標殖利率門檻,以百分比傳入 (例:6.7 代表 6.70%)
 */
export default function DividendYieldEntry({
  symbol = "",
  price = 0,
  cost = 0,
  lowDividend = 4.0,
  highDividend = 7.2,
  targetYield = 5.0,
}) {
  const [low, setLow] = useState(lowDividend);
  const [high, setHigh] = useState(highDividend);
  const [yieldTarget, setYieldTarget] = useState(targetYield);
  const [priceInput, setPrice] = useState(price);
  const [costInput, setCost] = useState(cost);

  // 保守股利不得高於樂觀股利
  const safeLow = Math.min(low, high);
  const safeHigh = Math.max(low, high);
  // 現價需為正值才能算殖利率;成本需達門檻才視為「有持有」
  const safePrice = priceInput > 0 ? priceInput : price;
  const hasCost = costInput >= MIN_COST;

  const result = useMemo(() => {
    const y = yieldTarget / 100;
    const mid = (safeLow + safeHigh) / 2;

    const floorPrice = safeLow / y;
    const normalPrice = mid / y;
    const optimisticPrice = safeHigh / y;

    const hasPrice = safePrice > 0;
    const currentYield = hasPrice ? (safeLow / safePrice) * 100 : null; // 用保守股利算現價殖利率
    const costYield = hasCost ? (safeLow / costInput) * 100 : null;

    let verdict;
    if (!hasPrice) {
      verdict = {
        tone: "plain",
        text: "請輸入現價,即可比對地板價 / 樂觀買價,判斷目前估值是否進場。",
      };
    } else if (safePrice <= floorPrice) {
      verdict = {
        tone: "safe",
        text: `現價 ${fmt(safePrice)} 已低於地板價 ${fmt(
          floorPrice
        )} — 即便股利掉到保守值,殖利率仍達門檻,估值上是安全買點。`,
      };
    } else if (safePrice <= optimisticPrice) {
      const gap = ((safePrice - floorPrice) / floorPrice) * 100;
      verdict = {
        tone: "warn",
        text: `現價 ${fmt(safePrice)} 介於地板價 ${fmt(floorPrice)} 與樂觀買價 ${fmt(
          optimisticPrice
        )} 之間,比地板價貴約 ${Math.round(
          gap
        )}%。用樂觀股利看合理,用保守股利看仍偏高。${costYield != null
          ? `你的成本 ${fmt(costInput)} 對應保守殖利率僅 ${pct(costYield)}。`
          : ""
          }`,
      };
    } else {
      verdict = {
        tone: "danger",
        text: `現價 ${fmt(safePrice)} 高於樂觀買價 ${fmt(
          optimisticPrice
        )} — 怎麼算殖利率都不到門檻,估值上不該進場。`,
      };
    }

    return {
      floorPrice,
      normalPrice,
      optimisticPrice,
      currentYield,
      costYield,
      verdict,
    };
  }, [safeLow, safeHigh, yieldTarget, safePrice, hasCost, costInput]);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.symbol}>{symbol}</span>
        <span style={styles.subtitle}>殖利率反推買價</span>
      </div>

      <div style={styles.cards}>
        <NumberField
          label="現價"
          value={priceInput}
          min={0}
          step={0.1}
          onChange={setPrice}
        />
        <NumberField
          label="你的成本(未持有留 0)"
          value={costInput}
          min={0}
          step={0.1}
          onChange={setCost}
        />
        <Stat
          label="現價殖利率(保守)"
          value={result.currentYield == null ? "—" : pct(result.currentYield)}
        />
      </div>

      <Slider
        label="保守股利(地板)"
        min={2}
        max={15}
        step={0.1}
        value={low}
        onChange={setLow}
        format={fmt}
      />
      <Slider
        label="樂觀股利(預估)"
        min={2}
        max={20}
        step={0.1}
        value={high}
        onChange={setHigh}
        format={fmt}
      />
      <Slider
        label="目標殖利率門檻"
        min={3}
        max={10}
        step={0.1}
        value={yieldTarget}
        onChange={setYieldTarget}
        format={pct}
      />

      <div style={styles.divider} />
      <div style={styles.tierLabel}>分層合理買價</div>

      <Tier
        tone="safe"
        title="閉眼買地板價"
        note="保守股利 ÷ 門檻殖利率"
        value={fmt(result.floorPrice)}
      />
      <Tier
        tone="accent"
        title="常態進場線"
        note="股利區間中值 ÷ 門檻殖利率"
        value={fmt(result.normalPrice)}
      />
      <Tier
        tone="plain"
        title="樂觀情境買價"
        note="樂觀股利 ÷ 門檻殖利率"
        value={fmt(result.optimisticPrice)}
      />

      <div style={{ ...styles.verdict, ...verdictTone[result.verdict.tone] }}>
        {result.verdict.text}
      </div>
    </div>
  );
}

/* ---------- 子元件 ---------- */

function Stat({ label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function NumberField({ label, value, min, step, onChange }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(Number.isNaN(n) ? 0 : n);
        }}
        style={styles.numberInput}
      />
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange, format }) {
  return (
    <div style={styles.sliderRow}>
      <label style={styles.sliderLabel}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={styles.slider}
      />
      <span style={styles.sliderOut}>{format(value)}</span>
    </div>
  );
}

function Tier({ tone, title, note, value }) {
  return (
    <div style={{ ...styles.tier, ...tierTone[tone] }}>
      <div>
        <div style={styles.tierTitle}>{title}</div>
        <div style={styles.tierNote}>{note}</div>
      </div>
      <div style={styles.tierValue}>{value}</div>
    </div>
  );
}

/* ---------- 格式化 ---------- */

const fmt = (n) => n.toFixed(2);
const pct = (n) => `${n.toFixed(2)}%`;

/* ---------- 樣式 ---------- */

const styles = {
  wrap: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 520,
    color: "#1a1a1a",
  },
  header: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 },
  symbol: { fontSize: 18, fontWeight: 500 },
  subtitle: { fontSize: 14, color: "#6b7280" },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  statCard: { background: "#f3f4f6", borderRadius: 8, padding: 16 },
  statLabel: { fontSize: 13, color: "#6b7280" },
  statValue: { fontSize: 24, fontWeight: 500, marginTop: 2 },
  numberInput: {
    width: "100%",
    marginTop: 2,
    padding: 0,
    border: "none",
    background: "transparent",
    fontSize: 24,
    fontWeight: 500,
    color: "#1a1a1a",
    fontFamily: "inherit",
  },
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sliderLabel: { fontSize: 14, color: "#6b7280", minWidth: 118 },
  slider: { flex: 1 },
  sliderOut: {
    fontSize: 14,
    fontWeight: 500,
    minWidth: 56,
    textAlign: "right",
  },
  divider: {
    borderTop: "0.5px solid #e5e7eb",
    marginTop: 8,
    paddingTop: 20,
  },
  tierLabel: { fontSize: 14, color: "#6b7280", marginBottom: 12 },
  tier: {
    borderRadius: 8,
    padding: "12px 14px",
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tierTitle: { fontSize: 14, fontWeight: 500 },
  tierNote: { fontSize: 12, marginTop: 2, opacity: 0.85 },
  tierValue: { fontSize: 22, fontWeight: 500 },
  verdict: {
    marginTop: 20,
    padding: "12px 14px",
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.6,
  },
};

const tierTone = {
  safe: { background: "#dcfce7", color: "#166534" },
  accent: { background: "#dbeafe", color: "#1e40af" },
  plain: { background: "#f3f4f6", color: "#1a1a1a" },
};

const verdictTone = {
  safe: { background: "#dcfce7", color: "#166534" },
  warn: { background: "#fef3c7", color: "#92400e" },
  danger: { background: "#fee2e2", color: "#991b1b" },
  plain: { background: "#f3f4f6", color: "#6b7280" },
};
