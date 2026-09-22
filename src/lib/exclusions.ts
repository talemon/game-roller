import type { Facet, FacetItem } from './facets/types';

export const EXCLUSIONS_STORAGE_KEY = 'game-roller:excluded';

/** Facet id → ids of the items the user has left out of that facet's rolls. */
export type Exclusions = Record<string, ReadonlySet<string>>;

const NONE: ReadonlySet<string> = new Set();

/**
 * Stored as `{ facetId: [itemId, …] }`. Anything else — old shape, hand-edited, truncated —
 * reads as nothing excluded rather than throwing on startup. Ids that no longer exist (a tag
 * Valve dropped) are kept: they exclude nothing and vanish the next time the facet is saved.
 */
export function parseExclusions(raw: string | null): Exclusions {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
  const out: Exclusions = {};
  for (const [facetId, ids] of Object.entries(parsed)) {
    if (!Array.isArray(ids)) continue;
    const valid = ids.filter((id): id is string => typeof id === 'string');
    if (valid.length > 0) out[facetId] = new Set(valid);
  }
  return out;
}

/** Inverse of `parseExclusions`; `null` when nothing is excluded, so the key can be removed. */
export function serializeExclusions(exclusions: Exclusions): string | null {
  const entries = Object.entries(exclusions).filter(([, ids]) => ids.size > 0);
  if (entries.length === 0) return null;
  return JSON.stringify(Object.fromEntries(entries.map(([facetId, ids]) => [facetId, [...ids]])));
}

/** The items a facet can roll. Returns `facet.items` itself when nothing is excluded. */
export function eligibleItems(
  facet: Facet,
  excluded: ReadonlySet<string> = NONE,
): readonly FacetItem[] {
  if (excluded.size === 0) return facet.items;
  return facet.items.filter((item) => !excluded.has(item.id));
}
