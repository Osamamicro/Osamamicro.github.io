import type { RendererMap } from '../types';
import { AnswerShortQuestionRenderer } from './answer-short-question';
import { DescribeImageRenderer } from './describe-image';
import { ReadAloudRenderer } from './read-aloud';
import { RepeatSentenceRenderer } from './repeat-sentence';
import { RespondToSituationRenderer } from './respond-to-situation';
import { RetellLectureRenderer } from './retell-lecture';
import { SummarizeGroupDiscussionRenderer } from './summarize-group-discussion';

/** Speaking renderers. Owner: ui-speaking agent. */
export const speakingRenderers: RendererMap = {
  'read-aloud': ReadAloudRenderer,
  'repeat-sentence': RepeatSentenceRenderer,
  'describe-image': DescribeImageRenderer,
  'retell-lecture': RetellLectureRenderer,
  'answer-short-question': AnswerShortQuestionRenderer,
  'summarize-group-discussion': SummarizeGroupDiscussionRenderer,
  'respond-to-situation': RespondToSituationRenderer,
};
