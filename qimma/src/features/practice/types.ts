import type { ComponentType } from 'react';

import type { Item, ItemOf, Response, ScoreResult, TaskTypeId } from '@/core';

/**
 * Contract every task renderer implements. A renderer only collects the answer;
 * the PracticePlayer / MockRunner scores it with `scoreItem` and stores the attempt.
 */
export interface RendererProps<T extends Item = Item> {
  item: T;
  /** 'mock' = exam conditions: audio plays once, timers enforced, no hints. */
  mode: 'practice' | 'mock';
  /** Call exactly once with the final answer (via SubmitBar or when a timer/recording ends). */
  onSubmit: (response: Response) => void;
  /** Call on every change so a mock can keep a partial answer if section time runs out. */
  onDraft?: (response: Response) => void;
  /** Present after submission in practice mode; use it to mark right/wrong answers. */
  result?: ScoreResult | null;
}

export type RendererMap = { [K in TaskTypeId]?: ComponentType<RendererProps<ItemOf<K>>> };
