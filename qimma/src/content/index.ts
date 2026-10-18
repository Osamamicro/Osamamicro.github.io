import type { Item, ItemOf, TaskTypeId } from '@/core';
import { guides } from './guides';
import { listeningItems } from './listening';
import { readingItems } from './reading';
import { speakingItems } from './speaking';
import { vocabEntries } from './vocab';
import { writingItems } from './writing';

export const ALL_ITEMS: Item[] = [...speakingItems, ...writingItems, ...readingItems, ...listeningItems];

const byId = new Map(ALL_ITEMS.map((i) => [i.id, i]));

export function getItem(id: string): Item | undefined {
  return byId.get(id);
}

export function itemsOfType<T extends TaskTypeId>(type: T): ItemOf<T>[] {
  return ALL_ITEMS.filter((i): i is ItemOf<T> => i.type === type);
}

export function countByType(): Partial<Record<TaskTypeId, number>> {
  const counts: Partial<Record<TaskTypeId, number>> = {};
  for (const i of ALL_ITEMS) counts[i.type] = (counts[i.type] ?? 0) + 1;
  return counts;
}

export function guideFor(type: TaskTypeId) {
  return guides.find((g) => g.taskType === type);
}

export { guides, vocabEntries };
