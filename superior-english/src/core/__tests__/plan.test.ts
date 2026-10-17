import { describe, expect, it } from 'vitest';

import {
  buildDailyPlan,
  daysUntil,
  getExam,
  getTaskType,
  minutesPerItem,
  type PlanSettings,
  type PlanTask,
  resolveSkillTargets,
  type ScoreEstimate,
  type SkillId,
  type TaskTypeId,
} from '@/core';
import { SKILLS } from '@/core/exams/types';

const DAY = 86400000;
const academic = getExam('pte-academic');
const core = getExam('pte-core');
const NOW = new Date(2026, 9, 10, 12).getTime();
const ROTATION = 'Weekly rotation: timed practice of a long task';

/** No attempts yet: every skill is untested. */
const untested = (): ScoreEstimate => ({
  overall: null,
  skills: SKILLS.map((skill) => ({ skill, score: null, attempts: 0, coverage: 0 })),
  byType: {},
});

/** Every skill has a score; the map sets each one. */
const scored = (scores: Record<SkillId, number>): ScoreEstimate => ({
  overall: 70,
  skills: SKILLS.map((skill) => ({ skill, score: scores[skill], attempts: 5, coverage: 1 })),
  byType: {},
});

const settings = (over: Partial<PlanSettings> = {}): PlanSettings => ({
  targetScore: 65,
  examDate: null,
  dailyMinutes: 60,
  ...over,
});

const minutesOf = (tasks: PlanTask[]) => tasks.reduce((sum, t) => sum + t.count * minutesPerItem(t.taskType), 0);
const rotationOf = (tasks: PlanTask[]) => tasks.find((t) => t.reason === ROTATION);

describe('daysUntil', () => {
  it('is null when no exam is booked or the date is invalid', () => {
    expect(daysUntil(null, NOW)).toBeNull();
    expect(daysUntil('not-a-date', NOW)).toBeNull();
  });

  it('counts whole days to the exam date', () => {
    expect(daysUntil('2026-10-20', NOW)).toBe(10);
    expect(daysUntil('2026-10-11', NOW)).toBe(1);
  });

  it('is zero on the exam day and after it', () => {
    expect(daysUntil('2026-10-10', NOW)).toBe(0);
    expect(daysUntil('2026-09-01', NOW)).toBe(0);
  });
});

describe('minutesPerItem', () => {
  it('uses the per-item estimates for known task types', () => {
    expect(minutesPerItem('repeat-sentence')).toBe(0.75);
    expect(minutesPerItem('describe-image')).toBe(2);
    expect(minutesPerItem('write-essay')).toBe(20);
  });

  it('falls back to 1.5 minutes for task types without an estimate', () => {
    expect(minutesPerItem('rw-fill-blanks')).toBe(1.5);
  });
});

