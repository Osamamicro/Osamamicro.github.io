import { describe, expect, it } from 'vitest';

import { tokenize, wordCount } from '@/core';
import {
  align,
  connectivesUsed,
  grammarIssues,
  hesitationCount,
  keyPointCoverage,
  paragraphs,
  repetitionCount,
  spellingIssues,
  splitSentences,
  stem,
} from '@/core/scoring/text';

// These helpers are internal to the scoring module (only tokenize and wordCount are re-exported).

describe('tokenize and wordCount', () => {
  it('lower-cases and strips surrounding punctuation', () => {
    expect(tokenize('Hello, World! It’s fine.')).toEqual(['hello', 'world', "it's", 'fine']);
    expect(tokenize('"Yes," she said.')).toEqual(['yes', 'she', 'said']);
  });

  it('keeps inner hyphens and apostrophes', () => {
    expect(tokenize("a well-known man's plan")).toEqual(['a', 'well-known', "man's", 'plan']);
  });

  it('treats any run of whitespace as one separator', () => {
    expect(wordCount('one two  three\n\nfour\tfive')).toBe(5);
    expect(wordCount('   ')).toBe(0);
    expect(tokenize('...')).toEqual([]);
  });

  it('keeps a leading accented letter ("École" stays "école")', () => {
    expect(tokenize('École nearby')).toEqual(['école', 'nearby']);
    expect(tokenize('Émile, Zoë')).toEqual(['émile', 'zoë']);
  });
});

describe('stem', () => {
  it('matches increase, increased, increasing and increases', () => {
    const forms = ['increase', 'increased', 'increasing', 'increases'].map(stem);
    expect(new Set(forms)).toEqual(new Set(['increas']));
  });

  it('matches study and studies, and vary and varied', () => {
    expect(stem('studies')).toBe(stem('study'));
    expect(stem('varied')).toBe(stem('vary'));
    expect(stem('varies')).toBe(stem('vary'));
  });

  it('leaves very short words alone', () => {
    expect(stem('bus')).toBe('bus');
    expect(stem('gas')).toBe('gas');
  });

  it('keeps words ending in -ss intact, so "businesses" matches "business"', () => {
    expect(stem('businesses')).toBe(stem('business'));
    expect(stem('process')).toBe(stem('processes'));
    expect(stem('processing')).toBe(stem('process'));
  });
});

describe('align (word-level Levenshtein)', () => {
  it('counts every word as a match when the transcript is exact', () => {
    const r = align(['a', 'b', 'c'], ['a', 'b', 'c']);
    expect(r).toMatchObject({ matches: 3, substitutions: 0, deletions: 0, insertions: 0 });
    expect(r.matchedRef).toEqual([true, true, true]);
  });

  it('separates a substitution from a deletion', () => {
    const r = align(['a', 'b', 'c', 'd'], ['a', 'x', 'c']);
    expect(r).toMatchObject({ matches: 2, substitutions: 1, deletions: 1, insertions: 0 });
    expect(r.matchedRef).toEqual([true, false, true, false]);
  });

  it('counts extra words as insertions', () => {
    const r = align(['a', 'b'], ['a', 'x', 'b']);
    expect(r).toMatchObject({ matches: 2, insertions: 1, deletions: 0, substitutions: 0 });
  });

  it('handles an empty side', () => {
    expect(align([], ['a', 'b']).insertions).toBe(2);
    expect(align(['a'], []).deletions).toBe(1);
  });
});

describe('keyPointCoverage with multi-word keywords', () => {
  const keyPoints = [
    { label: 'Sea rise', keywords: ['sea level rise', 'sea levels'] },
    { label: 'Climate', keywords: ['climate change'] },
    { label: 'Money', keywords: ['economic cost'] },
  ];

  it('covers a point when any one keyword phrase appears (with stemming)', () => {
    const r = keyPointCoverage('Rising sea levels threaten coastal cities.', keyPoints);
    expect(r.covered.map((k) => k.label)).toEqual(['Sea rise']);
    expect(r.missed.map((k) => k.label)).toEqual(['Climate', 'Money']);
    expect(r.ratio).toBeCloseTo(1 / 3, 10);
  });

  it('matches phrase inflections: "climate changes" covers "climate change"', () => {
    expect(keyPointCoverage('Recent climate changes are severe.', keyPoints).covered.map((k) => k.label)).toEqual(['Climate']);
  });

  it('requires the words of a phrase to be next to each other, in order', () => {
    expect(keyPointCoverage('The change in climate was small.', keyPoints).covered).toHaveLength(0);
  });

  it('has a zero ratio when there are no key points', () => {
    expect(keyPointCoverage('anything', [])).toEqual({ covered: [], missed: [], ratio: 0 });
  });

  it('covers keyword "business" with the plural "businesses"', () => {
    expect(keyPointCoverage('Many small businesses closed.', [{ label: 'Firms', keywords: ['business'] }]).covered).toHaveLength(1);
  });
});

