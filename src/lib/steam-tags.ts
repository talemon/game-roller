import data from '../data/steam-tags.json';
import type { Facet, FacetSlot } from './facets/types';
import { tagPhrase } from './phrase';
import type { SteamTag, SteamTagData } from './steam-tag-types';

export const steamTags: SteamTagData = data as SteamTagData;

/** A phrase ending in "game" already says what the sentence's head noun would say. */
const HEAD_NOUN = /game$/i;

/**
 * Tags belonging to any of the given SteamDB categories, deduped and sorted by name.
 * Throws on an unknown category so a renamed category surfaces at module load.
 */
export function tagsInCategories(categories: readonly string[]): SteamTag[] {
  for (const category of categories) {
    if (!steamTags.categories.includes(category)) {
      throw new Error(`unknown SteamDB category: ${category}`);
    }
  }
  return steamTags.tags
    .filter((tag) => tag.categories.some((c) => categories.includes(c)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export interface TagFacetOptions {
  id: string;
  label: string;
  hint: string;
  slot: FacetSlot;
  categories: string[];
  /** Tag names to drop. */
  exclude?: string[];
  /** Drop any tag that also belongs to one of these categories. */
  excludeCategories?: string[];
  /** Tag name → sentence phrase; anything absent goes through `tagPhrase`'s default rule. */
  phrases?: Record<string, string>;
  /** Tag name → one-line blurb shown under the chip. */
  descriptions?: Record<string, string>;
  /**
   * Tag name → family. Tags in one family are near-synonyms and never share a roll;
   * a name absent here is its own family of one.
   */
  families?: Record<string, string>;
  count: Facet['count'];
  enabledByDefault: boolean;
  hue: number;
  renderTrailing?: Facet['renderTrailing'];
}

/** Builds a `Facet` whose items are SteamDB tags. */
export function tagFacet(opts: TagFacetOptions): Facet {
  const exclude = opts.exclude ?? [];
  const excludeCategories = opts.excludeCategories ?? [];
  const phrases = opts.phrases ?? {};
  const families = opts.families ?? {};
  const descriptions = opts.descriptions ?? {};
  const items = tagsInCategories(opts.categories)
    .filter(
      (tag) =>
        !exclude.includes(tag.name) && !tag.categories.some((c) => excludeCategories.includes(c)),
    )
    .map((tag) => {
      const phrase = tagPhrase(tag.name, phrases);
      // "party game", "wargame": the phrase already carries the sentence's head noun, so it
      // supplies it — and two of them in one roll would print "board game party game".
      const suppressesHead = HEAD_NOUN.test(phrase);
      return {
        id: `tag:${tag.id}`,
        label: tag.name,
        phrase,
        emoji: tag.emoji,
        description: descriptions[tag.name],
        family: suppressesHead ? 'head-noun' : families[tag.name],
        suppressesHead: suppressesHead || undefined,
      };
    });
  return {
    id: opts.id,
    label: opts.label,
    hint: opts.hint,
    slot: opts.slot,
    items,
    count: opts.count,
    enabledByDefault: opts.enabledByDefault,
    hue: opts.hue,
    renderTrailing: opts.renderTrailing,
  };
}
