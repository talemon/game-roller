import { describe, expect, test } from 'bun:test';
import { sampleDistinct } from './roll';

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
