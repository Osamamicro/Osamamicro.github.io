import { isDue, newCard, review, type Grade, type SrsCard, type VocabEntry } from '@/core';

/** How many never-reviewed words a "learn new" session introduces. */
export const NEW_BATCH = 10;

export const GRADES: Grade[] = ['again', 'hard', 'good', 'easy'];

export type ReviewMode = 'due' | 'new';
export type CardStatus = 'new' | 'due' | 'learning' | 'learned';
export type CardStore = Record<string, SrsCard | undefined>;

export interface ReviewQueue {
  entries: VocabEntry[];
  /** 'new' when the queue holds never-reviewed words (by request, or because nothing was due). */
  source: 'due' | 'new';
}

/**
 * Due cards, most overdue first. With mode 'new', or when nothing is due, it instead
 * introduces up to NEW_BATCH words that have never been reviewed.
 */
export function buildReviewQueue(entries: VocabEntry[], cards: CardStore, now: number, mode: ReviewMode): ReviewQueue {
  const fresh = entries.filter((e) => cards[e.id] === undefined).slice(0, NEW_BATCH);
  if (mode === 'new') return { entries: fresh, source: 'new' };
  const due = entries
    .flatMap((entry) => {
      const card = cards[entry.id];
      return card && isDue(card, now) ? [{ entry, due: card.due }] : [];
    })
    .sort((a, b) => a.due - b.due)
    .map((x) => x.entry);
  if (due.length > 0) return { entries: due, source: 'due' };
  return { entries: fresh, source: 'new' };
}

export function cardStatus(card: SrsCard | undefined, now: number): CardStatus {
  if (!card) return 'new';
  if (card.due <= now) return 'due';
  return card.repetitions >= 2 ? 'learned' : 'learning';
}

export interface VocabStats {
  total: number;
  /** Cards due now (the same rule the review queue uses). */
  due: number;
  /** Cards with at least two successful reviews in a row. */
  learned: number;
  /** Words never reviewed yet. */
  fresh: number;
}

export function vocabStats(entries: VocabEntry[], cards: CardStore, now: number): VocabStats {
  let due = 0;
  let learned = 0;
  let fresh = 0;
  for (const entry of entries) {
    const card = cards[entry.id];
    if (!card) {
      fresh += 1;
      continue;
    }
    if (isDue(card, now)) due += 1;
    if (card.repetitions >= 2) learned += 1;
  }
  return { total: entries.length, due, learned, fresh };
}

export interface VocabFilter {
  query: string;
  /** Tag to keep, or null for all tags. */
  tag: string | null;
}

/** Case-insensitive search over word and definition, optionally narrowed to one tag. */
export function filterVocab(entries: VocabEntry[], { query, tag }: VocabFilter): VocabEntry[] {
  const q = query.trim().toLowerCase();
  return entries.filter(
    (e) =>
      (tag === null || e.tags.includes(tag)) &&
      (q === '' || e.word.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q)),
  );
}

export function allTags(entries: VocabEntry[]): string[] {
  return [...new Set(entries.flatMap((e) => e.tags))].sort();
}

/** Days until the next review for each grade, so the learner sees the effect of a choice. */
export function previewIntervals(card: SrsCard | undefined, now: number): Record<Grade, number> {
  const base = card ?? newCard(now);
  return Object.fromEntries(GRADES.map((g) => [g, review(base, g, now).interval])) as Record<Grade, number>;
}
