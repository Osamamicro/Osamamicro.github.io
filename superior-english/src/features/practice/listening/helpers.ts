import { splitPlaceholders } from '@/core';

export type GapToken = { kind: 'word'; text: string; spaced: boolean } | { kind: 'gap'; index: number; spaced: boolean };

/**
 * Breaks a transcript with {{n}} gaps into words and gaps. `spaced` is true when
 * whitespace (or the start of the text) comes before the token, so renderers can
 * keep punctuation attached to the word or gap it follows.
 */
export function gapTokens(transcript: string): GapToken[] {
  const tokens: GapToken[] = [];
  let spaced = true;
  for (const part of splitPlaceholders(transcript)) {
    if (part.kind === 'gap') {
      tokens.push({ kind: 'gap', index: part.index, spaced });
      spaced = false;
      continue;
    }
    for (const piece of part.text.split(/(\s+)/)) {
      if (piece === '') continue;
      if (/^\s+$/.test(piece)) {
        spaced = true;
        continue;
      }
      tokens.push({ kind: 'word', text: piece, spaced });
      spaced = false;
    }
  }
  return tokens;
}

// Same rule as scoreBlanks in core/scoring: case-insensitive, trailing punctuation ignored.
const normalizeBlank = (v: string) => v.trim().toLowerCase().replace(/[.,;:!?]+$/, '');

export function isBlankCorrect(value: string, answer: string): boolean {
  return normalizeBlank(value) === normalizeBlank(answer);
}

const normalizeWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

/**
 * Select Missing Word: the recording stops before the ending, so the spoken text
 * drops the trailing answer words when the script ends with them. Otherwise unchanged.
 */
export function withheldScript(script: string, answer: string): string {
  const words = script.trim().split(/\s+/);
  const ending = answer.trim().split(/\s+/).filter(Boolean);
  if (ending.length === 0 || ending.length >= words.length) return script;
  const tail = words.slice(-ending.length);
  const matches = tail.every((w, i) => normalizeWord(w) === normalizeWord(ending[i]));
  return matches ? words.slice(0, -ending.length).join(' ') : script;
}
