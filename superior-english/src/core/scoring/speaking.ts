import type { KeyPoint, ScoreResult, SpeechResponse, TraitScore } from '../content/types';
import { getTaskType } from '../exams/registry';
import type { TaskTypeId, TraitId } from '../exams/types';
import { align, band, clamp, hesitationCount, keyPointCoverage, repetitionCount, tokenize } from './text';

/*
 * Speaking estimates from a speech-recognition transcript plus timing.
 * Content: alignment to the reference text, or key-point coverage for open tasks.
 * Fluency: speaking rate, hesitations, repetitions and how much of the window was used.
 * Pronunciation: recogniser confidence blended with how many words were recognised.
 * Without a transcript (no recogniser on this device) we fall back to the learner's
 * self-rating for content and leave fluency/pronunciation unscored.
 */

type TraitValues = Partial<Record<TraitId, number>>;

function build(
  taskType: TaskTypeId,
  values: TraitValues,
  feedback: string[],
  answer: string | undefined,
  unscored: TraitId[] = [],
): ScoreResult {
  const traits: TraitScore[] = getTaskType(taskType).traits.map((t) => ({
    ...t,
    score: clamp(Math.round(values[t.id] ?? 0), 0, t.max),
    unscored: unscored.includes(t.id) || undefined,
  }));
  const counted = traits.filter((t) => !t.unscored);
  const total = counted.reduce((s, t) => s + t.score, 0);
  const max = counted.reduce((s, t) => s + t.max, 0);
  return { traits, total, max, percent: max === 0 ? 0 : total / max, estimated: true, feedback, answer };
}

/** Fluency 0..5 from words-per-minute against a target band, minus disfluencies. */
export function fluencyBand(words: string[], durationMs: number, responseSec: number): number {
  if (words.length === 0 || durationMs <= 0) return 0;
  const minutes = durationMs / 60000;
  const wpm = words.length / minutes;
  let score: number;
  if (wpm >= 110 && wpm <= 170) score = 5;
  else if (wpm >= 95 && wpm <= 190) score = 4;
  else if (wpm >= 80) score = 3;
  else if (wpm >= 65) score = 2;
  else if (wpm >= 45) score = 1;
  else score = 0;
  const disfluencies = hesitationCount(words) + repetitionCount(words);
  score -= Math.min(2, Math.floor(disfluencies / 2));
  // Very short answers in long windows sound hesitant even at a good rate.
  const usage = durationMs / 1000 / responseSec;
  if (responseSec >= 30 && usage < 0.5) score -= 1;
  return clamp(score, 0, 5);
}

export function pronunciationBand(confidence: number | null | undefined, recognisedRatio: number): number {
  const conf = confidence == null ? recognisedRatio : confidence * 0.6 + recognisedRatio * 0.4;
  return band(conf, 5);
}

function noTranscript(taskType: TaskTypeId, response: SpeechResponse, answer?: string): ScoreResult {
  const spec = getTaskType(taskType);
  const contentTrait = spec.traits[0];
  const values: TraitValues = {};
  const feedback = [
    'Automatic speech scoring is not available on this device yet. Listen to your recording, compare it with the model answer and rate your content.',
  ];
  if (response.selfRating != null) values[contentTrait.id] = response.selfRating * contentTrait.max;
  const unscored = spec.traits.filter((t) => t.id !== contentTrait.id).map((t) => t.id);
  return build(taskType, values, feedback, answer, response.selfRating == null ? spec.traits.map((t) => t.id) : unscored);
}

