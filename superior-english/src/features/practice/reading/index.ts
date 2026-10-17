import type { RendererMap } from '../types';
import { ReadingFillBlanksRenderer } from './reading-fill-blanks';
import { ReadingMCMARenderer } from './reading-mcma';
import { ReadingMCSARenderer } from './reading-mcsa';
import { ReorderParagraphsRenderer } from './reorder-paragraphs';
import { RWFillBlanksRenderer } from './rw-fill-blanks';

/** Reading renderers. Owner: ui-reading-writing agent. */
export const readingRenderers: RendererMap = {
  'rw-fill-blanks': RWFillBlanksRenderer,
  'reading-mcma': ReadingMCMARenderer,
  'reorder-paragraphs': ReorderParagraphsRenderer,
  'reading-fill-blanks': ReadingFillBlanksRenderer,
  'reading-mcsa': ReadingMCSARenderer,
};
