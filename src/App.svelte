<script lang="ts">
  import FacetCard, { type FacetState } from './components/FacetCard.svelte';
  import ResultBanner from './components/ResultBanner.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import { facets } from './lib/facets/registry';
  import type { Facet, FacetRoll } from './lib/facets/types';
  import { rollFacet } from './lib/roll';
  import { composeSentence } from './lib/sentence';
  import { steamTags } from './lib/steam-tags';

  let states = $state<Record<string, FacetState>>(
    Object.fromEntries(
      facets.map((f) => [f.id, { enabled: f.enabledByDefault, count: f.count.default, rolled: [] }]),
    ),
  );

  const activeRolls = $derived<FacetRoll[]>(
    facets
      .filter((f) => states[f.id].enabled && states[f.id].rolled.length > 0)
      .map((f) => ({ facet: f, items: states[f.id].rolled })),
  );
  const sentence = $derived(composeSentence(activeRolls));

  function roll(facet: Facet) {
    states[facet.id].rolled = rollFacet(facet, states[facet.id].count).items;
  }

  function rollAll() {
    for (const f of facets) if (states[f.id].enabled) roll(f);
  }

  const scrapedOn = steamTags.scrapedAt.slice(0, 10);
  const scrapedOnLabel = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(steamTags.scrapedAt),
  );
</script>

<main>
  <header>
    <div>
      <h1>Game Roller</h1>
      <p class="subtitle">Roll a genre, a master plot and any extra details — get a game idea.</p>
    </div>
    <ThemeToggle />
  </header>

  <ResultBanner {sentence} onRollAll={rollAll} />

  <section class="cards" aria-labelledby="details-heading">
    <h2 id="details-heading" class="visually-hidden">Details to roll</h2>
    {#each facets as facet (facet.id)}
      <FacetCard {facet} bind:state={states[facet.id]} onRoll={() => roll(facet)} />
    {/each}
  </section>

  <footer>
    Genre, theme, viewpoint and player tags from
    <a href="https://steamdb.info/tags/" rel="noopener">SteamDB</a>, scraped
    <time datetime={scrapedOn}>{scrapedOnLabel}</time>. Master plots
    after Christopher Booker, <cite>The Seven Basic Plots</cite>, and Ronald B. Tobias,
    <cite>20 Master Plots</cite>.
  </footer>
</main>

<style>
  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
  }

  header h1 {
    margin: 0 0 0.25rem;
    font-size: 2rem;
  }

  .subtitle {
    margin: 0;
    color: var(--muted);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
    gap: 1rem;
  }

  footer {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.5;
  }
</style>
