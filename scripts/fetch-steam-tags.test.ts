import { describe, expect, test } from 'bun:test';
import { GROUPED_TAG_NAMES, TAG_GROUPS } from '../src/data/tag-groups';
import { buildSnapshot, type ValveTagList } from './fetch-steam-tags';

const list = (tags: { tagid: number; name: string }[]): ValveTagList => ({
  response: { version_hash: 'hash', tags },
});

/** Valve's real payload for every name this project classifies, plus one it does not. */
const complete = list([
  ...GROUPED_TAG_NAMES.map((name, i) => ({ tagid: i + 1, name })),
  { tagid: 9000, name: 'Early Access' },
]);

describe('buildSnapshot', () => {
  test('keeps only classified tags and stamps each with its group', () => {
    const { data, unclassified } = buildSnapshot(complete);

    expect(data.tags).toHaveLength(GROUPED_TAG_NAMES.length);
    expect(data.tags.map((t) => t.name)).not.toContain('Early Access');
    expect(unclassified).toEqual(['Early Access']);
    expect(data.versionHash).toBe('hash');
    const byName = Object.fromEntries(data.tags.map((t) => [t.name, t.group]));
    expect(byName['Action']).toBe('genre');
    expect(byName['Cyberpunk']).toBe('theme');
    expect(byName['Isometric']).toBe('viewpoint');
    expect(byName['Singleplayer']).toBe('players');
  });

  test('sorts by tag id so a refresh only diffs real changes', () => {
    const shuffled = list([...complete.response.tags].reverse());
    const ids = buildSnapshot(shuffled).data.tags.map((t) => t.id);

    expect(ids).toEqual([...ids].sort((a, b) => a - b));
  });

  test('tolerates the trailing whitespace Valve serves on some names', () => {
    const padded = list(
      complete.response.tags.map((t) => (t.name === 'Parody' ? { ...t, name: 'Parody ' } : t)),
    );

    expect(buildSnapshot(padded).data.tags.map((t) => t.name)).toContain('Parody');
  });

  test('fails the refresh when a classified tag is gone upstream', () => {
    const withoutAction = list(complete.response.tags.filter((t) => t.name !== 'Action'));

    expect(() => buildSnapshot(withoutAction)).toThrow(/Action/);
  });

  test('every classified name is unique, so no tag rolls for two facets', () => {
    expect(new Set(GROUPED_TAG_NAMES).size).toBe(GROUPED_TAG_NAMES.length);
    expect(GROUPED_TAG_NAMES).toHaveLength(Object.values(TAG_GROUPS).flat().length);
  });
});
