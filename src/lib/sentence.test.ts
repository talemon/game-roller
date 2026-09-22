import { describe, expect, test } from 'bun:test';
import type { Facet, FacetItem, FacetRoll, FacetSlot } from './facets/types';
import { composeSentence, composeSentenceParts, indefiniteArticle } from './sentence';

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

describe('composeSentenceParts', () => {
  const hued = (id: string, slot: FacetSlot, hue: number, renderTrailing?: Facet['renderTrailing']) => ({
    ...facet(id, slot, renderTrailing),
    hue,
  });
  const g = hued('genre', 'prefix', 255);
  const p = hued('plot', 'about', 45);
  const t = hued('theme', 'trailing', 330, (phrases) => `with a ${phrases.join(' and ')} theme`);

  test('the joined parts are exactly the sentence', () => {
    const rolls = [roll(g, ['puzzle']), roll(p, ['discovery']), roll(t, ['cyberpunk'])];
    expect(
      composeSentenceParts(rolls)
        .map((part) => part.text)
        .join(''),
    ).toBe(composeSentence(rolls));
  });

  test('only rolled text carries its facet hue', () => {
    const parts = composeSentenceParts([roll(g, ['puzzle']), roll(p, ['discovery'])]);
    expect(parts.filter((part) => part.hue !== undefined)).toEqual([
      { text: 'puzzle', facetId: 'genre', hue: 255 },
      { text: 'discovery', facetId: 'plot', hue: 45 },
    ]);
    expect(parts.filter((part) => part.hue === undefined).map((part) => part.text)).toEqual([
      'A ',
      ' game about ',
    ]);
  });

  test('a trailing clause tints its phrases, not the wrapper the facet wrote', () => {
    expect(composeSentenceParts([roll(g, ['puzzle']), roll(t, ['cyberpunk', 'noir'])])).toEqual([
      { text: 'A ' },
      { text: 'puzzle', facetId: 'genre', hue: 255 },
      { text: ' game, with a ' },
      { text: 'cyberpunk', facetId: 'theme', hue: 330 },
      { text: ' and ' },
      { text: 'noir', facetId: 'theme', hue: 330 },
      { text: ' theme' },
    ]);
  });

  test('nothing rolled → no parts', () => {
    expect(composeSentenceParts([roll(g, [])])).toEqual([]);
  });
});

describe('indefiniteArticle', () => {
  test('vowel vs consonant', () => {
    expect(indefiniteArticle('atmospheric')).toBe('an');
    expect(indefiniteArticle('cyberpunk')).toBe('a');
  });

  test('an initialism follows its first letter\'s name, not its spelling', () => {
    expect(indefiniteArticle('MMORPG')).toBe('an');
    expect(indefiniteArticle('FMV')).toBe('an');
    expect(indefiniteArticle('LGBTQ+')).toBe('an');
    expect(indefiniteArticle('VR')).toBe('a');
    expect(indefiniteArticle('PvP')).toBe('a');
  });

  test('an initialism said as a word is read as one', () => {
    expect(indefiniteArticle('MOBA')).toBe('a');
  });
});
