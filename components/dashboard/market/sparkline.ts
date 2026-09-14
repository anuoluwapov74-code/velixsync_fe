// Builds an SVG path (and filled area beneath it) from a series of prices,
// scaled to fit a `width` x `height` box. Pure layout math — no styling.

export function buildSparklinePath(prices: number[], width: number, height: number, padding = 3): string {
  if (prices.length < 2) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const step = (width - padding * 2) / (prices.length - 1);

  return prices
    .map((p, i) => {
      const x = padding + i * step;
      const y = padding + ((max - p) / range) * (height - padding * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function buildSparklineArea(prices: number[], width: number, height: number, padding = 3): string {
  if (prices.length < 2) return "";
  const linePath = buildSparklinePath(prices, width, height, padding);
  const lastX = padding + (prices.length - 1) * ((width - padding * 2) / (prices.length - 1));
  const baseY = padding + height - padding;
  const firstX = padding;
  return `${linePath} L${lastX.toFixed(2)},${baseY.toFixed(2)} L${firstX.toFixed(2)},${baseY.toFixed(2)} Z`;
}
