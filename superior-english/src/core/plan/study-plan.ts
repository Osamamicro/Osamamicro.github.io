import type { ScoreEstimate } from '../progress/estimate';
import { examTaskTypes } from '../exams/registry';
import { SKILLS, type ExamSpec, type SkillId, type TaskTypeId } from '../exams/types';

export interface PlanSettings {
  /** Custom overall target, used for every skill when `skillTargets` is absent. */
  targetScore: number;
  /** Per-skill minimums (e.g. a DHA category). */
  skillTargets?: Record<SkillId, number>;
  /** ISO date (yyyy-mm-dd) or null when not booked yet. */
  examDate: string | null;
  dailyMinutes: number;
}

export interface PlanTask {
  taskType: TaskTypeId;
  count: number;
  minutes: number;
  reason: string;
}

export interface DailyPlan {
  daysLeft: number | null;
  /** Skill furthest below its target (or untested). */
  focusSkill: SkillId | null;
  /** Points still needed per skill (0 when met, null when untested). */
  gaps: Record<SkillId, number | null>;
  tasks: PlanTask[];
  vocabReviews: number;
}

/** Rough minutes per practice item, including reviewing the feedback. */
const MINUTES: Partial<Record<TaskTypeId, number>> = {
  'read-aloud': 1.5,
  'repeat-sentence': 0.75,
  'describe-image': 2,
  'retell-lecture': 3,
  'answer-short-question': 0.5,
  'summarize-group-discussion': 5,
  'respond-to-situation': 2,
  'summarize-written-text': 10,
  'write-essay': 20,
  'write-email': 9,
  'summarize-spoken-text': 10,
  'reorder-paragraphs': 2.5,
  'reading-mcma': 2.5,
};

export const minutesPerItem = (t: TaskTypeId) => MINUTES[t] ?? 1.5;

export function daysUntil(examDate: string | null, now: number): number | null {
  if (!examDate) return null;
  const target = new Date(`${examDate}T00:00:00`).getTime();
  if (Number.isNaN(target)) return null;
  return Math.max(0, Math.ceil((target - now) / 86400000));
}

const label = (s: SkillId) => s[0].toUpperCase() + s.slice(1);

/**
 * Picks today's tasks by expected score gain per minute: each task type is valued by
 * its published weight in every skill it feeds, multiplied by how far that skill is
 * below target (untested skills count as a large gap), divided by minutes per item.
 */
export function buildDailyPlan(
  exam: ExamSpec,
  settings: PlanSettings,
  estimate: ScoreEstimate,
  dueVocab: number,
  now: number,
): DailyPlan {
  const targets = settings.skillTargets ?? (Object.fromEntries(SKILLS.map((s) => [s, settings.targetScore])) as Record<SkillId, number>);
  const gaps = Object.fromEntries(
    estimate.skills.map((s) => [s.skill, s.score === null ? null : Math.max(0, targets[s.skill] - s.score)]),
  ) as Record<SkillId, number | null>;
  const pressure = (s: SkillId) => {
    const g = gaps[s];
    return g === null ? 1.5 : 0.25 + Math.min(2, g / 10);
  };

  const ranked = examTaskTypes(exam)
    .map((spec) => {
      const w = exam.weights[spec.id];
      if (!w) return null;
      const value = SKILLS.reduce((sum, s) => sum + (w.skills[s] ?? 0) * pressure(s), 0) / minutesPerItem(spec.id);
      const top = SKILLS.filter((s) => (w.skills[s] ?? 0) > 0).sort((a, b) => (w.skills[b] ?? 0) - (w.skills[a] ?? 0));
      const reason = top.map((s) => `${w.skills[s]}% of ${label(s)}`).join(' · ');
      return { id: spec.id, value, reason };
    })
    .filter((x): x is { id: TaskTypeId; value: number; reason: string } => x !== null && x.value > 0)
    .sort((a, b) => b.value - a.value);

  const days = daysUntil(settings.examDate, now);
  let budget = Math.max(15, settings.dailyMinutes) - Math.min(10, dueVocab * 0.25);
  const tasks: PlanTask[] = [];
  const add = (taskType: TaskTypeId, wanted: number, reason: string) => {
    if (budget < minutesPerItem(taskType) || tasks.some((t) => t.taskType === taskType)) return;
    const count = Math.max(1, Math.min(wanted, Math.floor(budget / minutesPerItem(taskType))));
    budget -= count * minutesPerItem(taskType);
    tasks.push({ taskType, count, minutes: Math.round(count * minutesPerItem(taskType)), reason });
  };

  if (days !== null && days <= 14) {
    const longWriting = (['write-essay', 'write-email'] as TaskTypeId[]).find((t) => exam.weights[t]);
    if (longWriting) add(longWriting, 1, 'Exam is close: keep timed writing sharp');
  }
  // Short tasks get more repetitions; long ones one or two.
  for (const r of ranked.slice(0, 7)) add(r.id, minutesPerItem(r.id) >= 5 ? 1 : minutesPerItem(r.id) >= 2 ? 3 : 6, r.reason);

  const focusSkill =
    estimate.skills.find((s) => s.score === null)?.skill ??
    ([...SKILLS].sort((a, b) => (gaps[b] ?? 0) - (gaps[a] ?? 0)).find((s) => (gaps[s] ?? 0) > 0) ?? null);

  return { daysLeft: days, focusSkill, gaps, tasks, vocabReviews: dueVocab };
}
