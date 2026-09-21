<script lang="ts">
  import type { SentencePart } from '../lib/sentence';

  let {
    sentence,
    parts,
    reserveText,
    revealing,
    revealEnabled,
    armedCount,
    notice,
    onRollAll,
    onSkip,
    onRevealChange,
  }: {
    sentence: string;
    /** The same sentence split into facet-attributed runs, so each word wears its card's hue. */
    parts: SentencePart[];
    /** The sentence this reveal will end on; reserves the banner's height up front. */
    reserveText: string;
    revealing: boolean;
    revealEnabled: boolean;
    /** How many cards are armed; nothing armed means there is nothing to roll. */
    armedCount: number;
    /** Something that happened without the user seeing it, e.g. a count snapped to bounds. */
    notice: string;
    onRollAll: () => void;
    onSkip: () => void;
    onRevealChange: (enabled: boolean) => void;
  } = $props();

  type CopyStatus = 'idle' | 'copied' | 'failed';
  const COPY_LABEL: Record<CopyStatus, string> = {
    idle: 'Copy',
    copied: 'Copied',
    failed: 'Copy failed',
  };

  // Clipboard API is absent on insecure origins (plain http on a LAN) and in some embedded browsers.
  const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard?.writeText;

  /**
   * Which sentence the last copy attempt was about. The button's state is derived from these
   * rather than parked in a timer: the confirmation belongs to one idea, so it stands until
   * that idea changes, and no stray re-render or racing timeout can clear it mid-read.
   */
  let copiedFor = $state<string | null>(null);
  let failedFor = $state<string | null>(null);

  const copyStatus = $derived<CopyStatus>(
    !sentence ? 'idle' : failedFor === sentence ? 'failed' : copiedFor === sentence ? 'copied' : 'idle',
  );

  async function copy() {
    const target = sentence;
    try {
      await navigator.clipboard.writeText(target);
      copiedFor = target;
      failedFor = null;
    } catch {
      failedFor = target;
      copiedFor = null;
    }
  }

  /**
   * One announcement per outcome. The visible sentence is not a live region: during a reveal
   * it changes ten times, and a screen reader would read every partial idea. This says the
   * finished idea once, and yields to the copy result while that is showing.
   */
  const announcement = $derived(
    copyStatus === 'copied'
      ? 'Idea copied to clipboard'
      : copyStatus === 'failed'
        ? 'Copying the idea failed'
        : notice
          ? notice
          : revealing || !sentence
            ? ''
            : sentence,
  );

  /** A finished idea is on screen: keeping it is now the loud action, rolling the quiet one. */
  const keepReady = $derived(!!sentence && !revealing);
</script>

