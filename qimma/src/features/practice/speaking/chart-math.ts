/**
 * Pure chart geometry for Describe Image charts. No React Native imports, so the
 * maths can be unit-tested with Vitest.
 */

const round = (n: number) => Number(n.toFixed(2));

export interface AxisTicks {
  /** Evenly spaced tick values, first to last. */
  ticks: number[];
  /** Lowest and highest tick; the plot maps these to its bottom and top edges. */
  lo: number;
  hi: number;
}

/** "Nice" axis ticks covering [min, max]. Zero is always on the scale. */
export function niceTicks(min: number, max: number, count = 5): AxisTicks {
  const lo0 = Math.min(0, min);
  // All-zero data still needs a scale to draw against.
  const hi0 = Math.max(0, max) > lo0 ? Math.max(0, max) : lo0 + 1;
  const span = hi0 - lo0;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(lo0 / step) * step;
  const hi = Math.ceil(hi0 / step) * step;
  const n = Math.round((hi - lo) / step);
  return {
    ticks: Array.from({ length: n + 1 }, (_, i) => Number((lo + i * step).toFixed(6))),
    lo: Number(lo.toFixed(6)),
    hi: Number(hi.toFixed(6)),
  };
}

/** Start and end fractions (0..1 of a full turn, clockwise from 12 o'clock) for each slice. */
export function pieFractions(values: number[]): { start: number; end: number }[] {
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0);
  let acc = 0;
  return values.map((v) => {
    const share = total > 0 ? Math.max(0, v) / total : 0;
    const start = acc;
    acc += share;
    return { start, end: acc };
  });
}

/** SVG path for one pie slice between two fractions of a full turn. */
export function pieSlicePath(cx: number, cy: number, r: number, start: number, end: number): string {
  const point = (f: number): [number, number] => {
    const angle = -Math.PI / 2 + f * 2 * Math.PI;
    return [round(cx + r * Math.cos(angle)), round(cy + r * Math.sin(angle))];
  };
  const [x1, y1] = point(start);
  const [x2, y2] = point(end);
  const large = end - start > 0.5 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

/** Share of `total` as a whole-number percentage label, e.g. "35%". */
export function percentLabel(value: number, total: number): string {
  if (total <= 0) return '0%';
  return `${Math.round((Math.max(0, value) / total) * 100)}%`;
}

/** Rough rendered width of a line of text at a given font size. */
export function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}

/** True when category labels would collide if drawn flat across their slots. */
export function needsRotation(labels: string[], slotWidth: number, fontSize = 11): boolean {
  return labels.some((label) => estimateTextWidth(label, fontSize) > slotWidth - 6);
}

/** Axis tick label: a plain number, with the unit appended when one is given. */
export function tickLabel(value: number, unit?: string): string {
  const n = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (!unit) return n;
  return unit === '%' ? `${n}%` : `${n} ${unit}`;
}
