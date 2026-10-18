import { describe, expect, it } from 'vitest';

import {
  assembleMock,
  type ExamId,
  type Item,
  getExam,
  getTaskType,
  itemFitsExam,
  mulberry32,
  shuffle,
  type TaskTypeId,
} from '@/core';

/** Minimal item stubs: the assembler only looks at id, type and exams. */
function make(type: TaskTypeId, n: number, exams?: ExamId[]): Item[] {
  return Array.from({ length: n }, (_, i) => ({ id: `${type}-${i}`, title: type, difficulty: 1, type, exams }) as unknown as Item);
}

/** Enough items of every blueprint type to fill the largest possible paper, plus spares. */
function fullBank(examId: ExamId): Item[] {
  const exam = getExam(examId);
  return Object.entries(exam.blueprint).flatMap(([type, range]) => make(type as TaskTypeId, range![1] + 5));
}

const academic = getExam('pte-academic');
const core = getExam('pte-core');

describe('assembleMock: full paper', () => {
  it('rebuilds the same paper for the same seed', () => {
    const bank = fullBank('pte-academic');
    const first = assembleMock(academic, bank, 'full', 42);
    expect(assembleMock(academic, bank, 'full', 42)).toEqual(first);
    expect(first.id).toBe('pte-academic-full-42');
    expect(first.kind).toBe('full');
  });

  it('keeps every task count inside the blueprint range, for many seeds', () => {
    const bank = fullBank('pte-academic');
    for (let seed = 1; seed <= 20; seed++) {
      const mock = assembleMock(academic, bank, 'full', seed);
      for (const section of mock.sections) {
        const specSection = academic.sections.find((s) => s.id === section.id)!;
        for (const type of specSection.taskTypes) {
          const [min, max] = academic.blueprint[type]!;
          const n = section.items.filter((i) => i.type === type).length;
          expect(n, `seed ${seed} ${type}`).toBeGreaterThanOrEqual(min);
          expect(n, `seed ${seed} ${type}`).toBeLessThanOrEqual(max);
        }
      }
    }
  });

  it('uses the whole bank when it is smaller than the blueprint range', () => {
    const bank = [...make('read-aloud', 1), ...make('write-essay', 1)];
    const mock = assembleMock(academic, bank, 'full', 5);
    const items = mock.sections.flatMap((s) => s.items);
    expect(items.filter((i) => i.type === 'read-aloud')).toHaveLength(1);
    expect(items.filter((i) => i.type === 'write-essay')).toHaveLength(1);
    expect(items).toHaveLength(2);
  });

  it('gives each section its full timing', () => {
    const mock = assembleMock(academic, fullBank('pte-academic'), 'full', 9);
    expect(mock.sections.map((s) => [s.id, s.minutes])).toEqual(academic.sections.map((s) => [s.id, s.minutes]));
  });

  it('never picks items tagged for the other exam', () => {
    const bank = [...make('read-aloud', 10, ['pte-core']), ...make('read-aloud', 10, ['pte-academic'])];
    const mock = assembleMock(academic, bank, 'full', 3);
    const picked = mock.sections.flatMap((s) => s.items);
    expect(picked.length).toBeGreaterThan(0);
    for (const item of picked) expect(itemFitsExam(item, 'pte-academic')).toBe(true);
    expect(picked.every((i) => i.exams?.includes('pte-academic') ?? true)).toBe(true);
  });

  it('puts only a section’s own task types in that section (PTE Core)', () => {
    const mock = assembleMock(core, fullBank('pte-core'), 'full', 11);
    for (const section of mock.sections) {
      const allowed = core.sections.find((s) => s.id === section.id)!.taskTypes;
      for (const item of section.items) expect(allowed).toContain(item.type);
    }
    // Write Essay is Academic-only, so it must not appear in a Core paper.
    expect(mock.sections.flatMap((s) => s.items).some((i) => i.type === 'write-essay')).toBe(false);
  });
});

