import { useMemo } from 'react';

import { estimateScores, getExam, type TaskTypeId } from '@/core';
import { attemptsStore, settingsStore, type Attempt } from '@/services/app-state';

export interface TypeStats {
  attempts: number;
  average: number | null;
  /** Best percent per item id. */
  best: Record<string, number>;
}

export function statsByType(attempts: Attempt[]): Partial<Record<TaskTypeId, TypeStats>> {
  const out: Partial<Record<TaskTypeId, TypeStats>> = {};
  for (const a of attempts) {
    const s = (out[a.taskType] ??= { attempts: 0, average: null, best: {} });
    s.average = ((s.average ?? 0) * s.attempts + a.percent) / (s.attempts + 1);
    s.attempts += 1;
    s.best[a.itemId] = Math.max(s.best[a.itemId] ?? 0, a.percent);
  }
  return out;
}

export function useAttempts() {
  return attemptsStore.use();
}

/** Score estimate using the current exam's published question-type weighting. */
export function useEstimate() {
  const attempts = useAttempts();
  const examId = settingsStore.use().examId ?? 'pte-academic';
  return useMemo(() => estimateScores(attempts, getExam(examId)), [attempts, examId]);
}

export function useTypeStats() {
  const attempts = useAttempts();
  return useMemo(() => statsByType(attempts), [attempts]);
}
