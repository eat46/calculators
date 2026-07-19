import DividendYieldEntry from "./DividendYieldEntry.jsx";
import Cagr from "./Cagr.jsx";
import ExDividends from "./ExDividends.jsx";
import WeightedGrowth from "./WeightedGrowth.jsx";

/**
 * 計算機清單,依用途分組。新增計算機時,把它加進對應分組的 items 即可,
 * 側邊欄、內容區與總覽頁都會自動帶出。
 *   group.title:  分組標題(側邊欄小標)
 *   item.id:      唯一字串
 *   item.title:   顯示名稱
 *   item.blurb:   一句話「何時使用」,總覽頁用
 *   item.Component: React 元件(會收到共用的 symbol prop)
 *   item.props:   額外傳入的固定 props(選填)
 */
export const groups = [
  {
    title: "成長率",
    items: [
      {
        id: "cagr",
        title: "年複合成長率",
        blurb: "已知期初、期末數值,算年化成長率;或用逐年成長率求幾何平均。",
        Component: Cagr,
      },
      {
        id: "growth-model",
        title: "情境加權成長率",
        blurb: "對未來成長率不確定時,用多個情境 × 發生機率推估期望成長率。",
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
        blurb: "設定可接受的殖利率門檻,反推地板價 / 常態 / 樂觀三檔買價。",
        Component: DividendYieldEntry,
      },
      {
        id: "scenario-price",
        title: "情境分析合理價",
        blurb: "對合理價不確定時,用多個情境 × 發生機率推估期望合理價。",
        Component: WeightedGrowth,
        props: { model: "price" },
      },
      {
        id: "ex-dividends",
        title: "除權息參考價",
        blurb: "除權除息前,計算填權息的參考股價。",
        Component: ExDividends,
      },
    ],
  },
];

// 攤平清單,供內容區一次掛載所有計算機用
export const calculators = groups.flatMap((g) => g.items);
