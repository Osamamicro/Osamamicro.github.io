import type { ExamId, Grade, Item, Response, ScoreResult, SkillId, SrsCard, TaskTypeId } from '@/core';
import { getTarget, newCard, resolveSkillTargets, review } from '@/core';

import { createStore } from './storage';

export interface Settings {
  examId: ExamId;
  /** Preset goal id (e.g. 'dha-superior'), or null for a custom overall target. */
  targetId: string | null;
  /** Custom overall target (used when targetId is null). */
  targetScore: number;
  examDate: string | null;
  dailyMinutes: number;
  /** Exam mode: audio plays once, timers enforced, no spellcheck. */
  examMode: boolean;
  /** TTS speaking rate multiplier for listening prompts. */
  speechRate: number;
  onboarded: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  examId: 'pte-academic',
  targetId: null,
  targetScore: 65,
  examDate: null,
  dailyMinutes: 45,
  examMode: false,
  speechRate: 1,
  onboarded: false,
};

export interface Attempt {
  id: string;
  itemId: string;
  taskType: TaskTypeId;
  at: number;
  total: number;
  max: number;
  percent: number;
  estimated: boolean;
  /** Optional mock-test id when the attempt was part of a mock. */
  mockId?: string;
}

export interface MockRecord {
  id: string;
  examId: ExamId;
  kind: string;
  startedAt: number;
  finishedAt: number;
  results: { itemId: string; taskType: TaskTypeId; result: ScoreResult }[];
}

export const settingsStore = createStore<Settings>('settings', DEFAULT_SETTINGS);
export const attemptsStore = createStore<Attempt[]>('attempts', []);
export const vocabStore = createStore<Record<string, SrsCard>>('vocab-srs', {});
export const bookmarksStore = createStore<string[]>('bookmarks', []);
export const mocksStore = createStore<MockRecord[]>('mocks', []);

const MAX_ATTEMPTS = 2000;

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function updateSettings(patch: Partial<Settings>) {
  settingsStore.update((s) => ({ ...DEFAULT_SETTINGS, ...s, ...patch }));
}

/** Switches exam and drops a goal preset that does not apply to the new exam. */
export function selectExam(examId: ExamId) {
  const current = { ...DEFAULT_SETTINGS, ...settingsStore.get() };
  const preset = getTarget(current.targetId);
  updateSettings({ examId, targetId: preset && !preset.exams.includes(examId) ? null : current.targetId });
}

export function useSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...settingsStore.use() };
}

/** Per-skill minimums for the learner's goal (preset or custom). */
export function skillTargets(settings: Settings): Record<SkillId, number> {
  return resolveSkillTargets(settings.targetId, settings.targetScore);
}

export function recordAttempt(item: Item, _response: Response, result: ScoreResult, mockId?: string): Attempt {
  const attempt: Attempt = {
    id: uid(),
    itemId: item.id,
    taskType: item.type,
    at: Date.now(),
    total: result.total,
    max: result.max,
    percent: result.percent,
    estimated: result.estimated,
    mockId,
  };
  // Self-review speaking attempts without any score are not evidence of ability.
  if (result.max > 0) attemptsStore.update((list) => [attempt, ...list].slice(0, MAX_ATTEMPTS));
  return attempt;
}

export function reviewWord(id: string, grade: Grade) {
  const now = Date.now();
  vocabStore.update((cards) => ({ ...cards, [id]: review(cards[id] ?? newCard(now), grade, now) }));
}

export function toggleBookmark(itemId: string) {
  bookmarksStore.update((list) => (list.includes(itemId) ? list.filter((i) => i !== itemId) : [itemId, ...list]));
}

export function saveMock(record: MockRecord) {
  mocksStore.update((list) => [record, ...list].slice(0, 50));
}

export function resetAllData() {
  settingsStore.set(DEFAULT_SETTINGS);
  attemptsStore.set([]);
  vocabStore.set({});
  bookmarksStore.set([]);
  mocksStore.set([]);
}
