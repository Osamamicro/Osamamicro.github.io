import { splitPlaceholders } from '@/core';

export type WordPiece = { kind: 'word'; text: string } | { kind: 'gap'; index: number };

/**
 * Splits a gapped passage into whitespace-separated words. A gap that touches
 * punctuation (e.g. "{{1}}," ) stays in the same word, so the comma never floats
 * away from its slot.
 */
export function toWords(text: string): WordPiece[][] {
  const words: WordPiece[][] = [];
  let current: WordPiece[] = [];
  const flush = () => {
    if (current.length > 0) words.push(current);
    current = [];
  };
  for (const part of splitPlaceholders(text)) {
    if (part.kind === 'gap') {
      current.push({ kind: 'gap', index: part.index });
      continue;
    }
    for (const seg of part.text.split(/(\s+)/)) {
      if (seg === '') continue;
      if (/^\s/.test(seg)) flush();
      else current.push({ kind: 'word', text: seg });
    }
  }
  flush();
  return words;
}
