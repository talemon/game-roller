import type { FacetRoll } from './facets/types';

const VOWEL_START = /^[aeiou]/i;

export function indefiniteArticle(word: string): 'a' | 'an' {
  return VOWEL_START.test(word) ? 'an' : 'a';
}

/**
 * Composes `A <prefix…> game about <about…>, <trailing…>` from rolls in registry order.
 * Returns `''` when no roll contributes a phrase.
 */
export function composeSentence(rolls: readonly FacetRoll[]): string {
  const prefixes: string[] = [];
  const abouts: string[] = [];
  let trailing = '';

  for (const roll of rolls) {
    const phrases = roll.items.map((item) => item.phrase);
    if (phrases.length === 0) continue;
    switch (roll.facet.slot) {
      case 'prefix':
        prefixes.push(...phrases);
        break;
      case 'about':
        abouts.push(...phrases);
        break;
      case 'trailing':
        if (!roll.facet.renderTrailing) {
          throw new Error(`facet "${roll.facet.id}" has slot "trailing" but no renderTrailing`);
        }
        trailing += ', ' + roll.facet.renderTrailing(phrases);
        break;
    }
  }

  if (prefixes.length === 0 && abouts.length === 0 && trailing === '') return '';

  const head = prefixes.length > 0 ? `${prefixes.join(' ')} game` : 'game';
  const article = VOWEL_START.test(head) ? 'An' : 'A';
  const about = abouts.length > 0 ? ` about ${abouts.join(' and ')}` : '';
  return `${article} ${head}${about}${trailing}`;
}
