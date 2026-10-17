import type { KeyPoint } from '../content/types';
import { ACADEMIC_WORDS, COMMON_MISSPELLINGS, CONNECTIVES, HESITATIONS } from './lexicon';

/** Lower-case words with surrounding punctuation removed. Keeps inner apostrophes/hyphens. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z0-9\u00c0-\u024f]+|[^a-z0-9\u00c0-\u024f]+$/g, ''))
    .filter((w) => w.length > 0);
}

export function wordCount(text: string): number {
  return tokenize(text).length;
}

/** "U.S.", "e.g.", "Dr." … end with a full stop but do not end a sentence. */
const ABBREVIATION = /(?:\b(?:[A-Za-z]\.){1,3}|\b(?:Mr|Mrs|Ms|Dr|Prof|St|etc|vs|approx|No|Fig))\.?$/;

/** Sentences split on . ! ? followed by whitespace and a capital, digit or quote. */
export function splitSentences(text: string): string[] {
  const pieces = text
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const out: string[] = [];
  for (const piece of pieces) {
    const prev = out[out.length - 1];
    if (prev !== undefined && ABBREVIATION.test(prev)) out[out.length - 1] = `${prev} ${piece}`;
    else out.push(piece);
  }
  return out;
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/** Very small stemmer: enough to match "increase/increased/increasing/increases". */
export function stem(word: string): string {
  let w = word.toLowerCase();
  if (w.length <= 3) return w;
  for (const suffix of ['ingly', 'edly', 'ing', 'ies', 'ied', 'ed', 'es', 'ly', 's']) {
    // "business"/"class" end in -ss, which is not a plural: keep it.
    if (suffix === 's' && w.endsWith('ss')) break;
    if (w.endsWith(suffix) && w.length - suffix.length >= 3) {
      w = w.slice(0, -suffix.length);
      if (suffix === 'ies' || suffix === 'ied') w += 'y';
      break;
    }
  }
  // "increas" (from increased) and "increase" should meet: drop a trailing e.
  if (w.endsWith('e') && w.length > 3) w = w.slice(0, -1);
  return w;
}

export interface Alignment {
  matches: number;
  substitutions: number;
  deletions: number;
  insertions: number;
  /** For each reference word: true if it was matched in order. */
  matchedRef: boolean[];
}

/** Levenshtein alignment of hypothesis words against reference words. */
export function align(ref: string[], hyp: string[]): Alignment {
  const n = ref.length;
  const m = hyp.length;
  const d: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = ref[i - 1] === hyp[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  const matchedRef = new Array<boolean>(n).fill(false);
  let i = n;
  let j = m;
  let matches = 0;
  let substitutions = 0;
  let deletions = 0;
  let insertions = 0;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1)) {
      if (ref[i - 1] === hyp[j - 1]) {
        matches++;
        matchedRef[i - 1] = true;
      } else {
        substitutions++;
      }
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      deletions++;
      i--;
    } else {
      insertions++;
      j--;
    }
  }
  return { matches, substitutions, deletions, insertions, matchedRef };
}

/** Does the token sequence contain the phrase (both stemmed)? */
function containsPhrase(stems: string[], phrase: string): boolean {
  const target = tokenize(phrase).map(stem);
  if (target.length === 0) return false;
  outer: for (let i = 0; i + target.length <= stems.length; i++) {
    for (let k = 0; k < target.length; k++) {
      if (stems[i + k] !== target[k]) continue outer;
    }
    return true;
  }
  return false;
}

export interface Coverage {
  covered: KeyPoint[];
  missed: KeyPoint[];
  ratio: number;
}

export function keyPointCoverage(text: string, keyPoints: KeyPoint[]): Coverage {
  const stems = tokenize(text).map(stem);
  const covered: KeyPoint[] = [];
  const missed: KeyPoint[] = [];
  for (const kp of keyPoints) {
    (kp.keywords.some((k) => containsPhrase(stems, k)) ? covered : missed).push(kp);
  }
  return { covered, missed, ratio: keyPoints.length === 0 ? 0 : covered.length / keyPoints.length };
}

/** Moving-average type-token ratio over 50-word windows (stable for short and long texts). */
export function lexicalDiversity(words: string[]): number {
  if (words.length === 0) return 0;
  const window = Math.min(50, words.length);
  let total = 0;
  let count = 0;
  for (let i = 0; i + window <= words.length; i++) {
    total += new Set(words.slice(i, i + window)).size / window;
    count++;
  }
  return total / count;
}

