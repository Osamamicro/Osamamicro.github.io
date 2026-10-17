import type { KeyPoint, ScoreResult, TraitScore } from '../content/types';
import { getTaskType } from '../exams/registry';
import type { TaskTypeId, TraitId } from '../exams/types';
import {
  academicWordRatio,
  band,
  clamp,
  connectivesUsed,
  grammarIssues,
  keyPointCoverage,
  lexicalDiversity,
  paragraphs,
  spellingIssues,
  splitSentences,
  tokenize,
} from './text';

/*
 * Heuristic writing scorer. It mirrors the published PTE traits so learners see the
 * same breakdown as their real score report, but every number here is an ESTIMATE.
 * PTE rule we keep: if Form (or Content) is 0, the remaining traits score 0.
 */

type TraitValues = Partial<Record<TraitId, number>>;

function build(taskType: TaskTypeId, values: TraitValues, feedback: string[], answer?: string): ScoreResult {
  const traits: TraitScore[] = getTaskType(taskType).traits.map((t) => ({
    ...t,
    score: clamp(Math.round(values[t.id] ?? 0), 0, t.max),
  }));
  const total = traits.reduce((s, t) => s + t.score, 0);
  const max = traits.reduce((s, t) => s + t.max, 0);
  return { traits, total, max, percent: max === 0 ? 0 : total / max, estimated: true, feedback, answer };
}

function zeroAllBut(values: TraitValues, keep: TraitId[]): TraitValues {
  const out: TraitValues = {};
  for (const k of keep) out[k] = values[k];
  return out;
}

function grammarBand(text: string, words: number, feedback: string[]): number {
  const issues = grammarIssues(text);
  issues.slice(0, 3).forEach((i) => feedback.push(`${i.message}: “${i.excerpt}”`));
  // One slip costs a band whatever the length; more slips are judged per 100 words.
  const per100 = (issues.length / Math.max(words, 1)) * 100;
  return issues.length === 0 ? 2 : issues.length === 1 || per100 <= 2 ? 1 : 0;
}

function spellingBand(text: string, feedback: string[]): number {
  const issues = spellingIssues(text);
  issues.slice(0, 3).forEach((i) => feedback.push(i.message));
  return issues.length === 0 ? 2 : issues.length === 1 ? 1 : 0;
}

/** 0..2 from lexical diversity and academic register. */
function vocabularyBand(words: string[]): number {
  const diversity = lexicalDiversity(words);
  const academic = academicWordRatio(words);
  const ratio = clamp((diversity - 0.55) / 0.3, 0, 1) * 0.6 + clamp(academic / 0.08, 0, 1) * 0.4;
  return band(ratio, 2);
}

function contentFeedback(missed: KeyPoint[], feedback: string[]) {
  if (missed.length > 0) feedback.push(`Not covered: ${missed.map((k) => k.label).join('; ')}`);
}

export function scoreSummarizeWrittenText(text: string, keyPoints: KeyPoint[], modelAnswer: string): ScoreResult {
  const feedback: string[] = [];
  const words = tokenize(text);
  const sentences = splitSentences(text);
  const values: TraitValues = {};

  const oneSentence = sentences.length === 1 && /[.!?]$/.test(text.trim());
  values.form = oneSentence && words.length >= 5 && words.length <= 75 ? 1 : 0;
  if (values.form === 0) {
    feedback.push(
      `Form: write exactly one sentence ending with a full stop, 5–75 words (you wrote ${sentences.length} sentence(s), ${words.length} words).`,
    );
    return build('summarize-written-text', {}, feedback, modelAnswer);
  }
  const coverage = keyPointCoverage(text, keyPoints);
  values.content = band(coverage.ratio, 4);
  contentFeedback(coverage.missed, feedback);
  if (values.content === 0) return build('summarize-written-text', zeroAllBut(values, ['form']), feedback, modelAnswer);

  values.grammar = grammarBand(text, words.length, feedback);
  values.vocabulary = vocabularyBand(words);
  return build('summarize-written-text', values, feedback, modelAnswer);
}

