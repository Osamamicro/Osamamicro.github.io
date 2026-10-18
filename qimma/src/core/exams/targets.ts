import { SKILLS, type ExamId, type SkillId } from './types';

/** A score goal: either one overall number or a minimum per communicative skill. */
export interface ScoreTarget {
  id: string;
  name: string;
  description: string;
  exams: ExamId[];
  /** Minimum overall score, when the goal sets one. */
  overall?: number;
  /** Minimum per skill. */
  skills?: Record<SkillId, number>;
}

const skills = (reading: number, listening: number, speaking: number, writing: number): Record<SkillId, number> => ({
  reading,
  listening,
  speaking,
  writing,
});

/**
 * Australian Department of Home Affairs English requirements for PTE Academic,
 * effective 7 August 2025 (previously one "each skill" score: 30/36/50/65/79).
 */
export const DHA_2025_TARGETS: ScoreTarget[] = [
  {
    id: 'dha-functional',
    name: 'Functional',
    description: 'Australia (DHA): overall 24.',
    exams: ['pte-academic'],
    overall: 24,
  },
  {
    id: 'dha-vocational',
    name: 'Vocational',
    description: 'Australia (DHA): R33 L36 S24 W29.',
    exams: ['pte-academic'],
    skills: skills(33, 36, 24, 29),
  },
  {
    id: 'dha-competent',
    name: 'Competent',
    description: 'Australia (DHA): R47 L48 S54 W51.',
    exams: ['pte-academic'],
    skills: skills(47, 48, 54, 51),
  },
  {
    id: 'dha-proficient',
    name: 'Proficient',
    description: 'Australia (DHA): R58 L59 S76 W69 — 10 points on the skilled migration test.',
    exams: ['pte-academic'],
    skills: skills(58, 59, 76, 69),
  },
  {
    id: 'dha-superior',
    name: 'Superior',
    description: 'Australia (DHA): R69 L70 S88 W85 — 20 points on the skilled migration test.',
    exams: ['pte-academic'],
    skills: skills(69, 70, 88, 85),
  },
];

export const SCORE_TARGETS: ScoreTarget[] = [...DHA_2025_TARGETS];

export function getTarget(id: string | null | undefined): ScoreTarget | undefined {
  return SCORE_TARGETS.find((t) => t.id === id);
}

/** Per-skill minimums for a preset, or the custom overall number applied to every skill. */
export function resolveSkillTargets(targetId: string | null | undefined, customOverall: number): Record<SkillId, number> {
  const preset = getTarget(targetId);
  if (preset?.skills) return preset.skills;
  const overall = preset?.overall ?? customOverall;
  return Object.fromEntries(SKILLS.map((s) => [s, overall])) as Record<SkillId, number>;
}
