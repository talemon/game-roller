import { describe, expect, test } from 'bun:test';
import type { Facet, FacetItem } from './facets/types';
import { rollFacet, sampleDistinct } from './roll';

/** Tiny LCG so draws are reproducible. */
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x1_0000_0000;
  };
}

const ten = Array.from({ length: 10 }, (_, i) => i + 1);

describe('sampleDistinct', () => {
  test('returns k distinct members', () => {
    const out = sampleDistinct(ten, 3, lcg(42));
    expect(out).toHaveLength(3);
    expect(new Set(out).size).toBe(3);
    for (const v of out) expect(ten).toContain(v);
  });

  test('k beyond length returns everything', () => {
    const out = sampleDistinct(ten, 20, lcg(7));
    expect([...out].sort((a, b) => a - b)).toEqual(ten);
  });

  test('k = 0 returns []', () => {
    expect(sampleDistinct(ten, 0, lcg(1))).toEqual([]);
  });

  test('same seed → same draw', () => {
    expect(sampleDistinct(ten, 5, lcg(99))).toEqual(sampleDistinct(ten, 5, lcg(99)));
  });
});

describe('rollFacet', () => {
  const item = (id: string, ...families: string[]): FacetItem => ({
    id,
    label: id,
    phrase: id,
    families: families.length === 0 ? undefined : families,
  });
  const facet = (items: FacetItem[], max: number): Facet => ({
    id: 'genre',
    label: 'Genre',
    hint: '',
    slot: 'prefix',
    icon: 'gamepad',
    items,
    count: { min: 1, max, default: 1 },
    enabledByDefault: true,
    hue: 0,
  });

  test('never draws two members of one family', () => {
    const f = facet(
      [item('rpg', 'rpg'), item('action rpg', 'rpg'), item('tactical rpg', 'rpg'), item('puzzle')],
      3,
    );
    for (let seed = 0; seed < 200; seed++) {
      const drawn = rollFacet(f, 3, lcg(seed)).items;
      const families = drawn.flatMap((i) => i.families ?? []);
      expect(new Set(families).size).toBe(families.length);
    }
  });

  test('one shared family is enough to pass an item over', () => {
    const f = facet([item('action rpg', 'rpg', 'action'), item('action', 'action')], 2);
    expect(rollFacet(f, 2, lcg(3)).items).toHaveLength(1);
  });

  test('comes up short rather than repeating a family', () => {
    const f = facet([item('rpg', 'rpg'), item('action rpg', 'rpg')], 2);
    expect(rollFacet(f, 2, lcg(3)).items).toHaveLength(1);
  });

  test('family-free items still fill the requested count', () => {
    const f = facet([item('a'), item('b'), item('c')], 3);
    expect(rollFacet(f, 3, lcg(5)).items).toHaveLength(3);
  });

  test('clamps the count to the facet bounds', () => {
    const f = facet([item('a'), item('b'), item('c')], 2);
    expect(rollFacet(f, 99, lcg(5)).items).toHaveLength(2);
  });
});