export function scoreSummarizeSpokenText(text: string, keyPoints: KeyPoint[], modelAnswer: string): ScoreResult {
  const feedback: string[] = [];
  const words = tokenize(text);
  const values: TraitValues = {};
  const n = words.length;
  values.form = n >= 50 && n <= 70 ? 2 : (n >= 40 && n < 50) || (n > 70 && n <= 100) ? 1 : 0;
  if (values.form < 2) feedback.push(`Form: aim for 50–70 words (you wrote ${n}).`);
  if (values.form === 0) return build('summarize-spoken-text', {}, feedback, modelAnswer);

  const coverage = keyPointCoverage(text, keyPoints);
  values.content = band(coverage.ratio, 4);
  contentFeedback(coverage.missed, feedback);
  if (values.content === 0) return build('summarize-spoken-text', zeroAllBut(values, ['form']), feedback, modelAnswer);

  values.grammar = grammarBand(text, n, feedback);
  values.vocabulary = vocabularyBand(words);
  values.spelling = spellingBand(text, feedback);
  return build('summarize-spoken-text', values, feedback, modelAnswer);
}

/** Share of key points an answer must cover before template phrases earn credit. */
export const ON_TOPIC_FLOOR = 0.25;

const POSITION_MARKERS = ['i believe', 'i think', 'in my opinion', 'i agree', 'i disagree', 'i would argue', 'in my view', 'this essay'];
const EXAMPLE_MARKERS = ['for example', 'for instance', 'such as', 'a case in point', 'to illustrate'];
const CONCLUSION_MARKERS = ['in conclusion', 'to conclude', 'to sum up', 'in summary', 'overall'];
const COMPLEX_MARKERS = ['although', 'whereas', 'which', 'whom', 'whose', 'unless', 'provided that', 'not only', 'if', 'despite', 'even though'];

function containsAny(lower: string, markers: string[]): boolean {
  return markers.some((m) => lower.includes(m));
}