export function academicWordRatio(words: string[]): number {
  if (words.length === 0) return 0;
  const stems = words.map(stem);
  let hits = 0;
  for (const s of stems) if (ACADEMIC_STEMS.has(s)) hits++;
  return hits / words.length;
}

const ACADEMIC_STEMS = new Set(ACADEMIC_WORDS.map(stem));

export function connectivesUsed(text: string): string[] {
  const stems = tokenize(text).map(stem);
  return CONNECTIVES.filter((c) => containsPhrase(stems, c));
}

export function hesitationCount(words: string[]): number {
  return words.filter((w) => HESITATIONS.includes(w)).length;
}

/** Immediate repetitions such as "the the" or "I I". */
export function repetitionCount(words: string[]): number {
  let n = 0;
  for (let i = 1; i < words.length; i++) if (words[i] === words[i - 1]) n++;
  return n;
}

export interface Issue {
  message: string;
  excerpt: string;
}

export function spellingIssues(text: string): Issue[] {
  const issues: Issue[] = [];
  for (const w of tokenize(text)) {
    const fix = COMMON_MISSPELLINGS[w];
    if (fix) issues.push({ message: `Spelling: "${w}" → "${fix}"`, excerpt: w });
  }
  return issues;
}

/** Not an agreement error after these words: "does he have", "if he were", "would it be". */
const NO_AGREEMENT_CHECK_AFTER = '(?<!\\b(?:does|did|do|would|could|should|will|can|may|might|must|to|let|make|makes|help|if|wish|though)\\s)';

const COMPARATIVES =
  'better|worse|bigger|smaller|easier|harder|faster|slower|higher|lower|larger|cheaper|stronger|weaker|happier|greater|longer|shorter|younger|older|richer|poorer|best|worst|biggest|smallest|easiest|hardest|fastest|highest|lowest|largest|greatest|cheapest|strongest';

const AGREEMENT_ERRORS: [RegExp, string][] = [
  [new RegExp(`${NO_AGREEMENT_CHECK_AFTER}\\b(he|she|it) (have|do|are)\\b`, 'i'), 'Subject–verb agreement'],
  [new RegExp(`${NO_AGREEMENT_CHECK_AFTER}\\b(they|we|you) (has|does|is|was)\\b`, 'i'), 'Subject–verb agreement'],
  [/\bi (has|does|is)\b/i, 'Subject–verb agreement'],
  [/\bpeople (is|was|has)\b/i, '"People" is plural'],
  [/\b(a) ([aeiou]\w+)/i, 'Use "an" before a vowel sound'],
  [/\b(an) ([bcdfgjklmnpqrstvwxyz]\w+)/i, 'Use "a" before a consonant sound'],
  [new RegExp(`\\b(more|most) (${COMPARATIVES})\\b`, 'i'), 'Double comparative'],
  [/\b(could|should|would|must|can|will) of\b/i, 'Use "have", not "of"'],
  // "had had" and "that that" can be correct.
  [/\b(?!had\b|that\b)(\w+) \1\b/i, 'Repeated word'],
];

/** "a university", "an hour" style exceptions for the article rule. */
const ARTICLE_EXCEPTIONS = /^(a (uni|use|usu|euro|one|once|user)|an (hour|honest|honou?r|heir))/i;

export function grammarIssues(text: string): Issue[] {
  const issues: Issue[] = [];
  for (const sentence of splitSentences(text)) {
    if (/^[a-z]/.test(sentence)) {
      issues.push({ message: 'Start sentences with a capital letter', excerpt: sentence.slice(0, 30) });
    }
    for (const [re, message] of AGREEMENT_ERRORS) {
      const m = sentence.match(re);
      if (!m) continue;
      if (message.startsWith('Use "') && ARTICLE_EXCEPTIONS.test(m[0])) continue;
      issues.push({ message, excerpt: m[0] });
    }
  }
  if (/\s[,.;:]/.test(text)) issues.push({ message: 'No space before punctuation', excerpt: text.match(/\s[,.;:]/)![0] });
  if (/\bi\b/.test(text)) issues.push({ message: 'Capitalise the pronoun "I"', excerpt: 'i' });
  return issues;
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Maps a 0..1 ratio onto 0..max with rounding to the nearest whole band. */
export const band = (ratio: number, max: number) => Math.round(clamp(ratio, 0, 1) * max);
