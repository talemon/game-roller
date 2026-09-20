<script lang="ts">
  import { onDestroy } from 'svelte';

  let { sentence, onRollAll }: { sentence: string; onRollAll: () => void } = $props();

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

  onDestroy(() => clearTimeout(copyTimer));
</script>

<section class="banner" aria-labelledby="result-heading">
  <h2 id="result-heading" class="visually-hidden">Your game idea</h2>
  <p class="sentence" class:placeholder={!sentence} aria-live="polite" aria-atomic="true">
    {sentence || 'Roll to get an idea'}
  </p>
  <div class="actions">
    <button class="primary" onclick={onRollAll}>Roll everything</button>
    {#if canCopy}
      <button
        onclick={copy}
        disabled={!sentence}
        class:failed={copyStatus === 'failed'}
        aria-live="polite"
      >
        {COPY_LABEL[copyStatus]}
      </button>
    {/if}
  </div>
</section>

<style>
  .banner {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
  }

  .sentence {
    margin: 0;
    font-size: clamp(1.4rem, 3.5vw, 2rem);
    font-weight: 600;
    line-height: 1.3;
    text-wrap: balance;
    overflow-wrap: anywhere;
  }

  .placeholder {
    color: var(--muted);
    font-weight: 400;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .failed {
    border-color: var(--danger);
    color: var(--danger);
  }
</style>
