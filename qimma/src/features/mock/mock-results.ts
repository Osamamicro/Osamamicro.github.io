import { estimateScores, getExam, getTaskType, type ScoreEstimate, type ScoreResult, type TaskTypeId } from '@/core';
import type { MockRecord } from '@/services/app-state';

export const NOT_ANSWERED = 'Not answered';

export type MockResultItem = MockRecord['results'][number];

/** Stored for an item the learner never answered, for example when section time ran out. */
export function unansweredResult(type: TaskTypeId): ScoreResult {
  const max = getTaskType(type).traits.reduce((sum, t) => sum + t.max, 0) || 1;
  return { traits: [], total: 0, max, percent: 0, estimated: false, feedback: [NOT_ANSWERED] };
}

export function isUnanswered(result: ScoreResult): boolean {
  return result.traits.length === 0 && result.feedback[0] === NOT_ANSWERED;
}

/** Answered items that carry a score. Self-review speaking (max 0) is not evidence of ability. */
export function scoredItems(results: MockResultItem[]): MockResultItem[] {
  return results.filter((r) => !isUnanswered(r.result) && r.result.max > 0);
}

/** Skill estimates for one mock, weighted by the exam of that mock. Unanswered and unscored items are left out. */
export function mockEstimate(record: MockRecord): ScoreEstimate {
  return estimateScores(
    scoredItems(record.results).map((r) => ({ taskType: r.taskType, percent: r.result.percent, at: record.finishedAt })),
    getExam(record.examId),
  );
}

export interface TaskRow {
  taskType: TaskTypeId;
  code: string;
  name: string;
  answered: number;
  unanswered: number;
  /** 0..1 average over scored items, or null when none were scored. */
  average: number | null;
}

/** Per task type rows, in the order the types appear in the paper. */
export function taskRows(results: MockResultItem[]): TaskRow[] {
  const groups = new Map<TaskTypeId, { answered: number; unanswered: number; percents: number[] }>();
  for (const { taskType, result } of results) {
    const g = groups.get(taskType) ?? { answered: 0, unanswered: 0, percents: [] };
    if (isUnanswered(result)) {
      g.unanswered += 1;
    } else {
      g.answered += 1;
      if (result.max > 0) g.percents.push(result.percent);
    }
    groups.set(taskType, g);
  }
  return [...groups.entries()].map(([taskType, g]) => {
    const spec = getTaskType(taskType);
    return {
      taskType,
      code: spec.code,
      name: spec.name,
      answered: g.answered,
      unanswered: g.unanswered,
      average: g.percents.length === 0 ? null : g.percents.reduce((a, b) => a + b, 0) / g.percents.length,
    };
  });
}

export interface MockSummary {
  estimate: ScoreEstimate;
  answered: number;
  unanswered: number;
  rows: TaskRow[];
}

export function summarizeMock(record: MockRecord): MockSummary {
  const unanswered = record.results.filter((r) => isUnanswered(r.result)).length;
  return {
    estimate: mockEstimate(record),
    answered: record.results.length - unanswered,
    unanswered,
    rows: taskRows(record.results),
  };
}
