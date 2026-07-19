import CalcForm from "../shared/CalcForm.jsx";
import { comma } from "../shared/format.js";

/**
 * 除權息參考價:(除權息前股價 − 現金股利) / (1 + 股票股利 / 10)
 */
export default function ExDividends({ symbol }) {
  return (
    <CalcForm
      symbol={symbol}
      title="除權息參考價"
      subtitle="(請填入除權除息前股價、現金股利、股票股利)"
      fields={[
        { id: "price", name: "除權除息前股價", unit: "元", required: true },
        { id: "cash", name: "現金股利", unit: "元/股", required: false },
        { id: "stock", name: "股票股利", unit: "元/股", required: false },
      ]}
      compute={(v) => {
        const price = parseFloat(v.price);
        const cash = v.cash === "" ? 0 : parseFloat(v.cash);
        const stock = v.stock === "" ? 0 : parseFloat(v.stock);

        const ref = (price - cash) / (1 + stock / 10);
        return [{ label: "參考價試算結果", value: `${comma(ref.toFixed(2))} 元` }];
      }}
    />
  );
}
