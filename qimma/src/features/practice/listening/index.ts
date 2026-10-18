import type { RendererMap } from '../types';
import { HighlightCorrectSummaryRenderer } from './highlight-correct-summary';
import { HighlightIncorrectWordsRenderer } from './highlight-incorrect-words';
import { ListeningFillBlanksRenderer } from './listening-fill-blanks';
import { ListeningMCMARenderer } from './listening-mcma';
import { ListeningMCSARenderer } from './listening-mcsa';
import { SelectMissingWordRenderer } from './select-missing-word';
import { SummarizeSpokenTextRenderer } from './summarize-spoken-text';
import { WriteFromDictationRenderer } from './write-from-dictation';

/** Listening renderers. Owner: ui-listening agent. */
export const listeningRenderers: RendererMap = {
  'summarize-spoken-text': SummarizeSpokenTextRenderer,
  'listening-mcma': ListeningMCMARenderer,
  'listening-fill-blanks': ListeningFillBlanksRenderer,
  'highlight-correct-summary': HighlightCorrectSummaryRenderer,
  'listening-mcsa': ListeningMCSARenderer,
  'select-missing-word': SelectMissingWordRenderer,
  'highlight-incorrect-words': HighlightIncorrectWordsRenderer,
  'write-from-dictation': WriteFromDictationRenderer,
};
