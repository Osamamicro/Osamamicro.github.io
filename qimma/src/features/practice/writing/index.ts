import type { RendererMap } from '../types';
import { SummarizeWrittenTextRenderer } from './summarize-written-text';
import { WriteEmailRenderer } from './write-email';
import { WriteEssayRenderer } from './write-essay';

/** Writing renderers (SWT, Essay, Email). Owner: ui-reading-writing agent. */
export const writingRenderers: RendererMap = {
  'summarize-written-text': SummarizeWrittenTextRenderer,
  'write-essay': WriteEssayRenderer,
  'write-email': WriteEmailRenderer,
};
