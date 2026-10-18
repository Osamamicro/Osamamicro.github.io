import { describe, expect, it } from 'vitest';

import { objectiveResult, type TaskTypeId } from '@/core';
import type { MockRecord } from '@/services/app-state';

import { isUnanswered, mockEstimate, summarizeMock, unansweredResult, NOT_ANSWERED, type MockResultItem } from './mock-results';
import { timeLabel } from './mock-plan';

function record(results: MockResultItem[]): MockRecord {
  return { id: 'm1', examId: 'pte-academic', kind: 'full', startedAt: 1_000, finishedAt: 2_000, results };
}

const scored = (taskType: TaskTypeId, percent: number): MockResultItem => ({
  itemId: `${taskType}-${percent}`,
  taskType,
  result: objectiveResult(percent, 1, []),
});

const unanswered = (taskType: TaskTypeId): MockResultItem => ({
  itemId: `unanswered-${taskType}`,
  taskType,
  result: unansweredResult(taskType),
});

describe('unanswered items', () => {
  it('uses the spec max and scores zero', () => {
    const r = unansweredResult('reading-mcsa');
    expect(r).toEqual({ traits: [], total: 0, max: 1, percent: 0, estimated: false, feedback: [NOT_ANSWERED] });
    expect(isUnanswered(r)).toBe(true);
  });

  it('does not mistake a scored result for an unanswered one', () => {
    expect(isUnanswered(objectiveResult(1, 1, []))).toBe(false);
  });
});

describe('summarizeMock', () => {
  it('counts answered and unanswered items and averages only scored answers', () => {
    const summary = summarizeMock(
      record([
        scored('reading-mcsa', 1),
        { itemId: 'b', taskType: 'reading-mcsa', result: unansweredResult('reading-mcsa') },
        scored('listening-mcsa', 0),
        { itemId: 'd', taskType: 'listening-mcsa', result: objectiveResult(0, 0, []) },
      ]),
    );
    expect(summary.answered).toBe(3);
    expect(summary.unanswered).toBe(1);
    expect(summary.rows).toEqual([
      expect.objectContaining({ taskType: 'reading-mcsa', answered: 1, unanswered: 1, average: 1 }),
      expect.objectContaining({ taskType: 'listening-mcsa', answered: 2, unanswered: 0, average: 0 }),
    ]);
  });

  it('keeps the rows in paper order', () => {
    const rows = summarizeMock(record([scored('listening-mcsa', 1), scored('reading-mcsa', 1)])).rows;
    expect(rows.map((r) => r.taskType)).toEqual(['listening-mcsa', 'reading-mcsa']);
  });
});

describe('mockEstimate', () => {
  it('leaves unanswered items out of the skill estimates', () => {
    const estimate = mockEstimate(record([scored('reading-mcsa', 1), unanswered('reading-mcsa')]));
    expect(estimate.skills.find((s) => s.skill === 'reading')?.score).toBe(90);
  });

  it('scores each skill from its own task types', () => {
    const estimate = mockEstimate(record([scored('reading-mcsa', 1), scored('listening-mcsa', 0)]));
    expect(estimate.skills.find((s) => s.skill === 'reading')?.score).toBe(90);
    expect(estimate.skills.find((s) => s.skill === 'listening')?.score).toBe(10);
    expect(estimate.skills.find((s) => s.skill === 'speaking')?.score).toBeNull();
  });

  it('reports low coverage when only a few task types of a skill were answered', () => {
    const reading = mockEstimate(record([scored('reading-mcsa', 1)])).skills.find((s) => s.skill === 'reading');
    expect(reading?.coverage).toBeGreaterThan(0);
    expect(reading?.coverage).toBeLessThan(0.5);
  });

  it('has no overall score before anything is answered', () => {
    expect(mockEstimate(record([unanswered('reading-mcsa')])).overall).toBeNull();
  });
});

describe('timeLabel', () => {
  it('shows a range when the exam gives one and an approximation otherwise', () => {
    expect(timeLabel(54, 84)).toBe('54–84 min');
    expect(timeLabel(null, 40)).toBe('~40 min');
  });
});
