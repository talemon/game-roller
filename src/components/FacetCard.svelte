<script lang="ts" module>
  import type { FacetItem } from '../lib/facets/types';

  export interface FacetState {
    enabled: boolean;
    count: number;
    rolled: FacetItem[];
  }
</script>

<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import type { Facet } from '../lib/facets/types';

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  /** Expand/collapse: slide explains where the controls went; reduced motion keeps only the fade. */
  const reveal = (node: Element) =>
    reducedMotion.matches ? fade(node, { duration: 150 }) : slide(node, { duration: 220 });

  let {
    facet,
    state = $bindable(),
    ghosts,
    onRoll,
  }: {
    facet: Facet;
    state: FacetState;
    /** Decoy items while this slot is rattling; undefined once settled. */
    ghosts?: FacetItem[];
    onRoll: () => void;
  } = $props();

  const rattling = $derived(ghosts !== undefined);
  /**
   * Rows reserved under the controls: one per rolled chip, so a lock never grows the card.
   * Nothing rolled yet means nothing can shift, so an untouched card reserves no space.
   */
  const reservedRows = $derived(state.rolled.length > 0 || rattling ? state.count : 0);
  const tallChips = $derived(facet.items.some((item) => item.description));

  let card: HTMLElement;
  let toggle: HTMLInputElement;

  /** Collapsing unmounts the controls: hand focus to the checkbox instead of dropping it to <body>. */
  function onToggle() {
    if (!state.enabled && card.contains(document.activeElement)) toggle.focus();
  }

  const hasCount = $derived(facet.count.max > facet.count.min);

  /** Snap whatever the user typed (empty, decimal, out of range) back into the facet's bounds. */
  function clampCount(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const parsed = input.value.trim() === '' ? Number.NaN : Math.round(Number(input.value));
    const next = Number.isFinite(parsed)
      ? Math.max(facet.count.min, Math.min(parsed, facet.count.max))
      : facet.count.default;
    state.count = next;
    input.value = String(next);
  }
</script>

<article
  bind:this={card}
  class="card"
  class:disabled={!state.enabled}
  class:rattling
  style="--facet-hue: {facet.hue}"
  aria-labelledby="facet-{facet.id}"
  aria-busy={rattling}
