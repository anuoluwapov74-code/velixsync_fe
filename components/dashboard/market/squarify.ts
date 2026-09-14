// Squarified treemap layout (Bruls, Huizing & van Wijk, 1999).
// Lays `items` out inside a rect (x, y, w, h) as nested rows/columns whose
// aspect ratios stay as close to square as possible. Values don't need to
// be pre-normalized to the rect's area — each split only ever uses ratios
// of the *remaining* items, so proportional area is preserved regardless
// of the units `value` is expressed in.

export interface TreemapInput {
  value: number;
}

export type TreemapRect<T> = T & { x: number; y: number; w: number; h: number };

function worstRatio(row: TreemapInput[], length: number): number {
  const sum = row.reduce((s, d) => s + d.value, 0);
  if (sum <= 0 || length <= 0) return Infinity;
  const max = Math.max(...row.map((d) => d.value));
  const min = Math.min(...row.map((d) => d.value));
  return Math.max(
    (length * length * max) / (sum * sum),
    (sum * sum) / (length * length * min)
  );
}

export function squarify<T extends TreemapInput>(
  items: T[],
  x: number,
  y: number,
  w: number,
  h: number
): TreemapRect<T>[] {
  const results: TreemapRect<T>[] = [];
  let remaining = [...items].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  let rx = x, ry = y, rw = w, rh = h;

  while (remaining.length > 0 && rw > 0 && rh > 0) {
    const length = Math.min(rw, rh);

    let row: T[] = [remaining[0]];
    let i = 1;
    while (i < remaining.length) {
      const candidate = [...row, remaining[i]];
      if (worstRatio(candidate, length) <= worstRatio(row, length)) {
        row = candidate;
        i++;
      } else {
        break;
      }
    }

    const rowSum = row.reduce((s, d) => s + d.value, 0);
    const remainingSum = remaining.reduce((s, d) => s + d.value, 0);
    const rowShare = remainingSum > 0 ? rowSum / remainingSum : 0;

    if (rw >= rh) {
      // Wide rect: peel off a vertical strip on the left, items stacked top-to-bottom.
      const stripW = rowShare * rw;
      let offsetY = ry;
      for (const d of row) {
        const itemH = rowSum > 0 ? (d.value / rowSum) * rh : 0;
        results.push({ ...d, x: rx, y: offsetY, w: stripW, h: itemH });
        offsetY += itemH;
      }
      rx += stripW;
      rw -= stripW;
    } else {
      // Tall rect: peel off a horizontal strip on top, items laid left-to-right.
      const stripH = rowShare * rh;
      let offsetX = rx;
      for (const d of row) {
        const itemW = rowSum > 0 ? (d.value / rowSum) * rw : 0;
        results.push({ ...d, x: offsetX, y: ry, w: itemW, h: stripH });
        offsetX += itemW;
      }
      ry += stripH;
      rh -= stripH;
    }

    remaining = remaining.slice(row.length);
  }

  return results;
}
