<script lang="ts">
  import { onDestroy } from 'svelte';

  let {
    sentence,
    revealing,
    revealEnabled,
    onRollAll,
    onSkip,
    onRevealChange,
  }: {
    sentence: string;
    revealing: boolean;
    revealEnabled: boolean;
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

  let copyStatus = $state<CopyStatus>('idle');
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    clearTimeout(copyTimer);
    try {
      await navigator.clipboard.writeText(sentence);
      copyStatus = 'copied';
    } catch {
      copyStatus = 'failed';
    }
    copyTimer = setTimeout(() => (copyStatus = 'idle'), 1500);
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
        : revealing || !sentence
          ? ''
          : sentence,
  );

  onDestroy(() => clearTimeout(copyTimer));
</script>

<section class="banner" class:revealing aria-labelledby="result-heading">
  <h2 id="result-heading" class="visually-hidden">Your game idea</h2>
  <p class="sentence" class:placeholder={!sentence}>
    {#key sentence}
      <span class="line">{sentence || 'Roll to get an idea'}</span>
    {/key}
  </p>
  <div class="actions">
    <button class="primary" onclick={onRollAll}>Roll everything</button>
    {#if revealing}
      <button onclick={onSkip}>Skip</button>
    {:else if canCopy}
      <button
        onclick={copy}
        disabled={!sentence}
        aria-label="Copy idea"
        class:failed={copyStatus === 'failed'}
        class:copied={copyStatus === 'copied'}
      >
        {#key copyStatus}<span class="line">{COPY_LABEL[copyStatus]}</span>{/key}
      </button>
    {/if}
    <label class="reveal">
      <input
        type="checkbox"
        checked={revealEnabled}
        onchange={(e) => onRevealChange(e.currentTarget.checked)}
      />
      Reveal one by one
    </label>
  </div>
  <p class="visually-hidden" role="status">{announcement}</p>
</section>

<style>
  .banner {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
    transition:
      border-color 0.2s,
      background-color 0.25s ease-out;
  }

  .banner.revealing {
    border-color: var(--accent);
  }

  .sentence {
    margin: 0;
    font-size: clamp(1.4rem, 3.5vw, 2rem);
    font-weight: 600;
    line-height: 1.3;
    /* Two lines reserved: the banner keeps its height while slots lock in. */
    min-height: 2.6em;
    text-wrap: balance;
    overflow-wrap: anywhere;
  }

  /* Three lines on narrow screens, where the finished sentence usually needs them. */
  @media (max-width: 640px) {
    .sentence {
      min-height: 3.9em;
    }
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
    font-size: 0.9rem;
    color: var(--muted);
    cursor: pointer;
    min-height: 2.5rem;
  }

  /* When the row wraps, the toggle lines up under the buttons instead of drifting right. */
  @media (max-width: 640px) {
    .reveal {
      margin-inline-start: 0;
      flex-basis: 100%;
    }
  }

  .failed {
    border-color: var(--danger);
    color: var(--danger);
  }

  .copied {
    border-color: var(--accent);
    color: var(--accent);
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
