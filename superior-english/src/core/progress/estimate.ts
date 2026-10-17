import { PTE_ACADEMIC } from '../exams/pte';
import { SKILLS, type ExamSpec, type SkillId, type TaskTypeId } from '../exams/types';

export interface AttemptSummary {
  taskType: TaskTypeId;
  /** 0..1 */
  percent: number;
  /** Epoch ms */
  at: number;
}

export interface SkillEstimate {
  skill: SkillId;
  /** 10..90, or null when there is no evidence yet. */
  score: number | null;
  attempts: number;
  /** Share (0..1) of this skill's score weight backed by at least one attempt. */
  coverage: number;
}

export interface ScoreEstimate {
  overall: number | null;
  skills: SkillEstimate[];
  /** Recency-weighted 0..1 performance per task type. */
  byType: Partial<Record<TaskTypeId, { percent: number; attempts: number }>>;
}

/** 0..1 performance → PTE 10..90 scale. Linear, deliberately simple and transparent. */
export const toPteScale = (pct: number) => Math.round(10 + 80 * Math.min(1, Math.max(0, pct)));

/**
 * 1. Per task type: recency-weighted mean of the last 20 attempts (half-life 8 attempts).
 * 2. Per skill: mean of task-type performance weighted by the exam's published share of
 *    that skill (e.g. Describe Image = 31% of Speaking), over task types with evidence.
 * 3. Overall: the same with each task type's overall share.
 */
export function estimateScores(attempts: AttemptSummary[], exam: ExamSpec = PTE_ACADEMIC): ScoreEstimate {
  const grouped = new Map<TaskTypeId, AttemptSummary[]>();
  for (const a of attempts) {
    const list = grouped.get(a.taskType) ?? [];
    list.push(a);
    grouped.set(a.taskType, list);
  }
  const byType: ScoreEstimate['byType'] = {};
  for (const [type, list] of grouped) {
    const recent = [...list].sort((a, b) => b.at - a.at).slice(0, 20);
    let w = 0;
    let v = 0;
    recent.forEach((a, i) => {
      const decay = 0.5 ** (i / 8);
      w += decay;
      v += decay * a.percent;
    });
    byType[type] = { percent: v / w, attempts: list.length };
  }

  const weighted = (weightOf: (t: TaskTypeId) => number) => {
    let total = 0;
    let covered = 0;
    let value = 0;
    let n = 0;
    for (const [type, weight] of Object.entries(exam.weights) as [TaskTypeId, NonNullable<ExamSpec['weights'][TaskTypeId]>][]) {
      const share = weightOf(type);
      if (!weight || share <= 0) continue;
      total += share;
      const perf = byType[type];
      if (!perf) continue;
      covered += share;
      value += share * perf.percent;
      n += perf.attempts;
    }
    return { pct: covered === 0 ? null : value / covered, coverage: total === 0 ? 0 : covered / total, attempts: n };
  };

  const skills = SKILLS.map((skill) => {
    const r = weighted((t) => exam.weights[t]?.skills[skill] ?? 0);
    return { skill, score: r.pct === null ? null : toPteScale(r.pct), attempts: r.attempts, coverage: r.coverage };
  });
  const overall = weighted((t) => exam.weights[t]?.overall ?? 0);
  return { overall: overall.pct === null ? null : toPteScale(overall.pct), skills, byType };
}

/** Consecutive days (ending today or yesterday) with at least one attempt. */
export function streakDays(attempts: AttemptSummary[], now: number): number {
  const dayKey = (t: number) => {
    const d = new Date(t);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };
  const days = new Set(attempts.map((a) => dayKey(a.at)));
  const DAY = 86400000;
  let cursor = now;
  if (!days.has(dayKey(cursor))) cursor -= DAY;
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor -= DAY;
  }
  return streak;
}
