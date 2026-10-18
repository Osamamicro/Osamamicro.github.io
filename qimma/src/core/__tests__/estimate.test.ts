import { describe, expect, it } from 'vitest';

import { type AttemptSummary, estimateScores, getExam, streakDays, type SkillId, type TaskTypeId, toPteScale } from '@/core';

const academic = getExam('pte-academic');
const core = getExam('pte-core');
const SKILLS: SkillId[] = ['speaking', 'writing', 'reading', 'listening'];

const share = (t: TaskTypeId, skill: SkillId) => academic.weights[t]?.skills[skill] ?? 0;

const local = (y: number, m: number, d: number, h = 12) => new Date(y, m, d, h).getTime();
const NOW = local(2026, 9, 17, 18);

describe('toPteScale', () => {
  it('maps 0 to 10 and 1 to 90', () => {
    expect(toPteScale(0)).toBe(10);
    expect(toPteScale(1)).toBe(90);
  });

  it('maps the middle of the range to 50', () => {
    expect(toPteScale(0.5)).toBe(50);
    expect(toPteScale(0.25)).toBe(30);
  });

  it('clamps percentages outside 0..1', () => {
    expect(toPteScale(-1)).toBe(10);
    expect(toPteScale(3)).toBe(90);
  });

  it('always stays inside the 10..90 scale', () => {
    for (let p = -0.5; p <= 1.5; p += 0.05) {
      const s = toPteScale(p);
      expect(s).toBeGreaterThanOrEqual(10);
      expect(s).toBeLessThanOrEqual(90);
    }
  });
});

describe('estimateScores: no or simple evidence', () => {
  it('has no scores before any attempt', () => {
    const e = estimateScores([], academic);
    expect(e.overall).toBeNull();
    expect(e.byType).toEqual({});
    expect(e.skills.map((s) => [s.skill, s.score, s.attempts, s.coverage])).toEqual(
      SKILLS.map((s) => [s, null, 0, 0]),
    );
  });

  it('scores only the skills a task feeds', () => {
    // Read Aloud feeds Speaking only (9%), so Reading and Listening stay unscored.
    const e = estimateScores([{ taskType: 'read-aloud', percent: 1, at: NOW }], academic);
    const byId = Object.fromEntries(e.skills.map((s) => [s.skill, s]));
    expect(byId.speaking.score).toBe(90);
    expect(byId.reading.score).toBeNull();
    expect(byId.listening.score).toBeNull();
    expect(e.byType['read-aloud']).toEqual({ percent: 1, attempts: 1 });
  });

  it('uses the overall score from the single task that has evidence', () => {
    const e = estimateScores([{ taskType: 'read-aloud', percent: 0.5, at: NOW }], academic);
    expect(e.overall).toBe(50);
  });
});

describe('estimateScores: weighting', () => {
  it('weights task types by their published share of the skill', () => {
    // Describe Image (31% of speaking) scores 50%; Read Aloud (9%) scores 100%.
    const e = estimateScores(
      [
        { taskType: 'describe-image', percent: 0.5, at: NOW },
        { taskType: 'read-aloud', percent: 1, at: NOW },
      ],
      academic,
    );
    const expected = toPteScale(
      (share('describe-image', 'speaking') * 0.5 + share('read-aloud', 'speaking') * 1) /
        (share('describe-image', 'speaking') + share('read-aloud', 'speaking')),
    );
    expect(e.skills.find((s) => s.skill === 'speaking')!.score).toBe(expected);
  });

  it('uses each task type’s overall weight for the overall score', () => {
    const w = academic.weights;
    const e = estimateScores(
      [
        { taskType: 'read-aloud', percent: 1, at: NOW },
        { taskType: 'describe-image', percent: 0, at: NOW },
      ],
      academic,
    );
    const expected = toPteScale(w['read-aloud']!.overall / (w['read-aloud']!.overall + w['describe-image']!.overall));
    expect(e.overall).toBe(expected);
  });

  it('reports how much of a skill’s weight is backed by evidence', () => {
    const e = estimateScores([{ taskType: 'describe-image', percent: 0.8, at: NOW }], academic);
    const speaking = e.skills.find((s) => s.skill === 'speaking')!;
    const totalSpeaking = Object.values(academic.weights).reduce((sum, w) => sum + (w?.skills.speaking ?? 0), 0);
    expect(speaking.coverage).toBeCloseTo(share('describe-image', 'speaking') / totalSpeaking, 10);
    expect(speaking.coverage).toBeGreaterThan(0);
    expect(speaking.coverage).toBeLessThan(1);
  });

  it('ignores task types that are not part of the exam', () => {
    // Write Email is PTE Core only, so it gives Academic no writing evidence...
    const attempts: AttemptSummary[] = [{ taskType: 'write-email', percent: 1, at: NOW }];
    expect(estimateScores(attempts, academic).skills.find((s) => s.skill === 'writing')!.score).toBeNull();
    // ...but it does count for Core.
    expect(estimateScores(attempts, core).skills.find((s) => s.skill === 'writing')!.score).toBe(90);
  });
});

