<script lang="ts">
  import FacetCard, { type FacetState } from './components/FacetCard.svelte';
  import ResultBanner from './components/ResultBanner.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import { facets } from './lib/facets/registry';
  import type { Facet, FacetItem, FacetRoll } from './lib/facets/types';
  import { PENDING_ITEM, playReveal } from './lib/reveal';
  import { rollFacet } from './lib/roll';
  import { composeSentence, composeSentenceParts } from './lib/sentence';
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
  /** Non-null while a reveal sequence is live — including the beats between slots. */
  let skipReveal = $state<(() => void) | null>(null);
  const revealing = $derived(skipReveal !== null);

  const activeRolls = $derived<FacetRoll[]>(
    facets.flatMap((f) => {
      if (!states[f.id].enabled) return [];
      if (f.id === pendingFacetId) return [{ facet: f, items: [PENDING_ITEM] }];
      return states[f.id].rolled.length > 0 ? [{ facet: f, items: states[f.id].rolled }] : [];
    }),
  );
  const sentenceParts = $derived(composeSentenceParts(activeRolls));
  /** The same reading as one string, for copying, announcing and re-keying the settle. */
  const sentence = $derived(sentenceParts.map((part) => part.text).join(''));
  /**
   * The sentence the running reveal will end on. The banner reserves its height from this,
   * so the box grows once — before the rattle — rather than under a cursor aiming at Skip.
   */
  let reserveText = $state('');
  /** Nothing armed means "Roll everything" has nothing to roll; the button says so instead. */
  const armedCount = $derived(facets.filter((f) => states[f.id].enabled).length);
  /** One-off message for something the user did not see happen (a clamped count). */
  let notice = $state('');
  let noticeTimer: ReturnType<typeof setTimeout> | undefined;

  function announce(message: string) {
    clearTimeout(noticeTimer);
    notice = message;
    noticeTimer = setTimeout(() => (notice = ''), 4000);
  }

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
    if (!revealEnabled || rolls.length === 0) {
      for (const r of rolls) states[r.facet.id].rolled = r.items;
      return;
    }
    const rolled = new Map(rolls.map((r) => [r.facet.id, r.items]));
    reserveText = composeSentence(
      facets.flatMap((f) => {
        if (!states[f.id].enabled) return [];
        const items = rolled.get(f.id) ?? states[f.id].rolled;
        return items.length > 0 ? [{ facet: f, items }] : [];
      }),
    );
    // onDone can fire before playReveal returns, so only publish a sequence still running.
    let running = true;
    const skip = playReveal(
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
          reserveText = '';
          running = false;
          if (skipReveal === skip) skipReveal = null;
        },
      },
      { reducedMotion: reducedMotion.matches },
    );
    if (running) skipReveal = skip;
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

  const fetchedOn = steamTags.fetchedAt.slice(0, 10);
  const fetchedOnLabel = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(steamTags.fetchedAt),
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
    parts={sentenceParts}
    {reserveText}
    {revealing}
    {revealEnabled}
    {armedCount}
    {notice}
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
        onNotice={announce}
      />
    {/each}
  </section>

  <footer>
    <span class="credit">Made by <a href="https://cbozkurt.com" target="_blank" rel="noopener">Can Mert Bozkurt</a>.</span>
    <span>
      Genre, theme, viewpoint and player tags are from Steam's
      <a href="https://api.steampowered.com/IStoreService/GetTagList/v1/?language=english" target="_blank" rel="noopener">public tag list</a>,
      fetched <time datetime={fetchedOn}>{fetchedOnLabel}</time>.
    </span>
    <span>Master plots inspired by <cite>20 Master Plots</cite> by Ronald B. Tobias and other sources.</span>
    <span>Icons from <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a>.</span>
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
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.5;
  }

  .credit {
    color: var(--text);
  }
</style>
