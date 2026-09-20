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
    renderTrailing,
  };
}

function roll(f: Facet, phrases: string[]): FacetRoll {
  const items: FacetItem[] = phrases.map((phrase) => ({ id: phrase, label: phrase, phrase }));
  return { facet: f, items };
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
});

describe('indefiniteArticle', () => {
  test('vowel vs consonant', () => {
    expect(indefiniteArticle('atmospheric')).toBe('an');
    expect(indefiniteArticle('cyberpunk')).toBe('a');
  });
});
