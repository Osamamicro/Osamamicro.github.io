import { useState } from 'react';
import { View } from 'react-native';

import type { HighlightCorrectSummaryItem } from '@/core';

import { AudioPrompt, ChoiceList, SubmitBar } from '../shared';
import type { RendererProps } from '../types';

/** Highlight Correct Summary: hear the recording, choose the paragraph that sums it up best. */
export function HighlightCorrectSummaryRenderer({
  item,
  mode,
  onSubmit,
  onDraft,
  result,
}: RendererProps<HighlightCorrectSummaryItem>) {
  const [selected, setSelected] = useState<string[]>([]);
  const change = (ids: string[]) => {
    setSelected(ids);
    onDraft?.({ kind: 'choice', selected: ids });
  };
  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} showTranscript={!!result} />
      <ChoiceList
        options={item.options}
        selected={selected}
        onChange={change}
        correct={result ? [item.answer] : undefined}
        disabled={!!result}
      />
      <SubmitBar
        mode={mode}
        submitted={!!result}
        disabled={selected.length === 0}
        onPress={() => onSubmit({ kind: 'choice', selected })}
      />
    </View>
  );
}
