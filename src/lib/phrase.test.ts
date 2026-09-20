import { describe, expect, test } from 'bun:test';
import { tagPhrase } from './phrase';

describe('tagPhrase', () => {
  test('lowercases ordinary capitalised words', () => {
    expect(tagPhrase('Turn-Based Strategy', {})).toBe('turn-based strategy');
  });

  test('override wins', () => {
    expect(tagPhrase('RPG', { RPG: 'role-playing' })).toBe('role-playing');
  });

  test('leaves acronyms and digit-led words alone', () => {
    expect(tagPhrase('4X', {})).toBe('4X');
    expect(tagPhrase('RPG', {})).toBe('RPG');
    expect(tagPhrase('eSports', {})).toBe('eSports');
  });

  test("does not touch apostrophe-led words (why Shoot 'Em Up is overridden)", () => {
    expect(tagPhrase("Shoot 'Em Up", {})).toBe("shoot 'Em up");
  });
});
