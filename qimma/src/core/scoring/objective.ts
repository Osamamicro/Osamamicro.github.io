import type { Option, ScoreResult } from '../content/types';
import { tokenize } from './text';

/** Builds a result for rule-scored (objective) tasks: one "Correct" trait. */
export function objectiveResult(score: number, max: number, feedback: string[], answer?: string): ScoreResult {
  const total = Math.max(0, Math.min(score, max));
  return {
    traits: [{ id: 'correct', label: 'Correct', score: total, max }],
    total,
    max,
    percent: max === 0 ? 0 : total / max,
    estimated: false,
    feedback,
    answer,
  };
}

const optionText = (options: Option[], ids: string[]) =>
  ids.map((id) => options.find((o) => o.id === id)?.text ?? id).join(' | ');

/** Single answer: 1 or 0. Used by MCSA (reading/listening), HCS and SMW. */
export function scoreSingleChoice(options: Option[], answer: string, selected: string[]): ScoreResult {
  const correct = selected.length === 1 && selected[0] === answer;
  return objectiveResult(correct ? 1 : 0, 1, [correct ? 'Correct.' : 'Not quite.'], optionText(options, [answer]));
}

/** Multiple answers: +1 per correct option, −1 per incorrect option, floor 0. */
export function scoreMultipleChoice(options: Option[], answers: string[], selected: string[]): ScoreResult {
  const unique = [...new Set(selected)];
  const right = unique.filter((s) => answers.includes(s)).length;
  const wrong = unique.length - right;
  const feedback = [`${right} correct, ${wrong} incorrect selection${wrong === 1 ? '' : 's'}.`];
  if (wrong > 0) feedback.push('Each wrong choice subtracts a point — only pick options you are sure about.');
  return objectiveResult(right - wrong, answers.length, feedback, optionText(options, answers));
}

/** Re-order paragraphs: 1 point per correct adjacent pair. */
export function scoreReorder(correctOrder: string[], order: string[]): ScoreResult {
  const pairs = new Set<string>();
  for (let i = 0; i + 1 < correctOrder.length; i++) pairs.add(`${correctOrder[i]}>${correctOrder[i + 1]}`);
  let score = 0;
  for (let i = 0; i + 1 < order.length; i++) if (pairs.has(`${order[i]}>${order[i + 1]}`)) score++;
  const max = Math.max(0, correctOrder.length - 1);
  return objectiveResult(score, max, [`${score} of ${max} adjacent pairs in the right order.`], correctOrder.join(' → '));
}

const normalizeBlank = (v: string) => v.trim().toLowerCase().replace(/[.,;:!?]+$/, '');

/** Fill in the blanks: 1 point per correct gap (case-insensitive, exact spelling). */
export function scoreBlanks(answers: string[], values: string[]): ScoreResult {
  let score = 0;
  const wrong: string[] = [];
  answers.forEach((a, i) => {
    if (normalizeBlank(values[i] ?? '') === normalizeBlank(a)) score++;
    else wrong.push(`Gap ${i + 1}: ${a}`);
  });
  const feedback = [`${score} of ${answers.length} gaps correct.`, ...wrong];
  return objectiveResult(score, answers.length, feedback, answers.join(', '));
}

/** Highlight incorrect words: +1 per correct index, −1 per wrong index, floor 0. */
export function scoreIndices(correct: number[], selected: number[]): ScoreResult {
  const unique = [...new Set(selected)];
  const right = unique.filter((i) => correct.includes(i)).length;
  const wrong = unique.length - right;
  return objectiveResult(right - wrong, correct.length, [`${right} found, ${wrong} wrongly highlighted.`]);
}

/** Write from dictation: 1 point per correctly spelled word of the sentence, order-insensitive. */
export function scoreDictation(sentence: string, text: string): ScoreResult {
  const target = tokenize(sentence);
  const pool = new Map<string, number>();
  for (const w of tokenize(text)) pool.set(w, (pool.get(w) ?? 0) + 1);
  let score = 0;
  const missing: string[] = [];
  for (const w of target) {
    const n = pool.get(w) ?? 0;
    if (n > 0) {
      score++;
      pool.set(w, n - 1);
    } else {
      missing.push(w);
    }
  }
  const feedback = [`${score} of ${target.length} words.`];
  if (missing.length > 0) feedback.push(`Missed or misspelled: ${missing.join(', ')}`);
  return objectiveResult(score, target.length, feedback, sentence);
}
