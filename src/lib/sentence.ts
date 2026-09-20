import type { FacetItem, FacetRoll } from './facets/types';

const VOWEL_START = /^[aeiou]/i;

export function indefiniteArticle(word: string): 'a' | 'an' {
  return VOWEL_START.test(word) ? 'an' : 'a';
}

/**
 * Composes `A <prefix…> game about <about…>, <trailing…>` from rolls in registry order.
 * Returns `''` when no roll contributes a phrase.
 * A prefix phrase that already ends in "game" supplies the head noun itself.
 */
export function composeSentence(rolls: readonly FacetRoll[]): string {
  const prefixItems: FacetItem[] = [];
  const abouts: string[] = [];
  let trailing = '';

  for (const roll of rolls) {
    if (roll.items.length === 0) continue;
    switch (roll.facet.slot) {
      case 'prefix':
        prefixItems.push(...roll.items);
        break;
      case 'about':
        abouts.push(...roll.items.map((item) => item.phrase));
        break;
      case 'trailing':
        if (!roll.facet.renderTrailing) {
          throw new Error(`facet "${roll.facet.id}" has slot "trailing" but no renderTrailing`);
        }
        trailing += ', ' + roll.facet.renderTrailing(roll.items.map((item) => item.phrase));
        break;
    }
  }

  if (prefixItems.length === 0 && abouts.length === 0 && trailing === '') return '';

  // A phrase that already ends in "game" becomes the head noun, and sorts last to stay next
  // to where "game" would have been: "A tactical party game", not "A party game tactical".
  const carriesHead = prefixItems.some((item) => item.suppressesHead);
  const ordered = [
    ...prefixItems.filter((item) => !item.suppressesHead),
    ...prefixItems.filter((item) => item.suppressesHead),
  ].map((item) => item.phrase);

  const head = ordered.length === 0 ? 'game' : carriesHead ? ordered.join(' ') : `${ordered.join(' ')} game`;
  const article = VOWEL_START.test(head) ? 'An' : 'A';
  const about = abouts.length > 0 ? ` about ${abouts.join(' and ')}` : '';
  return `${article} ${head}${about}${trailing}`;
}
