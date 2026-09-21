import { describe, expect, test } from 'bun:test';
import type { Facet, FacetItem, FacetRoll, FacetSlot } from './facets/types';
import { composeSentence, indefiniteArticle } from './sentence';

function facet(id: string, slot: FacetSlot, renderTrailing?: Facet['renderTrailing']): Facet {
  return {
    id,
    label: id,
    hint: '',
    slot,
    items: [],
    count: { min: 1, max: 1, default: 1 },
    enabledByDefault: true,
    hue: 0,
    icon: 'gamepad',
    renderTrailing,
  };
}

function roll(f: Facet, phrases: string[]): FacetRoll {
  const items: FacetItem[] = phrases.map((phrase) => ({ id: phrase, label: phrase, phrase }));
  return { facet: f, items };
}

/** A prefix item whose phrase already ends in "game", e.g. the Party Game tag. */
function headRoll(f: Facet, phrases: string[], head: string): FacetRoll {
  return {
    facet: f,
    items: [
      ...phrases.map((phrase) => ({ id: phrase, label: phrase, phrase })),
      { id: head, label: head, phrase: head, suppressesHead: true },
    ],
  };
}

const genre = facet('genre', 'prefix');
const plot = facet('plot', 'about');
const theme = facet('theme', 'trailing', (p) => `with a ${p.join(' and ')} theme`);

describe('composeSentence', () => {
  test('prefix genres + about plot', () => {
    expect(composeSentence([roll(genre, ['role-playing', 'action']), roll(plot, ['discovery'])])).toBe(
      'A role-playing action game about discovery',
    );
  });

  test('uses "An" before a vowel-initial prefix', () => {
    expect(composeSentence([roll(genre, ['action']), roll(plot, ['revenge'])])).toStartWith(
      'An action game',
    );
  });

  test('about only', () => {
    expect(composeSentence([roll(plot, ['rebirth'])])).toBe('A game about rebirth');
  });

  test('appends trailing clause', () => {
    expect(composeSentence([roll(genre, ['puzzle']), roll(theme, ['cyberpunk'])])).toEndWith(
      ', with a cyberpunk theme',
    );
  });

  test('joins multiple about phrases with "and"', () => {
    expect(composeSentence([roll(plot, ['love', 'sacrifice'])])).toBe(
      'A game about love and sacrifice',
    );
  });

  test('empty rolls → empty string', () => {
    expect(composeSentence([])).toBe('');
    expect(composeSentence([roll(genre, [])])).toBe('');
  });

  test('a prefix that already ends in "game" supplies the head noun', () => {
    expect(composeSentence([headRoll(genre, [], 'party game'), roll(plot, ['comedy'])])).toBe(
      'A party game about comedy',
    );
  });

  test('the head-supplying phrase sorts last, whatever the draw order', () => {
    expect(composeSentence([headRoll(genre, ['tactical'], 'wargame')])).toBe('A tactical wargame');
  });
});

describe('indefiniteArticle', () => {
  test('vowel vs consonant', () => {
    expect(indefiniteArticle('atmospheric')).toBe('an');
    expect(indefiniteArticle('cyberpunk')).toBe('a');
  });
});
