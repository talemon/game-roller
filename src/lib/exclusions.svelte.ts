import {
  EXCLUSIONS_STORAGE_KEY,
  eligibleItems,
  parseExclusions,
  serializeExclusions,
  type Exclusions,
} from './exclusions';
import type { Facet, FacetItem } from './facets/types';

const NONE: ReadonlySet<string> = new Set();

function readStored(): Exclusions {
  try {
    return parseExclusions(localStorage.getItem(EXCLUSIONS_STORAGE_KEY));
  } catch {
    return {};
  }
}

/**
 * Which items the user has left out of each facet's rolls, with persistence. Sets are
 * replaced rather than mutated so the record's reactivity sees every change.
 */
class ExclusionStore {
  #byFacet = $state<Exclusions>(readStored());

  of(facetId: string): ReadonlySet<string> {
    return this.#byFacet[facetId] ?? NONE;
  }

  eligible(facet: Facet): readonly FacetItem[] {
    return eligibleItems(facet, this.of(facet.id));
  }

  toggle(facetId: string, itemId: string) {
    const next = new Set(this.of(facetId));
    if (!next.delete(itemId)) next.add(itemId);
    this.#set(facetId, next);
  }

  clear(facetId: string) {
    this.#set(facetId, NONE);
  }

  #set(facetId: string, ids: ReadonlySet<string>) {
    if (ids.size === 0) delete this.#byFacet[facetId];
    else this.#byFacet[facetId] = ids;
    try {
      const raw = serializeExclusions(this.#byFacet);
      if (raw === null) localStorage.removeItem(EXCLUSIONS_STORAGE_KEY);
      else localStorage.setItem(EXCLUSIONS_STORAGE_KEY, raw);
    } catch {
      // Storage unavailable (private mode, blocked): the choice still applies for this session.
    }
  }
}

export const exclusions = new ExclusionStore();
