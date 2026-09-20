export interface SteamTag {
  id: number;
  name: string;
  emoji: string;
  /** Every SteamDB category the tag appears in, including ones no facet rolls from. */
  categories: string[];
}

export interface SteamTagData {
  source: 'https://steamdb.info/tags/';
  scrapedAt: string;
  /** Category names as they appear on the page, in page order. */
  categories: string[];
  /** Categories whose tags were dropped from `tags` because no facet rolls from them. */
  omittedCategories: string[];
  tags: SteamTag[];
}
