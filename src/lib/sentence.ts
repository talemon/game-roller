import type { Facet, FacetItem, FacetRoll } from './facets/types';

const VOWEL_START = /^[aeiou]/i;

export function indefiniteArticle(word: string): 'a' | 'an' {
  return VOWEL_START.test(word) ? 'an' : 'a';
}

/**
 * One run of the sentence. `hue` is set only on text a facet actually rolled, so the
 * reading can be tinted to trace each word back to the compartment that produced it;
 * connective text ("A", "game", "about", "and", "with a … theme") carries none.
 */
export interface SentencePart {
  text: string;
  /** The facet that rolled this text, absent on connective text. */
  facetId?: string;
  /** That facet's OKLCH hue angle. */
  hue?: number;
}

/**
 * Composes `A <prefix…> game about <about…>, <trailing…>` from rolls in registry order.
 * Returns `''` when no roll contributes a phrase.
 * A prefix phrase that already ends in "game" supplies the head noun itself.
 */
export function composeSentence(rolls: readonly FacetRoll[]): string {
  return composeSentenceParts(rolls)
    .map((part) => part.text)
    .join('');
}

/** The same sentence, split into facet-attributed and connective runs. */
export function composeSentenceParts(rolls: readonly FacetRoll[]): SentencePart[] {
  const prefixItems: { item: FacetItem; facet: Facet }[] = [];
  const abouts: { phrase: string; facet: Facet }[] = [];
  const trailings: { clause: string; phrases: string[]; facet: Facet }[] = [];

  for (const roll of rolls) {
    if (roll.items.length === 0) continue;
    switch (roll.facet.slot) {
      case 'prefix':
        prefixItems.push(...roll.items.map((item) => ({ item, facet: roll.facet })));
        break;
      case 'about':
        abouts.push(...roll.items.map((item) => ({ phrase: item.phrase, facet: roll.facet })));
        break;
      case 'trailing': {
        if (!roll.facet.renderTrailing) {
          throw new Error(`facet "${roll.facet.id}" has slot "trailing" but no renderTrailing`);
        }
        const phrases = roll.items.map((item) => item.phrase);
        trailings.push({ clause: roll.facet.renderTrailing(phrases), phrases, facet: roll.facet });
        break;
      }
    }
  }

  if (prefixItems.length === 0 && abouts.length === 0 && trailings.length === 0) return [];

  // A phrase that already ends in "game" becomes the head noun, and sorts last to stay next
  // to where "game" would have been: "A tactical party game", not "A party game tactical".
  const carriesHead = prefixItems.some((entry) => entry.item.suppressesHead);
  const ordered = [
    ...prefixItems.filter((entry) => !entry.item.suppressesHead),
    ...prefixItems.filter((entry) => entry.item.suppressesHead),
  ];

  const head = ordered.length === 0 ? 'game' : ordered[0].item.phrase;
  const parts: SentencePart[] = [];
  const plain = (text: string) => {
    const last = parts[parts.length - 1];
    if (last && last.hue === undefined) last.text += text;
    else parts.push({ text });
  };
  const tinted = (text: string, facet: Facet) =>
    parts.push({ text, facetId: facet.id, hue: facet.hue });

  plain(`${VOWEL_START.test(head) ? 'An' : 'A'} `);

  ordered.forEach((entry, index) => {
    if (index > 0) plain(' ');
    tinted(entry.item.phrase, entry.facet);
  });
  if (ordered.length === 0) plain('game');
  else if (!carriesHead) plain(' game');

  abouts.forEach((entry, index) => {
    plain(index === 0 ? ' about ' : ' and ');
    tinted(entry.phrase, entry.facet);
  });

  for (const { clause, phrases, facet } of trailings) {
    plain(', ');
    // The facet renders its own clause, so locate its phrases inside it: only the rolled
    // words wear the hue, never the connective wrapper the facet wrote around them.
    let cursor = 0;
    for (const phrase of phrases) {
      const at = clause.indexOf(phrase, cursor);
      if (at === -1) continue;
      if (at > cursor) plain(clause.slice(cursor, at));
      tinted(phrase, facet);
      cursor = at + phrase.length;
    }
    if (cursor < clause.length) plain(clause.slice(cursor));
  }

  return parts;
}
