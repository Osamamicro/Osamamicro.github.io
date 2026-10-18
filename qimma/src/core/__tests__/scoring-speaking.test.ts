import { describe, expect, it } from 'vitest';

import type { KeyPoint, ScoreResult, SpeechResponse, TraitId } from '@/core';
import {
  fluencyBand,
  pronunciationBand,
  scoreOpenSpeech,
  scoreReferenceSpeech,
  scoreShortAnswer,
} from '@/core';

const trait = (r: ScoreResult, id: TraitId) => r.traits.find((t) => t.id === id)!;
const speech = (transcript: string | null, durationMs: number, extra: Partial<SpeechResponse> = {}): SpeechResponse => ({
  kind: 'speech',
  transcript,
  durationMs,
  ...extra,
});

/** `n` distinct filler words, so no word repeats and no hesitation is counted. */
const wordsOf = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`);

const RA_TEXT = 'The quick brown fox jumps over the lazy dog.';

describe('Read Aloud (reference alignment)', () => {
  it('scores content 5 for a perfect transcript', () => {
    const r = scoreReferenceSpeech('read-aloud', RA_TEXT, speech('The quick brown fox jumps over the lazy dog', 30000));
    expect(trait(r, 'content').score).toBe(5);
    expect(r.estimated).toBe(true);
    expect(r.feedback[0]).toBe('9/9 words read correctly; 0 omission/insertion/substitution error(s).');
  });

  it('scores content 3 when one word of nine is left out (89%)', () => {
    const r = scoreReferenceSpeech('read-aloud', RA_TEXT, speech('The quick brown fox jumps over the dog', 30000));
    expect(trait(r, 'content').score).toBe(3);
    expect(r.feedback.join(' ')).toContain('Missed: lazy');
  });

  it('gives fluency and pronunciation no credit when the content is zero', () => {
    const r = scoreReferenceSpeech('read-aloud', RA_TEXT, speech('Hello there', 30000));
    expect(trait(r, 'content').score).toBe(0);
    expect(trait(r, 'fluency').score).toBe(0);
    expect(trait(r, 'pronunciation').score).toBe(0);
  });
});

describe('Repeat Sentence (reference alignment)', () => {
  const RS_TEXT = 'Please send the report to the manager by Friday';

  it('scores content 3 for an exact repeat', () => {
    const r = scoreReferenceSpeech('repeat-sentence', RS_TEXT, speech('please send the report to the manager by friday', 6000));
    expect(trait(r, 'content').score).toBe(3);
    expect(r.answer).toBe(RS_TEXT);
  });

  it('gives partial content for a partial repeat (6 of 9 words in order → 2)', () => {
    // Drops "to", the second "the" and "by": 6/9 ≈ 67%, which is in the 50–99% band.
    const r = scoreReferenceSpeech('repeat-sentence', RS_TEXT, speech('please send the report manager friday', 6000));
    expect(trait(r, 'content').score).toBe(2);
    expect(r.feedback[0]).toBe('You repeated 6 of 9 words in order.');
  });
});

describe('no transcript (no speech recogniser on the device)', () => {
  it('scores only content from the learner’s self-rating', () => {
    const r = scoreReferenceSpeech('read-aloud', RA_TEXT, speech(null, 30000, { selfRating: 0.6 }));
    expect(trait(r, 'content').score).toBe(3); // round(0.6 × 5)
    expect(trait(r, 'content').unscored).toBeUndefined();
    expect(trait(r, 'fluency').unscored).toBe(true);
    expect(trait(r, 'pronunciation').unscored).toBe(true);
    expect(r.total).toBe(3);
    expect(r.max).toBe(5);
    expect(r.percent).toBeCloseTo(0.6, 10);
    expect(r.estimated).toBe(true);
  });

  it('leaves everything unscored when there is no self-rating either', () => {
    const r = scoreReferenceSpeech('read-aloud', RA_TEXT, speech(null, 30000));
    expect(r.traits.every((t) => t.unscored)).toBe(true);
    expect(r.total).toBe(0);
    expect(r.max).toBe(0);
    expect(r.percent).toBe(0);
  });
});

describe('Answer Short Question', () => {
  const answers = ['cold', 'chilly', 'freezing'];

  it('accepts any listed variant', () => {
    expect(trait(scoreShortAnswer(answers, speech('It is chilly today', 2000)), 'vocabulary').score).toBe(1);
    expect(trait(scoreShortAnswer(answers, speech("It's freezing outside.", 2000)), 'vocabulary').score).toBe(1);
    expect(trait(scoreShortAnswer(answers, speech('Cold!', 2000)), 'vocabulary').score).toBe(1);
  });

  it('accepts a multi-word answer said anywhere in the reply', () => {
    const r = scoreShortAnswer(['on sunday', 'sunday'], speech('We meet on Sunday.', 2000));
    expect(r.total).toBe(1);
    expect(r.max).toBe(1);
  });

  it('matches whole words only', () => {
    const r = scoreShortAnswer(answers, speech('coldness', 2000));
    expect(r.total).toBe(0);
    expect(r.feedback[0]).toBe('Accepted answers: cold, chilly, freezing');
  });

  it('shows the first accepted answer as the model answer', () => {
    expect(scoreShortAnswer(answers, speech('Warm', 2000)).answer).toBe('cold');
  });
});

describe('fluencyBand: speaking rate against the target band', () => {
  // 30 seconds, so the rate in words per minute is twice the word count.
  it.each([
    [60, 5], // 120 wpm
    [50, 4], // 100 wpm
    [42, 3], // 84 wpm
    [35, 2], // 70 wpm
    [25, 1], // 50 wpm
    [20, 0], // 40 wpm
  ])('%i words in 30 s scores %i', (n, expected) => {
    expect(fluencyBand(wordsOf(n), 30000, 40)).toBe(expected);
  });

  it('takes a point off for hesitations and repeats', () => {
    const words = wordsOf(60);
    words[5] = 'um';
    words[20] = 'uh';
    expect(fluencyBand(words, 30000, 40)).toBe(4); // two hesitations → one disfluency point
  });

  it('caps the disfluency penalty at two points', () => {
    expect(fluencyBand(Array.from({ length: 60 }, () => 'um'), 30000, 40)).toBe(3);
  });

  it('takes a point off when a long window is barely used', () => {
    // 20 words in 10 s is 120 wpm, but only 25% of the 40 s window was used.
    expect(fluencyBand(wordsOf(20), 10000, 40)).toBe(4);
  });

  it('does not penalise short windows (under 30 s)', () => {
    expect(fluencyBand(wordsOf(20), 10000, 25)).toBe(5);
  });

  it('is zero with no words or no time', () => {
    expect(fluencyBand([], 30000, 40)).toBe(0);
    expect(fluencyBand(wordsOf(20), 0, 40)).toBe(0);
  });
});

describe('pronunciationBand', () => {
  it('uses the recognised share of words when there is no confidence score', () => {
    expect(pronunciationBand(null, 0.5)).toBe(3); // round(2.5)
    expect(pronunciationBand(undefined, 1)).toBe(5);
  });

  it('blends engine confidence (60%) with how much was recognised (40%)', () => {
    expect(pronunciationBand(1, 0.5)).toBe(4); // 0.6 + 0.2 = 0.8 → 4
    expect(pronunciationBand(0, 1)).toBe(2); // 0.4 → 2
  });
});

describe('open speech (key-point coverage)', () => {
  const keyPoints: KeyPoint[] = [
    { label: 'Trend', keywords: ['increase', 'rise'] },
    { label: 'Peak year', keywords: ['2020'] },
    { label: 'Lowest', keywords: ['decline', 'fell'] },
    { label: 'Conclusion', keywords: ['overall'] },
  ];

  it('gives full content when every key point is covered', () => {
    const transcript = 'Sales increased, the peak in 2020 was followed by a decline; overall the trend is clear.';
    const r = scoreOpenSpeech('describe-image', keyPoints, 'model', speech(transcript, 30000));
    expect(trait(r, 'content').score).toBe(6);
    expect(r.feedback).not.toContain('Missing: Lowest; Conclusion');
  });

  it('gives no content, fluency or pronunciation for stock phrases that miss the key points (on-topic floor)', () => {
    const stock = 'This is a very nice picture and I like it a lot. It looks good to me and it is interesting.';
    const r = scoreOpenSpeech('describe-image', keyPoints, 'model', speech(stock, 30000));
    expect(trait(r, 'content').score).toBe(0);
    expect(trait(r, 'fluency').score).toBe(0);
    expect(trait(r, 'pronunciation').score).toBe(0);
    expect(r.feedback.join(' ')).toContain('Missing: Trend; Peak year; Lowest; Conclusion');
  });

  it('scores half the content for half the key points, and names the missing ones', () => {
    const r = scoreOpenSpeech('describe-image', keyPoints, 'model', speech('Sales increased and peaked in 2020.', 30000));
    expect(trait(r, 'content').score).toBe(3); // 2 of 4 → 50% of 6
    expect(r.feedback).toContain('Missing: Lowest; Conclusion');
    expect(r.answer).toBe('model');
  });
});
