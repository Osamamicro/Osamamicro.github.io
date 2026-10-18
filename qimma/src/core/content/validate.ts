import { parseHiw, placeholderCount } from './audio-script';
import type { Item, KeyPoint, Option, TaskGuide, VocabEntry } from './types';
import { wordCount } from '../scoring/text';

/** Returns human-readable problems with an item; empty means valid. */
export function validateItem(item: Item): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(`${item.id} (${item.type}): ${msg}`);

  if (!/^[a-z0-9-]+$/.test(item.id)) err('id must be kebab-case');
  if (!item.title.trim()) err('title is empty');
  if (![1, 2, 3].includes(item.difficulty)) err('difficulty must be 1, 2 or 3');

  const keyPoints = (kps: KeyPoint[], min: number) => {
    if (kps.length < min) err(`needs at least ${min} key points`);
    for (const kp of kps) if (kp.keywords.length === 0) err(`key point "${kp.label}" has no keywords`);
  };
  const options = (opts: Option[], min: number) => {
    if (opts.length < min) err(`needs at least ${min} options`);
    const ids = new Set(opts.map((o) => o.id));
    if (ids.size !== opts.length) err('option ids must be unique');
  };
  const range = (label: string, text: string, lo: number, hi: number) => {
    const n = wordCount(text);
    if (n < lo || n > hi) err(`${label} should be ${lo}–${hi} words (has ${n})`);
  };

  switch (item.type) {
    case 'read-aloud':
      range('text', item.text, 30, 80);
      break;
    case 'repeat-sentence':
      range('sentence', item.sentence, 6, 18);
      break;
    case 'describe-image':
      keyPoints(item.keyPoints, 3);
      range('modelAnswer', item.modelAnswer, 50, 110);
      if (item.chart.kind === 'bar' || item.chart.kind === 'line') {
        for (const s of item.chart.series)
          if (s.values.length !== item.chart.categories.length) err(`series "${s.name}" length ≠ categories`);
      }
      break;
    case 'retell-lecture':
      range('lecture', item.lecture, 80, 260);
      keyPoints(item.keyPoints, 3);
      break;
    case 'answer-short-question':
      if (item.answers.length === 0) err('needs at least one accepted answer');
      if (item.answers.some((a) => a !== a.toLowerCase())) err('answers must be lower-case');
      break;
    case 'summarize-group-discussion':
      if (item.turns.length < 3) err('needs at least 3 turns');
      if (new Set(item.turns.map((t) => t.speaker)).size < 2) err('needs at least 2 speakers');
      keyPoints(item.keyPoints, 3);
      break;
    case 'respond-to-situation':
      range('situation', item.situation, 25, 90);
      keyPoints(item.keyPoints, 2);
      break;
    case 'summarize-written-text':
      range('passage', item.passage, 150, 320);
      keyPoints(item.keyPoints, 3);
      range('modelAnswer', item.modelAnswer, 25, 75);
      break;
    case 'write-essay':
      keyPoints(item.keyPoints, 2);
      range('modelAnswer', item.modelAnswer, 200, 300);
      break;
    case 'write-email':
      keyPoints(item.bulletPoints, 3);
      range('modelAnswer', item.modelAnswer, 50, 120);
      break;
    case 'rw-fill-blanks':
      if (placeholderCount(item.text) !== item.blanks.length) err('placeholder count ≠ blanks');
      item.blanks.forEach((b, i) => {
        if (b.options.length !== 4) err(`blank ${i + 1} needs exactly 4 options`);
        if (!b.options.includes(b.answer)) err(`blank ${i + 1} answer not among options`);
      });
      break;
    case 'reading-fill-blanks':
      if (placeholderCount(item.text) !== item.answers.length) err('placeholder count ≠ answers');
      if (item.distractors.length < 2) err('needs at least 2 distractors');
      break;
    case 'listening-fill-blanks':
      if (placeholderCount(item.transcript) !== item.answers.length) err('placeholder count ≠ answers');
      break;
    case 'reading-mcma':
    case 'listening-mcma':
      options(item.options, 5);
      if (item.answers.length < 2) err('MCMA needs at least 2 answers');
      if (!item.answers.every((a) => item.options.some((o) => o.id === a))) err('answer id not among options');
      break;
    case 'reading-mcsa':
    case 'listening-mcsa':
    case 'highlight-correct-summary':
    case 'select-missing-word':
      options(item.options, item.type === 'highlight-correct-summary' ? 3 : 4);
      if (!item.options.some((o) => o.id === item.answer)) err('answer id not among options');
      break;
    case 'reorder-paragraphs':
      options(item.paragraphs, 4);
      break;
    case 'highlight-incorrect-words': {
      const parsed = parseHiw(item.text);
      if (parsed.incorrect.length < 2) err('needs at least 2 [shown|spoken] differences');
      if (/\[[^\]]*\s[^\]]*\]/.test(item.text)) err('[shown|spoken] marks must not contain spaces');
      range('text', parsed.shown.join(' '), 30, 110);
      break;
    }
    case 'write-from-dictation':
      range('sentence', item.sentence, 7, 16);
      break;
  }
  return errors;
}

export function validateBank(items: Item[]): string[] {
  const errors = items.flatMap(validateItem);
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) errors.push(`duplicate id ${item.id}`);
    seen.add(item.id);
  }
  return errors;
}

export function validateVocab(entries: VocabEntry[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const e of entries) {
    if (ids.has(e.id)) errors.push(`duplicate vocab id ${e.id}`);
    ids.add(e.id);
    if (!e.definition.trim() || !e.example.trim()) errors.push(`${e.id}: definition and example are required`);
  }
  return errors;
}

export function validateGuides(guides: TaskGuide[]): string[] {
  return guides.filter((g) => g.tips.length < 3).map((g) => `${g.taskType}: needs at least 3 tips`);
}
