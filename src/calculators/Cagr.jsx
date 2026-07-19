import { useState } from "react";
import CalcForm from "../shared/CalcForm.jsx";
import { comma } from "../shared/format.js";

/**
 * 年複合成長率 (CAGR) — 兩種輸入模式:
 *   endpoints 期初期末:(期末 / 期初)^(1/年) − 1
 *   yearly    逐年成長率:∏(1 + 年成長率ᵢ/100) 開 n 次方 − 1(至少兩年)
 */
const MODES = {
  endpoints: {
    tab: "期初 / 期末",
    subtitle: "(請填入年份、期初數值、期末數值)",
    fields: [
      { id: "year", name: "計算幾年的年複合成長率", unit: "年", required: true },
      { id: "initial", name: "期初數值", unit: "", required: true },
      { id: "terminal", name: "期末數值", unit: "", required: true },
    ],
    compute: (v) => {
      const year = parseFloat(v.year);
      const initial = parseFloat(v.initial);
      const terminal = parseFloat(v.terminal);

      if (year <= 0) throw new Error("年份需大於 0");
      if (initial <= 0) throw new Error("期初數值需大於 0");

      const rate = (Math.pow(terminal / initial, 1 / year) - 1) * 100;
      return [{ label: "年複合成長率", value: `${comma(rate.toFixed(1))}％` }];
    },
  },
  yearly: {
    tab: "逐年成長率",
    subtitle: "(填入各年度成長率 %,至少兩年;空白年份自動略過)",
    fields: [
      { id: "y1", name: "第 1 年", unit: "%", required: false },
      { id: "y2", name: "第 2 年", unit: "%", required: false },
      { id: "y3", name: "第 3 年", unit: "%", required: false },
      { id: "y4", name: "第 4 年", unit: "%", required: false },
      { id: "y5", name: "第 5 年", unit: "%", required: false },
    ],
    // 至少兩個有效數字才可送出
    validate: (v) =>
      ["y1", "y2", "y3", "y4", "y5"].filter(
        (k) => v[k] !== "" && !Number.isNaN(parseFloat(v[k]))
      ).length >= 2,
    compute: (v) => {
      const rates = ["y1", "y2", "y3", "y4", "y5"]
        .map((k) => v[k])
        .filter((x) => x !== "" && !Number.isNaN(parseFloat(x)))
        .map(parseFloat);

      if (rates.length < 2) throw new Error("請至少填入兩個年度成長率");

      const product = rates.reduce((p, r) => p * (1 + r / 100), 1);
      const cagr = (Math.pow(product, 1 / rates.length) - 1) * 100;
      return [{ label: "年複合成長率", value: `${comma(cagr.toFixed(2))}％` }];
    },
  },
};

export default function Cagr({ symbol }) {
  const [mode, setMode] = useState("endpoints");
  const m = MODES[mode];

  return (
    <CalcForm
      key={mode}
      symbol={symbol}
      title="年複合成長率 (CAGR)"
      subtitle={m.subtitle}
      fields={m.fields}
      validate={m.validate}
      compute={m.compute}
    >
      <div style={styles.toggle}>
        {Object.entries(MODES).map(([key, cfg]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            style={{
              ...styles.toggleBtn,
              ...(mode === key ? styles.toggleActive : null),
            }}
          >
            {cfg.tab}
          </button>
        ))}
      </div>
    </CalcForm>
  );
}

const styles = {
  toggle: {
    display: "inline-flex",
    padding: 3,
    borderRadius: 8,
    background: "#f3f4f6",
    marginBottom: 20,
  },
  toggleBtn: {
    padding: "6px 14px",
    fontSize: 13,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  toggleActive: {
    background: "#fff",
    color: "#1a1a1a",
    fontWeight: 500,
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  },
};