<section class="banner" class:revealing aria-labelledby="result-heading">
  <h2 id="result-heading" class="visually-hidden">Your game idea</h2>
  <p class="sentence" class:placeholder={!sentence}>
    <!-- Sizes the box for the sentence the reveal is heading towards, so the banner grows
         once, before the rattle, instead of under the cursor aiming at Skip. -->
    <span class="sizer" aria-hidden="true">{reserveText || sentence}</span>
    {#key sentence}
      <span class="line"
        >{#each parts as part}{#if part.hue === undefined}{part.text}{:else}<span
            class="word"
            style="--facet-hue: {part.hue}">{part.text}</span
          >{/if}{/each}{#if !sentence}Roll to get an idea{/if}</span
      >
    {/key}
  </p>
  <div class="actions">
    <button
      class="roll"
      class:primary={!keepReady}
      onclick={onRollAll}
      disabled={armedCount === 0}
      aria-describedby={armedCount === 0 ? 'nothing-armed' : undefined}
    >
      {sentence ? 'Roll again' : 'Roll everything'}
    </button>
    {#if canCopy}
      <button
        class="swap"
        class:primary={keepReady}
        onclick={copy}
        disabled={!sentence || revealing}
        aria-label="Copy idea"
        class:failed={copyStatus === 'failed'}
        class:copied={copyStatus === 'copied'}
      >
        {#key copyStatus}<span class="line">{COPY_LABEL[copyStatus]}</span>{/key}
      </button>
    {:else if sentence}
      <!-- No clipboard API (insecure origin, embedded browser): hand over selectable text. -->
      <input
        class="fallback"
        type="text"
        readonly
        value={sentence}
        aria-label="Your game idea, select to copy"
        onfocus={(e) => e.currentTarget.select()}
      />
    {/if}
    <!-- Appended last: the reveal's escape hatch never moves a control that was already there. -->
    {#if revealing}
      <button onclick={onSkip}>Skip</button>
    {/if}
    <label class="reveal">
      <input
        type="checkbox"
        checked={revealEnabled}
        onchange={(e) => onRevealChange(e.currentTarget.checked)}
      />
      Reveal one by one
    </label>
    {#if armedCount === 0}
      <!-- Rolling nothing used to look like a broken button; name the fix instead. -->
      <p class="empty" id="nothing-armed">Tick a card below to roll something.</p>
    {/if}
  </div>
  <p class="visually-hidden" role="status">{announcement}</p>
</section>

<style>
  /*
   * The reading is not a compartment: it is the tray floor the dice land on. Recessed
   * rather than raised — deeper than the page in dark, warm chip-tone in light, no
   * shadow in either — so the artifact never shares material with the controls.
   */
  .banner {
    background: var(--tray);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
    transition:
      border-color 0.2s,
      background-color 0.25s ease-out;
  }

  /*
   * Narrow: the reading stays on screen while the user works the cards below it.
   * Per-facet re-roll is the core interaction, and the facet buttons sit up to 1000px
   * down the page — without this the sentence is gone by the time you reach one.
   */
  @media (max-width: 719px) {
    .banner {
      position: sticky;
      top: 0;
      z-index: 1;
      /* Compact while stuck: the tray below needs the room more than the padding does. */
      padding: 1rem 1.25rem;
      gap: 0.75rem;
    }
  }

  .banner.revealing {
    border-color: var(--accent);
  }

  .sentence {
    margin: 0;
    font-size: clamp(1.4rem, 3.5vw, 2rem);
    font-weight: 600;
    line-height: 1.3;
    text-wrap: balance;
    overflow-wrap: anywhere;
    /* Sizer and live line share one cell: the box is as tall as the taller of the two. */
    display: grid;
  }

  .sizer,
  .line {
    grid-area: 1 / 1;
  }

  .sizer {
    visibility: hidden;
    pointer-events: none;
  }

  /* Two lines floor once a roll exists, so a short result does not shrink the banner. */
  .sentence:not(.placeholder) {
    min-height: 2.6em;
  }

  /* Each locked slot re-keys the line: a short settle, not an entrance. */
  .line {
    display: inline-block;
    animation: settle 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes settle {
    from {
      transform: translateY(0.18em);
      opacity: 0.4;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }

  .placeholder {
    color: var(--muted);
    font-weight: 400;
  }

  /*
   * Traceability in the reading itself: a rolled word wears the hue of the compartment that
   * produced it, so the sentence and the chips below it are visibly the same result. Only
   * rolled text is tinted — "A", "game", "about", "and" stay the reading colour, which is
   * what keeps five hues in one line legible as a sentence rather than a ransom note.
   */
  .word {
    color: oklch(var(--tint-word-l) var(--tint-word-c) var(--facet-hue));
    transition: color 0.25s ease-out;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .reveal {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-inline-start: auto;
    font-size: 0.85rem;
    color: var(--muted);
    cursor: pointer;
    min-height: 2.5rem;
  }

  /* Sits on its own row under the buttons, so appearing never reflows the action row. */
  .empty {
    flex-basis: 100%;
    margin: 0;
    font-size: 0.85rem;
    color: var(--muted);
  }

  /* Copy holds one width across Copy / Copied / Copy failed; the roll button across both
     of its labels. Neither label change nudges anything else in the row. */
  .swap {
    min-width: 7.5rem;
  }

  .roll {
    min-width: 9.5rem;
  }

  /* Clipboard-less browsers still get the sentence in a selectable, copyable field. */
  .fallback {
    flex: 1 1 14rem;
    min-width: 0;
    font: inherit;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.45rem 0.9rem;
    min-height: 2.5rem;
  }

  /* When the row wraps, the toggle lines up under the buttons instead of drifting right. */
  @media (max-width: 640px) {
    .reveal {
      margin-inline-start: 0;
      flex-basis: 100%;
    }
  }

  /* Status tints are for the outlined button. While Copy is the primary it is already an
     accent slab, so tinting the ink accent would paint the label in its own background. */
  .failed:not(.primary) {
    border-color: var(--danger);
    color: var(--danger);
  }

  .copied:not(.primary) {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* Primary + failure: the slab itself turns Fault Red, keeping the paired ink readable. */
  .primary.failed {
    background: var(--danger);
    border-color: var(--danger);
    color: var(--accent-text);
  }

  @media (prefers-reduced-motion: reduce) {
    .line {
      animation: fade 200ms ease-out;
    }

    @keyframes fade {
      from {
        opacity: 0.4;
      }
    }
  }
</style>