describe('assembleMock: mini paper', () => {
  it('keeps about a third of each count (at least one)', () => {
    const mock = assembleMock(academic, fullBank('pte-academic'), 'mini', 8);
    for (const section of academic.sections) {
      const built = mock.sections.find((s) => s.id === section.id)!;
      for (const type of section.taskTypes) {
        const [min, max] = academic.blueprint[type]!;
        const low = Math.max(1, Math.round(min / 3));
        const high = Math.max(1, Math.round(max / 3));
        const n = built.items.filter((i) => i.type === type).length;
        expect(n, type).toBeGreaterThanOrEqual(low);
        expect(n, type).toBeLessThanOrEqual(high);
      }
    }
  });

  it('is smaller than the full paper built from the same bank and seed', () => {
    const bank = fullBank('pte-academic');
    const count = (m: ReturnType<typeof assembleMock>) => m.sections.reduce((n, s) => n + s.items.length, 0);
    expect(count(assembleMock(academic, bank, 'mini', 8))).toBeLessThan(count(assembleMock(academic, bank, 'full', 8)));
  });

  it('shortens each section but keeps it between 5 minutes and the full time', () => {
    const mock = assembleMock(academic, fullBank('pte-academic'), 'mini', 8);
    for (const section of mock.sections) {
      const spec = academic.sections.find((s) => s.id === section.id)!;
      expect(section.minutes).toBeGreaterThanOrEqual(5);
      expect(section.minutes).toBeLessThan(spec.minutes);
    }
  });
});

describe('assembleMock: single-section paper', () => {
  it('builds only the requested section', () => {
    const mock = assembleMock(academic, fullBank('pte-academic'), 'reading', 2);
    expect(mock.kind).toBe('reading');
    expect(mock.id).toBe('pte-academic-reading-2');
    expect(mock.sections.map((s) => s.id)).toEqual(['reading']);
  });

  it('contains only reading task types, within their ranges, at full time', () => {
    const mock = assembleMock(academic, fullBank('pte-academic'), 'reading', 2);
    const section = mock.sections[0];
    const readingTypes = academic.sections.find((s) => s.id === 'reading')!.taskTypes;
    expect(section.minutes).toBe(30);
    for (const item of section.items) {
      expect(readingTypes).toContain(item.type);
      expect(getTaskType(item.type).section).toBe('reading');
    }
    for (const type of readingTypes) {
      const [min, max] = academic.blueprint[type]!;
      const n = section.items.filter((i) => i.type === type).length;
      expect(n).toBeGreaterThanOrEqual(min);
      expect(n).toBeLessThanOrEqual(max);
    }
  });

  it('works for a Core listening section', () => {
    const mock = assembleMock(core, fullBank('pte-core'), 'listening', 4);
    expect(mock.sections.map((s) => s.id)).toEqual(['listening']);
    expect(mock.sections[0].items.every((i) => getTaskType(i.type).section === 'listening')).toBe(true);
  });
});

describe('mock helpers', () => {
  it('itemFitsExam treats untagged items as fitting every exam', () => {
    const [untagged] = make('read-aloud', 1);
    const [coreOnly] = make('write-email', 1, ['pte-core']);
    expect(itemFitsExam(untagged, 'pte-academic')).toBe(true);
    expect(itemFitsExam(coreOnly, 'pte-core')).toBe(true);
    expect(itemFitsExam(coreOnly, 'pte-academic')).toBe(false);
  });

  it('shuffle keeps the same members and leaves its input alone', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const out = shuffle(input, mulberry32(3));
    expect([...out].sort((a, b) => a - b)).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('mulberry32 gives the same sequence for the same seed, values in [0, 1)', () => {
    const a = mulberry32(99);
    const b = mulberry32(99);
    const seqA = Array.from({ length: 5 }, () => a());
    expect(seqA).toEqual(Array.from({ length: 5 }, () => b()));
    expect(seqA.every((v) => v >= 0 && v < 1)).toBe(true);
  });

  it('different seeds give different paper orders', () => {
    const bank = fullBank('pte-academic');
    const first = (seed: number) => assembleMock(academic, bank, 'full', seed).sections[0].items.map((i) => i.id);
    expect(first(1)).not.toEqual(first(2));
  });
});