>
  <header>
    <label class="title">
      <input type="checkbox" bind:this={toggle} bind:checked={state.enabled} onchange={onToggle} />
      <span id="facet-{facet.id}">{facet.label}</span>
    </label>
    <p class="hint" id="hint-{facet.id}">{facet.hint}</p>
  </header>

  {#if state.enabled}
  <div class="controls" transition:reveal>
    {#if hasCount}
      <label class="count" for="count-{facet.id}">
        How many
        <input
          id="count-{facet.id}"
          type="number"
          inputmode="numeric"
          min={facet.count.min}
          max={facet.count.max}
          step="1"
          bind:value={state.count}
          onchange={clampCount}
          aria-describedby="range-{facet.id}"
        />
        <span class="range" id="range-{facet.id}">{facet.count.min}–{facet.count.max}</span>
      </label>
    {/if}
    <button onclick={onRoll} aria-label="Roll {facet.label}" aria-describedby="hint-{facet.id}">
      Roll
    </button>
  </div>

  <ul
    class="chips"
    class:tall={tallChips}
    style="--rows: {reservedRows}"
    aria-label="Rolled {facet.label}"
    aria-hidden={ghosts !== undefined}
    transition:reveal
  >
    {#if ghosts}
      {#each ghosts as item, i (i)}
        <li class="chip ghost">
          <span class="chip-label">
            {#if item.emoji}<span class="emoji">{item.emoji}</span>{/if}{item.label}
          </span>
        </li>
      {/each}
    {:else}
      {#each state.rolled as item, i (item.id)}
        <li class="chip landed" style="--i: {i}">
          <span class="chip-label">
            {#if item.emoji}<span class="emoji" aria-hidden="true">{item.emoji}</span>{/if}{item.label}
          </span>
          {#if item.description}
            <span class="chip-desc">
              {item.description}
              {#if item.attribution}<span class="attribution">{item.attribution}</span>{/if}
            </span>
          {/if}
        </li>
      {/each}
    {/if}
  </ul>
  {/if}
</article>

<style>
  /* Narrow: stacked. Wide: a row — title and controls in a fixed left column, chips fill the rest. */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 1rem 1.25rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    min-width: 0;
    transition:
      border-color 0.15s,
      background-color 0.25s ease-out,
      padding 0.22s ease-out;
  }

  /* Disabled: collapsed to a single line — title and hint side by side, no controls or chips. */
  .card.disabled {
    border-style: dashed;
    padding-block: 0.5rem;
  }

  .card.disabled .title span,
  .card.disabled .hint {
    color: var(--muted);
  }

  .card.disabled header {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  header {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 1.05rem;
    cursor: pointer;
    min-height: 2.75rem;
    margin-block: -0.5rem;
  }

  .hint {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    transition: opacity 0.15s;
  }

  .count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--muted);
  }

  .count input {
    width: 4rem;
  }

  .range {
    font-variant-numeric: tabular-nums;
    font-size: 0.8rem;
  }

  /* Reserved once something has been rolled, so landing chips never push the layout;
     an untouched card has nothing to shift and stays closed up. */
  .chips {
    --row: 2.4rem;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 0.5rem;
    min-height: calc(var(--rows, 0) * var(--row) + max(var(--rows, 0) - 1, 0) * 0.5rem);
    transition: opacity 0.15s;
  }

  /* Sized for the longest plot description at full mobile width (3 lines). */
  .chips.tall {
    --row: 5.2rem;
  }

  /* Facet hue: chips, live edge and checkbox share it, so a result traces back to its card. */
  .chip {
    --tint-bg: oklch(var(--tint-bg-l) var(--tint-bg-c) var(--facet-hue));
    --tint-border: oklch(var(--tint-border-l) var(--tint-border-c) var(--facet-hue));
    --tint-text: oklch(var(--tint-text-l) var(--tint-text-c) var(--facet-hue));
    --tint-muted: oklch(var(--tint-muted-l) var(--tint-muted-c) var(--facet-hue));
    background: var(--tint-bg);
    border: 1px solid var(--tint-border);
    color: var(--tint-text);
    border-radius: 999px;
    padding: 0.35rem 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    max-width: 100%;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .chip-label {
    font-weight: 500;
  }

  .emoji {
    margin-inline-end: 0.35em;
  }

  .chip-desc {
    font-size: 0.8rem;
    color: var(--tint-muted);
    line-height: 1.35;
  }

  .attribution {
    margin-inline-start: 0.35rem;
    font-size: 0.75rem;
    opacity: 0.8;
  }

  .chip:has(.chip-desc) {
    border-radius: 12px;
    padding: 0.5rem 0.9rem;
  }

  /* Rattling: the slot is live — hue edge, decoys dimmed and blurred like dice still moving. */
  .card.rattling {
    border-color: oklch(var(--tint-border-l) var(--tint-border-c) var(--facet-hue));
  }

  .card:not(.disabled) input[type='checkbox'] {
    accent-color: oklch(var(--tint-accent-l) var(--tint-accent-c) var(--facet-hue));
  }

  .chip.ghost {
    background: var(--chip);
    color: var(--muted);
    border: 1px dashed var(--border);
    filter: blur(0.6px);
    /* Fixed so the rattle cannot reflow, but wide enough that the slowing ticks stay legible. */
    width: 10.5rem;
    max-width: 100%;
  }

  .chip.ghost .chip-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Landing: each locked chip drops into place, staggered by index. */
  .chip.landed {
    animation: land 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i) * 45ms);
  }

  @keyframes land {
    from {
      transform: translateY(-0.5rem) scale(1.06);
      opacity: 0;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .chip.landed {
      animation: appear 180ms ease-out both;
    }

    .chip.ghost {
      filter: none;
    }

    @keyframes appear {
      from {
        opacity: 0;
      }
    }
  }

  @media (min-width: 720px) {
    .card {
      grid-template-columns: 17rem 1fr;
      grid-template-areas:
        'header chips'
        'controls chips';
      column-gap: 1.5rem;
      align-items: start;
    }

    header {
      grid-area: header;
    }

    .controls {
      grid-area: controls;
    }

    .chips {
      grid-area: chips;
      align-self: stretch;
      /* Results read as the row's answer: pushed right, centred against the controls. */
      justify-content: flex-end;
      align-content: center;
      /* Full width fits every roll on one row; reserve just that, and only once rolled. */
      min-height: calc(min(var(--rows, 0), 1) * var(--row));
    }

    /* Two plot descriptions side by side, each with room to wrap. */
    .chip:has(.chip-desc) {
      flex: 1 1 18rem;
      max-width: 28rem;
    }
  }

  @media (min-width: 720px) {
    .card.disabled {
      /* Header spans both columns; controls/chips keep their areas while they slide out. */
      grid-template-areas:
        'header header'
        'controls chips';
      row-gap: 0;
    }

    .card.disabled .chips {
      min-height: 0;
    }
  }
</style>
