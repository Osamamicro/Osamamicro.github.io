import { describe, expect, it } from 'vitest';

import { DHA_2025_TARGETS, getTarget, resolveSkillTargets, SCORE_TARGETS, type SkillId } from '@/core';

const SKILLS: SkillId[] = ['speaking', 'writing', 'reading', 'listening'];

describe('resolveSkillTargets', () => {
  it('returns the DHA Superior per-skill minimums', () => {
    expect(resolveSkillTargets('dha-superior', 65)).toEqual({ reading: 69, listening: 70, speaking: 88, writing: 85 });
  });

  it('applies a custom overall score to every skill when no preset is chosen', () => {
    expect(resolveSkillTargets(null, 65)).toEqual({ speaking: 65, writing: 65, reading: 65, listening: 65 });
    expect(resolveSkillTargets(undefined, 50)).toEqual({ speaking: 50, writing: 50, reading: 50, listening: 50 });
  });

  it('applies the custom score when the id is unknown', () => {
    expect(resolveSkillTargets('no-such-target', 58)).toEqual({ speaking: 58, writing: 58, reading: 58, listening: 58 });
  });

  it('uses the single overall minimum of an overall-only preset', () => {
    // Functional (DHA): overall 24 beats the custom number for every skill.
    expect(resolveSkillTargets('dha-functional', 65)).toEqual({ speaking: 24, writing: 24, reading: 24, listening: 24 });
  });

  it('returns one entry for each of the four skills', () => {
    for (const target of SCORE_TARGETS) {
      expect(Object.keys(resolveSkillTargets(target.id, 65)).sort()).toEqual([...SKILLS].sort());
    }
  });
});

describe('DHA 2025 score targets', () => {
  it('lists the five categories in order', () => {
    expect(DHA_2025_TARGETS.map((t) => t.id)).toEqual([
      'dha-functional',
      'dha-vocational',
      'dha-competent',
      'dha-proficient',
      'dha-superior',
    ]);
  });

  it('makes each category at least as demanding as the one below it, on every skill', () => {
    const skillTargets = DHA_2025_TARGETS.filter((t) => t.skills);
    for (let i = 1; i < skillTargets.length; i++) {
      for (const skill of SKILLS) {
        expect(skillTargets[i].skills![skill], `${skillTargets[i].id} ${skill}`).toBeGreaterThanOrEqual(
          skillTargets[i - 1].skills![skill],
        );
      }
    }
  });

  it('keeps every target inside the PTE 10..90 scale', () => {
    for (const target of DHA_2025_TARGETS) {
      const values = target.skills ? Object.values(target.skills) : [target.overall!];
      for (const v of values) {
        expect(v).toBeGreaterThanOrEqual(10);
        expect(v).toBeLessThanOrEqual(90);
      }
    }
  });

  it('is only for PTE Academic', () => {
    for (const target of DHA_2025_TARGETS) expect(target.exams).toEqual(['pte-academic']);
  });

  it('finds a preset by id and returns undefined for anything else', () => {
    expect(getTarget('dha-proficient')?.skills).toEqual({ reading: 58, listening: 59, speaking: 76, writing: 69 });
    expect(getTarget('dha-proficient')?.name).toBe('Proficient');
    expect(getTarget('missing')).toBeUndefined();
    expect(getTarget(null)).toBeUndefined();
  });
});