export function scoreWriteEssay(text: string, keyPoints: KeyPoint[], modelAnswer: string): ScoreResult {
  const feedback: string[] = [];
  const words = tokenize(text);
  const n = words.length;
  const lower = text.toLowerCase();
  const values: TraitValues = {};

  values.form = n >= 200 && n <= 300 ? 2 : (n >= 120 && n < 200) || (n > 300 && n <= 380) ? 1 : 0;
  if (values.form < 2) feedback.push(`Form: aim for 200–300 words (you wrote ${n}).`);
  if (values.form === 0 || text === text.toUpperCase()) return build('write-essay', {}, feedback, modelAnswer);

  const coverage = keyPointCoverage(text, keyPoints);
  const hasPosition = containsAny(lower, POSITION_MARKERS);
  const hasExample = containsAny(lower, EXAMPLE_MARKERS);
  // Stock phrases ("I believe", "for example") only count once the essay is on topic;
  // below the floor content is 0, which (as in PTE) zeroes every other trait.
  const onTopic = coverage.ratio >= ON_TOPIC_FLOOR;
  values.content = onTopic ? band(coverage.ratio * 0.7 + (hasPosition ? 0.15 : 0) + (hasExample ? 0.15 : 0), 6) : 0;
  if (!onTopic) feedback.push('Content: the essay does not address the prompt’s key ideas.');
  contentFeedback(coverage.missed, feedback);
  if (!hasPosition) feedback.push('State your position clearly in the introduction.');
  if (!hasExample) feedback.push('Support each body paragraph with a specific example.');
  if (values.content === 0) return build('write-essay', zeroAllBut(values, ['form']), feedback, modelAnswer);

  const paras = paragraphs(text).length;
  const connectives = connectivesUsed(text);
  const hasConclusion = containsAny(lower, CONCLUSION_MARKERS);
  const paraScore = paras >= 4 && paras <= 5 ? 1 : paras === 3 ? 0.75 : paras === 2 ? 0.4 : 0.1;
  values.dsc = band(paraScore * 0.45 + clamp(connectives.length / 6, 0, 1) * 0.35 + (hasConclusion ? 0.2 : 0), 6);
  if (paras < 4) feedback.push('Structure: use 4–5 paragraphs (introduction, 2–3 body paragraphs, conclusion).');
  if (connectives.length < 4) feedback.push('Coherence: link ideas with more connectives (however, therefore, for instance…).');

  const sentences = splitSentences(text);
  const lengths = sentences.map((s) => tokenize(s).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / Math.max(lengths.length, 1);
  const variance = lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(lengths.length, 1);
  const complexHits = COMPLEX_MARKERS.filter((m) => lower.includes(m)).length;
  values['linguistic-range'] = band(
    clamp(Math.sqrt(variance) / 8, 0, 1) * 0.4 + clamp(complexHits / 5, 0, 1) * 0.4 + clamp((mean - 10) / 10, 0, 1) * 0.2,
    6,
  );

  values.grammar = grammarBand(text, n, feedback);
  values.vocabulary = vocabularyBand(words);
  values.spelling = spellingBand(text, feedback);
  return build('write-essay', values, feedback, modelAnswer);
}

const GREETINGS = /^(dear|hi|hello|good (morning|afternoon|evening)|to whom it may concern)\b/i;
// Sign-off, optionally followed by a name of up to three words ("Kind regards,\nSam Patel").
const CLOSINGS =
  /\b(regards|sincerely|best wishes|best|cheers|thanks|thank you|yours faithfully|yours truly|take care|warm wishes)\b[,!.]?(?:\s+[A-Za-z.'’-]+){0,3}\s*$/i;
const INFORMAL_WORDS = ['hey', 'gonna', 'wanna', 'cheers', 'lol'];

export function scoreWriteEmail(
  text: string,
  bulletPoints: KeyPoint[],
  register: 'formal' | 'semi-formal' | 'informal',
  modelAnswer: string,
): ScoreResult {
  const feedback: string[] = [];
  const words = tokenize(text);
  const n = words.length;
  const values: TraitValues = {};

  values.form = n >= 50 && n <= 120 ? 2 : (n >= 30 && n < 50) || (n > 120 && n <= 140) ? 1 : 0;
  if (values.form < 2) feedback.push(`Formal requirements: aim for 50–120 words (you wrote ${n}).`);
  if (values.form === 0) return build('write-email', {}, feedback, modelAnswer);

  const coverage = keyPointCoverage(text, bulletPoints);
  values.content = band(coverage.ratio, 3);
  contentFeedback(coverage.missed, feedback);
  if (values.content === 0) return build('write-email', zeroAllBut(values, ['form']), feedback, modelAnswer);

  const trimmed = text.trim();
  const hasGreeting = GREETINGS.test(trimmed);
  const hasClosing = CLOSINGS.test(trimmed);
  const lower = trimmed.toLowerCase();
  // Whole words only: "they" must not count as "hey".
  const informalSlip = register !== 'informal' && (words.some((w) => INFORMAL_WORDS.includes(w)) || lower.includes('!!'));
  values['email-conventions'] = (hasGreeting ? 1 : 0) + (hasClosing ? 1 : 0) - (informalSlip ? 1 : 0);
  if (!hasGreeting) feedback.push('Open with a greeting (e.g. “Dear Ms Lee,”).');
  if (!hasClosing) feedback.push('Close with a sign-off (e.g. “Kind regards,” and your name).');
  if (informalSlip) feedback.push(`Keep the tone ${register}; avoid casual words.`);

  const paras = paragraphs(text).length;
  const connectives = connectivesUsed(text).length;
  values.organization = (paras >= 3 ? 1 : paras === 2 ? 0.5 : 0) + (connectives >= 2 ? 1 : connectives === 1 ? 0.5 : 0);
  if (paras < 3) feedback.push('Organization: separate greeting, body and closing into paragraphs.');

  values.vocabulary = vocabularyBand(words);
  values.grammar = grammarBand(text, n, feedback);
  values.spelling = spellingBand(text, feedback);
  return build('write-email', values, feedback, modelAnswer);
}
