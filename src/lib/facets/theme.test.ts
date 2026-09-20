import { describe, expect, test } from 'bun:test';
import { themeFacet } from './theme';

describe('themeFacet', () => {
  test('every item has a description', () => {
    for (const item of themeFacet.items) expect(item.description, item.label).toBeString();
  });
});
