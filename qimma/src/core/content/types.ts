import type { ExamId, TaskTypeId, TraitId } from '../exams/types';

/**
 * Question-bank schema. Every item is ORIGINAL content written for this project;
 * never paste items from other prep platforms or "real exam" memory dumps.
 *
 * Text with gaps uses numbered placeholders: "The {{1}} grew {{2}} quickly."
 * Placeholders are 1-based and must appear in order.
 */

export type Difficulty = 1 | 2 | 3;

export interface BaseItem {
  id: string;
  title: string;
  difficulty: Difficulty;
  /** Exams this item suits. Omit for "both PTE Academic and PTE Core". */
  exams?: ExamId[];
  tags?: string[];
}

/** A content idea the response should mention; covered when any keyword appears. */
export interface KeyPoint {
  label: string;
  /** Lower-case words or short phrases; simple stemming is applied when matching. */
  keywords: string[];
}

export interface Option {
  id: string;
  text: string;
}

export type VoiceHint = 'female' | 'male';

export interface Utterance {
  speaker: string;
  voice?: VoiceHint;
  text: string;
}

// ---------- Charts for Describe Image (rendered with SVG, no image assets) ----------

export interface ChartSeries {
  name: string;
  values: number[];
}

export type ChartSpec =
  | {
      kind: 'bar' | 'line';
      title: string;
      unit?: string;
      xLabel?: string;
      yLabel?: string;
      categories: string[];
      series: ChartSeries[];
    }
  | { kind: 'pie'; title: string; unit?: string; slices: { label: string; value: number }[] }
  | { kind: 'table'; title: string; columns: string[]; rows: (string | number)[][] }
  | { kind: 'process'; title: string; steps: string[] };

// ---------- Speaking ----------

export interface ReadAloudItem extends BaseItem {
  type: 'read-aloud';
  text: string;
}

export interface RepeatSentenceItem extends BaseItem {
  type: 'repeat-sentence';
  sentence: string;
}

export interface DescribeImageItem extends BaseItem {
  type: 'describe-image';
  chart: ChartSpec;
  keyPoints: KeyPoint[];
  modelAnswer: string;
}

export interface RetellLectureItem extends BaseItem {
  type: 'retell-lecture';
  lecture: string;
  voice?: VoiceHint;
  keyPoints: KeyPoint[];
  modelAnswer: string;
}

export interface AnswerShortQuestionItem extends BaseItem {
  type: 'answer-short-question';
  question: string;
  /** Acceptable answers (lower-case). The first one is shown as the model answer. */
  answers: string[];
}

export interface SummarizeGroupDiscussionItem extends BaseItem {
  type: 'summarize-group-discussion';
  turns: Utterance[];
  keyPoints: KeyPoint[];
  modelAnswer: string;
}

export interface RespondToSituationItem extends BaseItem {
  type: 'respond-to-situation';
  situation: string;
  keyPoints: KeyPoint[];
  modelAnswer: string;
}

// ---------- Writing ----------

export interface SummarizeWrittenTextItem extends BaseItem {
  type: 'summarize-written-text';
  passage: string;
  keyPoints: KeyPoint[];
  modelAnswer: string;
}

export interface WriteEssayItem extends BaseItem {
  type: 'write-essay';
  prompt: string;
  keyPoints: KeyPoint[];
  modelAnswer: string;
}

export interface WriteEmailItem extends BaseItem {
  type: 'write-email';
  situation: string;
  /** The points the email must cover; each is scored as a key point. */
  bulletPoints: KeyPoint[];
  register: 'formal' | 'semi-formal' | 'informal';
  modelAnswer: string;
}

// ---------- Reading ----------

export interface RWFillBlanksItem extends BaseItem {
  type: 'rw-fill-blanks';
  /** Passage with {{1}}..{{n}} placeholders. */
  text: string;
  /** One entry per placeholder: 4 options, `answer` must be one of them. */
  blanks: { options: string[]; answer: string }[];
}

export interface ReadingMCMAItem extends BaseItem {
  type: 'reading-mcma';
  passage: string;
  question: string;
  options: Option[];
  /** Option ids; at least two. */
  answers: string[];
}

export interface ReorderParagraphsItem extends BaseItem {
  type: 'reorder-paragraphs';
  /** In the CORRECT order. The UI shuffles them. */
  paragraphs: Option[];
}

export interface ReadingFillBlanksItem extends BaseItem {
  type: 'reading-fill-blanks';
  /** Passage with {{1}}..{{n}} placeholders. */
  text: string;
  /** Correct word for each placeholder, in order. */
  answers: string[];
  /** Extra words for the word bank. */
  distractors: string[];
}

export interface ReadingMCSAItem extends BaseItem {
  type: 'reading-mcsa';
  passage: string;
  question: string;
  options: Option[];
  answer: string;
}

// ---------- Listening (audio comes from TTS of the script unless `audio` is set) ----------

