import { useState } from "react";
import { comma } from "../shared/format.js";

/**
 * 成長率思考模型 / 情境分析合理價
 *
 * 三個情境,各填一個數值(成長率或股價)與發生機率,機率合計需為 100%。
 * 結果為機率加權平均:
 *   weighted (成長率): Σ(estimate_i × prob_i / 100)  → %
 *   price    (合理價): Σ(price_i    × prob_i / 100)  → 元
 *
 * @param {string} symbol  股票代號/名稱,顯示用
 * @param {"weighted"|"price"} model  計算模式
 */
const SCENARIOS = ["情境一", "情境二", "情境三"];

const CONFIG = {
  weighted: {
    title: "成長率思考模型",
    valueLabel: "成長率預測值 (%)",
    valueUnit: "%",
    resultLabel: "加權平均成長率",
    digits: 1,
    resultUnit: "％",
  },
  price: {
    title: "情境分析合理價",
    valueLabel: "合理價 (元)",
    valueUnit: "元",
    resultLabel: "情境分析合理價",
    digits: 0,
    resultUnit: " 元",
  },
};

export default function WeightedGrowth({ symbol, model = "weighted" }) {
  const cfg = CONFIG[model];
  const [rows, setRows] = useState(
    SCENARIOS.map(() => ({ value: "", prob: "" }))
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const setCell = (idx, key, v) =>
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, [key]: v } : r)));

  const allFilled = rows.every((r) => r.value !== "" && r.prob !== "");
  const probSum = rows.reduce((s, r) => s + (parseFloat(r.prob) || 0), 0);
  const canSubmit = allFilled && probSum === 100;

  const onSubmit = (e) => {
    e.preventDefault();
    if (probSum !== 100) {
      setError(`機率合計需為 100%,目前為 ${comma(probSum)}%`);
      setResult(null);
      return;
    }
    const weighted = rows.reduce(
      (s, r) => s + (parseFloat(r.value) * parseFloat(r.prob)) / 100,
      0
    );
    setResult(`${comma(weighted.toFixed(cfg.digits))}${cfg.resultUnit}`);
    setError(null);
  };

  const onReset = () => {
    setRows(SCENARIOS.map(() => ({ value: "", prob: "" })));
    setResult(null);
    setError(null);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.symbol}>{symbol}</span>
        <span style={styles.subtitle}>{cfg.title}</span>
      </div>
      <small style={styles.hint}>(請填寫三個情境,機率合計需為 100%)</small>

      <form onSubmit={onSubmit}>
        <div style={styles.grid}>
          <div style={styles.th} />
          <div style={styles.th}>{cfg.valueLabel}</div>
          <div style={styles.th}>發生機率 (%)</div>

          {rows.map((r, i) => (
            <Row
              key={i}
              name={SCENARIOS[i]}
              row={r}
              valueUnit={cfg.valueUnit}
              onValue={(v) => setCell(i, "value", v)}
              onProb={(v) => setCell(i, "prob", v)}
            />
          ))}
        </div>

        <div style={{ ...styles.sumRow, color: probSum === 100 ? "#166534" : "#92400e" }}>
          機率合計:{comma(probSum)}%
        </div>

        {error ? <div style={styles.error}>{error}</div> : null}

        {result ? (
          <div style={styles.result}>
            <span style={styles.resultLabel}>{cfg.resultLabel}</span>
            <span style={styles.resultValue}>{result}</span>
          </div>
        ) : null}

        <div style={styles.actions}>
          <button type="button" onClick={onReset} style={styles.btnGhost}>
            清除
          </button>
          <button type="submit" disabled={!canSubmit} style={styles.btn(canSubmit)}>
            計算
          </button>
        </div>
      </form>
    </div>
  );
}

function Row({ name, row, valueUnit, onValue, onProb }) {
  return (
    <>
      <div style={styles.rowLabel}>{name}</div>
      <input
        type="number"
        step="any"
        value={row.value}
        placeholder={valueUnit}
        onChange={(e) => onValue(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        step="any"
        value={row.prob}
        placeholder="%"
        onChange={(e) => onProb(e.target.value)}
        style={styles.input}
      />
    </>
  );
}

const styles = {
  wrap: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 520,
    color: "#1a1a1a",
  },
  header: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 },
  symbol: { fontSize: 18, fontWeight: 500 },
  subtitle: { fontSize: 14, color: "#6b7280" },
  hint: { display: "block", fontSize: 13, color: "#9ca3af", marginBottom: 20 },
  grid: {
    display: "grid",
    gridTemplateColumns: "72px 1fr 1fr",
    gap: 10,
    alignItems: "center",
  },
  th: { fontSize: 13, color: "#6b7280", textAlign: "center" },
  rowLabel: { fontSize: 14, color: "#374151" },
  input: {
    padding: "8px 10px",
    fontSize: 15,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },
  sumRow: { fontSize: 13, textAlign: "right", marginTop: 10 },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 12px",
    borderRadius: 6,
    fontSize: 14,
    marginTop: 8,
  },
  result: {
    background: "#f3f4f6",
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  resultLabel: { fontSize: 14, color: "#6b7280" },
  resultValue: { fontSize: 24, fontWeight: 500 },
  actions: { display: "flex", gap: 12, marginTop: 20 },
  btnGhost: {
    padding: "9px 20px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btn: (enabled) => ({
    padding: "9px 20px",
    fontSize: 14,
    border: "none",
    borderRadius: 6,
    background: enabled ? "#2563eb" : "#cbd5e1",
    color: "#fff",
    cursor: enabled ? "pointer" : "not-allowed",
    fontFamily: "inherit",
  }),
};
