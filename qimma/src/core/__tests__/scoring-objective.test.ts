import { describe, expect, it } from 'vitest';

import {
  type Item,
  type Option,
  scoreBlanks,
  scoreDictation,
  scoreIndices,
  scoreItem,
  scoreMultipleChoice,
  scoreReorder,
  scoreSingleChoice,
} from '@/core';

const options: Option[] = [
  { id: 'a', text: 'Heat' },
  { id: 'b', text: 'Light' },
  { id: 'c', text: 'Sound' },
  { id: 'd', text: 'Motion' },
];

describe('single choice (MCSA)', () => {
  it('scores 1 for the correct option', () => {
    const r = scoreSingleChoice(options, 'b', ['b']);
    expect(r.total).toBe(1);
    expect(r.max).toBe(1);
    expect(r.percent).toBe(1);
    expect(r.feedback).toEqual(['Correct.']);
  });

  it('scores 0 for a wrong option and reveals the answer', () => {
    const r = scoreSingleChoice(options, 'b', ['c']);
    expect(r.total).toBe(0);
    expect(r.feedback).toEqual(['Not quite.']);
    expect(r.answer).toBe('Light');
  });

  it('scores 0 when two options are selected, even if one is right', () => {
    expect(scoreSingleChoice(options, 'b', ['b', 'c']).total).toBe(0);
  });

  it('scores 0 when nothing is selected', () => {
    expect(scoreSingleChoice(options, 'b', []).total).toBe(0);
  });
});

describe('multiple choice (MCMA): +1 per correct, -1 per wrong, floor 0', () => {
  const answers = ['a', 'c'];

  it('full marks when every correct option and nothing else is chosen', () => {
    const r = scoreMultipleChoice(options, answers, ['a', 'c']);
    expect(r.total).toBe(2);
    expect(r.max).toBe(2);
    expect(r.percent).toBe(1);
  });

  it('gives partial credit for a subset of the correct options', () => {
    const r = scoreMultipleChoice(options, answers, ['a']);
    expect(r.total).toBe(1);
    expect(r.percent).toBe(0.5);
  });

  it('subtracts a point for each wrong option', () => {
    // one right (+1) and one wrong (-1) nets to zero
    expect(scoreMultipleChoice(options, answers, ['a', 'b']).total).toBe(0);
    // two right and one wrong nets to one
    const r = scoreMultipleChoice(options, answers, ['a', 'c', 'd']);
    expect(r.total).toBe(1);
    expect(r.feedback[0]).toBe('2 correct, 1 incorrect selection.');
  });

  it('never goes below zero', () => {
    const r = scoreMultipleChoice(options, answers, ['b', 'd']);
    expect(r.total).toBe(0);
    expect(r.feedback[0]).toBe('0 correct, 2 incorrect selections.');
    expect(r.feedback.join(' ')).toContain('subtracts a point');
  });

  it('ignores duplicate selections', () => {
    expect(scoreMultipleChoice(options, answers, ['a', 'a', 'c']).total).toBe(2);
  });
});

describe('reorder paragraphs: 1 point per correct adjacent pair', () => {
  const correct = ['p1', 'p2', 'p3', 'p4'];

  it('perfect order scores every pair', () => {
    const r = scoreReorder(correct, ['p1', 'p2', 'p3', 'p4']);
    expect(r.total).toBe(3);
    expect(r.max).toBe(3);
    expect(r.feedback[0]).toBe('3 of 3 adjacent pairs in the right order.');
  });

  it('reversed order scores nothing', () => {
    const r = scoreReorder(correct, ['p4', 'p3', 'p2', 'p1']);
    expect(r.total).toBe(0);
    expect(r.max).toBe(3);
  });

  it('partial order scores only the pairs that are adjacent and right', () => {
    // p1>p2 is right; p2>p4 and p4>p3 are not
    expect(scoreReorder(correct, ['p1', 'p2', 'p4', 'p3']).total).toBe(1);
    // p2>p3 and p3>p4 are right; p4>p1 is not
    expect(scoreReorder(correct, ['p2', 'p3', 'p4', 'p1']).total).toBe(2);
  });

  it('reveals the correct order as the answer', () => {
    expect(scoreReorder(correct, correct).answer).toBe('p1 → p2 → p3 → p4');
  });
});

