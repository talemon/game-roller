import type { Facet, FacetItem, FacetRoll } from './facets/types';
import { sampleDistinct } from './roll';

/** Stand-in item shown in the sentence for a slot that is still rattling. */
export const PENDING_ITEM: FacetItem = { id: 'pending', label: '…', phrase: '…' };

export interface RevealHooks {
  /** Slot starts rattling; `ghosts` is the initial set of decoy labels to show. */
  onSpin(facet: Facet, ghosts: FacetItem[]): void;
  /** Rattle tick: swap the decoys. */
  onTick(facet: Facet, ghosts: FacetItem[]): void;
  /** Slot locks to its real result. */
  onLock(roll: FacetRoll): void;
  /** Whole sequence finished (or was skipped). */
  onDone(): void;
}

export interface RevealOptions {
  /** Skip the rattle; still lock slots one after another. */
  reducedMotion: boolean;
}

const TICKS = 9;
const TICK_START_MS = 45;
const TICK_END_MS = 150;
const GAP_MS = 110;
const REDUCED_GAP_MS = 320;

/**
 * Plays `rolls` one slot at a time in order. Returns a `skip()` that locks every
 * remaining slot immediately and ends the sequence; calling it after completion is a no-op.
 * Timings are ease-out: ticks start fast and lengthen so the last decoys are legible.
 */
export function playReveal(
  rolls: readonly FacetRoll[],
  hooks: RevealHooks,
  { reducedMotion }: RevealOptions,
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let index = 0;
  let done = false;

  const ghostsFor = (roll: FacetRoll) => sampleDistinct(roll.facet.items, roll.items.length);

  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    for (; index < rolls.length; index++) hooks.onLock(rolls[index]);
    hooks.onDone();
  };

  const lockAndAdvance = () => {
    hooks.onLock(rolls[index]);
    index++;
    if (index >= rolls.length) {
      done = true;
      hooks.onDone();
      return;
    }
    timer = setTimeout(spinCurrent, GAP_MS);
  };

  const spinCurrent = () => {
    const roll = rolls[index];
    if (reducedMotion) {
      // No rattle: the slot is marked pending, then locks after a readable pause.
      hooks.onSpin(roll.facet, []);
      timer = setTimeout(lockAndAdvance, REDUCED_GAP_MS);
      return;
    }
    hooks.onSpin(roll.facet, ghostsFor(roll));
    let tick = 0;
    const step = () => {
      tick++;
      if (tick >= TICKS) {
        lockAndAdvance();
        return;
      }
      hooks.onTick(roll.facet, ghostsFor(roll));
      const t = tick / TICKS;
      timer = setTimeout(step, TICK_START_MS + (TICK_END_MS - TICK_START_MS) * t * t);
    };
    timer = setTimeout(step, TICK_START_MS);
  };

  if (rolls.length === 0) {
    done = true;
    hooks.onDone();
  } else {
    spinCurrent();
  }

  return finish;
}
