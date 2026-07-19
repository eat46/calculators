import DividendYieldEntry from "./DividendYieldEntry.jsx";
import Cagr from "./Cagr.jsx";
import ExDividends from "./ExDividends.jsx";
import WeightedGrowth from "./WeightedGrowth.jsx";

/**
 * 計算機清單,依用途分組。新增計算機時,把它加進對應分組的 items 即可,
 * 側邊欄與內容區都會自動帶出。
 *   group.title:  分組標題(側邊欄小標)
 *   item.id:      唯一字串
 *   item.title:   顯示名稱
 *   item.Component: React 元件(會收到共用的 symbol prop)
 *   item.props:   額外傳入的固定 props(選填)
 */
export const groups = [
  {
    title: "成長率",
    items: [
      { id: "cagr", title: "年複合成長率", Component: Cagr },
      {
        id: "growth-model",
        title: "情境加權成長率",
        Component: WeightedGrowth,
        props: { model: "weighted" },
      },
    ],
  },
  {
    title: "估值 / 買價",
    items: [
      {
        id: "dividend-yield-entry",
        title: "領息股殖利率反推買價",
        Component: DividendYieldEntry,
      },
      {
        id: "scenario-price",
        title: "情境分析合理價",
        Component: WeightedGrowth,
        props: { model: "price" },
      },
      { id: "ex-dividends", title: "除權息參考價", Component: ExDividends },
    ],
  },
];

// 攤平清單,供內容區一次掛載所有計算機用
export const calculators = groups.flatMap((g) => g.items);
