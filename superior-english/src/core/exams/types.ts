/**
 * Exam model. Everything exam-specific lives in data (ExamSpec / TaskTypeSpec),
 * so adding IELTS, TOEFL or Duolingo later means adding specs + renderers,
 * not rewriting the app.
 */

export type ExamId = 'pte-academic' | 'pte-core';

export type SkillId = 'speaking' | 'writing' | 'reading' | 'listening';

export const SKILLS: SkillId[] = ['speaking', 'writing', 'reading', 'listening'];

export type SectionId = 'speaking-writing' | 'reading' | 'listening';

export type TaskTypeId =
  // Part 1: Speaking & Writing
  | 'read-aloud'
  | 'repeat-sentence'
  | 'describe-image'
  | 'retell-lecture'
  | 'answer-short-question'
  | 'summarize-group-discussion'
  | 'respond-to-situation'
  | 'summarize-written-text'
  | 'write-essay'
  | 'write-email'
  // Part 2: Reading
  | 'rw-fill-blanks'
  | 'reading-mcma'
  | 'reorder-paragraphs'
  | 'reading-fill-blanks'
  | 'reading-mcsa'
  // Part 3: Listening
  | 'summarize-spoken-text'
  | 'listening-mcma'
  | 'listening-fill-blanks'
  | 'highlight-correct-summary'
  | 'listening-mcsa'
  | 'select-missing-word'
  | 'highlight-incorrect-words'
  | 'write-from-dictation';

export type TraitId =
  | 'content'
  | 'form'
  | 'grammar'
  | 'vocabulary'
  | 'spelling'
  | 'dsc'
  | 'linguistic-range'
  | 'fluency'
  | 'pronunciation'
  | 'appropriacy'
  | 'email-conventions'
  | 'organization'
  | 'correct';

export interface TraitSpec {
  id: TraitId;
  label: string;
  max: number;
}

/** How the learner answers. Renderers and scorers switch on this. */
export type ResponseKind = 'speech' | 'text' | 'choice' | 'order' | 'blanks' | 'indices';

export interface TaskTiming {
  /** Preparation time before recording starts (speaking). */
  prepSec?: number;
  /** Recording or writing window. */
  responseSec?: number;
  /** Advisory time for untimed-per-item tasks (reading/listening). */
  suggestedSec?: number;
  /** How many times the audio may be played in exam mode. */
  audioPlays?: number;
}

export interface TaskTypeSpec {
  id: TaskTypeId;
  name: string;
  /** Short code used in chips and tables, e.g. RA, WFD. */
  code: string;
  section: SectionId;
  responseKind: ResponseKind;
  /** Skills this task feeds, with its PTE Academic weight in that skill (percent). */
  skills: Partial<Record<SkillId, number>>;
  traits: TraitSpec[];
  timing: TaskTiming;
  /** One-line instruction shown above the task (our own wording). */
  instructions: string;
  /** Whether the task uses a spoken audio prompt (TTS or file). */
  hasAudio: boolean;
  /** Whether the item has a model answer worth revealing after submission. */
  hasModelAnswer: boolean;
}

export interface ExamSection {
  id: SectionId;
  name: string;
  /** Upper bound of the section time; the real exam varies with the number of items. */
  minutes: number;
  /** Lower bound of the section time. */
  minMinutes: number;
  taskTypes: TaskTypeId[];
}

/**
 * How much a task type contributes to the overall score and to each communicative
 * skill score, in percent (PTE Academic: Pearson's published weighting, Aug 2025).
 */
export interface TaskWeight {
  overall: number;
  skills: Partial<Record<SkillId, number>>;
}

export interface ExamSpec {
  id: ExamId;
  name: string;
  shortName: string;
  description: string;
  sections: ExamSection[];
  /** [min, max] item counts per task type in a real test; mocks pick within the range. */
  blueprint: Partial<Record<TaskTypeId, [number, number]>>;
  /** Score weighting per task type; drives estimates and study-plan priorities. */
  weights: Partial<Record<TaskTypeId, TaskWeight>>;
  /** Whether `weights` are official (published) or our approximation. */
  weightsSource: 'official' | 'approximate';
  scoreRange: [number, number];
}
