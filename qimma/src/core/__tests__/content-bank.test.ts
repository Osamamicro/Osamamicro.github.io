import { describe, expect, it } from 'vitest';

import { ALL_ITEMS, guides, vocabEntries } from '@/content';
import { parseHiw, validateBank, validateGuides, validateVocab } from '@/core';

describe('content bank', () => {
  it('every item passes schema validation', () => {
    expect(validateBank(ALL_ITEMS)).toEqual([]);
  });

  it('vocabulary entries are complete and unique', () => {
    expect(validateVocab(vocabEntries)).toEqual([]);
  });

  it('guides have enough tips', () => {
    expect(validateGuides(guides)).toEqual([]);
  });

  it('parses highlight-incorrect-words markup', () => {
    const parsed = parseHiw('Reefs cover less than [one|two] percent, yet [many|few] species.');
    expect(parsed.shown.join(' ')).toBe('Reefs cover less than one percent, yet many species.');
    expect(parsed.spoken).toBe('Reefs cover less than two percent, yet few species.');
    expect(parsed.incorrect).toEqual([4, 7]);
  });
});
