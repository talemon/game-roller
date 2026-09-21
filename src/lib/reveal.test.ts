import { afterEach, beforeEach, describe, expect, test, vi } from 'bun:test';
import type { Facet, FacetRoll } from './facets/types';
import { playReveal, type RevealHooks } from './reveal';

function facet(id: string): Facet {
  return {
    id,
    label: id,
    hint: '',
    slot: 'prefix',
    icon: 'gamepad',
    items: Array.from({ length: 6 }, (_, i) => ({ id: `${id}:${i}`, label: `${id}${i}`, phrase: `${id}${i}` })),
    count: { min: 1, max: 2, default: 1 },
    enabledByDefault: true,
    hue: 0,
  };
}

function rollOf(f: Facet, n: number): FacetRoll {
  return { facet: f, items: f.items.slice(0, n) };
}

function recorder() {
  const events: string[] = [];
  const hooks: RevealHooks = {
    onSpin: (f, g) => events.push(`spin:${f.id}:${g.length}`),
    onTick: (f) => events.push(`tick:${f.id}`),
    onLock: (r) => events.push(`lock:${r.facet.id}`),
    onDone: () => events.push('done'),
  };
  return { events, hooks };
}

describe('playReveal', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('rattles then locks slots in order, then reports done', () => {
    const { events, hooks } = recorder();
    playReveal([rollOf(facet('a'), 2), rollOf(facet('b'), 1)], hooks, { reducedMotion: false });
    expect(events).toEqual(['spin:a:2']);
    vi.runAllTimers();
    expect(events.filter((e) => e.startsWith('lock'))).toEqual(['lock:a', 'lock:b']);
    expect(events.filter((e) => e === 'tick:a').length).toBeGreaterThan(3);
    expect(events.indexOf('lock:a')).toBeLessThan(events.indexOf('spin:b:1'));
    expect(events.at(-1)).toBe('done');
  });

  test('skip locks everything remaining immediately, once', () => {
    const { events, hooks } = recorder();
    const skip = playReveal([rollOf(facet('a'), 1), rollOf(facet('b'), 1)], hooks, { reducedMotion: false });
    vi.advanceTimersByTime(60);
    skip();
    skip();
    expect(events.filter((e) => e.startsWith('lock'))).toEqual(['lock:a', 'lock:b']);
    expect(events.filter((e) => e === 'done')).toHaveLength(1);
    const before = events.length;
    vi.runAllTimers();
    expect(events.length).toBe(before);
  });

  test('reduced motion marks each slot pending, then locks, without ticks', () => {
    const { events, hooks } = recorder();
    playReveal([rollOf(facet('a'), 1), rollOf(facet('b'), 1)], hooks, { reducedMotion: true });
    expect(events).toEqual(['spin:a:0']);
    vi.runAllTimers();
    expect(events).toEqual(['spin:a:0', 'lock:a', 'spin:b:0', 'lock:b', 'done']);
  });

  test('empty sequence completes synchronously', () => {
    const { events, hooks } = recorder();
    playReveal([], hooks, { reducedMotion: false });
    expect(events).toEqual(['done']);
  });
});
