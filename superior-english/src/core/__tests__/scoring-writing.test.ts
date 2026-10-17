import { describe, expect, it } from 'vitest';

import type { KeyPoint, ScoreResult, TraitId } from '@/core';
import { scoreWriteEmail, scoreWriteEssay, scoreSummarizeWrittenText } from '@/core';

const trait = (r: ScoreResult, id: TraitId) => r.traits.find((t) => t.id === id)!;

const coastKeyPoints: KeyPoint[] = [
  { label: 'Coast', keywords: ['coastline'] },
  { label: 'Species', keywords: ['species'] },
];

describe('Summarize Written Text: form is a hard gate', () => {
  it('scores form 1 for one sentence of 5–75 words that covers the points', () => {
    const r = scoreSummarizeWrittenText(
      'Reefs protect coastlines by absorbing wave energy and sheltering many species.',
      coastKeyPoints,
      'model',
    );
    expect(trait(r, 'form').score).toBe(1);
    expect(trait(r, 'content').score).toBe(4);
  });

  it('scores form 0 and every trait 0 for two sentences', () => {
    const r = scoreSummarizeWrittenText(
      'Reefs protect coastlines from storms. They also shelter many species.',
      coastKeyPoints,
      'model',
    );
    expect(trait(r, 'form').score).toBe(0);
    expect(r.total).toBe(0);
    expect(r.feedback[0]).toContain('2 sentence(s)');
  });

  it('scores form 0 for a single sentence longer than 75 words', () => {
    const long = `${Array.from({ length: 80 }, () => 'reef').join(' ')}.`;
    const r = scoreSummarizeWrittenText(long, coastKeyPoints, 'model');
    expect(trait(r, 'form').score).toBe(0);
    expect(r.total).toBe(0);
  });

  it('keeps only the form score when the content is missing', () => {
    const r = scoreSummarizeWrittenText('Gardens need regular watering during hot summer months.', coastKeyPoints, 'model');
    expect(trait(r, 'form').score).toBe(1);
    expect(trait(r, 'content').score).toBe(0);
    expect(r.total).toBe(1);
    expect(r.feedback.join(' ')).toContain('Not covered: Coast; Species');
  });
});

/** Filler prose of exactly `n` words, with a key-point word so content is scored. */
const essayOf = (n: number) => Array.from({ length: n }, (_, i) => (i % 15 === 14 ? 'policy.' : 'policy')).join(' ');

describe('Write Essay: form bands by word count', () => {
  const essayPoints: KeyPoint[] = [{ label: 'Policy', keywords: ['policy'] }];

  it.each([
    [100, 0],
    [150, 1],
    [250, 2],
    [350, 1],
    [400, 0],
  ])('%i words gives form %i', (words, form) => {
    const r = scoreWriteEssay(essayOf(words), essayPoints, 'model');
    expect(trait(r, 'form').score).toBe(form);
  });

  it('asks for 200–300 words in the feedback when the form is short', () => {
    const r = scoreWriteEssay(essayOf(150), essayPoints, 'model');
    expect(r.feedback[0]).toBe('Form: aim for 200–300 words (you wrote 150).');
  });
});

const emailPoints: KeyPoint[] = [
  { label: 'New date', keywords: ['friday'] },
  { label: 'New room', keywords: ['room 4'] },
  { label: 'Reason', keywords: ['projector'] },
];

const body = [
  'I am writing to let you know that the staff meeting on Friday has been moved to Room 4.',
  'The change was necessary because the projector in Room 2 has failed and the technician cannot repair it before next week.',
  'Please bring the updated budget figures and any questions about the new schedule. I will send a short agenda before the session.',
  'Thank you for your patience while we fix the problem.',
].join(' ');

describe('Write Email: conventions', () => {
  it('gives full conventions marks with a greeting and a sign-off', () => {
    const text = `Dear Ms Lee,\n\n${body}\n\nKind regards,\nSam`;
    const r = scoreWriteEmail(text, emailPoints, 'formal', 'model');
    expect(trait(r, 'form').score).toBe(2);
    expect(trait(r, 'content').score).toBe(3);
    expect(trait(r, 'email-conventions').score).toBe(2);
    expect(r.feedback).not.toContain('Open with a greeting (e.g. “Dear Ms Lee,”).');
  });

  it('gives no conventions marks and asks for both when there is no greeting or sign-off', () => {
    const r = scoreWriteEmail(body, emailPoints, 'formal', 'model');
    expect(trait(r, 'email-conventions').score).toBe(0);
    expect(r.feedback).toContain('Open with a greeting (e.g. “Dear Ms Lee,”).');
    expect(r.feedback).toContain('Close with a sign-off (e.g. “Kind regards,” and your name).');
  });

  it('gives one mark for a greeting alone', () => {
    const r = scoreWriteEmail(`Dear Ms Lee,\n\n${body}`, emailPoints, 'formal', 'model');
    expect(trait(r, 'email-conventions').score).toBe(1);
  });

  it('takes a mark off for casual words in a formal email', () => {
    const text = `Dear Ms Lee,\n\n${body} We are gonna need your answer soon.\n\nKind regards,\nSam`;
    const r = scoreWriteEmail(text, emailPoints, 'formal', 'model');
    expect(trait(r, 'email-conventions').score).toBe(1);
    expect(r.feedback).toContain('Keep the tone formal; avoid casual words.');
  });

  it('allows casual words when the register is informal', () => {
    const text = `Hi Sam,\n\n${body} We are gonna need your answer soon.\n\nCheers,\nAlex`;
    const r = scoreWriteEmail(text, emailPoints, 'informal', 'model');
    expect(trait(r, 'email-conventions').score).toBe(2);
  });

  // Known bug: the informal-marker check is a substring match, so "hey" inside the common
  // word "they" counts as a casual slip and takes a mark off a correct formal email.
  it.fails('does not treat "they" as the casual word "hey" (known bug: substring match)', () => {
    const text = `Dear Ms Lee,\n\n${body} They will send the updated agenda on Monday.\n\nKind regards,\nSam`;
    const r = scoreWriteEmail(text, emailPoints, 'formal', 'model');
    expect(trait(r, 'email-conventions').score).toBe(2);
  });

  // Known bug: the sign-off pattern only accepts one word after "regards", "Thanks" etc., so a
  // realistic full name such as "Sam Patel" is not recognised as a closing.
  it.fails('recognises a sign-off with a two-word name (known bug: one token only)', () => {
    const text = `Dear Ms Lee,\n\n${body}\n\nKind regards,\nSam Patel`;
    const r = scoreWriteEmail(text, emailPoints, 'formal', 'model');
    expect(trait(r, 'email-conventions').score).toBe(2);
  });

  it('scores form 0 for an email under 30 words', () => {
    const r = scoreWriteEmail('Dear Ms Lee, I will be late. Sam', emailPoints, 'formal', 'model');
    expect(trait(r, 'form').score).toBe(0);
    expect(r.total).toBe(0);
  });
});
