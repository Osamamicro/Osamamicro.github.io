import { describe, expect, it } from 'vitest';

import { gapTokens, isBlankCorrect, withheldScript } from './helpers';

describe('gapTokens', () => {
  it('keeps punctuation attached to the preceding word or gap', () => {
    expect(gapTokens('The {{1}}, which is {{2}}s big.')).toEqual([
      { kind: 'word', text: 'The', spaced: true },
      { kind: 'gap', index: 0, spaced: true },
      { kind: 'word', text: ',', spaced: false },
      { kind: 'word', text: 'which', spaced: true },
      { kind: 'word', text: 'is', spaced: true },
      { kind: 'gap', index: 1, spaced: true },
      { kind: 'word', text: 's', spaced: false },
      { kind: 'word', text: 'big.', spaced: true },
    ]);
  });
});

describe('isBlankCorrect', () => {
  it('ignores case, surrounding spaces and trailing punctuation, like the scorer', () => {
    expect(isBlankCorrect(' Water. ', 'water')).toBe(true);
    expect(isBlankCorrect('wather', 'water')).toBe(false);
    expect(isBlankCorrect('', 'water')).toBe(false);
  });
});

describe('withheldScript', () => {
  it('drops a trailing answer so the recording stops before it', () => {
    expect(withheldScript('The museum opens at nine every morning.', 'every morning')).toBe('The museum opens at nine');
  });

  it('leaves the script alone when it does not end with the answer', () => {
    expect(withheldScript('Water boils at one hundred degrees.', 'lava')).toBe('Water boils at one hundred degrees.');
  });

  it('never withholds the whole script', () => {
    expect(withheldScript('bank', 'bank')).toBe('bank');
  });
});
