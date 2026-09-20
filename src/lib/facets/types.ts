export interface FacetItem {
  /** Stable identifier, e.g. `tag:122` or `plot:discovery`. */
  id: string;
  /** Display label, e.g. `RPG`. */
  label: string;
  /** Sentence fragment, e.g. `role-playing`. */
  phrase: string;
  /**
   * Items sharing a family are near-synonyms (RPG and Action RPG, Roguelike and Roguelite):
   * a single roll draws at most one of them, so the sentence never says the same thing twice.
   */
  family?: string;
  /**
   * This phrase already ends in "game" (`party game`, `wargame`), so the sentence drops its
   * own head noun and sorts the phrase last: "A tactical party game", never "party game game".
   */
  suppressesHead?: boolean;
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
  /** OKLCH hue (0–360) that this facet's chips and live edge carry, so results trace back to their card. */
  hue: number;
  /** Required when `slot === 'trailing'`. */
  renderTrailing?: (phrases: string[]) => string;
}

export interface FacetRoll {
  facet: Facet;
  items: FacetItem[];
}
