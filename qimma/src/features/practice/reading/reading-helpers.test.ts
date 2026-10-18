import { describe, expect, it } from 'vitest';

import { stableShuffle, shuffleAway } from './seeded-shuffle';
import { toWords } from './cloze-words';

describe('stableShuffle', () => {
  it('keeps the same members and is repeatable for a seed', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const first = stableShuffle(items, 'item-1');
    expect(stableShuffle(items, 'item-1')).toEqual(first);
    expect([...first].sort()).toEqual([...items].sort());
  });
});

describe('shuffleAway', () => {
  it('never reproduces the forbidden order for two or more items', () => {
    for (let n = 2; n <= 6; n++) {
      const ids = Array.from({ length: n }, (_, i) => `p${i}`);
      for (let k = 0; k < 40; k++) {
        const out = shuffleAway(ids, `item-${n}-${k}`, ids);
        expect(out).not.toEqual(ids);
        expect([...out].sort()).toEqual([...ids].sort());
      }
    }
  });
});

describe('toWords', () => {
  it('keeps a gap with the punctuation glued to it and splits on spaces', () => {
    expect(toWords('Pay {{1}}, then {{2}} again.')).toEqual([
      [{ kind: 'word', text: 'Pay' }],
      [
        { kind: 'gap', index: 0 },
        { kind: 'word', text: ',' },
      ],
      [{ kind: 'word', text: 'then' }],
      [{ kind: 'gap', index: 1 }],
      [{ kind: 'word', text: 'again.' }],
    ]);
  });
});
