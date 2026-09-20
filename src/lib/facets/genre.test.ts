import { describe, expect, test } from 'bun:test';
import { genreFacet } from './genre';

describe('genreFacet', () => {
  const byLabel = Object.fromEntries(genreFacet.items.map((item) => [item.label, item]));

  test('includes core genres with readable phrases', () => {
    expect(byLabel['RPG']?.phrase).toBe('role-playing');
    expect(byLabel['Action']?.phrase).toBe('action');
  });

  test('excludes Indie and software genres', () => {
    for (const label of ['Indie', 'Utilities', 'Education', 'Software']) {
      expect(byLabel[label]).toBeUndefined();
    }
  });

  test('every item has a phrase', () => {
    for (const item of genreFacet.items) expect(item.phrase.length).toBeGreaterThan(0);
  });

  test('every item has a description', () => {
    for (const item of genreFacet.items) expect(item.description, item.label).toBeString();
  });
});
