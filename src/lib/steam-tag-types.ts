export interface SteamTag {
  id: number;
  name: string;
  emoji: string;
  count: number;
  categories: string[];
}

export interface SteamTagData {
  source: 'https://steamdb.info/tags/';
  scrapedAt: string;
  categories: string[];
  tags: SteamTag[];
}
