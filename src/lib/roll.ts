import type { Facet, FacetItem, FacetRoll } from './facets/types';

/** Draws `k` distinct items uniformly (partial Fisher–Yates), in draw order. */
export function sampleDistinct<T>(
  items: readonly T[],
  k: number,
  rng: () => number = Math.random,
): T[] {
  const n = items.length;
  const take = Math.max(0, Math.min(k, n));
  const idx = Array.from({ length: n }, (_, i) => i);
  const out: T[] = [];
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(rng() * (n - i));
    const tmp = idx[i];
    idx[i] = idx[j];
    idx[j] = tmp;
    out.push(items[idx[i]]);
  }
  return out;
}

/**
 * Draws `count` items, at most one per declared family — "role-playing action role-playing"
 * is a distinct draw but says one thing twice. Comes up short only when the pool runs out
 * of unused families.
 */
export function rollFacet(facet: Facet, count: number, rng?: () => number): FacetRoll {
  const clamped = Math.max(facet.count.min, Math.min(count, facet.count.max));
  const pool = sampleDistinct(facet.items, facet.items.length, rng);
  const families = new Set<string>();
  const items: FacetItem[] = [];
  for (const item of pool) {
    if (items.length === clamped) break;
    if (item.family !== undefined) {
      if (families.has(item.family)) continue;
      families.add(item.family);
    }
    items.push(item);
  }
  return { facet, items };
}
