/** SM-2 spaced repetition (as in Anki's original algorithm), used by the vocab book. */

export interface SrsCard {
  /** Easiness factor, starts at 2.5, never below 1.3. */
  ease: number;
  /** Days until next review. */
  interval: number;
  repetitions: number;
  /** Epoch ms when the card is next due. */
  due: number;
}

export type Grade = 'again' | 'hard' | 'good' | 'easy';

const QUALITY: Record<Grade, number> = { again: 1, hard: 3, good: 4, easy: 5 };
const DAY = 24 * 60 * 60 * 1000;

export function newCard(now: number): SrsCard {
  return { ease: 2.5, interval: 0, repetitions: 0, due: now };
}

export function review(card: SrsCard, grade: Grade, now: number): SrsCard {
  const q = QUALITY[grade];
  if (q < 3) {
    // Lapse: relearn tomorrow (10 minutes would need intra-day scheduling; keep it simple).
    return { ease: Math.max(1.3, card.ease - 0.2), interval: 1, repetitions: 0, due: now + DAY };
  }
  const ease = Math.max(1.3, card.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const repetitions = card.repetitions + 1;
  let interval: number;
  if (repetitions === 1) interval = 1;
  else if (repetitions === 2) interval = 6;
  else interval = Math.round(card.interval * ease);
  if (grade === 'easy') interval = Math.round(interval * 1.3);
  return { ease, interval, repetitions, due: now + interval * DAY };
}

export function isDue(card: SrsCard | undefined, now: number): boolean {
  return card === undefined || card.due <= now;
}
