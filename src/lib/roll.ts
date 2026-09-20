import type { Facet, FacetRoll } from './facets/types';

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

export function rollFacet(facet: Facet, count: number, rng?: () => number): FacetRoll {
  const clamped = Math.max(facet.count.min, Math.min(count, facet.count.max));
  return { facet, items: sampleDistinct(facet.items, clamped, rng) };
}
