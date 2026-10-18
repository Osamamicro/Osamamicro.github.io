import { describe, expect, it } from 'vitest';

import type { SrsCard, VocabEntry } from '@/core';

import { allTags, buildReviewQueue, cardStatus, filterVocab, NEW_BATCH, previewIntervals, vocabStats } from './queue';

const DAY = 86_400_000;
const NOW = 1_000_000_000_000;

const entry = (id: string, extra: Partial<VocabEntry> = {}): VocabEntry => ({
  id,
  word: id,
  partOfSpeech: 'noun',
  definition: `meaning of ${id}`,
  example: `an example with ${id}`,
  tags: ['academic'],
  ...extra,
});

const card = (due: number, repetitions = 1): SrsCard => ({ ease: 2.5, interval: 1, repetitions, due });

describe('buildReviewQueue', () => {
  const entries = [entry('a'), entry('b'), entry('c')];

  it('returns due cards, most overdue first, and skips cards due later', () => {
    const cards = { a: card(NOW - 1000), b: card(NOW - 5000), c: card(NOW + DAY) };
    expect(buildReviewQueue(entries, cards, NOW, 'due')).toEqual({ entries: [entries[1], entries[0]], source: 'due' });
  });

  it('falls back to never-reviewed words when nothing is due', () => {
    const cards = { a: card(NOW + DAY) };
    const queue = buildReviewQueue(entries, cards, NOW, 'due');
    expect(queue.source).toBe('new');
    expect(queue.entries.map((e) => e.id)).toEqual(['b', 'c']);
  });

  it('caps a new-words session at NEW_BATCH and ignores due cards in that mode', () => {
    const many = Array.from({ length: 15 }, (_, i) => entry(`w${i}`));
    const cards = { w0: card(NOW - 1000) };
    const queue = buildReviewQueue(many, cards, NOW, 'new');
    expect(queue.source).toBe('new');
    expect(queue.entries).toHaveLength(NEW_BATCH);
    expect(queue.entries.some((e) => e.id === 'w0')).toBe(false);
  });

  it('returns an empty queue when everything is scheduled for later', () => {
    const cards = { a: card(NOW + DAY), b: card(NOW + DAY), c: card(NOW + DAY) };
    expect(buildReviewQueue(entries, cards, NOW, 'due').entries).toEqual([]);
  });
});

describe('cardStatus', () => {
  it('classifies cards by due date and repetitions', () => {
    expect(cardStatus(undefined, NOW)).toBe('new');
    expect(cardStatus(card(NOW - 1), NOW)).toBe('due');
    expect(cardStatus(card(NOW + DAY, 2), NOW)).toBe('learned');
    expect(cardStatus(card(NOW + DAY, 1), NOW)).toBe('learning');
  });
});

describe('vocabStats', () => {
  it('counts total, due, learned and fresh words', () => {
    const entries = [entry('a'), entry('b'), entry('c'), entry('d')];
    const cards = { a: card(NOW - 1), b: card(NOW + DAY, 2), c: card(NOW + DAY, 1) };
    expect(vocabStats(entries, cards, NOW)).toEqual({ total: 4, due: 1, learned: 1, fresh: 1 });
  });
});

describe('filterVocab and allTags', () => {
  const entries = [
    entry('fluctuate', { definition: 'To rise and fall.', tags: ['describe-image', 'academic'] }),
    entry('mitigate', { definition: 'To make less severe.', tags: ['essay'] }),
  ];

  it('searches words and definitions case-insensitively', () => {
    expect(filterVocab(entries, { query: 'FLUCT', tag: null }).map((e) => e.id)).toEqual(['fluctuate']);
    expect(filterVocab(entries, { query: 'severe', tag: null }).map((e) => e.id)).toEqual(['mitigate']);
  });

  it('narrows by tag and returns everything for an empty query', () => {
    expect(filterVocab(entries, { query: '  ', tag: 'essay' }).map((e) => e.id)).toEqual(['mitigate']);
    expect(filterVocab(entries, { query: '', tag: null })).toHaveLength(2);
  });

  it('lists each tag once, sorted', () => {
    expect(allTags(entries)).toEqual(['academic', 'describe-image', 'essay']);
  });
});

describe('previewIntervals', () => {
  it('shows a one-day wait for a lapse and the next step for a good answer', () => {
    expect(previewIntervals(undefined, NOW).again).toBe(1);
    const established: SrsCard = { ease: 2.5, interval: 6, repetitions: 2, due: NOW };
    const days = previewIntervals(established, NOW);
    expect(days.again).toBe(1);
    expect(days.good).toBe(15);
  });
});
