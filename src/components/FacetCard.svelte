<script lang="ts" module>
  import type { FacetItem } from '../lib/facets/types';

  export interface FacetState {
    enabled: boolean;
    count: number;
    rolled: FacetItem[];
    /** The count the chips were rolled for; a short pool can leave fewer chips than this. */
    rolledFor: number;
  }
</script>

<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import { exclusions } from '../lib/exclusions.svelte';
  import type { Facet } from '../lib/facets/types';
  import Icon from './Icon.svelte';

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  /** Expand/collapse: slide explains where the controls went; reduced motion keeps only the fade. */
  const reveal = (node: Element) =>
    reducedMotion.matches ? fade(node, { duration: 150 }) : slide(node, { duration: 220 });

  let {
    facet,
    state: slot = $bindable(),
    ghosts,
    onRoll,
    onNotice,
  }: {
    facet: Facet;
    state: FacetState;
    /** Decoy items while this slot is rattling; undefined once settled. */
    ghosts?: FacetItem[];
    onRoll: () => void;
    /** Says something the user did not see happen, for the banner's status region. */
    onNotice: (message: string) => void;
  } = $props();

  const rattling = $derived(ghosts !== undefined);
  /**
   * Rows reserved under the controls: one per rolled chip, so a lock never grows the card.
   * Nothing rolled yet means nothing can shift, so an untouched card reserves no space.
   */
  const reservedRows = $derived(slot.rolled.length > 0 || rattling ? slot.count : 0);
  const tallChips = $derived(facet.items.some((item) => item.description));
  /** The count changed since the last roll: the chips are that request's answer, not this one's. */
  const stale = $derived(
    !rattling && slot.rolled.length > 0 && slot.rolledFor !== slot.count,
  );

  const excluded = $derived(exclusions.of(facet.id));
  const eligibleCount = $derived(exclusions.eligible(facet).length);
  const excludedCount = $derived(facet.items.length - eligibleCount);
  let optionsOpen = $state(false);
  /** Two facets have over a hundred options; the rest fit on screen without a filter. */
  const filterable = $derived(facet.items.length > 40);
  let filter = $state('');
  const shownOptions = $derived.by(() => {
    const needle = filter.trim().toLowerCase();
    return needle ? facet.items.filter((item) => item.label.toLowerCase().includes(needle)) : facet.items;
  });

  /** Leaving out an option also takes it off the card: the sentence stops saying it at once. */
  function toggleOption(item: FacetItem) {
    exclusions.toggle(facet.id, item.id);
    if (excluded.has(item.id)) slot.rolled = slot.rolled.filter((r) => r.id !== item.id);
  }

  /** The chip's button unmounts with the chip: hand focus to Roll, the natural next action. */
  function excludeRolled(item: FacetItem, event: MouseEvent) {
    if (document.activeElement === event.currentTarget) rollButton?.focus();
    toggleOption(item);
  }

  let card: HTMLElement;
  let toggle: HTMLInputElement;
  let rollButton = $state<HTMLButtonElement>();

  /** Collapsing unmounts the controls: hand focus to the checkbox instead of dropping it to <body>. */
  function onToggle() {
    if (!slot.enabled && card.contains(document.activeElement)) toggle.focus();
  }

  const hasCount = $derived(facet.count.max > facet.count.min);

  /**
   * Snap whatever the user typed (empty, decimal, out of range) back into the facet's bounds,
   * and say so — a value silently rewritten under the cursor teaches that controls are advisory.
   */
  function clampCount(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const typed = input.value.trim();
    const parsed = typed === '' ? Number.NaN : Math.round(Number(typed));
    const next = Number.isFinite(parsed)
      ? Math.max(facet.count.min, Math.min(parsed, facet.count.max))
      : facet.count.default;
    if (typed !== String(next)) {
      const bound =
        next === facet.count.max ? ', the most it rolls' : next === facet.count.min ? ', the fewest it rolls' : '';
      onNotice(`${facet.label} set to ${next}${bound}`);
    }
    slot.count = next;
    input.value = String(next);
  }