describe('buildDailyPlan: order of tasks', () => {
  it('opens with the Describe Image anchor, then one rotation task, then the top-ranked task', () => {
    const plan = buildDailyPlan(academic, settings(), untested(), 0, NOW);
    expect(plan.tasks[0]).toMatchObject({ taskType: 'describe-image', count: 2, reason: '31% of Speaking — practise daily' });
    expect(plan.tasks[1].reason).toBe(ROTATION);
    // Repeat Sentence has the most value per minute: Speaking 16% + Listening 17% at 0.75 min.
    expect(plan.tasks[2].taskType).toBe('repeat-sentence');
  });

  it('never repeats a task type', () => {
    const types = buildDailyPlan(academic, settings(), untested(), 0, NOW).tasks.map((t) => t.taskType);
    expect(new Set(types).size).toBe(types.length);
  });

  it('gives each ranked task a reason naming the skills it feeds', () => {
    const plan = buildDailyPlan(academic, settings(), untested(), 0, NOW);
    const rs = plan.tasks.find((t) => t.taskType === 'repeat-sentence')!;
    expect(rs.reason).toBe('17% of Listening · 16% of Speaking');
  });

  it('keeps within the daily minutes', () => {
    for (const dailyMinutes of [15, 30, 60, 90]) {
      const plan = buildDailyPlan(academic, settings({ dailyMinutes }), untested(), 0, NOW);
      expect(minutesOf(plan.tasks), `dailyMinutes ${dailyMinutes}`).toBeLessThanOrEqual(dailyMinutes);
    }
  });

  it('sets aside time for vocabulary reviews', () => {
    // 40 due cards take 10 minutes, leaving 5 of a 15-minute budget.
    const plan = buildDailyPlan(academic, settings({ dailyMinutes: 15 }), untested(), 40, NOW);
    expect(plan.vocabReviews).toBe(40);
    expect(minutesOf(plan.tasks)).toBeLessThanOrEqual(5);
  });

  it('works for PTE Core and uses its own task types', () => {
    const plan = buildDailyPlan(core, settings(), untested(), 0, NOW);
    const coreTypes = core.sections.flatMap((s) => s.taskTypes);
    expect(plan.tasks.length).toBeGreaterThan(0);
    for (const t of plan.tasks) expect(coreTypes).toContain(t.taskType);
  });
});

describe('buildDailyPlan: Describe Image anchor', () => {
  it('adds two Describe Image tasks a day while speaking is below target', () => {
    const plan = buildDailyPlan(academic, settings(), scored({ speaking: 60, writing: 90, reading: 90, listening: 90 }), 0, NOW);
    expect(plan.tasks[0]).toMatchObject({ taskType: 'describe-image', count: 2, reason: '31% of Speaking — practise daily' });
  });

  it('drops the anchor once the speaking target is met', () => {
    const plan = buildDailyPlan(academic, settings(), scored({ speaking: 70, writing: 90, reading: 90, listening: 90 }), 0, NOW);
    expect(plan.tasks.some((t) => t.reason.includes('practise daily'))).toBe(false);
  });
});

describe('buildDailyPlan: weekly rotation of long tasks', () => {
  it('adds one long task a day and covers every long task the exam has within a cycle', () => {
    const picked = Array.from({ length: 5 }, (_, k) =>
      rotationOf(buildDailyPlan(academic, settings(), untested(), 0, NOW + k * DAY).tasks)?.taskType,
    );
    expect([...picked].sort()).toEqual([
      'retell-lecture',
      'summarize-group-discussion',
      'summarize-spoken-text',
      'summarize-written-text',
      'write-essay',
    ]);
  });

  it('repeats the same long task after a full cycle (day k and day k + 5)', () => {
    const day0 = rotationOf(buildDailyPlan(academic, settings(), untested(), 0, NOW).tasks);
    const day5 = rotationOf(buildDailyPlan(academic, settings(), untested(), 0, NOW + 5 * DAY).tasks);
    expect(day5?.taskType).toBe(day0?.taskType);
  });

  it('uses only the long tasks PTE Core has', () => {
    const picked = Array.from({ length: 3 }, (_, k) =>
      rotationOf(buildDailyPlan(core, settings(), untested(), 0, NOW + k * DAY).tasks)?.taskType,
    );
    expect([...picked].sort()).toEqual(['summarize-spoken-text', 'summarize-written-text', 'write-email']);
  });

  it('is skipped when the time left in the budget is too small for it', () => {
    // 15 minutes less 10 for 40 due cards leaves 5: two Describe Image items use it up.
    const plan = buildDailyPlan(academic, settings({ dailyMinutes: 15 }), untested(), 40, NOW);
    expect(rotationOf(plan.tasks)).toBeUndefined();
  });
});

