import type { Item, Utterance, VoiceHint } from './types';

/**
 * What the learner HEARS for an item (played with text-to-speech when there is
 * no recorded audio). Returns null for items without an audio prompt.
 */
export function audioScript(item: Item): Utterance[] | null {
  const one = (text: string, voice?: VoiceHint): Utterance[] => [{ speaker: 'Speaker', voice, text }];
  switch (item.type) {
    case 'repeat-sentence':
      return one(item.sentence);
    case 'retell-lecture':
      return one(item.lecture, item.voice);
    case 'answer-short-question':
      return one(item.question);
    case 'summarize-group-discussion':
      return item.turns;
    case 'respond-to-situation':
      return one(item.situation);
    case 'summarize-spoken-text':
    case 'listening-mcma':
    case 'highlight-correct-summary':
    case 'listening-mcsa':
    case 'select-missing-word':
      return one(item.script, item.voice);
    case 'listening-fill-blanks':
      return one(fillPlaceholders(item.transcript, item.answers), item.voice);
    case 'highlight-incorrect-words':
      return one(parseHiw(item.text).spoken, item.voice);
    case 'write-from-dictation':
      return one(item.sentence, item.voice);
    default:
      return null;
  }
}

const PLACEHOLDER = /\{\{(\d+)\}\}/g;

/** Splits "a {{1}} b" into text and gap parts for renderers. */
export function splitPlaceholders(text: string): ({ kind: 'text'; text: string } | { kind: 'gap'; index: number })[] {
  const parts: ({ kind: 'text'; text: string } | { kind: 'gap'; index: number })[] = [];
  let last = 0;
  for (const m of text.matchAll(PLACEHOLDER)) {
    if (m.index! > last) parts.push({ kind: 'text', text: text.slice(last, m.index) });
    parts.push({ kind: 'gap', index: Number(m[1]) - 1 });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) });
  return parts;
}

export function placeholderCount(text: string): number {
  return [...text.matchAll(PLACEHOLDER)].length;
}

export function fillPlaceholders(text: string, values: string[]): string {
  return text.replace(PLACEHOLDER, (_, n: string) => values[Number(n) - 1] ?? '');
}

const HIW_MARK = /^\[([^|\]]+)\|([^\]]+)\]([.,;:!?]*)$/;

export interface HiwParsed {
  /** Words displayed on screen, in order. */
  shown: string[];
  /** The full sentence the speaker says. */
  spoken: string;
  /** 0-based indices into `shown` that differ from the audio. */
  incorrect: number[];
}

/** Parses "[shown|spoken]" markup used by Highlight Incorrect Words items. */
export function parseHiw(text: string): HiwParsed {
  const shown: string[] = [];
  const spoken: string[] = [];
  const incorrect: number[] = [];
  for (const token of text.trim().split(/\s+/)) {
    const m = token.match(HIW_MARK);
    if (m) {
      incorrect.push(shown.length);
      shown.push(m[1] + m[3]);
      spoken.push(m[2] + m[3]);
    } else {
      shown.push(token);
      spoken.push(token);
    }
  }
  return { shown, spoken: spoken.join(' '), incorrect };
}