/** Read Aloud (content 0..5) and Repeat Sentence (content 0..3): reference alignment. */
export function scoreReferenceSpeech(
  taskType: 'read-aloud' | 'repeat-sentence',
  reference: string,
  response: SpeechResponse,
): ScoreResult {
  const answer = taskType === 'repeat-sentence' ? reference : undefined;
  if (response.transcript == null) return noTranscript(taskType, response, answer);
  const ref = tokenize(reference);
  const hyp = tokenize(response.transcript);
  const a = align(ref, hyp);
  const ratio = ref.length === 0 ? 0 : a.matches / ref.length;
  const errors = a.substitutions + a.deletions + a.insertions;
  const feedback: string[] = [];
  const values: TraitValues = {};

  if (taskType === 'read-aloud') {
    values.content = ratio >= 0.97 ? 5 : ratio >= 0.9 ? 4 : ratio >= 0.8 ? 3 : ratio >= 0.65 ? 2 : ratio >= 0.45 ? 1 : 0;
    feedback.push(`${a.matches}/${ref.length} words read correctly; ${errors} omission/insertion/substitution error(s).`);
  } else {
    values.content = a.matches === ref.length ? 3 : ratio >= 0.5 ? 2 : ratio >= 0.1 ? 1 : 0;
    feedback.push(`You repeated ${a.matches} of ${ref.length} words in order.`);
  }
  const missed = ref.filter((_, i) => !a.matchedRef[i]);
  if (missed.length > 0) feedback.push(`Missed: ${missed.slice(0, 12).join(', ')}${missed.length > 12 ? '…' : ''}`);

  const spec = getTaskType(taskType);
  values.fluency = fluencyBand(hyp, response.durationMs, spec.timing.responseSec ?? 40);
  values.pronunciation = pronunciationBand(response.confidence, ratio);
  if (values.content === 0) {
    // PTE: no content means fluency and pronunciation are not credited.
    values.fluency = 0;
    values.pronunciation = 0;
  }
  return build(taskType, values, feedback, answer);
}

const POLITE_MARKERS = ['please', 'could you', 'would you', 'would it be', 'i was wondering', 'sorry', 'apologise', 'apologize', 'thank', 'appreciate', 'excuse me', 'i understand'];

/** DI, RL, SGD (content 0..6) and RTS (appropriacy 0..6): key-point coverage. */
export function scoreOpenSpeech(
  taskType: 'describe-image' | 'retell-lecture' | 'summarize-group-discussion' | 'respond-to-situation',
  keyPoints: KeyPoint[],
  modelAnswer: string,
  response: SpeechResponse,
): ScoreResult {
  if (response.transcript == null) return noTranscript(taskType, response, modelAnswer);
  const hyp = tokenize(response.transcript);
  const coverage = keyPointCoverage(response.transcript, keyPoints);
  const feedback: string[] = [];
  const values: TraitValues = {};
  const contentId: TraitId = taskType === 'respond-to-situation' ? 'appropriacy' : 'content';

  let ratio = coverage.ratio;
  if (taskType === 'respond-to-situation') {
    const lower = response.transcript.toLowerCase();
    const polite = POLITE_MARKERS.filter((m) => lower.includes(m)).length;
    ratio = coverage.ratio * 0.75 + clamp(polite / 2, 0, 1) * 0.25;
    if (polite === 0) feedback.push('Use polite, situation-appropriate language (could you…, I’m sorry…, thank you…).');
  }
  values[contentId] = band(ratio, 6);
  feedback.push(`Covered ${coverage.covered.length} of ${keyPoints.length} key points.`);
  if (coverage.missed.length > 0) feedback.push(`Missing: ${coverage.missed.map((k) => k.label).join('; ')}`);

  const spec = getTaskType(taskType);
  values.fluency = fluencyBand(hyp, response.durationMs, spec.timing.responseSec ?? 40);
  // No reference text: use how much was recognised against the expected length of the window.
  const expectedWords = ((spec.timing.responseSec ?? 40) * 0.8 * 130) / 60;
  values.pronunciation = pronunciationBand(response.confidence, clamp(hyp.length / expectedWords, 0, 1));
  if (values[contentId] === 0) {
    values.fluency = 0;
    values.pronunciation = 0;
  }
  return build(taskType, values, feedback, modelAnswer);
}

/** Answer Short Question: 1 if any accepted answer is said. */
export function scoreShortAnswer(answers: string[], response: SpeechResponse): ScoreResult {
  if (response.transcript == null) return noTranscript('answer-short-question', response, answers[0]);
  const said = ` ${tokenize(response.transcript).join(' ')} `;
  const correct = answers.some((a) => said.includes(` ${tokenize(a).join(' ')} `));
  return build(
    'answer-short-question',
    { vocabulary: correct ? 1 : 0 },
    [correct ? 'Correct.' : `Accepted answers: ${answers.join(', ')}`],
    answers[0],
  );
}
