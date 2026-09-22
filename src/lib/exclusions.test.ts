import { describe, expect, test } from 'bun:test';
import { eligibleItems, parseExclusions, serializeExclusions } from './exclusions';
import type { Facet } from './facets/types';

describe('parseExclusions', () => {
  test('malformed storage reads as nothing excluded', () => {
    expect(parseExclusions(null)).toEqual({});
    expect(parseExclusions('')).toEqual({});
    expect(parseExclusions('not json')).toEqual({});
    expect(parseExclusions('["tag:1"]')).toEqual({});
    expect(parseExclusions('{"genre":"tag:1"}')).toEqual({});
  });

  test('keeps only string ids and drops empty facets', () => {
    const out = parseExclusions('{"genre":["tag:1",2,null,"tag:3"],"theme":[]}');
    expect(Object.keys(out)).toEqual(['genre']);
    expect([...out.genre]).toEqual(['tag:1', 'tag:3']);
  });

  test('round-trips through serialize', () => {
    const raw = serializeExclusions({ genre: new Set(['tag:1']), plot: new Set() });
    expect(raw).toBe('{"genre":["tag:1"]}');
    expect(parseExclusions(raw)).toEqual({ genre: new Set(['tag:1']) });
    expect(serializeExclusions({ plot: new Set() })).toBeNull();
  });
});

describe('eligibleItems', () => {
  const facet: Facet = {
    id: 'genre',
    label: 'Genre',
    hint: '',
    slot: 'prefix',
    icon: 'gamepad',
    items: [
      { id: 'a', label: 'a', phrase: 'a' },
      { id: 'b', label: 'b', phrase: 'b' },
    ],
    count: { min: 1, max: 1, default: 1 },
    enabledByDefault: true,
    hue: 0,
  };

  test('nothing excluded returns the facet list itself', () => {
    expect(eligibleItems(facet)).toBe(facet.items);
    expect(eligibleItems(facet, new Set())).toBe(facet.items);
  });

  test('excluded ids are left out; unknown ids are harmless', () => {
    expect(eligibleItems(facet, new Set(['b', 'gone'])).map((i) => i.id)).toEqual(['a']);
  });
});