describe('buildDailyPlan: focus and gaps', () => {
  it('focuses on an untested skill first', () => {
    const plan = buildDailyPlan(academic, settings(), untested(), 0, NOW);
    expect(plan.focusSkill).toBe('speaking');
    expect(plan.gaps).toEqual({ speaking: null, writing: null, reading: null, listening: null });
  });

  it('measures gaps against per-skill DHA targets and focuses the largest', () => {
    const estimate = scored({ speaking: 80, writing: 80, reading: 50, listening: 80 });
    const plan = buildDailyPlan(academic, settings({ skillTargets: resolveSkillTargets('dha-superior', 65) }), estimate, 0, NOW);
    // Superior targets: R69 L70 S88 W85.
    expect(plan.gaps).toEqual({ reading: 19, listening: 0, speaking: 8, writing: 5 });
    expect(plan.focusSkill).toBe('reading');
  });

  it('uses the custom overall target for every skill when no skill targets are given', () => {
    const plan = buildDailyPlan(academic, settings({ targetScore: 65 }), scored({ speaking: 60, writing: 60, reading: 60, listening: 60 }), 0, NOW);
    expect(plan.gaps).toEqual({ speaking: 5, writing: 5, reading: 5, listening: 5 });
  });

  it('reports no focus once every skill meets its target', () => {
    const plan = buildDailyPlan(academic, settings(), scored({ speaking: 70, writing: 70, reading: 70, listening: 70 }), 0, NOW);
    expect(plan.focusSkill).toBeNull();
    expect(plan.gaps).toEqual({ speaking: 0, writing: 0, reading: 0, listening: 0 });
  });

  it('puts the ranked reading tasks right after the anchors when reading is the weak skill', () => {
    const estimate = scored({ speaking: 90, writing: 90, reading: 10, listening: 90 });
    const plan = buildDailyPlan(academic, settings(), estimate, 0, NOW);
    expect(plan.focusSkill).toBe('reading');
    // Speaking target is met, so there is no Describe Image anchor either.
    expect(plan.tasks.some((t) => t.reason.includes('practise daily'))).toBe(false);
    const ranked = plan.tasks.filter((t) => t.reason !== ROTATION);
    expect(ranked.slice(0, 2).map((t) => t.taskType)).toEqual(['rw-fill-blanks', 'reading-fill-blanks']);
    for (const t of ranked.slice(0, 2)) expect(getTaskType(t.taskType).skills.reading).toBeGreaterThan(0);
  });
});

describe('buildDailyPlan: exam close', () => {
  it('adds one timed essay first when the exam is within two weeks', () => {
    const plan = buildDailyPlan(academic, settings({ examDate: '2026-10-20' }), untested(), 0, NOW);
    expect(plan.daysLeft).toBe(10);
    expect(plan.tasks[0]).toMatchObject({ taskType: 'write-essay', count: 1, reason: 'Exam is close: keep timed writing sharp' });
  });

  it('adds the Core writing task (Write Email) for PTE Core', () => {
    const plan = buildDailyPlan(core, settings({ examDate: '2026-10-20' }), untested(), 0, NOW);
    expect(plan.tasks[0]).toMatchObject({ taskType: 'write-email', count: 1 });
  });

  it('does not add it when the exam is further away or not booked', () => {
    const far = buildDailyPlan(academic, settings({ examDate: '2027-06-01' }), untested(), 0, NOW);
    const none = buildDailyPlan(academic, settings(), untested(), 0, NOW);
    for (const plan of [far, none]) expect(plan.tasks.some((t) => t.reason.startsWith('Exam is close'))).toBe(false);
  });
});

describe('the exam spec the plan relies on', () => {
  it('gives every task type in both exams a weight', () => {
    for (const exam of [academic, core]) {
      for (const section of exam.sections) {
        for (const type of section.taskTypes as TaskTypeId[]) expect(exam.weights[type], `${exam.id} ${type}`).toBeDefined();
      }
    }
  });

  it('keeps every blueprint range valid (min <= max)', () => {
    for (const exam of [academic, core]) {
      for (const [type, range] of Object.entries(exam.blueprint)) {
        expect(range![0], `${exam.id} ${type}`).toBeLessThanOrEqual(range![1]);
      }
    }
  });
});
