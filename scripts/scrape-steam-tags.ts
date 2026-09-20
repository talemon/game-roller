import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { load } from 'cheerio';
import type { SteamTag, SteamTagData } from '../src/lib/steam-tag-types';

export type ParsedSteamTags = Omit<SteamTagData, 'scrapedAt' | 'source'>;

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
        const count = parseInt($(label).find('.label-count').text().replace(/\D/g, ''), 10);

        if (Number.isNaN(id) || name === '') {
          console.error(`malformed tag label in "${category}": ${$.html(label).trim()}`);
          process.exit(1);
        }

        const existing = tags.get(id);
        if (existing) {
          if (!existing.categories.includes(category)) existing.categories.push(category);
        } else {
          tags.set(id, { id, name, emoji, count, categories: [category] });
        }
      });
  });

  return {
    categories,
    tags: [...tags.values()].sort((a, b) => a.id - b.id),
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

  const data: SteamTagData = {
    source: 'https://steamdb.info/tags/',
    scrapedAt: new Date().toISOString(),
    ...parsed,
  };
  writeFileSync(outputPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`wrote ${outputPath}: ${data.tags.length} tags, ${data.categories.length} categories`);
}
