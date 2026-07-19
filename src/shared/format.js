// 千分位逗號,對應原專案的 NumberHandler.comma
export function comma(n) {
  const [int, dec] = String(n).split(".");
  const withComma = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec != null ? `${withComma}.${dec}` : withComma;
}
