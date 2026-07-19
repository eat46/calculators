import { useSyncExternalStore } from "react";

/**
 * 訂閱 CSS media query,回傳目前是否符合。用於在純 inline-style 的元件裡
 * 做響應式切換(inline style 無法寫 @media)。
 *
 * @param {string} query  例:"(max-width: 768px)"
 * @returns {boolean}
 */
export default function useMediaQuery(query) {
  const subscribe = (onChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
  const getSnapshot = () => window.matchMedia(query).matches;
  // SSR / 無 window 時預設為非行動裝置
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
