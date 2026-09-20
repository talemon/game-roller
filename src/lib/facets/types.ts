export interface FacetItem {
  /** Stable identifier, e.g. `tag:122` or `plot:discovery`. */
  id: string;
  /** Display label, e.g. `RPG`. */
  label: string;
  /** Sentence fragment, e.g. `role-playing`. */
  phrase: string;
  emoji?: string;
  /** Shown under the chip (plots). */
  description?: string;
  /** e.g. `Booker & Tobias`. */
  attribution?: string;
}

/**
 * Where a facet's phrases land in the sentence:
 * - `prefix`: adjectives before "game" (`A first-person action game`)
 * - `about`: the subject after "about" (`… about discovery`)
 * - `trailing`: a comma clause rendered by `renderTrailing` (`, with a cyberpunk theme`)
 */
export type FacetSlot = 'prefix' | 'about' | 'trailing';

export interface Facet {
  id: string;
  label: string;
  /** One line under the card title. */
  hint: string;
  slot: FacetSlot;
  items: readonly FacetItem[];
  count: { min: number; max: number; default: number };
  enabledByDefault: boolean;
  /** Required when `slot === 'trailing'`. */
  renderTrailing?: (phrases: string[]) => string;
}

export interface FacetRoll {
  facet: Facet;
  items: FacetItem[];
}
