import { parseHiw } from '../content/audio-script';
import type { Item, Response, ScoreResult } from '../content/types';
import {
  objectiveResult,
  scoreBlanks,
  scoreDictation,
  scoreIndices,
  scoreMultipleChoice,
  scoreReorder,
  scoreSingleChoice,
} from './objective';
import { scoreOpenSpeech, scoreReferenceSpeech, scoreShortAnswer } from './speaking';
import { scoreSummarizeSpokenText, scoreSummarizeWrittenText, scoreWriteEmail, scoreWriteEssay } from './writing';

function mismatch(item: Item, response: Response): ScoreResult {
  return objectiveResult(0, 1, [`Unexpected response "${response.kind}" for ${item.type}.`]);
}

/** Scores any item/response pair. Pure and synchronous, so it runs offline on every platform. */
export function scoreItem(item: Item, response: Response): ScoreResult {
  switch (item.type) {
    case 'read-aloud':
      return response.kind === 'speech' ? scoreReferenceSpeech('read-aloud', item.text, response) : mismatch(item, response);
    case 'repeat-sentence':
      return response.kind === 'speech'
        ? scoreReferenceSpeech('repeat-sentence', item.sentence, response)
        : mismatch(item, response);
    case 'describe-image':
    case 'retell-lecture':
    case 'summarize-group-discussion':
    case 'respond-to-situation':
      return response.kind === 'speech'
        ? scoreOpenSpeech(item.type, item.keyPoints, item.modelAnswer, response)
        : mismatch(item, response);
    case 'answer-short-question':
      return response.kind === 'speech' ? scoreShortAnswer(item.answers, response) : mismatch(item, response);

    case 'summarize-written-text':
      return response.kind === 'text'
        ? scoreSummarizeWrittenText(response.text, item.keyPoints, item.modelAnswer)
        : mismatch(item, response);
    case 'write-essay':
      return response.kind === 'text' ? scoreWriteEssay(response.text, item.keyPoints, item.modelAnswer) : mismatch(item, response);
    case 'write-email':
      return response.kind === 'text'
        ? scoreWriteEmail(response.text, item.bulletPoints, item.register, item.modelAnswer)
        : mismatch(item, response);
    case 'summarize-spoken-text':
      return response.kind === 'text'
        ? scoreSummarizeSpokenText(response.text, item.keyPoints, item.modelAnswer)
        : mismatch(item, response);

    case 'rw-fill-blanks':
      return response.kind === 'blanks'
        ? scoreBlanks(
            item.blanks.map((b) => b.answer),
            response.values,
          )
        : mismatch(item, response);
    case 'reading-fill-blanks':
    case 'listening-fill-blanks':
      return response.kind === 'blanks' ? scoreBlanks(item.answers, response.values) : mismatch(item, response);

    case 'reading-mcma':
    case 'listening-mcma':
      return response.kind === 'choice'
        ? scoreMultipleChoice(item.options, item.answers, response.selected)
        : mismatch(item, response);
    case 'reading-mcsa':
    case 'listening-mcsa':
    case 'highlight-correct-summary':
    case 'select-missing-word':
      return response.kind === 'choice'
        ? scoreSingleChoice(item.options, item.answer, response.selected)
        : mismatch(item, response);

    case 'reorder-paragraphs':
      return response.kind === 'order'
        ? scoreReorder(
            item.paragraphs.map((p) => p.id),
            response.order,
          )
        : mismatch(item, response);
    case 'highlight-incorrect-words':
      return response.kind === 'indices'
        ? scoreIndices(parseHiw(item.text).incorrect, response.indices)
        : mismatch(item, response);
    case 'write-from-dictation':
      return response.kind === 'text' ? scoreDictation(item.sentence, response.text) : mismatch(item, response);
  }
}

export * from './objective';
export * from './speaking';
export * from './writing';
export { tokenize, wordCount } from './text';
