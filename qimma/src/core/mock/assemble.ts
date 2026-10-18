import type { Item } from '../content/types';
import type { ExamSpec, SectionId, TaskTypeId } from '../exams/types';

export interface MockSection {
  id: SectionId;
  name: string;
  minutes: number;
  items: Item[];
}

export interface MockTest {
  id: string;
  examId: ExamSpec['id'];
  kind: 'full' | 'mini' | SectionId;
  seed: number;
  sections: MockSection[];
}

/** Small deterministic PRNG so a mock id always rebuilds the same paper. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(list: readonly T[], rand: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function itemFitsExam(item: Item, examId: ExamSpec['id']): boolean {
  return item.exams === undefined || item.exams.includes(examId);
}

/**
 * Builds a mock paper from the bank following the exam blueprint. A full mock picks a
 * count inside each task type's real [min, max] range; `mini` keeps about a third (min 1);
 * a section kind builds only that section. A small bank simply yields fewer items.
 */
export function assembleMock(exam: ExamSpec, bank: Item[], kind: MockTest['kind'], seed: number): MockTest {
  const rand = mulberry32(seed);
  const byType = new Map<TaskTypeId, Item[]>();
  for (const item of bank) {
    if (!itemFitsExam(item, exam.id)) continue;
    const list = byType.get(item.type) ?? [];
    list.push(item);
    byType.set(item.type, list);
  }
  const sections = exam.sections
    .filter((s) => kind === 'full' || kind === 'mini' || kind === s.id)
    .map((section) => {
      const items: Item[] = [];
      let planned = 0;
      let maxPlanned = 0;
      for (const type of section.taskTypes) {
        const [min, max] = exam.blueprint[type] ?? [0, 0];
        const full = min + Math.floor(rand() * (max - min + 1));
        const count = kind === 'mini' ? Math.max(1, Math.round(full / 3)) : full;
        planned += count;
        maxPlanned += max;
        items.push(...shuffle(byType.get(type) ?? [], rand).slice(0, count));
      }
      const minutes =
        kind === 'mini' ? Math.max(5, Math.round((section.minutes * planned) / Math.max(maxPlanned, 1))) : section.minutes;
      return { id: section.id, name: section.name, minutes, items };
    });
  return { id: `${exam.id}-${kind}-${seed}`, examId: exam.id, kind, seed, sections };
}