</script>

<article
  bind:this={card}
  class="card"
  class:disabled={!slot.enabled}
  class:rattling
  style="--facet-hue: {facet.hue}"
  aria-labelledby="facet-{facet.id}"
  aria-busy={rattling}
>
  <header>
    <label class="title">
      <input type="checkbox" bind:this={toggle} bind:checked={slot.enabled} onchange={onToggle} />
      <Icon name={facet.icon} />
      <span id="facet-{facet.id}">{facet.label}</span>
    </label>
    <p class="hint" id="hint-{facet.id}">{facet.hint}</p>
  </header>

  {#if slot.enabled}
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
          bind:value={slot.count}
          onchange={clampCount}
          aria-describedby="range-{facet.id}"
        />
        <span class="range" id="range-{facet.id}">{facet.count.min}–{facet.count.max}</span>
      </label>
    {/if}
    <button
      bind:this={rollButton}
      class:stale
      onclick={onRoll}
      aria-label="Roll {facet.label}"
      aria-describedby="hint-{facet.id}"
    >
      Roll
    </button>
    {#if stale}
      <!-- The chips are the previous count's answer; say so rather than letting the card lie. -->
      <span class="pending">Roll to apply</span>
    {/if}
  </div>

  <ul
    class="chips"
    class:stale
    class:tall={tallChips}
    style="--rows: {reservedRows}"
    aria-label="Rolled {facet.label}"
    aria-hidden={ghosts !== undefined}
    transition:reveal
  >
    {#if ghosts}
      {#each ghosts as item, i (i)}
        <li class="chip ghost">
          <span class="chip-label">{item.label}</span>
        </li>
      {/each}
    {:else}
      {#each slot.rolled as item, i (item.id)}
        <li class="chip landed" style="--i: {i}">
          <span class="chip-label">{item.label}</span>
          {#if item.description}
            <span class="chip-desc">{item.description}</span>
          {/if}
          <button
            type="button"
            class="chip-remove"
            aria-label="Leave {item.label} out of future rolls"
            onclick={(event) => excludeRolled(item, event)}
          >
            <Icon name="ban" />
            Leave out
          </button>
        </li>
      {/each}
    {/if}
  </ul>

  <div class="options" transition:reveal>
    <button
      type="button"
      class="options-toggle"
      aria-expanded={optionsOpen}
      aria-controls="options-{facet.id}"
      onclick={() => (optionsOpen = !optionsOpen)}
    >
      <span class="chevron" class:open={optionsOpen} aria-hidden="true"></span>
      All options
      <span class="options-count">
        {#if excludedCount > 0}{eligibleCount} of {facet.items.length}{:else}{facet.items.length}{/if}
      </span>
    </button>
    {#if optionsOpen}
      <div id="options-{facet.id}" class="options-body" transition:reveal>
        <div class="options-bar">
          <p class="options-hint">Click an option to leave it out of future rolls.</p>
          {#if filterable}
            <input
              type="search"
              class="options-filter"
              placeholder="Filter"
              aria-label="Filter {facet.label} options"
              bind:value={filter}
            />
          {/if}
          {#if excludedCount > 0}
            <button type="button" class="options-reset" onclick={() => exclusions.clear(facet.id)}>
              Include all
            </button>
          {/if}
        </div>
        <ul class="options-list" aria-label="{facet.label} options">
          {#each shownOptions as item (item.id)}
            <li>
              <button
                type="button"
                class="option"
                class:excluded={excluded.has(item.id)}
                aria-pressed={!excluded.has(item.id)}
                title={item.description}
                onclick={() => toggleOption(item)}
              >
                {item.label}
              </button>
            </li>
          {/each}
        </ul>
        {#if shownOptions.length === 0}
          <p class="options-empty">Nothing matches “{filter.trim()}”.</p>
        {/if}
      </div>
    {/if}
  </div>
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

  /* Count changed since the last roll: the chips are the previous answer, and this card's
     Roll is the fix. Hue on that button is allowed — it is this result's own control. */
  .pending {
    font-size: 0.8rem;
    color: var(--muted);
  }

  button.stale {
    border-color: oklch(var(--tint-border-l) var(--tint-border-c) var(--facet-hue));
  }

  .chips.stale {
    opacity: 0.55;
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
    position: relative;
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

  /* The card's icon carries the same hue as its chips, so a result traces back by colour. */
  .title :global(.icon) {
    color: oklch(var(--tint-text-l) var(--tint-text-c) var(--facet-hue));
  }

  .card.disabled .title :global(.icon) {
    color: var(--muted);
  }

  .chip-desc {
    font-size: 0.8rem;
    color: var(--tint-muted);
    line-height: 1.35;
  }

  .chip:has(.chip-desc) {
    border-radius: 12px;
    padding: 0.5rem 0.9rem;
  }

  /* Leave-out: named, not a ×. A × says "dismiss"; this says the chip will not come back. */
  .chip.landed {
    padding-right: 6rem;
  }

  .chip-remove {
    position: absolute;
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    min-height: 0;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    border-color: transparent;
    background: transparent;
    color: var(--tint-muted);
    font-size: 0.75rem;
    line-height: 1.2;
    white-space: nowrap;
  }

  .chip:has(.chip-desc) .chip-remove {
    top: 0.45rem;
    transform: none;
  }

  .chip-remove:hover:not(:disabled),
  .chip-remove:focus-visible {
    color: var(--tint-text);
    background: var(--tint-border);
    border-color: transparent;
  }

  /* Every option the facet can roll, closed by default: a reference and an edit surface, not the result. */
  .options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  .options-toggle {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem 0.25rem 0.25rem;
    min-height: 2rem;
    background: transparent;
    border-color: transparent;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .options-toggle:hover:not(:disabled) {
    color: var(--text);
    border-color: transparent;
    background: var(--chip);
  }

  .chevron {
    width: 0.5em;
    height: 0.5em;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(-45deg);
    transition: transform 0.15s;
    margin-inline: 0.2em;
  }

  .chevron.open {
    transform: rotate(45deg);
  }

  .options-count {
    font-variant-numeric: tabular-nums;
  }

  .options-body {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .options-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .options-hint {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
    flex: 1 1 14rem;
  }

  .options-filter {
    font: inherit;
    font-size: 0.9rem;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    min-height: 2.25rem;
    width: 10rem;
    max-width: 100%;
  }

  .options-reset {
    min-height: 2.25rem;
    padding-block: 0.25rem;
    font-size: 0.85rem;
  }

  .options-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  /* Included reads like a small chip; left out is hollow and struck, so the two states never blur. */
  .option {
    --tint-bg: oklch(var(--tint-bg-l) var(--tint-bg-c) var(--facet-hue));
    --tint-border: oklch(var(--tint-border-l) var(--tint-border-c) var(--facet-hue));
    --tint-text: oklch(var(--tint-text-l) var(--tint-text-c) var(--facet-hue));
    min-height: 0;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    font-size: 0.85rem;
    background: var(--tint-bg);
    border-color: var(--tint-border);
    color: var(--tint-text);
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .option.excluded {
    background: transparent;
    border-style: dashed;
    border-color: var(--border);
    color: var(--muted);
    text-decoration: line-through;
  }

  .option:hover:not(:disabled) {
    border-color: var(--accent);
  }

  .options-empty {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
  }

  /* Touch: the small pills stay small; the tap target is widened invisibly instead. */
  @media (pointer: coarse) {
    .option {
      position: relative;
    }

    .option::before,
    .chip-remove::before {
      content: '';
      position: absolute;
      inset: -0.4rem;
    }
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
        'controls chips'
        'options options';
      column-gap: 1.5rem;
      align-items: start;
    }

    header {
      grid-area: header;
    }

    .controls {
      grid-area: controls;
    }

    .options {
      grid-area: options;
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
        'controls chips'
        'options options';
      row-gap: 0;
    }

    .card.disabled .chips {
      min-height: 0;
    }
  }
</style>
