import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { load } from 'cheerio';
import { ROLLED_CATEGORIES } from '../src/lib/facets/categories';
import type { SteamTag, SteamTagData } from '../src/lib/steam-tag-types';

export type ParsedSteamTags = { categories: string[]; tags: SteamTag[] };
export type PrunedSteamTags = Omit<SteamTagData, 'scrapedAt' | 'source'>;

export function parseSteamTags(html: string): ParsedSteamTags {
  const $ = load(html);
  const categories: string[] = [];
  const tags = new Map<number, SteamTag>();

  $('.taglist-wrap').each((_, wrap) => {
    const h2 = $(wrap).find('h2').first();
    h2.children('svg').remove();
    const category = h2.text().trim();
    categories.push(category);

    $(wrap)
      .find('.label')
      .each((_, label) => {
        const a = $(label).find('a[href*="/tag/"]').first();
        const idMatch = /\/tag\/(\d+)\//.exec(a.attr('href') ?? '');
        const id = idMatch ? Number(idMatch[1]) : Number.NaN;
        const emoji = a.find('span[aria-hidden]').text().trim();
        a.find('span[aria-hidden]').remove();
        const name = a.text().trim();

        if (Number.isNaN(id) || name === '') {
          console.error(`malformed tag label in "${category}": ${$.html(label).trim()}`);
          process.exit(1);
        }

        const existing = tags.get(id);
        if (existing) {
          if (!existing.categories.includes(category)) existing.categories.push(category);
        } else {
          tags.set(id, { id, name, emoji, categories: [category] });
        }
      });
  });

  return {
    categories,
    tags: [...tags.values()].sort((a, b) => a.id - b.id),
  };
}

/**
 * Keeps only tags that land in a category some facet rolls from: the rest can never be
 * shown, so they have no business in the bundle. Each kept tag's own `categories` stays
 * complete, because facet `excludeCategories` rules read categories nobody rolls from.
 */
export function pruneToRolled({ categories, tags }: ParsedSteamTags): PrunedSteamTags {
  const rolled = new Set(ROLLED_CATEGORIES);
  const kept = tags.filter((tag) => tag.categories.some((c) => rolled.has(c)));
  const keptCategories = new Set(kept.flatMap((tag) => tag.categories));
  return {
    categories,
    omittedCategories: categories.filter((c) => !keptCategories.has(c)),
    tags: kept,
  };
}

if (import.meta.main) {
  const [inputPath = '.cache/steamdb-tags.html', outputPath = 'src/data/steam-tags.json'] =
    process.argv.slice(2);

  if (!existsSync(inputPath)) {
    console.error(`input not found: ${inputPath}; run \`bun run tags:fetch\` first`);
    process.exit(1);
  }

  const parsed = parseSteamTags(readFileSync(inputPath, 'utf8'));
  if (parsed.tags.length < 300 || parsed.categories.length < 20) {
    console.error(
      `page structure changed: parsed ${parsed.tags.length} tags / ${parsed.categories.length} categories`,
    );
    process.exit(1);
  }

  const pruned = pruneToRolled(parsed);
  const data: SteamTagData = {
    source: 'https://steamdb.info/tags/',
    scrapedAt: new Date().toISOString(),
    ...pruned,
  };
  writeFileSync(outputPath, JSON.stringify(data) + '\n');
  console.log(
    `wrote ${outputPath}: ${data.tags.length} rollable tags of ${parsed.tags.length}, ` +
      `${data.categories.length} categories (${data.omittedCategories.length} omitted)`,
  );
}
