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
 * Draws `count` items, at most one per family — "role-playing action role-playing" is a
 * distinct draw but says one thing twice. An item can belong to several families at once
 * ("Action RPG" is both an RPG and an action game), and any one of them being spoken for
 * already is enough to pass it over. Comes up short only when the pool runs out of items
 * whose families are all unused.
 */
export function rollFacet(facet: Facet, count: number, rng?: () => number): FacetRoll {
  const clamped = Math.max(facet.count.min, Math.min(count, facet.count.max));
  const pool = sampleDistinct(facet.items, facet.items.length, rng);
  const spoken = new Set<string>();
  const items: FacetItem[] = [];
  for (const item of pool) {
    if (items.length === clamped) break;
    const families = item.families ?? [];
    if (families.some((family) => spoken.has(family))) continue;
    for (const family of families) spoken.add(family);
    items.push(item);
  }
  return { facet, items };
}
