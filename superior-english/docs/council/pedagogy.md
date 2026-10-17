# Pedagogy council input (council-pedagogy)

Read: DECISIONS, FEATURE-MAP, SCORING, ROADMAP, `pte.ts`, `study-plan.ts`, `speaking.ts`, `writing.ts`. I did not read `text.ts` or `estimate.ts`. Statements about their helpers rely on SCORING.md and are flagged as such.

| Decision | Vote | Confidence |
| --- | --- | --- |
| D1 | (a) development build with an on-device recogniser | medium |
| D2 | (a) first milestone after v0.2, scoped to attempts and mocks | medium |
| D3 | Before expanding the bank | low |
| D4 | Image-based DI, study plan v2, SGD note grid | medium |
| D5 | Speaking proxies, keyword coverage, stock-phrase bypass | high |

## D1. Native speech scoring (ADR-004)

**Recommendation:** (a) development build with an on-device recogniser in v0.2. Defer server STT until ADR-008 and a calibration set exist.

**Confidence:** medium

**Reasons:**
- Audio stays on the device, matching ADR-003 and ADR-006, with no consent or retention burden before accounts exist.
- Phone learners see "—" for fluency and pronunciation (SCORING.md), so the Superior speaking traits cannot be measured on phones. On-device recognition works offline at no per-attempt cost. Server STT often drops the hesitations that fluency scoring needs.

**Biggest risk:** recognisers tidy speech, so new numbers look more precise than they are. **Mitigation:** have a PTE-experienced rater score about 50 phone recordings before any speaking score is shown, publish the agreement, and label results "estimate" until it passes.

## D2. Accounts and cloud sync (ADR-006)

**Recommendation:** (a), narrowed. The first milestone after v0.2 syncs attempts and mock history, which moves it ahead of ROADMAP's v0.4. Keep teacher mode out of that step.

**Confidence:** medium

**Reasons:**
- Estimates and the daily plan use per-device history. A learner who practises Speaking on a phone and Reading on a laptop gets a plan built on half their record. That hurts learning now.
- Sync need scales with learners and devices, not item count. Waiting for 1,000 items (b) or teacher mode (c) delays the fix for the people who need it most.

**Biggest risk:** auth and sync bring privacy duties and effort ahead of trustworthy scoring. **Mitigation:** ship JSON export and import first, which covers device loss cheaply. Sync only attempts and mocks, and settle audio retention before sync if D1 picks server STT.

## D3. AI scoring service before or after the bank (ADR-008)

**Recommendation:** before. Build writing scoring first, since it needs no audio and so does not depend on D1. Gate release on a human-rated calibration set. Keep authoring going, but do not chase 1,000 items until the scorer is validated.

**Confidence:** low

**Reasons:**
- Heuristics are weakest where Superior is decided: argument quality and meaning in open speaking (see D5). A bigger bank multiplies practice against feedback we already know misleads.
- Each new item is worth more with trustworthy feedback. Reviewing 1,000 items against today's scorers means reviewing them twice.

**Biggest risk:** LLM graders run lenient and vary between runs, and learners will trust a score that looks like a PTE band. **Mitigation:** calibrate on at least 100 human-rated responses before launch, pin the model version, show trait bands as ranges, and run each response three times to publish the spread.

## D4. What v0.2 adds for Superior (Speaking-weighted)

**Recommendation, in priority order:**
1. **Image-based Describe Image items with figure and trend checks**, pulled forward from v0.3 (DI is 15% overall and 31% of Speaking).
2. **Study plan v2:** rank by task-level gaps and set weekly minimums for DI, SGD and one timed essay, because the per-minute formula starves long tasks.
3. **SGD speaker note grid** with speaker-tagged key points. SGD is 19% of Speaking but gets at most one item a day.

**Confidence:** medium

**Reasons:**
- DI is practised out of format: ROADMAP puts image-based DI in v0.3.
- Cheap items crowd out long ones. Repeat Sentence (0.75 min) ranks first in my hand-check profiles, and Write Essay stays outside the top seven.

**Biggest risk:** phone speaking is content-only, so S88 can look reachable with fluency and pronunciation unmeasured. **Mitigation:** flag that in the Speaking estimate until D1 ships.

## D5. Heuristic scorers: three misleading paths

1. **Speaking proxies.** Pronunciation is 60% recogniser confidence, which measures certainty about words, not sound accuracy. Recognisers can drop fillers and output the expected word for a mispronounced one, so fluency reads high. **Mitigation:** withhold pronunciation and fluency from the Speaking estimate until calibrated against human ratings.

2. **Meaning-blind keyword coverage.** "Sales fell to 40%" matches a key point about sales rising to 40%, while valid synonyms are missed. **Mitigation:** count a key point only when its figure, direction or speaker matches within one sentence, and show the matched phrase.

3. **Stock phrases bypass the zero rule.** "I think", "for example" and "in conclusion" add up to 0.3 to essay content, and politeness words can supply a quarter of RTS appropriacy. An off-topic essay keeps content above zero, so PTE's zeroing never fires. **Mitigation:** credit position, examples and politeness only above a coverage floor, and zero content below it.

## Other findings (outside the five votes)

- Spelling is list-based (SCORING.md), so most text earns 2/2. Grammar uses issues per 100 words, so one slip zeroes a 40-word SWT's grammar but leaves a 250-word essay at 1.
- Check `splitSentences` in `text.ts` (unread). If it splits on every full stop, a valid one-sentence SWT containing "3.5%" or "U.S." fails Form and zeroes the task.
