import { useState } from "react";

/**
 * 設定驅動的簡易計算機表單(取代原專案的 CalculatorForm,不含 redux/驗證框架)。
 *
 * @param {string}   symbol      股票代號/名稱,顯示用
 * @param {string}   title       計算機標題
 * @param {string}   subtitle    輸入說明
 * @param {Array}    fields      欄位設定 [{ id, name, unit, required }]
 * @param {Function} compute     (values) => [{ label, value }]。可 throw Error 顯示錯誤訊息
 * @param {Function} [validate]   (values) => boolean,自訂送出條件;未提供則用「必填皆有效」
 * @param {Node}     [children]   標題下方額外內容(例:模式切換)
 */
export default function CalcForm({
  symbol,
  title,
  subtitle,
  fields,
  compute,
  validate,
  children,
}) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.id, ""]));
  const [values, setValues] = useState(blank);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const setField = (id, v) => setValues((s) => ({ ...s, [id]: v }));

  // 預設:必填皆為有效數字才可送出;有 validate 則以其為準
  const requiredOk = fields
    .filter((f) => f.required)
    .every((f) => values[f.id] !== "" && !Number.isNaN(parseFloat(values[f.id])));
  const canSubmit = validate ? validate(values) : requiredOk;

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      setResult(compute(values));
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err.message || "計算失敗,請檢查輸入");
    }
  };

  const onReset = () => {
    setValues(blank());
    setResult(null);
    setError(null);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.symbol}>{symbol}</span>
        <span style={styles.subtitle}>{title}</span>
      </div>

      <small style={styles.hint}>{subtitle}</small>

      {children}

      <form onSubmit={onSubmit}>
        {fields.map((f) => (
          <div style={styles.row} key={f.id}>
            <label style={styles.label}>
              {f.name}
              {f.required ? <span style={styles.req}> *</span> : null}
            </label>
            <input
              type="number"
              step="any"
              value={values[f.id]}
              placeholder={f.unit}
              onChange={(e) => setField(f.id, e.target.value)}
              style={styles.input}
            />
            {f.unit ? <span style={styles.unit}>{f.unit}</span> : null}
          </div>
        ))}

        {error ? <div style={styles.error}>{error}</div> : null}

        {result ? (
          <div style={styles.result}>
            {result.map((r) => (
              <div style={styles.resultRow} key={r.label}>
                <span style={styles.resultLabel}>{r.label}</span>
                <span style={styles.resultValue}>{r.value}</span>
              </div>
            ))}
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
  row: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  label: { fontSize: 14, color: "#374151", flex: 1 },
  req: { color: "#dc2626" },
  input: {
    width: 140,
    padding: "8px 10px",
    fontSize: 15,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontFamily: "inherit",
  },
  unit: { fontSize: 13, color: "#9ca3af", minWidth: 32 },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 12px",
    borderRadius: 6,
    fontSize: 14,
    marginTop: 4,
  },
  result: {
    background: "#f3f4f6",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  resultRow: {
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