describe('splitSentences and paragraphs', () => {
  it('splits on . ! ? followed by a capital, digit or quote', () => {
    expect(splitSentences('The sun rose. Birds sang! Did it rain? Yes.')).toEqual([
      'The sun rose.',
      'Birds sang!',
      'Did it rain?',
      'Yes.',
    ]);
  });

  it('does not end a sentence after an abbreviation such as "U.S." or "Dr."', () => {
    expect(splitSentences('The U.S. economy grew. Dr. Lee agreed.')).toEqual(['The U.S. economy grew.', 'Dr. Lee agreed.']);
  });

  it('does not split decimals such as 3.5', () => {
    expect(splitSentences('The rate rose 3.5 percent. Prices fell.')).toEqual(['The rate rose 3.5 percent.', 'Prices fell.']);
  });

  it('splits paragraphs on blank lines', () => {
    expect(paragraphs('First.\n\nSecond line\nstill second.\n\n\nThird.')).toEqual([
      'First.',
      'Second line\nstill second.',
      'Third.',
    ]);
  });
});

describe('connectives, spelling and counters', () => {
  it('finds discourse markers in the text', () => {
    expect(connectivesUsed('However, the plan failed. Therefore, we must act.')).toEqual(['however', 'therefore']);
  });

  it('flags common misspellings with the correction', () => {
    const issues = spellingIssues('I recieve the mail and it is definately late.');
    expect(issues.map((i) => i.message)).toEqual(['Spelling: "recieve" → "receive"', 'Spelling: "definately" → "definitely"']);
  });

  it('counts hesitations and immediate repeats', () => {
    expect(hesitationCount(['um', 'the', 'uh', 'cat'])).toBe(2);
    expect(repetitionCount(['the', 'the', 'cat', 'cat', 'sat'])).toBe(2);
  });
});

describe('grammarIssues', () => {
  const messages = (text: string) => grammarIssues(text).map((i) => i.message);

  it('flags subject-verb agreement such as "He have"', () => {
    expect(messages('He have a dog.')).toContain('Subject–verb agreement');
    expect(messages('They was late.')).toContain('Subject–verb agreement');
  });

  it('flags "a" before a vowel sound, such as "a apple"', () => {
    expect(messages('I ate a apple.')).toContain('Use "an" before a vowel sound');
  });

  it('does not flag the exceptions "an hour" and "a university"', () => {
    const articleIssues = messages('We waited an hour at a university.').filter((m) => m.includes('"an"') || m.includes('"a"'));
    expect(articleIssues).toEqual([]);
  });

  it('flags a missing capital after a full stop before the pronoun I', () => {
    expect(messages('i think so.')).toContain('Capitalise the pronoun "I"');
  });

  it('flags a space before punctuation', () => {
    expect(messages('Hello , world.')).toContain('No space before punctuation');
  });

  it('passes clean sentences', () => {
    expect(grammarIssues('The results were clear, and the team agreed to publish them.')).toEqual([]);
  });

  it('does not flag the correct "I was"', () => {
    expect(messages('Yesterday I was at the library.').filter((m) => m.startsWith('Subject'))).toEqual([]);
  });

  it('does not flag the subjunctive "if he were" or the question "does he have"', () => {
    expect(messages('If he were here, he would help.').filter((m) => m.startsWith('Subject'))).toEqual([]);
    expect(messages('Does he have a car?').filter((m) => m.startsWith('Subject'))).toEqual([]);
  });

  it('still flags "he have" outside those constructions', () => {
    expect(messages('Yesterday he have a dog.').filter((m) => m.startsWith('Subject'))).toHaveLength(1);
  });

  it('does not flag ordinary nouns and adjectives after "more" or "most"', () => {
    expect(messages('Farmers need more water for crops.')).not.toContain('Double comparative');
    expect(messages('Most other countries agree.')).not.toContain('Double comparative');
  });

  it('still flags a real double comparative such as "more better"', () => {
    expect(messages('This plan is more better than the last.')).toContain('Double comparative');
  });

  it('does not flag "had had" or "that that"', () => {
    expect(messages('I had had enough of the noise.')).not.toContain('Repeated word');
    expect(messages('I think that that plan works.')).not.toContain('Repeated word');
  });

  it('still flags a real repeated word such as "the the"', () => {
    expect(messages('I saw the the dog.')).toContain('Repeated word');
  });
});
