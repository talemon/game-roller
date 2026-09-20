<script lang="ts">
  import FacetCard, { type FacetState } from './components/FacetCard.svelte';
  import ResultBanner from './components/ResultBanner.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import { facets } from './lib/facets/registry';
  import type { Facet, FacetItem, FacetRoll } from './lib/facets/types';
  import { PENDING_ITEM, playReveal } from './lib/reveal';
  import { rollFacet } from './lib/roll';
  import { composeSentence } from './lib/sentence';
  import { steamTags } from './lib/steam-tags';

  const REVEAL_STORAGE_KEY = 'game-roller:reveal';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let states = $state<Record<string, FacetState>>(
    Object.fromEntries(
      facets.map((f) => [f.id, { enabled: f.enabledByDefault, count: f.count.default, rolled: [] }]),
    ),
  );

  /** Decoy chips per facet while its slot is rattling; absent when the slot is settled. */
  let ghosts = $state<Record<string, FacetItem[]>>({});
  /** The slot currently rattling — its sentence position shows "…". */
  let pendingFacetId = $state<string | null>(null);
  let revealEnabled = $state(readRevealPreference());
  let skipReveal: (() => void) | null = null;
  const revealing = $derived(pendingFacetId !== null);

  const activeRolls = $derived<FacetRoll[]>(
    facets.flatMap((f) => {
      if (!states[f.id].enabled) return [];
      if (f.id === pendingFacetId) return [{ facet: f, items: [PENDING_ITEM] }];
      return states[f.id].rolled.length > 0 ? [{ facet: f, items: states[f.id].rolled }] : [];
    }),
  );
  const sentence = $derived(composeSentence(activeRolls));

  function readRevealPreference() {
    try {
      return localStorage.getItem(REVEAL_STORAGE_KEY) !== 'off';
    } catch {
      return true;
    }
  }

  function setRevealEnabled(enabled: boolean) {
    revealEnabled = enabled;
    if (!enabled) skipReveal?.();
    try {
      localStorage.setItem(REVEAL_STORAGE_KEY, enabled ? 'on' : 'off');
    } catch {
      // Storage unavailable: the choice still applies for this session.
    }
  }

  /** Results are decided up front; the reveal only paces when each one becomes visible. */
  function play(targets: readonly Facet[]) {
    skipReveal?.();
    const rolls = targets.map((f) => rollFacet(f, states[f.id].count));
    if (!revealEnabled) {
      for (const r of rolls) states[r.facet.id].rolled = r.items;
      return;
    }
    skipReveal = playReveal(
      rolls,
      {
        onSpin(facet, decoys) {
          pendingFacetId = facet.id;
          ghosts[facet.id] = decoys;
        },
        onTick(facet, decoys) {
          ghosts[facet.id] = decoys;
        },
        onLock(roll) {
          delete ghosts[roll.facet.id];
          states[roll.facet.id].rolled = roll.items;
          if (pendingFacetId === roll.facet.id) pendingFacetId = null;
        },
        onDone() {
          pendingFacetId = null;
          skipReveal = null;
        },
      },
      { reducedMotion: reducedMotion.matches },
    );
  }

  function roll(facet: Facet) {
    play([facet]);
  }

  function rollAll() {
    skipReveal?.();
    for (const f of facets) states[f.id].rolled = [];
    play(facets.filter((f) => states[f.id].enabled));
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && skipReveal) {
      skipReveal();
      event.preventDefault();
    }
  }

  const scrapedOn = steamTags.scrapedAt.slice(0, 10);
  const scrapedOnLabel = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(steamTags.scrapedAt),
  );
</script>

<svelte:window onkeydown={onKeydown} />

<main>
  <header>
    <div>
      <h1>Game Roller</h1>
      <p class="subtitle">Roll a genre, a master plot and any extra details — get a game idea.</p>
    </div>
    <ThemeToggle />
  </header>

  <ResultBanner
    {sentence}
    {revealing}
    {revealEnabled}
    onRollAll={rollAll}
    onSkip={() => skipReveal?.()}
    onRevealChange={setRevealEnabled}
  />

  <section class="cards" aria-labelledby="details-heading">
    <h2 id="details-heading" class="visually-hidden">Details to roll</h2>
    {#each facets as facet (facet.id)}
      <FacetCard
        {facet}
        bind:state={states[facet.id]}
        ghosts={ghosts[facet.id]}
        onRoll={() => roll(facet)}
      />
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
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  footer {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.5;
  }
</style>