describe('estimateScores: recency', () => {
  it('weights a newer attempt more than an older one of the same task', () => {
    const e = estimateScores(
      [
        { taskType: 'describe-image', percent: 0, at: NOW - 86400000 },
        { taskType: 'describe-image', percent: 1, at: NOW },
      ],
      academic,
    );
    // Newest counts 1, the older one decays by half every 8 attempts.
    expect(e.byType['describe-image']!.percent).toBeCloseTo(1 / (1 + 0.5 ** (1 / 8)), 10);
    expect(e.byType['describe-image']!.percent).toBeGreaterThan(0.5);
  });

  it('uses only the 20 most recent attempts of each task type', () => {
    const recent = Array.from({ length: 20 }, (_, i) => ({ taskType: 'describe-image' as const, percent: 1, at: NOW - i * 1000 }));
    const old = Array.from({ length: 5 }, (_, i) => ({ taskType: 'describe-image' as const, percent: 0, at: NOW - 100000 - i * 1000 }));
    const e = estimateScores([...old, ...recent], academic);
    expect(e.byType['describe-image']).toEqual({ percent: 1, attempts: 25 });
  });

  it('does not depend on the order attempts are given in', () => {
    const attempts: AttemptSummary[] = [
      { taskType: 'describe-image', percent: 0.3, at: NOW - 5000 },
      { taskType: 'read-aloud', percent: 0.9, at: NOW - 1000 },
      { taskType: 'describe-image', percent: 0.7, at: NOW },
    ];
    expect(estimateScores([...attempts].reverse(), academic)).toEqual(estimateScores(attempts, academic));
  });
});

describe('streakDays', () => {
  const day = (n: number) => local(2026, 9, 17 - n);

  it('counts consecutive days ending today', () => {
    expect(streakDays([{ taskType: 'read-aloud', percent: 1, at: day(0) }, { taskType: 'read-aloud', percent: 1, at: day(1) }, { taskType: 'read-aloud', percent: 1, at: day(2) }], NOW)).toBe(3);
  });

  it('still counts a streak that ends yesterday', () => {
    const attempts: AttemptSummary[] = [1, 2].map((n) => ({ taskType: 'read-aloud', percent: 1, at: day(n) }));
    expect(streakDays(attempts, NOW)).toBe(2);
  });

  it('breaks at the first missing day', () => {
    const attempts: AttemptSummary[] = [0, 2, 3].map((n) => ({ taskType: 'read-aloud', percent: 1, at: day(n) }));
    expect(streakDays(attempts, NOW)).toBe(1);
  });

  it('counts several attempts on one day once', () => {
    const attempts: AttemptSummary[] = [
      { taskType: 'read-aloud', percent: 1, at: local(2026, 9, 17, 8) },
      { taskType: 'read-aloud', percent: 1, at: local(2026, 9, 17, 20) },
    ];
    expect(streakDays(attempts, NOW)).toBe(1);
  });

  it('is zero when the last attempt is older than yesterday', () => {
    expect(streakDays([{ taskType: 'read-aloud', percent: 1, at: day(5) }], NOW)).toBe(0);
    expect(streakDays([], NOW)).toBe(0);
  });
});
