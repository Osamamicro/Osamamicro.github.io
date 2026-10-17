# How scoring works

All scoring is in `src/core/scoring` (pure TypeScript, unit-tested, runs offline).

## Objective tasks — exact PTE rules

| Task | Rule |
| --- | --- |
| Reading/Listening MCSA, Highlight Correct Summary, Select Missing Word | 1 or 0 |
| Reading/Listening MCMA | +1 per correct option, −1 per wrong option, minimum 0 |
| Re-order Paragraphs | 1 per correctly ordered adjacent pair |
| R&W FIB, Reading FIB, Listening FIB | 1 per correct gap (case-insensitive, exact spelling) |
| Highlight Incorrect Words | +1 per correct word, −1 per wrong word, minimum 0 |
| Write from Dictation | 1 per correctly spelled word of the sentence |
| Answer Short Question | 1 if an accepted answer is said |

## Writing — trait estimates (labelled "AI ESTIMATE")

Traits and maxima mirror the PTE score guide. As in PTE, a Form (or Content) score of 0 zeroes
the other traits.

- **Form**: word-count bands (SWT one sentence 5–75; Essay 200–300; SST 50–70; Email 50–120).
- **Content**: coverage of each item's key points (keywords + simple stemming); essays also
  credit a stated position and examples — but only above the on-topic floor (25% of key
  points). Below it content is 0, so memorised templates cannot earn marks.
- **Grammar**: rule checks (agreement, articles, capitalisation, "could of", repeated words).
- **Vocabulary**: lexical diversity (moving type–token ratio) + academic-word ratio.
- **Spelling**: common learner misspellings list.
- **Development/structure/coherence, linguistic range** (essay): paragraphing, connectives,
  conclusion markers, sentence-length variety, complex structures.
- **Email conventions/organisation** (PTE Core): greeting, sign-off, register, paragraphs.

## Speaking — trait estimates

Needs a transcript (web: browser speech recognition).

- **Read Aloud / Repeat Sentence content**: word alignment with the reference (omissions,
  insertions, substitutions), RS 0–3 as in PTE.
- **Open tasks (DI, RL, SGD, RTS)**: key-point coverage with the same on-topic floor; RTS adds
  politeness/appropriacy markers once the answer is on topic.
- **Fluency**: speaking rate (110–170 wpm best), hesitations, repetitions, use of the window.
- **Pronunciation**: recogniser confidence blended with recognition rate (a proxy, not phonetics).
- No transcript (Expo Go on phones): the learner self-rates content; fluency and pronunciation
  are shown as "—" rather than invented.

## From items to a 10–90 estimate

`src/core/progress/estimate.ts`: each task type's recent performance (recency-weighted) is
combined using **Pearson's published question-type weighting** (Aug 2025) for each skill and
overall, then mapped linearly to 10–90. Coverage tells you how much of a skill's weight you have
practised. Estimates are a study guide, not an official score.