describe('fill in the blanks: case-insensitive, one point per gap', () => {
  const answers = ['photosynthesis', 'energy'];

  it('accepts different capitalisation', () => {
    const r = scoreBlanks(answers, ['Photosynthesis', 'ENERGY']);
    expect(r.total).toBe(2);
    expect(r.percent).toBe(1);
  });

  it('ignores surrounding spaces and trailing punctuation', () => {
    expect(scoreBlanks(answers, [' photosynthesis ', 'energy.']).total).toBe(2);
  });

  it('lists each wrong gap with the expected word', () => {
    const r = scoreBlanks(answers, ['photosynthesis', 'heat']);
    expect(r.total).toBe(1);
    expect(r.feedback).toEqual(['1 of 2 gaps correct.', 'Gap 2: energy']);
  });

  it('counts a missing gap as wrong', () => {
    expect(scoreBlanks(answers, ['photosynthesis']).total).toBe(1);
  });
});

describe('highlight indices: +1 per correct, -1 per wrong, floor 0', () => {
  const correct = [5, 8];

  it('scores full marks for exactly the right words', () => {
    expect(scoreIndices(correct, [5, 8]).total).toBe(2);
  });

  it('gives partial credit for some of the right words', () => {
    expect(scoreIndices(correct, [5]).total).toBe(1);
  });

  it('nets out wrong highlights and floors at zero', () => {
    expect(scoreIndices(correct, [5, 0])).toMatchObject({ total: 0, max: 2 });
    expect(scoreIndices(correct, [0, 1, 3]).total).toBe(0);
  });

  it('ignores duplicate indices', () => {
    expect(scoreIndices(correct, [8, 8, 5]).total).toBe(2);
  });
});

describe('highlight incorrect words through scoreItem', () => {
  const item = {
    id: 'hiw-1',
    type: 'highlight-incorrect-words',
    title: 'Coral reefs',
    difficulty: 1,
    text: 'Coral reefs cover [less|more] than [one|two] percent of the ocean floor.',
  } as unknown as Item;
  // Tokens: 0 Coral, 1 reefs, 2 cover, 3 [less|more], 4 than, 5 [one|two], ...

  it('scores both marked words', () => {
    const r = scoreItem(item, { kind: 'indices', indices: [3, 5] });
    expect(r.total).toBe(2);
    expect(r.max).toBe(2);
  });

  it('scores one point for one of two marked words', () => {
    expect(scoreItem(item, { kind: 'indices', indices: [3] }).total).toBe(1);
  });

  it('subtracts a wrongly highlighted word', () => {
    const r = scoreItem(item, { kind: 'indices', indices: [3, 0, 1] });
    expect(r.total).toBe(0);
    expect(r.feedback).toEqual(['1 found, 2 wrongly highlighted.']);
  });

  it('rejects a response of the wrong kind with zero marks', () => {
    const r = scoreItem(item, { kind: 'text', text: 'less' });
    expect(r.total).toBe(0);
    expect(r.feedback[0]).toContain('Unexpected response');
  });
});

describe('write from dictation: one point per word, order-insensitive', () => {
  const sentence = 'The committee will review the proposal tomorrow.';

  it('scores every word when the sentence is typed exactly', () => {
    const r = scoreDictation(sentence, sentence);
    expect(r.total).toBe(7);
    expect(r.max).toBe(7);
  });

  it('ignores capitals and punctuation', () => {
    expect(scoreDictation(sentence, 'the committee will review the proposal tomorrow').total).toBe(7);
  });

  it('does not depend on word order', () => {
    expect(scoreDictation(sentence, 'tomorrow proposal the review will committee the').total).toBe(7);
  });

  it('names a missing word', () => {
    const r = scoreDictation(sentence, 'The committee review the proposal tomorrow.');
    expect(r.total).toBe(6);
    expect(r.feedback[1]).toBe('Missed or misspelled: will');
  });

  it('counts a misspelled word as missed', () => {
    const r = scoreDictation(sentence, 'The comittee will review the proposal tomorrow.');
    expect(r.total).toBe(6);
    expect(r.feedback[1]).toBe('Missed or misspelled: committee');
  });

  it('needs every copy of a repeated word', () => {
    // "the" appears twice in the sentence but only once in the answer
    const r = scoreDictation(sentence, 'The committee will review proposal tomorrow.');
    expect(r.total).toBe(6);
    expect(r.feedback[1]).toBe('Missed or misspelled: the');
  });
});