export interface ListeningBase extends BaseItem {
  voice?: VoiceHint;
  /** Optional recorded audio (URL or bundled asset). TTS of the script is the fallback. */
  audio?: string;
}

export interface SummarizeSpokenTextItem extends ListeningBase {
  type: 'summarize-spoken-text';
  script: string;
  keyPoints: KeyPoint[];
  modelAnswer: string;
}

export interface ListeningMCMAItem extends ListeningBase {
  type: 'listening-mcma';
  script: string;
  question: string;
  options: Option[];
  answers: string[];
}

export interface ListeningFillBlanksItem extends ListeningBase {
  type: 'listening-fill-blanks';
  /** Transcript with {{1}}..{{n}} placeholders; the audio says the full sentence. */
  transcript: string;
  answers: string[];
}

export interface HighlightCorrectSummaryItem extends ListeningBase {
  type: 'highlight-correct-summary';
  script: string;
  options: Option[];
  answer: string;
}

export interface ListeningMCSAItem extends ListeningBase {
  type: 'listening-mcsa';
  script: string;
  question: string;
  options: Option[];
  answer: string;
}

export interface SelectMissingWordItem extends ListeningBase {
  type: 'select-missing-word';
  /** What is spoken; the recording then "beeps" instead of saying the answer. */
  script: string;
  options: Option[];
  answer: string;
}

export interface HighlightIncorrectWordsItem extends ListeningBase {
  type: 'highlight-incorrect-words';
  /**
   * Transcript with differences marked as [shown|spoken], e.g.
   * "Reefs cover less than [one|two] percent of the ocean floor."
   * The screen shows "one"; the speaker says "two". Use single words on both sides.
   */
  text: string;
}

export interface WriteFromDictationItem extends ListeningBase {
  type: 'write-from-dictation';
  sentence: string;
}

export type Item =
  | ReadAloudItem
  | RepeatSentenceItem
  | DescribeImageItem
  | RetellLectureItem
  | AnswerShortQuestionItem
  | SummarizeGroupDiscussionItem
  | RespondToSituationItem
  | SummarizeWrittenTextItem
  | WriteEssayItem
  | WriteEmailItem
  | RWFillBlanksItem
  | ReadingMCMAItem
  | ReorderParagraphsItem
  | ReadingFillBlanksItem
  | ReadingMCSAItem
  | SummarizeSpokenTextItem
  | ListeningMCMAItem
  | ListeningFillBlanksItem
  | HighlightCorrectSummaryItem
  | ListeningMCSAItem
  | SelectMissingWordItem
  | HighlightIncorrectWordsItem
  | WriteFromDictationItem;

export type ItemOf<T extends TaskTypeId> = Extract<Item, { type: T }>;

// ---------- Responses ----------

export interface SpeechResponse {
  kind: 'speech';
  /** Recognised text, or null when speech recognition is unavailable on this device. */
  transcript: string | null;
  durationMs: number;
  /** Mean recogniser confidence 0..1 when the engine reports it. */
  confidence?: number | null;
  audioUri?: string | null;
  /** Learner's own 0..1 content rating, used when there is no transcript. */
  selfRating?: number | null;
}

export interface TextResponse {
  kind: 'text';
  text: string;
}

export interface ChoiceResponse {
  kind: 'choice';
  selected: string[];
}

export interface OrderResponse {
  kind: 'order';
  order: string[];
}

export interface BlanksResponse {
  kind: 'blanks';
  values: string[];
}

export interface IndicesResponse {
  kind: 'indices';
  indices: number[];
}

export type Response =
  | SpeechResponse
  | TextResponse
  | ChoiceResponse
  | OrderResponse
  | BlanksResponse
  | IndicesResponse;

// ---------- Results ----------

export interface TraitScore {
  id: TraitId;
  label: string;
  score: number;
  max: number;
  /** Excluded from the total (e.g. pronunciation when there is no recogniser). */
  unscored?: boolean;
}

export interface ScoreResult {
  traits: TraitScore[];
  total: number;
  max: number;
  /** total / max in 0..1 (0 when max is 0). */
  percent: number;
  /** True when any trait is a heuristic estimate rather than an exact rule. */
  estimated: boolean;
  feedback: string[];
  /** Human-readable correct answer or model answer to reveal after submitting. */
  answer?: string;
}

// ---------- Vocabulary & guides ----------

export interface VocabEntry {
  id: string;
  word: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'conjunction' | 'preposition';
  definition: string;
  example: string;
  /** e.g. 'academic', 'collocation', 'describe-image', 'essay' */
  tags: string[];
}

export interface TaskGuide {
  taskType: TaskTypeId;
  summary: string;
  /** Short actionable tips. */
  tips: string[];
  /** Reusable sentence frame or template, if the task benefits from one. */
  template?: string;
  commonMistakes: string[];
}
