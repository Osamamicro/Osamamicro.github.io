import { assembleMock, type ExamSpec, type Item, type MockTest, type SectionId } from '@/core';

export type MockKind = MockTest['kind'];

export const MOCK_KINDS: readonly MockKind[] = ['full', 'mini', 'speaking-writing', 'reading', 'listening'];

const TITLES: Record<MockKind, string> = {
  full: 'Full mock test',
  mini: 'Mini mock test',
  'speaking-writing': 'Speaking & Writing',
  reading: 'Reading',
  listening: 'Listening',
};

export function isMockKind(value: string | undefined): value is MockKind {
  return (MOCK_KINDS as readonly string[]).includes(value ?? '');
}

/** Human title for a stored mock kind. Unknown kinds are shown as they are. */
export function mockTitle(kind: string): string {
  return isMockKind(kind) ? TITLES[kind] : kind;
}

/** A fresh seed per run, so each mock paper differs. */
export const newSeed = (): number => Math.floor(Math.random() * 2 ** 31);

export function formatMockDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export interface MockPlanSection {
  id: SectionId;
  name: string;
  /** Time limit the runner counts down from (upper bound for whole and section mocks). */
  minutes: number;
  /** Lower bound of the real section time; null for a mini mock, which is sized from its own items. */
  minMinutes: number | null;
  items: number;
}

export interface MockPlan {
  kind: MockKind;
  sections: MockPlanSection[];
  minutes: number;
  minMinutes: number | null;
  items: number;
}

/** Section sizes and timings for a mock kind, from the same blueprint the runner uses. */
export function planMock(exam: ExamSpec, bank: Item[], kind: MockKind): MockPlan {
  const paper = assembleMock(exam, bank, kind, 1);
  const sections: MockPlanSection[] = paper.sections.map((s) => {
    const spec = exam.sections.find((x) => x.id === s.id);
    return {
      id: s.id,
      name: s.name,
      minutes: s.minutes,
      minMinutes: kind === 'mini' ? null : (spec?.minMinutes ?? null),
      items: s.items.length,
    };
  });
  const bounded = kind !== 'mini' && sections.every((s) => s.minMinutes !== null);
  return {
    kind,
    sections,
    minutes: sections.reduce((sum, s) => sum + s.minutes, 0),
    minMinutes: bounded ? sections.reduce((sum, s) => sum + (s.minMinutes ?? 0), 0) : null,
    items: sections.reduce((sum, s) => sum + s.items, 0),
  };
}

/** "54–84 min" when the exam gives a range, otherwise "~40 min". */
export function timeLabel(minMinutes: number | null, minutes: number): string {
  return minMinutes === null ? `~${minutes} min` : `${minMinutes}–${minutes} min`;
}
