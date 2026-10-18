import { describe, expect, it } from 'vitest';

import { isDue, newCard, review, type SrsCard } from '@/core';

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date(2026, 9, 17, 9).getTime();

describe('SM-2 spaced repetition', () => {
  it('starts a new card due now with ease 2.5', () => {
    expect(newCard(NOW)).toEqual({ ease: 2.5, interval: 0, repetitions: 0, due: NOW });
  });

  it('grows the interval 1 → 6 → about 15 days when every review is good', () => {
    let card: SrsCard = newCard(NOW);
    card = review(card, 'good', NOW);
    expect(card.interval).toBe(1);
    expect(card.due).toBe(NOW + DAY);

    card = review(card, 'good', NOW);
    expect(card.interval).toBe(6);

    card = review(card, 'good', NOW);
    expect(card.interval).toBe(15); // round(6 × 2.5)
    expect(card.repetitions).toBe(3);
    expect(card.due).toBe(NOW + 15 * DAY);
  });

  it('keeps ease steady on a good answer', () => {
    const card = review(review(newCard(NOW), 'good', NOW), 'good', NOW);
    expect(card.ease).toBeCloseTo(2.5, 10);
  });

  it('resets the card to one day on "again"', () => {
    let card: SrsCard = newCard(NOW);
    for (let i = 0; i < 3; i++) card = review(card, 'good', NOW);
    expect(card.interval).toBe(15);

    card = review(card, 'again', NOW);
    expect(card.interval).toBe(1);
    expect(card.repetitions).toBe(0);
    expect(card.due).toBe(NOW + DAY);
    expect(card.ease).toBeCloseTo(2.3, 10);
  });

  it('relearns from the start after a lapse', () => {
    let card: SrsCard = newCard(NOW);
    for (let i = 0; i < 3; i++) card = review(card, 'good', NOW);
    card = review(card, 'again', NOW);
    card = review(card, 'good', NOW);
    expect(card.interval).toBe(1);
    card = review(card, 'good', NOW);
    expect(card.interval).toBe(6);
  });

  it('never lets ease fall below 1.3', () => {
    let card: SrsCard = { ease: 1.4, interval: 1, repetitions: 1, due: NOW };
    card = review(card, 'again', NOW);
    expect(card.ease).toBe(1.3);
    card = review(card, 'again', NOW);
    expect(card.ease).toBe(1.3);
  });

  it('floors ease at 1.3 after repeated "hard" answers', () => {
    let card: SrsCard = newCard(NOW);
    for (let i = 0; i < 12; i++) card = review(card, 'hard', NOW);
    expect(card.ease).toBe(1.3);
  });

  it('gives "easy" a longer interval than "good"', () => {
    const base = review(review(newCard(NOW), 'good', NOW), 'good', NOW); // interval 6, ease 2.5
    const easy = review(base, 'easy', NOW);
    const good = review(base, 'good', NOW);
    // good: round(6 × 2.5) = 15. easy: ease 2.6, round(6 × 2.6) = 16, then × 1.3 = 21.
    expect(good.interval).toBe(15);
    expect(easy.interval).toBe(21);
    expect(easy.ease).toBeCloseTo(2.6, 10);
    expect(easy.ease).toBeGreaterThan(good.ease);
  });

  it('isDue: new or past-due cards are due, future cards are not', () => {
    expect(isDue(undefined, NOW)).toBe(true);
    expect(isDue({ ease: 2.5, interval: 1, repetitions: 1, due: NOW }, NOW)).toBe(true);
    expect(isDue({ ease: 2.5, interval: 1, repetitions: 1, due: NOW + DAY }, NOW)).toBe(false);
  });
});
