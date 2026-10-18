/** 32-bit FNV-1a hash: the same string always gives the same seed. */
export function hashSeed(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Stable Fisher–Yates shuffle: the same items and seed always give the same order. */
export function stableShuffle<T>(items: readonly T[], seed: string): T[] {
  let state = hashSeed(seed);
  // mulberry32 generator
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Stable shuffle that never reproduces `forbidden` (e.g. the correct order) when there
 * are two or more items. Retries with derived seeds; reversing is the last resort.
 */
export function shuffleAway<T>(items: readonly T[], seed: string, forbidden: readonly T[]): T[] {
  if (items.length < 2) return [...items];
  const same = (a: readonly T[], b: readonly T[]) => a.length === b.length && a.every((v, i) => v === b[i]);
  for (let attempt = 0; attempt < 8; attempt++) {
    const out = stableShuffle(items, attempt === 0 ? seed : `${seed}#${attempt}`);
    if (!same(out, forbidden)) return out;
  }
  return [...items].reverse();
}
