import { writeFileSync } from 'node:fs';
import { GROUPED_TAG_NAMES, TAG_GROUPS, type TagGroup } from '../src/data/tag-groups';
import type { SteamTagData, TaggedTag } from '../src/lib/steam-tag-types';

export const TAG_LIST_URL =
  'https://api.steampowered.com/IStoreService/GetTagList/v1/?language=english';

export interface ValveTag {
  tagid: number;
  name: string;
}

export interface ValveTagList {
  response: { version_hash: string; tags: ValveTag[] };
}

export interface Snapshot {
  data: Omit<SteamTagData, 'fetchedAt'>;
  /** Valve tags this project classifies for no facet — informational, not an error. */
  unclassified: string[];
}

const GROUP_OF: Record<string, TagGroup | undefined> = Object.fromEntries(
  Object.entries(TAG_GROUPS).flatMap(([group, names]) =>
    names.map((name) => [name, group as TagGroup] as const),
  ),
);

/**
 * Joins Valve's tag list to this project's classification. Valve serves `{tagid, name}` and
 * nothing else, so a tag renamed upstream would silently stop rolling; the missing-name check
 * turns that into a failed refresh instead of a facet quietly losing an item.
 */
export function buildSnapshot({ response }: ValveTagList): Snapshot {
  const idByName: Record<string, number | undefined> = {};
  for (const tag of response.tags) idByName[tag.name.trim()] = tag.tagid;

  const missing = GROUPED_TAG_NAMES.filter((name) => idByName[name] === undefined);
  if (missing.length > 0) {
    throw new Error(
      `tag names in src/data/tag-groups.ts are not in Valve's list (renamed or removed): ${missing.join(', ')}`,
    );
  }

  const tags: TaggedTag[] = GROUPED_TAG_NAMES.map((name) => ({
    id: idByName[name] as number,
    name,
    group: GROUP_OF[name] as TagGroup,
  })).sort((a, b) => a.id - b.id);

  return {
    data: { source: TAG_LIST_URL, versionHash: response.version_hash, tags },
    unclassified: Object.keys(idByName)
      .filter((name) => GROUP_OF[name] === undefined)
      .sort(),
  };
}

if (import.meta.main) {
  const [outputPath = 'src/data/steam-tags.json'] = process.argv.slice(2);

  const res = await fetch(TAG_LIST_URL);
  if (!res.ok) {
    console.error(`${TAG_LIST_URL} responded ${res.status}`);
    process.exit(1);
  }

  const { data, unclassified } = buildSnapshot((await res.json()) as ValveTagList);
  const snapshot: SteamTagData = { ...data, fetchedAt: new Date().toISOString() };
  writeFileSync(outputPath, JSON.stringify(snapshot) + '\n');

  console.log(
    `wrote ${outputPath}: ${snapshot.tags.length} rollable tags, version ${snapshot.versionHash}`,
  );
  console.log(
    `${unclassified.length} Valve tags roll for nothing; new ones to consider for ` +
      `src/data/tag-groups.ts: ${unclassified.slice(0, 8).join(', ')}…`,
  );
}
