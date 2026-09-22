import type { TagGroup } from '../data/tag-groups';
import data from '../data/steam-tags.json';
import type { Facet, FacetSlot } from './facets/types';
import { tagPhrase } from './phrase';
import type { SteamTagData, TaggedTag } from './steam-tag-types';

export const steamTags: SteamTagData = data as SteamTagData;

/**
 * A phrase ending in one of these already says what the sentence's head noun would say:
 * "a farming sim game" and "a visual novel game" are both the noun twice over.
 */
const HEAD_NOUN = /(?:game|sim|simulator|novel|fiction)$/i;

/** The snapshot's tags for one facet, sorted by name. */
export function tagsInGroup(group: TagGroup): TaggedTag[] {
  const tags = steamTags.tags.filter((tag) => tag.group === group);
  if (tags.length === 0) throw new Error(`no tags in group: ${group}`);
  return tags.sort((a, b) => a.name.localeCompare(b.name));
}

export interface TagFacetOptions {
  id: string;
  label: string;
  hint: string;
  icon: Facet['icon'];
  slot: FacetSlot;
  group: TagGroup;
  /** Tag names to drop. */
  exclude?: string[];
  /** Tag name → sentence phrase; anything absent goes through `tagPhrase`'s default rule. */
  phrases?: Record<string, string>;
  /** Tag name → one-line blurb shown under the chip. */
  descriptions?: Record<string, string>;
  /**
   * Tag name → the families it belongs to. One member of a family per roll; a tag absent
   * here is its own family of one, and a head-noun phrase joins `head-noun` on top.
   */
  families?: Record<string, readonly string[]>;
  count: Facet['count'];
  enabledByDefault: boolean;
  hue: number;
  renderTrailing?: Facet['renderTrailing'];
}

/** Builds a `Facet` whose items are Steam tags from one group. */
export function tagFacet(opts: TagFacetOptions): Facet {
  const exclude = opts.exclude ?? [];
  const phrases = opts.phrases ?? {};
  const families = opts.families ?? {};
  const descriptions = opts.descriptions ?? {};
  const items = tagsInGroup(opts.group)
    .filter((tag) => !exclude.includes(tag.name))
    .map((tag) => {
      const phrase = tagPhrase(tag.name, phrases);
      // "party game", "wargame": the phrase already carries the sentence's head noun, so it
      // supplies it — and two of them in one roll would print "board game party game".
      const suppressesHead = HEAD_NOUN.test(phrase);
      return {
        id: `tag:${tag.id}`,
        label: tag.name,
        phrase,
        description: descriptions[tag.name],
        families: suppressesHead ? [...(families[tag.name] ?? []), 'head-noun'] : families[tag.name],
        suppressesHead: suppressesHead || undefined,
      };
    });
  return {
    id: opts.id,
    label: opts.label,
    hint: opts.hint,
    slot: opts.slot,
    icon: opts.icon,
    items,
    count: opts.count,
    enabledByDefault: opts.enabledByDefault,
    hue: opts.hue,
    renderTrailing: opts.renderTrailing,
  };
}
