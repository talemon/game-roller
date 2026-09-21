import type { TagGroup } from '../data/tag-groups';

export interface TaggedTag {
  id: number;
  name: string;
  /** Which facet rolls this tag; assigned by this project, not by Valve. */
  group: TagGroup;
}

export interface SteamTagData {
  source: 'https://api.steampowered.com/IStoreService/GetTagList/v1/?language=english';
  /** Valve's `version_hash` for the tag list the snapshot was built from. */
  versionHash: string;
  fetchedAt: string;
  /** Only tags classified in `tag-groups.ts`; everything Valve serves beyond them is dropped. */
  tags: TaggedTag[];
}
